import { httpClient } from '@/services'
import { erp } from '@/services/erp'
import { delay } from '@/utils'

/**
 * Catálogo de la tienda online.
 * Mientras no exista backend, sale del ERP simulado: los productos que se
 * registran o desactivan en el panel (/admin/productos) se reflejan aquí.
 */
const USE_MOCK = true

export const productsApi = {
  async getCatalog() {
    if (!USE_MOCK) {
      const [products, categories] = await Promise.all([httpClient.get('/products'), httpClient.get('/categories')])
      return { products, categories }
    }
    await delay(150)
    const state = erp.getState()
    const stockOf = (id) => state.stock.filter((s) => s.productId === id).reduce((sum, s) => sum + s.qty, 0)
    const products = state.products
      .filter((p) => p.active)
      .map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: String(p.categoryId),
        price: p.price,
        wholesalePrice: p.wholesalePrice,
        sizes: p.sizes,
        stock: stockOf(p.id),
        image: p.image,
        description: p.description ?? '',
      }))
    const used = new Set(products.map((p) => p.category))
    const categories = state.categories.filter((c) => used.has(String(c.id))).map((c) => ({ id: String(c.id), name: c.name }))
    return { products, categories }
  },
}
