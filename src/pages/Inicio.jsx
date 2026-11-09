import { useState } from 'react'
import { guardarCarritoStorage, cargarCarritoStorage } from '../utils/persistencia'
import LayoutInicio from '../components/LayoutInicio'
import ContenedorInicio from '../components/ContenedorInicio'
import HeroInicio from '../components/HeroInicio'
import ShowroomMultimedia from '../components/ShowroomMultimedia'
import SeccionDestacados from '../components/SeccionDestacados'
import BannerCtaContacto from '../components/BannerCtaContacto'
import AlertaOperacion from '../components/AlertaOperacion'

const imagenesLocales = import.meta.glob('../assets/img/*.jpg', { eager: true, import: 'default' })

function Inicio({ productos = [], onAgregarAlCarrito, onAbrirCarrito }) {
  const [mensajeAlerta, setMensajeAlerta] = useState('')

  const handleAgregar = (producto) => {
    if (onAgregarAlCarrito) onAgregarAlCarrito(producto)
    const carritoActual = cargarCarritoStorage()
    guardarCarritoStorage([...carritoActual, producto])
    setMensajeAlerta(`Agregaste "${producto.nombre}" al carrito de compras.`)
    setTimeout(() => setMensajeAlerta(''), 2500)
  }

  const obtenerImagen = (codigo) => {
    const clave = `../assets/img/${codigo}.jpg`
    return imagenesLocales[clave] || imagenesLocales['../assets/img/GA001.jpg']
  }

  const productosDestacados = productos.slice(0, 4)

  return (
    <LayoutInicio>
      <HeroInicio />
      <ContenedorInicio>
        <AlertaOperacion
          mensaje={mensajeAlerta}
          onAccion={onAbrirCarrito}
          textoAccion="Ver Carrito"
        />
        <ShowroomMultimedia />
        <SeccionDestacados
          productosDestacados={productosDestacados}
          totalProductos={productos.length}
          onAgregarAlCarrito={handleAgregar}
          obtenerImagen={obtenerImagen}
        />
        <BannerCtaContacto />
      </ContenedorInicio>
    </LayoutInicio>
  )
}

export default Inicio
