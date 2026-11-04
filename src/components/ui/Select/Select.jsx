import { useId } from 'react'
import { cn } from '@/utils'
import '../Input/Input.css'

/** @param {{ value: string, label: string }[]} options */
export function Select({ label, options = [], placeholder, error, id, className, ...props }) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={cn('field', className)}>
      {label && <label className="field__label" htmlFor={selectId}>{label}</label>}
      <select
        id={selectId}
        className={cn('field__control', error && 'field__control--error')}
        aria-invalid={Boolean(error) || undefined}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <span className="field__error">{error}</span>}
    </div>
  )
}
