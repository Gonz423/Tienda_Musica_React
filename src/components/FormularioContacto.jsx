export const TEMAS_CONTACTO = [
  { id: 'asesoria', titulo: 'Asesoría para compra de instrumentos', icono: 'bi-music-note-beamed' },
  { id: 'lutheria', titulo: 'Calibración, luthería y servicio técnico', icono: 'bi-tools' },
  { id: 'pedidos', titulo: 'Estado de envíos y compras web', icono: 'bi-box-seam' },
  { id: 'convenios', titulo: 'Convenios para escuelas, colegios y bandas', icono: 'bi-mortarboard' },
  { id: 'garantia', titulo: 'Garantías, cambios o devoluciones', icono: 'bi-shield-check' },
  { id: 'otro', titulo: 'Otra consulta general', icono: 'bi-chat-dots' }
]

function FormularioContacto({
  formulario,
  setFormulario,
  errores,
  enviando,
  onSubmit
}) {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8">
        <div className="card-contacto-glass p-4 p-md-5 rounded-4 shadow-lg">
          <h4 className="fw-bold mb-1" style={{ color: 'var(--color-texto)' }}>
            Envíanos tu Consulta
          </h4>
          <p className="text-muted small mb-4">
            Elige el tema que mejor se adapte a tu necesidad para dirigir tu mensaje al área correspondiente.
          </p>

          <form onSubmit={onSubmit} noValidate>
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
                          activo
                            ? 'bg-light border-warning text-dark fw-bold shadow-sm'
                            : 'bg-white text-muted'
                        }`}
                        style={{
                          borderColor: activo ? 'var(--color-acento)' : '#dee2e6',
                          minHeight: '44px'
                        }}
                      >
                        <i
                          className={`bi ${tema.icono} ${
                            activo ? 'text-warning' : 'text-muted'
                          } fs-5 flex-shrink-0`}
                        ></i>
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
                <label
                  htmlFor="contacto-nombre"
                  className="form-label small fw-bold text-secondary mb-1"
                >
                  Nombre Completo *
                </label>
                <input
                  id="contacto-nombre"
                  type="text"
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  placeholder="Ej: Gonzalo Valdés"
                  value={formulario.nombre}
                  onChange={(e) =>
                    setFormulario({ ...formulario, nombre: e.target.value })
                  }
                />
                {errores.nombre && (
                  <div className="invalid-feedback small">{errores.nombre}</div>
                )}
              </div>

              {/* Correo */}
              <div className="col-12 col-md-6">
                <label
                  htmlFor="contacto-email"
                  className="form-label small fw-bold text-secondary mb-1"
                >
                  Correo Electrónico *
                </label>
                <input
                  id="contacto-email"
                  type="email"
                  className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                  placeholder="ejemplo@correo.cl"
                  value={formulario.email}
                  onChange={(e) =>
                    setFormulario({ ...formulario, email: e.target.value })
                  }
                />
                {errores.email && (
                  <div className="invalid-feedback small">{errores.email}</div>
                )}
              </div>

              {/* Telefono */}
              <div className="col-12 col-md-6">
                <label
                  htmlFor="contacto-telefono"
                  className="form-label small fw-bold text-secondary mb-1"
                >
                  Teléfono / WhatsApp *
                </label>
                <input
                  id="contacto-telefono"
                  type="tel"
                  className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                  placeholder="+56 9 8452 1198"
                  value={formulario.telefono}
                  onChange={(e) =>
                    setFormulario({ ...formulario, telefono: e.target.value })
                  }
                />
                {errores.telefono && (
                  <div className="invalid-feedback small">{errores.telefono}</div>
                )}
              </div>

              {/* Familia de Instrumento */}
              <div className="col-12 col-md-6">
                <label
                  htmlFor="contacto-instrumento"
                  className="form-label small fw-bold text-secondary mb-1"
                >
                  Área o Instrumento de Interés
                </label>
                <select
                  id="contacto-instrumento"
                  className="form-select"
                  value={formulario.instrumento}
                  onChange={(e) =>
                    setFormulario({ ...formulario, instrumento: e.target.value })
                  }
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
                <label
                  htmlFor="contacto-mensaje"
                  className="form-label small fw-bold text-secondary mb-1"
                >
                  Mensaje o Detalle de la Solicitud *
                </label>
                <textarea
                  id="contacto-mensaje"
                  rows="4"
                  className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`}
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  value={formulario.mensaje}
                  onChange={(e) =>
                    setFormulario({ ...formulario, mensaje: e.target.value })
                  }
                ></textarea>
                {errores.mensaje && (
                  <div className="invalid-feedback small">{errores.mensaje}</div>
                )}
              </div>
            </div>

            {/* Boton de Envio */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={enviando}
                className="btn btn-sv-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
              >
                {enviando ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
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
  )
}

export default FormularioContacto
