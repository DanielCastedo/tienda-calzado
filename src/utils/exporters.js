/**
 * Exporta filas a un archivo que Excel abre directamente (CSV con BOM UTF-8 y
 * separador ';', el que usa Excel en configuración regional español).
 * @param {{ key: string, label: string, exportValue?: (row) => any }[]} columns
 */
export function exportToExcel(filename, columns, rows) {
  const escape = (value) => {
    const text = value == null ? '' : String(value)
    return /[;"\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const header = columns.map((c) => escape(c.label)).join(';')
  const body = rows.map((row) =>
    columns
      .map((c) => {
        const value = c.exportValue ? c.exportValue(row) : row[c.key]
        return escape(typeof value === 'number' ? String(value).replace('.', ',') : value)
      })
      .join(';'),
  )
  downloadText(`${filename}.csv`, `﻿${[header, ...body].join('\r\n')}`, 'text/csv;charset=utf-8')
}

export function downloadText(filename, content, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Abre el diálogo de impresión del navegador (desde ahí se elige "Guardar como PDF").
 * El CSS de impresión oculta el menú y deja solo el contenido marcado.
 */
export function exportToPdf(title) {
  const previous = document.title
  if (title) document.title = title
  window.print()
  document.title = previous
}
