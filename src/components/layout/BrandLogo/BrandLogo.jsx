import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { sitio } from '@/content'
import { cn } from '@/utils'
import './BrandLogo.css'

/** Logo de la marca: isotipo de chevrons + nombre + lema. */
export function BrandLogo({ size = 'md', className }) {
  return (
    <Link to={ROUTES.HOME} className={cn('brand', `brand--${size}`, className)} aria-label={`${sitio.nombre}, ir al inicio`}>
      <svg className="brand__mark" viewBox="0 0 56 52" aria-hidden="true">
        <g fill="currentColor">
          <path d="M28 0 56 28 50 34 28 12 6 34 0 28Z" />
          <path d="M28 16 47 35 41 41 28 28 15 41 9 35Z" />
          <path d="M28 32 38 42 28 52 18 42Z" />
        </g>
      </svg>
      <span className="brand__text">
        <span className="brand__name">{sitio.marca}</span>
        <span className="brand__tagline">{sitio.lema}</span>
      </span>
    </Link>
  )
}
