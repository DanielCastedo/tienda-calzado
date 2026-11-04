import { useState } from 'react'
import { Badge, Button, DataTable, FormModal, Icon, PageHeader, StatCard, Tabs } from '@/components/ui'
import { MATERIAL_CATEGORIES, UNITS } from '@/constants'
import { useErp, useToast } from '@/hooks'
import { formatCurrency, formatDateTime, formatNumber, indexById, sumBy, toOptions } from '@/utils'
import { materialsApi } from '../services/materialsApi'

const categoryName = Object.fromEntries(MATERIAL_CATEGORIES.map((c) => [c.id, c.name]))
const unitShort = Object.fromEntries(UNITS.map((u) => [u.id, u.short]))
const EMPTY = { code: '', name: '', categoryId: 'cuero', unit: 'pie2', stock: '', minStock: '', unitCost: '', supplierId: '' }

const REASONS = {
  entrada: ['Compra directa', 'Devolución de producción', 'Donación / muestra', 'Otro'],
  salida: ['Uso en taller', 'Producto dañado', 'Muestra', 'Otro'],
}

export function MaterialsView({ canEdit }) {
  const materials = useErp((s) => s.materials)
  const suppliers = useErp((s) => s.suppliers)
  const movements = useErp((s) => s.movements)
  const users = useErp((s) => s.users)
  const toast = useToast()

  const [tab, setTab] = useState('materials')
  const [editing, setEditing] = useState(null)
  const [moving, setMoving] = useState(null) // { materialId, type }
  const [categoryFilter, setCategoryFilter] = useState('')
  const [onlyLow, setOnlyLow] = useState(false)
  const [historyMaterial, setHistoryMaterial] = useState('')

  const supplierById = indexById(suppliers)
  const materialById = indexById(materials)
  const userById = indexById(users)
  const low = materials.filter((m) => m.stock <= m.minStock)

  const rows = materials.filter((m) => (!categoryFilter || m.categoryId === categoryFilter) && (!onlyLow || m.stock <= m.minStock))
  const history = movements.filter((m) => m.itemType === 'material' && (!historyMaterial || m.itemId === Number(historyMaterial)))

  const materialFields = (values) => [
    { name: 'code', label: 'Código', required: true, placeholder: 'MP-020' },
    { name: 'name', label: 'Nombre', required: true },
    { name: 'categoryId', label: 'Clasificación', type: 'select', required: true, options: MATERIAL_CATEGORIES.map((c) => ({ value: c.id, label: c.name })) },
    { name: 'unit', label: 'Unidad de medida', type: 'select', required: true, options: UNITS.map((u) => ({ value: u.id, label: u.name })) },
    !values.id && { name: 'stock', label: 'Stock inicial', type: 'number', min: 0, step: '0.001' },
    { name: 'minStock', label: 'Stock mínimo', type: 'number', min: 0, step: '0.001', required: true, help: 'Al llegar a este nivel se genera una alerta.' },
    { name: 'unitCost', label: 'Costo unitario (Bs)', type: 'number', min: 0, step: '0.01', required: true },
    { name: 'supplierId', label: 'Proveedor habitual', type: 'select', options: toOptions(suppliers), placeholder: 'Sin proveedor' },
  ]

  const movementFields = (values) => [
    { name: 'materialId', label: 'Material', type: 'select', required: true, span: 'full', options: materials.map((m) => ({ value: String(m.id), label: `${m.code} · ${m.name} (stock ${formatNumber(m.stock)} ${unitShort[m.unit]})` })) },
    { name: 'type', label: 'Tipo', type: 'select', required: true, options: [{ value: 'entrada', label: 'Entrada (+)' }, { value: 'salida', label: 'Salida (−)' }] },
    { name: 'qty', label: 'Cantidad', type: 'number', min: 0, step: '0.001', required: true },
    { name: 'reason', label: 'Motivo', type: 'select', required: true, options: REASONS[values.type ?? 'entrada'].map((r) => ({ value: r, label: r })) },
    values.type === 'entrada' && { name: 'unitCost', label: 'Costo unitario (Bs)', type: 'number', min: 0, step: '0.01', help: 'Actualiza el costo promedio.' },
  ]

  const columns = [
    { key: 'code', label: 'Código', render: (m) => <span className="cell-strong">{m.code}</span> },
    { key: 'name', label: 'Material', render: (m) => <span className="cell-stack"><strong>{m.name}</strong><span className="cell-muted">{categoryName[m.categoryId]}</span></span> },
    { key: 'category', label: 'Clasificación', value: (m) => categoryName[m.categoryId] },
    { key: 'stock', label: 'Existencia', align: 'right', value: (m) => m.stock, render: (m) => <span className={m.stock <= m.minStock ? 'text-danger' : 'cell-strong'}>{formatNumber(m.stock)} {unitShort[m.unit]}</span> },
    { key: 'minStock', label: 'Mínimo', align: 'right', value: (m) => m.minStock, render: (m) => `${formatNumber(m.minStock)} ${unitShort[m.unit]}` },
    { key: 'unitCost', label: 'Costo unit.', align: 'right', value: (m) => m.unitCost, render: (m) => formatCurrency(m.unitCost) },
    { key: 'value', label: 'Valor', align: 'right', value: (m) => m.stock * m.unitCost, render: (m) => formatCurrency(m.stock * m.unitCost) },
    { key: 'supplier', label: 'Proveedor', value: (m) => supplierById.get(m.supplierId)?.name ?? '—' },
    { key: 'status', label: 'Estado', value: (m) => (m.stock <= m.minStock ? 'Stock bajo' : 'OK'), render: (m) => (m.stock <= m.minStock ? <Badge tone="danger">Stock bajo</Badge> : <Badge tone="success">OK</Badge>) },
    canEdit && {
      key: 'actions',
      label: '',
      sortable: false,
      export: false,
      render: (m) => (
        <div className="cell-actions">
          <button type="button" className="icon-btn" title="Registrar entrada" onClick={() => setMoving({ materialId: String(m.id), type: 'entrada', reason: REASONS.entrada[0] })}><Icon name="plus" size={18} /></button>
          <button type="button" className="icon-btn" title="Registrar salida" onClick={() => setMoving({ materialId: String(m.id), type: 'salida', reason: REASONS.salida[0] })}><Icon name="minus" size={18} /></button>
          <button type="button" className="icon-btn" title="Editar" onClick={() => setEditing({ ...m, supplierId: m.supplierId ? String(m.supplierId) : '' })}><Icon name="edit" size={18} /></button>
        </div>
      ),
    },
  ].filter(Boolean)

  const historyColumns = [
    { key: 'date', label: 'Fecha', value: (m) => m.date, render: (m) => formatDateTime(m.date) },
    { key: 'material', label: 'Material', value: (m) => materialById.get(m.itemId)?.name ?? '—' },
    { key: 'type', label: 'Tipo', value: (m) => m.type, render: (m) => <Badge tone={m.type === 'entrada' ? 'success' : m.type === 'salida' ? 'warning' : 'info'}>{m.type}</Badge> },
    { key: 'reason', label: 'Motivo', render: (m) => <span className="cell-stack">{m.reason}{m.ref && <span className="cell-muted">{m.ref}</span>}</span> },
    { key: 'qty', label: 'Cantidad', align: 'right', value: (m) => m.qty, render: (m) => <span className={m.qty < 0 ? 'text-danger' : 'text-success'}>{m.qty > 0 ? '+' : ''}{formatNumber(m.qty)} {unitShort[materialById.get(m.itemId)?.unit]}</span> },
    { key: 'balance', label: 'Saldo', align: 'right', value: (m) => m.balance, render: (m) => formatNumber(m.balance) },
    { key: 'user', label: 'Usuario', value: (m) => userById.get(m.userId)?.name ?? 'Sistema' },
  ]

  const saveMaterial = (values) => {
    materialsApi.save(values)
    toast.success(values.id ? 'Material actualizado' : 'Material registrado')
    setEditing(null)
  }

  const saveMovement = (values) => {
    const material = materialById.get(Number(values.materialId))
    materialsApi.registerMovement(values, material)
    toast.success(`${values.type === 'entrada' ? 'Entrada' : 'Salida'} registrada: ${values.qty} ${unitShort[material.unit]} de ${material.name}`)
    setMoving(null)
  }

  return (
    <>
      <PageHeader
        icon="layers"
        title="Materia prima"
        description="Materiales e insumos: existencias, stock mínimo, entradas, salidas y proveedores."
        actions={
          canEdit && (
            <>
              <Button variant="secondary" onClick={() => setMoving({ type: 'entrada', reason: REASONS.entrada[0] })}><Icon name="refresh" size={18} /> Entrada / salida</Button>
              <Button onClick={() => setEditing(EMPTY)}><Icon name="plus" size={18} /> Nuevo material</Button>
            </>
          )
        }
      />

      <div className="stats-grid">
        <StatCard icon="layers" label="Materiales registrados" value={materials.length} />
        <StatCard icon="wallet" label="Valor del inventario" value={formatCurrency(sumBy(materials, (m) => m.stock * m.unitCost))} />
        <StatCard icon="alert" tone={low.length ? 'danger' : 'success'} label="Con stock bajo" value={low.length} hint={low.map((m) => m.name).slice(0, 2).join(', ')} />
        <StatCard icon="truck" label="Proveedores" value={suppliers.length} />
      </div>

      <Tabs
        tabs={[
          { id: 'materials', label: 'Materiales', count: materials.length },
          { id: 'history', label: 'Historial de movimientos' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'materials' ? (
        <DataTable
          columns={columns}
          rows={rows}
          exportName="materia-prima"
          searchPlaceholder="Buscar material…"
          rowClassName={(m) => (m.stock <= m.minStock ? 'row-alert' : undefined)}
          toolbar={
            <>
              <select className="select-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="Clasificación">
                <option value="">Todas las clasificaciones</option>
                {MATERIAL_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <label className="checkbox-field">
                <input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} />
                <span>Solo stock bajo</span>
              </label>
            </>
          }
        />
      ) : (
        <DataTable
          columns={historyColumns}
          rows={history}
          exportName="movimientos-materia-prima"
          searchPlaceholder="Buscar por motivo o referencia…"
          toolbar={
            <select className="select-sm" value={historyMaterial} onChange={(e) => setHistoryMaterial(e.target.value)} aria-label="Material">
              <option value="">Todos los materiales</option>
              {materials.map((m) => <option key={m.id} value={m.id}>{m.code} · {m.name}</option>)}
            </select>
          }
        />
      )}

      {editing && (
        <FormModal title={editing.id ? `Editar ${editing.name}` : 'Nuevo material'} size="lg" fields={materialFields} initialValues={editing} onSubmit={saveMaterial} onClose={() => setEditing(null)} />
      )}
      {moving && (
        <FormModal title="Registrar entrada / salida" fields={movementFields} initialValues={moving} onSubmit={saveMovement} onClose={() => setMoving(null)} submitLabel="Registrar" />
      )}
    </>
  )
}
