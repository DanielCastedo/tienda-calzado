import { useCallback } from 'react'
import { useToast } from './useToast'

/**
 * Ejecuta una acción mostrando el resultado en una notificación.
 *   const run = useAction()
 *   run(() => productsAdminApi.toggle(id), 'Producto actualizado')
 * Devuelve el resultado, o `undefined` si falló (el error se muestra al usuario).
 */
export function useAction() {
  const toast = useToast()
  return useCallback(
    (action, successMessage) => {
      try {
        const result = action()
        if (successMessage) toast.success(typeof successMessage === 'function' ? successMessage(result) : successMessage)
        return result ?? true
      } catch (error) {
        toast.error(error.message ?? 'Ocurrió un error')
        return undefined
      }
    },
    [toast],
  )
}
