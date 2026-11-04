import { cn } from '@/utils'
import './Button.css'

/**
 * Botón reutilizable.
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {React.ReactNode} icon  Ícono circular a la derecha (estilo "PRODUCTOS").
 * @param {React.ElementType} as  Permite renderizarlo como Link: <Button as={Link} to="/">.
 */
export function Button({
  children,
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  type,
  icon,
  isLoading = false,
  fullWidth = false,
  disabled,
  className,
  ...props
}) {
  const isButton = Component === 'button'

  return (
    <Component
      type={isButton ? (type ?? 'button') : type}
      className={cn('btn', `btn--${variant}`, `btn--${size}`, fullWidth && 'btn--full', className)}
      disabled={isButton ? disabled || isLoading : undefined}
      aria-disabled={!isButton && disabled ? true : undefined}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? 'Cargando…' : children}
      {icon && !isLoading && (
        <span className="btn__icon" aria-hidden="true">{icon}</span>
      )}
    </Component>
  )
}
