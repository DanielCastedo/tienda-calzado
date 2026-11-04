import { CallToAction, Icon, SectionHeading } from '@/components/ui'
import { ROUTES } from '@/constants'
import { nosotros } from '@/content'
import './About.css'

function AboutIntro({ data }) {
  return (
    <section className="about-intro">
      <SectionHeading
        as="h1"
        eyebrow={data.etiqueta}
        title={data.titulo}
        highlight={data.resaltado}
        description={data.descripcion}
      />
      <div className="about-intro__media">
        <img src={data.imagen} alt={data.imagenAlt} />
      </div>
    </section>
  )
}

function Stats({ items }) {
  return (
    <dl className="about-stats">
      {items.map((item) => (
        <div key={item.etiqueta} className="about-stats__item">
          <dt className="about-stats__label">{item.etiqueta}</dt>
          <dd className="about-stats__value">{item.valor}</dd>
        </div>
      ))}
    </dl>
  )
}

function MissionVision({ items }) {
  return (
    <section className="about-mv">
      {items.map((item) => (
        <article key={item.titulo} className="about-mv__card">
          <h2 className="about-mv__title">{item.titulo}</h2>
          <p>{item.texto}</p>
        </article>
      ))}
    </section>
  )
}

function Values({ title, items }) {
  return (
    <section className="about-section">
      <SectionHeading title={title} />
      <div className="about-values">
        {items.map((value) => (
          <article key={value.titulo} className="about-values__card">
            <span className="about-values__icon"><Icon name={value.icono} size={28} /></span>
            <h3 className="about-values__title">{value.titulo}</h3>
            <p className="about-values__text">{value.texto}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Timeline({ title, items }) {
  return (
    <section className="about-section">
      <SectionHeading title={title} />
      <ol className="timeline">
        {items.map((item) => (
          <li key={item.anio + item.titulo} className="timeline__item">
            <span className="timeline__dot" aria-hidden="true" />
            <p className="timeline__year">{item.anio}</p>
            <h3 className="timeline__title">{item.titulo}</h3>
            <p className="timeline__text">{item.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function AboutView() {
  const { encabezado, cifras, mision, vision, valoresTitulo, valores, historiaTitulo, historia, llamado } = nosotros

  return (
    <div className="page">
      <AboutIntro data={encabezado} />
      <Stats items={cifras} />
      <MissionVision items={[mision, vision]} />
      <Values title={valoresTitulo} items={valores} />
      <Timeline title={historiaTitulo} items={historia} />
      <CallToAction title={llamado.titulo} text={llamado.texto} buttonText={llamado.boton} to={ROUTES.ORDERS} />
    </div>
  )
}
