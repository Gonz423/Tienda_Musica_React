import { useState } from 'react'
import { Link } from 'react-router-dom'
import { esStockCritico } from '../utils/roles'

function BadgeStock({ stock }) {
  if (stock === 0) {
    return (
      <span className="badge bg-danger">
        <i className="bi bi-x-octagon-fill me-1"></i>Agotado
      </span>
    )
  }
  if (esStockCritico({ stock })) {
    return (
      <span className="badge bg-danger bg-gradient">
        <i className="bi bi-exclamation-triangle-fill me-1"></i>Stock crítico
      </span>
    )
  }
  return <span className="badge bg-success">Disponible</span>
}

function FilaBodega({ producto, procesando, onAjustar }) {
  const [cantidad, setCantidad] = useState('')
  const stock = Number(producto.stock ?? 0)
  const critico = esStockCritico(producto)
  const delta = Number.parseInt(cantidad, 10)
  const deltaValido = Number.isInteger(delta) && delta !== 0 && stock + delta >= 0

  const aplicarPersonalizado = async (e) => {
    e.preventDefault()
    if (!deltaValido) return
    const ok = await onAjustar(producto, delta)
    if (ok) setCantidad('')
  }

  return (
    <tr className={critico ? 'table-danger' : ''}>
      <td className="fw-bold ps-3">{producto.codigo}</td>
      <td>
        <Link to={`/producto/${producto.codigo}`} className="text-decoration-none fw-semibold text-dark">
          {producto.nombre}
        </Link>
        {(producto.marca || producto.modelo) && (
          <small className="d-block text-muted">
            {[producto.marca, producto.modelo].filter(Boolean).join(' · ')}
          </small>
        )}
      </td>
      <td>
        <span className="badge bg-light text-dark border">{producto.categoria}</span>
      </td>
      <td>
        <BadgeStock stock={stock} />
      </td>
      <td className="fw-bold fs-6" style={{ color: critico ? '#dc3545' : 'var(--color-primario)' }}>
        {stock}
      </td>
      <td className="pe-3">
        <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
          <div className="btn-group btn-group-sm border rounded bg-white shadow-sm">
            <button
              type="button"
              className="btn btn-light px-3 py-1 border-end text-danger fw-bold"
              onClick={() => onAjustar(producto, -1)}
              disabled={procesando || stock === 0}
              aria-label={`Restar 1 unidad a ${producto.nombre}`}
            >
              -1
            </button>
            <button
              type="button"
              className="btn btn-light px-3 py-1 text-success fw-bold"
              onClick={() => onAjustar(producto, 1)}
              disabled={procesando}
              aria-label={`Sumar 1 unidad a ${producto.nombre}`}
            >
              +1
            </button>
          </div>
          <form className="input-group input-group-sm" style={{ width: '150px' }} onSubmit={aplicarPersonalizado}>
            <input
              type="number"
              step="1"
              className="form-control"
              placeholder="±"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              disabled={procesando}
              aria-label={`Cantidad a ajustar para ${producto.nombre}`}
              title="Cantidad positiva para ingresar, negativa para retirar"
            />
            <button type="submit" className="btn btn-sv-primary" disabled={procesando || !deltaValido}>
              Aplicar
            </button>
          </form>
          {procesando && (
            <span className="spinner-border spinner-border-sm text-secondary" role="status">
              <span className="visually-hidden">Actualizando stock...</span>
            </span>
          )}
        </div>
      </td>
    </tr>
  )
}

function TablaBodegaApi({ productos = [], totalCriticos = 0, procesandoId = null, onAjustar }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white" style={{ border: '1px solid rgba(75, 46, 43, 0.15)' }}>
      <div className="p-3 header-sonido-vivo text-white d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 className="mb-0 fw-bold fs-6">
          <i className="bi bi-boxes me-2"></i>Inventario en Bodega ({productos.length})
        </h5>
        <span className={`badge ${totalCriticos > 0 ? 'bg-danger' : 'bg-success'} text-white rounded-pill px-3 py-1 shadow-sm`}>
          <i className={`bi ${totalCriticos > 0 ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} me-1`}></i>
          Productos con stock crítico (≤ 3): {totalCriticos}
        </span>
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-box-seam fs-1 d-block mb-2 text-secondary"></i>
          No hay productos para mostrar.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light border-bottom">
              <tr>
                <th className="ps-3">Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Unidades</th>
                <th className="text-center pe-3">Ajustar stock</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <FilaBodega
                  key={prod.id ?? prod.codigo}
                  producto={prod}
                  procesando={procesandoId === prod.id}
                  onAjustar={onAjustar}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TablaBodegaApi
