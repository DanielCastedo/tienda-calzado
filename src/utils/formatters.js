import { CURRENCY, LOCALE } from '@/constants/app'

const currencyFormatter = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY })
const numberFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 })
const percentFormatter = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 1 })

export const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0)
export const formatNumber = (value) => numberFormatter.format(Number(value) || 0)
export const formatPercent = (value) => percentFormatter.format(Number(value) || 0)
