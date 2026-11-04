import { createContext, useContext } from 'react'

export const OrderContext = createContext(null)

/** Acceso al pedido actual: items, resumen y acciones. Requiere <OrderProvider>. */
export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrder debe usarse dentro de <OrderProvider>')
  return context
}
