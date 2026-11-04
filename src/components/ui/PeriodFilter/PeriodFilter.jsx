import { daysAgo, startOfMonth, toInputDate } from '@/utils'
import './PeriodFilter.css'

const today = () => toInputDate()

export const PERIOD_PRESETS = [
  { id: 'today', label: 'Hoy', range: () => ({ from: today(), to: today() }) },
  { id: '7d', label: '7 días', range: () => ({ from: daysAgo(6), to: today() }) },
  { id: '30d', label: '30 días', range: () => ({ from: daysAgo(29), to: today() }) },
  { id: 'month', label: 'Este mes', range: () => ({ from: startOfMonth(), to: today() }) },
  {
    id: 'lastMonth',
    label: 'Mes anterior',
    range: () => {
      const now = new Date()
      return { from: toInputDate(new Date(now.getFullYear(), now.getMonth() - 1, 1)), to: toInputDate(new Date(now.getFullYear(), now.getMonth(), 0)) }
    },
  },
  { id: '90d', label: '90 días', range: () => ({ from: daysAgo(89), to: today() }) },
]

export const defaultPeriod = (id = '30d') => ({ preset: id, ...PERIOD_PRESETS.find((p) => p.id === id).range() })

/** Selector de periodo: atajos + rango personalizado. value = { preset, from, to } */
export function PeriodFilter({ value, onChange }) {
  return (
    <div className="period-filter" role="group" aria-label="Periodo">
      <div className="period-filter__presets">
        {PERIOD_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={value.preset === p.id ? 'is-active' : undefined}
            aria-pressed={value.preset === p.id}
            onClick={() => onChange({ preset: p.id, ...p.range() })}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="period-filter__range">
        <input type="date" aria-label="Desde" value={value.from} max={value.to} onChange={(e) => onChange({ ...value, preset: 'custom', from: e.target.value })} />
        <span>a</span>
        <input type="date" aria-label="Hasta" value={value.to} min={value.from} onChange={(e) => onChange({ ...value, preset: 'custom', to: e.target.value })} />
      </div>
    </div>
  )
}
