function TablaUltimosPedidos({ pedidos = [], formatoMoneda }) {
  return (
    <div className="p-4 bg-white rounded-3 shadow-sm border h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 fw-bold mb-0" style={{ color: 'var(--color-secundario)' }}>
          <i
            className="bi bi-clock-history me-2"
            style={{ color: 'var(--color-acento)' }}
          ></i>
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
                  <td>
                    <small className="text-muted">{pedido.fecha}</small>
                  </td>
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
  )
}

export default TablaUltimosPedidos
