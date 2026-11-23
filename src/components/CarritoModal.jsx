import { useState } from 'react'
import { crearPedido } from '../services/pedidoService'

const imagenesLocales = import.meta.glob('../assets/img/*.jpg', { eager: true, import: 'default' })

function CarritoModal({
  abierto = false,
  onCerrar,
  carrito = [],
  onAgregarUno,
  onRestarUno,
  onEliminarProducto,
  onVaciarCarrito,
  onFinalizarCompra
}) {
  const [paso, setPaso] = useState('carrito') // 'carrito' | 'checkout' | 'exito'
  const [cargandoPago, setCargandoPago] = useState(false)
  const [ordenGenerada, setOrdenGenerada] = useState(null)

  // Formulario checkout
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    metodoPago: 'webpay'
  })
  const [errores, setErrores] = useState({})

  if (!abierto) return null

  // Agrupar items
  const itemsAgrupados = carrito.reduce((acc, prod) => {
    const key = prod.codigo || prod.id || prod.nombre
    if (!acc[key]) {
      acc[key] = { ...prod, cantidad: 1 }
    } else {
      acc[key].cantidad += 1
    }
    return acc
  }, {})

  const listaItems = Object.values(itemsAgrupados)

  // Totales
  const total = listaItems.reduce(
    (sum, item) => sum + (Number(item.precio) || 0) * item.cantidad,
    0
  )
  const cantidadTotal = listaItems.reduce((sum, item) => sum + item.cantidad, 0)

  const formatearPrecio = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(valor)
  }

  const obtenerImagen = (codigo) => {
    const clave = `../assets/img/${codigo}.jpg`
    return imagenesLocales[clave] || imagenesLocales['../assets/img/GA001.jpg']
  }

  const handleCerrar = () => {
    setPaso('carrito')
    setErrores({})
    if (onCerrar) onCerrar()
  }

  const handleValidarFormulario = () => {
    const nuevosErrores = {}
    if (!formulario.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio'
    if (!formulario.email.trim() || !formulario.email.includes('@')) {
      nuevosErrores.email = 'Ingresa un correo electronico valido'
    }
    if (!formulario.telefono.trim()) nuevosErrores.telefono = 'El telefono es obligatorio'
    if (!formulario.direccion.trim()) nuevosErrores.direccion = 'La direccion es obligatoria'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmitCheckout = async (e) => {
    e.preventDefault()
    if (!handleValidarFormulario()) return

    setCargandoPago(true)
    try {
      const respuesta = await crearPedido({
        clienteId: formulario.email,
        direccionEnvio: formulario.direccion,
        items: listaItems.map((item) => ({
          productoId: Number(item.id) || 1,
          nombreProducto: item.nombre || 'Instrumento Musical',
          precioUnitario: Number(item.precio) || 0,
          cantidad: Number(item.cantidad) || 1
        }))
      })

      const nuevaOrden = {
        id: respuesta.codigoPedido || respuesta.id || Math.floor(1000 + Math.random() * 9000),
        cliente: formulario.nombre,
        email: formulario.email,
        telefono: formulario.telefono,
        direccion: formulario.direccion,
        metodoPago: formulario.metodoPago,
        fecha: respuesta.fecha || new Date().toISOString().split('T')[0],
        total: respuesta.total ?? total,
        productos: listaItems.map((item) => ({
          codigo: item.codigo,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio
        }))
      }

      setOrdenGenerada(nuevaOrden)
      if (onVaciarCarrito) onVaciarCarrito()
      if (onFinalizarCompra) onFinalizarCompra(nuevaOrden)
      setPaso('exito')
    } catch {
      // Fallback local en modo offline
      const nuevaOrden = {
        id: Math.floor(1000 + Math.random() * 9000),
        cliente: formulario.nombre,
        email: formulario.email,
        telefono: formulario.telefono,
        direccion: formulario.direccion,
        metodoPago: formulario.metodoPago,
        fecha: new Date().toISOString().split('T')[0],
        total,
        productos: listaItems.map((item) => ({
          codigo: item.codigo,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio
        }))
      }

      setOrdenGenerada(nuevaOrden)
      if (onVaciarCarrito) onVaciarCarrito()
      if (onFinalizarCompra) onFinalizarCompra(nuevaOrden)
      setPaso('exito')
    } finally {
      setCargandoPago(false)
    }
  }

  const handleSeguirComprando = () => {
    if (onVaciarCarrito) onVaciarCarrito()
    setPaso('carrito')
    setOrdenGenerada(null)
    setFormulario({ nombre: '', email: '', telefono: '', direccion: '', metodoPago: 'webpay' })
    if (onCerrar) onCerrar()
  }

  return (
    <div
      className="modal-backdrop-custom d-flex justify-content-end align-items-stretch"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 10, 8, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1050
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCerrar()
      }}
    >
      <div
        className="carrito-sidebar bg-white shadow-lg d-flex flex-column h-100"
        style={{
          width: '100%',
          maxWidth: '520px',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          borderLeft: '2px solid var(--color-secundario)'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-carrito"
      >
        {/* Cabecera */}
        <div
          className="p-3 text-white d-flex align-items-center justify-content-between header-sonido-vivo"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cart3 fs-4"></i>
            <h5 className="mb-0 fw-bold" id="titulo-carrito">
              {paso === 'carrito' && 'Carrito de Compras'}
              {paso === 'checkout' && 'Finalizar Compra'}
              {paso === 'exito' && '¡Pedido Confirmado!'}
            </h5>
            {paso === 'carrito' && (
              <span className="badge bg-light text-dark rounded-pill fw-bold ms-1">
                {cantidadTotal} {cantidadTotal === 1 ? 'producto' : 'productos'}
              </span>
            )}
          </div>
          <button
            type="button"
            className="btn btn-sm text-white border-0 fs-4 p-0 line-height-1"
            onClick={handleCerrar}
            aria-label="Cerrar carrito"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="flex-grow-1 overflow-auto p-3 p-md-4">
          {/* Paso 1: Carrito */}
          {paso === 'carrito' && (
            <>
              {listaItems.length === 0 ? (
                <div className="text-center py-5">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: 'var(--color-fondo)',
                      color: 'var(--color-primario)'
                    }}
                  >
                    <i className="bi bi-cart-x fs-1"></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-2">Tu carrito está vacío</h5>
                  <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: '320px' }}>
                    Aún no has agregado instrumentos o equipamiento de audio. Explora nuestro catálogo y encuentra lo que necesitas.
                  </p>
                  <button
                    type="button"
                    className="btn btn-sv-primary px-4 py-2"
                    onClick={() => {
                      handleCerrar()
                      const catalogoEl = document.getElementById('catalogo')
                      catalogoEl?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <i className="bi bi-grid-3x3-gap me-2"></i>
                    Explorar Catálogo
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {listaItems.map((item) => (
                    <div
                      key={item.codigo || item.id || item.nombre}
                      className="card-carrito-item p-2 p-md-3 rounded-3 border bg-light d-flex align-items-center gap-3 shadow-sm"
                    >
                      <img
                        src={obtenerImagen(item.codigo)}
                        alt={item.nombre}
                        className="rounded object-fit-cover flex-shrink-0"
                        style={{
                          width: '70px',
                          height: '70px',
                          backgroundColor: '#fff',
                          border: '1px solid #dee2e6'
                        }}
                      />
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex justify-content-between align-items-start gap-1">
                          <h6 className="mb-0 fw-bold text-dark text-truncate" title={item.nombre}>
                            {item.nombre}
                          </h6>
                          <button
                            type="button"
                            className="btn btn-sm text-danger p-0 border-0"
                            title="Eliminar producto"
                            aria-label={`Eliminar ${item.nombre} del carrito`}
                            onClick={() => onEliminarProducto && onEliminarProducto(item.codigo)}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                        <div className="text-muted small mb-2">
                          {item.marca} {item.modelo ? `· ${item.modelo}` : ''}
                        </div>
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                          {/* Cantidad */}
                          <div className="btn-group btn-group-sm border rounded bg-white" role="group">
                            <button
                              type="button"
                              className="btn btn-light px-2 py-0 border-end"
                              aria-label="Restar una unidad"
                              onClick={() => onRestarUno && onRestarUno(item.codigo)}
                            >
                              -
                            </button>
                            <span className="px-2 py-1 fw-bold small text-dark d-flex align-items-center">
                              {item.cantidad}
                            </span>
                            <button
                              type="button"
                              className="btn btn-light px-2 py-0 border-start"
                              aria-label="Agregar una unidad"
                              disabled={item.stock !== undefined && item.cantidad >= item.stock}
                              onClick={() => onAgregarUno && onAgregarUno(item)}
                            >
                              +
                            </button>
                          </div>
                          {/* Subtotal */}
                          <div className="fw-bold text-end" style={{ color: 'var(--color-primario)' }}>
                            {formatearPrecio(item.precio * item.cantidad)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Paso 2: Checkout */}
          {paso === 'checkout' && (
            <form onSubmit={handleSubmitCheckout} className="d-flex flex-column gap-3">
              <div className="alert alert-info py-2 px-3 small border-0 mb-1">
                <i className="bi bi-shield-check me-2"></i>
                Completa tus datos para confirmar tu pedido en Sonido Vivo Viña del Mar.
              </div>

              <div>
                <label className="form-label small fw-bold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${errores.nombre ? 'is-invalid' : ''}`}
                  placeholder="Ej: Gonzalo Valdés"
                  value={formulario.nombre}
                  onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                />
                {errores.nombre && <div className="invalid-feedback small">{errores.nombre}</div>}
              </div>

              <div>
                <label className="form-label small fw-bold mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  className={`form-control form-control-sm ${errores.email ? 'is-invalid' : ''}`}
                  placeholder="ejemplo@correo.cl"
                  value={formulario.email}
                  onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
                />
                {errores.email && <div className="invalid-feedback small">{errores.email}</div>}
              </div>

              <div>
                <label className="form-label small fw-bold mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  className={`form-control form-control-sm ${errores.telefono ? 'is-invalid' : ''}`}
                  placeholder="+56 9 8452 1198"
                  value={formulario.telefono}
                  onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
                />
                {errores.telefono && <div className="invalid-feedback small">{errores.telefono}</div>}
              </div>

              <div>
                <label className="form-label small fw-bold mb-1">Dirección de Despacho o Retiro *</label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${errores.direccion ? 'is-invalid' : ''}`}
                  placeholder="Ej: Av. Libertad 1045, Depto 402, Viña del Mar"
                  value={formulario.direccion}
                  onChange={(e) => setFormulario({ ...formulario, direccion: e.target.value })}
                />
                {errores.direccion && <div className="invalid-feedback small">{errores.direccion}</div>}
              </div>

              <div>
                <label className="form-label small fw-bold mb-1">Método de Pago</label>
                <div className="d-flex flex-column gap-2">
                  <label className="border rounded p-2 d-flex align-items-center gap-2 small cursor-pointer bg-light">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="webpay"
                      checked={formulario.metodoPago === 'webpay'}
                      onChange={(e) => setFormulario({ ...formulario, metodoPago: e.target.value })}
                    />
                    <i className="bi bi-credit-card-2-front text-primary"></i>
                    <span>Webpay Plus / Débito y Crédito Transbank</span>
                  </label>
                  <label className="border rounded p-2 d-flex align-items-center gap-2 small cursor-pointer bg-light">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="transferencia"
                      checked={formulario.metodoPago === 'transferencia'}
                      onChange={(e) => setFormulario({ ...formulario, metodoPago: e.target.value })}
                    />
                    <i className="bi bi-bank text-success"></i>
                    <span>Transferencia Electrónica Directa</span>
                  </label>
                </div>
              </div>
            </form>
          )}

          {/* Paso 3: Exito */}
          {paso === 'exito' && ordenGenerada && (
            <div className="text-center py-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 bg-success text-white"
                style={{ width: '80px', height: '80px' }}
              >
                <i className="bi bi-check-lg fs-1"></i>
              </div>
              <h4 className="fw-bold text-success mb-2">¡Compra Realizada con Éxito!</h4>
              <p className="text-muted small mb-3">
                Tu pedido <strong>#SV-{ordenGenerada.id}</strong> ha sido recibido e ingresado al sistema de tienda.
              </p>

              <div className="card text-start bg-light border-0 p-3 mb-4 rounded-3 shadow-sm">
                <div className="d-flex justify-content-between mb-2 pb-1 border-bottom">
                  <span className="small text-muted">Cliente:</span>
                  <span className="small fw-bold">{ordenGenerada.cliente}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 pb-1 border-bottom">
                  <span className="small text-muted">Correo:</span>
                  <span className="small fw-bold">{ordenGenerada.email}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 pb-1 border-bottom">
                  <span className="small text-muted">Dirección:</span>
                  <span className="small fw-bold">{ordenGenerada.direccion}</span>
                </div>
                <div className="d-flex justify-content-between pt-1">
                  <span className="fw-bold text-dark">Total Pagado:</span>
                  <span className="fw-bold text-success fs-6">
                    {formatearPrecio(ordenGenerada.total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-sv-primary w-100 py-2 fw-semibold"
                onClick={handleSeguirComprando}
              >
                <i className="bi bi-bag-check me-2"></i>
                Seguir Comprando
              </button>
            </div>
          )}
        </div>

        {/* Totales y acciones */}
        {paso === 'carrito' && listaItems.length > 0 && (
          <div className="p-3 bg-light border-top shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-1 text-muted small">
              <span>Subtotal:</span>
              <span>{formatearPrecio(total)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2 small text-success">
              <span>
                <i className="bi bi-truck me-1"></i> Envío a todo Chile:
              </span>
              <span className="badge bg-success-subtle text-success fw-bold">GRATIS</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3 pt-2 border-top">
              <span className="fw-bold text-dark fs-5">Total:</span>
              <span className="fw-bold fs-4" style={{ color: 'var(--color-primario)' }}>
                {formatearPrecio(total)}
              </span>
            </div>

            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-sv-primary py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={() => setPaso('checkout')}
              >
                <i className="bi bi-credit-card"></i>
                Continuar con la Compra
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm border-0"
                onClick={onVaciarCarrito}
              >
                <i className="bi bi-trash3 me-1"></i> Vaciar Carrito
              </button>
            </div>
          </div>
        )}

        {paso === 'checkout' && (
          <div className="p-3 bg-light border-top shadow-sm d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary py-2 flex-grow-1"
              onClick={() => setPaso('carrito')}
              disabled={cargandoPago}
            >
              Volver
            </button>
            <button
              type="button"
              className="btn btn-sv-primary py-2 flex-grow-1 fw-semibold d-flex align-items-center justify-content-center gap-2"
              onClick={handleSubmitCheckout}
              disabled={cargandoPago}
            >
              {cargandoPago ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-lock-fill"></i>
                  <span>Pagar {formatearPrecio(total)}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CarritoModal
