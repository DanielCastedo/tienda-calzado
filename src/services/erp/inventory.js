/* Movimientos de inventario (kardex) para materia prima y productos terminados. */

export class BusinessError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BusinessError'
  }
}

const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d

function pushMovement(draft, movement) {
  draft.movements.unshift({ id: (draft.seq.movements = (draft.seq.movements ?? 0) + 1), ...movement })
}

/**
 * Entrada (+) o salida (-) de materia prima. Actualiza costo promedio en entradas.
 * @param {{ materialId, qty, type: 'entrada'|'salida'|'ajuste', reason, ref?, unitCost?, date, userId }} m
 */
export function moveMaterial(draft, { materialId, qty, type, reason, ref, unitCost, date, userId }) {
  const material = draft.materials.find((x) => x.id === materialId)
  if (!material) throw new BusinessError('Material no encontrado')
  const newStock = round(material.stock + qty, 3)
  if (newStock < 0) {
    throw new BusinessError(`Stock insuficiente de "${material.name}" (disponible: ${material.stock} ${material.unit})`)
  }
  if (qty > 0 && unitCost != null && type === 'entrada') {
    // Costo promedio ponderado
    const totalValue = material.stock * material.unitCost + qty * unitCost
    material.unitCost = newStock > 0 ? round(totalValue / newStock) : unitCost
  }
  material.stock = newStock
  pushMovement(draft, {
    date,
    itemType: 'material',
    itemId: materialId,
    type,
    reason,
    ref: ref ?? '',
    qty: round(qty, 3),
    balance: newStock,
    unitCost: unitCost ?? material.unitCost,
    userId,
  })
}

/** Busca (o crea) la fila de stock de un producto por talla y color. */
export function getStockRow(draft, productId, size, color) {
  let row = draft.stock.find((s) => s.productId === productId && s.size === size && s.color === color)
  if (!row) {
    row = { id: (draft.seq.stock = (draft.seq.stock ?? 0) + 1), productId, size, color, qty: 0 }
    draft.stock.push(row)
  }
  return row
}

/** Entrada (+) o salida (-) de producto terminado por talla y color. */
export function moveProduct(draft, { productId, size, color, qty, type, reason, ref, unitCost, date, userId }) {
  const product = draft.products.find((p) => p.id === productId)
  if (!product) throw new BusinessError('Producto no encontrado')
  const row = getStockRow(draft, productId, size, color)
  const newQty = row.qty + qty
  if (newQty < 0) {
    throw new BusinessError(`Stock insuficiente de ${product.name} T${size} ${color} (disponible: ${row.qty})`)
  }
  row.qty = newQty
  pushMovement(draft, {
    date,
    itemType: 'product',
    itemId: productId,
    size,
    color,
    type,
    reason,
    ref: ref ?? '',
    qty,
    balance: newQty,
    unitCost: unitCost ?? product.productionCost,
    userId,
  })
}

export const productStockTotal = (state, productId) =>
  state.stock.filter((s) => s.productId === productId).reduce((sum, s) => sum + s.qty, 0)

export { round }
