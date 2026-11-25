/**
 * Guardia de rutas por rol.
 * - Sin sesión: pide iniciar sesión (401 en el frontend).
 * - Con sesión pero sin el rol requerido: muestra "Acceso denegado" (403 en el frontend).
 * El rol viene del token JWT firmado; aunque alguien lo manipule en el navegador,
 * el backend rechaza la petición porque la firma deja de ser válida.
 */
function RutaProtegida({ sesion, rolesPermitidos = [], onAbrirLogin, children }) {
  if (!sesion) {
    return (
      <div className="container py-5 text-center" data-testid="ruta-requiere-login">
        <i className="bi bi-lock-fill display-4 text-secondary"></i>
        <h2 className="h4 fw-bold mt-3">Debes iniciar sesión</h2>
        <p className="text-muted">Esta sección es solo para personal autorizado de Sonido Vivo.</p>
        {onAbrirLogin && (
          <button type="button" className="btn btn-sv-primary" onClick={onAbrirLogin}>
            <i className="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión
          </button>
        )}
      </div>
    )
  }

  if (!rolesPermitidos.includes(sesion.rol)) {
    return (
      <div className="container py-5 text-center" data-testid="ruta-acceso-denegado">
        <i className="bi bi-shield-x display-4 text-danger"></i>
        <h2 className="h4 fw-bold mt-3">Acceso denegado</h2>
        <p className="text-muted mb-0">Tu rol no tiene permisos para ver esta sección.</p>
      </div>
    )
  }

  return children
}

export default RutaProtegida
