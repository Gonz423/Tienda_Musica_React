function Modal({
  abierto,
  onCerrar,
  titulo,
  icono,
  subtitulo,
  maxWidth = '500px',
  children,
  footer
}) {
  if (!abierto) return null

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{
        backgroundColor: 'rgba(53, 27, 22, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 1070
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar()
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth }}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1rem' }}>
          <div className="modal-header border-bottom pb-3 pt-3 px-4">
            <div>
              <h5 className="modal-title fw-bold mb-0" style={{ color: 'var(--color-secundario)' }}>
                {icono && (
                  <i
                    className={`bi ${icono} me-2`}
                    style={{ color: 'var(--color-acento)' }}
                  ></i>
                )}
                {titulo}
              </h5>
              {subtitulo && <small className="text-muted">{subtitulo}</small>}
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onCerrar}
              aria-label="Cerrar modal"
            />
          </div>
          {children}
          {footer && (
            <div
              className="modal-footer border-top px-4 py-3 bg-light"
              style={{
                borderBottomLeftRadius: '1rem',
                borderBottomRightRadius: '1rem'
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal
