import { Link } from 'react-router-dom'

function MensajeExitoContacto({ ticket, onReiniciar }) {
  if (!ticket) return null

  return (
    <div
      className="card card-contacto-glass border-0 p-4 p-md-5 text-center mx-auto"
      style={{ maxWidth: '640px', borderRadius: '20px' }}
    >
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 bg-success text-white mx-auto"
        style={{ width: '70px', height: '70px' }}
      >
        <i className="bi bi-check-lg fs-1"></i>
      </div>

      <h3 className="fw-bold text-success mb-1">¡Mensaje Enviado con Éxito!</h3>
      <p className="text-muted small mb-4">
        Hemos recibido tu solicitud bajo el ticket <strong>#TK-{ticket.id}</strong>. Un especialista de Sonido Vivo se pondrá en contacto contigo dentro de las próximas 24 horas hábiles.
      </p>

      <div className="card text-start bg-light border-0 p-3 mb-4 rounded-3 small">
        <div className="d-flex justify-content-between mb-2 pb-1 border-bottom">
          <span className="text-muted">Nombre:</span>
          <span className="fw-bold">{ticket.nombre}</span>
        </div>
        <div className="d-flex justify-content-between mb-2 pb-1 border-bottom">
          <span className="text-muted">Correo:</span>
          <span className="fw-bold">{ticket.email}</span>
        </div>
        <div className="d-flex justify-content-between mb-2 pb-1 border-bottom">
          <span className="text-muted">Teléfono:</span>
          <span className="fw-bold">{ticket.telefono}</span>
        </div>
        <div className="d-flex justify-content-between mb-2 pb-1 border-bottom">
          <span className="text-muted">Tema Seleccionado:</span>
          <span className="fw-bold text-primary">{ticket.tema}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-muted">Fecha:</span>
          <span className="fw-bold">{ticket.fecha}</span>
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-center flex-wrap">
        <button
          type="button"
          className="btn btn-outline-secondary px-4 py-2"
          onClick={onReiniciar}
        >
          <i className="bi bi-arrow-repeat me-2"></i>Enviar otra consulta
        </button>
        <Link to="/catalogo" className="btn btn-sv-primary px-4 py-2 fw-semibold">
          <i className="bi bi-grid-3x3-gap me-2"></i>Explorar Catálogo
        </Link>
      </div>
    </div>
  )
}

export default MensajeExitoContacto
