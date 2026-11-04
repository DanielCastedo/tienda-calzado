import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router-dom'
import { Badge, Icon } from '@/components/ui'
import { ROUTES } from '@/constants'
import { useToggle } from '@/hooks'
import { cn } from '@/utils'
import { BrandLogo } from '../BrandLogo'
import './AdminLayout.css'

/**
 * Layout del panel: menú lateral + barra superior + contenido.
 * No conoce la autenticación: recibe el usuario y el menú ya filtrado por permisos.
 * @param {{ to, label, icon, end?, section? }[]} navItems
 */
export function AdminLayout({ user, roleLabel, navItems, onLogout, onResetDemo }) {
  const [isOpen, toggle, setOpen] = useToggle(false)
  const close = () => setOpen(false)

  return (
    <div className="admin theme-light">
      <aside className={cn('admin-sidebar no-print', isOpen && 'is-open')} aria-label="Menú del panel">
        <div className="admin-sidebar__brand">
          <BrandLogo size="sm" />
          <button type="button" className="admin-sidebar__close" onClick={close} aria-label="Cerrar menú">
            <Icon name="close" size={22} />
          </button>
        </div>
        <nav className="admin-nav">
          {navItems.map((item, i) => {
            const header = item.section && item.section !== navItems[i - 1]?.section ? item.section : null
            return (
              <div key={item.to}>
                {header && <p className="admin-nav__section">{header}</p>}
                <NavLink to={item.to} end={item.end} className={({ isActive }) => cn('admin-nav__link', isActive && 'is-active')} onClick={close}>
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                  {item.badge > 0 && <span className="admin-nav__badge">{item.badge}</span>}
                </NavLink>
              </div>
            )
          })}
        </nav>
        <Link to={ROUTES.HOME} className="admin-sidebar__site">
          <Icon name="external" size={18} /> Ver tienda online
        </Link>
      </aside>
      {isOpen && <div className="admin-backdrop no-print" onClick={close} aria-hidden="true" />}

      <div className="admin-main">
        <header className="admin-topbar no-print">
          <button type="button" className="admin-topbar__menu" onClick={toggle} aria-label="Abrir menú">
            <Icon name="menu" size={24} />
          </button>
          <div className="admin-topbar__spacer" />
          {onResetDemo && (
            <button type="button" className="admin-topbar__action" onClick={onResetDemo} title="Restaurar datos de demostración">
              <Icon name="refresh" size={18} />
              <span>Restaurar demo</span>
            </button>
          )}
          <div className="admin-user">
            <span className="admin-user__avatar" aria-hidden="true">{user.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span>
            <span className="admin-user__info">
              <strong>{user.name}</strong>
              <Badge tone="neutral">{roleLabel}</Badge>
            </span>
          </div>
          <button type="button" className="admin-topbar__action" onClick={onLogout} title="Cerrar sesión">
            <Icon name="logout" size={18} />
            <span>Salir</span>
          </button>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
      <ScrollRestoration />
    </div>
  )
}
