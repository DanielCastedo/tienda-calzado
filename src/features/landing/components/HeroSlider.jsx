import { cn } from '@/utils'

/** Control vertical: flecha arriba, puntos y flecha abajo. */
export function HeroSlider({ count, activeIndex, onPrev, onNext, onSelect }) {
  return (
    <div className="hero-slider" role="group" aria-label="Cambiar diapositiva">
      <button type="button" className="hero-slider__arrow" onClick={onPrev} aria-label="Anterior">
        <svg viewBox="0 0 26 14" aria-hidden="true"><path d="M1 13 13 1l12 12" /></svg>
      </button>

      <div className="hero-slider__dots">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            className={cn('hero-slider__dot', i === activeIndex && 'is-active')}
            aria-label={`Diapositiva ${i + 1}`}
            aria-current={i === activeIndex || undefined}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>

      <button type="button" className="hero-slider__arrow" onClick={onNext} aria-label="Siguiente">
        <svg viewBox="0 0 26 14" aria-hidden="true"><path d="M1 1l12 12L25 1" /></svg>
      </button>
    </div>
  )
}
