import { useState } from 'react'
import { Button } from '../Button'
import { Modal } from '../Modal'
import { FormFields, validateRequired } from './FormFields'

/**
 * Modal con formulario generado por configuración.
 * Móntalo solo cuando esté abierto (`{open && <FormModal … />}`) para que arranque limpio.
 * `onSubmit(values)` puede lanzar un error: su mensaje se muestra en el formulario.
 * `fields` puede ser una función (values) => fields para campos dinámicos.
 */
export function FormModal({ title, fields, initialValues = {}, onSubmit, onClose, submitLabel = 'Guardar', size = 'md', children }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const resolvedFields = typeof fields === 'function' ? fields(values) : fields

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setFormError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validation = validateRequired(resolvedFields, values)
    setErrors(validation)
    if (Object.keys(validation).length) return
    try {
      onSubmit(values)
    } catch (error) {
      setFormError(error.message)
    }
  }

  const formId = `form-${title.replace(/\W+/g, '-')}`

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form={formId}>{submitLabel}</Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} noValidate className="form-stack">
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <FormFields fields={resolvedFields} values={values} errors={errors} onChange={handleChange} />
        {typeof children === 'function' ? children(values, handleChange) : children}
      </form>
    </Modal>
  )
}
