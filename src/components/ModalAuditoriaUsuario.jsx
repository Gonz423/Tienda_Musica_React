import { useEffect, useState } from 'react'
import Modal from './Modal'
import EstadoCarga from './EstadoCarga'
import AlertaErrorHttp from './AlertaErrorHttp'
import { obtenerHistorialUsuario, registrarNotaAuditoria } from '../services/usuarioService'

const ESTILO_ACCION = {
  CAMBIO_ROL: { icono: 'bi-person-gear', fondo: '#f3e8ff', color: '#7c3aed', etiqueta: 'Cambio de rol' },
  CAMBIO_ESTADO: { icono: 'bi-toggle-on', fondo: '#fef3c7', color: '#b45309', etiqueta: 'Cambio de estado' },
  ACTUALIZACION_DATOS: { icono: 'bi-pencil-square', fondo: '#dbeafe', color: '#1d4ed8', etiqueta: 'Actualización de datos' },
  NOTA_AUDITORIA: { icono: 'bi-journal-text', fondo: '#dcfce7', color: '#16a34a', etiqueta: 'Nota de auditoría' }
}

function formatearFecha(valor) {
  if (!valor) return ''
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return String(valor)
  return fecha.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })
}

// Montar con key={usuario.id} para cargar el historial de cada usuario desde cero
function ModalAuditoriaUsuario({ usuario, onCerrar }) {
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [recarga, setRecarga] = useState(0)
  const [nota, setNota] = useState('')
  const [guardandoNota, setGuardandoNota] = useState(false)
  const [errorNota, setErrorNota] = useState(null)

  const usuarioId = usuario?.id

  useEffect(() => {
    if (usuarioId == null) return undefined
    let activo = true
    obtenerHistorialUsuario(usuarioId)
      .then((data) => {
        if (!activo) return
        setEventos(Array.isArray(data) ? data : [])
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
  }, [usuarioId, recarga])

  if (!usuario) return null

  const reintentar = () => {
    setCargando(true)
    setError(null)
    setRecarga((r) => r + 1)
  }

  const handleAgregarNota = async (e) => {
    e.preventDefault()
    const texto = nota.trim()
    if (!texto) return
    setGuardandoNota(true)
    setErrorNota(null)
    try {
      const evento = await registrarNotaAuditoria(usuario.id, texto)
      setEventos((prev) => [evento, ...prev])
      setNota('')
    } catch (err) {
      setErrorNota(err)
    } finally {
      setGuardandoNota(false)
    }
  }

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo={`Historial de auditoría: ${usuario.nombre}`}
      icono="bi-clock-history"
      subtitulo={`${usuario.correo} · Rol: ${(usuario.rol || '').toUpperCase()}`}
      maxWidth="680px"
      footer={
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCerrar}>
          Cerrar
        </button>
      }
    >
      <div className="modal-body px-4 py-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {cargando ? (
          <EstadoCarga mensaje="Cargando historial de auditoría..." />
        ) : error ? (
          <AlertaErrorHttp error={error} onReintentar={reintentar} />
        ) : eventos.length === 0 ? (
          <p className="text-muted small mb-4">No hay eventos de auditoría registrados para este usuario.</p>
        ) : (
          <div className="d-flex flex-column gap-2 mb-4">
            <h6 className="fw-bold text-secondary mb-1">
              <i className="bi bi-journal-text me-1"></i>Eventos registrados ({eventos.length})
            </h6>
            {eventos.map((ev, idx) => {
              const estilo = ESTILO_ACCION[ev.accion] || {
                icono: 'bi-info-circle',
                fondo: '#f1f5f9',
                color: '#475569',
                etiqueta: ev.accion
              }
              return (
                <div key={ev.id ?? idx} className="p-3 bg-light rounded-3 border d-flex gap-3 align-items-start">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 mt-1"
                    style={{ width: '32px', height: '32px', backgroundColor: estilo.fondo, color: estilo.color }}
                  >
                    <i className={`bi ${estilo.icono}`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-1">
                      <span className="fw-bold text-dark small">{estilo.etiqueta}</span>
                      <small className="text-muted">{formatearFecha(ev.fechaHora)}</small>
                    </div>
                    <p className="mb-0 text-secondary small mt-1">{ev.detalle}</p>
                    {ev.realizadoPor && (
                      <small className="text-muted">
                        <i className="bi bi-person-badge me-1"></i>Realizado por: {ev.realizadoPor}
                      </small>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="border-top pt-3">
          <h6 className="fw-bold mb-2 text-secondary small">
            <i className="bi bi-chat-left-dots me-1"></i>Registrar nota de auditoría:
          </h6>
          {errorNota && (
            <div className="mb-2">
              <AlertaErrorHttp error={errorNota} onCerrar={() => setErrorNota(null)} />
            </div>
          )}
          <form onSubmit={handleAgregarNota} className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Ej: Se validó identidad del empleado..."
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              disabled={guardandoNota}
              aria-label="Nota de auditoría"
            />
            <button
              type="submit"
              className="btn btn-sv-primary btn-sm flex-shrink-0"
              disabled={!nota.trim() || guardandoNota}
            >
              {guardandoNota ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-1"></i>Añadir nota
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default ModalAuditoriaUsuario
