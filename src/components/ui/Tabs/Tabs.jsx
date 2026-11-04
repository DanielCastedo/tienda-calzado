import { useRef } from 'react'
import { cn } from '@/utils'
import './Tabs.css'

/**
 * Pestañas accesibles (flechas ← → para moverse).
 * @param {{ id: string, label: string, count?: number }[]} tabs
 */
export function Tabs({ tabs, value, onChange, className }) {
  const refs = useRef({})

  const handleKeyDown = (event, index) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return
    event.preventDefault()
    const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]
    onChange(next.id)
    refs.current[next.id]?.focus()
  }

  return (
    <div className={cn('tabs', className)} role="tablist">
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          ref={(el) => (refs.current[tab.id] = el)}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          tabIndex={value === tab.id ? 0 : -1}
          className={cn('tabs__tab', value === tab.id && 'is-active')}
          onClick={() => onChange(tab.id)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        >
          {tab.label}
          {tab.count != null && <span className="tabs__count">{tab.count}</span>}
        </button>
      ))}
    </div>
  )
}
