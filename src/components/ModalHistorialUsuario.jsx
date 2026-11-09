import Modal from './Modal'

function ModalHistorialUsuario({
  usuario,
  onCerrar,
  notaHistorial,
  setNotaHistorial,
  onAgregarNota
}) {
  return (
    <Modal
      abierto={Boolean(usuario)}
      onCerrar={onCerrar}
      titulo={`Historial de Auditoría: ${usuario?.nombre || ''}`}
      icono="bi-clock-history"
      subtitulo={`${usuario?.email || ''} · Rol: ${(
        usuario?.rol || ''
      ).toUpperCase()}`}
      maxWidth="650px"
      footer={
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onCerrar}
        >
          Cerrar
        </button>
      }
    >
      <div
        className="modal-body px-4 py-3"
        style={{ maxHeight: '60vh', overflowY: 'auto' }}
      >
        <h6 className="fw-bold mb-3 text-secondary">
          <i className="bi bi-journal-text me-1"></i> Registro de Eventos (
          {usuario?.historial?.length || 0})
        </h6>
        {!usuario?.historial?.length ? (
          <p className="text-muted small">
            No hay eventos registrados para este usuario.
          </p>
        ) : (
          <div className="d-flex flex-column gap-2 mb-4">
            {usuario.historial.map((ev, idx) => {
              const esDesactiv = ev.accion?.includes('Desactiv')
              const esPositivo =
                ev.accion?.includes('Activ') || ev.accion?.includes('Creac')
              return (
                <div
                  key={ev.id || idx}
                  className="p-3 bg-light rounded-3 border d-flex gap-3 align-items-start"
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 mt-1"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: esDesactiv
                        ? '#fee2e2'
                        : esPositivo
                        ? '#dcfce7'
                        : '#f3e8ff',
                      color: esDesactiv
                        ? '#dc2626'
                        : esPositivo
                        ? '#16a34a'
                        : '#7c3aed'
                    }}
                  >
                    <i
                      className={`bi ${
                        esDesactiv
                          ? 'bi-slash-circle'
                          : esPositivo
                          ? 'bi-check-circle'
                          : ev.accion?.includes('Compra')
                          ? 'bi-bag-check'
                          : 'bi-pencil-square'
                      }`}
                    ></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-dark small">{ev.accion}</span>
                      <small className="text-muted">{ev.fecha}</small>
                    </div>
                    <p className="mb-0 text-secondary small mt-1">{ev.detalle}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div className="border-top pt-3">
          <h6 className="fw-bold mb-2 text-secondary small">
            <i className="bi bi-chat-left-dots me-1"></i> Agregar nota
            administrativa a este usuario:
          </h6>
          <form onSubmit={onAgregarNota} className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Ej: Se validó identidad telefónicamente..."
              value={notaHistorial}
              onChange={(e) => setNotaHistorial(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-sv-primary btn-sm flex-shrink-0"
              disabled={!notaHistorial.trim()}
            >
              <i className="bi bi-plus-circle me-1"></i> Añadir Nota
            </button>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default ModalHistorialUsuario
