import banerCelular2Img from '../assets/img/banercelular2.png'

function LayoutContacto({ children }) {
  return (
    <div
      className="pagina-contacto-wrapper py-4 py-md-5"
      style={{
        backgroundImage: `linear-gradient(rgba(35, 18, 14, 0.68), rgba(25, 12, 10, 0.78)), url(${banerCelular2Img})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container">
        {children}
      </div>
    </div>
  )
}

export default LayoutContacto

