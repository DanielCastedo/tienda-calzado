const STORAGE_KEY = 'andino_pedido'

/** Persiste el pedido en el navegador para no perderlo al recargar. */
export const orderStorage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const items = raw ? JSON.parse(raw) : []
      return Array.isArray(items) ? items : []
    } catch {
      return []
    }
  },

  save(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Modo privado o almacenamiento bloqueado: el pedido vive solo en memoria.
    }
  },
}
