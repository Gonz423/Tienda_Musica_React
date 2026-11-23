import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductosJefe from './ProductosJefe'
import { guardarProductoRemoto } from '../services/jefeServicio'

describe('ProductosJefe - Pruebas Unitarias', () => {
  const productosPrueba = [
    {
      codigo: 'GA001',
      categoria: 'Guitarras Acústicas',
      nombre: 'Guitarra Folk',
      marca: 'Yamaha',
      modelo: 'F310',
      stock: 2,
      precio: 120000,
      descripcion: 'Guitarra acustica para estudio'
    },
    {
      codigo: 'GA002',
      categoria: 'Guitarras Acústicas',
      nombre: 'Guitarra Clásica',
      marca: 'Fender',
      modelo: 'CD60',
      stock: 8,
      precio: 150000,
      descripcion: 'Guitarra con sonido nitido'
    }
  ]

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('1. Renderiza el formulario de gestion de productos con todos los campos requeridos', () => {
    render(<ProductosJefe productos={productosPrueba} />)

    expect(screen.getByLabelText(/Código/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Marca/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Modelo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Precio/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Stock/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Guardar Producto/i })).toBeInTheDocument()
  })

  it('2. Actualiza el estado reactivo al ingresar datos en los campos del formulario', async () => {
    const usuario = userEvent.setup()
    render(<ProductosJefe productos={productosPrueba} />)

    const inputNombre = screen.getByLabelText(/Nombre/i)
    const inputPrecio = screen.getByLabelText(/Precio/i)
    const inputStock = screen.getByLabelText(/Stock/i)

    await usuario.type(inputNombre, 'Bajo Eléctrico Jazz')
    await usuario.type(inputPrecio, '199990')
    await usuario.type(inputStock, '6')

    expect(inputNombre).toHaveValue('Bajo Eléctrico Jazz')
    expect(inputPrecio).toHaveValue(199990)
    expect(inputStock).toHaveValue(6)
  })

  it('3. Valida campos obligatorios y formato de precio mostrando mensajes accesibles de error', async () => {
    const usuario = userEvent.setup()
    render(<ProductosJefe productos={productosPrueba} />)

    const botonGuardar = screen.getByRole('button', { name: /Guardar Producto/i })
    await usuario.click(botonGuardar)

    expect(screen.getByText('El código es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('La marca es obligatoria')).toBeInTheDocument()
    expect(screen.getByText('El modelo es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('La descripción es obligatoria')).toBeInTheDocument()
    expect(screen.getByText('El precio debe ser mayor a 0')).toBeInTheDocument()
    expect(screen.getByText('El stock debe ser un entero no negativo (≥ 0)')).toBeInTheDocument()

    const inputPrecio = screen.getByLabelText(/Precio/i)
    await usuario.type(inputPrecio, '-500')
    await usuario.click(botonGuardar)
    expect(screen.getByText('El precio debe ser mayor a 0')).toBeInTheDocument()
  })

  it('4. Permite el envio exitoso del formulario (alta y edicion) ejecutando las funciones correspondientes', async () => {
    const usuario = userEvent.setup()
    const onAgregarMock = vi.fn()
    const onActualizarMock = vi.fn()

    render(
      <ProductosJefe
        productos={productosPrueba}
        onAgregarProducto={onAgregarMock}
        onActualizarProducto={onActualizarMock}
      />
    )

    await usuario.type(screen.getByLabelText(/Código/i), 'BA001')
    await usuario.type(screen.getByLabelText(/Nombre/i), 'Bajo Jazz')
    await usuario.type(screen.getByLabelText(/Marca/i), 'Fender')
    await usuario.type(screen.getByLabelText(/Modelo/i), 'Standard')
    await usuario.type(screen.getByLabelText(/Precio/i), '450000')
    await usuario.type(screen.getByLabelText(/Stock/i), '5')
    await usuario.type(screen.getByLabelText(/Descripción/i), 'Bajo 4 cuerdas clasico')

    await usuario.click(screen.getByRole('button', { name: /Guardar Producto/i }))

    expect(onAgregarMock).toHaveBeenCalledWith(
      expect.objectContaining({
        codigo: 'BA001',
        nombre: 'Bajo Jazz',
        precio: 450000,
        stock: 5
      })
    )

    const botonesEditar = screen.getAllByRole('button', { name: /Editar/i })
    await usuario.click(botonesEditar[0])

    expect(screen.getByRole('button', { name: /Actualizar Producto/i })).toBeInTheDocument()

    const inputNombre = screen.getByLabelText(/Nombre/i)
    await usuario.clear(inputNombre)
    await usuario.type(inputNombre, 'Guitarra Folk Premium')

    await usuario.click(screen.getByRole('button', { name: /Actualizar Producto/i }))

    expect(onActualizarMock).toHaveBeenCalledWith(
      expect.objectContaining({
        codigo: 'GA001',
        nombre: 'Guitarra Folk Premium'
      })
    )
  })

  it('5. Utiliza un espia vi.spyOn para verificar la persistencia del producto en localStorage', async () => {
    const espiaLocalStorage = vi.spyOn(Storage.prototype, 'setItem')
    const usuario = userEvent.setup()

    render(<ProductosJefe productos={productosPrueba} />)

    await usuario.type(screen.getByLabelText(/Código/i), 'UK001')
    await usuario.type(screen.getByLabelText(/Nombre/i), 'Ukelele Soprano')
    await usuario.type(screen.getByLabelText(/Marca/i), 'Mahalo')
    await usuario.type(screen.getByLabelText(/Modelo/i), 'Rainbow')
    await usuario.type(screen.getByLabelText(/Precio/i), '25000')
    await usuario.type(screen.getByLabelText(/Stock/i), '10')
    await usuario.type(screen.getByLabelText(/Descripción/i), 'Ukelele colorido para iniciar')

    await usuario.click(screen.getByRole('button', { name: /Guardar Producto/i }))

    expect(espiaLocalStorage).toHaveBeenCalledWith(
      'productos_catalogo',
      expect.stringContaining('UK001')
    )

    espiaLocalStorage.mockRestore()
  })

  it('6. Utiliza un mock asincrono vi.fn().mockResolvedValue para simular guardado remoto', async () => {
    const mockServicio = {
      guardar: vi.fn().mockResolvedValue({ id: 'REMOTO-1', status: 201 })
    }

    const resultado = await guardarProductoRemoto(mockServicio, { codigo: 'PR001' })
    expect(mockServicio.guardar).toHaveBeenCalledWith({ codigo: 'PR001' })
    expect(resultado.status).toBe(201)
  })

  it('7. Permite eliminar un producto del catálogo cuando se entrega onEliminarProducto', async () => {
    const usuario = userEvent.setup()
    const onEliminarMock = vi.fn()

    render(
      <ProductosJefe
        productos={productosPrueba}
        onEliminarProducto={onEliminarMock}
      />
    )

    const botonesEliminar = screen.getAllByRole('button', { name: /Eliminar/i })
    await usuario.click(botonesEliminar[0])

    expect(onEliminarMock).toHaveBeenCalledWith('GA001')
  })

  it('8. Valida stock inválido y permite cancelar la edición de un producto', async () => {
    const usuario = userEvent.setup()
    render(<ProductosJefe productos={productosPrueba} />)

    const botonesEditar = screen.getAllByRole('button', { name: /Editar/i })
    await usuario.click(botonesEditar[0])

    const botonCancelar = screen.getByRole('button', { name: /Cancelar/i })
    expect(botonCancelar).toBeInTheDocument()

    const inputStock = screen.getByLabelText(/Stock/i)
    await usuario.clear(inputStock)
    await usuario.type(inputStock, '-3')

    const botonActualizar = screen.getByRole('button', { name: /Actualizar Producto/i })
    await usuario.click(botonActualizar)

    expect(screen.getByText('El stock debe ser un entero no negativo (≥ 0)')).toBeInTheDocument()

    await usuario.click(botonCancelar)
    expect(screen.queryByRole('button', { name: /Cancelar/i })).not.toBeInTheDocument()
  })
})

