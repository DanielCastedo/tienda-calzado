import { useState } from 'react'

const INITIAL_VALUES = { name: '', phone: '', city: '', delivery: '', notes: '' }

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 3) errors.name = 'Escribe tu nombre completo'
  if (values.phone.replace(/\D/g, '').length < 7) errors.phone = 'Escribe un teléfono válido'
  if (!values.city) errors.city = 'Elige tu ciudad'
  if (!values.delivery) errors.delivery = 'Elige el tipo de entrega'
  return errors
}

/** Estado y validación del formulario de datos del cliente. */
export function useOrderForm({ onSubmit }) {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    onSubmit({ ...values, name: values.name.trim(), notes: values.notes.trim() })
  }

  return { values, errors, handleChange, handleSubmit }
}
