import { useEffect, useRef, useState } from 'react'

/** Ancho real del contenedor (los gráficos se dibujan a esa medida, sin deformar el texto). */
export function useChartWidth(initial = 600) {
  const ref = useRef(null)
  const [width, setWidth] = useState(initial)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.floor(entry.contentRect.width))))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}

/** Divisiones "redondas" para el eje Y (0, 5k, 10k…). */
export function niceTicks(max, count = 4) {
  if (!(max > 0)) return [0, 1]
  const rawStep = max / count
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rawStep)
  const top = Math.ceil(max / step) * step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)
}

const compact = new Intl.NumberFormat('es-BO', { notation: 'compact', maximumFractionDigits: 1 })
const full = new Intl.NumberFormat('es-BO', { maximumFractionDigits: 0 })
export const formatTick = (value, maxTick) => (maxTick >= 10000 ? compact.format(value) : full.format(value))
