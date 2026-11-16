function TablaUsuarios({
  usuariosFiltrados = [],
  onVerHistorial,
  onEditarUsuario,
  onAlternarEstado
}) {
  return (
    <div className="p-4 bg-white rounded-3 shadow-sm border">
      <h2 className="h5 fw-bold mb-3" style={{ color: 'var(--color-secundario)' }}>
        Directorio de Usuarios ({usuariosFiltrados.length})
      </h2>
      {usuariosFiltrados.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-people fs-1 d-block mb-2 text-secondary"></i>
          No se encontraron usuarios que coincidan con los filtros.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usr) => {
                const esActivo = usr.activo !== false
                const esJefe = usr.rol === 'jefe'
                const esTrabajador = usr.rol === 'trabajador'
                return (
                  <tr key={usr.id || usr.email}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white flex-shrink-0"
                          style={{
                            width: '38px',
                            height: '38px',
                            backgroundColor: esJefe
                              ? '#dc3545'
                              : esTrabajador
                              ? '#0d6efd'
                              : '#198754',
                            fontSize: '0.9rem'
                          }}
                        >
                          {usr.nombre ? usr.nombre.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">{usr.nombre}</div>
                          <small className="text-muted">{usr.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          esJefe
                            ? 'bg-danger text-white'
                            : esTrabajador
                            ? 'bg-primary text-white'
                            : 'bg-success text-white'
                        } px-2 py-1`}
                      >
                        {esJefe ? 'Jefe / Admin' : esTrabajador ? 'Trabajador' : 'Cliente'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          esActivo
                            ? 'bg-success bg-opacity-10 text-success border border-success-subtle'
                            : 'bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle'
                        } px-2 py-1`}
                      >
                        <i
                          className={`bi ${
                            esActivo ? 'bi-check-circle-fill' : 'bi-slash-circle'
                          } me-1`}
                        ></i>
                        {esActivo ? 'Activo' : 'Desactivado'}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">{usr.fechaCreacion || 'N/A'}</small>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => onVerHistorial(usr)}
                          title="Ver historial de actividad"
                        >
                          <i className="bi bi-clock-history me-1"></i>
                          <span
                            className="badge bg-light text-dark border ms-1"
                            style={{ fontSize: '0.7rem' }}
                          >
                            {usr.historial?.length || 0}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => onEditarUsuario(usr)}
                          title="Editar datos del usuario"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          className={`btn ${
                            esActivo ? 'btn-outline-danger' : 'btn-outline-success'
                          }`}
                          onClick={() => onAlternarEstado(usr)}
                          title={esActivo ? 'Desactivar usuario' : 'Activar usuario'}
                        >
                          <i
                            className={`bi ${
                              esActivo ? 'bi-person-slash' : 'bi-person-check'
                            }`}
                          ></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TablaUsuarios
