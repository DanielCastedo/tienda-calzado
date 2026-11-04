/* ============================================================================
   PÁGINA PRODUCTOS + CATÁLOGO
   Los textos de la página se editan aquí.
   ℹ️ Los productos de abajo son solo los DATOS INICIALES de la demo. El catálogo
      real se administra en el panel: /admin/productos (y se refleja en la tienda).
   ⚠️ Los productos y precios son de EJEMPLO.

   Cada producto tiene:
     id              -> número único (no repetir)
     nombre, marca, descripcion
     categoria       -> debe coincidir con un `id` de la lista `categorias`
     precio          -> precio unitario en Bs
     precioMayorista -> precio por par al alcanzar el mínimo mayorista (ver pedidos.js)
     tallas          -> lista de tallas disponibles
     stock           -> pares disponibles (0 = agotado)
     imagen          -> ruta dentro de /public (ej: '/images/bota-cuero.png')
   ============================================================================ */

export const productosPagina = {
  etiqueta: 'Catálogo',
  titulo: 'Nuestros',
  resaltado: 'Productos',
  descripcion:
    'Calzado de cuero fabricado en Bolivia. Elige tu talla, agrégalo a tu pedido y envíalo por WhatsApp.',
  buscadorPlaceholder: 'Buscar por nombre o categoría',
  textoTodas: 'Todos',
  textoSinResultados: 'No encontramos productos con esos filtros.',
  textoAgotado: 'Agotado',
  textoAgregar: 'Agregar',
  textoAgregado: '¡Agregado!',
  textoTalla: 'Talla',
}

export const categorias = [
  { id: 'formal', nombre: 'Formal' },
  { id: 'casual', nombre: 'Casual' },
  { id: 'botas', nombre: 'Botas' },
  { id: 'escolar', nombre: 'Escolar' },
  { id: 'deportivo', nombre: 'Deportivo' },
]

export const productos = [
  {
    id: 1,
    nombre: 'Derby Clásico Cuero',
    marca: 'Andino',
    categoria: 'formal',
    precio: 459,
    precioMayorista: 390,
    tallas: [38, 39, 40, 41, 42, 43],
    stock: 24,
    imagen: '/images/zapato-hero.png',
    descripcion: 'Zapato formal de cuero con puntera reforzada y suela antideslizante.',
  },
  {
    id: 2,
    nombre: 'Oxford Ejecutivo',
    marca: 'Andino',
    categoria: 'formal',
    precio: 520,
    precioMayorista: 440,
    tallas: [39, 40, 41, 42, 43, 44],
    stock: 15,
    imagen: '/images/zapato-hero.png',
    descripcion: 'Diseño elegante para oficina y eventos, forro interior acolchado.',
  },
  {
    id: 3,
    nombre: 'Bota Illimani',
    marca: 'Andino',
    categoria: 'botas',
    precio: 689,
    precioMayorista: 590,
    tallas: [38, 39, 40, 41, 42],
    stock: 8,
    imagen: '/images/zapato-hero.png',
    descripcion: 'Bota de cuero resistente al frío, ideal para el altiplano.',
  },
  {
    id: 4,
    nombre: 'Casual Sajama',
    marca: 'Andino',
    categoria: 'casual',
    precio: 389,
    precioMayorista: 330,
    tallas: [37, 38, 39, 40, 41, 42],
    stock: 30,
    imagen: '/images/zapato-hero.png',
    descripcion: 'Comodidad para todo el día con plantilla anatómica.',
  },
  {
    id: 5,
    nombre: 'Escolar Resistente',
    marca: 'Andino',
    categoria: 'escolar',
    precio: 249,
    precioMayorista: 205,
    tallas: [32, 33, 34, 35, 36, 37, 38],
    stock: 60,
    imagen: '/images/zapato-hero.png',
    descripcion: 'Cuero lustrable y costura reforzada para todo el año escolar.',
  },
  {
    id: 6,
    nombre: 'Mocasín Titicaca',
    marca: 'Andino',
    categoria: 'casual',
    precio: 410,
    precioMayorista: 350,
    tallas: [39, 40, 41, 42, 43],
    stock: 0,
    imagen: '/images/zapato-hero.png',
    descripcion: 'Mocasín ligero de cuero flexible, sin cordones.',
  },
]
