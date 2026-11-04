import { useSyncExternalStore } from 'react'
import { erp } from '@/services/erp'

/**
 * Lee datos del ERP y re-renderiza cuando cambian.
 * El selector debe devolver una parte del estado (no crear objetos nuevos):
 *   const products = useErp((s) => s.products)
 * Para datos derivados usa useMemo sobre lo que devuelve.
 */
export function useErp(selector = (state) => state) {
  return useSyncExternalStore(erp.subscribe, () => selector(erp.getState()))
}
