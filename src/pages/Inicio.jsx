import { useState } from 'react'
import { Link } from 'react-router-dom'
import audioDemo from '../assets/video/audio.mp3'
import videoDemo from '../assets/video/video.mp4'
import banerImg from '../assets/img/baner.png'
import banerCelularImg from '../assets/img/banercelular.png'
import banerCelular2Img from '../assets/img/banercelular2.png'
import { guardarCarritoStorage, cargarCarritoStorage } from '../utils/persistencia'

const imagenesLocales = import.meta.glob('../assets/img/*.jpg', { eager: true, import: 'default' })

function Inicio({ productos = [], onAgregarAlCarrito, onAbrirCarrito }) {
  const [mensajeAlerta, setMensajeAlerta] = useState('')

  const handleAgregar = (producto) => {
    if (onAgregarAlCarrito) {
      onAgregarAlCarrito(producto)
    }
    const carritoActual = cargarCarritoStorage()
    guardarCarritoStorage([...carritoActual, producto])
    setMensajeAlerta(`Agregaste "${producto.nombre}" al carrito de compras.`)
    setTimeout(() => {
      setMensajeAlerta('')
    }, 2500)
  }

  const obtenerImagen = (codigo) => {
    const clave = `../assets/img/${codigo}.jpg`
    return imagenesLocales[clave] || imagenesLocales['../assets/img/GA001.jpg']
  }

  // Seleccionar 4 instrumentos destacados de diferentes categorias
  const productosDestacados = productos.slice(0, 4)

  return (
    <div className="inicio-pantalla pb-5">
      {/* Hero Principal */}
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
            <i className="bi bi-geo-alt-fill text-danger me-1"></i> Tienda Sonido Vivo · Viña del Mar
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

      <div className="container mt-5">
        {/* Alerta de Carrito */}
        {mensajeAlerta && (
          <div
            className="alert alert-success alert-dismissible fade show shadow-sm text-center mb-4 border-0 d-flex align-items-center justify-content-center flex-wrap gap-2"
            role="alert"
          >
            <div>
              <i className="bi bi-check-circle-fill me-2"></i>
              {mensajeAlerta}
            </div>
            {onAbrirCarrito && (
              <button
                type="button"
                className="btn btn-sm btn-dark ms-2 py-0 px-2 fw-semibold shadow-sm"
                style={{ fontSize: '0.8rem', borderRadius: '6px' }}
                onClick={onAbrirCarrito}
              >
                <i className="bi bi-cart3 me-1"></i> Ver Carrito
              </button>
            )}
          </div>
        )}

        {/* SECCION MULTIMEDIA: DEMOSTRACION DE AUDIO Y VIDEO */}
        <section className="mb-5">
          <div className="text-center mb-4">
            <span className="badge btn-sv-secondary text-uppercase px-3 py-2 rounded-pill mb-2 shadow-sm">
              <i className="bi bi-soundwave me-1"></i> Experiencia Multimedia
            </span>
            <h2 className="fw-bold mb-2" style={{ color: 'var(--color-texto)' }}>
              Demostración de Audio y Video en Vivo
            </h2>
            <p className="text-muted mx-auto col-lg-7 small">
              Conoce nuestro taller de instrumentos y escucha la calidad sonora de los equipos disponibles en nuestra tienda de Viña del Mar.
            </p>
          </div>

          <div className="row g-4">
            {/* Demostracion de Video */}
            <div className="col-12 col-lg-7">
              <div className="media-card-sv h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge bg-danger text-white px-2 py-1 small">
                      <i className="bi bi-camera-video me-1"></i> Video HD
                    </span>
                    <span className="small text-muted">
                      <i className="bi bi-eye me-1"></i> Taller y Showroom
                    </span>
                  </div>

                  <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm mb-3 bg-black">
                    <video
                      controls
                      preload="metadata"
                      src={videoDemo}
                      className="w-100 h-100 object-fit-cover"
                    >
                      Tu navegador no soporta reproducción de video.
                    </video>
                  </div>

                  <h5 className="fw-bold mb-1" style={{ color: 'var(--color-secundario)' }}>
                    Presentación de Tienda y Pruebas de Instrumentos
                  </h5>
                  <p className="text-muted small mb-0">
                    Descubre nuestro showroom, los procesos de inspección acústica y la calibración profesional realizada antes de cada despacho.
                  </p>
                </div>

                <div className="pt-3 mt-3 border-top d-flex align-items-center justify-content-between small text-muted">
                  <span>
                    <i className="bi bi-check-circle-fill text-success me-1"></i> Calibración gratuita incluida
                  </span>
                  <Link to="/catalogo" className="text-decoration-none fw-semibold" style={{ color: 'var(--color-acento)' }}>
                    Ver instrumentos <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Demostracion de Audio */}
            <div className="col-12 col-lg-5">
              <div className="media-card-sv h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge bg-warning text-dark px-2 py-1 small fw-bold">
                      <i className="bi bi-music-note me-1"></i> Prueba Sonora
                    </span>
                    <span className="small text-muted">
                      <i className="bi bi-mic me-1"></i> Grabación de Estudio
                    </span>
                  </div>

                  {/* Reproductor de Audio estilizado */}
                  <div
                    className="p-4 rounded-3 text-center mb-3 shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #2b1814 0%, #160c0a 100%)',
                      color: '#ffffff'
                    }}
                  >
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'var(--color-acento)',
                        color: '#ffffff'
                      }}
                    >
                      <i className="bi bi-volume-up fs-2"></i>
                    </div>

                    <h6 className="fw-bold mb-1 text-white">Muestra Acústica y Fidelidad Tonal</h6>
                    <p className="text-white-50 small mb-3" style={{ fontSize: '0.8rem' }}>
                      Grabación capturada con interfaces y micrófonos profesionales de tienda.
                    </p>

                    <audio controls className="w-100 shadow-sm rounded-pill" src={audioDemo}>
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </div>

                  <h5 className="fw-bold mb-1 fs-6" style={{ color: 'var(--color-secundario)' }}>
                    Respuesta Dinámica y Rango Tonal
                  </h5>
                  <p className="text-muted small mb-0">
                    Comprueba la claridad en frecuencias medias y bajas. Puedes agendar una prueba personalizada en nuestra tienda antes de comprar.
                  </p>
                </div>

                <div className="pt-3 mt-3 border-top">
                  <Link
                    to="/contacto"
                    className="btn btn-outline-secondary btn-sm w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi bi-calendar2-check"></i>
                    Solicitar Asesoría o Prueba
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCION DE PRODUCTOS DESTACADOS */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <span className="badge btn-sv-primary px-3 py-1 rounded-pill mb-1">
                Catálogo Selección
              </span>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--color-texto)' }}>
                Instrumentos Destacados
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="btn btn-outline-secondary fw-semibold d-inline-flex align-items-center gap-2"
              style={{ borderRadius: '8px' }}
            >
              <span>Ver todo el Catálogo</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 g-3 g-md-4">
            {productosDestacados.map((producto) => (
              <div key={producto.codigo || producto.id} className="col">
                <article className="card-producto-sv text-center h-100 d-flex flex-column justify-content-between">
                  <figure className="mb-0">
                    <Link to={`/producto/${producto.codigo || producto.id}`}>
                      <img
                        src={obtenerImagen(producto.codigo)}
                        alt={`${producto.nombre} ${producto.marca}`}
                        loading="lazy"
                        style={{ cursor: 'pointer' }}
                      />
                    </Link>
                  </figure>

                  <div className="p-2 px-3 bg-light text-center border-bottom">
                    <span
                      className="badge text-uppercase"
                      style={{ backgroundColor: 'var(--color-primario)' }}
                    >
                      {producto.categoria}
                    </span>
                  </div>

                  <div className="card-body d-flex flex-column justify-content-between p-3 text-center">
                    <div>
                      <h5
                        className="card-title fw-bold mb-1 fs-6 text-center producto-titulo"
                        style={{ color: 'var(--color-texto)' }}
                      >
                        <Link
                          to={`/producto/${producto.codigo || producto.id}`}
                          className="text-decoration-none text-dark"
                        >
                          {producto.nombre}
                        </Link>
                      </h5>
                      <p className="text-muted small mb-2 text-center text-truncate">
                        <strong>{producto.marca}</strong> | Modelo: {producto.modelo}
                      </p>
                    </div>

                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span
                          className="fs-5 fw-bold"
                          style={{ color: 'var(--color-acento)' }}
                        >
                          ${producto.precio?.toLocaleString('es-CL')}
                        </span>
                        <span
                          className={`badge ${producto.stock > 3
                              ? 'bg-success'
                              : producto.stock > 0
                                ? 'bg-warning text-dark'
                                : 'bg-danger'
                            }`}
                        >
                          {producto.stock > 0 ? `Stock: ${producto.stock} un.` : 'Sin Stock'}
                        </span>
                      </div>

                      <div className="d-grid gap-2">
                        <button
                          type="button"
                          className="btn btn-sv-primary w-100 fw-semibold d-flex justify-content-center align-items-center gap-2 shadow-sm"
                          onClick={() => handleAgregar(producto)}
                          disabled={producto.stock === 0}
                        >
                          <i className="bi bi-cart-plus"></i>
                          <span>{producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <div className="text-center mt-4 pt-2">
            <Link
              to="/catalogo"
              className="btn btn-sv-primary px-5 py-2 fw-semibold shadow-sm"
              style={{ fontSize: '1rem' }}
            >
              <i className="bi bi-grid-3x3-gap me-2"></i>
              Ir a la pantalla del Catálogo Completo ({productos.length} productos)
            </Link>
          </div>
        </section>

        {/* BANNER CTA: CONTACTO */}
        <section
          className="banner-cta-contacto p-4 p-md-5 rounded-4 text-white text-center text-md-start mb-4 shadow-sm position-relative overflow-hidden"
          style={{
            '--cta-bg-mobile': `url(${banerCelular2Img})`,
          }}
        >
          <div className="row align-items-center gy-3">
            <div className="col-12 col-md-8">
              <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold mb-2">
                Atención y Luthería
              </span>
              <h3 className="fw-bold mb-2 text-white">¿Tienes un requerimiento especial o buscas un instrumento específico?</h3>
              <p className="text-white-50 mb-0 small">
                Comunícate con nuestro equipo en Viña del Mar. Ofrecemos cotizaciones a medida para músicos, colegios y bandas.
              </p>
            </div>
            <div className="col-12 col-md-4 text-md-end">
              <Link
                to="/contacto"
                className="btn btn-light px-4 py-2 fw-bold shadow"
                style={{ color: 'var(--color-primario)', borderRadius: '8px' }}
              >
                <i className="bi bi-envelope-check me-2"></i>
                Ir a Contáctanos
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Inicio
