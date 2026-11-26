import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerMisPedidos } from '../services/pedidoService'

// Etapas que ve el cliente (las etiquetas vienen de adaptarPedido en pedidoService)
const ETAPAS = ['Pendiente', 'En preparación', 'Despachado', 'Entregado']

const ESTILO_ESTADO = {
  Pendiente: 'bg-warning text-dark',
  'En preparación': 'bg-info text-dark',
  Despachado: 'bg-primary',
  Entregado: 'bg-success',
  Cancelado: 'bg-danger'
}

const formatearPrecio = (valor) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(valor || 0)

function SeguimientoPedido({ estado }) {
  if (estado === 'Cancelado') {
    return (
      <p className="small text-danger mb-0">
        <i className="bi bi-x-circle me-1"></i>Pedido cancelado. El stock fue devuelto a la tienda.
      </p>
    )
  }
  const actual = ETAPAS.indexOf(estado)
  return (
    <ol className="list-unstyled d-flex flex-wrap gap-2 mb-0" aria-label="Seguimiento del pedido">
      {ETAPAS.map((etapa, i) => (
        <li
          key={etapa}
          className={`small px-2 py-1 rounded-pill border ${i <= actual ? 'bg-success-subtle border-success text-success fw-semibold' : 'text-muted'}`}
          aria-current={i === actual ? 'step' : undefined}
        >
          {i <= actual ? <i className="bi bi-check-circle-fill me-1"></i> : <i className="bi bi-circle me-1"></i>}
          {etapa}
        </li>
      ))}
    </ol>
  )
}

/**
 * Historial de compras del cliente autenticado (GET /api/v1/pedidos/mis-pedidos).
 * El backend toma el correo desde el token JWT, por lo que un cliente nunca ve pedidos de otros.
 */
function MisPedidos({ cargarPedidos = obtenerMisPedidos }) {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // setState solo dentro de los callbacks de la promesa (no de forma síncrona en el efecto)
  const pedir = useCallback(
    () =>
      cargarPedidos()
        .then((lista) => {
          setPedidos(lista)
          setError('')
        })
        .catch((err) => setError(err.message || 'No se pudieron cargar tus pedidos.'))
        .finally(() => setCargando(false)),
    [cargarPedidos]
  )

  useEffect(() => {
    pedir()
  }, [pedir])

  const cargar = () => {
    setCargando(true)
    setError('')
    pedir()
  }

  return (
    <section className="container py-4 py-lg-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: '#351b16' }}>
            <i className="bi bi-bag-check me-2"></i>Mis Pedidos
          </h1>
          <p className="text-muted mb-0">Revisa el estado y el detalle de tus compras en Sonido Vivo.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cargar} disabled={cargando}>
          <i className="bi bi-arrow-clockwise me-1"></i>Actualizar
        </button>
      </div>

      {cargando && (
        <div className="text-center py-5 text-muted" role="status">
          <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Cargando tus pedidos…
        </div>
      )}

      {!cargando && error && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{error}</span>
        </div>
      )}

      {!cargando && !error && pedidos.length === 0 && (
        <div className="text-center py-5 border rounded-3 bg-light" data-testid="mis-pedidos-vacio">
          <i className="bi bi-bag display-5 text-secondary"></i>
          <h2 className="h5 fw-bold mt-3">Aún no tienes pedidos</h2>
          <p className="text-muted">Cuando compres un instrumento, aquí podrás seguir su estado.</p>
          <button type="button" className="btn btn-sv-primary" onClick={() => navigate('/catalogo')}>
            <i className="bi bi-grid-3x3-gap me-2"></i>Ir al catálogo
          </button>
        </div>
      )}

      {!cargando && !error && pedidos.length > 0 && (
        <div className="d-flex flex-column gap-3">
          <p className="small text-muted mb-0">
            {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} · el más reciente primero
          </p>
          {pedidos.map((pedido) => (
            <article key={pedido.id} className="card border-0 shadow-sm" data-testid="tarjeta-pedido">
              <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <span className="fw-bold">Pedido {pedido.codigoPedido || `#${pedido.id}`}</span>
                  <span className="text-muted small ms-2">{pedido.fecha}</span>
                </div>
                <span className={`badge rounded-pill ${ESTILO_ESTADO[pedido.estado] || 'bg-secondary'}`}>
                  {pedido.estado}
                </span>
              </div>
              <div className="card-body">
                <SeguimientoPedido estado={pedido.estado} />
                <div className="table-responsive mt-3">
                  <table className="table table-sm align-middle mb-2">
                    <thead>
                      <tr className="small text-muted">
                        <th scope="col">Producto</th>
                        <th scope="col" className="text-center">Cant.</th>
                        <th scope="col" className="text-end">Precio unitario</th>
                        <th scope="col" className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.productos.map((item) => (
                        <tr key={`${pedido.id}-${item.productoId}`}>
                          <td>{item.nombre}</td>
                          <td className="text-center">{item.cantidad}</td>
                          <td className="text-end">{formatearPrecio(item.precio)}</td>
                          <td className="text-end">{formatearPrecio(item.precio * item.cantidad)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex flex-wrap justify-content-between gap-2 small">
                  <span className="text-muted">
                    <i className="bi bi-geo-alt me-1"></i>{pedido.direccion}
                  </span>
                  <span className="fw-bold fs-6">Total: {formatearPrecio(pedido.total)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MisPedidos
