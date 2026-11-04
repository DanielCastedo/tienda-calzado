import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

/**
 * Usuario actual y permisos.
 *   const { user, can, login, logout } = useAuth()
 *   can('ventas')          -> puede ver el módulo
 *   can('ventas', 'edit')  -> puede registrar / modificar
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return context
}
