// Mensaje flotante para resultados de operaciones contra la API (éxito o error)
function AvisoGlobal({ aviso, onCerrar }) {
  if (!aviso) return null
  const esError = aviso.tipo === 'error'
  return (
    <div
      className="position-fixed top-0 start-50 translate-middle-x mt-5 px-3"
      style={{ zIndex: 1080, width: '100%', maxWidth: '560px' }}
    >
      <div
        className={`alert ${esError ? 'alert-danger' : 'alert-success'} shadow d-flex align-items-start gap-2 mb-0`}
        role={esError ? 'alert' : 'status'}
      >
        <i className={`bi ${esError ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} flex-shrink-0 mt-1`}></i>
        <div className="flex-grow-1">{aviso.texto}</div>
        <button type="button" className="btn-close" aria-label="Cerrar aviso" onClick={onCerrar}></button>
      </div>
    </div>
  )
}

export default AvisoGlobal
