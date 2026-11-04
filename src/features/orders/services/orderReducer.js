/** Estado del pedido: lista de líneas { key, productId, name, size, quantity, price, wholesalePrice, image }. */

export const ORDER_ACTIONS = {
  ADD: 'add',
  SET_QUANTITY: 'setQuantity',
  REMOVE: 'remove',
  CLEAR: 'clear',
}

export const MAX_QUANTITY_PER_LINE = 999

const lineKey = (productId, size) => `${productId}-${size}`

export function orderReducer(items, action) {
  switch (action.type) {
    case ORDER_ACTIONS.ADD: {
      const { product, size, quantity = 1 } = action
      const key = lineKey(product.id, size)
      const existing = items.find((item) => item.key === key)

      if (existing) {
        return items.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_QUANTITY_PER_LINE) }
            : item,
        )
      }

      return [
        ...items,
        {
          key,
          productId: product.id,
          name: product.name,
          size,
          quantity,
          price: product.price,
          wholesalePrice: product.wholesalePrice ?? product.price,
          image: product.image,
        },
      ]
    }

    case ORDER_ACTIONS.SET_QUANTITY: {
      const quantity = Math.min(Math.max(0, Math.floor(action.quantity) || 0), MAX_QUANTITY_PER_LINE)
      if (quantity === 0) return items.filter((item) => item.key !== action.key)
      return items.map((item) => (item.key === action.key ? { ...item, quantity } : item))
    }

    case ORDER_ACTIONS.REMOVE:
      return items.filter((item) => item.key !== action.key)

    case ORDER_ACTIONS.CLEAR:
      return []

    default:
      return items
  }
}
