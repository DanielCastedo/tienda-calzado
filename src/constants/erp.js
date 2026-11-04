/* ============================================================================
   Constantes del sistema administrativo (ERP)
   ============================================================================ */

/** Módulos del panel. La clave se usa en permisos, rutas y bitácora. */
export const MODULES = {
  DASHBOARD: 'dashboard',
  PRODUCTS: 'productos',
  MATERIALS: 'materiales',
  PRODUCTION: 'produccion',
  INVENTORY: 'inventario',
  SALES: 'ventas',
  CLIENTS: 'clientes',
  SUPPLIERS: 'proveedores',
  FINANCE: 'finanzas',
  USERS: 'usuarios',
  REPORTS: 'reportes',
}

export const MODULE_LABELS = {
  dashboard: 'Dashboard',
  productos: 'Productos',
  materiales: 'Materia prima',
  produccion: 'Producción',
  inventario: 'Inventario',
  ventas: 'Ventas',
  clientes: 'Clientes',
  proveedores: 'Proveedores y compras',
  finanzas: 'Finanzas',
  usuarios: 'Usuarios y permisos',
  reportes: 'Reportes',
}

/** Niveles de acceso por módulo. */
export const ACCESS = { NONE: 'none', VIEW: 'view', EDIT: 'edit' }

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'gerente',
  PRODUCTION: 'produccion',
  WAREHOUSE: 'almacen',
  SELLER: 'vendedor',
}

export const ROLE_LABELS = {
  admin: 'Administrador',
  gerente: 'Gerente',
  produccion: 'Encargado de producción',
  almacen: 'Encargado de almacén',
  vendedor: 'Vendedor',
}

export const ROLE_DESCRIPTIONS = {
  admin: 'Acceso total, incluida la gestión de usuarios.',
  gerente: 'Supervisa todo el negocio, finanzas y reportes.',
  produccion: 'Órdenes de producción, fichas técnicas y consumo.',
  almacen: 'Materia prima, inventario, proveedores y compras.',
  vendedor: 'Punto de venta, clientes y cobros.',
}

const all = (level) => Object.fromEntries(Object.values(MODULES).map((m) => [m, level]))

/** Permisos por defecto (editables en Usuarios > Roles y permisos). */
export const DEFAULT_PERMISSIONS = {
  admin: all(ACCESS.EDIT),
  gerente: { ...all(ACCESS.EDIT), usuarios: ACCESS.VIEW },
  produccion: {
    ...all(ACCESS.NONE),
    dashboard: ACCESS.VIEW,
    productos: ACCESS.VIEW,
    materiales: ACCESS.VIEW,
    produccion: ACCESS.EDIT,
    inventario: ACCESS.VIEW,
    reportes: ACCESS.VIEW,
  },
  almacen: {
    ...all(ACCESS.NONE),
    dashboard: ACCESS.VIEW,
    productos: ACCESS.VIEW,
    materiales: ACCESS.EDIT,
    inventario: ACCESS.EDIT,
    proveedores: ACCESS.EDIT,
    reportes: ACCESS.VIEW,
  },
  vendedor: {
    ...all(ACCESS.NONE),
    dashboard: ACCESS.VIEW,
    productos: ACCESS.VIEW,
    inventario: ACCESS.VIEW,
    ventas: ACCESS.EDIT,
    clientes: ACCESS.EDIT,
  },
}

export const MATERIAL_CATEGORIES = [
  { id: 'cuero', name: 'Cuero' },
  { id: 'tela', name: 'Tela / Forro' },
  { id: 'suelas', name: 'Suelas' },
  { id: 'plantillas', name: 'Plantillas' },
  { id: 'cordones', name: 'Cordones' },
  { id: 'pegamento', name: 'Pegamento' },
  { id: 'hilos', name: 'Hilos' },
  { id: 'accesorios', name: 'Accesorios' },
  { id: 'otros', name: 'Otros' },
]

export const UNITS = [
  { id: 'pie2', name: 'Pie² (pie cuadrado)', short: 'pie²' },
  { id: 'm', name: 'Metro', short: 'm' },
  { id: 'par', name: 'Par', short: 'par' },
  { id: 'und', name: 'Unidad', short: 'und' },
  { id: 'kg', name: 'Kilogramo', short: 'kg' },
  { id: 'lt', name: 'Litro', short: 'lt' },
  { id: 'cono', name: 'Cono', short: 'cono' },
]

export const PRODUCTION_STAGES = [
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'corte', name: 'Corte' },
  { id: 'aparado', name: 'Aparado' },
  { id: 'armado', name: 'Armado' },
  { id: 'acabado', name: 'Acabado' },
  { id: 'terminado', name: 'Terminado' },
]

export const PAYMENT_METHODS = [
  { id: 'efectivo', name: 'Efectivo' },
  { id: 'qr', name: 'QR' },
  { id: 'transferencia', name: 'Transferencia' },
  { id: 'tarjeta', name: 'Tarjeta' },
]

export const PAYMENT_TYPES = [
  { id: 'contado', name: 'Contado' },
  { id: 'credito', name: 'Crédito' },
]

export const EXPENSE_CATEGORIES = [
  'Alquiler',
  'Servicios básicos',
  'Sueldos',
  'Transporte',
  'Mantenimiento',
  'Publicidad',
  'Impuestos',
  'Otros',
]

export const INCOME_CATEGORIES = ['Reparaciones', 'Servicios', 'Otros ingresos']

export const DEFAULT_SIZES = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]
export const DEFAULT_COLORS = ['Negro', 'Café', 'Marrón', 'Miel', 'Blanco', 'Azul']

/** Costo de mano de obra por defecto por par (Bs) si la ficha técnica no define uno. */
export const DEFAULT_LABOR_COST = 35
