import { useState } from 'react'
import FormularioProducto from './FormularioProducto'
import TablaProductosJefe from './TablaProductosJefe'

const formInicial = { codigo: '', nombre: '', marca: '', modelo: '', categoria: 'Guitarras Acústicas', precio: '', stock: '', descripcion: '' }

function SeccionProductosJefe({ productos, onAgregarProducto, onActualizarProducto, onEliminarProducto }) {
  const [form, setForm] = useState(formInicial)
  const [editandoCodigo, setEditandoCodigo] = useState(null)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  const formatoMoneda = (val) => `$${Number(val || 0).toLocaleString('es-CL')}`

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleIniciarEdicion = (prod) => {
    setEditandoCodigo(prod.codigo)
    setForm({
      codigo: prod.codigo || '',
      nombre: prod.nombre || '',
      marca: prod.marca || '',
      modelo: prod.modelo || '',
      categoria: prod.categoria || 'Guitarras Acústicas',
      precio: prod.precio !== undefined ? String(prod.precio) : '',
      stock: prod.stock !== undefined ? String(prod.stock) : '',
      descripcion: prod.descripcion || '',
    })
    setErrores({})
  }

  const handleCancelarEdicion = () => {
    setEditandoCodigo(null)
    setForm(formInicial)
    setErrores({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = {}
    const requeridos = [
      ['codigo', 'El código es obligatorio'],
      ['nombre', 'El nombre es obligatorio'],
      ['marca', 'La marca es obligatoria'],
      ['modelo', 'El modelo es obligatorio'],
      ['categoria', 'La categoría es obligatoria'],
      ['descripcion', 'La descripción es obligatoria'],
    ]
    requeridos.forEach(([campo, msg]) => { if (!form[campo]?.trim()) err[campo] = msg })
    const precioNum = Number(form.precio)
    if (form.precio === '' || isNaN(precioNum) || precioNum <= 0) err.precio = 'El precio debe ser mayor a 0'
    const stockNum = Number(form.stock)
    if (form.stock === '' || isNaN(stockNum) || !Number.isInteger(stockNum) || stockNum < 0) err.stock = 'El stock debe ser un entero no negativo (≥ 0)'
    setErrores(err)
    if (Object.keys(err).length > 0) return

    const prodData = { ...form, precio: precioNum, stock: stockNum }
    const nombre = form.nombre
    // Los callbacks llaman a la API (App.jsx): solo se confirma si el backend responde OK
    const confirmar = (texto, limpiar) => {
      setMensaje(texto)
      limpiar()
      setTimeout(() => setMensaje(''), 3000)
    }
    if (editandoCodigo) {
      const datos = { ...prodData, codigoOriginal: editandoCodigo }
      localStorage.setItem('productos_catalogo', JSON.stringify(datos))
      Promise.resolve(onActualizarProducto?.(datos))
        .then(() => confirmar(`Producto "${nombre}" actualizado con éxito`, handleCancelarEdicion))
        .catch(() => {})
    } else {
      const nuevo = { ...prodData, codigo: form.codigo.trim().toUpperCase() }
      localStorage.setItem('productos_catalogo', JSON.stringify(nuevo))
      Promise.resolve(onAgregarProducto?.(nuevo))
        .then(() => confirmar(`Producto "${nombre}" agregado con éxito`, () => { setForm(formInicial); setErrores({}) }))
        .catch(() => {})
    }
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <FormularioProducto
          form={form}
          editandoCodigo={editandoCodigo}
          errores={errores}
          mensaje={mensaje}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancelar={handleCancelarEdicion}
        />
      </div>
      <div className="col-12 col-lg-7">
        <TablaProductosJefe
          productos={productos}
          editandoCodigo={editandoCodigo}
          formatoMoneda={formatoMoneda}
          handleIniciarEdicion={handleIniciarEdicion}
          onEliminarProducto={onEliminarProducto}
        />
      </div>
    </div>
  )
}

export default SeccionProductosJefe
