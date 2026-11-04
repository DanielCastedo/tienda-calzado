/* ============================================================================
   Cálculos de negocio (solo lectura) usados por dashboard, finanzas y reportes.
   Fechas `from` / `to` en formato 'YYYY-MM-DD' (inclusive).
   ============================================================================ */
import { inRange, monthKey, toInputDate } from '@/utils/dates'
import { round } from './inventory'
import { saleBalance } from './operations'

/** Venta neta (descontando devoluciones). */
export const saleNet = (sale) => round(sale.total - sale.returnedAmount)
/** Costo de lo vendido (sin lo devuelto). */
export const saleCost = (sale) => round(sale.items.reduce((s, l) => s + (l.qty - l.returnedQty) * l.unitCost, 0))

export const salesInRange = (state, from, to) => state.sales.filter((s) => inRange(s.date, from, to))

export function salesSummary(state, from, to) {
  const sales = salesInRange(state, from, to)
  const revenue = round(sales.reduce((s, x) => s + saleNet(x), 0))
  const cost = round(sales.reduce((s, x) => s + saleCost(x), 0))
  const pairs = sales.reduce((s, x) => s + x.items.reduce((a, l) => a + l.qty - l.returnedQty, 0), 0)
  return {
    count: sales.length,
    revenue,
    cost,
    grossProfit: round(revenue - cost),
    margin: revenue ? (revenue - cost) / revenue : 0,
    pairs,
    discounts: round(sales.reduce((s, x) => s + x.discount, 0)),
    returns: round(sales.reduce((s, x) => s + x.returnedAmount, 0)),
    credit: round(sales.filter((x) => x.paymentType === 'credito').reduce((s, x) => s + saleNet(x), 0)),
    cash: round(sales.filter((x) => x.paymentType === 'contado').reduce((s, x) => s + saleNet(x), 0)),
  }
}

/** Serie diaria de ventas netas. */
export function salesByDay(state, from, to) {
  const totals = {}
  salesInRange(state, from, to).forEach((s) => {
    const day = toInputDate(s.date)
    totals[day] = (totals[day] ?? 0) + saleNet(s)
  })
  const days = []
  for (let d = new Date(`${from}T00:00:00`); toInputDate(d) <= to; d.setDate(d.getDate() + 1)) {
    const key = toInputDate(d)
    days.push({ date: key, value: round(totals[key] ?? 0) })
  }
  return days
}

/** Últimos N meses con una métrica por mes. */
export function lastMonths(n, valueFor) {
  const now = new Date()
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1)
    const key = monthKey(d)
    return { key, date: d, value: valueFor(key) }
  })
}

export const salesForMonth = (state, key) => round(state.sales.filter((s) => monthKey(s.date) === key).reduce((sum, s) => sum + saleNet(s), 0))

export const finishedOrders = (state, from, to) =>
  state.productionOrders.filter((o) => o.status === 'terminado' && inRange(o.finishedAt ?? o.endDate, from, to))

export const orderPairs = (order) => order.lines.reduce((s, l) => s + l.qty, 0)

export const productionForMonth = (state, key) =>
  state.productionOrders.filter((o) => o.status === 'terminado' && monthKey(o.finishedAt ?? o.endDate) === key).reduce((s, o) => s + orderPairs(o), 0)

