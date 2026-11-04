import './Charts.css'

/**
 * Ranking en barras horizontales (ej. productos más vendidos).
 * El texto usa colores de texto; la barra lleva el color de la serie.
 * @param {{ label: string, value: number, detail?: string }[]} data
 */
export function RankingBars({ data, formatValue = String, emptyText = 'Sin datos en el periodo.' }) {
  const max = Math.max(...data.map((d) => d.value), 0)
  if (!data.length || max === 0) return <p className="chart__empty">{emptyText}</p>

  return (
    <ol className="ranking">
      {data.map((d, i) => (
        <li key={d.label} className="ranking__item" title={`${d.label}: ${formatValue(d.value)}`}>
          <span className="ranking__pos">{i + 1}</span>
          <div className="ranking__body">
            <div className="ranking__text">
              <span className="ranking__label">{d.label}</span>
              <span className="ranking__value">{formatValue(d.value)}</span>
            </div>
            <div className="ranking__track">
              <span className="ranking__bar" style={{ width: `${(d.value / max) * 100}%` }} />
            </div>
            {d.detail && <span className="ranking__detail">{d.detail}</span>}
          </div>
        </li>
      ))}
    </ol>
  )
}
