import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui'
import { ROUTES } from '@/constants'
import { sitio } from '@/content'
import { BrandLogo } from '../BrandLogo'
import './Footer.css'

const LINKS = [
  { to: ROUTES.HOME, label: sitio.menu.inicio },
  { to: ROUTES.ABOUT, label: sitio.menu.nosotros },
  { to: ROUTES.PRODUCTS, label: sitio.menu.productos },
  { to: ROUTES.ORDERS, label: sitio.menu.pedidos },
]

const SOCIAL_LABELS = { facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok' }

export function Footer() {
  const { contacto, redes } = sitio
  const socials = Object.entries(redes).filter(([, url]) => url)

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <BrandLogo size="sm" />
          <p>{sitio.pieDePagina}</p>
          {socials.length > 0 && (
            <ul className="site-footer__socials">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a href={url} target="_blank" rel="noopener noreferrer">{SOCIAL_LABELS[key] ?? key}</a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Pie de página">
          <h2 className="site-footer__title">Navegación</h2>
          <ul className="site-footer__list">
            {LINKS.map((link) => (
              <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="site-footer__title">Contacto</h2>
          <ul className="site-footer__list site-footer__contact">
            <li>
              <Icon name="whatsapp" size={18} />
              <a href={`https://wa.me/${contacto.whatsapp}`} target="_blank" rel="noopener noreferrer">{contacto.telefono}</a>
            </li>
            <li><Icon name="mail" size={18} /><a href={`mailto:${contacto.email}`}>{contacto.email}</a></li>
            <li><Icon name="pin" size={18} /><span>{contacto.direccion}</span></li>
            <li><Icon name="clock" size={18} /><span>{contacto.horario}</span></li>
          </ul>
        </div>
      </div>

      <p className="container site-footer__copy">
        &copy; {new Date().getFullYear()} {sitio.nombre}. Todos los derechos reservados.
      </p>
    </footer>
  )
}
