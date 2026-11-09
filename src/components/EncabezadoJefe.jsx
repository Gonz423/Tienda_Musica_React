function EncabezadoJefe({ seccion }) {
  const titulo =
    seccion === 'metricas'
      ? 'Panel de Métricas y Control'
      : seccion === 'productos'
      ? 'Administración de Productos'
      : 'Gestión de Usuarios'

  const subtitulo =
    seccion === 'usuarios'
      ? 'Administración de cuentas, roles, permisos y auditoría de eventos del sistema.'
      : 'Supervisión operativa de ventas, inventario crítico y gestión de catálogo musical.'

  return (
    <div className="mb-4">
      <span className="badge btn-sv-secondary text-uppercase px-3 py-2 rounded-pill mb-2 shadow-sm">
        <i className="bi bi-shield-lock me-1"></i> Rol: Jefe de Tienda
      </span>
      <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--color-secundario)' }}>
        {titulo}
      </h1>
      <p className="text-muted small mb-0">{subtitulo}</p>
    </div>
  )
}

export default EncabezadoJefe

