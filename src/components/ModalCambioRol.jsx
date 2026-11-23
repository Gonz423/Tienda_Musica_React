import { useState } from 'react'
import Modal from './Modal'
import AlertaErrorHttp from './AlertaErrorHttp'
import { ROLES_BACKEND, ETIQUETAS_ROL } from '../utils/roles'

const DESCRIPCION_ROL = {
  ADMIN: 'Acceso total: usuarios, productos y métricas.',
  VENDEDOR: 'Recepción de pedidos y control de stock en bodega.',
  CLIENTE: 'Catálogo y compras en línea.'
}

// Montar con key={usuario.id} para reiniciar la selección por usuario
function ModalCambioRol({ usuario, procesando = false, error = null, onConfirmar, onCerrar }) {
  const rolActual = (usuario?.rol || '').toUpperCase()
  const [rolSeleccionado, setRolSeleccionado] = useState(rolActual)

  if (!usuario) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rolSeleccionado && rolSeleccionado !== rolActual && onConfirmar) {
      onConfirmar(rolSeleccionado)
    }
  }

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo={`Cambiar rol: ${usuario.nombre}`}
      icono="bi-person-gear"
      subtitulo={`${usuario.correo} · Rol actual: ${ETIQUETAS_ROL[rolActual] || rolActual}`}
      maxWidth="520px"
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCerrar} disabled={procesando}>
            Cancelar
          </button>
          <button
            type="submit"
            form="form-cambio-rol"
            className="btn btn-sv-primary btn-sm"
            disabled={procesando || rolSeleccionado === rolActual}
          >
            {procesando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              <>
                <i className="bi bi-check2-circle me-1"></i>Confirmar cambio
              </>
            )}
          </button>
        </>
      }
    >
      <form id="form-cambio-rol" className="modal-body px-4 py-3 d-flex flex-column gap-2" onSubmit={handleSubmit}>
        {error && <AlertaErrorHttp error={error} />}
        {ROLES_BACKEND.map((rol) => (
          <label
            key={rol}
            className={`d-flex gap-3 align-items-start p-3 rounded-3 border ${rolSeleccionado === rol ? 'border-primary bg-light' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            <input
              type="radio"
              className="form-check-input mt-1"
              name="rol"
              value={rol}
              checked={rolSeleccionado === rol}
              onChange={() => setRolSeleccionado(rol)}
              disabled={procesando}
            />
            <div>
              <div className="fw-semibold">
                {ETIQUETAS_ROL[rol]}
                {rol === rolActual && <span className="badge bg-light text-dark border ms-2">Actual</span>}
              </div>
              <small className="text-muted">{DESCRIPCION_ROL[rol]}</small>
            </div>
          </label>
        ))}
      </form>
    </Modal>
  )
}

export default ModalCambioRol
