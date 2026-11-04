import { formatCurrency } from '@/utils'

/** Arma el texto del pedido que se enviará por WhatsApp. */
export function buildOrderMessage({ greeting, summary, customer }) {
  const lines = summary.lines.map(
    (line, i) =>
      `${i + 1}. ${line.name} | Talla ${line.size} | ${line.quantity} par(es) x ${formatCurrency(line.unitPrice)} = ${formatCurrency(line.subtotal)}`,
  )

  return [
    greeting,
    '',
    ...lines,
    '',
    `*Total de pares:* ${summary.totalPairs}`,
    `*Total:* ${formatCurrency(summary.total)}${summary.isWholesale ? ' (precio mayorista)' : ''}`,
    '',
    '*Mis datos*',
    `Nombre: ${customer.name}`,
    `Teléfono: ${customer.phone}`,
    `Ciudad: ${customer.city}`,
    `Entrega: ${customer.delivery}`,
    customer.notes ? `Notas: ${customer.notes}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n')
}

/** Enlace universal de WhatsApp (funciona en móvil y en WhatsApp Web). */
export function getWhatsAppUrl(phoneNumber, message) {
  const number = String(phoneNumber).replace(/\D/g, '')
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
