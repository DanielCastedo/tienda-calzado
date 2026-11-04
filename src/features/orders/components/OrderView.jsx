import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, SectionHeading } from '@/components/ui'
import { ROUTES } from '@/constants'
import { pedidos as texts, sitio } from '@/content'
import { useOrder } from '../hooks/orderContext'
import { buildOrderMessage, getWhatsAppUrl } from '../services/whatsapp'
import { OrderForm } from './OrderForm'
import { OrderSteps } from './OrderSteps'
import { OrderSummary } from './OrderSummary'
import './Orders.css'

export function OrderView() {
  const { items, summary, clearOrder } = useOrder()
  const [whatsappUrl, setWhatsappUrl] = useState(null)

  const handleSubmit = (customer) => {
    const message = buildOrderMessage({ greeting: texts.saludoWhatsapp, summary, customer })
    const url = getWhatsAppUrl(sitio.contacto.whatsapp, message)
    setWhatsappUrl(url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleFinish = () => {
    clearOrder()
    setWhatsappUrl(null)
  }

  return (
    <div className="page">
      <SectionHeading
        as="h1"
        eyebrow={texts.encabezado.etiqueta}
        title={texts.encabezado.titulo}
        highlight={texts.encabezado.resaltado}
        description={texts.encabezado.descripcion}
      />

      <OrderSteps steps={texts.pasos} />

      {whatsappUrl ? (
        <section className="order-card order-done" role="status">
          <span className="order-done__icon"><Icon name="check" size={32} /></span>
          <h2 className="order-card__title">{texts.enviadoTitulo}</h2>
          <p>{texts.enviadoTexto}</p>
          <div className="order-done__actions">
            <Button as="a" href={whatsappUrl} target="_blank" rel="noopener noreferrer" icon={<Icon name="whatsapp" />}>
              ABRIR WHATSAPP
            </Button>
            <Button variant="secondary" onClick={handleFinish}>FINALIZAR Y VACIAR</Button>
          </div>
        </section>
      ) : items.length === 0 ? (
        <section className="order-card order-empty">
          <span className="order-empty__icon"><Icon name="bag" size={40} /></span>
          <h2 className="order-card__title">{texts.vacioTitulo}</h2>
          <p>{texts.vacioTexto}</p>
          <Button as={Link} to={ROUTES.PRODUCTS} icon={<Icon name="arrow" />}>{texts.vacioBoton}</Button>
        </section>
      ) : (
        <div className="order-layout">
          <OrderSummary />
          <OrderForm onSubmit={handleSubmit} />
        </div>
      )}

      <section className="order-info" aria-label="Información de compra">
        {texts.informacion.map((info) => (
          <article key={info.titulo} className="order-info__item">
            <h3>{info.titulo}</h3>
            <p>{info.texto}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
