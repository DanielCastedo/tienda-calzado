import { LOCALE } from '@/constants/app'

const dateFmt = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' })
const dateTimeFmt = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const monthFmt = new Intl.DateTimeFormat(LOCALE, { month: 'short', year: '2-digit' })

/** Acepta 'YYYY-MM-DD' (fecha local) o ISO completo. */
export const toDate = (value) => {
  if (!value) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(value)
}

export const formatDate = (value) => (value ? dateFmt.format(toDate(value)) : '—')
export const formatDateTime = (value) => (value ? dateTimeFmt.format(toDate(value)) : '—')
export const formatMonth = (value) => monthFmt.format(toDate(value))

/** 'YYYY-MM-DD' en hora local. */
export const toInputDate = (date = new Date()) => {
  const d = toDate(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const daysAgo = (days) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return toInputDate(d)
}

export const startOfMonth = (date = new Date()) => toInputDate(new Date(date.getFullYear(), date.getMonth(), 1))

/** ¿La fecha (ISO o YYYY-MM-DD) está entre from y to (YYYY-MM-DD, inclusive)? */
export const inRange = (value, from, to) => {
  const day = toInputDate(value)
  return (!from || day >= from) && (!to || day <= to)
}

/** Clave de mes 'YYYY-MM' para agrupar. */
export const monthKey = (value) => toInputDate(value).slice(0, 7)
