// API pública de la feature "products".
// El resto de la app solo debe importar desde '@/features/products'.
export { ProductCatalog } from './components/ProductCatalog'
export { ProductCard } from './components/ProductCard'
export { ProductSearch } from './components/ProductSearch'
export { useProducts } from './hooks/useProducts'
export { productsApi } from './services/productsApi'
