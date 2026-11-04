import { useMemo } from 'react'
import { useAsync } from '@/hooks'
import { normalizeText as normalize } from '@/utils'
import { productsApi } from '../services/productsApi'

/** Catálogo filtrado por texto (ignora tildes y mayúsculas) y por categoría. */
export function useProducts({ search = '', category = '' } = {}) {
  const { data, error, isLoading, execute } = useAsync(productsApi.getCatalog)

  const categories = useMemo(() => data?.categories ?? [], [data])

  const products = useMemo(() => {
    const all = data?.products ?? []
    const term = normalize(search.trim())
    const categoryNames = Object.fromEntries(categories.map((c) => [c.id, c.name]))

    return all.filter((product) => {
      if (category && product.category !== category) return false
      if (!term) return true
      return [product.name, product.brand, categoryNames[product.category], product.description]
        .some((field) => normalize(field).includes(term))
    })
  }, [data, categories, search, category])

  return { products, categories, isLoading, error, refetch: execute }
}
