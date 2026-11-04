import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BrandLogo } from '@/components/layout'
import { Button, Icon, Input } from '@/components/ui'
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROUTES } from '@/constants'
import { DEMO_PASSWORD, DEMO_USERS } from '../services/authApi'
import { useAuth } from '../hooks/authContext'
import './Login.css'

const ROLE_ICONS = { admin: 'shield', gerente: 'chart', produccion: 'factory', almacen: 'warehouse', vendedor: 'cart' }

export function LoginView() {
  const { login, loginAsRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from ?? ROUTES.ADMIN

  const [values, setValues] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!values.email || !values.password) {
      setError('Escribe tu correo y contraseña')
      return
    }
    try {
      login(values.email, values.password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDemo = (role) => {
    try {
      loginAsRole(role)
      navigate(ROUTES.ADMIN, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="login">
      <aside className="login__brand">
        <BrandLogo />
        <div className="login__pitch">
          <p className="login__eyebrow">Sistema de gestión</p>
          <h1 className="login__title">
            Panel <span>administrativo</span>
          </h1>
          <p>Producción, inventario, ventas y finanzas de tu fábrica de calzado en un solo lugar.</p>
        </div>
        <img className="login__shoe" src="/images/zapato-hero.png" alt="" />
        <ul className="login__features">
          <li><Icon name="factory" size={18} /> Órdenes de producción y fichas técnicas</li>
          <li><Icon name="warehouse" size={18} /> Inventario por modelo, talla y color</li>
          <li><Icon name="cart" size={18} /> Punto de venta y cuentas por cobrar</li>
          <li><Icon name="chart" size={18} /> Reportes y estadísticas</li>
        </ul>
      </aside>

      <main className="login__panel theme-light">
        <div className="login__card">
          <Link to={ROUTES.HOME} className="login__back">
            <Icon name="home" size={16} /> Volver a la tienda
          </Link>
          <h2 className="login__heading">Iniciar sesión</h2>
          <p className="login__sub">Ingresa con tu cuenta o usa un acceso demo.</p>

          <form className="login__form" onSubmit={handleSubmit} noValidate>
            {error && <p className="form-error" role="alert">{error}</p>}
            <Input label="Correo electrónico" type="email" name="email" autoComplete="username" value={values.email} onChange={handleChange} />
            <div className="login__password">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
              />
              <button type="button" className="login__toggle" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                <Icon name="eye" size={18} />
              </button>
            </div>
            <Button type="submit" size="lg" fullWidth icon={<Icon name="arrow" />}>INGRESAR</Button>
          </form>

          <div className="login__divider"><span>Accesos directos de demostración</span></div>

          <ul className="demo-access">
            {DEMO_USERS.map((u) => (
              <li key={u.role}>
                <button type="button" className="demo-access__card" onClick={() => handleDemo(u.role)}>
                  <span className="demo-access__icon"><Icon name={ROLE_ICONS[u.role]} size={20} /></span>
                  <span className="demo-access__text">
                    <strong>{ROLE_LABELS[u.role]}</strong>
                    <small>{ROLE_DESCRIPTIONS[u.role]}</small>
                  </span>
                  <Icon name="arrow" size={18} />
                </button>
              </li>
            ))}
          </ul>
          <p className="login__hint">
            Todos los usuarios demo usan la contraseña <code>{DEMO_PASSWORD}</code> (ej. <code>{DEMO_USERS[0].email}</code>).
          </p>
        </div>
      </main>
    </div>
  )
}
