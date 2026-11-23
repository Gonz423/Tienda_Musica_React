function FormularioProducto({
  form,
  editandoCodigo,
  errores = {},
  mensaje = '',
  onChange,
  onSubmit,
  onCancelar
}) {
  return (
    <div className="p-4 bg-white rounded-3 shadow-sm border">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 fw-bold mb-0" style={{ color: 'var(--color-secundario)' }}>
          {editandoCodigo ? `Editar Producto (${editandoCodigo})` : 'Nuevo Producto'}
        </h2>
        {editandoCodigo && <span className="badge btn-sv-primary">Modo Edición</span>}
      </div>
      {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}
      <form onSubmit={onSubmit} noValidate>
        <div className="row g-2 mb-2">
          <div className="col-4">
            <label
              htmlFor="codigo"
              className="form-label small fw-semibold"
              style={{ color: 'var(--color-secundario)' }}
            >
              Código
            </label>
            <input
              id="codigo"
              type="text"
              name="codigo"
              placeholder="Ej: GA006"
              className={`form-control form-control-sm ${errores.codigo ? 'is-invalid' : ''}`}
              value={form.codigo}
              onChange={onChange}
              disabled={Boolean(editandoCodigo)}
            />
            {errores.codigo && <div className="invalid-feedback">{errores.codigo}</div>}
          </div>
          <div className="col-8">
            <label
              htmlFor="categoria"
              className="form-label small fw-semibold"
              style={{ color: 'var(--color-secundario)' }}
            >
              Categoría
            </label>
            <select
              id="categoria"
              name="categoria"
              className={`form-select form-select-sm ${errores.categoria ? 'is-invalid' : ''}`}
              value={form.categoria}
              onChange={onChange}
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
          <label
            htmlFor="nombre"
            className="form-label small fw-semibold"
            style={{ color: 'var(--color-secundario)' }}
          >
            Nombre del Instrumento
          </label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Ej: Guitarra Acústica Folk"
            className={`form-control form-control-sm ${errores.nombre ? 'is-invalid' : ''}`}
            value={form.nombre}
            onChange={onChange}
          />
          {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
        </div>
        <div className="row g-2 mb-2">
          <div className="col-6">
            <label
              htmlFor="marca"
              className="form-label small fw-semibold"
              style={{ color: 'var(--color-secundario)' }}
            >
              Marca
            </label>
            <input
              id="marca"
              type="text"
              name="marca"
              placeholder="Ej: Yamaha"
              className={`form-control form-control-sm ${errores.marca ? 'is-invalid' : ''}`}
              value={form.marca}
              onChange={onChange}
            />
            {errores.marca && <div className="invalid-feedback">{errores.marca}</div>}
          </div>
          <div className="col-6">
            <label
              htmlFor="modelo"
              className="form-label small fw-semibold"
              style={{ color: 'var(--color-secundario)' }}
            >
              Modelo
            </label>
            <input
              id="modelo"
              type="text"
              name="modelo"
              placeholder="Ej: F310"
              className={`form-control form-control-sm ${errores.modelo ? 'is-invalid' : ''}`}
              value={form.modelo}
              onChange={onChange}
            />
            {errores.modelo && <div className="invalid-feedback">{errores.modelo}</div>}
          </div>
        </div>
        <div className="row g-2 mb-2">
          <div className="col-6">
            <label
              htmlFor="precio"
              className="form-label small fw-semibold"
              style={{ color: 'var(--color-secundario)' }}
            >
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
              onChange={onChange}
            />
            {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
          </div>
          <div className="col-6">
            <label
              htmlFor="stock"
              className="form-label small fw-semibold"
              style={{ color: 'var(--color-secundario)' }}
            >
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
              onChange={onChange}
            />
            {errores.stock && <div className="invalid-feedback">{errores.stock}</div>}
          </div>
        </div>
        <div className="mb-3">
          <label
            htmlFor="descripcion"
            className="form-label small fw-semibold"
            style={{ color: 'var(--color-secundario)' }}
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="2"
            placeholder="Descripción técnica del producto..."
            className={`form-control form-control-sm ${errores.descripcion ? 'is-invalid' : ''}`}
            value={form.descripcion}
            onChange={onChange}
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
              onClick={onCancelar}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default FormularioProducto
