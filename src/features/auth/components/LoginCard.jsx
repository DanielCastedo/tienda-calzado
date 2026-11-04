import { Button, Input } from '@/components/ui'
import { useLogin } from '../hooks/useLogin'
import './LoginCard.css'

export function LoginCard() {
  const { values, errors, user, isLoading, submitError, handleChange, handleSubmit } = useLogin()

  if (user) {
    return (
      <div className="login-card">
        <h2 className="login-card__title">¡Hola, {user.name}!</h2>
        <p className="login-card__hint">Has iniciado sesión correctamente.</p>
      </div>
    )
  }

  return (
    <form className="login-card" onSubmit={handleSubmit} noValidate>
      <h2 className="login-card__title">Iniciar sesión</h2>
      <p className="login-card__hint">
        Demo: <code>demo@tienda.com</code> / <code>123456</code>
      </p>

      <Input
        label="Correo electrónico"
        type="email"
        name="email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        label="Contraseña"
        type="password"
        name="password"
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />

      {submitError && <p className="login-card__error" role="alert">{submitError}</p>}

      <Button type="submit" fullWidth isLoading={isLoading}>Ingresar</Button>
    </form>
  )
}
