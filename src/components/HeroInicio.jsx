import { Link } from 'react-router-dom'
import banerImg from '../assets/img/baner.png'
import banerCelularImg from '../assets/img/banercelular.png'

function HeroInicio() {
  return (
    <section
      className="hero-sonido-vivo py-5 shadow-sm text-center"
      id="inicio"
      style={{
        '--hero-banner': `url(${banerImg})`,
        '--hero-banner-mobile': `url(${banerCelularImg})`,
      }}
    >
      <div className="container py-4 py-lg-5">
        <div className="badge bg-light text-dark px-3 py-2 fs-6 mb-3 rounded-pill fw-semibold shadow-sm">
          <i className="bi bi-geo-alt-fill text-danger me-1"></i> Tienda Sonido Vivo — Viña del Mar
        </div>
        <h1 className="display-4 fw-bold mb-3 text-white">
          Pasión por la Música y Sonido Profesional
        </h1>
        <p className="lead mx-auto col-lg-8 mb-4 text-white-50">
          Encuentra las mejores marcas en guitarras, baterías, teclados y audio de estudio.
          Asesoría técnica garantizada, taller de luthería y envíos a todo Chile.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link
            to="/catalogo"
            className="btn btn-sv-primary px-4 py-2 fs-6 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
          >
            <i className="bi bi-grid-3x3-gap"></i>
            Explorar Catálogo Completo
          </Link>
          <Link
            to="/contacto"
            className="btn btn-outline-light px-4 py-2 fs-6 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
          >
            <i className="bi bi-chat-dots"></i>
            Contáctanos
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HeroInicio
