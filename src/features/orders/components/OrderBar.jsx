import { Link } from 'react-router-dom'
import { Button, Icon } from '@/components/ui'
import { ROUTES } from '@/constants'
import { formatCurrency } from '@/utils'
import { useOrder } from '../hooks/orderContext'
import './Orders.css'

/** Barra flotante con el resumen del pedido (se muestra en el catálogo). */
export function OrderBar() {
  const { summary } = useOrder()
  if (summary.totalPairs === 0) return null

  return (
    <div className="order-bar" role="region" aria-label="Resumen del pedido">
      <span className="order-bar__info">
        <Icon name="bag" size={20} />
        <strong>{summary.totalPairs}</strong> {summary.totalPairs === 1 ? 'par' : 'pares'}
        <span className="order-bar__sep" aria-hidden="true">·</span>
        <strong>{formatCurrency(summary.total)}</strong>
      </span>
      <Button as={Link} to={ROUTES.ORDERS} size="sm" icon={<Icon name="arrow" />}>
        VER PEDIDO
      </Button>
    </div>
  )
}
