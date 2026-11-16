function EncabezadoContacto() {
  return (
    <div className="text-center mb-4 mb-md-5 text-white">
      <span className="badge bg-light text-dark text-uppercase px-3 py-2 rounded-pill mb-3 shadow-sm fw-semibold">
        <i className="bi bi-headset me-1 text-danger"></i> Centro de Contacto y Atención
      </span>
      <h1
        className="display-5 fw-bold mb-2 text-white"
        style={{ textShadow: '0 2px 14px rgba(0, 0, 0, 0.85)' }}
      >
        Contáctanos
      </h1>
      <p
        className="lead mx-auto col-lg-8 mb-0 text-white-50"
        style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.85)' }}
      >
        ¿Tienes dudas sobre un instrumento, necesitas calibración o requieres asesoría para tu banda?
        Selecciona el tema de tu consulta y te responderemos a la brevedad.
      </p>
    </div>
  )
}

export default EncabezadoContacto
