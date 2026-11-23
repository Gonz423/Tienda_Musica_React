function AlertaOperacion({
  mensaje,
  onAccion,
  textoAccion = 'Ver Carrito',
  iconoAccion = 'bi-cart3'
}) {
  if (!mensaje) return null

  return (
    <div
      className="alert alert-success alert-dismissible fade show shadow-sm text-center mb-4 border-0 d-flex align-items-center justify-content-center flex-wrap gap-2"
      role="alert"
    >
      <div>
        <i className="bi bi-check-circle-fill me-2"></i>
        {mensaje}
      </div>
      {onAccion && (
        <button
          type="button"
          className="btn btn-sm btn-dark ms-2 py-0 px-2 fw-semibold shadow-sm"
          style={{ fontSize: '0.8rem', borderRadius: '6px' }}
          onClick={onAccion}
        >
          <i className={`bi ${iconoAccion} me-1`}></i> {textoAccion}
        </button>
      )}
    </div>
  )
}

export default AlertaOperacion
