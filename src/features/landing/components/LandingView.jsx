import { sitio } from '@/content'
import { HeroSection } from './HeroSection'
import './Landing.css'

/** Página de inicio: hero a pantalla completa + indicador de país/idioma. */
export function LandingView() {
  return (
    <div className="landing">
      <HeroSection />

      <p className="landing__locale" aria-label={`País ${sitio.pais}, idioma ${sitio.idioma}`}>
        <span>{sitio.pais}</span>
        <span className="landing__locale-sep" aria-hidden="true" />
        <span>{sitio.idioma}</span>
      </p>

      <svg className="landing__blob" viewBox="0 0 570 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 90C20 35 70 0 150 0 240 0 300 30 400 30 480 30 535 45 570 82V90Z" />
      </svg>
    </div>
  )
}
