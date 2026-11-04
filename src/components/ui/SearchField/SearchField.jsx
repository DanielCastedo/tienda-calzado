import { useRef } from 'react'
import { cn } from '@/utils'
import { Icon } from '../Icon'
import './SearchField.css'

/**
 * Campo de búsqueda en "píldora": lupa a la izquierda y botón X para borrar.
 * Acepta cualquier prop de <input> (role, aria-*, onKeyDown...).
 * @param {(value: string) => void} onValueChange
 * @param {() => void} onClear  Opcional; por defecto vacía el campo con onValueChange('').
 */
export function SearchField({ value, onValueChange, onClear, inputRef, label, className, ...inputProps }) {
  const localRef = useRef(null)
  const ref = inputRef ?? localRef

  const handleClear = () => {
    if (onClear) onClear()
    else onValueChange('')
    ref.current?.focus()
  }

  return (
    <div className={cn('search-field', className)}>
      <Icon name="search" size={18} className="search-field__icon" />
      <input
        ref={ref}
        type="text"
        className="search-field__input"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        aria-label={label ?? inputProps.placeholder}
        autoComplete="off"
        spellCheck="false"
        {...inputProps}
      />
      {value && (
        <button type="button" className="search-field__clear" onClick={handleClear} aria-label="Borrar búsqueda">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
