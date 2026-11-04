import { useMemo, useState } from 'react'
import { Badge, Button, DataTable, FormModal, Icon, PageHeader, StatCard } from '@/components/ui'
import { DEFAULT_COLORS, DEFAULT_SIZES } from '@/constants'
import { useAction, useErp, useToast } from '@/hooks'
import { computeRequirements } from '@/services/erp'
import { formatCurrency, formatPercent, indexById, toOptions } from '@/utils'
import { productsAdminApi } from '../../services/productsAdminApi'
import { CategoriesModal } from './CategoriesModal'

const EMPTY = { code: '', name: '', brand: 'Andino', categoryId: '', description: '', image: '/images/zapato-hero.png', sizes: [38, 39, 40, 41, 42], colors: ['Negro'], productionCost: '', price: '', wholesalePrice: '', active: true }

const margin = (price, cost) => (Number(price) > 0 ? (Number(price) - Number(cost || 0)) / Number(price) : 0)

export function ProductsAdminView({ canEdit }) {
  const products = useErp((s) => s.products)
  const categories = useErp((s) => s.categories)
  const stock = useErp((s) => s.stock)
  const state = useErp()
  const toast = useToast()
  const run = useAction()

  const [editing, setEditing] = useState(null)
  const [showCategories, setShowCategories] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const categoryById = indexById(categories)
  const stockByProduct = useMemo(() => {
    const map = new Map()
    stock.forEach((s) => map.set(s.productId, (map.get(s.productId) ?? 0) + s.qty))
    return map
  }, [stock])

  const rows = products.filter(
    (p) => (!categoryFilter || p.categoryId === Number(categoryFilter)) && (!statusFilter || String(p.active) === statusFilter),
  )

  const fields = (values) => {
    const sheetCost = values.id ? computeRequirements(state, values.id, 1) : null
    return [
      { name: 'code', label: 'Código', required: true, placeholder: 'AND-010' },
      { name: 'name', label: 'Nombre del modelo', required: true },
      { name: 'brand', label: 'Marca', required: true },
      { name: 'categoryId', label: 'Categoría', type: 'select', required: true, options: toOptions(categories) },
      { name: 'description', label: 'Descripción', type: 'textarea', span: 'full' },
      { name: 'image', label: 'Imagen (ruta o URL)', span: 'full', help: 'Coloca la foto en public/images y escribe /images/archivo.png, o pega una URL.' },
      { name: 'sizes', label: 'Tallas', type: 'tags', numeric: true, required: true, suggestions: DEFAULT_SIZES, span: 'full' },
      { name: 'colors', label: 'Colores', type: 'tags', required: true, suggestions: DEFAULT_COLORS, span: 'full' },
      {
        name: 'productionCost',
        label: 'Costo de producción (Bs)',
        type: 'number',
        min: 0,
        step: '0.01',
        help: sheetCost?.sheet ? `Según ficha técnica: ${formatCurrency(sheetCost.materialCost + sheetCost.laborCost)} por par` : 'Sin ficha técnica aún',
      },
      { name: 'price', label: 'Precio de venta (Bs)', type: 'number', min: 0, step: '0.01', required: true },
      { name: 'wholesalePrice', label: 'Precio mayorista (Bs)', type: 'number', min: 0, step: '0.01' },
      { name: 'active', label: 'Producto activo (visible en ventas y tienda online)', type: 'checkbox' },
    ]
  }

  const columns = [
    { key: 'image', label: '', sortable: false, export: false, width: '60px', render: (p) => <img className="cell-thumb" src={p.image} alt="" /> },
    { key: 'code', label: 'Código', render: (p) => <span className="cell-strong">{p.code}</span> },
    { key: 'name', label: 'Modelo', render: (p) => <span className="cell-stack"><strong>{p.name}</strong><span className="cell-muted">{p.brand}</span></span> },
    { key: 'category', label: 'Categoría', value: (p) => categoryById.get(p.categoryId)?.name ?? '—' },
    { key: 'sizes', label: 'Tallas', value: (p) => `${p.sizes[0]}–${p.sizes[p.sizes.length - 1]}`, sortable: false },
    { key: 'colors', label: 'Colores', value: (p) => p.colors.join(', '), sortable: false },
    { key: 'productionCost', label: 'Costo', align: 'right', value: (p) => p.productionCost, render: (p) => formatCurrency(p.productionCost) },
    { key: 'price', label: 'Precio', align: 'right', value: (p) => p.price, render: (p) => <span className="cell-stack"><strong>{formatCurrency(p.price)}</strong><span className="cell-muted">May. {formatCurrency(p.wholesalePrice)}</span></span> },
    { key: 'margin', label: 'Margen', align: 'right', value: (p) => margin(p.price, p.productionCost), render: (p) => formatPercent(margin(p.price, p.productionCost)) },
    { key: 'stock', label: 'Stock', align: 'right', value: (p) => stockByProduct.get(p.id) ?? 0, render: (p) => { const q = stockByProduct.get(p.id) ?? 0; return <span className={q === 0 ? 'text-danger' : undefined}>{q} pares</span> } },
    { key: 'active', label: 'Estado', value: (p) => (p.active ? 'Activo' : 'Inactivo'), render: (p) => <Badge tone={p.active ? 'success' : 'neutral'}>{p.active ? 'Activo' : 'Inactivo'}</Badge> },
    canEdit && {
      key: 'actions',
      label: '',
      sortable: false,
      export: false,
      align: 'right',
      render: (p) => (
        <div className="cell-actions">
          <button type="button" className="icon-btn" title="Editar" onClick={() => setEditing({ ...p, categoryId: String(p.categoryId) })}><Icon name="edit" size={18} /></button>
          <button
            type="button"
            className="icon-btn"
            title={p.active ? 'Desactivar' : 'Activar'}
            onClick={() => run(() => productsAdminApi.setActive(p, !p.active), p.active ? 'Producto desactivado' : 'Producto activado')}
          >
            <Icon name="power" size={18} />
          </button>
        </div>
      ),
    },
  ].filter(Boolean)

  const handleSubmit = (values) => {
    productsAdminApi.save(values)
    toast.success(values.id ? 'Producto actualizado' : 'Producto registrado')
    setEditing(null)
  }

  return (
    <>
      <PageHeader
        icon="box"
        title="Productos"
        description="Modelos de calzado, categorías, tallas, colores y precios."
        actions={
          canEdit && (
            <>
              <Button variant="secondary" onClick={() => setShowCategories(true)}><Icon name="tag" size={18} /> Categorías</Button>
              <Button onClick={() => setEditing(EMPTY)}><Icon name="plus" size={18} /> Nuevo producto</Button>
            </>
          )
        }
      />

      <div className="stats-grid">
        <StatCard icon="box" label="Modelos registrados" value={products.length} hint={`${products.filter((p) => p.active).length} activos`} />
        <StatCard icon="tag" label="Categorías" value={categories.length} />
        <StatCard icon="warehouse" label="Pares en stock" value={[...stockByProduct.values()].reduce((a, b) => a + b, 0)} />
        <StatCard icon="alert" tone="warning" label="Modelos sin stock" value={products.filter((p) => p.active && !stockByProduct.get(p.id)).length} />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        exportName="productos"
        searchPlaceholder="Buscar por código, nombre o marca…"
        rowClassName={(p) => (!p.active ? 'row-muted' : undefined)}
        toolbar={
          <>
            <select className="select-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="Filtrar por categoría">
              <option value="">Todas las categorías</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filtrar por estado">
              <option value="">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </>
        }
      />

      {editing && (
        <FormModal title={editing.id ? `Editar ${editing.name}` : 'Nuevo producto'} size="lg" fields={fields} initialValues={editing} onSubmit={handleSubmit} onClose={() => setEditing(null)}>
          {(values) =>
            Number(values.price) > 0 && (
              <p className="form-note">
                Margen de ganancia: <strong>{formatPercent(margin(values.price, values.productionCost))}</strong> ({formatCurrency(Number(values.price) - Number(values.productionCost || 0))} por par)
              </p>
            )
          }
        </FormModal>
      )}
      {showCategories && <CategoriesModal onClose={() => setShowCategories(false)} />}
    </>
  )
}
