import { Link } from 'react-router-dom'
import { Button } from '../Button'
import { Icon } from '../Icon'
import './CallToAction.css'

/** Banda final de una página con título, texto y botón a otra ruta. */
export function CallToAction({ title, text, buttonText, to }) {
  return (
    <section className="cta-band">
      <div>
        <h2 className="cta-band__title">{title}</h2>
        {text && <p className="cta-band__text">{text}</p>}
      </div>
      <Button as={Link} to={to} size="lg" icon={<Icon name="arrow" />}>
        {buttonText}
      </Button>
    </section>
  )
}
