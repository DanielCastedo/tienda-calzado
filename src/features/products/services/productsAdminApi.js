import { MODULES } from '@/constants'
import { execute, operations as ops } from '@/services/erp'

const log = (action, detail) => ({ module: MODULES.PRODUCTS, action, detail })

/** Gestión de productos del panel. Con API real: POST/PUT /products, etc. */
export const productsAdminApi = {
  save: (data) => execute(ops.saveProduct, data, (p) => log(data.id ? 'Editó producto' : 'Registró producto', `${p.code} · ${p.name}`)),
  setActive: (product, active) =>
    execute(ops.setProductActive, { productId: product.id, active }, log(active ? 'Activó producto' : 'Desactivó producto', product.code)),
  saveCategory: (data) => execute(ops.saveCategory, data, (c) => log(data.id ? 'Editó categoría' : 'Creó categoría', c.name)),
  deleteCategory: (category) => execute(ops.deleteCategory, { id: category.id }, log('Eliminó categoría', category.name)),
}
