function TablaStockCritico({ stockCritico = [], formatoMoneda }) {
  return (
    <div className="p-4 bg-white rounded-3 shadow-sm border h-100">
      <h2 className="h5 fw-bold mb-3 text-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Riesgo de Quiebre ({stockCritico.length})
      </h2>
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
                    <span className="badge bg-light text-dark border">
                      {p.categoria}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        p.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'
                      }`}
                    >
                      {p.stock} un.
                    </span>
                  </td>
                  <td className="text-end fw-semibold">
                    {formatoMoneda(p.precio)}
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

export default TablaStockCritico
