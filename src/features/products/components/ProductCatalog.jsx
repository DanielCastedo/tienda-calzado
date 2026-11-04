import { Button } from '@/components/ui'
import { productosPagina as texts } from '@/content'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from './ProductCard'
import { ProductFilters } from './ProductFilters'
import './ProductCatalog.css'

/**
 * Catálogo con buscador y filtro por categoría.
 * Los filtros son controlados desde fuera (la página los guarda en la URL).
 * `renderActions(product)` permite inyectar acciones sin acoplar esta feature a otras.
 */
export function ProductCatalog({ search, category, onSearchChange, onCategoryChange, renderActions }) {
  const { products, categories, isLoading, error, refetch } = useProducts({ search, category })
  const categoryNames = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  return (
    <section className="catalog" aria-label="Catálogo de productos">
      <ProductFilters
        search={search}
        onSearchChange={onSearchChange}
        category={category}
        onCategoryChange={onCategoryChange}
        categories={categories}
        searchPlaceholder={texts.buscadorPlaceholder}
        allLabel={texts.textoTodas}
      />

      {isLoading ? (
        <p className="catalog__status">Cargando productos…</p>
      ) : error ? (
        <div className="catalog__status">
          <p>No se pudieron cargar los productos.</p>
          <Button variant="secondary" onClick={() => refetch().catch(() => {})}>Reintentar</Button>
        </div>
      ) : products.length === 0 ? (
        <p className="catalog__status">{texts.textoSinResultados}</p>
      ) : (
        <>
          <p className="catalog__count">
            {products.length} {products.length === 1 ? 'modelo' : 'modelos'}
          </p>
          <div className="catalog__grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryNames[product.category]}
                actions={renderActions?.(product)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
