import { useState } from 'react'

// Helper interno para ventanas modales (mismo archivo)
function Modal({ abierto, onCerrar, titulo, icono, subtitulo, maxWidth = '500px', children, footer }) {
  if (!abierto) return null
  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: 'rgba(53, 27, 22, 0.45)', backdropFilter: 'blur(4px)', zIndex: 1070 }}
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar() }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth }}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1rem' }}>
          <div className="modal-header border-bottom pb-3 pt-3 px-4">
            <div>
              <h5 className="modal-title fw-bold mb-0" style={{ color: 'var(--color-secundario)' }}>
                {icono && <i className={`bi ${icono} me-2`} style={{ color: 'var(--color-acento)' }}></i>}
                {titulo}
              </h5>
              {subtitulo && <small className="text-muted">{subtitulo}</small>}
            </div>
            <button type="button" className="btn-close" onClick={onCerrar} aria-label="Cerrar modal" />
          </div>
          {children}
          {footer && (
            <div className="modal-footer border-top px-4 py-3 bg-light" style={{ borderBottomLeftRadius: '1rem', borderBottomRightRadius: '1rem' }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VistaJefe({
  productos = [],
  pedidos = [],
  usuarios = [],
  usuarioActual = null,
  onAgregarProducto,
  onActualizarProducto,
  onEliminarProducto,
  onCrearUsuario,
  onActualizarUsuario,
  onAlternarEstadoUsuario,
  onAgregarHistorialUsuario,
  seccionActiva = 'metricas',
  onCambiarSeccion
}) {
  const seccion = seccionActiva

  // Estados de Productos
  const formInicial = { codigo: '', nombre: '', marca: '', modelo: '', categoria: 'Guitarras Acústicas', precio: '', stock: '', descripcion: '' }
  const [form, setForm] = useState(formInicial)
  const [editandoCodigo, setEditandoCodigo] = useState(null)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  // Estados de Usuarios
  const [busquedaUsuario, setBusquedaUsuario] = useState('')
  const [filtroRol, setFiltroRol] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [usuarioHistorialModal, setUsuarioHistorialModal] = useState(null)
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [notaHistorial, setNotaHistorial] = useState('')
  const [mensajeUsuario, setMensajeUsuario] = useState('')
  const [mostrarPasswordUsuario, setMostrarPasswordUsuario] = useState(false)
  const formUsuarioInicial = { nombre: '', email: '', password: '', rol: 'cliente', activo: true }
  const [formUsuario, setFormUsuario] = useState(formUsuarioInicial)
  const [erroresUsuario, setErroresUsuario] = useState({})

  // Calculos de KPIs
  const totalVentas = pedidos.reduce((acc, p) => acc + (Number(p.total) || 0), 0)
  const atendidos = pedidos.filter((p) => p.estado === 'Despachado').length
  const pendientes = pedidos.filter((p) => p.estado !== 'Despachado').length
  const stockCritico = productos.filter((p) => p.stock <= 3)
  const totalUsuarios = usuarios.length
  const usuariosActivos = usuarios.filter((u) => u.activo !== false).length
  const usuariosInactivos = usuarios.filter((u) => u.activo === false).length

  const formatoMoneda = (val) => `$${Number(val || 0).toLocaleString('es-CL')}`
  const ahoraStr = () => `${new Date().toLocaleDateString('es-CL')} ${new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`

  // Manejo de formulario de productos
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleIniciarEdicion = (prod) => {
    setEditandoCodigo(prod.codigo)
    setForm({
      codigo: prod.codigo || '',
      nombre: prod.nombre || '',
      marca: prod.marca || '',
      modelo: prod.modelo || '',
      categoria: prod.categoria || 'Guitarras Acústicas',
      precio: prod.precio !== undefined ? String(prod.precio) : '',
      stock: prod.stock !== undefined ? String(prod.stock) : '',
      descripcion: prod.descripcion || ''
    })
    setErrores({})
  }

  const handleCancelarEdicion = () => {
    setEditandoCodigo(null)
    setForm(formInicial)
    setErrores({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = {}
    const requeridos = [
      ['codigo', 'El código es obligatorio'],
      ['nombre', 'El nombre es obligatorio'],
      ['marca', 'La marca es obligatoria'],
      ['modelo', 'El modelo es obligatorio'],
      ['categoria', 'La categoría es obligatoria'],
      ['descripcion', 'La descripción es obligatoria']
    ]
    requeridos.forEach(([campo, msg]) => { if (!form[campo]?.trim()) err[campo] = msg })

    const precioNum = Number(form.precio)
    if (form.precio === '' || isNaN(precioNum) || precioNum <= 0) err.precio = 'El precio debe ser mayor a 0'

    const stockNum = Number(form.stock)
    if (form.stock === '' || isNaN(stockNum) || !Number.isInteger(stockNum) || stockNum < 0) {
      err.stock = 'El stock debe ser un entero no negativo (≥ 0)'
    }

    setErrores(err)
    if (Object.keys(err).length > 0) return

    const prodData = { ...form, precio: precioNum, stock: stockNum }
    if (editandoCodigo) {
      if (onActualizarProducto) onActualizarProducto(prodData)
      localStorage.setItem('productos_catalogo', JSON.stringify(prodData))
      setMensaje(`Producto "${form.nombre}" actualizado con éxito`)
      handleCancelarEdicion()
    } else {
      const nuevo = { ...prodData, codigo: form.codigo.trim().toUpperCase() }
      if (onAgregarProducto) onAgregarProducto(nuevo)
      localStorage.setItem('productos_catalogo', JSON.stringify(nuevo))
      setMensaje(`Producto "${form.nombre}" agregado con éxito`)
      setForm(formInicial)
      setErrores({})
    }
    setTimeout(() => setMensaje(''), 3000)
  }

  // Filtrado de usuarios
  const usuariosFiltrados = usuarios.filter((u) => {
    const term = busquedaUsuario.trim().toLowerCase()
    const coincideTexto = !term || u.nombre?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term)
    const coincideRol = filtroRol === 'todos' || u.rol === filtroRol
    const coincideEstado = filtroEstado === 'todos' || (filtroEstado === 'activos' && u.activo !== false) || (filtroEstado === 'inactivos' && u.activo === false)
    return coincideTexto && coincideRol && coincideEstado
  })

  const handleAbrirCrearUsuario = () => {
    setUsuarioEditando(null)
    setFormUsuario(formUsuarioInicial)
    setErroresUsuario({})
    setMostrarPasswordUsuario(false)
    setModalUsuarioAbierto(true)
  }

  const handleAbrirEditarUsuario = (usr) => {
    setUsuarioEditando(usr)
    setFormUsuario({ nombre: usr.nombre || '', email: usr.email || '', password: '', rol: usr.rol || 'cliente', activo: usr.activo !== false })
    setErroresUsuario({})
    setMostrarPasswordUsuario(false)
    setModalUsuarioAbierto(true)
  }

  const handleGuardarUsuario = (e) => {
    e.preventDefault()
    const err = {}
    if (!formUsuario.nombre.trim()) err.nombre = 'El nombre completo es obligatorio'
    if (!formUsuario.email.trim()) err.email = 'El correo electrónico es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formUsuario.email.trim())) err.email = 'Ingresa un formato de correo válido'
    else if (usuarios.some((u) => u.email.toLowerCase() === formUsuario.email.trim().toLowerCase() && (!usuarioEditando || u.id !== usuarioEditando.id))) {
      err.email = 'Ya existe una cuenta con este correo'
    }

    if (!usuarioEditando) {
      if (!formUsuario.password.trim()) err.password = 'La contraseña es obligatoria'
      else if (formUsuario.password.trim().length < 4) err.password = 'La contraseña debe tener al menos 4 caracteres'
    } else if (formUsuario.password.trim() && formUsuario.password.trim().length < 4) {
      err.password = 'La nueva contraseña debe tener al menos 4 caracteres'
    }

    setErroresUsuario(err)
    if (Object.keys(err).length > 0) return

    const fecha = ahoraStr()
    if (usuarioEditando) {
      const cambios = []
      if (usuarioEditando.nombre !== formUsuario.nombre.trim()) cambios.push(`nombre a "${formUsuario.nombre.trim()}"`)
      if (usuarioEditando.email !== formUsuario.email.trim().toLowerCase()) cambios.push(`correo a "${formUsuario.email.trim().toLowerCase()}"`)
      if (usuarioEditando.rol !== formUsuario.rol) cambios.push(`rol a ${formUsuario.rol}`)
      if (usuarioEditando.activo !== formUsuario.activo) cambios.push(`estado a ${formUsuario.activo ? 'activo' : 'desactivado'}`)
      if (formUsuario.password.trim()) cambios.push('contraseña actualizada')

      const evento = { id: Date.now(), fecha, accion: 'Modificación de perfil', detalle: cambios.length > 0 ? `Actualización: ${cambios.join(', ')}` : 'Edición de datos realizada' }
      const actualizado = {
        ...usuarioEditando,
        nombre: formUsuario.nombre.trim(),
        email: formUsuario.email.trim().toLowerCase(),
        password: formUsuario.password.trim() || usuarioEditando.password,
        rol: formUsuario.rol,
        activo: formUsuario.activo,
        historial: [evento, ...(usuarioEditando.historial || [])]
      }
      if (onActualizarUsuario) onActualizarUsuario(actualizado)
      setMensajeUsuario(`Usuario "${actualizado.nombre}" actualizado con éxito`)
    } else {
      const nuevo = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        nombre: formUsuario.nombre.trim(),
        email: formUsuario.email.trim().toLowerCase(),
        password: formUsuario.password.trim(),
        rol: formUsuario.rol,
        activo: formUsuario.activo,
        fechaCreacion: new Date().toISOString().split('T')[0],
        historial: [{ id: Date.now(), fecha, accion: 'Creación de cuenta', detalle: `Cuenta registrada con rol: ${formUsuario.rol}` }]
      }
      if (onCrearUsuario) onCrearUsuario(nuevo)
      setMensajeUsuario(`Usuario "${nuevo.nombre}" creado con éxito`)
    }

    setModalUsuarioAbierto(false)
    setUsuarioEditando(null)
    setTimeout(() => setMensajeUsuario(''), 3500)
  }

  const handleAlternarEstado = (usr) => {
    if (usuarioActual?.email === usr.email && usr.activo) {
      alert('Por motivos de seguridad no puedes desactivar tu propia cuenta activa de administrador.')
      return
    }
    if (onAlternarEstadoUsuario) onAlternarEstadoUsuario(usr.id)
    setMensajeUsuario(`Estado de "${usr.nombre}" actualizado a ${usr.activo ? 'Desactivado' : 'Activo'}`)
    setTimeout(() => setMensajeUsuario(''), 3000)
  }

  const handleAgregarNotaHistorial = (e) => {
    e.preventDefault()
    if (!notaHistorial.trim() || !usuarioHistorialModal) return
    if (onAgregarHistorialUsuario) onAgregarHistorialUsuario(usuarioHistorialModal.id, { accion: 'Nota Administrativa', detalle: notaHistorial.trim() })

    const nuevoEv = { id: Date.now(), fecha: ahoraStr(), accion: 'Nota Administrativa', detalle: notaHistorial.trim() }
    setUsuarioHistorialModal((prev) => ({ ...prev, historial: [nuevoEv, ...(prev.historial || [])] }))
    setNotaHistorial('')
  }

  return (
    <div className="container py-4">
      {/* Encabezado */}
      <div className="mb-4">
        <span className="badge btn-sv-secondary text-uppercase px-3 py-2 rounded-pill mb-2 shadow-sm">
          <i className="bi bi-shield-lock me-1"></i> Rol: Jefe de Tienda
        </span>
        <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--color-secundario)' }}>
          {seccion === 'metricas' ? 'Panel de Métricas y Control' : seccion === 'productos' ? 'Administración de Productos' : 'Gestión de Usuarios'}
        </h1>
        <p className="text-muted small mb-0">
          {seccion === 'usuarios' ? 'Administración de cuentas, roles, permisos y auditoría de eventos del sistema.' : 'Supervisión operativa de ventas, inventario crítico y gestión de catálogo musical.'}
        </p>
      </div>

      {/* Tarjetas KPI de ventas y stock - Solo en Metricas */}
      {seccion === 'metricas' && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="p-3 bg-white rounded-3 shadow-sm border h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted small text-uppercase fw-bold">Total Ventas Acumuladas</span>
                <span style={{ color: 'var(--color-acento)' }}><i className="bi bi-cash-coin fs-4"></i></span>
              </div>
              <h2 className="h3 fw-bold my-1" style={{ color: 'var(--color-acento)' }}>{formatoMoneda(totalVentas)}</h2>
              <span className="badge bg-light text-muted border align-self-start mt-2"><i className="bi bi-receipt me-1"></i> {pedidos.length} pedidos totales</span>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-3 bg-white rounded-3 shadow-sm border h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted small text-uppercase fw-bold">Flujo de Pedidos</span>
                <span style={{ color: 'var(--color-primario)' }}><i className="bi bi-arrow-repeat fs-4"></i></span>
              </div>
              <h2 className="h3 fw-bold my-1" style={{ color: 'var(--color-secundario)' }}>{atendidos} <small className="text-muted fs-6">vs</small> {pendientes}</h2>
              <div className="d-flex gap-2 mt-2">
                <span className="badge btn-sv-secondary">{atendidos} atendidos</span>
                <span className="badge bg-warning text-dark border">{pendientes} pendientes</span>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-3 bg-white rounded-3 shadow-sm border h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted small text-uppercase fw-bold">Productos Stock Crítico</span>
                <span className="text-danger"><i className="bi bi-exclamation-triangle-fill fs-4"></i></span>
              </div>
              <h2 className="h3 fw-bold my-1 text-danger">{stockCritico.length}</h2>
              <span className="badge bg-danger bg-opacity-10 text-danger border border-danger-subtle align-self-start mt-2">Stock ≤ 3 unidades</span>
            </div>
          </div>
        </div>
      )}

      {/* SECCION 1: Metricas y Tablas operativas */}
      {seccion === 'metricas' && (
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="p-4 bg-white rounded-3 shadow-sm border h-100">
              <h2 className="h5 fw-bold mb-3 text-danger"><i className="bi bi-exclamation-triangle me-2"></i>Riesgo de Quiebre ({stockCritico.length})</h2>
              {stockCritico.length === 0 ? <p className="text-muted mb-0">No hay productos con stock crítico.</p> : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light"><tr><th>Código</th><th>Instrumento</th><th>Categoría</th><th>Stock</th><th className="text-end">Precio</th></tr></thead>
                    <tbody>
                      {stockCritico.map((p) => (
                        <tr key={p.codigo}><td className="fw-semibold">{p.codigo}</td><td>{p.nombre}</td><td><span className="badge bg-light text-dark border">{p.categoria}</span></td><td><span className={`badge ${p.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>{p.stock} un.</span></td><td className="text-end fw-semibold">{formatoMoneda(p.precio)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="p-4 bg-white rounded-3 shadow-sm border h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0" style={{ color: 'var(--color-secundario)' }}><i className="bi bi-clock-history me-2" style={{ color: 'var(--color-acento)' }}></i>Últimos Pedidos ({pedidos.length})</h2>
                <span className="badge btn-sv-primary">Ventas</span>
              </div>
              {pedidos.length === 0 ? <p className="text-muted mb-0">No hay pedidos registrados.</p> : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light"><tr><th>ID</th><th>Cliente</th><th>Fecha</th><th>Total</th><th className="text-end">Estado</th></tr></thead>
                    <tbody>
                      {pedidos.map((pedido) => (
                        <tr key={pedido.id}><td className="fw-bold">#{pedido.id}</td><td>{pedido.cliente}</td><td><small className="text-muted">{pedido.fecha}</small></td><td className="fw-semibold">{formatoMoneda(pedido.total)}</td><td className="text-end"><span className={`badge ${pedido.estado === 'Despachado' ? 'bg-success' : pedido.estado === 'En preparación' ? 'bg-primary' : 'bg-warning text-dark'}`}>{pedido.estado}</span></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECCION 2: Catalogo de productos */}
      {seccion === 'productos' && (
        <div className="row g-4">
          <div className="col-12 col-lg-5">
            <div className="p-4 bg-white rounded-3 shadow-sm border">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0" style={{ color: 'var(--color-secundario)' }}>{editandoCodigo ? `Editar Producto (${editandoCodigo})` : 'Nuevo Producto'}</h2>
                {editandoCodigo && <span className="badge btn-sv-primary">Modo Edición</span>}
              </div>
              {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-2 mb-2">
                  <div className="col-4">
                    <label htmlFor="codigo" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>Código</label>
                    <input id="codigo" type="text" name="codigo" placeholder="Ej: GA006" className={`form-control form-control-sm ${errores.codigo ? 'is-invalid' : ''}`} value={form.codigo} onChange={handleChange} disabled={Boolean(editandoCodigo)} />
                    {errores.codigo && <div className="invalid-feedback">{errores.codigo}</div>}
                  </div>
                  <div className="col-8">
                    <label htmlFor="categoria" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>Categoría</label>
                    <select id="categoria" name="categoria" className={`form-select form-select-sm ${errores.categoria ? 'is-invalid' : ''}`} value={form.categoria} onChange={handleChange}>
                      <option>Guitarras Acústicas</option><option>Guitarras Eléctricas</option><option>Bajos Eléctricos</option><option>Baterías y Percusión</option><option>Teclados y Pianos</option><option>Audio y Microfonía</option><option>Accesorios</option>
                    </select>
                    {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
                  </div>
                </div>
                <div className="mb-2">
                  <label htmlFor="nombre" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>Nombre del Instrumento</label>
                  <input id="nombre" type="text" name="nombre" placeholder="Ej: Guitarra Acústica Folk" className={`form-control form-control-sm ${errores.nombre ? 'is-invalid' : ''}`} value={form.nombre} onChange={handleChange} />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label htmlFor="marca" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>Marca</label>
                    <input id="marca" type="text" name="marca" placeholder="Ej: Yamaha" className={`form-control form-control-sm ${errores.marca ? 'is-invalid' : ''}`} value={form.marca} onChange={handleChange} />
                    {errores.marca && <div className="invalid-feedback">{errores.marca}</div>}
                  </div>
                  <div className="col-6">
                    <label htmlFor="modelo" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>Modelo</label>
                    <input id="modelo" type="text" name="modelo" placeholder="Ej: F310" className={`form-control form-control-sm ${errores.modelo ? 'is-invalid' : ''}`} value={form.modelo} onChange={handleChange} />
                    {errores.modelo && <div className="invalid-feedback">{errores.modelo}</div>}
                  </div>
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label htmlFor="precio" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>Precio ($)</label>
                    <input id="precio" type="number" name="precio" min="1" placeholder="Ej: 129990" className={`form-control form-control-sm ${errores.precio ? 'is-invalid' : ''}`} value={form.precio} onChange={handleChange} />
                    {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
                  </div>
                  <div className="col-6">
                    <label htmlFor="stock" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>Stock (unidades)</label>
                    <input id="stock" type="number" name="stock" min="0" step="1" placeholder="Ej: 8" className={`form-control form-control-sm ${errores.stock ? 'is-invalid' : ''}`} value={form.stock} onChange={handleChange} />
                    {errores.stock && <div className="invalid-feedback">{errores.stock}</div>}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>Descripción</label>
                  <textarea id="descripcion" name="descripcion" rows="2" placeholder="Descripción técnica del producto..." className={`form-control form-control-sm ${errores.descripcion ? 'is-invalid' : ''}`} value={form.descripcion} onChange={handleChange}></textarea>
                  {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className={`btn btn-sm ${editandoCodigo ? 'btn-sv-secondary' : 'btn-sv-primary'} flex-grow-1`}>
                    {editandoCodigo ? 'Actualizar Producto' : 'Guardar Producto'}
                  </button>
                  {editandoCodigo && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancelarEdicion}>Cancelar</button>}
                </div>
              </form>
            </div>
          </div>
          <div className="col-12 col-lg-7">
            <div className="p-4 bg-white rounded-3 shadow-sm border">
              <h2 className="h5 fw-bold mb-3" style={{ color: 'var(--color-secundario)' }}>Catálogo Actual ({productos.length})</h2>
              <div className="table-responsive" style={{ maxHeight: '460px' }}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light sticky-top"><tr><th>Código</th><th>Instrumento</th><th>Stock</th><th>Precio</th><th className="text-end">Acción</th></tr></thead>
                  <tbody>
                    {productos.map((prod) => (
                      <tr key={prod.codigo} className={editandoCodigo === prod.codigo ? 'table-warning' : ''}>
                        <td className="fw-semibold">{prod.codigo}</td>
                        <td><div>{prod.nombre}</div>{(prod.marca || prod.modelo) && <small className="text-muted">{prod.marca} {prod.modelo && `· ${prod.modelo}`}</small>}</td>
                        <td><span className={`badge ${prod.stock <= 3 ? 'bg-danger' : 'bg-light text-dark border'}`}>{prod.stock} un.</span></td>
                        <td>{formatoMoneda(prod.precio)}</td>
                        <td className="text-end">
                          <button type="button" className="btn btn-outline-primary btn-sm me-1" onClick={() => handleIniciarEdicion(prod)} title="Editar producto y stock"><i className="bi bi-pencil"></i></button>
                          {onEliminarProducto && <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onEliminarProducto(prod.codigo)} title="Eliminar producto"><i className="bi bi-trash"></i></button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECCION 3: Gestion de Usuarios */}
      {seccion === 'usuarios' && (
        <div className="d-flex flex-column gap-4">
          {mensajeUsuario && (
            <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 shadow-sm border-0 mb-0" role="alert">
              <i className="bi bi-check-circle-fill flex-shrink-0"></i>
              <div>{mensajeUsuario}</div>
            </div>
          )}

          {/* Tarjetas KPI de Usuarios */}
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="p-3 bg-white rounded-3 shadow-sm border h-100 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small text-uppercase fw-bold">Total Usuarios</span>
                  <h3 className="fw-bold my-1" style={{ color: 'var(--color-primario)' }}>{totalUsuarios}</h3>
                  <small className="text-muted">Cuentas registradas</small>
                </div>
                <div style={{ color: 'var(--color-acento)' }}><i className="bi bi-people-fill fs-2"></i></div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-3 bg-white rounded-3 shadow-sm border h-100 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small text-uppercase fw-bold">Usuarios Activos</span>
                  <h3 className="fw-bold my-1 text-success">{usuariosActivos}</h3>
                  <small className="text-muted">Con acceso habilitado</small>
                </div>
                <div className="text-success"><i className="bi bi-person-check-fill fs-2"></i></div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-3 bg-white rounded-3 shadow-sm border h-100 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small text-uppercase fw-bold">Usuarios Desactivados</span>
                  <h3 className="fw-bold my-1 text-danger">{usuariosInactivos}</h3>
                  <small className="text-muted">Acceso suspendido</small>
                </div>
                <div className="text-danger"><i className="bi bi-person-x-fill fs-2"></i></div>
              </div>
            </div>
          </div>

          {/* Barra de herramientas y filtros */}
          <div className="p-3 bg-white rounded-3 shadow-sm border">
            <div className="row g-2 align-items-center justify-content-between">
              <div className="col-12 col-md-4">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light text-muted border-end-0"><i className="bi bi-search"></i></span>
                  <input type="text" className="form-control border-start-0" placeholder="Buscar por nombre o correo..." value={busquedaUsuario} onChange={(e) => setBusquedaUsuario(e.target.value)} />
                  {busquedaUsuario && <button className="btn btn-outline-secondary" type="button" onClick={() => setBusquedaUsuario('')}><i className="bi bi-x"></i></button>}
                </div>
              </div>
              <div className="col-6 col-md-3">
                <select className="form-select form-select-sm" value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} aria-label="Filtrar por rol">
                  <option value="todos">Todos los roles</option><option value="jefe">Jefe / Administrador</option><option value="trabajador">Trabajador</option><option value="cliente">Cliente</option>
                </select>
              </div>
              <div className="col-6 col-md-3">
                <select className="form-select form-select-sm" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} aria-label="Filtrar por estado">
                  <option value="todos">Todos los estados</option><option value="activos">Solo Activos</option><option value="inactivos">Solo Desactivados</option>
                </select>
              </div>
              <div className="col-12 col-md-2 text-md-end">
                <button type="button" className="btn btn-sv-primary btn-sm w-100 shadow-sm" onClick={handleAbrirCrearUsuario}>
                  <i className="bi bi-person-plus-fill me-1"></i> Nuevo Usuario
                </button>
              </div>
            </div>
          </div>

          {/* Tabla Directorio de Usuarios */}
          <div className="p-4 bg-white rounded-3 shadow-sm border">
            <h2 className="h5 fw-bold mb-3" style={{ color: 'var(--color-secundario)' }}>Directorio de Usuarios ({usuariosFiltrados.length})</h2>
            {usuariosFiltrados.length === 0 ? (
              <div className="text-center py-5 text-muted"><i className="bi bi-people fs-1 d-block mb-2 text-secondary"></i>No se encontraron usuarios que coincidan con los filtros.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light"><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Fecha Registro</th><th className="text-end">Acciones</th></tr></thead>
                  <tbody>
                    {usuariosFiltrados.map((usr) => {
                      const esActivo = usr.activo !== false
                      const esJefe = usr.rol === 'jefe'
                      const esTrabajador = usr.rol === 'trabajador'
                      return (
                        <tr key={usr.id || usr.email}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white flex-shrink-0" style={{ width: '38px', height: '38px', backgroundColor: esJefe ? '#dc3545' : esTrabajador ? '#0d6efd' : '#198754', fontSize: '0.9rem' }}>
                                {usr.nombre ? usr.nombre.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div className="fw-semibold text-dark">{usr.nombre}</div>
                                <small className="text-muted">{usr.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${esJefe ? 'bg-danger text-white' : esTrabajador ? 'bg-primary text-white' : 'bg-success text-white'} px-2 py-1`}>
                              {esJefe ? 'Jefe / Admin' : esTrabajador ? 'Trabajador' : 'Cliente'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${esActivo ? 'bg-success bg-opacity-10 text-success border border-success-subtle' : 'bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle'} px-2 py-1`}>
                              <i className={`bi ${esActivo ? 'bi-check-circle-fill' : 'bi-slash-circle'} me-1`}></i>
                              {esActivo ? 'Activo' : 'Desactivado'}
                            </span>
                          </td>
                          <td><small className="text-muted">{usr.fechaCreacion || 'N/A'}</small></td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button type="button" className="btn btn-outline-secondary" onClick={() => setUsuarioHistorialModal(usr)} title="Ver historial de actividad">
                                <i className="bi bi-clock-history me-1"></i>
                                <span className="badge bg-light text-dark border ms-1" style={{ fontSize: '0.7rem' }}>{usr.historial?.length || 0}</span>
                              </button>
                              <button type="button" className="btn btn-outline-primary" onClick={() => handleAbrirEditarUsuario(usr)} title="Editar datos del usuario"><i className="bi bi-pencil"></i></button>
                              <button type="button" className={`btn ${esActivo ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => handleAlternarEstado(usr)} title={esActivo ? 'Desactivar usuario' : 'Activar usuario'}>
                                <i className={`bi ${esActivo ? 'bi-person-slash' : 'bi-person-check'}`}></i>
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

          {/* Modal Crear / Editar Usuario */}
          <Modal
            abierto={modalUsuarioAbierto}
            onCerrar={() => setModalUsuarioAbierto(false)}
            titulo={usuarioEditando ? `Editar Usuario: ${usuarioEditando.nombre}` : 'Crear Nuevo Usuario'}
            icono={usuarioEditando ? 'bi-pencil-square' : 'bi-person-plus-fill'}
            footer={
              <>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setModalUsuarioAbierto(false)}>Cancelar</button>
                <button type="submit" form="form-usuario-modal" className="btn btn-sv-primary shadow-sm"><i className="bi bi-save me-1"></i>{usuarioEditando ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
              </>
            }
          >
            <form id="form-usuario-modal" onSubmit={handleGuardarUsuario} noValidate>
              <div className="modal-body px-4 py-3">
                <div className="mb-3">
                  <label htmlFor="usr-nombre" className="form-label small fw-bold text-secondary">Nombre Completo</label>
                  <input id="usr-nombre" type="text" className={`form-control ${erroresUsuario.nombre ? 'is-invalid' : ''}`} placeholder="Ej: Marcelo Ríos" value={formUsuario.nombre} onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })} />
                  {erroresUsuario.nombre && <div className="invalid-feedback">{erroresUsuario.nombre}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="usr-email" className="form-label small fw-bold text-secondary">Correo Electrónico</label>
                  <input id="usr-email" type="email" className={`form-control ${erroresUsuario.email ? 'is-invalid' : ''}`} placeholder="ejemplo@sonidovivo.cl" value={formUsuario.email} onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })} />
                  {erroresUsuario.email && <div className="invalid-feedback">{erroresUsuario.email}</div>}
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label htmlFor="usr-password" className="form-label small fw-bold text-secondary mb-0">{usuarioEditando ? 'Nueva Contraseña (en blanco para mantener actual)' : 'Contraseña'}</label>
                    <button type="button" className="btn btn-link p-0 text-muted small text-decoration-none" onClick={() => setMostrarPasswordUsuario(!mostrarPasswordUsuario)} style={{ fontSize: '0.8rem' }}>
                      <i className={`bi ${mostrarPasswordUsuario ? 'bi-eye-slash' : 'bi-eye'} me-1`}></i>{mostrarPasswordUsuario ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  <input id="usr-password" type={mostrarPasswordUsuario ? 'text' : 'password'} className={`form-control ${erroresUsuario.password ? 'is-invalid' : ''}`} placeholder={usuarioEditando ? '••••••••' : 'Mínimo 4 caracteres'} value={formUsuario.password} onChange={(e) => setFormUsuario({ ...formUsuario, password: e.target.value })} />
                  {erroresUsuario.password && <div className="invalid-feedback">{erroresUsuario.password}</div>}
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label htmlFor="usr-rol" className="form-label small fw-bold text-secondary">Rol Asignado</label>
                    <select id="usr-rol" className="form-select" value={formUsuario.rol} onChange={(e) => setFormUsuario({ ...formUsuario, rol: e.target.value })}>
                      <option value="cliente">Cliente</option><option value="trabajador">Trabajador</option><option value="jefe">Jefe / Administrador</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label htmlFor="usr-activo" className="form-label small fw-bold text-secondary">Estado de la Cuenta</label>
                    <select id="usr-activo" className="form-select" value={formUsuario.activo ? 'activo' : 'inactivo'} onChange={(e) => setFormUsuario({ ...formUsuario, activo: e.target.value === 'activo' })}>
                      <option value="activo">Habilitado (Activo)</option><option value="inactivo">Desactivado</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </Modal>

          {/* Modal Historial de Auditoria */}
          <Modal
            abierto={Boolean(usuarioHistorialModal)}
            onCerrar={() => setUsuarioHistorialModal(null)}
            titulo={`Historial de Auditoría: ${usuarioHistorialModal?.nombre || ''}`}
            icono="bi-clock-history"
            subtitulo={`${usuarioHistorialModal?.email || ''} · Rol: ${(usuarioHistorialModal?.rol || '').toUpperCase()}`}
            maxWidth="650px"
            footer={<button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setUsuarioHistorialModal(null)}>Cerrar</button>}
          >
            <div className="modal-body px-4 py-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <h6 className="fw-bold mb-3 text-secondary"><i className="bi bi-journal-text me-1"></i> Registro de Eventos ({usuarioHistorialModal?.historial?.length || 0})</h6>
              {!usuarioHistorialModal?.historial?.length ? (
                <p className="text-muted small">No hay eventos registrados para este usuario.</p>
              ) : (
                <div className="d-flex flex-column gap-2 mb-4">
                  {usuarioHistorialModal.historial.map((ev, idx) => {
                    const esDesactiv = ev.accion?.includes('Desactiv')
                    const esPositivo = ev.accion?.includes('Activ') || ev.accion?.includes('Creac')
                    return (
                      <div key={ev.id || idx} className="p-3 bg-light rounded-3 border d-flex gap-3 align-items-start">
                        <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 mt-1" style={{ width: '32px', height: '32px', backgroundColor: esDesactiv ? '#fee2e2' : esPositivo ? '#dcfce7' : '#f3e8ff', color: esDesactiv ? '#dc2626' : esPositivo ? '#16a34a' : '#7c3aed' }}>
                          <i className={`bi ${esDesactiv ? 'bi-slash-circle' : esPositivo ? 'bi-check-circle' : ev.accion?.includes('Compra') ? 'bi-bag-check' : 'bi-pencil-square'}`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center"><span className="fw-bold text-dark small">{ev.accion}</span><small className="text-muted">{ev.fecha}</small></div>
                          <p className="mb-0 text-secondary small mt-1">{ev.detalle}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <div className="border-top pt-3">
                <h6 className="fw-bold mb-2 text-secondary small"><i className="bi bi-chat-left-dots me-1"></i> Agregar nota administrativa a este usuario:</h6>
                <form onSubmit={handleAgregarNotaHistorial} className="d-flex gap-2">
                  <input type="text" className="form-control form-control-sm" placeholder="Ej: Se validó identidad telefónicamente..." value={notaHistorial} onChange={(e) => setNotaHistorial(e.target.value)} />
                  <button type="submit" className="btn btn-sv-primary btn-sm flex-shrink-0" disabled={!notaHistorial.trim()}><i className="bi bi-plus-circle me-1"></i> Añadir Nota</button>
                </form>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  )
}

export default VistaJefe
