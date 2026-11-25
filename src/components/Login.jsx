import { useState } from 'react'
import { login as loginApi, registrar as registrarApi } from '../services/authService'

const DEMOS_METADATA = {
  jefe: {
    etiquetaRol: 'Jefe / Administrador',
    badgeClase: 'bg-danger text-white',
    icono: 'bi-shield-check',
    descripcion: 'Control total de métricas, pedidos e inventario',
    backendCorreo: 'admin@tiendamusica.cl',
    backendPassword: 'Admin123!'
  },
  trabajador: {
    etiquetaRol: 'Trabajador',
    badgeClase: 'bg-primary text-white',
    icono: 'bi-briefcase',
    descripcion: 'Recepción de pedidos y control de stock',
    backendCorreo: 'empleado@tiendamusica.cl',
    backendPassword: 'Vendedor123!'
  },
  cliente: {
    etiquetaRol: 'Cliente',
    badgeClase: 'bg-success text-white',
    icono: 'bi-person',
    descripcion: 'Catálogo de instrumentos y compras en línea',
    backendCorreo: 'cliente@tiendamusica.cl',
    backendPassword: 'Cliente123!'
  }
}

function Login({ onIniciarSesion, onCerrar, mensajeInicial = '' }) {
  const [modoRegistro, setModoRegistro] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState(mensajeInicial)
  const [cargando, setCargando] = useState(false)

  // La autenticación la decide SOLO el backend (auth-service). No hay usuarios locales.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const emailLimpio = email.trim()
    const passLimpio = password.trim()

    if (!emailLimpio || !passLimpio || (modoRegistro && !nombre.trim())) {
      setError(modoRegistro
        ? 'Completa nombre, correo y contraseña.'
        : 'Por favor, ingresa tu correo electrónico y contraseña.')
      return
    }
    if (modoRegistro && passLimpio.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setCargando(true)
    try {
      const sesion = modoRegistro
        ? await registrarApi({ nombre: nombre.trim(), correo: emailLimpio, password: passLimpio })
        : await loginApi({ correo: emailLimpio, password: passLimpio })
      onIniciarSesion(sesion)
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setCargando(false)
    }
  }

  const seleccionarDemo = (tipo) => {
    const meta = DEMOS_METADATA[tipo]
    setModoRegistro(false)
    setEmail(meta.backendCorreo)
    setPassword(meta.backendPassword)
    setError('')
  }

  const alternarModo = () => {
    setModoRegistro((m) => !m)
    setError('')
  }

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{
        backgroundColor: 'rgba(53, 27, 22, 0.45)',
        backdropFilter: 'blur(5px)',
        zIndex: 1060
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar()
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '460px' }}>
        <div
          className="modal-content border-0 shadow-lg"
          style={{
            borderRadius: '1.25rem',
            backgroundColor: '#ffffff',
            color: '#351b16',
            boxShadow: '0 20px 45px rgba(53, 27, 22, 0.2)'
          }}
        >
          <div className="modal-header border-0 pb-0 pt-4 px-4 position-relative justify-content-center">
            <button
              type="button"
              className="btn-close position-absolute"
              style={{ top: '1.25rem', right: '1.25rem' }}
              aria-label="Cerrar ventana"
              onClick={onCerrar}
            />

            <div className="text-center w-100">
              <div
                className="d-inline-flex align-items-center justify-content-center mb-2 shadow-sm"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7B4B3A 0%, #b96622 100%)',
                  color: '#ffffff',
                  fontSize: '1.5rem'
                }}
              >
                <i className="bi bi-person-lock"></i>
              </div>

              <h4 className="modal-title fw-bold text-dark mb-1" style={{ color: '#351b16' }}>
                {modoRegistro ? 'Crear cuenta' : 'Iniciar Sesión'}
              </h4>
              <p className="text-muted small mb-0">
                Bienvenido a <strong style={{ color: '#b96622' }}>Sonido Vivo</strong>
              </p>
            </div>
          </div>

          <div className="modal-body px-4 py-3">
            {error && (
              <div
                className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3"
                role="alert"
                style={{ borderRadius: '0.6rem' }}
              >
                <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {modoRegistro && (
                <div className="mb-3">
                  <label htmlFor="login-nombre" className="form-label small fw-bold text-secondary mb-1">
                    Nombre completo
                  </label>
                  <input
                    id="login-nombre"
                    type="text"
                    className="form-control bg-light"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    style={{ fontSize: '0.95rem' }}
                  />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary mb-1">
                  Correo Electrónico
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control bg-light border-start-0"
                    placeholder="usuario@correo.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary mb-1">
                  Contraseña
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-key"></i>
                  </span>
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    className="form-control bg-light border-start-0 border-end-0"
                    placeholder="Tu contraseña secreta"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ fontSize: '0.95rem' }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary bg-light border-start-0"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    <i className={`bi ${mostrarPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="btn w-100 fw-bold py-2 mt-2 shadow-sm text-white"
                style={{
                  borderRadius: '0.6rem',
                  background: 'linear-gradient(135deg, #7B4B3A 0%, #b96622 100%)',
                  border: 'none',
                  fontSize: '0.95rem'
                }}
              >
                {cargando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {modoRegistro ? 'Creando cuenta...' : 'Iniciando sesión...'}
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    {modoRegistro ? 'Registrarme' : 'Ingresar'}
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-3 small">
              {modoRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
              <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={alternarModo}>
                {modoRegistro ? 'Inicia sesión' : 'Regístrate como cliente'}
              </button>
            </div>

            {/* Accesos rápidos (cuentas sembradas en el backend) */}
            {!modoRegistro && (
            <div className="mt-4 pt-3 border-top" style={{ borderColor: '#ece6df' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small fw-bold text-muted">
                  <i className="bi bi-stars text-warning me-1"></i>
                  Accesos rápidos de prueba:
                </span>
                <span className="badge bg-light text-secondary border" style={{ fontSize: '0.7rem' }}>
                  Clic para autocompletar
                </span>
              </div>

              <div className="d-flex flex-column gap-2">
                {['jefe', 'trabajador', 'cliente'].map((rol) => {
                  const meta = DEMOS_METADATA[rol]
                  const correoMostrar = meta.backendCorreo
                  const estaSeleccionado = email === correoMostrar
                  return (
                    <button
                      key={rol}
                      type="button"
                      onClick={() => seleccionarDemo(rol)}
                      className="btn text-start p-2 border d-flex align-items-center justify-content-between w-100 transition-all"
                      style={{
                        backgroundColor: estaSeleccionado ? '#fbf7f4' : '#ffffff',
                        borderColor: estaSeleccionado ? '#b96622' : '#e5dfd8',
                        borderRadius: '0.6rem',
                        boxShadow: estaSeleccionado ? '0 0 0 2px rgba(185, 102, 34, 0.2)' : 'none'
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: estaSeleccionado ? '#7B4B3A' : '#f4eee7',
                            color: estaSeleccionado ? '#ffffff' : '#7B4B3A'
                          }}
                        >
                          <i className={`bi ${meta.icono}`}></i>
                        </div>
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold text-dark small">{correoMostrar}</span>
                            <span className={`badge ${meta.badgeClase} py-0 px-2`} style={{ fontSize: '0.65rem' }}>
                              {meta.etiquetaRol}
                            </span>
                          </div>
                          <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                            {meta.descripcion}
                          </span>
                        </div>
                      </div>
                      <i className={`bi ${estaSeleccionado ? 'bi-check-circle-fill text-success' : 'bi-arrow-right-short text-muted'} fs-5`}></i>
                    </button>
                  )
                })}
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
