import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { sitio } from '@/content'
import { useToggle } from '@/hooks'
import { cn } from '@/utils'
import { BrandLogo } from '../BrandLogo'
import './Header.css'

const NAV_ITEMS = [
  { to: ROUTES.HOME, label: sitio.menu.inicio, end: true },
  { to: ROUTES.ABOUT, label: sitio.menu.nosotros },
  { to: ROUTES.PRODUCTS, label: sitio.menu.productos },
  { to: ROUTES.ORDERS, label: sitio.menu.pedidos },
]

const linkClass = ({ isActive }) => cn('nav-link', isActive && 'is-active')

/**
 * Header principal.
 * @param {Record<string, number>} badges  Contador por ruta, ej. { '/pedidos': 3 }.
 * @param {({ inMenu, onDone }) => React.ReactNode} renderSearch
 *        Buscador inyectado desde fuera (así el layout no depende de ninguna feature).
 */
export function Header({ badges = {}, renderSearch }) {
  const [isMenuOpen, toggleMenu, setMenuOpen] = useToggle(false)
  const closeMenu = () => setMenuOpen(false)

  const renderLinks = () =>
    NAV_ITEMS.map(({ to, label, end }) => (
      <NavLink key={to} to={to} end={end} className={linkClass} onClick={closeMenu}>
        {label}
        {badges[to] > 0 && (
          <span className="nav-link__badge">
            {badges[to]}
            <span className="visually-hidden"> pares</span>
          </span>
        )}
      </NavLink>
    ))

  return (
    <header className="site-header container">
      <BrandLogo />

      <nav className="site-header__nav" aria-label="Principal">{renderLinks()}</nav>

      {renderSearch && (
        <div className="site-header__search">{renderSearch({ inMenu: false, onDone: closeMenu })}</div>
      )}

      <button
        type="button"
        className={cn('burger', isMenuOpen && 'is-open')}
        aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isMenuOpen}
        aria-controls="site-menu"
        onClick={toggleMenu}
      >
        <span />
        <span />
      </button>

      {isMenuOpen && (
        <div id="site-menu" className="site-menu">
          {renderSearch && (
            <div className="site-menu__search">{renderSearch({ inMenu: true, onDone: closeMenu })}</div>
          )}
          <nav className="site-menu__nav" aria-label="Menú">
            {renderLinks()}
            <NavLink to={ROUTES.LOGIN} className={linkClass} onClick={closeMenu}>{sitio.menu.ingresar}</NavLink>
          </nav>
        </div>
      )}
    </header>
  )
}
