import { useEffect, useState } from 'react'
import EstadoCarga from './EstadoCarga'
import AlertaErrorHttp from './AlertaErrorHttp'
import TablaBodegaApi from './TablaBodegaApi'
import { listarProductosBodega, ajustarStockProducto } from '../services/stockService'
import { esStockCritico } from '../utils/roles'

// Control de stock en bodega conectado a producto-service (puerto 8083)
function ControlStockBodega({ onActualizarStock }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [recarga, setRecarga] = useState(0)

  const [busqueda, setBusqueda] = useState('')
  const [soloCriticos, setSoloCriticos] = useState(false)

  const [procesandoId, setProcesandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [errorAccion, setErrorAccion] = useState(null)

  useEffect(() => {
    let activo = true
    listarProductosBodega()
      .then((data) => {
        if (!activo) return
        setProductos(Array.isArray(data) ? data : [])
        setError(null)
      })
      .catch((err) => {
        if (activo) setError(err)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [recarga])

  const recargar = () => {
    setCargando(true)
    setError(null)
    setRecarga((r) => r + 1)
  }

  // Devuelve true si el ajuste se aplicó correctamente
  const handleAjustar = async (producto, delta) => {
    if (producto.id == null) {
      setErrorAccion('El producto no tiene un ID válido en el backend.')
      return false
    }
    setProcesandoId(producto.id)
    setErrorAccion(null)
    setMensaje('')
    try {
      const actualizado = await ajustarStockProducto(producto.id, delta, 'Ajuste manual desde Panel Empleado')
      const nuevoStock = Number(actualizado?.stock ?? Number(producto.stock ?? 0) + delta)
      setProductos((prev) =>
        prev.map((p) => (p.id === producto.id ? { ...p, ...(actualizado || {}), stock: nuevoStock } : p))
      )
      if (onActualizarStock) onActualizarStock(producto.codigo, nuevoStock)
      setMensaje(
        `Stock de "${producto.nombre}" ${delta > 0 ? 'aumentado' : 'reducido'} en ${Math.abs(delta)} unidad(es). Stock actual: ${nuevoStock}.`
      )
      return true
    } catch (err) {
      setErrorAccion(err)
      return false
    } finally {
      setProcesandoId(null)
    }
  }

  const termino = busqueda.trim().toLowerCase()
  const totalCriticos = productos.filter(esStockCritico).length
  const productosFiltrados = productos.filter((p) => {
    const coincideTexto =
      !termino ||
      p.nombre?.toLowerCase().includes(termino) ||
      p.codigo?.toLowerCase().includes(termino) ||
      p.marca?.toLowerCase().includes(termino)
    return coincideTexto && (!soloCriticos || esStockCritico(p))
  })

  return (
    <div className="d-flex flex-column gap-3">
      {mensaje && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 shadow-sm border-0 mb-0" role="status">
          <i className="bi bi-check-circle-fill flex-shrink-0"></i>
          <div className="flex-grow-1">{mensaje}</div>
          <button type="button" className="btn-close" aria-label="Cerrar mensaje" onClick={() => setMensaje('')} />
        </div>
      )}

      {errorAccion && <AlertaErrorHttp error={errorAccion} onCerrar={() => setErrorAccion(null)} />}

      {cargando ? (
        <div className="bg-white rounded-4 shadow-sm border">
          <EstadoCarga mensaje="Cargando inventario de bodega..." />
        </div>
      ) : error ? (
        <AlertaErrorHttp error={error} onReintentar={recargar} />
      ) : (
        <>
          {totalCriticos > 0 && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 shadow-sm border-0 mb-0" role="alert">
              <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
              <div>
                Hay <strong>{totalCriticos}</strong> producto(s) con stock crítico (3 unidades o menos). Considera reponerlos.
              </div>
            </div>
          )}

          <div className="p-3 bg-white rounded-3 shadow-sm border d-flex flex-wrap gap-3 align-items-center">
            <div className="input-group input-group-sm flex-grow-1" style={{ maxWidth: '420px' }}>
              <span className="input-group-text bg-light text-muted border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar por nombre, código o marca..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="form-check form-switch mb-0">
              <input
                id="switch-solo-criticos"
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={soloCriticos}
                onChange={(e) => setSoloCriticos(e.target.checked)}
              />
              <label className="form-check-label small" htmlFor="switch-solo-criticos">
                Solo stock crítico
              </label>
            </div>
            <button type="button" className="btn btn-outline-secondary btn-sm ms-md-auto" onClick={recargar}>
              <i className="bi bi-arrow-clockwise me-1"></i>Actualizar
            </button>
          </div>

          <TablaBodegaApi
            productos={productosFiltrados}
            totalCriticos={totalCriticos}
            procesandoId={procesandoId}
            onAjustar={handleAjustar}
          />
        </>
      )}
    </div>
  )
}

export default ControlStockBodega
