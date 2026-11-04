import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { pedidos } from '@/content'
import { OrderContext } from '../hooks/orderContext'
import { calculateOrder } from '../services/orderCalculations'
import { ORDER_ACTIONS, orderReducer } from '../services/orderReducer'
import { orderStorage } from '../services/orderStorage'

export function OrderProvider({ children }) {
  const [items, dispatch] = useReducer(orderReducer, undefined, orderStorage.load)

  useEffect(() => {
    orderStorage.save(items)
  }, [items])

  const addItem = useCallback(
    (product, size, quantity = 1) => dispatch({ type: ORDER_ACTIONS.ADD, product, size, quantity }),
    [],
  )
  const setQuantity = useCallback(
    (key, quantity) => dispatch({ type: ORDER_ACTIONS.SET_QUANTITY, key, quantity }),
    [],
  )
  const removeItem = useCallback((key) => dispatch({ type: ORDER_ACTIONS.REMOVE, key }), [])
  const clearOrder = useCallback(() => dispatch({ type: ORDER_ACTIONS.CLEAR }), [])

  const value = useMemo(
    () => ({
      items,
      summary: calculateOrder(items, pedidos.minimoMayorista),
      addItem,
      setQuantity,
      removeItem,
      clearOrder,
    }),
    [items, addItem, setQuantity, removeItem, clearOrder],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
