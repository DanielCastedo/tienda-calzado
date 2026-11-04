import { Link } from 'react-router-dom'
import { Button, Icon } from '@/components/ui'
import { ROUTES } from '@/constants'
import { inicio } from '@/content'
import { useHeroSlider } from '../hooks/useHeroSlider'
import { HeroSlider } from './HeroSlider'

const { slides, slideInicial, segundosPorSlide, textoBoton } = inicio

export function HeroSection() {
  const { index, goTo, next, prev, setPaused } = useHeroSlider({
    count: slides.length,
    initialIndex: Math.min(Math.max(slideInicial - 1, 0), slides.length - 1),
    autoplayMs: segundosPorSlide * 1000,
  })
  const slide = slides[index]

  return (
    <section
      className="hero"
      aria-roledescription="carrusel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* `key` reinicia la animación de entrada en cada cambio de slide */}
      <div className="hero__content" key={index} aria-live="polite">
        <p className="hero__eyebrow">{slide.etiqueta}</p>
        <h1 className="hero__title">
          <span className="hero__line">
            {slide.titulo} <span className="hero__highlight">{slide.resaltado}</span>
          </span>
          <span className="hero__line">{slide.subtitulo}</span>
        </h1>
        <p className="hero__description">{slide.descripcion}</p>

        <Button as={Link} to={ROUTES.PRODUCTS} className="hero__cta" icon={<Icon name="heart" />}>
          {textoBoton}
        </Button>
      </div>

      <div className="hero__media" key={`img-${index}`}>
        <img className="hero__image" src={slide.imagen} alt={slide.imagenAlt} />
      </div>

      {slides.length > 1 && (
        <HeroSlider count={slides.length} activeIndex={index} onPrev={prev} onNext={next} onSelect={goTo} />
      )}
    </section>
  )
}