/** Ranking de productos por pares vendidos. */
export function topProducts(state, from, to, limit = 5) {
  const map = new Map()
  salesInRange(state, from, to).forEach((sale) => {
    sale.items.forEach((l) => {
      const qty = l.qty - l.returnedQty
      if (!qty) return
      const item = map.get(l.productId) ?? { productId: l.productId, name: l.name, code: l.code, qty: 0, revenue: 0, cost: 0 }
      const factor = sale.subtotal ? sale.total / sale.subtotal : 1
      item.qty += qty
      item.revenue += qty * l.unitPrice * factor
      item.cost += qty * l.unitCost
      map.set(l.productId, item)
    })
  })
  return [...map.values()]
    .map((x) => ({ ...x, revenue: round(x.revenue), profit: round(x.revenue - x.cost) }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit)
}

/** Ventas agrupadas por talla y color. */
export function salesBySizeColor(state, from, to) {
  const map = new Map()
  salesInRange(state, from, to).forEach((sale) =>
    sale.items.forEach((l) => {
      const qty = l.qty - l.returnedQty
      if (!qty) return
      const key = `${l.size}|${l.color}`
      const row = map.get(key) ?? { size: l.size, color: l.color, qty: 0, revenue: 0 }
      row.qty += qty
      row.revenue = round(row.revenue + qty * l.unitPrice)
      map.set(key, row)
    }),
  )
  return [...map.values()].sort((a, b) => a.size - b.size || a.color.localeCompare(b.color))
}

export const lowStockMaterials = (state) => state.materials.filter((m) => m.stock <= m.minStock)

/** Stock de producto terminado agrupado por modelo. */
export function productStock(state) {
  return state.products.map((p) => {
    const rows = state.stock.filter((s) => s.productId === p.id)
    const qty = rows.reduce((s, r) => s + r.qty, 0)
    return { product: p, rows, qty, value: round(qty * (p.lastProductionCost ?? p.productionCost)) }
  })
}

export function receivables(state) {
  return state.sales.filter((s) => saleBalance(s) > 0).map((s) => ({ sale: s, balance: saleBalance(s) }))
}

export function payables(state) {
  return state.purchases.filter((p) => p.total - p.paid > 0.009).map((p) => ({ purchase: p, balance: round(p.total - p.paid) }))
}

/** Estado de resultados del periodo. */
export function incomeStatement(state, from, to) {
  const sales = salesSummary(state, from, to)
  const entries = state.finance.filter((f) => inRange(f.date, from, to))
  const otherIncome = round(entries.filter((f) => f.type === 'ingreso').reduce((s, f) => s + f.amount, 0))
  const expenses = round(entries.filter((f) => f.type === 'gasto').reduce((s, f) => s + f.amount, 0))
  const expensesByCategory = {}
  entries.filter((f) => f.type === 'gasto').forEach((f) => (expensesByCategory[f.category] = round((expensesByCategory[f.category] ?? 0) + f.amount)))
  const orders = finishedOrders(state, from, to)
  const productionCost = round(orders.reduce((s, o) => s + o.totalCost, 0))
  const purchases = round(state.purchases.filter((p) => inRange(p.date, from, to)).reduce((s, p) => s + p.total, 0))
  const collected = round(state.payments.filter((p) => p.kind === 'cobro' && inRange(p.date, from, to)).reduce((s, p) => s + p.amount, 0))
  const refunded = round(state.payments.filter((p) => p.kind === 'reembolso' && inRange(p.date, from, to)).reduce((s, p) => s + p.amount, 0))
  const paidToSuppliers = round(state.payments.filter((p) => p.kind === 'pago' && inRange(p.date, from, to)).reduce((s, p) => s + p.amount, 0))
  const netProfit = round(sales.grossProfit + otherIncome - expenses)
  return {
    sales,
    otherIncome,
    expenses,
    expensesByCategory,
    productionCost,
    producedPairs: orders.reduce((s, o) => s + orderPairs(o), 0),
    purchases,
    netProfit,
    netMargin: sales.revenue + otherIncome ? netProfit / (sales.revenue + otherIncome) : 0,
    cashIn: round(collected - refunded + otherIncome),
    cashOut: round(paidToSuppliers + expenses),
  }
}

/** Consumo de materia prima (producción + mermas) en el periodo. */
export function materialConsumption(state, from, to) {
  const map = new Map()
  state.movements
    .filter((m) => m.itemType === 'material' && m.type === 'salida' && inRange(m.date, from, to))
    .forEach((m) => {
      const material = state.materials.find((x) => x.id === m.itemId)
      const row = map.get(m.itemId) ?? { materialId: m.itemId, code: material?.code, name: material?.name, unit: material?.unit, production: 0, waste: 0, other: 0, cost: 0 }
      const qty = -m.qty
      if (m.reason === 'Consumo de producción') row.production += qty
      else if (m.reason.startsWith('Merma')) row.waste += qty
      else row.other += qty
      row.cost += qty * m.unitCost
      map.set(m.itemId, row)
    })
  return [...map.values()].map((r) => ({ ...r, production: round(r.production, 3), waste: round(r.waste, 3), other: round(r.other, 3), total: round(r.production + r.waste + r.other, 3), cost: round(r.cost) }))
}
