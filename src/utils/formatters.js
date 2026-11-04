import { CURRENCY, LOCALE } from '@/constants'

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
})

export const formatCurrency = (value) => currencyFormatter.format(value)
