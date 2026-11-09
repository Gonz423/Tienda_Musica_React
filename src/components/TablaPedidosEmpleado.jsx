import { Link } from 'react-router-dom'

function TablaPedidosEmpleado({
  pedidos = [],
  agruparProductos,
  obtenerColorBadge,
  avanzarEstado
}) {
  return (
    <div
      className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4"
      style={{ border: '1px solid rgba(75, 46, 43, 0.15)' }}
    >
      <div className="p-3 header-sonido-vivo text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold fs-6">
          <i className="bi bi-list-check me-2"></i>Cola de Despacho y Retiro en Tienda
        </h5>
        <span className="badge bg-light text-dark rounded-pill fw-bold">
          {pedidos.length} órdenes
        </span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light border-bottom">
            <tr>
              <th scope="col" className="ps-3"># ID</th>
              <th scope="col">Fecha</th>
              <th scope="col">Cliente</th>
              <th scope="col">Tipo de entrega</th>
              <th scope="col">Artículos</th>
              <th scope="col">Total venta</th>
              <th scope="col">Estado de venta</th>
              <th scope="col" className="text-center pe-3">Acción Operativa</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td className="fw-bold ps-3 text-dark">#{pedido.id}</td>
                <td className="small text-muted">{pedido.fecha}</td>
                <td className="fw-semibold">{pedido.cliente}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${
                      pedido.tipoEntrega?.toLowerCase().includes('domicilio')
                        ? 'bg-light text-dark border border-secondary'
                        : 'btn-sv-secondary'
                    }`}
                    style={{ fontSize: '0.75rem' }}
                  >
                    <i
                      className={`bi ${
                        pedido.tipoEntrega?.toLowerCase().includes('domicilio')
                          ? 'bi-truck'
                          : 'bi-shop'
                      } me-1`}
                    ></i>
                    {pedido.tipoEntrega}
                  </span>
                </td>
                <td>
                  <ul className="list-unstyled mb-0 small">
                    {agruparProductos(pedido.productos).map((prod, idx) => (
                      <li key={`${prod.id || prod.codigo}-${idx}`} className="py-1">
                        <span>
                          <strong>{prod.cantidad}x</strong>{' '}
                          <Link
                            to={`/producto/${prod.codigo}`}
                            className="text-decoration-none text-dark fw-medium"
                          >
                            {prod.nombre}
                          </Link>
                        </span>{' '}
                        {prod.stock < 3 && (
                          <span
                            className="badge bg-danger ms-1"
                            style={{ fontSize: '0.68rem' }}
                          >
                            Stock bajo: {prod.stock} disp.
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>

                <td className="fw-bold" style={{ color: 'var(--color-primario)' }}>
                  ${pedido.total.toLocaleString('es-CL')}
                </td>

                <td>
                  <span className={`badge ${obtenerColorBadge(pedido.estado)} px-2 py-1`}>
                    {pedido.estado}
                  </span>
                </td>
                <td className="text-center pe-3">
                  {pedido.estado === 'Pendiente' && (
                    <button
                      type="button"
                      className="btn btn-warning btn-sm fw-semibold shadow-sm text-dark"
                      onClick={() => avanzarEstado(pedido.id)}
                    >
                      Preparar
                    </button>
                  )}

                  {(pedido.estado === 'En preparación' || pedido.estado === 'En preparacion') && (
                    <button
                      type="button"
                      className="btn btn-sv-primary btn-sm fw-semibold shadow-sm"
                      onClick={() => avanzarEstado(pedido.id)}
                    >
                      Despachar
                    </button>
                  )}

                  {pedido.estado === 'Despachado' && (
                    <span className="badge bg-success px-2 py-1">Completado</span>
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

export default TablaPedidosEmpleado
