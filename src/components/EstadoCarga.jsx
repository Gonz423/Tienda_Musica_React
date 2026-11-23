// Spinner de carga reutilizable para vistas conectadas al backend
function EstadoCarga({ mensaje = 'Cargando información...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
      <div className="spinner-border mb-3" role="status" style={{ color: 'var(--color-acento)' }}>
        <span className="visually-hidden">Cargando...</span>
      </div>
      <span className="small">{mensaje}</span>
    </div>
  )
}

export default EstadoCarga
