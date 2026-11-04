import { useEffect, useId, useRef, useState } from 'react'
import { Button, Icon } from '@/components/ui'
import { productosPagina as texts } from '@/content'
import { useOrder } from '../hooks/orderContext'
import './Orders.css'

/** Selector de talla + botón para agregar un producto al pedido. */
export function AddToOrderButton({ product }) {
  const { addItem } = useOrder()
  const selectId = useId()
  const [size, setSize] = useState(product.sizes[0] ?? '')
  const [justAdded, setJustAdded] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const isOutOfStock = product.stock <= 0

  const handleAdd = () => {
    addItem(product, size)
    setJustAdded(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setJustAdded(false), 1600)
  }

  if (isOutOfStock) {
    return <Button variant="secondary" size="sm" disabled fullWidth>{texts.textoAgotado}</Button>
  }

  return (
    <div className="add-to-order">
      <label className="visually-hidden" htmlFor={selectId}>{texts.textoTalla}</label>
      <select
        id={selectId}
        className="add-to-order__size"
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      >
        {product.sizes.map((s) => (
          <option key={s} value={s}>{texts.textoTalla} {s}</option>
        ))}
      </select>
      <Button size="sm" onClick={handleAdd} aria-live="polite" className="add-to-order__button">
        {justAdded ? <><Icon name="check" size={16} /> {texts.textoAgregado}</> : <><Icon name="plus" size={16} /> {texts.textoAgregar}</>}
      </Button>
    </div>
  )
}
