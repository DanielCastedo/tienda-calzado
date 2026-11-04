import { useCallback, useMemo, useState } from 'react'
import { ACCESS, ROLE_LABELS } from '@/constants'
import { useErp } from '@/hooks'
import { session } from '@/services/erp'
import { AuthContext } from '../hooks/authContext'
import { authApi } from '../services/authApi'

export function AuthProvider({ children }) {
  const [current, setCurrent] = useState(() => session.get())
  const users = useErp((s) => s.users)
  const permissions = useErp((s) => s.permissions)

  // Si el usuario fue desactivado o eliminado, la sesión deja de ser válida.
  const user = current ? (users.find((u) => u.id === current.userId && u.active) ?? null) : null
  const rolePermissions = user ? permissions[user.role] : null

  const can = useCallback(
    (module, level = ACCESS.VIEW) => {
      const access = rolePermissions?.[module] ?? ACCESS.NONE
      return level === ACCESS.EDIT ? access === ACCESS.EDIT : access !== ACCESS.NONE
    },
    [rolePermissions],
  )

  const login = useCallback((email, password) => {
    const logged = authApi.login(email, password)
    setCurrent(session.get())
    return logged
  }, [])

  const loginAsRole = useCallback((role) => {
    const logged = authApi.loginAsRole(role)
    setCurrent(session.get())
    return logged
  }, [])

  const logout = useCallback(() => {
    authApi.logout()
    setCurrent(null)
  }, [])

  const value = useMemo(
    () => ({ user, roleLabel: user ? ROLE_LABELS[user.role] : '', can, login, loginAsRole, logout }),
    [user, can, login, loginAsRole, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
