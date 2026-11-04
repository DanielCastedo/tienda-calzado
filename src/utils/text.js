/**
 * Normaliza texto para búsquedas: minúsculas y sin tildes ("Mocasín" -> "mocasin").
 * Conserva la longitud original carácter a carácter, así los índices de una
 * coincidencia sirven también para resaltar el texto original.
 */
export const normalizeText = (value = '') =>
  String(value)
    .split('')
    .map((ch) => ch.normalize('NFD')[0].toLowerCase())
    .join('')
