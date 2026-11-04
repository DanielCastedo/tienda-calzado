import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, LineChart, RankingBars } from '@/components/charts'
import { Badge, Card, PageHeader, PeriodFilter, StatCard, defaultPeriod } from '@/components/ui'
import { MODULES, PRODUCTION_STAGES, ROUTES, buildRoute } from '@/constants'
import { formatCurrency, formatDate, formatNumber, formatPercent, indexById } from '@/utils'
import { useDashboard } from '../hooks/useDashboard'
import './Dashboard.css'

const stageName = Object.fromEntries(PRODUCTION_STAGES.map((s) => [s.id, s.name]))

export function DashboardView({ user, can }) {
  const [period, setPeriod] = useState(() => defaultPeriod('30d'))
  const data = useDashboard(period)
  const products = indexById(data.products)
  const users = indexById(data.users)

  const showSales = can(MODULES.SALES) || can(MODULES.FINANCE) || can(MODULES.REPORTS)
  const showFinance = can(MODULES.FINANCE)
  const showProduction = can(MODULES.PRODUCTION) || can(MODULES.REPORTS)
  const showMaterials = can(MODULES.MATERIALS) || can(MODULES.PRODUCTION)

  return (
    <>
      <PageHeader
        icon="dashboard"
        title={`Hola, ${user.name.split(' ')[0]}`}
        description="Resumen del negocio en el periodo seleccionado."
        actions={<PeriodFilter value={period} onChange={setPeriod} />}
      />

      <div className="stats-grid">
        {showSales && (
          <StatCard icon="cart" label="Total de ventas" value={formatCurrency(data.sales.revenue)} hint={`${data.sales.count} ventas · ${data.sales.pairs} pares`} />
        )}
        {showFinance && (
          <StatCard
            icon="wallet"
            tone={data.netProfit >= 0 ? 'success' : 'danger'}
            label="Ganancia estimada"
            value={formatCurrency(data.netProfit)}
            hint={`Margen bruto ${formatPercent(data.sales.margin)}`}
          />
        )}
        {showProduction && (
          <StatCard icon="factory" label="Producción terminada" value={`${formatNumber(data.producedPairs)} pares`} hint={`${data.finishedCount} órdenes cerradas`} />
        )}
        <StatCard icon="box" label="Productos disponibles" value={`${formatNumber(data.availablePairs)} pares`} hint={`${data.availableModels} modelos con stock`} />
        {showProduction && (
          <StatCard icon="clipboard" tone={data.openOrders.length ? 'warning' : 'default'} label="Órdenes pendientes" value={data.openOrders.length} hint="Pendientes y en proceso" />
        )}
        {showMaterials && (
          <StatCard icon="alert" tone={data.lowStock.length ? 'danger' : 'success'} label="Materia prima en stock bajo" value={data.lowStock.length} hint={data.lowStock.length ? 'Requiere reposición' : 'Todo en orden'} />
        )}
        {(showFinance || can(MODULES.CLIENTS)) && (
          <StatCard icon="receipt" label="Cuentas por cobrar" value={formatCurrency(data.receivable)} hint="Saldo de ventas a crédito" />
        )}
      </div>

      {showSales && (
        <div className="grid-3">
          <Card title="Ventas por día">
            <LineChart data={data.salesSeries} formatValue={formatCurrency} title="Ventas netas por día" />
          </Card>
          <Card title="Productos más vendidos" actions={<span className="text-muted">pares</span>}>
            <RankingBars
              data={data.top.map((p) => ({ label: p.name, value: p.qty, detail: formatCurrency(p.revenue) }))}
              formatValue={(v) => `${v} pares`}
            />
          </Card>
        </div>
      )}

      <div className="grid-2">
        {showSales && (
          <Card title="Ventas de los últimos 6 meses">
            <BarChart data={data.salesMonths} formatValue={formatCurrency} title="Ventas por mes" />
          </Card>
        )}
        {showProduction && (
          <Card title="Producción de los últimos 6 meses">
            <BarChart data={data.productionSeries} formatValue={(v) => `${v} pares`} title="Pares producidos por mes" />
          </Card>
        )}
      </div>

      <div className="grid-2">
        {showMaterials && (
          <Card title="Materia prima con stock bajo" actions={<Link to={ROUTES.ADMIN_MATERIALS} className="card-link">Ver todo</Link>}>
            {data.lowStock.length === 0 ? (
              <p className="text-muted">No hay alertas de stock.</p>
            ) : (
              <ul className="alert-list">
                {data.lowStock.map((m) => (
                  <li key={m.id}>
                    <span className="alert-list__name">
                      <strong>{m.name}</strong>
                      <small>{m.code}</small>
                    </span>
                    <span className="alert-list__value">
                      <span className="text-danger">{formatNumber(m.stock)} {m.unit}</span>
                      <small>mín. {formatNumber(m.minStock)}</small>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
        {showProduction && (
          <Card title="Órdenes de producción abiertas" actions={<Link to={ROUTES.ADMIN_PRODUCTION} className="card-link">Ver todo</Link>}>
            {data.openOrders.length === 0 ? (
              <p className="text-muted">No hay órdenes abiertas.</p>
            ) : (
              <ul className="alert-list">
                {data.openOrders.map((o) => (
                  <li key={o.id}>
                    <Link to={buildRoute(ROUTES.ADMIN_PRODUCTION_ORDER, { id: o.id })} className="alert-list__name">
                      <strong>{o.number} · {products.get(o.productId)?.name}</strong>
                      <small>
                        Inicio {formatDate(o.startDate)} · {users.get(o.responsibleId)?.name ?? 'Sin responsable'}
                      </small>
                    </Link>
                    <Badge tone={o.status === 'pendiente' ? 'warning' : 'info'}>{stageName[o.stage]}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>
    </>
  )
}
