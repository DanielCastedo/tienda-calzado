import { useMemo, useState } from 'react'
import { cn, exportToExcel, exportToPdf, normalizeText } from '@/utils'
import { Button } from '../Button'
import { Icon } from '../Icon'
import './DataTable.css'

/**
 * Tabla de datos reutilizable: búsqueda, orden por columna, paginación y exportación.
 *
 * @param {Array<{
 *   key: string, label: string,
 *   render?: (row) => ReactNode,          // cómo se muestra
 *   value?: (row) => string|number,       // valor para ordenar, buscar y exportar
 *   align?: 'left'|'right'|'center', sortable?: boolean, width?: string
 * }>} columns
 * @param {string} exportName  Si se indica, muestra los botones Excel / PDF.
 * @param {ReactNode} toolbar  Filtros adicionales (a la izquierda del buscador).
 */
export function DataTable({
  columns,
  rows,
  rowKey = 'id',
  searchable = true,
  searchPlaceholder = 'Buscar…',
  pageSize = 12,
  emptyText = 'No hay registros.',
  exportName,
  toolbar,
  onRowClick,
  rowClassName,
  initialSort,
  footer,
}) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState(initialSort ?? null) // { key, dir: 'asc'|'desc' }
  const [page, setPage] = useState(0)

  const valueOf = (column, row) => (column.value ? column.value(row) : row[column.key])

  const filtered = useMemo(() => {
    const term = normalizeText(query.trim())
    let list = rows
    if (term) {
      list = rows.filter((row) => columns.some((c) => normalizeText(valueOf(c, row) ?? '').includes(term)))
    }
    if (sort) {
      const column = columns.find((c) => c.key === sort.key)
      if (column) {
        list = [...list].sort((a, b) => {
          const va = valueOf(column, a)
          const vb = valueOf(column, b)
          const result = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va ?? '').localeCompare(String(vb ?? ''), 'es', { numeric: true })
          return sort.dir === 'asc' ? result : -result
        })
      }
    }
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, sort, columns])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount - 1)
  const visible = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  const toggleSort = (column) => {
    if (column.sortable === false) return
    setSort((prev) => (prev?.key === column.key ? { key: column.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key: column.key, dir: 'asc' }))
  }

  const exportColumns = columns.filter((c) => c.export !== false).map((c) => ({ ...c, exportValue: (row) => valueOf(c, row) }))

  return (
    <div className="data-table">
      {(searchable || toolbar || exportName) && (
        <div className="data-table__toolbar no-print">
          {toolbar}
          {searchable && (
            <label className="data-table__search">
              <Icon name="search" size={16} />
              <input
                type="text"
                value={query}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(0)
                }}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Borrar búsqueda">
                  <Icon name="close" size={14} />
                </button>
              )}
            </label>
          )}
          {exportName && (
            <div className="data-table__export">
              <Button size="sm" variant="secondary" onClick={() => exportToExcel(exportName, exportColumns, filtered)}>
                <Icon name="download" size={16} /> Excel
              </Button>
              <Button size="sm" variant="secondary" onClick={() => exportToPdf(exportName)}>
                <Icon name="printer" size={16} /> PDF
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="data-table__scroll">
        <table>
          <thead>
            <tr>
              {columns.map((c) => {
                const active = sort?.key === c.key
                return (
                  <th
                    key={c.key}
                    style={{ width: c.width, textAlign: c.align }}
                    aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    {c.sortable === false ? (
                      c.label
                    ) : (
                      <button type="button" className={cn('data-table__sort', active && 'is-active')} onClick={() => toggleSort(c)}>
                        {c.label}
                        <span aria-hidden="true">{active ? (sort.dir === 'asc' ? '▲' : '▼') : '↕'}</span>
                      </button>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="data-table__empty">
                  {query ? `Sin resultados para «${query}».` : emptyText}
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr
                  key={typeof rowKey === 'function' ? rowKey(row) : row[rowKey]}
                  className={cn(onRowClick && 'is-clickable', rowClassName?.(row))}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((c) => (
                    <td key={c.key} style={{ textAlign: c.align }}>
                      {c.render ? c.render(row) : (valueOf(c, row) ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {footer && <tfoot>{footer}</tfoot>}
        </table>
      </div>

      {filtered.length > pageSize && (
        <div className="data-table__pager no-print">
          <span>
            {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, filtered.length)} de {filtered.length}
          </span>
          <div>
            <Button size="sm" variant="secondary" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>
              Anterior
            </Button>
            <Button size="sm" variant="secondary" disabled={currentPage >= pageCount - 1} onClick={() => setPage(currentPage + 1)}>
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
