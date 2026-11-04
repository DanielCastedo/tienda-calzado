/* ============================================================================
   Operaciones de negocio del ERP (equivalen a los endpoints de una API).
   Todas reciben (draft, payload, ctx) y modifican el borrador del estado.
   ctx = { userId, date }. Lanzan BusinessError si algo no es válido.
   ============================================================================ */
import { DEFAULT_LABOR_COST, PRODUCTION_STAGES } from '@/constants/erp'
import { BusinessError, getStockRow, moveMaterial, moveProduct, round } from './inventory'
import { nextId } from './records'

const pad = (n, size = 5) => String(n).padStart(size, '0')
const requireText = (value, label) => {
  if (!String(value ?? '').trim()) throw new BusinessError(`${label} es obligatorio`)
}
const findOrFail = (list, id, label) => {
  const item = list.find((x) => x.id === Number(id))
  if (!item) throw new BusinessError(`${label} no encontrado`)
  return item
}

/** Inserta o actualiza un registro genérico. */
function upsert(draft, collection, data, ctx) {
  if (data.id) {
    const item = findOrFail(draft[collection], data.id, 'Registro')
    Object.assign(item, data, { updatedAt: ctx.date })
    return item
  }
  const item = { ...data, id: nextId(draft, collection), createdAt: ctx.date }
  draft[collection].push(item)
  return item
}

const assertUnique = (list, field, value, id, label) => {
  const normalized = String(value).trim().toLowerCase()
  if (list.some((x) => String(x[field]).trim().toLowerCase() === normalized && x.id !== Number(id))) {
    throw new BusinessError(`Ya existe un registro con ese ${label}`)
  }
}

/* ───────────────────────────── Catálogo ───────────────────────────── */

export function saveCategory(draft, data, ctx) {
  requireText(data.name, 'El nombre')
  assertUnique(draft.categories, 'name', data.name, data.id, 'nombre')
  return upsert(draft, 'categories', { ...data, name: data.name.trim() }, ctx)
}

export function deleteCategory(draft, { id }) {
  if (draft.products.some((p) => p.categoryId === Number(id))) {
    throw new BusinessError('No se puede eliminar: hay productos en esta categoría')
  }
  draft.categories = draft.categories.filter((c) => c.id !== Number(id))
}

export function saveProduct(draft, data, ctx) {
  requireText(data.code, 'El código')
  requireText(data.name, 'El nombre')
  if (!data.categoryId) throw new BusinessError('Selecciona una categoría')
  if (!data.sizes?.length) throw new BusinessError('Agrega al menos una talla')
  if (!data.colors?.length) throw new BusinessError('Agrega al menos un color')
  if (Number(data.price) <= 0) throw new BusinessError('El precio de venta debe ser mayor a 0')
  assertUnique(draft.products, 'code', data.code, data.id, 'código')
  return upsert(
    draft,
    'products',
    {
      ...data,
      code: data.code.trim().toUpperCase(),
      categoryId: Number(data.categoryId),
      productionCost: Number(data.productionCost) || 0,
      price: Number(data.price),
      wholesalePrice: Number(data.wholesalePrice) || Number(data.price),
      sizes: [...data.sizes].map(Number).sort((a, b) => a - b),
      active: data.active ?? true,
    },
    ctx,
  )
}

export function setProductActive(draft, { productId, active }) {
  const product = findOrFail(draft.products, productId, 'Producto')
  product.active = active
  return product
}

/* ─────────────────────────── Materia prima ─────────────────────────── */

export function saveMaterial(draft, data, ctx) {
  requireText(data.code, 'El código')
  requireText(data.name, 'El nombre')
  assertUnique(draft.materials, 'code', data.code, data.id, 'código')
  const payload = {
    ...data,
    code: data.code.trim().toUpperCase(),
    minStock: Number(data.minStock) || 0,
    unitCost: Number(data.unitCost) || 0,
    supplierId: data.supplierId ? Number(data.supplierId) : null,
  }
  if (data.id) {
    delete payload.stock // el stock solo cambia con movimientos
    return upsert(draft, 'materials', payload, ctx)
  }
  const initial = Number(data.stock) || 0
  const material = upsert(draft, 'materials', { ...payload, stock: 0 }, ctx)
  if (initial > 0) {
    moveMaterial(draft, { materialId: material.id, qty: initial, type: 'entrada', reason: 'Stock inicial', unitCost: payload.unitCost, ...ctx })
  }
  return material
}

