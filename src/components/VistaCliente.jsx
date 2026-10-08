function VistaCliente() {
  return (
    <div className="vista-cliente">
      {/* Encabezado Superior del Catalogo */}
      <section className="hero-sonido-vivo py-5 shadow-sm text-center" id="inicio">
        <div className="container py-4">
          <div className="badge bg-light text-dark px-3 py-2 fs-6 mb-3 rounded-pill fw-semibold shadow-sm">
            Tienda Sonido Vivo - Vina del Mar
          </div>
          <h1 className="display-5 fw-bold mb-2 text-white">
            Catalogo de Instrumentos y Audio Profesional
          </h1>
          <p className="lead mx-auto col-lg-8 mb-0 text-white-50">
            Explora nuestra seleccion completa de equipamiento musical de primeras marcas con stock verificado en tiempo real.
          </p>
        </div>
      </section>
    </div>
  )
}

export default VistaCliente
