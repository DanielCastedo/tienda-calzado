import { cn } from '@/utils'
import './SectionHeading.css'

/**
 * Título con el estilo de la marca:
 *   etiqueta (pequeña) / título blanco + resaltado naranja / descripción.
 * Usa `as="h1"` en el encabezado de cada página y `h2` (por defecto) en secciones.
 */
export function SectionHeading({
  as: Heading = 'h2',
  eyebrow,
  title,
  highlight,
  description,
  align = 'left',
  className,
}) {
  return (
    <header className={cn('section-heading', `section-heading--${align}`, className)}>
      {eyebrow && <p className="section-heading__eyebrow">{eyebrow}</p>}
      <Heading className={cn('section-heading__title', Heading === 'h1' && 'section-heading__title--lg')}>
        {title}
        {highlight && <> <span className="text-highlight">{highlight}</span></>}
      </Heading>
      {description && <p className="section-heading__description">{description}</p>}
    </header>
  )
}
