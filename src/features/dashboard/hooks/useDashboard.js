import { useMemo } from 'react'
import { useErp } from '@/hooks'
import { analytics } from '@/services/erp'
import { formatMonth, toDate } from '@/utils'

const dayLabel = (date) => {
  const d = toDate(date)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

/** Indicadores del dashboard para un periodo. */
export function useDashboard({ from, to }) {
  const state = useErp()

  return useMemo(() => {
    const sales = analytics.salesSummary(state, from, to)
    const statement = analytics.incomeStatement(state, from, to)
    const finished = analytics.finishedOrders(state, from, to)
    const stock = analytics.productStock(state)
    const activeProducts = stock.filter((s) => s.product.active)
    const openOrders = state.productionOrders.filter((o) => o.status === 'pendiente' || o.status === 'en_proceso')

    return {
      sales,
      netProfit: statement.netProfit,
      producedPairs: finished.reduce((s, o) => s + analytics.orderPairs(o), 0),
      finishedCount: finished.length,
      availablePairs: activeProducts.reduce((s, p) => s + p.qty, 0),
      availableModels: activeProducts.filter((p) => p.qty > 0).length,
      outOfStock: activeProducts.filter((p) => p.qty === 0),
      openOrders,
      lowStock: analytics.lowStockMaterials(state),
      receivable: analytics.receivables(state).reduce((s, r) => s + r.balance, 0),
      salesSeries: analytics.salesByDay(state, from, to).map((d) => ({ label: dayLabel(d.date), value: d.value })),
      productionSeries: analytics.lastMonths(6, (key) => analytics.productionForMonth(state, key)).map((m) => ({ label: formatMonth(m.date), value: m.value })),
      salesMonths: analytics.lastMonths(6, (key) => analytics.salesForMonth(state, key)).map((m) => ({ label: formatMonth(m.date), value: m.value })),
      top: analytics.topProducts(state, from, to, 5),
      products: state.products,
      users: state.users,
    }
  }, [state, from, to])
}
