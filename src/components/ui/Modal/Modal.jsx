import { useEffect, useRef } from 'react'
import { cn } from '@/utils'
import './Modal.css'

/**
 * Modal accesible basado en el elemento nativo <dialog>.
 * @param {'sm'|'md'|'lg'|'xl'} size
 * @param {ReactNode} footer  Botones de acción (quedan fijos abajo).
 */
export function Modal({ isOpen, onClose, title, children, footer, size = 'md', className }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog ref={dialogRef} className={cn('modal', `modal--${size}`, className)} onClose={onClose}>
      <header className="modal__header">
        <h2 className="modal__title">{title}</h2>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>
      </header>
      <div className="modal__body">{children}</div>
      {footer && <footer className="modal__footer">{footer}</footer>}
    </dialog>
  )
}
