import { ROLES_BACKEND, ETIQUETAS_ROL, CLASES_BADGE_ROL, esEmpleado } from '../utils/roles'

function TablaUsuariosApi({
  usuarios = [],
  correoActual = '',
  procesandoId = null,
  onCambiarRol,
  onAlternarEstado,
  onVerHistorial
}) {
  return (
    <div className="p-4 bg-white rounded-3 shadow-sm border">
      <h2 className="h5 fw-bold mb-3" style={{ color: 'var(--color-secundario)' }}>
        Usuarios registrados ({usuarios.length})
      </h2>

      {usuarios.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-people fs-1 d-block mb-2 text-secondary"></i>
          No se encontraron usuarios.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Usuario</th>
                <th>RUT</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usr) => {
                const rol = (usr.rol || '').toUpperCase()
                const activo = usr.activo !== false
                const esPropio = (usr.correo || '').toLowerCase() === correoActual
                const procesando = procesandoId === usr.id
                const rolConocido = ROLES_BACKEND.includes(rol)

                return (
                  <tr key={usr.id} className={activo ? '' : 'table-secondary'}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className={`d-flex align-items-center justify-content-center rounded-circle fw-bold text-white flex-shrink-0 ${CLASES_BADGE_ROL[rol] || 'bg-secondary'}`}
                          style={{ width: '38px', height: '38px', fontSize: '0.9rem' }}
                        >
                          {usr.nombre ? usr.nombre.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">
                            {usr.nombre}
                            {esPropio && <span className="badge bg-light text-dark border ms-2">Tú</span>}
                          </div>
                          <small className="text-muted">{usr.correo}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">{usr.rut || '—'}</small>
                    </td>
                    <td>
                      <span className={`badge ${CLASES_BADGE_ROL[rol] || 'bg-secondary'} px-2 py-1`}>
                        {rolConocido ? ETIQUETAS_ROL[rol] : usr.rol || 'Sin rol'}
                      </span>
                    </td>
                    <td>
                      {esEmpleado(rol) ? (
                        <div className="form-check form-switch d-flex align-items-center gap-2 mb-0">
                          <input
                            id={`switch-estado-${usr.id}`}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={activo}
                            disabled={procesando || esPropio}
                            onChange={() => onAlternarEstado && onAlternarEstado(usr)}
                            aria-label={`${activo ? 'Desactivar' : 'Activar'} cuenta de ${usr.nombre}`}
                            title={esPropio ? 'No puedes desactivar tu propia cuenta' : undefined}
                          />
                          <label
                            className={`form-check-label small ${activo ? 'text-success' : 'text-secondary'}`}
                            htmlFor={`switch-estado-${usr.id}`}
                          >
                            {activo ? 'Activo' : 'Inactivo'}
                          </label>
                          {procesando && (
                            <span className="spinner-border spinner-border-sm text-secondary" role="status">
                              <span className="visually-hidden">Guardando...</span>
                            </span>
                          )}
                        </div>
                      ) : (
                        <span
                          className={`badge ${activo ? 'bg-success bg-opacity-10 text-success border border-success-subtle' : 'bg-secondary bg-opacity-10 text-secondary border'} px-2 py-1`}
                          title="El estado solo se gestiona para cuentas de empleados"
                        >
                          {activo ? 'Activo' : 'Inactivo'}
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => onCambiarRol && onCambiarRol(usr)}
                          disabled={procesando || esPropio}
                          title={esPropio ? 'No puedes cambiar tu propio rol' : 'Cambiar rol'}
                        >
                          <i className="bi bi-person-gear me-1"></i>Cambiar rol
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => onVerHistorial && onVerHistorial(usr)}
                          title="Ver historial de auditoría"
                        >
                          <i className="bi bi-clock-history me-1"></i>Historial
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

export default TablaUsuariosApi
