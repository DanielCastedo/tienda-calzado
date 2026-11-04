import { Button, Icon, Input, Select } from '@/components/ui'
import { pedidos as texts } from '@/content'
import { useOrderForm } from '../hooks/useOrderForm'

const toOptions = (list) => list.map((value) => ({ value, label: value }))

export function OrderForm({ onSubmit }) {
  const { values, errors, handleChange, handleSubmit } = useOrderForm({ onSubmit })

  return (
    <form className="order-card order-form" onSubmit={handleSubmit} noValidate>
      <h2 className="order-card__title">{texts.formularioTitulo}</h2>

      <Input label="Nombre completo" name="name" autoComplete="name" value={values.name} onChange={handleChange} error={errors.name} />
      <Input label="Teléfono / WhatsApp" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={handleChange} error={errors.phone} />
      <Select
        label="Ciudad"
        name="city"
        placeholder="Selecciona…"
        options={toOptions(texts.departamentos)}
        value={values.city}
        onChange={handleChange}
        error={errors.city}
      />
      <Select
        label="Entrega"
        name="delivery"
        placeholder="Selecciona…"
        options={toOptions(texts.tiposEntrega)}
        value={values.delivery}
        onChange={handleChange}
        error={errors.delivery}
      />
      <Input label="Notas (opcional)" name="notes" multiline rows={3} value={values.notes} onChange={handleChange} />

      <Button type="submit" size="lg" fullWidth icon={<Icon name="whatsapp" />}>
        {texts.botonEnviar}
      </Button>
    </form>
  )
}
