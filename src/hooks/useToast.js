import { createContext, useContext } from 'react'

export const ToastContext = createContext(null)

/**
 * Notificaciones flotantes. Requiere <ToastProvider>.
 *   const toast = useToast(); toast.success('Guardado'); toast.error('Algo falló')
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return context
}
