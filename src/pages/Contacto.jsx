import { useState } from 'react'
import { Link } from 'react-router-dom'
import banerImg from '../assets/img/baner.png'
import banerCelular2Img from '../assets/img/banercelular2.png'

const TEMAS_CONTACTO = [
  { id: 'asesoria', titulo: 'Asesoría para compra de instrumentos', icono: 'bi-music-note-beamed' },
  { id: 'lutheria', titulo: 'Calibración, luthería y servicio técnico', icono: 'bi-tools' },
  { id: 'pedidos', titulo: 'Estado de envíos y compras web', icono: 'bi-box-seam' },
  { id: 'convenios', titulo: 'Convenios para escuelas, colegios y bandas', icono: 'bi-mortarboard' },
  { id: 'garantia', titulo: 'Garantías, cambios o devoluciones', icono: 'bi-shield-check' },
  { id: 'otro', titulo: 'Otra consulta general', icono: 'bi-chat-dots' }
]

function Contacto() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tema: 'asesoria',
    instrumento: 'Guitarras',
    mensaje: ''
  })
  const [errores, setErrores] = useState({})
  const [ticketEnviado, setTicketEnviado] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const validarFormulario = () => {
    const err = {}
    if (!formulario.nombre.trim()) {
      err.nombre = 'Ingresa tu nombre completo'
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formulario.email.trim()) {
      err.email = 'Ingresa tu correo electrónico'
    } else if (!regexEmail.test(formulario.email.trim())) {
      err.email = 'Ingresa un correo electrónico con formato válido (ej: nombre@correo.com)'
    }

    // Teléfono obligatorio
    const regexTelefono = /^[0-9+() -]{8,}$/
    if (!formulario.telefono.trim()) {
      err.telefono = 'Ingresa tu número de teléfono de contacto'
    } else if (!regexTelefono.test(formulario.telefono.trim())) {
      err.telefono = 'Ingresa un número de teléfono válido (mínimo 8 dígitos)'
    }

    if (!formulario.mensaje.trim() || formulario.mensaje.trim().length < 10) {
      err.mensaje = 'El mensaje debe tener al menos 10 caracteres'
    }
    setErrores(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validarFormulario()) return

    setEnviando(true)
    setTimeout(() => {
      const ticketId = Math.floor(1000 + Math.random() * 9000)
      const temaSeleccionado = TEMAS_CONTACTO.find((t) => t.id === formulario.tema)

      setTicketEnviado({
        id: ticketId,
        nombre: formulario.nombre,
        email: formulario.email,
        telefono: formulario.telefono,
        tema: temaSeleccionado?.titulo || formulario.tema,
        instrumento: formulario.instrumento,
        mensaje: formulario.mensaje,
        fecha: new Date().toLocaleDateString('es-CL')
      })
      setEnviando(false)
    }, 600)
  }

  const reiniciarFormulario = () => {
    setTicketEnviado(null)
    setFormulario({
      nombre: '',
      email: '',
      telefono: '',
      tema: 'asesoria',
      instrumento: 'Guitarras',
      mensaje: ''
    })
    setErrores({})
  }

  return (
    <div
      className="pagina-contacto-wrapper py-4 py-md-5"
      style={{
        '--contacto-bg': `url(${banerCelular2Img})`,
        '--contacto-bg-mobile': `url(${banerCelular2Img})`,
        backgroundImage: `linear-gradient(rgba(35, 18, 14, 0.68), rgba(25, 12, 10, 0.78)), url(${banerCelular2Img})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container">
        {/* Encabezado */}
        <div className="text-center mb-4 mb-md-5 text-white">
          <span className="badge bg-light text-dark text-uppercase px-3 py-2 rounded-pill mb-3 shadow-sm fw-semibold">
            <i className="bi bi-headset me-1 text-danger"></i> Centro de Contacto y Atención
          </span>
          <h1 className="display-5 fw-bold mb-2 text-white" style={{ textShadow: '0 2px 14px rgba(0, 0, 0, 0.85)' }}>
            Contáctanos
          </h1>
          <p className="lead mx-auto col-lg-8 mb-0 text-white-50" style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.85)' }}>
            ¿Tienes dudas sobre un instrumento, necesitas calibración o requieres asesoría para tu banda?
            Selecciona el tema de tu consulta y te responderemos a la brevedad.
          </p>
        </div>

        {ticketEnviado ? (
          /* Confirmación de Envío */
          <div
            className="card card-contacto-glass border-0 p-4 p-md-5 text-center mx-auto"
            style={{ maxWidth: '640px', borderRadius: '20px' }}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-sm bg-success text-white mx-auto"
              style={{ width: '70px', height: '70px' }}
            >
              <i className="bi bi-check-lg fs-1"></i>
            </div>

            <h3 className="fw-bold text-success mb-1">¡Mensaje Enviado con Éxito!</h3>
            <p className="text-muted small mb-4">
              Hemos recibido tu solicitud bajo el ticket <strong>#TK-{ticketEnviado.id}</strong>. Un especialista de Sonido Vivo se pondrá en contacto contigo dentro de las próximas 24 horas hábiles.
            </p>

            <div className="card text-start bg-light border-0 p-3 mb-4 rounded-3 small">
              <div className="d-flex justify-content-between mb-2 pb-1 border-bottom">
                <span className="text-muted">Nombre:</span>
                <span className="fw-bold">{ticketEnviado.nombre}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 pb-1 border-bottom">
                <span className="text-muted">Correo:</span>
                <span className="fw-bold">{ticketEnviado.email}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 pb-1 border-bottom">
                <span className="text-muted">Teléfono:</span>
                <span className="fw-bold">{ticketEnviado.telefono}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 pb-1 border-bottom">
                <span className="text-muted">Tema Seleccionado:</span>
                <span className="fw-bold text-primary">{ticketEnviado.tema}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Fecha:</span>
                <span className="fw-bold">{ticketEnviado.fecha}</span>
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-center flex-wrap">
              <button type="button" className="btn btn-outline-secondary px-4 py-2" onClick={reiniciarFormulario}>
                <i className="bi bi-arrow-repeat me-2"></i>Enviar otra consulta
              </button>
              <Link to="/catalogo" className="btn btn-sv-primary px-4 py-2 fw-semibold">
                <i className="bi bi-grid-3x3-gap me-2"></i>Explorar Catálogo
              </Link>
            </div>
          </div>
        ) : (
          /* Formulario de Contacto centrado */
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="card-contacto-glass p-4 p-md-5 rounded-4 shadow-lg">
                <h4 className="fw-bold mb-1" style={{ color: 'var(--color-texto)' }}>
                  Envíanos tu Consulta
                </h4>
                <p className="text-muted small mb-4">
                  Elige el tema que mejor se adapte a tu necesidad para dirigir tu mensaje al área correspondiente.
                </p>

              <form onSubmit={handleSubmit} noValidate>
                {/* Selector de Temas */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary mb-2">
                    <i className="bi bi-tag me-1"></i>Tema o Motivo de Contacto *
                  </label>
                  <div className="row g-2">
                    {TEMAS_CONTACTO.map((tema) => {
                      const activo = formulario.tema === tema.id
                      return (
                        <div key={tema.id} className="col-12 col-sm-6">
                          <button
                            type="button"
                            onClick={() => setFormulario({ ...formulario, tema: tema.id })}
                            className={`btn text-start p-2 w-100 border rounded-3 d-flex align-items-center gap-2 small transition-all ${
                              activo ? 'bg-light border-warning text-dark fw-bold shadow-sm' : 'bg-white text-muted'
                            }`}
                            style={{
                              borderColor: activo ? 'var(--color-acento)' : '#dee2e6',
                              minHeight: '44px'
                            }}
                          >
                            <i className={`bi ${tema.icono} ${activo ? 'text-warning' : 'text-muted'} fs-5 flex-shrink-0`}></i>
                            <span className="text-truncate">{tema.titulo}</span>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="row g-3">
                  {/* Nombre */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="contacto-nombre" className="form-label small fw-bold text-secondary mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      id="contacto-nombre"
                      type="text"
                      className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                      placeholder="Ej: Gonzalo Valdés"
                      value={formulario.nombre}
                      onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                    />
                    {errores.nombre && <div className="invalid-feedback small">{errores.nombre}</div>}
                  </div>

                  {/* Correo */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="contacto-email" className="form-label small fw-bold text-secondary mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      id="contacto-email"
                      type="email"
                      className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                      placeholder="ejemplo@correo.cl"
                      value={formulario.email}
                      onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
                    />
                    {errores.email && <div className="invalid-feedback small">{errores.email}</div>}
                  </div>

                  {/* Teléfono */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="contacto-telefono" className="form-label small fw-bold text-secondary mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      id="contacto-telefono"
                      type="tel"
                      className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                      placeholder="+56 9 8452 1198"
                      value={formulario.telefono}
                      onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
                    />
                    {errores.telefono && <div className="invalid-feedback small">{errores.telefono}</div>}
                  </div>

                  {/* Familia de Instrumento */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="contacto-instrumento" className="form-label small fw-bold text-secondary mb-1">
                      Área o Instrumento de Interés
                    </label>
                    <select
                      id="contacto-instrumento"
                      className="form-select"
                      value={formulario.instrumento}
                      onChange={(e) => setFormulario({ ...formulario, instrumento: e.target.value })}
                    >
                      <option value="Guitarras">Guitarras y Bajos</option>
                      <option value="Baterias">Baterías y Percusión</option>
                      <option value="Audio">Audio Profesional y Grabación</option>
                      <option value="Teclados">Teclados y Pianos</option>
                      <option value="Accesorios">Accesorios y Repuestos</option>
                      <option value="General">Consulta General</option>
                    </select>
                  </div>

                  {/* Mensaje */}
                  <div className="col-12">
                    <label htmlFor="contacto-mensaje" className="form-label small fw-bold text-secondary mb-1">
                      Mensaje o Detalle de la Solicitud *
                    </label>
                    <textarea
                      id="contacto-mensaje"
                      rows="4"
                      className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`}
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      value={formulario.mensaje}
                      onChange={(e) => setFormulario({ ...formulario, mensaje: e.target.value })}
                    ></textarea>
                    {errores.mensaje && <div className="invalid-feedback small">{errores.mensaje}</div>}
                  </div>
                </div>

                {/* Botón de Envío */}
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={enviando}
                    className="btn btn-sv-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  >
                    {enviando ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Enviando mensaje...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill"></i>
                        <span>Enviar Consulta</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Contacto
