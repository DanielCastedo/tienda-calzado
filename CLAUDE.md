# Calzados Andino — Guía para continuar el desarrollo

React 19 + Vite 8 + React Router 7 (JS/JSX). Alias `@/` → `src/`. UI y textos en **español**.
Comandos: `npm install`, `npm run dev` (http://localhost:5173), `npm run build`, `npm run lint` (debe quedar sin errores).

## Arquitectura (respetarla)
- `src/components/ui/` UI global reutilizable (Button, Input, Select, Modal[size, footer], Icon, SearchField, Badge, Tabs, DataTable[búsqueda/orden/paginación/export Excel-PDF], Panel{PageHeader, Card, StatCard, EmptyState, DetailList}, Form{FormFields, FormModal por configuración}, Toast, PeriodFilter, SectionHeading, CallToAction). Exportados en `components/ui/index.js`.
- `src/components/charts/` BarChart, LineChart, RankingBars (SVG propio, serie única color `#c96a14`, tooltip, tabla oculta accesible).
- `src/components/layout/` Header/Footer/MainLayout (sitio público), BrandLogo, **AdminLayout** (menú lateral café + topbar; recibe user, roleLabel, navItems, onLogout, onResetDemo por props).
- `src/features/<modulo>/{components,hooks,services,index.js}`: una feature **no importa otra**; las **páginas** (`src/pages`) las componen. Solo se importa desde el `index.js` de cada feature.
- `src/content/*.js` textos editables del sitio público (sitio, inicio, nosotros, productos, pedidos). WhatsApp: 59177788862.
- `src/constants/` app, routes (`ROUTES`, `buildRoute`), **erp.js** (MODULES, ROLES, DEFAULT_PERMISSIONS, MATERIAL_CATEGORIES, UNITS, PRODUCTION_STAGES, PAYMENT_METHODS, etc.).
- `src/hooks/` useErp(selector), useToast, useAction (ejecuta + toast), useAsync, useToggle.
- `src/utils/` formatCurrency/Number/Percent, dates (formatDate, toInputDate, inRange, monthKey…), exporters (exportToExcel CSV `;`+BOM, exportToPdf = window.print), collections (indexById, sumBy, toOptions), normalizeText, cn.

## Backend simulado (`src/services/erp/`)
- `store.js`: estado en localStorage (`andino_erp_db_v1`), `erp.mutate(fn, log)` transaccional + bitácora, `erp.reset()`.
- `operations.js`: TODA la lógica de negocio (productos, categorías, materiales, movimientos, compras/pagos, fichas técnicas, `computeRequirements`, órdenes de producción start/advance/waste/finish/cancel, ajustes de inventario, ventas/cobros/devoluciones, finanzas, usuarios/permisos). Lanzan `BusinessError`.
- `inventory.js`: kardex (`moveMaterial`, `moveProduct`), `analytics.js`: cálculos para dashboard/finanzas/reportes (salesSummary, incomeStatement, topProducts, salesBySizeColor, materialConsumption, receivables, payables, lowStockMaterials, productStock…).
- `seed.js`: datos demo generados ejecutando las operaciones 120 días (verificado: 0 descuadres). Usuarios demo (pass `demo123`): admin@, gerente@, produccion@, almacen@, ventas@andino.bo.
- Patrón de service de feature: `execute(ops.X, payload, { module, action, detail })` (ver `features/products/services/productsAdminApi.js`).
- Tema claro del panel: clase `.theme-light` en `assets/styles/global.css` (tokens). Clases utilitarias admin en `AdminLayout.css` (grid-2, grid-3, select-sm, input-sm, icon-btn, text-danger…).

## Estado actual
HECHO: sitio público completo (inicio, nosotros, productos, pedidos→WhatsApp); núcleo ERP + seed; componentes UI/charts; AdminLayout; feature **auth** (AuthProvider, useAuth{user, can(module, 'view'|'edit'), login, loginAsRole, logout}, LoginView con accesos demo por rol); **dashboard** (DashboardView recibe `user`, `can`); **products admin** (ProductsAdminView, CategoriesModal); **materials** (MaterialsView); catálogo público ya lee del ERP.

PENDIENTE (en este orden):
1. CSS faltante en `AdminLayout.css`: `.form-note`, `.inline-form` (flex gap), `.simple-list` (lista con filas flex y borde).
2. Features: **production** (órdenes: lista, crear con matriz talla×color, detalle en `ROUTES.ADMIN_PRODUCTION_ORDER` con etapas, requerimientos/disponibilidad, iniciar, avanzar, merma, terminar, costos; pestaña Fichas técnicas), **inventory** (stock por modelo/talla/color, materia prima, Kardex, ajustes, alertas), **sales** (POS: buscar por código/nombre, talla/color con stock, carrito, descuento, método de pago, contado/crédito, comprobante imprimible; historial + devoluciones), **clients** (CRUD, historial de compras, cuentas por cobrar, registrar cobro), **suppliers** (CRUD, compras de materia prima, cuentas por pagar, pagos), **finance** (ingresos/gastos operativos, estado de resultados con analytics.incomeStatement, CxC/CxP), **users** (CRUD usuarios, matriz de permisos editable con ops.setPermission, bitácora `state.audit`), **reports** (10 reportes con PeriodFilter + DataTable exportName).
3. Rutas: `/login` → `pages/LoginPage` con `LoginView` (sin MainLayout); `/admin/*` → `routes/RequireAuth` + `routes/AdminShell` (usa useAuth, AdminLayout, nav filtrado por `can`, `erp.reset` con confirm) + guard por módulo; páginas en `src/pages/admin/*` pasando `canEdit={can(MODULE,'edit')}`. Agregar `AuthProvider` y `ToastProvider` en `App.jsx`. Actualizar `pages/LoginPage.jsx` (aún importa el LoginCard eliminado → **build roto hasta hacer esto**).
4. Verificar: `npm run lint`, `npm run build`, probar en navegador cada rol. Actualizar README.

Usuario: prefiere fondo café (#6d360a) en el sitio; alertas/“Agotado” en verde #027147 en el sitio público. No hacer commits sin pedirlo.
