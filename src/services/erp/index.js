// Backend simulado del ERP (localStorage). Ver store.js.
import { erp } from './store'

/**
 * Ejecuta una operación de negocio como una transacción y la registra en la bitácora.
 *   execute(operations.saveProduct, data, { module: 'productos', action: 'Guardó producto', detail: data.name })
 */
export const execute = (operation, payload, log) => erp.mutate((draft, ctx) => operation(draft, payload, ctx), log)

export { erp }
export * as analytics from './analytics'
export { session } from './session'
export { BusinessError, productStockTotal } from './inventory'
export { computeRequirements, saleBalance } from './operations'
export * as operations from './operations'
export { DEMO_USERS, DEMO_PASSWORD } from './seed'
