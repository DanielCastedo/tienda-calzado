import { MODULES } from '@/constants'
import { execute, operations as ops } from '@/services/erp'

const log = (action, detail) => ({ module: MODULES.MATERIALS, action, detail })

export const materialsApi = {
  save: (data) => execute(ops.saveMaterial, data, (m) => log(data.id ? 'Editó material' : 'Registró material', `${m.code} · ${m.name}`)),
  registerMovement: (data, material) =>
    execute(ops.registerMaterialMovement, data, log(data.type === 'entrada' ? 'Registró entrada de material' : 'Registró salida de material', `${material.code} · ${data.qty} ${material.unit} · ${data.reason}`)),
}
