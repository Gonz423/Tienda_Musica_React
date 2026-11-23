import { useState } from 'react'
import LayoutContacto from '../components/LayoutContacto'
import EncabezadoContacto from '../components/EncabezadoContacto'
import MensajeExitoContacto from '../components/MensajeExitoContacto'
import FormularioContacto, { TEMAS_CONTACTO } from '../components/FormularioContacto'

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
    if (!formulario.nombre.trim()) err.nombre = 'Ingresa tu nombre completo'

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formulario.email.trim()) err.email = 'Ingresa tu correo electrónico'
    else if (!regexEmail.test(formulario.email.trim())) err.email = 'Ingresa un correo electrónico con formato válido (ej: nombre@correo.com)'

    const regexTelefono = /^[0-9+() -]{8,}$/
    if (!formulario.telefono.trim()) err.telefono = 'Ingresa tu número de teléfono de contacto'
    else if (!regexTelefono.test(formulario.telefono.trim())) err.telefono = 'Ingresa un número de teléfono válido (mínimo 8 dígitos)'

    if (!formulario.mensaje.trim() || formulario.mensaje.trim().length < 10) err.mensaje = 'El mensaje debe tener al menos 10 caracteres'

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
    setFormulario({ nombre: '', email: '', telefono: '', tema: 'asesoria', instrumento: 'Guitarras', mensaje: '' })
    setErrores({})
  }

  return (
    <LayoutContacto>
      <EncabezadoContacto />
      {ticketEnviado ? (
        <MensajeExitoContacto ticket={ticketEnviado} onReiniciar={reiniciarFormulario} />
      ) : (
        <FormularioContacto
          formulario={formulario}
          setFormulario={setFormulario}
          errores={errores}
          enviando={enviando}
          onSubmit={handleSubmit}
        />
      )}
    </LayoutContacto>
  )
}

export default Contacto
