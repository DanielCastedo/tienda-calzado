import './Sidebar.css'

/** Barra lateral genérica (filtros, menú de administración, etc.). */
export function Sidebar({ title, children }) {
  return (
    <aside className="sidebar">
      {title && <h2 className="sidebar__title">{title}</h2>}
      {children}
    </aside>
  )
}
