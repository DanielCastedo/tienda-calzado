import { cn } from '@/utils'
import { Icon } from '../Icon'
import './Panel.css'

/** Encabezado de página del panel: título, descripción y acciones. */
export function PageHeader({ title, description, actions, icon }) {
  return (
    <header className="page-header">
      <div className="page-header__text">
        <h1 className="page-header__title">
          {icon && <Icon name={icon} size={26} />}
          {title}
        </h1>
        {description && <p className="page-header__description">{description}</p>}
      </div>
      {actions && <div className="page-header__actions no-print">{actions}</div>}
    </header>
  )
}

/** Tarjeta contenedora con título opcional. */
export function Card({ title, actions, children, className, padded = true }) {
  return (
    <section className={cn('card', padded && 'card--padded', className)}>
      {(title || actions) && (
        <header className="card__header">
          {title && <h2 className="card__title">{title}</h2>}
          {actions && <div className="card__actions no-print">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  )
}

/** Indicador numérico (KPI). tone: default | success | warning | danger */
export function StatCard({ label, value, hint, icon, tone = 'default' }) {
  return (
    <article className={cn('stat-card', `stat-card--${tone}`)}>
      {icon && (
        <span className="stat-card__icon" aria-hidden="true">
          <Icon name={icon} size={22} />
        </span>
      )}
      <div className="stat-card__body">
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
        {hint && <p className="stat-card__hint">{hint}</p>}
      </div>
    </article>
  )
}

export function EmptyState({ icon = 'box', title, text, action }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon"><Icon name={icon} size={30} /></span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  )
}

/** Lista de pares etiqueta / valor. */
export function DetailList({ items }) {
  return (
    <dl className="detail-list">
      {items.filter(Boolean).map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  )
}
