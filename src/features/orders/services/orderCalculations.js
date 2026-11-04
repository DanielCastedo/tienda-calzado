/**
 * Calcula totales del pedido.
 * Si el total de pares alcanza `wholesaleMinimum`, cada línea usa su precio mayorista.
 */
export function calculateOrder(items, wholesaleMinimum) {
  const totalPairs = items.reduce((sum, item) => sum + item.quantity, 0)
  const isWholesale = wholesaleMinimum > 0 && totalPairs >= wholesaleMinimum

  const lines = items.map((item) => {
    const unitPrice = isWholesale ? item.wholesalePrice : item.price
    return { ...item, unitPrice, subtotal: unitPrice * item.quantity }
  })

  const total = lines.reduce((sum, line) => sum + line.subtotal, 0)
  const retailTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    lines,
    totalPairs,
    total,
    isWholesale,
    savings: retailTotal - total,
    pairsToWholesale: isWholesale ? 0 : Math.max(0, wholesaleMinimum - totalPairs),
  }
}
