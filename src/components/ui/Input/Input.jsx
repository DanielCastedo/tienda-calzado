import { useId } from 'react'
import { cn } from '@/utils'
import './Input.css'

/** Campo de texto. Con `multiline` se renderiza como <textarea>. */
export function Input({ label, error, id, className, multiline = false, ...props }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const Control = multiline ? 'textarea' : 'input'

  return (
    <div className={cn('field', className)}>
      {label && <label className="field__label" htmlFor={inputId}>{label}</label>}
      <Control
        id={inputId}
        className={cn('field__control', error && 'field__control--error')}
        aria-invalid={Boolean(error) || undefined}
        {...props}
      />
      {error && <span className="field__error">{error}</span>}
    </div>
  )
}
