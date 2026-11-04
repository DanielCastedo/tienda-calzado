/* ============================================================================
   Datos de demostración.
   Se generan ejecutando las operaciones reales día por día (últimos 120 días),
   por eso stock, kardex, costos, cuentas por cobrar/pagar y finanzas cuadran.
   ============================================================================ */
import { DEFAULT_PERMISSIONS } from '@/constants/erp'
import { categorias, productos } from '@/content/productos'
import * as ops from './operations'
import { audit } from './records'

const DAYS = 120

function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const DEMO_PASSWORD = 'demo123'

export const DEMO_USERS = [
  { id: 1, name: 'Ana Quispe', email: 'admin@andino.bo', role: 'admin' },
  { id: 2, name: 'Jorge Flores', email: 'gerente@andino.bo', role: 'gerente' },
  { id: 3, name: 'Luis Choque', email: 'produccion@andino.bo', role: 'produccion' },
  { id: 4, name: 'Rosa Condori', email: 'almacen@andino.bo', role: 'almacen' },
  { id: 5, name: 'Marco Rojas', email: 'ventas@andino.bo', role: 'vendedor' },
]

const emptyDb = () => ({
  version: 1,
  seq: {},
  users: [],
  permissions: structuredClone(DEFAULT_PERMISSIONS),
  categories: [],
  products: [],
  stock: [],
  materials: [],
  movements: [],
  suppliers: [],
  purchases: [],
  payments: [],
  techSheets: [],
  productionOrders: [],
  clients: [],
  sales: [],
  finance: [],
  audit: [],
})

// [código, nombre, categoría, unidad, stock mínimo, costo unitario, stock inicial, proveedor]
const MATERIALS = [
  ['MP-001', 'Cuero vacuno negro', 'cuero', 'pie2', 80, 18, 650, 1],
  ['MP-002', 'Cuero vacuno café', 'cuero', 'pie2', 80, 18, 600, 1],
  ['MP-003', 'Cuero graso miel', 'cuero', 'pie2', 50, 22, 60, 1],
  ['MP-004', 'Badana para forro', 'tela', 'pie2', 60, 6, 520, 5],
  ['MP-005', 'Lona escolar', 'tela', 'm', 20, 25, 90, 5],
  ['MP-006', 'Suela de goma', 'suelas', 'par', 60, 28, 320, 2],
  ['MP-007', 'Suela de cuero', 'suelas', 'par', 30, 45, 140, 2],
  ['MP-008', 'Suela para bota', 'suelas', 'par', 20, 38, 90, 2],
  ['MP-009', 'Plantilla anatómica', 'plantillas', 'par', 60, 8, 380, 3],
  ['MP-010', 'Cordón encerado 80 cm', 'cordones', 'par', 80, 2.5, 420, 3],
  ['MP-011', 'Pegamento PU', 'pegamento', 'lt', 10, 65, 32, 4],
  ['MP-012', 'Hilo de nylon', 'hilos', 'cono', 8, 30, 26, 3],
  ['MP-013', 'Ojalillos metálicos', 'accesorios', 'und', 500, 0.2, 3200, 3],
  ['MP-014', 'Contrafuerte', 'otros', 'par', 60, 3, 300, 3],
  ['MP-015', 'Puntera termoplástica', 'otros', 'par', 60, 2.5, 40, 3],
  ['MP-016', 'Cierre metálico 20 cm', 'accesorios', 'und', 40, 6, 45, 3],
]
const LOW_STOCK_CODES = ['MP-003', 'MP-015', 'MP-016'] // no se reponen: quedan con alerta

const SUPPLIERS = [
  { name: 'Curtiembre El Alto', nit: '1023456019', contact: 'Pedro Mamani', phone: '+591 71234567', email: 'ventas@curtiembrealto.bo', address: 'Av. 6 de Marzo, El Alto' },
  { name: 'Suelas Bolivia SRL', nit: '2034567012', contact: 'María Vargas', phone: '+591 72345678', email: 'pedidos@suelasbolivia.bo', address: 'Zona Industrial, Cochabamba' },
  { name: 'Insumos Zapateros La Paz', nit: '3045678015', contact: 'Juan Ticona', phone: '+591 73456789', email: 'insumos@zapateroslp.bo', address: 'Calle Max Paredes 820, La Paz' },
  { name: 'Química Andina', nit: '4056789018', contact: 'Elena Cruz', phone: '+591 74567890', email: 'contacto@quimicaandina.bo', address: 'Parque Industrial, Santa Cruz' },
  { name: 'Textiles Illimani', nit: '5067890011', contact: 'Raúl Gutiérrez', phone: '+591 75678901', email: 'ventas@textilesillimani.bo', address: 'Av. Buenos Aires 1450, La Paz' },
]

