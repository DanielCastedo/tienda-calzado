/** Crea un Map id -> elemento para búsquedas rápidas. */
export const indexById = (list = []) => new Map(list.map((item) => [item.id, item]))

/** Suma un campo (o el resultado de una función) en una lista. */
export const sumBy = (list, fn) => list.reduce((sum, item) => sum + (typeof fn === 'function' ? fn(item) : item[fn]), 0)

/** Convierte una lista { id, name } en opciones de <Select>. */
export const toOptions = (list, label = 'name', value = 'id') => list.map((x) => ({ value: String(x[value]), label: x[label] }))
