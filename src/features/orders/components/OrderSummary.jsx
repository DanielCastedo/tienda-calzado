import { Icon } from '@/components/ui'
import { pedidos as texts } from '@/content'
import { formatCurrency } from '@/utils'
import { useOrder } from '../hooks/orderContext'

function QuantityStepper({ line, onChange }) {
  return (
    <div className="qty" role="group" aria-label={`Cantidad de ${line.name}, talla ${line.size}`}>
      <button type="button" className="qty__btn" onClick={() => onChange(line.quantity - 1)} aria-label="Quitar uno">
        <Icon name="minus" size={16} />
      </button>
      <input
        className="qty__input"
        type="number"
        inputMode="numeric"
        min="1"
        value={line.quantity}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Cantidad"
      />
      <button type="button" className="qty__btn" onClick={() => onChange(line.quantity + 1)} aria-label="Agregar uno">
        <Icon name="plus" size={16} />
      </button>
    </div>
  )
}

export function OrderSummary() {
  const { summary, setQuantity, removeItem } = useOrder()
  const { lines, totalPairs, total, isWholesale, savings, pairsToWholesale } = summary
  const progress = Math.min(100, (totalPairs / texts.minimoMayorista) * 100)

  return (
    <section className="order-card" aria-labelledby="order-summary-title">
      <h2 id="order-summary-title" className="order-card__title">{texts.resumenTitulo}</h2>

      <ul className="order-lines">
        {lines.map((line) => (
          <li key={line.key} className="order-line">
            <div className="order-line__image">
              <img src={line.image} alt="" loading="lazy" />
            </div>
            <div className="order-line__info">
              <p className="order-line__name">{line.name}</p>
              <p className="order-line__meta">
                Talla {line.size} ·{' '}
                {isWholesale && line.unitPrice !== line.price && (
                  <s className="order-line__old">{formatCurrency(line.price)}</s>
                )}{' '}
                {formatCurrency(line.unitPrice)} c/u
              </p>
            </div>
            <QuantityStepper line={line} onChange={(q) => setQuantity(line.key, q)} />
            <p className="order-line__subtotal">{formatCurrency(line.subtotal)}</p>
            <button
              type="button"
              className="order-line__remove"
              onClick={() => removeItem(line.key)}
              aria-label={`Eliminar ${line.name} talla ${line.size}`}
            >
              <Icon name="trash" size={18} />
            </button>
          </li>
        ))}
      </ul>

      <div className="wholesale" aria-live="polite">
        <div className="wholesale__bar"><span style={{ width: `${progress}%` }} /></div>
        <p className={isWholesale ? 'wholesale__ok' : 'wholesale__hint'}>
          {isWholesale ? texts.avisoMayorista : texts.faltanParaMayorista.replace('{n}', pairsToWholesale)}
        </p>
      </div>

      <dl className="order-totals">
        <div><dt>Total de pares</dt><dd>{totalPairs}</dd></div>
        {savings > 0 && <div className="order-totals__savings"><dt>Ahorro mayorista</dt><dd>-{formatCurrency(savings)}</dd></div>}
        <div className="order-totals__grand"><dt>Total</dt><dd>{formatCurrency(total)}</dd></div>
      </dl>
    </section>
  )
}
