import { useId, useState } from 'react'
import { cn } from '@/utils'
import { Input } from '../Input'
import { Select } from '../Select'
import './Form.css'

/** Campo de lista de valores (tallas, colores): escribe y Enter, o elige una sugerencia. */
function TagsField({ label, value = [], onChange, suggestions = [], numeric, error, placeholder }) {
  const id = useId()
  const [text, setText] = useState('')
  const add = (raw) => {
    const item = numeric ? Number(raw) : String(raw).trim()
    if ((numeric ? Number.isNaN(item) : !item) || value.includes(item)) return
    const next = [...value, item]
    onChange(numeric ? next.sort((a, b) => a - b) : next)
  }
  const remove = (item) => onChange(value.filter((v) => v !== item))

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{label}</label>
      <div className={cn('tags-field', error && 'tags-field--error')}>
        {value.map((item) => (
          <span key={item} className="tag">
            {item}
            <button type="button" onClick={() => remove(item)} aria-label={`Quitar ${item}`}>×</button>
          </span>
        ))}
        <input
          id={id}
          value={text}
          inputMode={numeric ? 'numeric' : undefined}
          placeholder={value.length ? '' : placeholder ?? 'Escribe y presiona Enter'}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              if (text.trim()) add(text)
              setText('')
            } else if (e.key === 'Backspace' && !text && value.length) {
              remove(value[value.length - 1])
            }
          }}
          onBlur={() => {
            if (text.trim()) add(text)
            setText('')
          }}
        />
      </div>
      {suggestions.filter((s) => !value.includes(s)).length > 0 && (
        <div className="tags-suggestions">
          {suggestions
            .filter((s) => !value.includes(s))
            .map((s) => (
              <button key={s} type="button" onClick={() => add(s)}>+ {s}</button>
            ))}
        </div>
      )}
      {error && <span className="field__error">{error}</span>}
    </div>
  )
}

/**
 * Renderiza un formulario a partir de una configuración.
 * Tipos: text | number | email | tel | password | date | textarea | select | checkbox | tags
 * Cada campo: { name, label, type, options, required, span: 'full', placeholder, min, step, help, suggestions, numeric, disabled }
 */
export function FormFields({ fields, values, errors = {}, onChange }) {
  const set = (name) => (value) => onChange(name, value)

  return (
    <div className="form-grid">
      {fields.filter(Boolean).map((f) => {
        const cls = cn(f.span === 'full' && 'form-grid__full')
        const label = f.required ? `${f.label} *` : f.label

        if (f.type === 'tags') {
          return (
            <div key={f.name} className={cls}>
              <TagsField label={label} value={values[f.name]} onChange={set(f.name)} suggestions={f.suggestions} numeric={f.numeric} error={errors[f.name]} placeholder={f.placeholder} />
            </div>
          )
        }
        if (f.type === 'checkbox') {
          return (
            <label key={f.name} className={cn('checkbox-field', cls)}>
              <input type="checkbox" checked={Boolean(values[f.name])} onChange={(e) => set(f.name)(e.target.checked)} disabled={f.disabled} />
              <span>{f.label}</span>
            </label>
          )
        }
        if (f.type === 'select') {
          return (
            <div key={f.name} className={cls}>
              <Select
                label={label}
                name={f.name}
                options={f.options}
                placeholder={f.placeholder ?? 'Selecciona…'}
                value={values[f.name] ?? ''}
                onChange={(e) => set(f.name)(e.target.value)}
                error={errors[f.name]}
                disabled={f.disabled}
              />
              {f.help && <p className="field__help">{f.help}</p>}
            </div>
          )
        }
        return (
          <div key={f.name} className={cls}>
            <Input
              label={label}
              name={f.name}
              type={f.type === 'textarea' ? undefined : (f.type ?? 'text')}
              multiline={f.type === 'textarea'}
              rows={f.rows ?? 3}
              min={f.min}
              step={f.step}
              placeholder={f.placeholder}
              value={values[f.name] ?? ''}
              onChange={(e) => set(f.name)(e.target.value)}
              error={errors[f.name]}
              disabled={f.disabled}
            />
            {f.help && <p className="field__help">{f.help}</p>}
          </div>
        )
      })}
    </div>
  )
}

/** Valida los campos `required`. Devuelve { campo: mensaje }. */
export function validateRequired(fields, values) {
  const errors = {}
  fields.filter(Boolean).forEach((f) => {
    if (!f.required) return
    const v = values[f.name]
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) errors[f.name] = 'Campo obligatorio'
  })
  return errors
}
