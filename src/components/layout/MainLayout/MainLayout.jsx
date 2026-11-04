import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Header } from '../Header'
import { Footer } from '../Footer'
import './MainLayout.css'

/**
 * Layout principal: fondo con manchas + Header + página activa + Footer.
 * @param {Record<string, number>} headerBadges  Contadores para el menú (ej. pares en el pedido).
 * @param {Function} renderHeaderSearch          Buscador a mostrar en el header.
 */
export function MainLayout({ headerBadges, renderHeaderSearch }) {
  return (
    <div className="main-layout">
      <svg className="main-layout__blob main-layout__blob--top" viewBox="0 0 372 164" aria-hidden="true">
        <path d="M0 0H372C380 70 330 150 210 162 120 170 40 140 0 100Z" />
      </svg>

      <Header badges={headerBadges} renderSearch={renderHeaderSearch} />
      <main className="main-layout__content container">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
