import { useState } from 'react'
import { useAsync } from '@/hooks'
import { authApi } from '../services/authApi'

const INITIAL_VALUES = { email: '', password: '' }

function validate({ email, password }) {
  const errors = {}
  if (!email) errors.email = 'El correo es obligatorio'
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Correo no válido'
  if (!password) errors.password = 'La contraseña es obligatoria'
  return errors
}

/** Lógica del formulario de login, separada del componente visual. */
export function useLogin({ onSuccess } = {}) {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const { data: user, error, isLoading, execute } = useAsync(authApi.login, { immediate: false })

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    try {
      const loggedUser = await execute(values)
      onSuccess?.(loggedUser)
    } catch {
      // El error queda expuesto en `submitError`.
    }
  }

  return {
    values,
    errors,
    user,
    isLoading,
    submitError: error?.message,
    handleChange,
    handleSubmit,
  }
}
