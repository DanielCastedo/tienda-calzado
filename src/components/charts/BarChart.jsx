import { useState } from 'react'
import { formatTick, niceTicks, useChartWidth } from './useChartWidth'
import './Charts.css'

const M = { top: 22, right: 8, bottom: 28, left: 46 }
const BAR_MAX = 24
const RADIUS = 4

/** Columna con esquina superior redondeada y base recta. */
const columnPath = (x, y, w, h) => {
  const r = Math.min(RADIUS, w / 2, h)
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`
}

/**
 * Gráfico de columnas de una serie. Hover = tooltip; se etiqueta solo el valor máximo.
 * @param {{ label: string, value: number, detail?: string }[]} data
 */
export function BarChart({ data, height = 240, formatValue = String, title }) {
  const [ref, width] = useChartWidth()
  const [hover, setHover] = useState(null)

  const innerW = width - M.left - M.right
  const innerH = height - M.top - M.bottom
  const ticks = niceTicks(Math.max(...data.map((d) => d.value), 0))
  const top = ticks[ticks.length - 1]
  const band = innerW / Math.max(data.length, 1)
  const barW = Math.min(BAR_MAX, band * 0.62)
  const labelEvery = Math.ceil(data.length / Math.max(1, Math.floor(innerW / 52)))
  const maxIndex = data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0)
  const y = (v) => M.top + innerH - (v / top) * innerH

  return (
    <div className="chart" ref={ref}>
      <svg width={width} height={height} role="img" aria-label={title}>
        {ticks.map((t) => (
          <g key={t}>
            <line className="chart__grid" x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} />
            <text className="chart__tick" x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end">{formatTick(t, top)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = M.left + band * i + band / 2
          const h = Math.max(0, (d.value / top) * innerH)
          return (
            <g key={d.label}>
              {d.value > 0 && (
                <path className={hover === i ? 'chart__bar is-hover' : 'chart__bar'} d={columnPath(cx - barW / 2, M.top + innerH - h, barW, h)} />
              )}
              {i === maxIndex && d.value > 0 && hover == null && (
                <text className="chart__value" x={cx} y={M.top + innerH - h - 7} textAnchor="middle">{formatValue(d.value)}</text>
              )}
              {i % labelEvery === 0 && (
                <text className="chart__tick" x={cx} y={height - 8} textAnchor="middle">{d.label}</text>
              )}
              {/* Zona de hover: toda la banda, más grande que la barra */}
              <rect
                x={M.left + band * i}
                y={M.top}
                width={band}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          )
        })}
        <line className="chart__axis" x1={M.left} x2={width - M.right} y1={M.top + innerH} y2={M.top + innerH} />
      </svg>

      {hover != null && (
        <div
          className="chart__tooltip"
          style={{ left: Math.min(Math.max(M.left + band * hover + band / 2, 70), width - 70), top: Math.max(4, y(data[hover].value) - 54) }}
        >
          <strong>{data[hover].label}</strong>
          <span>{formatValue(data[hover].value)}</span>
          {data[hover].detail && <small>{data[hover].detail}</small>}
        </div>
      )}

      <table className="visually-hidden">
        <caption>{title}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}><th scope="row">{d.label}</th><td>{formatValue(d.value)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
