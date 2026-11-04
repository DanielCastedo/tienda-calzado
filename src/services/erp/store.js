/* ============================================================================
   "Backend" simulado del ERP.
   Guarda la base de datos en localStorage y notifica a React en cada cambio.
   Cuando exista una API real, los services de cada feature dejarán de usar
   este store y llamarán a httpClient; los componentes no cambian.
   ============================================================================ */
import { audit } from './records'
import { session } from './session'
import { createSeed } from './seed'

const STORAGE_KEY = 'andino_erp_db_v1'

const listeners = new Set()
let state = load()

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* datos corruptos o almacenamiento bloqueado: se regenera la demo */
  }
  const seed = createSeed()
  persist(seed)
  return seed
}

function persist(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* sin almacenamiento: los cambios viven en memoria */
  }
}

function emit() {
  listeners.forEach((listener) => listener())
}

export const erp = {
  getState: () => state,

  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  /**
   * Ejecuta una operación sobre una copia del estado y la confirma solo si no falla
   * (como una transacción). Si se indica `log`, queda registrada en la bitácora.
   * @returns el valor que devuelva `operation`
   */
  mutate(operation, log) {
    const draft = structuredClone(state)
    const ctx = { userId: session.userId(), date: new Date().toISOString() }
    const result = operation(draft, ctx)
    if (log) {
      const entry = typeof log === 'function' ? log(result) : log
      audit(draft, { ...entry, userId: ctx.userId, date: ctx.date })
    }
    state = draft
    persist(state)
    emit()
    return result
  },

  /** Restaura los datos de demostración. */
  reset() {
    state = createSeed()
    persist(state)
    emit()
  },
}

// Sincroniza entre pestañas abiertas.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return
    try {
      state = JSON.parse(event.newValue)
      emit()
    } catch {
      /* ignorar */
    }
  })
}
