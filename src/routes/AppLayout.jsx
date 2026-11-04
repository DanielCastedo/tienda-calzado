import { MainLayout } from '@/components/layout'
import { ROUTES } from '@/constants'
import { sitio } from '@/content'
import { useOrder } from '@/features/orders'
import { ProductSearch } from '@/features/products'

const renderHeaderSearch = ({ inMenu, onDone }) => (
  <ProductSearch
    placeholder={sitio.buscadorPlaceholder}
    variant={inMenu ? 'inline' : 'popover'}
    onNavigate={onDone}
  />
)

/** Conecta el layout global con las features (contador del pedido y buscador de productos). */
export function AppLayout() {
  const { summary } = useOrder()

  return (
    <MainLayout
      headerBadges={{ [ROUTES.ORDERS]: summary.totalPairs }}
      renderHeaderSearch={renderHeaderSearch}
    />
  )
}
