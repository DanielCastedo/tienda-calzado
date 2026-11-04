import { session } from './session'

/** Genera el siguiente id de una colección. */
export function nextId(draft, collection) {
  draft.seq[collection] = (draft.seq[collection] ?? 0) + 1
  return draft.seq[collection]
}

/** Agrega un registro a la bitácora de operaciones (máx. 1000, los más recientes primero). */
export function audit(draft, { module, action, detail, userId, date }) {
  draft.audit.unshift({
    id: nextId(draft, 'audit'),
    date: date ?? new Date().toISOString(),
    userId: userId ?? session.userId(),
    module,
    action,
    detail,
  })
  if (draft.audit.length > 1000) draft.audit.length = 1000
}
