import { categorias, productos } from '@/content'
import { httpClient } from '@/services'
import { delay } from '@/utils'

/**
 * Mientras no exista backend, el catálogo sale de src/content/productos.js.
 * Para usar la API real cambia USE_MOCK a false.
 */
const USE_MOCK = true

/** Convierte el formato editable (en español) al modelo interno de la app. */
const toProduct = (p) => ({
  id: p.id,
  name: p.nombre,
  brand: p.marca,
  category: p.categoria,
  price: p.precio,
  wholesalePrice: p.precioMayorista ?? p.precio,
  sizes: p.tallas ?? [],
  stock: p.stock ?? 0,
  image: p.imagen,
  description: p.descripcion ?? '',
})

const toCategory = (c) => ({ id: c.id, name: c.nombre })

export const productsApi = {
  async getCatalog() {
    if (USE_MOCK) {
      await delay(250)
      return { products: productos.map(toProduct), categories: categorias.map(toCategory) }
    }
    const [products, categories] = await Promise.all([
      httpClient.get('/products'),
      httpClient.get('/categories'),
    ])
    return { products, categories }
  },
}