const CLIENTS = [
  { name: 'Calzados Don Pepe', ci: '4567890', phone: '+591 76543210', email: 'donpepe@gmail.com', address: 'Mercado Rodríguez, La Paz', type: 'mayorista' },
  { name: 'Tienda Sajama', ci: '6789012', phone: '+591 77654321', email: 'tiendasajama@gmail.com', address: 'Av. Blanco Galindo km 3, Cochabamba', type: 'mayorista' },
  { name: 'Boutique El Prado', ci: '7890123', phone: '+591 78765432', email: 'elprado@hotmail.com', address: 'El Prado 1120, La Paz', type: 'mayorista' },
  { name: 'Carmen Apaza', ci: '8901234', phone: '+591 79876543', email: '', address: 'Villa Fátima, La Paz', type: 'minorista' },
  { name: 'Roberto Salinas', ci: '9012345', phone: '+591 70987654', email: 'rsalinas@gmail.com', address: 'Sopocachi, La Paz', type: 'minorista' },
  { name: 'Lucía Fernández', ci: '1234567', phone: '+591 71098765', email: 'lucia.f@gmail.com', address: 'Equipetrol, Santa Cruz', type: 'minorista' },
  { name: 'Unidad Educativa San Andrés', ci: '1002003004', phone: '+591 22456789', email: 'administracion@ue-sanandres.edu.bo', address: 'Miraflores, La Paz', type: 'mayorista' },
  { name: 'Diego Mendoza', ci: '2345678', phone: '+591 72109876', email: '', address: 'Cala Cala, Cochabamba', type: 'minorista' },
]

// Productos extra además de los de content/productos.js
const EXTRA_PRODUCTS = [
  { nombre: 'Sandalia Andina', marca: 'Andino', categoria: 'sandalias', precio: 219, precioMayorista: 185, tallas: [35, 36, 37, 38, 39, 40], imagen: '/images/zapato-hero.png', descripcion: 'Sandalia de cuero graso con suela de goma flexible.' },
  { nombre: 'Zapatilla Urbana', marca: 'Andino', categoria: 'deportivo', precio: 329, precioMayorista: 280, tallas: [37, 38, 39, 40, 41, 42, 43], imagen: '/images/zapato-hero.png', descripcion: 'Zapatilla de lona y cuero para uso diario.' },
]

const COLORS_BY_CATEGORY = {
  formal: ['Negro', 'Café'],
  casual: ['Café', 'Miel'],
  botas: ['Café', 'Negro'],
  escolar: ['Negro'],
  deportivo: ['Negro', 'Azul'],
  sandalias: ['Miel', 'Café'],
}

// Ficha técnica por categoría: [código de material, cantidad por par]
const SHEETS = {
  formal: [['MP-001', 2.2], ['MP-004', 1.5], ['MP-007', 1], ['MP-009', 1], ['MP-010', 1], ['MP-011', 0.05], ['MP-012', 0.02], ['MP-013', 12], ['MP-014', 1]],
  casual: [['MP-002', 2], ['MP-004', 1.4], ['MP-006', 1], ['MP-009', 1], ['MP-011', 0.05], ['MP-012', 0.02], ['MP-014', 1]],
  botas: [['MP-002', 3.2], ['MP-004', 2.2], ['MP-008', 1], ['MP-009', 1], ['MP-016', 1], ['MP-011', 0.07], ['MP-012', 0.03], ['MP-014', 1]],
  escolar: [['MP-001', 1.9], ['MP-004', 1.3], ['MP-006', 1], ['MP-009', 1], ['MP-010', 1], ['MP-011', 0.05], ['MP-012', 0.02], ['MP-013', 10]],
  deportivo: [['MP-005', 0.4], ['MP-001', 0.8], ['MP-006', 1], ['MP-009', 1], ['MP-010', 1], ['MP-011', 0.04], ['MP-012', 0.02], ['MP-013', 14]],
  sandalias: [['MP-003', 1.2], ['MP-006', 1], ['MP-011', 0.03], ['MP-012', 0.01]],
}

