import { useState } from 'react'

const USUARIOS_DEMO = [
  {
    email: 'gonzalo@sonidovivo.cl',
    password: 'admin123',
    nombre: 'Gonzalo',
    rol: 'jefe',
    etiquetaRol: 'Jefe / Administrador',
    badgeClase: 'bg-danger text-white',
    icono: 'bi-shield-check',
    descripcion: 'Control total de métricas, pedidos e inventario'
  },
  {
    email: 'trabajador@sonidovivo.cl',
    password: 'trabajo123',
    nombre: 'Carlos',
    rol: 'trabajador',
    etiquetaRol: 'Trabajador',
    badgeClase: 'bg-primary text-white',
    icono: 'bi-briefcase',
    descripcion: 'Recepción de pedidos y control de stock'
  },
  {
    email: 'cliente@mail.cl',
    password: 'cliente123',
    nombre: 'Francisca',
    rol: 'cliente',
    etiquetaRol: 'Cliente',
    badgeClase: 'bg-success text-white',
    icono: 'bi-person',
    descripcion: 'Catálogo de instrumentos y compras en línea'
  }
]

function Login({ onIniciarSesion, onCerrar }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const emailLimpio = email.trim()
    const passLimpio = password.trim()

    if (!emailLimpio || !passLimpio) {
      setError('Por favor, ingresa tu correo electrónico y contraseña.')
      return
    }

    setCargando(true)

    setTimeout(() => {
      // Validar usuario demo
      const usuarioEncontrado = USUARIOS_DEMO.find(
        (u) => u.email.toLowerCase() === emailLimpio.toLowerCase() && u.password === passLimpio
      )

      if (usuarioEncontrado) {
        onIniciarSesion(usuarioEncontrado)
      } else {
        // Inicio libre como cliente
        if (passLimpio.length >= 4) {
          onIniciarSesion({
            email: emailLimpio,
            nombre: emailLimpio.split('@')[0],
            rol: 'cliente'
          })
        } else {
          setError('Contraseña muy corta o credenciales inválidas. Puedes usar los accesos rápidos de abajo.')
          setCargando(false)
        }
      }
    }, 300)
  }

  const seleccionarDemo = (usuario) => {
    setEmail(usuario.email)
    setPassword(usuario.password)
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
                Iniciar Sesión
              </h4>
              <p className="text-muted small mb-0">
                Bienvenido a <strong style={{ color: '#b96622' }}>Sonido Vivo</strong>
              </p>
            </div>
          </div>

          <div className="modal-body px-4 py-3">
            {error && (
              <div
                className="alert alert-danger py-2 px-3 d-flex align-items-center gap-2 border-0 shadow-sm mb-3"
                role="alert"
                style={{ fontSize: '0.875rem', borderRadius: '0.6rem' }}
              >
                <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary mb-1" htmlFor="login-email">
                  Correo Electrónico
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text bg-light text-muted border-end-0"
                    style={{ borderColor: '#d8cbbf', borderRadius: '0.6rem 0 0 0.6rem' }}
                  >
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    className="form-control border-start-0 bg-white"
                    placeholder="ejemplo@sonidovivo.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      borderColor: '#d8cbbf',
                      borderRadius: '0 0.6rem 0.6rem 0',
                      color: '#351b16'
                    }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-secondary mb-0" htmlFor="login-password">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-muted small text-decoration-none"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    style={{ fontSize: '0.8rem' }}
                  >
                    <i className={`bi ${mostrarPassword ? 'bi-eye-slash' : 'bi-eye'} me-1`}></i>
                    {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <div className="input-group">
                  <span
                    className="input-group-text bg-light text-muted border-end-0"
                    style={{ borderColor: '#d8cbbf', borderRadius: '0.6rem 0 0 0.6rem' }}
                  >
                    <i className="bi bi-key"></i>
                  </span>
                  <input
                    id="login-password"
                    type={mostrarPassword ? 'text' : 'password'}
                    className="form-control border-start-0 border-end-0 bg-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      borderColor: '#d8cbbf',
                      color: '#351b16'
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-light border border-start-0 text-muted"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    style={{ borderColor: '#d8cbbf', borderRadius: '0 0.6rem 0.6rem 0' }}
                    title={mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
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
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Ingresar
                  </>
                )}
              </button>
            </form>

            {/* Accesos rápidos */}
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
                {USUARIOS_DEMO.map((usr) => {
                  const estaSeleccionado = email === usr.email
                  return (
                    <button
                      key={usr.rol}
                      type="button"
                      onClick={() => seleccionarDemo(usr)}
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
                          <i className={`bi ${usr.icono}`}></i>
                        </div>
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold text-dark small">{usr.nombre}</span>
                            <span className={`badge ${usr.badgeClase} py-0 px-2`} style={{ fontSize: '0.65rem' }}>
                              {usr.etiquetaRol}
                            </span>
                          </div>
                          <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                            {usr.descripcion}
                          </span>
                        </div>
                      </div>
                      <i className={`bi ${estaSeleccionado ? 'bi-check-circle-fill text-success' : 'bi-arrow-right-short text-muted'} fs-5`}></i>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
