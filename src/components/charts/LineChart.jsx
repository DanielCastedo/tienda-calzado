import { useState } from 'react'
import { formatTick, niceTicks, useChartWidth } from './useChartWidth'
import './Charts.css'

const M = { top: 22, right: 16, bottom: 28, left: 46 }

/**
 * Línea con área (una serie) y cruz de lectura al pasar el mouse.
 * @param {{ label: string, value: number }[]} data
 */
export function LineChart({ data, height = 240, formatValue = String, title }) {
  const [ref, width] = useChartWidth()
  const [hover, setHover] = useState(null)

  const innerW = width - M.left - M.right
  const innerH = height - M.top - M.bottom
  const ticks = niceTicks(Math.max(...data.map((d) => d.value), 0))
  const top = ticks[ticks.length - 1]
  const step = innerW / Math.max(data.length - 1, 1)
  const x = (i) => M.left + step * i
  const y = (v) => M.top + innerH - (v / top) * innerH
  const points = data.map((d, i) => [x(i), y(d.value)])
  const line = points.map(([px, py], i) => `${i ? 'L' : 'M'}${px},${py}`).join('')
  const area = `${line}L${x(data.length - 1)},${M.top + innerH}L${x(0)},${M.top + innerH}Z`
  const labelEvery = Math.ceil(data.length / Math.max(1, Math.floor(innerW / 60)))
  const last = data.length - 1

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const i = Math.round((event.clientX - rect.left - M.left) / step)
    setHover(Math.min(Math.max(i, 0), last))
  }

  return (
    <div className="chart" ref={ref}>
      <svg width={width} height={height} role="img" aria-label={title} onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line className="chart__grid" x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} />
            <text className="chart__tick" x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end">{formatTick(t, top)}</text>
          </g>
        ))}
        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={d.label} className="chart__tick" x={x(i)} y={height - 8} textAnchor="middle">{d.label}</text>
          ) : null,
        )}
        <path className="chart__area" d={area} />
        <path className="chart__line" d={line} />

        {hover != null ? (
          <>
            <line className="chart__crosshair" x1={x(hover)} x2={x(hover)} y1={M.top} y2={M.top + innerH} />
            <circle className="chart__dot" cx={x(hover)} cy={y(data[hover].value)} r="5" />
          </>
        ) : (
          last >= 0 && (
            <>
              <circle className="chart__dot" cx={x(last)} cy={y(data[last].value)} r="5" />
              <text className="chart__value" x={x(last)} y={y(data[last].value) - 12} textAnchor="end">{formatValue(data[last].value)}</text>
            </>
          )
        )}
        <line className="chart__axis" x1={M.left} x2={width - M.right} y1={M.top + innerH} y2={M.top + innerH} />
      </svg>

      {hover != null && (
        <div
          className="chart__tooltip"
          style={{ left: Math.min(Math.max(x(hover), 70), width - 70), top: Math.max(4, y(data[hover].value) - 58) }}
        >
          <strong>{data[hover].label}</strong>
          <span>{formatValue(data[hover].value)}</span>
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