export function registerMaterialMovement(draft, { materialId, type, qty, reason, unitCost }, ctx) {
  const amount = Number(qty)
  if (!(amount > 0)) throw new BusinessError('La cantidad debe ser mayor a 0')
  requireText(reason, 'El motivo')
  moveMaterial(draft, {
    materialId: Number(materialId),
    qty: type === 'salida' ? -amount : amount,
    type,
    reason,
    unitCost: unitCost ? Number(unitCost) : undefined,
    ...ctx,
  })
}

export function adjustMaterial(draft, { materialId, newQty, reason }, ctx) {
  const material = findOrFail(draft.materials, materialId, 'Material')
  const diff = round(Number(newQty) - material.stock, 3)
  if (Number(newQty) < 0) throw new BusinessError('La cantidad no puede ser negativa')
  if (diff === 0) throw new BusinessError('La cantidad es igual al stock actual')
  requireText(reason, 'El motivo')
  moveMaterial(draft, { materialId: material.id, qty: diff, type: 'ajuste', reason, ...ctx })
}

/* ─────────────────────── Proveedores y compras ─────────────────────── */

export function saveSupplier(draft, data, ctx) {
  requireText(data.name, 'El nombre')
  return upsert(draft, 'suppliers', data, ctx)
}

export function registerPurchase(draft, { supplierId, items, paymentType, paidAmount, invoice, method }, ctx) {
  findOrFail(draft.suppliers, supplierId, 'Proveedor')
  const lines = (items ?? []).filter((i) => i.materialId && Number(i.qty) > 0)
  if (!lines.length) throw new BusinessError('Agrega al menos un material con cantidad')

  const id = nextId(draft, 'purchases')
  const number = `C-${pad(id, 4)}`
  const detail = lines.map((line) => {
    const material = findOrFail(draft.materials, line.materialId, 'Material')
    const qty = Number(line.qty)
    const unitCost = Number(line.unitCost) || material.unitCost
    moveMaterial(draft, { materialId: material.id, qty, type: 'entrada', reason: 'Compra', ref: number, unitCost, ...ctx })
    return { materialId: material.id, name: material.name, unit: material.unit, qty, unitCost, subtotal: round(qty * unitCost) }
  })
  const total = round(detail.reduce((s, l) => s + l.subtotal, 0))
  const paid = paymentType === 'credito' ? Math.min(Number(paidAmount) || 0, total) : total

  const purchase = {
    id,
    number,
    date: ctx.date,
    supplierId: Number(supplierId),
    invoice: invoice ?? '',
    items: detail,
    total,
    paymentType,
    paid,
    userId: ctx.userId,
  }
  draft.purchases.unshift(purchase)
  if (paid > 0) addPayment(draft, { kind: 'pago', refType: 'purchase', refId: id, amount: paid, method: method ?? 'efectivo' }, ctx)
  return purchase
}

export function payPurchase(draft, { purchaseId, amount, method }, ctx) {
  const purchase = findOrFail(draft.purchases, purchaseId, 'Compra')
  const value = round(Number(amount))
  const balance = round(purchase.total - purchase.paid)
  if (!(value > 0)) throw new BusinessError('El monto debe ser mayor a 0')
  if (value > balance) throw new BusinessError(`El monto supera la deuda (${balance})`)
  purchase.paid = round(purchase.paid + value)
  addPayment(draft, { kind: 'pago', refType: 'purchase', refId: purchase.id, amount: value, method }, ctx)
  return purchase
}

function addPayment(draft, payment, ctx) {
  draft.payments.unshift({ id: nextId(draft, 'payments'), date: ctx.date, userId: ctx.userId, ...payment })
}

/* ───────────────────────────── Producción ───────────────────────────── */

