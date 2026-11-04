import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, SearchField } from '@/components/ui'
import { ROUTES } from '@/constants'
import { cn, formatCurrency, normalizeText } from '@/utils'
import { useProducts } from '../hooks/useProducts'
import './ProductSearch.css'

const MAX_RESULTS = 5

const productsUrl = (term) => (term ? `${ROUTES.PRODUCTS}?q=${encodeURIComponent(term)}` : ROUTES.PRODUCTS)

/** Resalta en naranja la parte del texto que coincide con la búsqueda. */
function Highlight({ text, term }) {
  const index = term ? normalizeText(text).indexOf(normalizeText(term)) : -1
  if (index < 0) return text
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + term.length)}</mark>
      {text.slice(index + term.length)}
    </>
  )
}

/**
 * Buscador de productos con sugerencias (combobox accesible).
 * - Flechas ↑ ↓ para moverse, Enter para elegir, Esc para cerrar / borrar.
 * - Botón X para limpiar lo escrito.
 * @param {'popover'|'inline'} variant  `inline` despliega la lista dentro del flujo (menú móvil).
 * @param {() => void} onNavigate  Se llama después de navegar (ej. para cerrar el menú).
 */
export function ProductSearch({ placeholder = 'Buscar productos', variant = 'popover', onNavigate, className }) {
  const navigate = useNavigate()
  const listboxId = useId()
  const rootRef = useRef(null)
  const inputRef = useRef(null)

  const [term, setTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const query = term.trim()
  const { products, categories, isLoading } = useProducts({ search: query })
  const categoryNames = Object.fromEntries(categories.map((c) => [c.id, c.name]))
  const results = query ? products.slice(0, MAX_RESULTS) : []

  // Última opción: ver todos los resultados (o el catálogo si no hay coincidencias).
  const footer = results.length
    ? { label: `Ver todos los resultados (${products.length})`, url: productsUrl(query) }
    : { label: 'Ver todo el catálogo', url: ROUTES.PRODUCTS }
  const optionCount = results.length + 1
  const showPanel = isOpen && query.length > 0
  const optionId = (i) => `${listboxId}-option-${i}`

  // Cierra la lista al hacer clic fuera del buscador.
  useEffect(() => {
    if (!isOpen) return undefined
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  const goTo = (url) => {
    setIsOpen(false)
    setActiveIndex(-1)
    navigate(url)
    onNavigate?.()
  }

  const selectProduct = (product) => {
    setTerm(product.name)
    goTo(productsUrl(product.name))
  }

  const selectOption = (index) => {
    if (index >= 0 && index < results.length) selectProduct(results[index])
    else if (index === results.length) goTo(footer.url)
    else goTo(productsUrl(query))
  }

  const clear = () => {
    setTerm('')
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  const handleChange = (value) => {
    setTerm(value)
    setActiveIndex(-1)
    setIsOpen(true)
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setIsOpen(true)
        setActiveIndex((i) => (i + 1) % optionCount)
        break
      case 'ArrowUp':
        event.preventDefault()
        setIsOpen(true)
        setActiveIndex((i) => (i <= 0 ? optionCount - 1 : i - 1))
        break
      case 'Escape':
        if (showPanel) setIsOpen(false)
        else if (term) clear()
        break
      default:
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    selectOption(showPanel ? activeIndex : -1)
  }

  return (
    <form
      ref={rootRef}
      role="search"
      className={cn('product-search', `product-search--${variant}`, showPanel && 'is-open', className)}
      onSubmit={handleSubmit}
    >
      <SearchField
        inputRef={inputRef}
        value={term}
        onValueChange={handleChange}
        onClear={clear}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={showPanel && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {showPanel && (
        <div className="product-search__panel">
          {isLoading ? (
            <p className="product-search__status">Buscando…</p>
          ) : (
            results.length === 0 && (
              <p className="product-search__status">
                Sin resultados para <strong>«{query}»</strong>
              </p>
            )
          )}

          <ul id={listboxId} role="listbox" aria-label="Sugerencias de productos" className="product-search__list">
            {results.map((product, i) => (
              <li
                key={product.id}
                id={optionId(i)}
                role="option"
                aria-selected={i === activeIndex}
                className={cn('product-search__option', i === activeIndex && 'is-active')}
                onPointerDown={(e) => e.preventDefault()}
                onPointerEnter={() => setActiveIndex(i)}
                onClick={() => selectProduct(product)}
              >
                <span className="product-search__thumb">
                  <img src={product.image} alt="" loading="lazy" />
                </span>
                <span className="product-search__info">
                  <span className="product-search__name"><Highlight text={product.name} term={query} /></span>
                  <span className="product-search__meta">
                    {categoryNames[product.category]}
                    {product.stock <= 0 && <span className="product-search__out"> · Agotado</span>}
                  </span>
                </span>
                <span className="product-search__price">{formatCurrency(product.price)}</span>
              </li>
            ))}

            {!isLoading && (
              <li
                id={optionId(results.length)}
                role="option"
                aria-selected={activeIndex === results.length}
                className={cn('product-search__option product-search__all', activeIndex === results.length && 'is-active')}
                onPointerDown={(e) => e.preventDefault()}
                onPointerEnter={() => setActiveIndex(results.length)}
                onClick={() => goTo(footer.url)}
              >
                {footer.label}
                <Icon name="arrow" size={16} />
              </li>
            )}
          </ul>
        </div>
      )}
    </form>
  )
}
