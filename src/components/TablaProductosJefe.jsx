function TablaProductosJefe({
  productos = [],
  editandoCodigo,
  formatoMoneda,
  handleIniciarEdicion,
  onEliminarProducto
}) {
  return (
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
                  <span
                    className={`badge ${
                      prod.stock <= 3 ? 'bg-danger' : 'bg-light text-dark border'
                    }`}
                  >
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
  )
}

export default TablaProductosJefe
