import { OrderProvider } from '@/features/orders'
import { AppRouter } from '@/routes'

/** Punto de composición: providers globales + router. */
export default function App() {
  return (
    <OrderProvider>
      <AppRouter />
    </OrderProvider>
  )
}
