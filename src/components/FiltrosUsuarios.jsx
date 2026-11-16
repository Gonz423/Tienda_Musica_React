function FiltrosUsuarios({
  busquedaUsuario,
  setBusquedaUsuario,
  filtroRol,
  setFiltroRol,
  filtroEstado,
  setFiltroEstado,
  onNuevoUsuario
}) {
  return (
    <div className="p-3 bg-white rounded-3 shadow-sm border">
      <div className="row g-2 align-items-center justify-content-between">
        <div className="col-12 col-md-4">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light text-muted border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar por nombre o correo..."
              value={busquedaUsuario}
              onChange={(e) => setBusquedaUsuario(e.target.value)}
            />
            {busquedaUsuario && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setBusquedaUsuario('')}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
        <div className="col-6 col-md-3">
          <select
            className="form-select form-select-sm"
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            aria-label="Filtrar por rol"
          >
            <option value="todos">Todos los roles</option>
            <option value="jefe">Jefe / Administrador</option>
            <option value="trabajador">Trabajador</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select
            className="form-select form-select-sm"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Solo Activos</option>
            <option value="inactivos">Solo Desactivados</option>
          </select>
        </div>
        <div className="col-12 col-md-2 text-md-end">
          <button
            type="button"
            className="btn btn-sv-primary btn-sm w-100 shadow-sm"
            onClick={onNuevoUsuario}
          >
            <i className="bi bi-person-plus-fill me-1"></i> Nuevo Usuario
          </button>
        </div>
      </div>
    </div>
  )
}

export default FiltrosUsuarios
