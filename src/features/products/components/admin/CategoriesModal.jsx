import { useState } from 'react'
import { Button, Icon, Modal } from '@/components/ui'
import { useAction, useErp } from '@/hooks'
import { productsAdminApi } from '../../services/productsAdminApi'

/** Alta, edición y baja de categorías (deportivos, casuales, formales, botas, sandalias…). */
export function CategoriesModal({ onClose }) {
  const categories = useErp((s) => s.categories)
  const products = useErp((s) => s.products)
  const run = useAction()
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(null) // { id, name }

  const count = (id) => products.filter((p) => p.categoryId === id).length

  const add = (event) => {
    event.preventDefault()
    if (run(() => productsAdminApi.saveCategory({ name }), 'Categoría creada')) setName('')
  }

  const saveEdit = () => {
    if (run(() => productsAdminApi.saveCategory(editing), 'Categoría actualizada')) setEditing(null)
  }

  return (
    <Modal isOpen onClose={onClose} title="Categorías" footer={<Button variant="secondary" onClick={onClose}>Cerrar</Button>}>
      <form className="inline-form" onSubmit={add}>
        <input className="input-sm" placeholder="Nueva categoría (ej. Sandalias)" value={name} onChange={(e) => setName(e.target.value)} aria-label="Nombre de la categoría" />
        <Button type="submit" size="sm" disabled={!name.trim()}><Icon name="plus" size={16} /> Agregar</Button>
      </form>
      <ul className="simple-list">
        {categories.map((c) => (
          <li key={c.id}>
            {editing?.id === c.id ? (
              <>
                <input className="input-sm" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} aria-label="Nombre" autoFocus />
                <div className="cell-actions">
                  <Button size="sm" onClick={saveEdit}>Guardar</Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditing(null)}>Cancelar</Button>
                </div>
              </>
            ) : (
              <>
                <span className="cell-stack">
                  <strong>{c.name}</strong>
                  <span className="cell-muted">{count(c.id)} productos</span>
                </span>
                <div className="cell-actions">
                  <button type="button" className="icon-btn" title="Editar" onClick={() => setEditing({ id: c.id, name: c.name })}><Icon name="edit" size={18} /></button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    title={count(c.id) ? 'Tiene productos asociados' : 'Eliminar'}
                    disabled={count(c.id) > 0}
                    onClick={() => run(() => productsAdminApi.deleteCategory(c), 'Categoría eliminada')}
                  >
                    <Icon name="trash" size={18} />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </Modal>
  )
}
