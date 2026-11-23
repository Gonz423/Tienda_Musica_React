import { obtenerRolBackend, ETIQUETAS_ROL } from '../utils/roles'

// Renderiza el contenido solo si el usuario en sesión tiene alguno de los roles permitidos
function AccesoRestringido({ usuario, rolesPermitidos = [], children }) {
  const rol = obtenerRolBackend(usuario)

  if (rol && rolesPermitidos.includes(rol)) {
    return children
  }

  const permitidos = rolesPermitidos.map((r) => ETIQUETAS_ROL[r] || r).join(', ')

  return (
    <div className="container py-5">
      <div className="alert alert-warning shadow-sm border-0 d-flex gap-3 align-items-start" role="alert">
        <i className="bi bi-shield-lock-fill fs-3 flex-shrink-0"></i>
        <div>
          <h2 className="h5 fw-bold mb-1">Acceso restringido</h2>
          <p className="mb-0 small">
            Esta sección solo está disponible para: <strong>{permitidos}</strong>.{' '}
            {usuario
              ? `Tu rol actual (${ETIQUETAS_ROL[rol] || 'sin rol'}) no tiene permisos.`
              : 'Inicia sesión con una cuenta autorizada.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AccesoRestringido
