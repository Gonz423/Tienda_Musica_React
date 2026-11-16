function EncabezadoEmpleado({ seccionActiva, totalActivos }) {
  return (
    <div className="mb-4">
      <span className="badge btn-sv-secondary text-uppercase px-3 py-2 rounded-pill mb-2 shadow-sm">
        <i className="bi bi-briefcase me-1"></i> Rol: Trabajador de Tienda
      </span>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--color-secundario)' }}>
            {seccionActiva === 'pedidos' ? 'Recepción y Despacho de Pedidos' : 'Control de Stock e Inventario'}
          </h1>
          <p className="text-muted small mb-0">
            Gestión operativa en tiempo real para optimizar la entrega de instrumentos y accesorios.
          </p>
        </div>
        {seccionActiva === 'pedidos' && (
          <span className="badge bg-light text-dark border px-3 py-2 rounded-pill shadow-sm">
            <i className="bi bi-box-seam me-1 text-warning"></i>
            Pedidos activos: <strong>{totalActivos}</strong>
          </span>
        )}
      </div>
    </div>
  )
}

export default EncabezadoEmpleado