export function createSeed() {
  const db = emptyDb()
  const rand = mulberry32(20241104)
  const pick = (list) => list[Math.floor(rand() * list.length)]
  const int = (min, max) => min + Math.floor(rand() * (max - min + 1))
  const now = new Date()

  const dateAt = (dayOffset, hour = 10) => {
    const d = new Date(now)
    d.setDate(d.getDate() + dayOffset)
    d.setHours(hour, int(0, 59), 0, 0)
    return d.toISOString()
  }
  const dayStr = (dayOffset) => dateAt(dayOffset).slice(0, 10)

  /** Ejecuta una operación y la registra en la bitácora. */
  const run = (op, payload, userId, date, log) => {
    const result = op(db, payload, { userId, date })
    if (log) audit(db, { ...(typeof log === 'function' ? log(result) : log), userId, date })
    return result
  }
  const safe = (fn) => {
    try {
      return fn()
    } catch {
      return null
    }
  }

  const start = dateAt(-DAYS, 8)

  /* ---------- Usuarios ---------- */
  DEMO_USERS.forEach((u) => db.users.push({ ...u, password: DEMO_PASSWORD, active: true, createdAt: start }))
  db.seq.users = DEMO_USERS.length

  /* ---------- Categorías y productos ---------- */
  const categoryIds = {}
  ;[...categorias, { id: 'sandalias', nombre: 'Sandalias' }].forEach((c) => {
    categoryIds[c.id] = run(ops.saveCategory, { name: c.nombre }, 1, start).id
  })

  const slugById = {}
  ;[...productos, ...EXTRA_PRODUCTS].forEach((p, i) => {
    const product = run(
      ops.saveProduct,
      {
        code: `AND-${String(i + 1).padStart(3, '0')}`,
        name: p.nombre,
        brand: p.marca,
        categoryId: categoryIds[p.categoria],
        description: p.descripcion,
        image: p.imagen,
        sizes: p.tallas,
        colors: COLORS_BY_CATEGORY[p.categoria] ?? ['Negro'],
        productionCost: Math.round(p.precio * 0.45),
        price: p.precio,
        wholesalePrice: p.precioMayorista,
        active: true,
      },
      1,
      start,
    )
    slugById[product.id] = p.categoria
  })

  /* ---------- Proveedores, materiales y clientes ---------- */
  SUPPLIERS.forEach((s) => run(ops.saveSupplier, s, 4, start))
  const materialIds = {}
  MATERIALS.forEach(([code, name, categoryId, unit, minStock, unitCost, stock, supplierId]) => {
    materialIds[code] = run(ops.saveMaterial, { code, name, categoryId, unit, minStock, unitCost, stock, supplierId }, 4, start).id
  })
  db.movements.forEach((m) => (m.reason = 'Inventario inicial'))
  CLIENTS.forEach((c) => run(ops.saveClient, c, 5, start))

  /* ---------- Fichas técnicas ---------- */
  db.products.forEach((p) => {
    const slug = slugById[p.id]
    run(
      ops.saveTechSheet,
      {
        productId: p.id,
        materials: SHEETS[slug].map(([code, qtyPerPair]) => ({ materialId: materialIds[code], qtyPerPair })),
        laborCost: slug === 'botas' ? 55 : slug === 'sandalias' ? 25 : 40,
        notes: 'Ficha estándar del modelo.',
      },
      3,
      start,
    )
  })
  // El Oxford usa puntera termoplástica (queda con stock bajo)
  const oxford = db.products.find((p) => p.name.includes('Oxford'))
  db.techSheets.find((t) => t.productId === oxford.id).materials.push({ materialId: materialIds['MP-015'], qtyPerPair: 1 })

  /* ---------- Inventario inicial de productos ---------- */
  db.products.forEach((p) => {
    if (p.name.includes('Mocasín')) return // queda agotado en la demo
    p.colors.forEach((color) => {
      p.sizes.forEach((size) => {
        const qty = int(2, 7)
        ops.registerProductMovement(db, { productId: p.id, size, color, type: 'entrada', qty, reason: 'Inventario inicial' }, { userId: 4, date: start })
      })
    })
  })

  /* ---------- Línea de tiempo ---------- */
  const restockable = MATERIALS.filter(([code]) => !LOW_STOCK_CODES.includes(code))
  const pendingCredit = [] // { saleId, payDay }
  const pendingPurchases = []
  const productionPlan = {
    [-112]: { product: 'Derby' }, [-98]: { product: 'Escolar' }, [-84]: { product: 'Bota' },
    [-70]: { product: 'Casual' }, [-56]: { product: 'Oxford' }, [-42]: { product: 'Zapatilla' },
    [-28]: { product: 'Sandalia' }, [-16]: { product: 'Derby' }, [-6]: { product: 'Escolar', keepOpen: 'aparado' },
    [-2]: { product: 'Casual', keepOpen: 'corte' },
  }
  const openOrders = []

  for (let day = -DAYS + 1; day <= 0; day++) {
    const date = new Date(now)
    date.setDate(date.getDate() + day)
    const dom = date.getDate()

    // Compras de materia prima cada ~12 días
    if ((day + DAYS) % 12 === 3) {
      const supplierId = int(1, 5)
      let candidates = restockable.filter((m) => m[7] === supplierId)
      if (!candidates.length) candidates = restockable
      const items = candidates.slice(0, 3).map(([code, , , , , unitCost]) => ({
        materialId: materialIds[code],
        qty: code === 'MP-013' ? 1500 : code.startsWith('MP-00') ? int(60, 160) : int(10, 40),
        unitCost: Math.round(unitCost * (0.95 + rand() * 0.15) * 100) / 100,
      }))
      const credit = rand() < 0.35
      const purchase = safe(() =>
        run(ops.registerPurchase, { supplierId, items, paymentType: credit ? 'credito' : 'contado', paidAmount: 0, method: 'transferencia', invoice: `F-${int(1000, 9999)}` }, 4, dateAt(day, 9), (r) => ({ module: 'proveedores', action: 'Registró compra', detail: `${r.number} por Bs ${r.total}` })),
      )
      if (purchase && credit) pendingPurchases.push({ id: purchase.id, payDay: day + int(10, 25) })
    }
    pendingPurchases
      .filter((p) => p.payDay === day)
      .forEach((p) => {
        const purchase = db.purchases.find((x) => x.id === p.id)
        const balance = purchase.total - purchase.paid
        if (balance > 0) safe(() => run(ops.payPurchase, { purchaseId: p.id, amount: Math.round(balance * (rand() < 0.5 ? 1 : 0.5)), method: 'transferencia' }, 2, dateAt(day, 15)))
      })

    // Órdenes de producción
    const plan = productionPlan[day]
    if (plan) {
      const product = db.products.find((p) => p.name.includes(plan.product))
      const lines = []
      product.colors.forEach((color) => product.sizes.slice(1, 5).forEach((size) => lines.push({ size, color, qty: int(2, 4) })))
      const order = run(ops.createProductionOrder, { productId: product.id, lines, startDate: dayStr(day), endDate: dayStr(day + 6), responsibleId: 3, notes: '' }, 3, dateAt(day, 8), (r) => ({ module: 'produccion', action: 'Creó orden de producción', detail: r.number }))
      const started = safe(() => run(ops.startProductionOrder, { orderId: order.id }, 3, dateAt(day, 9), { module: 'produccion', action: 'Inició orden', detail: order.number }))
      if (started) openOrders.push({ id: order.id, startDay: day, keepOpen: plan.keepOpen })
    }
    openOrders.forEach((o) => {
      const order = db.productionOrders.find((x) => x.id === o.id)
      if (order.status !== 'en_proceso') return
      const elapsed = day - o.startDay
      if (o.keepOpen && order.stage === o.keepOpen) return
      if (elapsed >= 1 && elapsed <= 4) safe(() => run(ops.advanceProductionStage, { orderId: o.id }, 3, dateAt(day, 17)))
      if (elapsed === 2 && rand() < 0.6) {
        const sheet = db.techSheets.find((t) => t.productId === order.productId)
        safe(() => run(ops.registerWaste, { orderId: o.id, materialId: sheet.materials[0].materialId, qty: Math.round((1 + rand() * 3) * 10) / 10, note: 'Recortes defectuosos' }, 3, dateAt(day, 12)))
      }
      if (elapsed === 5 && !o.keepOpen) {
        safe(() => run(ops.finishProductionOrder, { orderId: o.id, endDate: dayStr(day) }, 3, dateAt(day, 18), { module: 'produccion', action: 'Registró productos terminados', detail: order.number }))
      }
    })

    // Ventas del día
    const salesToday = dom % 7 === 0 ? int(0, 1) : int(0, 3)
    for (let s = 0; s < salesToday; s++) {
      const available = db.stock.filter((r) => r.qty > 0)
      if (!available.length) break
      const items = []
      const lineCount = int(1, rand() < 0.2 ? 4 : 2)
      for (let l = 0; l < lineCount; l++) {
        const row = pick(available)
        if (items.some((i) => i.productId === row.productId && i.size === row.size && i.color === row.color)) continue
        const product = db.products.find((p) => p.id === row.productId)
        const qty = Math.min(row.qty, rand() < 0.15 ? int(2, 4) : 1)
        items.push({ productId: row.productId, size: row.size, color: row.color, qty, unitPrice: qty >= 3 ? product.wholesalePrice : product.price })
      }
      const withClient = rand() < 0.45
      const client = withClient ? pick(db.clients) : null
      const credit = client && client.type === 'mayorista' && rand() < 0.4
      const subtotal = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0)
      const sale = safe(() =>
        run(
          ops.registerSale,
          {
            clientId: client?.id ?? null,
            items,
            discount: rand() < 0.12 ? Math.round(subtotal * 0.05) : 0,
            paymentMethod: pick(['efectivo', 'efectivo', 'qr', 'transferencia', 'tarjeta']),
            paymentType: credit ? 'credito' : 'contado',
            paidAmount: credit ? Math.round(subtotal * 0.3) : 0,
          },
          rand() < 0.75 ? 5 : 1,
          dateAt(day, int(9, 19)),
          (r) => ({ module: 'ventas', action: 'Registró venta', detail: `${r.number} por Bs ${r.total}` }),
        ),
      )
      if (sale && credit) pendingCredit.push({ saleId: sale.id, payDay: day + int(7, 30) })
    }
    pendingCredit
      .filter((c) => c.payDay === day)
      .forEach((c) => {
        const sale = db.sales.find((x) => x.id === c.saleId)
        const balance = ops.saleBalance(sale)
        if (balance > 0 && rand() < 0.75) {
          safe(() => run(ops.paySale, { saleId: sale.id, amount: Math.round(balance * (rand() < 0.5 ? 1 : 0.5)), method: 'qr' }, 5, dateAt(day, 16), { module: 'clientes', action: 'Registró cobro', detail: sale.number }))
        }
      })

    // Devoluciones de ejemplo
    if (day === -60 || day === -9) {
      const sale = db.sales.find((x) => x.status === 'completada' && x.paymentType === 'contado' && x.items.length >= 1)
      if (sale) safe(() => run(ops.registerReturn, { saleId: sale.id, items: [{ index: 0, qty: 1 }], reason: 'Talla incorrecta', refundMethod: 'efectivo' }, 5, dateAt(day, 11), { module: 'ventas', action: 'Registró devolución', detail: sale.number }))
    }

    // Gastos operativos e ingresos
    const finance = (type, category, description, amount) =>
      run(ops.saveFinanceEntry, { type, category, description, amount, date: dayStr(day), method: 'transferencia' }, 2, dateAt(day, 12))
    if (dom === 1) finance('gasto', 'Alquiler', 'Alquiler del taller y tienda', 3200)
    if (dom === 5) finance('gasto', 'Sueldos', 'Planilla de sueldos del personal', 9800)
    if (dom === 10) finance('gasto', 'Servicios básicos', 'Luz, agua e internet', int(420, 560))
    if (dom === 15) finance('gasto', 'Transporte', 'Envíos por encomienda', int(250, 480))
    if (dom === 20 && rand() < 0.6) finance('gasto', 'Mantenimiento', 'Mantenimiento de máquinas de costura', int(300, 700))
    if (dom === 25) finance('gasto', 'Publicidad', 'Publicidad en redes sociales', int(200, 400))
    if (day % 6 === 0) finance('ingreso', 'Reparaciones', 'Servicio de reparación y arreglos', int(120, 380))
  }

  // Dos órdenes pendientes a futuro
  ;['Bota', 'Oxford'].forEach((name, i) => {
    const product = db.products.find((p) => p.name.includes(name))
    const lines = product.colors.slice(0, 1).flatMap((color) => product.sizes.slice(0, 4).map((size) => ({ size, color, qty: 3 })))
    run(ops.createProductionOrder, { productId: product.id, lines, startDate: dayStr(2 + i * 3), endDate: dayStr(8 + i * 3), responsibleId: 3, notes: 'Programada' }, 2, dateAt(0, 8), (r) => ({ module: 'produccion', action: 'Creó orden de producción', detail: r.number }))
  })

  return db
}