export function saveTechSheet(draft, { productId, materials, laborCost, notes }, ctx) {
  findOrFail(draft.products, productId, 'Producto')
  const lines = (materials ?? [])
    .filter((m) => m.materialId && Number(m.qtyPerPair) > 0)
    .map((m) => ({ materialId: Number(m.materialId), qtyPerPair: Number(m.qtyPerPair) }))
  if (!lines.length) throw new BusinessError('Agrega al menos un material a la ficha técnica')
  const existing = draft.techSheets.find((t) => t.productId === Number(productId))
  const data = { productId: Number(productId), materials: lines, laborCost: Number(laborCost) || DEFAULT_LABOR_COST, notes: notes ?? '' }
  if (existing) return Object.assign(existing, data, { updatedAt: ctx.date })
  return upsert(draft, 'techSheets', data, ctx)
}

/** Materia prima requerida para fabricar `pairs` pares de un producto. */
export function computeRequirements(state, productId, pairs) {
  const sheet = state.techSheets.find((t) => t.productId === Number(productId))
  if (!sheet) return { sheet: null, lines: [], materialCost: 0, laborCost: 0, ok: false }
  const lines = sheet.materials.map((m) => {
    const material = state.materials.find((x) => x.id === m.materialId)
    const required = round(m.qtyPerPair * pairs, 3)
    const available = material?.stock ?? 0
    return {
      materialId: m.materialId,
      code: material?.code ?? '?',
      name: material?.name ?? 'Material eliminado',
      unit: material?.unit ?? '',
      perPair: m.qtyPerPair,
      required,
      available,
      missing: round(Math.max(0, required - available), 3),
      unitCost: material?.unitCost ?? 0,
      cost: round(required * (material?.unitCost ?? 0)),
    }
  })
  return {
    sheet,
    lines,
    materialCost: round(lines.reduce((s, l) => s + l.cost, 0)),
    laborCost: round(sheet.laborCost * pairs),
    ok: lines.every((l) => l.missing === 0),
  }
}

const orderPairs = (order) => order.lines.reduce((s, l) => s + l.qty, 0)

export function createProductionOrder(draft, { productId, lines, startDate, endDate, responsibleId, notes }, ctx) {
  const product = findOrFail(draft.products, productId, 'Producto')
  const clean = (lines ?? []).filter((l) => Number(l.qty) > 0).map((l) => ({ size: Number(l.size), color: l.color, qty: Number(l.qty) }))
  if (!clean.length) throw new BusinessError('Define al menos una cantidad por talla y color')
  if (!startDate) throw new BusinessError('Indica la fecha de inicio')
  if (endDate && endDate < startDate) throw new BusinessError('La fecha de fin no puede ser anterior al inicio')
  const id = nextId(draft, 'productionOrders')
  const order = {
    id,
    number: `OP-${pad(id, 4)}`,
    productId: product.id,
    lines: clean,
    startDate,
    endDate: endDate || '',
    responsibleId: responsibleId ? Number(responsibleId) : null,
    notes: notes ?? '',
    stage: 'pendiente',
    status: 'pendiente',
    consumed: [],
    waste: [],
    materialCost: 0,
    wasteCost: 0,
    laborCost: 0,
    totalCost: 0,
    unitCost: 0,
    history: [{ date: ctx.date, stage: 'pendiente', userId: ctx.userId }],
    createdBy: ctx.userId,
    createdAt: ctx.date,
  }
  draft.productionOrders.unshift(order)
  return order
}

/** Inicia la orden: valida disponibilidad y descuenta la materia prima. */
export function startProductionOrder(draft, { orderId }, ctx) {
  const order = findOrFail(draft.productionOrders, orderId, 'Orden')
  if (order.status !== 'pendiente') throw new BusinessError('Solo se pueden iniciar órdenes pendientes')
  const req = computeRequirements(draft, order.productId, orderPairs(order))
  if (!req.sheet) throw new BusinessError('El modelo no tiene ficha técnica. Créala en "Fichas técnicas".')
  if (!req.ok) {
    const missing = req.lines.filter((l) => l.missing > 0).map((l) => `${l.name} (faltan ${l.missing} ${l.unit})`)
    throw new BusinessError(`Materia prima insuficiente: ${missing.join(', ')}`)
  }
  req.lines.forEach((line) => {
    moveMaterial(draft, {
      materialId: line.materialId,
      qty: -line.required,
      type: 'salida',
      reason: 'Consumo de producción',
      ref: order.number,
      unitCost: line.unitCost,
      ...ctx,
    })
  })
  order.consumed = req.lines.map(({ materialId, name, unit, required, unitCost, cost }) => ({ materialId, name, unit, qty: required, unitCost, cost }))
  order.materialCost = req.materialCost
  order.laborCost = req.laborCost
  order.status = 'en_proceso'
  order.stage = 'corte'
  order.history.push({ date: ctx.date, stage: 'corte', userId: ctx.userId })
  return order
}

