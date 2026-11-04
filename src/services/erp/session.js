/** Sesión del usuario del panel (persistida en el navegador). */
const SESSION_KEY = 'andino_session'

export const session = {
  get() {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  set(value) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(value))
    } catch {
      /* almacenamiento bloqueado: la sesión dura solo en memoria */
    }
  },
  clear() {
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignorar */
    }
  },
  /** Id del usuario actual (para registrar en la bitácora quién hizo cada operación). */
  userId() {
    return this.get()?.userId ?? null
  },
}
