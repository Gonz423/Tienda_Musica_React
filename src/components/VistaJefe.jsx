import { useState } from 'react'

function VistaJefe({
  productos = [],
  pedidos = [],
  onAgregarProducto,
  onActualizarProducto,
  onEliminarProducto,
  seccionActiva = 'metricas'
}) {
  const seccion = seccionActiva

  // Estructura inicial del formulario con todos los campos requeridos
  const formInicial = {
    codigo: '',
    nombre: '',
    marca: '',
    modelo: '',
    categoria: 'Guitarras Acústicas',
    precio: '',
    stock: '',
    descripcion: ''
  }

  // Estado del formulario controlado para crear o editar producto
  const [form, setForm] = useState(formInicial)
  const [editandoCodigo, setEditandoCodigo] = useState(null)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  // Calculos dinamicos de KPIs segun pedidos y productos
  const totalVentas = pedidos.reduce((acc, p) => acc + (Number(p.total) || 0), 0)
  const atendidos = pedidos.filter((p) => p.estado === 'Despachado').length
  const pendientes = pedidos.filter((p) => p.estado !== 'Despachado').length
  const stockCritico = productos.filter((p) => p.stock <= 3)

  // Formato para representar valores en pesos chilenos
  const formatoMoneda = (val) => `$${Number(val || 0).toLocaleString('es-CL')}`

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Iniciar la edicion de un producto existente
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

  // Cancelar la edicion y limpiar el formulario
  const handleCancelarEdicion = () => {
    setEditandoCodigo(null)
    setForm(formInicial)
    setErrores({})
  }

  // Validacion y envio del formulario (crear o actualizar)
  const handleSubmit = (e) => {
    e.preventDefault()
    const nuevosErrores = {}

    // Validacion de campos obligatorios de texto
    if (!form.codigo.trim()) nuevosErrores.codigo = 'El código es obligatorio'
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio'
    if (!form.marca.trim()) nuevosErrores.marca = 'La marca es obligatoria'
    if (!form.modelo.trim()) nuevosErrores.modelo = 'El modelo es obligatorio'
    if (!form.categoria.trim()) nuevosErrores.categoria = 'La categoría es obligatoria'
    if (!form.descripcion.trim()) nuevosErrores.descripcion = 'La descripción es obligatoria'

    // Validacion de precio mayor a cero
    const precioNum = Number(form.precio)
    if (form.precio === '' || isNaN(precioNum) || precioNum <= 0) {
      nuevosErrores.precio = 'El precio debe ser mayor a 0'
    }

    // Validacion de stock como numero entero no negativo
    const stockNum = Number(form.stock)
    if (form.stock === '' || isNaN(stockNum) || !Number.isInteger(stockNum) || stockNum < 0) {
      nuevosErrores.stock = 'El stock debe ser un entero no negativo (≥ 0)'
    }

    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    if (editandoCodigo) {
      const productoActualizado = {
        ...form,
        precio: precioNum,
        stock: stockNum
      }
      if (onActualizarProducto) {
        onActualizarProducto(productoActualizado)
      }
      localStorage.setItem('productos_catalogo', JSON.stringify(productoActualizado))
      setMensaje(`Producto "${form.nombre}" actualizado con éxito`)
      handleCancelarEdicion()
    } else {
      const nuevoProducto = {
        ...form,
        codigo: form.codigo.trim().toUpperCase(),
        precio: precioNum,
        stock: stockNum
      }
      if (onAgregarProducto) {
        onAgregarProducto(nuevoProducto)
      }
      localStorage.setItem('productos_catalogo', JSON.stringify(nuevoProducto))
      setMensaje(`Producto "${form.nombre}" agregado con éxito`)
      setForm(formInicial)
      setErrores({})
    }
    setTimeout(() => setMensaje(''), 3000)
  }

  return (
    <div className="container py-4">
      {/* Encabezado con identidad Sonido Vivo usando variables existentes */}
      <div className="mb-4">
        <span className="badge btn-sv-secondary text-uppercase px-3 py-2 rounded-pill mb-2 shadow-sm">
          <i className="bi bi-shield-lock me-1"></i> Rol: Jefe de Tienda
        </span>
        <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--color-secundario)' }}>
          {seccion === 'metricas' ? 'Panel de Métricas y Control' : 'Administración de Productos'}
        </h1>
        <p className="text-muted small mb-0">
          Supervisión operativa de ventas, inventario crítico y gestión de catálogo musical.
        </p>
      </div>

      {/* Tarjetas de resumen (KPIs) con grilla responsiva y clases nativas */}
      <div className="row g-3 mb-4">
        {/* KPI 1: Total ventas acumuladas */}
        <div className="col-12 col-md-4">
          <div className="p-3 bg-white rounded-3 shadow-sm border h-100">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small text-uppercase fw-bold">Total Ventas Acumuladas</span>
              <span className="p-2 rounded-circle" style={{ backgroundColor: 'var(--color-fondo)', color: 'var(--color-acento)' }}>
                <i className="bi bi-cash-coin fs-5"></i>
              </span>
            </div>
            <h2 className="h3 fw-bold my-1" style={{ color: 'var(--color-acento)' }}>{formatoMoneda(totalVentas)}</h2>
            <span className="badge bg-light text-muted border align-self-start mt-2">
              <i className="bi bi-receipt me-1"></i> {pedidos.length} pedidos totales
            </span>
          </div>
        </div>

        {/* KPI 2: Pedidos atendidos vs pendientes */}
        <div className="col-12 col-md-4">
          <div className="p-3 bg-white rounded-3 shadow-sm border h-100">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small text-uppercase fw-bold">Flujo de Pedidos</span>
              <span className="p-2 rounded-circle" style={{ backgroundColor: 'var(--color-fondo)', color: 'var(--color-primario)' }}>
                <i className="bi bi-arrow-repeat fs-5"></i>
              </span>
            </div>
            <h2 className="h3 fw-bold my-1" style={{ color: 'var(--color-secundario)' }}>
              {atendidos} <small className="text-muted fs-6">vs</small> {pendientes}
            </h2>
            <div className="d-flex gap-2 mt-2">
              <span className="badge btn-sv-secondary">
                {atendidos} atendidos
              </span>
              <span className="badge bg-warning text-dark border">
                {pendientes} pendientes
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Productos con stock critico */}
        <div className="col-12 col-md-4">
          <div className="p-3 bg-white rounded-3 shadow-sm border h-100">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small text-uppercase fw-bold">Productos Stock Crítico</span>
              <span className="p-2 rounded-circle bg-danger bg-opacity-10 text-danger">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
              </span>
            </div>
            <h2 className="h3 fw-bold my-1 text-danger">{stockCritico.length}</h2>
            <span className="badge bg-danger bg-opacity-10 text-danger border border-danger-subtle align-self-start mt-2">
              Stock ≤ 3 unidades
            </span>
          </div>
        </div>
      </div>

      {/* SECCION 1: Resumen operativo con alerta de stock y ultimos pedidos */}
      {seccion === 'metricas' && (
        <div className="row g-4">
          {/* Tabla de alerta de stock critico */}
          <div className="col-12 col-lg-6">
            <div className="p-4 bg-white rounded-3 shadow-sm border h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0 text-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Riesgo de Quiebre ({stockCritico.length})
                </h2>
              </div>
              {stockCritico.length === 0 ? (
                <p className="text-muted mb-0">No hay productos con stock crítico.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Código</th>
                        <th>Instrumento</th>
                        <th>Categoría</th>
                        <th>Stock</th>
                        <th className="text-end">Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockCritico.map((p) => (
                        <tr key={p.codigo}>
                          <td className="fw-semibold">{p.codigo}</td>
                          <td>{p.nombre}</td>
                          <td>
                            <span className="badge bg-light text-dark border">{p.categoria}</span>
                          </td>
                          <td>
                            <span className={`badge ${p.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                              {p.stock} un.
                            </span>
                          </td>
                          <td className="text-end fw-semibold">{formatoMoneda(p.precio)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Tabla de ultimos pedidos registrados */}
          <div className="col-12 col-lg-6">
            <div className="p-4 bg-white rounded-3 shadow-sm border h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0" style={{ color: 'var(--color-secundario)' }}>
                  <i className="bi bi-clock-history me-2" style={{ color: 'var(--color-acento)' }}></i>
                  Últimos Pedidos ({pedidos.length})
                </h2>
                <span className="badge btn-sv-primary">Ventas</span>
              </div>
              {pedidos.length === 0 ? (
                <p className="text-muted mb-0">No hay pedidos registrados.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th className="text-end">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.map((pedido) => (
                        <tr key={pedido.id}>
                          <td className="fw-bold">#{pedido.id}</td>
                          <td>{pedido.cliente}</td>
                          <td><small className="text-muted">{pedido.fecha}</small></td>
                          <td className="fw-semibold">{formatoMoneda(pedido.total)}</td>
                          <td className="text-end">
                            <span
                              className={`badge ${
                                pedido.estado === 'Despachado'
                                  ? 'bg-success'
                                  : pedido.estado === 'En preparación'
                                  ? 'bg-primary'
                                  : 'bg-warning text-dark'
                              }`}
                            >
                              {pedido.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECCION 2: Administracion de productos (Formulario y tabla) */}
      {seccion === 'productos' && (
        <div className="row g-4">
          {/* Formulario para registrar o editar producto */}
          <div className="col-12 col-lg-5">
            <div className="p-4 bg-white rounded-3 shadow-sm border">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0" style={{ color: 'var(--color-secundario)' }}>
                  {editandoCodigo ? `Editar Producto (${editandoCodigo})` : 'Nuevo Producto'}
                </h2>
                {editandoCodigo && (
                  <span className="badge btn-sv-primary">Modo Edición</span>
                )}
              </div>
              {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-2 mb-2">
                  <div className="col-4">
                    <label htmlFor="codigo" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>
                      Código
                    </label>
                    <input
                      id="codigo"
                      type="text"
                      name="codigo"
                      placeholder="Ej: GA006"
                      className={`form-control form-control-sm ${errores.codigo ? 'is-invalid' : ''}`}
                      value={form.codigo}
                      onChange={handleChange}
                      disabled={Boolean(editandoCodigo)}
                    />
                    {errores.codigo && <div className="invalid-feedback">{errores.codigo}</div>}
                  </div>
                  <div className="col-8">
                    <label htmlFor="categoria" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>
                      Categoría
                    </label>
                    <select
                      id="categoria"
                      name="categoria"
                      className={`form-select form-select-sm ${errores.categoria ? 'is-invalid' : ''}`}
                      value={form.categoria}
                      onChange={handleChange}
                    >
                      <option>Guitarras Acústicas</option>
                      <option>Guitarras Eléctricas</option>
                      <option>Bajos Eléctricos</option>
                      <option>Baterías y Percusión</option>
                      <option>Teclados y Pianos</option>
                      <option>Audio y Microfonía</option>
                      <option>Accesorios</option>
                    </select>
                    {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="nombre" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>
                    Nombre del Instrumento
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    placeholder="Ej: Guitarra Acústica Folk"
                    className={`form-control form-control-sm ${errores.nombre ? 'is-invalid' : ''}`}
                    value={form.nombre}
                    onChange={handleChange}
                  />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label htmlFor="marca" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>
                      Marca
                    </label>
                    <input
                      id="marca"
                      type="text"
                      name="marca"
                      placeholder="Ej: Yamaha"
                      className={`form-control form-control-sm ${errores.marca ? 'is-invalid' : ''}`}
                      value={form.marca}
                      onChange={handleChange}
                    />
                    {errores.marca && <div className="invalid-feedback">{errores.marca}</div>}
                  </div>
                  <div className="col-6">
                    <label htmlFor="modelo" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>
                      Modelo
                    </label>
                    <input
                      id="modelo"
                      type="text"
                      name="modelo"
                      placeholder="Ej: F310"
                      className={`form-control form-control-sm ${errores.modelo ? 'is-invalid' : ''}`}
                      value={form.modelo}
                      onChange={handleChange}
                    />
                    {errores.modelo && <div className="invalid-feedback">{errores.modelo}</div>}
                  </div>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label htmlFor="precio" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>
                      Precio ($)
                    </label>
                    <input
                      id="precio"
                      type="number"
                      name="precio"
                      min="1"
                      placeholder="Ej: 129990"
                      className={`form-control form-control-sm ${errores.precio ? 'is-invalid' : ''}`}
                      value={form.precio}
                      onChange={handleChange}
                    />
                    {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
                  </div>
                  <div className="col-6">
                    <label htmlFor="stock" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>
                      Stock (unidades)
                    </label>
                    <input
                      id="stock"
                      type="number"
                      name="stock"
                      min="0"
                      step="1"
                      placeholder="Ej: 8"
                      className={`form-control form-control-sm ${errores.stock ? 'is-invalid' : ''}`}
                      value={form.stock}
                      onChange={handleChange}
                    />
                    {errores.stock && <div className="invalid-feedback">{errores.stock}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label small fw-semibold" style={{ color: 'var(--color-secundario)' }}>
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    rows="2"
                    placeholder="Descripción técnica del producto..."
                    className={`form-control form-control-sm ${errores.descripcion ? 'is-invalid' : ''}`}
                    value={form.descripcion}
                    onChange={handleChange}
                  ></textarea>
                  {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className={`btn btn-sm ${editandoCodigo ? 'btn-sv-secondary' : 'btn-sv-primary'} flex-grow-1`}
                  >
                    {editandoCodigo ? 'Actualizar Producto' : 'Guardar Producto'}
                  </button>
                  {editandoCodigo && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleCancelarEdicion}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Tabla de catalogo con accion de editar y eliminar */}
          <div className="col-12 col-lg-7">
            <div className="p-4 bg-white rounded-3 shadow-sm border">
              <h2 className="h5 fw-bold mb-3" style={{ color: 'var(--color-secundario)' }}>
                Catálogo Actual ({productos.length})
              </h2>
              <div className="table-responsive" style={{ maxHeight: '460px' }}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th>Código</th>
                      <th>Instrumento</th>
                      <th>Stock</th>
                      <th>Precio</th>
                      <th className="text-end">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((prod) => (
                      <tr
                        key={prod.codigo}
                        className={editandoCodigo === prod.codigo ? 'table-warning' : ''}
                      >
                        <td className="fw-semibold">{prod.codigo}</td>
                        <td>
                          <div>{prod.nombre}</div>
                          {(prod.marca || prod.modelo) && (
                            <small className="text-muted">
                              {prod.marca} {prod.modelo && `· ${prod.modelo}`}
                            </small>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${prod.stock <= 3 ? 'bg-danger' : 'bg-light text-dark border'}`}>
                            {prod.stock} un.
                          </span>
                        </td>
                        <td>{formatoMoneda(prod.precio)}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm me-1"
                            onClick={() => handleIniciarEdicion(prod)}
                            title="Editar producto y stock"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          {onEliminarProducto && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => onEliminarProducto(prod.codigo)}
                              title="Eliminar producto"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
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
    </div>
  )
}

export default VistaJefe
