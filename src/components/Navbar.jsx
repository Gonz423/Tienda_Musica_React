import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

function Navbar({
  rolActual = 'cliente',
  setRolActual,
  cantidadCarrito = 0,
  onAbrirCarrito,
  seccionJefe: seccionJefeProp,
  setSeccionJefe: setSeccionJefeProp,
  seccionTrabajador: seccionTrabajadorProp,
  setSeccionTrabajador: setSeccionTrabajadorProp,
  sesionAbierta = false,
  usuarioActual = null,
  onAbrirLogin,
  onCerrarSesion,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isNavCollapsed, setIsNavCollapsed] = useState(true)

  const esInicio = location.pathname === '/'
  const esCatalogo = location.pathname === '/catalogo'
  const esContacto = location.pathname === '/contacto'

  const [seccionTrabajadorLocal, setSeccionTrabajadorLocal] = useState('pedidos')
  const [seccionJefeLocal, setSeccionJefeLocal] = useState('metricas')

  const seccionTrabajador =
    seccionTrabajadorProp !== undefined ? seccionTrabajadorProp : seccionTrabajadorLocal
  const setSeccionTrabajador = setSeccionTrabajadorProp || setSeccionTrabajadorLocal

  const seccionJefe = seccionJefeProp !== undefined ? seccionJefeProp : seccionJefeLocal
  const setSeccionJefe = setSeccionJefeProp || setSeccionJefeLocal

  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed)
  }

  const handleLinkClick = () => {
    setIsNavCollapsed(true)
  }

  const irAInicio = () => {
    handleLinkClick()
    if (setRolActual) setRolActual('cliente')
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const irACatalogo = () => {
    handleLinkClick()
    if (setRolActual) setRolActual('cliente')
    navigate('/catalogo')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const irAContacto = () => {
    handleLinkClick()
    if (setRolActual) setRolActual('cliente')
    navigate('/contacto')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const irANosotros = () => {
    handleLinkClick()
    const footerEl = document.getElementById('nosotros')
    if (footerEl?.scrollIntoView) {
      footerEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark header-sonido-vivo sticky-top shadow w-100">
      <div className="container">
        {/* Logo */}
        <a
          className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4 text-decoration-none me-3"
          href="#inicio"
          onClick={(e) => {
            e.preventDefault()
            irAInicio()
          }}
        >
          <i className="bi bi-soundwave fs-3"></i>
          <span>Sonido Vivo</span>
        </a>

        {/* Hamburguesa */}
        <button
          className="navbar-toggler border-0 p-2 shadow-sm"
          type="button"
          aria-controls="menuPrincipal"
          aria-expanded={!isNavCollapsed}
          aria-label="Alternar navegacion"
          onClick={handleNavCollapse}
          style={{ backgroundColor: 'rgba(236, 230, 223, 0.25)', borderRadius: '8px' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div
          className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}
          id="menuPrincipal"
        >
          <ul className="navbar-nav me-auto mb-3 mb-lg-0 align-items-lg-center gap-2 pt-2 pt-lg-0">
            {/* Cliente */}
            {rolActual === 'cliente' && (
              <>
                <li className="nav-item w-100 w-lg-auto">
                  <button
                    type="button"
                    className={`nav-link nav-btn-link btn btn-link text-start text-lg-center ${esInicio ? 'active' : ''}`}
                    aria-current={esInicio ? 'page' : undefined}
                    onClick={irAInicio}
                  >
                    <i className="bi bi-house-door me-2 d-lg-none"></i>
                    Inicio
                  </button>
                </li>
                
                <li className="nav-item w-100 w-lg-auto">
                  <button
                    type="button"
                    className={`nav-link nav-btn-link btn btn-link text-start text-lg-center ${esCatalogo ? 'active' : ''}`}
                    aria-current={esCatalogo ? 'page' : undefined}
                    onClick={irACatalogo}
                  >
                    <i className="bi bi-grid-3x3-gap me-2 d-lg-none"></i>
                    Catálogo
                  </button>
                </li>

                <li className="nav-item w-100 w-lg-auto">
                  <button
                    type="button"
                    className={`nav-link nav-btn-link btn btn-link text-start text-lg-center ${esContacto ? 'active' : ''}`}
                    aria-current={esContacto ? 'page' : undefined}
                    onClick={irAContacto}
                  >
                    <i className="bi bi-chat-dots me-2 d-lg-none"></i>
                    Contáctanos
                  </button>
                </li>

                <li className="nav-item w-100 w-lg-auto">
                  <button
                    type="button"
                    className="nav-link nav-btn-link btn btn-link text-start text-lg-center"
                    onClick={irANosotros}
                  >
                    <i className="bi bi-people me-2 d-lg-none"></i>
                    Nosotros
                  </button>
                </li>
              </>
            )}

            {/* Trabajador */}
            {rolActual === 'trabajador' && (
              <li className="nav-item d-flex gap-2 ms-lg-3 my-2 my-lg-0">
                <button
                  type="button"
                  className={`nav-link nav-btn-link w-100 border-0 ${seccionTrabajador === 'pedidos' ? 'active' : ''}`}
                  onClick={() => {
                    setSeccionTrabajador('pedidos')
                    navigate('/')
                    handleLinkClick()
                  }}
                >
                  Recepción de Pedidos
                </button>
                <button
                  type="button"
                  className={`nav-link nav-btn-link w-100 border-0 ${seccionTrabajador === 'stock' ? 'active' : ''}`}
                  onClick={() => {
                    setSeccionTrabajador('stock')
                    navigate('/')
                    handleLinkClick()
                  }}
                >
                  Control de Stock
                </button>
              </li>
            )}

            {/* Jefe */}
            {rolActual === 'jefe' && (
              <>
                <li className="nav-item w-100 w-lg-auto">
                  <button
                    type="button"
                    className={`nav-link nav-btn-link w-100 border-0 ${seccionJefe === 'metricas' ? 'active' : ''}`}
                    onClick={() => {
                      setSeccionJefe('metricas')
                      navigate('/')
                      handleLinkClick()
                    }}
                  >
                    <i className="bi bi-graph-up-arrow me-2"></i> Metricas y Ventas
                  </button>
                </li>
                <li className="nav-item w-100 w-lg-auto">
                  <button
                    type="button"
                    className={`nav-link nav-btn-link w-100 border-0 ${seccionJefe === 'productos' ? 'active' : ''}`}
                    onClick={() => {
                      setSeccionJefe('productos')
                      navigate('/')
                      handleLinkClick()
                    }}
                  >
                    <i className="bi bi-gear me-2"></i> Administracion de Productos
                  </button>
                </li>
              </>
            )}
          </ul>

          {/* Acciones y Carrito */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 pt-2 pt-lg-0 border-top border-secondary border-opacity-25 border-top-lg-0">

            {rolActual === 'cliente' && (
              <button
                type="button"
                className="btn btn-sv-primary btn-carrito-mobile position-relative d-flex align-items-center justify-content-center gap-2 shadow-sm"
                style={{ height: '38px' }}
                aria-label="Ver carrito de compras"
                onClick={onAbrirCarrito}
              >
                <i className="bi bi-cart3 fs-6"></i>
                <span>Carrito</span>
                {cantidadCarrito > 0 && (
                  <span className="badge bg-danger rounded-pill ms-1">
                    {cantidadCarrito}
                  </span>
                )}
              </button>
            )}

            {/* Sesión */}
            <div className="d-flex align-items-center">
              {sesionAbierta && usuarioActual ? (
                <div
                  className="d-flex align-items-center gap-2 px-2 py-1 rounded-pill"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <span
                    className={`badge rounded-pill ${
                      usuarioActual.rol === 'jefe'
                        ? 'bg-danger'
                        : usuarioActual.rol === 'trabajador'
                        ? 'bg-info text-dark'
                        : 'bg-warning text-dark'
                    } text-capitalize`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {usuarioActual.rol || 'usuario'}
                  </span>
                  <span
                    className="text-white small fw-semibold text-truncate d-none d-md-inline"
                    style={{ maxWidth: '120px' }}
                    title={usuarioActual.nombre || usuarioActual.email}
                  >
                    {usuarioActual.nombre || usuarioActual.email}
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-white p-0 ps-1 pe-1 border-0"
                    title="Cerrar Sesión"
                    aria-label="Cerrar Sesión"
                    onClick={onCerrarSesion}
                  >
                    <i className="bi bi-box-arrow-right text-warning fs-6"></i>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-light btn-sm d-flex align-items-center gap-2 shadow-sm fw-semibold"
                  style={{
                    height: '38px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    color: '#7B4B3A',
                    backgroundColor: '#ffffff'
                  }}
                  onClick={onAbrirLogin}
                  aria-label="Iniciar Sesión"
                >
                  <i className="bi bi-box-arrow-in-right fs-6"></i>
                  <span>Iniciar Sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar