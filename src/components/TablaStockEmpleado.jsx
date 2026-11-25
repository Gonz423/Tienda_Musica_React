import { Link } from 'react-router-dom'

function TablaStockEmpleado({
  productos = [],
  stockBajoCount = 0,
  handleAjustarStock,
  soloLectura = false
}) {
  return (
    <div
      className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white"
      style={{ border: '1px solid rgba(75, 46, 43, 0.15)' }}
    >
      <div className="p-3 header-sonido-vivo text-white d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 className="mb-0 fw-bold fs-6">
          <i className="bi bi-boxes me-2"></i>Inventario y Disponibilidad en Bodega
        </h5>
        <span className="badge bg-danger text-white rounded-pill px-3 py-1 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill me-1"></i>
          Cantidad de productos con stock bajo: {stockBajoCount}
        </span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light border-bottom">
            <tr>
              <th className="ps-3">Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Estado Stock</th>
              <th>Unidades</th>
              {!soloLectura && <th className="text-center pe-3">Ajuste Rápido</th>}
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id || prod.codigo}>
                <td className="fw-bold ps-3">{prod.codigo}</td>
                <td>
                  <Link
                    to={`/producto/${prod.codigo}`}
                    className="text-decoration-none fw-semibold text-dark"
                  >
                    {prod.nombre}
                  </Link>
                </td>
                <td>
                  <span className="badge bg-light text-dark border">{prod.categoria}</span>
                </td>
                <td>
                  {prod.stock === 0 ? (
                    <span className="badge bg-danger">Agotado</span>
                  ) : prod.stock < 3 ? (
                    <span className="badge bg-warning text-dark">Stock bajo</span>
                  ) : (
                    <span className="badge bg-success">Disponible</span>
                  )}
                </td>
                <td className="fw-bold fs-6" style={{ color: 'var(--color-primario)' }}>
                  {prod.stock}
                </td>
                {!soloLectura && (
                <td className="text-center pe-3">
                  <div className="btn-group btn-group-sm border rounded bg-white shadow-sm">
                    <button
                      type="button"
                      className="btn btn-light px-3 py-1 border-end text-danger fw-bold"
                      onClick={() =>
                        handleAjustarStock(prod.codigo, Math.max(0, prod.stock - 1))
                      }
                      disabled={prod.stock === 0}
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      className="btn btn-light px-3 py-1 text-success fw-bold"
                      onClick={() => handleAjustarStock(prod.codigo, prod.stock + 1)}
                    >
                      +1
                    </button>
                  </div>
                </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TablaStockEmpleado