/** Avanza a la siguiente etapa (corte → aparado → armado → acabado). */
export function advanceProductionStage(draft, { orderId }, ctx) {
  const order = findOrFail(draft.productionOrders, orderId, 'Orden')
  if (order.status !== 'en_proceso') throw new BusinessError('La orden no está en proceso')
  const ids = PRODUCTION_STAGES.map((s) => s.id)
  const next = ids[ids.indexOf(order.stage) + 1]
  if (!next || next === 'terminado') throw new BusinessError('Usa "Registrar productos terminados" para cerrar la orden')
  order.stage = next
  order.history.push({ date: ctx.date, stage: next, userId: ctx.userId })
  return order
}

export function registerWaste(draft, { orderId, materialId, qty, note }, ctx) {
  const order = findOrFail(draft.productionOrders, orderId, 'Orden')
  if (order.status !== 'en_proceso') throw new BusinessError('Solo se registran mermas en órdenes en proceso')
  const material = findOrFail(draft.materials, materialId, 'Material')
  const amount = Number(qty)
  if (!(amount > 0)) throw new BusinessError('La cantidad debe ser mayor a 0')
  moveMaterial(draft, { materialId: material.id, qty: -amount, type: 'salida', reason: 'Merma / desperdicio', ref: order.number, unitCost: material.unitCost, ...ctx })
  const cost = round(amount * material.unitCost)
  order.waste.push({ date: ctx.date, materialId: material.id, name: material.name, unit: material.unit, qty: amount, cost, note: note ?? '' })
  order.wasteCost = round(order.wasteCost + cost)
  return order
}

/** Cierra la orden: ingresa los pares al inventario y calcula el costo real. */
export function finishProductionOrder(draft, { orderId, endDate }, ctx) {
  const order = findOrFail(draft.productionOrders, orderId, 'Orden')
  if (order.status !== 'en_proceso') throw new BusinessError('La orden no está en proceso')
  const pairs = orderPairs(order)
  order.totalCost = round(order.materialCost + order.wasteCost + order.laborCost)
  order.unitCost = round(order.totalCost / pairs)
  order.lines.forEach((line) => {
    moveProduct(draft, {
      productId: order.productId,
      size: line.size,
      color: line.color,
      qty: line.qty,
      type: 'entrada',
      reason: 'Producción terminada',
      ref: order.number,
      unitCost: order.unitCost,
      ...ctx,
    })
  })
  const product = draft.products.find((p) => p.id === order.productId)
  if (product) product.lastProductionCost = order.unitCost
  order.stage = 'terminado'
  order.status = 'terminado'
  order.endDate = endDate || ctx.date.slice(0, 10)
  order.finishedAt = ctx.date
  order.history.push({ date: ctx.date, stage: 'terminado', userId: ctx.userId })
  return order
}

export function cancelProductionOrder(draft, { orderId }, ctx) {
  const order = findOrFail(draft.productionOrders, orderId, 'Orden')
  if (order.status !== 'pendiente') throw new BusinessError('Solo se pueden anular órdenes pendientes')
  order.status = 'anulado'
  order.history.push({ date: ctx.date, stage: 'anulado', userId: ctx.userId })
  return order
}

/* ───────────────────────────── Inventario ───────────────────────────── */

export function registerProductMovement(draft, { productId, size, color, type, qty, reason }, ctx) {
  const amount = Number(qty)
  if (!(amount > 0)) throw new BusinessError('La cantidad debe ser mayor a 0')
  requireText(reason, 'El motivo')
  moveProduct(draft, {
    productId: Number(productId),
    size: Number(size),
    color,
    qty: type === 'salida' ? -amount : amount,
    type,
    reason,
    ...ctx,
  })
}

