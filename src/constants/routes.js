/** Rutas de la aplicación. Úsalas siempre en lugar de strings sueltos. */
export const ROUTES = {
  // Sitio público
  HOME: '/',
  ABOUT: '/nosotros',
  PRODUCTS: '/productos',
  ORDERS: '/pedidos',
  LOGIN: '/login',

  // Panel administrativo
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/productos',
  ADMIN_MATERIALS: '/admin/materia-prima',
  ADMIN_PRODUCTION: '/admin/produccion',
  ADMIN_PRODUCTION_ORDER: '/admin/produccion/orden/:id',
  ADMIN_INVENTORY: '/admin/inventario',
  ADMIN_POS: '/admin/ventas',
  ADMIN_SALES: '/admin/ventas/historial',
  ADMIN_CLIENTS: '/admin/clientes',
  ADMIN_SUPPLIERS: '/admin/proveedores',
  ADMIN_FINANCE: '/admin/finanzas',
  ADMIN_USERS: '/admin/usuarios',
  ADMIN_REPORTS: '/admin/reportes',
}

/** Construye una ruta con parámetros: buildRoute(ROUTES.ADMIN_PRODUCTION_ORDER, { id: 3 }) */
export const buildRoute = (route, params = {}) =>
  Object.entries(params).reduce((path, [key, value]) => path.replace(`:${key}`, value), route)
