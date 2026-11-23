// Alerta para errores HTTP con opción de reintento
function AlertaErrorHttp({ error, onReintentar, onCerrar }) {
  if (!error) return null

  const mensaje = typeof error === 'string' ? error : error.message
  const status = typeof error === 'object' ? error.status : undefined

  return (
    <div
      className="alert alert-danger d-flex align-items-start gap-2 shadow-sm border-0 mb-0"
      role="alert"
    >
      <i className="bi bi-exclamation-octagon-fill flex-shrink-0 mt-1"></i>
      <div className="flex-grow-1">
        <div className="fw-semibold">
          {status ? `Error ${status}` : 'Error de conexión'}
        </div>
        <div className="small">{mensaje}</div>
      </div>
      {onReintentar && (
        <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0" onClick={onReintentar}>
          <i className="bi bi-arrow-clockwise me-1"></i>Reintentar
        </button>
      )}
      {onCerrar && (
        <button type="button" className="btn-close flex-shrink-0" aria-label="Cerrar alerta" onClick={onCerrar} />
      )}
    </div>
  )
}

export default AlertaErrorHttp