export function adjustProductStock(draft, { productId, size, color, newQty, reason }, ctx) {
  const row = getStockRow(draft, Number(productId), Number(size), color)
  if (Number(newQty) < 0) throw new BusinessError('La cantidad no puede ser negativa')
  const diff = Number(newQty) - row.qty
  if (diff === 0) throw new BusinessError('La cantidad es igual al stock actual')
  requireText(reason, 'El motivo')
  moveProduct(draft, { productId: Number(productId), size: Number(size), color, qty: diff, type: 'ajuste', reason, ...ctx })
}

/* ─────────────────────────────── Ventas ─────────────────────────────── */

export function saveClient(draft, data, ctx) {
  requireText(data.name, 'El nombre')
  if (data.ci) assertUnique(draft.clients, 'ci', data.ci, data.id, 'CI/NIT')
  return upsert(draft, 'clients', data, ctx)
}

export const saleBalance = (sale) => round(Math.max(0, sale.total - sale.returnedAmount - sale.paid))

export function registerSale(draft, { clientId, items, discount, paymentMethod, paymentType, paidAmount }, ctx) {
  const lines = (items ?? []).filter((i) => Number(i.qty) > 0)
  if (!lines.length) throw new BusinessError('El carrito está vacío')
  if (paymentType === 'credito' && !clientId) throw new BusinessError('Las ventas a crédito requieren un cliente')
  if (clientId) findOrFail(draft.clients, clientId, 'Cliente')

  const id = nextId(draft, 'sales')
  const number = `V-${pad(id)}`
  const detail = lines.map((line) => {
    const product = findOrFail(draft.products, line.productId, 'Producto')
    const qty = Number(line.qty)
    const unitCost = product.lastProductionCost ?? product.productionCost
    moveProduct(draft, {
      productId: product.id,
      size: Number(line.size),
      color: line.color,
      qty: -qty,
      type: 'salida',
      reason: 'Venta',
      ref: number,
      unitCost,
      ...ctx,
    })
    const unitPrice = Number(line.unitPrice)
    return {
      productId: product.id,
      code: product.code,
      name: product.name,
      size: Number(line.size),
      color: line.color,
      qty,
      unitPrice,
      unitCost,
      subtotal: round(qty * unitPrice),
      returnedQty: 0,
    }
  })
  const subtotal = round(detail.reduce((s, l) => s + l.subtotal, 0))
  const discountValue = round(Math.min(Math.max(Number(discount) || 0, 0), subtotal))
  const total = round(subtotal - discountValue)
  const paid = paymentType === 'credito' ? Math.min(round(Number(paidAmount) || 0), total) : total

  const sale = {
    id,
    number,
    date: ctx.date,
    clientId: clientId ? Number(clientId) : null,
    items: detail,
    subtotal,
    discount: discountValue,
    total,
    cost: round(detail.reduce((s, l) => s + l.unitCost * l.qty, 0)),
    paymentMethod,
    paymentType,
    paid,
    returnedAmount: 0,
    returns: [],
    status: 'completada',
    userId: ctx.userId,
  }
  draft.sales.unshift(sale)
  if (paid > 0) addPayment(draft, { kind: 'cobro', refType: 'sale', refId: id, amount: paid, method: paymentMethod }, ctx)
  return sale
}

export function paySale(draft, { saleId, amount, method }, ctx) {
  const sale = findOrFail(draft.sales, saleId, 'Venta')
  const value = round(Number(amount))
  const balance = saleBalance(sale)
  if (!(value > 0)) throw new BusinessError('El monto debe ser mayor a 0')
  if (value > balance) throw new BusinessError(`El monto supera el saldo pendiente (${balance})`)
  sale.paid = round(sale.paid + value)
  addPayment(draft, { kind: 'cobro', refType: 'sale', refId: sale.id, amount: value, method }, ctx)
  return sale
}

/**
 * Devolución (total o parcial). Reingresa el stock y reduce el saldo;
 * si la venta ya estaba pagada, registra el reembolso.
 * @param items [{ index, qty }] índice de la línea de la venta
 */
export function registerReturn(draft, { saleId, items, reason, refundMethod }, ctx) {
  const sale = findOrFail(draft.sales, saleId, 'Venta')
  const lines = (items ?? []).filter((i) => Number(i.qty) > 0)
  if (!lines.length) throw new BusinessError('Indica las cantidades a devolver')
  requireText(reason, 'El motivo')

  const factor = sale.subtotal > 0 ? sale.total / sale.subtotal : 1 // prorratea el descuento
  let amount = 0
  const detail = lines.map(({ index, qty }) => {
    const line = sale.items[index]
    if (!line) throw new BusinessError('Línea de venta inválida')
    const value = Number(qty)
    if (value > line.qty - line.returnedQty) throw new BusinessError(`No puedes devolver más de lo vendido (${line.name})`)
    line.returnedQty += value
    moveProduct(draft, {
      productId: line.productId,
      size: line.size,
      color: line.color,
      qty: value,
      type: 'entrada',
      reason: 'Devolución de venta',
      ref: sale.number,
      unitCost: line.unitCost,
      ...ctx,
    })
    amount += value * line.unitPrice * factor
    return { name: line.name, size: line.size, color: line.color, qty: value }
  })
  amount = round(amount)

  // Lo que el cliente ya pagó por encima del nuevo total se le reembolsa.
  const newNet = round(sale.total - sale.returnedAmount - amount)
  const refund = round(Math.max(0, sale.paid - newNet))
  sale.returnedAmount = round(sale.returnedAmount + amount)
  sale.paid = round(sale.paid - refund)
  sale.returns.push({ date: ctx.date, items: detail, amount, refund, reason, userId: ctx.userId })
  sale.status = sale.items.every((l) => l.returnedQty === l.qty) ? 'devuelta' : 'devolución parcial'
  if (refund > 0) addPayment(draft, { kind: 'reembolso', refType: 'sale', refId: sale.id, amount: refund, method: refundMethod ?? 'efectivo' }, ctx)
  return sale
}

/* ───────────────────────────── Finanzas ───────────────────────────── */

export function saveFinanceEntry(draft, { id, type, category, description, amount, date, method }, ctx) {
  if (!['ingreso', 'gasto'].includes(type)) throw new BusinessError('Tipo inválido')
  requireText(category, 'La categoría')
  requireText(description, 'La descripción')
  if (!(Number(amount) > 0)) throw new BusinessError('El monto debe ser mayor a 0')
  return upsert(
    draft,
    'finance',
    { id, type, category, description, amount: round(Number(amount)), date: date || ctx.date.slice(0, 10), method: method ?? 'efectivo', userId: ctx.userId },
    ctx,
  )
}

export function deleteFinanceEntry(draft, { id }) {
  const index = draft.finance.findIndex((f) => f.id === Number(id))
  if (index < 0) throw new BusinessError('Registro no encontrado')
  draft.finance.splice(index, 1)
}

/* ──────────────────────── Usuarios y permisos ──────────────────────── */

export function saveUser(draft, data, ctx) {
  requireText(data.name, 'El nombre')
  requireText(data.email, 'El correo')
  if (!/^\S+@\S+\.\S+$/.test(data.email)) throw new BusinessError('Correo no válido')
  if (!data.role) throw new BusinessError('Selecciona un rol')
  assertUnique(draft.users, 'email', data.email, data.id, 'correo')
  const payload = { ...data, email: data.email.trim().toLowerCase() }
  if (data.id && !data.password) delete payload.password
  if (!data.id && !data.password) throw new BusinessError('Define una contraseña')
  if (data.id) {
    const admins = draft.users.filter((u) => u.role === 'admin' && u.active && u.id !== Number(data.id))
    const current = findOrFail(draft.users, data.id, 'Usuario')
    if (current.role === 'admin' && (payload.role !== 'admin' || payload.active === false) && !admins.length) {
      throw new BusinessError('Debe quedar al menos un administrador activo')
    }
  }
  return upsert(draft, 'users', { active: true, ...payload }, ctx)
}

export function setPermission(draft, { role, module, level }) {
  if (role === 'admin') throw new BusinessError('Los permisos del administrador no se pueden reducir')
  draft.permissions[role] = { ...draft.permissions[role], [module]: level }
}

export { BusinessError }
