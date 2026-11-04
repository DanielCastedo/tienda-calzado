import { useEffect, useRef } from 'react'
import './Modal.css'

/** Modal accesible basado en el elemento nativo <dialog>. */
export function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <header className="modal__header">
        <h2 className="modal__title">{title}</h2>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>
      </header>
      <div className="modal__body">{children}</div>
    </dialog>
  )
}
