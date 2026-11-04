import { formatCurrency } from '@/utils'

/**
 * Tarjeta de producto (presentacional).
 * `actions` es un slot: la página decide qué botones mostrar (ej. "Agregar al pedido").
 */
export function ProductCard({ product, categoryName, actions }) {
  const isOutOfStock = product.stock <= 0
  const hasWholesale = product.wholesalePrice < product.price

  return (
    <article className="product-card">
      <div className="product-card__media">
        {categoryName && <span className="product-card__category">{categoryName}</span>}
        {isOutOfStock && <span className="product-card__badge">Agotado</span>}
        <img className="product-card__image" src={product.image} alt={product.name} loading="lazy" />
      </div>

      <div className="product-card__body">
        <p className="product-card__brand">{product.brand}</p>
        <h3 className="product-card__name">{product.name}</h3>
        {product.description && <p className="product-card__description">{product.description}</p>}

        {product.sizes.length > 0 && (
          <p className="product-card__sizes">
            Tallas {product.sizes[0]} – {product.sizes[product.sizes.length - 1]}
          </p>
        )}

        <div className="product-card__prices">
          <strong className="product-card__price">{formatCurrency(product.price)}</strong>
          {hasWholesale && (
            <span className="product-card__wholesale">Mayorista {formatCurrency(product.wholesalePrice)}</span>
          )}
        </div>

        {actions && <div className="product-card__actions">{actions}</div>}
      </div>
    </article>
  )
}
