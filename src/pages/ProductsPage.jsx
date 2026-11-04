import { useSearchParams } from 'react-router-dom'
import { SectionHeading } from '@/components/ui'
import { productosPagina as texts } from '@/content'
import { AddToOrderButton, OrderBar } from '@/features/orders'
import { ProductCatalog } from '@/features/products'

/**
 * La página compone dos features independientes:
 * el catálogo (products) y el botón/barra del pedido (orders).
 * Los filtros viven en la URL: /productos?q=bota&categoria=formal
 */
export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const category = searchParams.get('categoria') ?? ''

  const updateParam = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )
  }

  return (
    <div className="page">
      <SectionHeading
        as="h1"
        eyebrow={texts.etiqueta}
        title={texts.titulo}
        highlight={texts.resaltado}
        description={texts.descripcion}
      />
      <ProductCatalog
        search={search}
        category={category}
        onSearchChange={(value) => updateParam('q', value)}
        onCategoryChange={(value) => updateParam('categoria', value)}
        renderActions={(product) => <AddToOrderButton product={product} />}
      />
      <OrderBar />
    </div>
  )
}
