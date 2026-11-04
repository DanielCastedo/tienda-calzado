import { MODULES } from '@/constants'
import { BusinessError, DEMO_PASSWORD, DEMO_USERS, erp, session } from '@/services/erp'

/**
 * Autenticación contra los usuarios del ERP simulado.
 * Con un backend real, login() haría POST /auth/login y guardaría el token.
 */
export const authApi = {
  login(email, password) {
    const user = erp.getState().users.find((u) => u.email === String(email).trim().toLowerCase())
    if (!user || user.password !== password) throw new BusinessError('Correo o contraseña incorrectos')
    if (!user.active) throw new BusinessError('Tu usuario está desactivado. Consulta al administrador.')
    session.set({ userId: user.id, loggedAt: new Date().toISOString() })
    erp.mutate(() => {}, { module: MODULES.USERS, action: 'Inició sesión', detail: user.email })
    return user
  },

  /** Acceso directo de demostración por rol. */
  loginAsRole(role) {
    const demo = DEMO_USERS.find((u) => u.role === role)
    const user = erp.getState().users.find((u) => u.email === demo?.email) ?? erp.getState().users.find((u) => u.role === role && u.active)
    if (!user) throw new BusinessError('No hay un usuario demo para ese rol')
    return this.login(user.email, user.password ?? DEMO_PASSWORD)
  },

  logout() {
    if (session.userId()) erp.mutate(() => {}, { module: MODULES.USERS, action: 'Cerró sesión' })
    session.clear()
  },
}

export { DEMO_USERS, DEMO_PASSWORD }
