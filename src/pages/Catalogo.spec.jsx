import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Catalogo from './Catalogo'
import { guardarCarritoStorage, cargarCarritoStorage, cargarProductosStorage } from '../utils/persistencia'
import { consultarDisponibilidadStock, procesarCheckoutCliente } from '../services/clienteServicio'

describe('Perfil Cliente - Guía 14: 10 Pruebas Unitarias de Vista de Usuario', () => {
  const productosPrueba = [
    {
      codigo: 'GA001',
      categoria: 'Guitarras Acústicas',
      nombre: 'Guitarra Folk',
      marca: 'Yamaha',
      modelo: 'F310',
      stock: 5,
      precio: 129990,
      descripcion: 'Guitarra acustica para estudio y practica'
    },
    {
      codigo: 'BT001',
      categoria: 'Baterías',
      nombre: 'Batería Acústica Stage',
      marca: 'Pearl',
      modelo: 'Export',
      stock: 2,
      precio: 499990,
      descripcion: 'Bateria acustica completa con platillos'
    },
    {
      codigo: 'AC001',
      categoria: 'Accesorios',
      nombre: 'Afinador Cromático',
      marca: 'Korg',
      modelo: 'CA-50',
      stock: 0,
      precio: 15990,
      descripcion: 'Afinador digital de alta precision'
    }
  ]

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // 1. Renderizado
  it('1. Renderiza correctamente los productos en el catalogo con marcas, precios y stock', () => {
    render(<Catalogo productos={productosPrueba} />)

    expect(screen.getByText('Guitarra Folk')).toBeInTheDocument()
    expect(screen.getByText('Batería Acústica Stage')).toBeInTheDocument()
    expect(screen.getByText('Afinador Cromático')).toBeInTheDocument()
    expect(screen.getByText('$129.990')).toBeInTheDocument()
    expect(screen.getByText('$499.990')).toBeInTheDocument()
    expect(screen.getByText('$15.990')).toBeInTheDocument()
    expect(screen.getByText(/Mostrando/i)).toHaveTextContent('Mostrando 3 de 3 productos')
  })

  // 2. Buscador y limpieza
  it('2. Filtra productos mediante el buscador por nombre, marca y modelo, permitiendo limpiar el campo', async () => {
    const usuario = userEvent.setup()
    render(<Catalogo productos={productosPrueba} />)

    const inputBuscar = screen.getByLabelText(/Buscar producto/i)

    // Busqueda nombre
    await usuario.type(inputBuscar, 'folk')
    expect(screen.getByText('Guitarra Folk')).toBeInTheDocument()
    expect(screen.queryByText('Batería Acústica Stage')).not.toBeInTheDocument()

    // Limpiar
    const botonLimpiar = screen.getByTitle(/Limpiar busqueda/i)
    await usuario.click(botonLimpiar)
    expect(inputBuscar).toHaveValue('')
    expect(screen.getByText('Batería Acústica Stage')).toBeInTheDocument()

    // Busqueda marca
    await usuario.type(inputBuscar, 'Pearl')
    expect(screen.getByText('Batería Acústica Stage')).toBeInTheDocument()
    expect(screen.queryByText('Guitarra Folk')).not.toBeInTheDocument()
    await usuario.clear(inputBuscar)

    // Busqueda modelo
    await usuario.type(inputBuscar, 'CA-50')
    expect(screen.getByText('Afinador Cromático')).toBeInTheDocument()
    expect(screen.queryByText('Guitarra Folk')).not.toBeInTheDocument()
  })

  // 3. Filtro por categoria
  it('3. Filtra la lista de productos al seleccionar una categoria especifica', async () => {
    const usuario = userEvent.setup()
    render(<Catalogo productos={productosPrueba} />)

    const botonBaterias = screen.getByRole('button', { name: /^baterías$/i })
    await usuario.click(botonBaterias)

    expect(screen.getByText('Batería Acústica Stage')).toBeInTheDocument()
    expect(screen.queryByText('Guitarra Folk')).not.toBeInTheDocument()
    expect(screen.queryByText('Afinador Cromático')).not.toBeInTheDocument()

    // Todas
    const botonTodas = screen.getByRole('button', { name: /^todas$/i })
    await usuario.click(botonTodas)
    expect(screen.getByText('Guitarra Folk')).toBeInTheDocument()
    expect(screen.getByText('Batería Acústica Stage')).toBeInTheDocument()
  })

  // 4. Orden por precio
  it('4. Ordena correctamente los productos por precio de menor a mayor y viceversa', async () => {
    const usuario = userEvent.setup()
    render(<Catalogo productos={productosPrueba} />)

    const selectOrden = screen.getByLabelText(/Ordenar:/i)

    // Menor precio
    await usuario.selectOptions(selectOrden, 'menor-precio')
    const titulosMenor = screen.getAllByRole('heading', { level: 5 }).map((h) => h.textContent)
    expect(titulosMenor).toEqual(['Afinador Cromático', 'Guitarra Folk', 'Batería Acústica Stage'])

    // Mayor precio
    await usuario.selectOptions(selectOrden, 'mayor-precio')
    const titulosMayor = screen.getAllByRole('heading', { level: 5 }).map((h) => h.textContent)
    expect(titulosMayor).toEqual(['Batería Acústica Stage', 'Guitarra Folk', 'Afinador Cromático'])
  })

  // 5. Orden A-Z
  it('5. Ordena alfabeticamente los productos de A a Z por su nombre', async () => {
    const usuario = userEvent.setup()
    render(<Catalogo productos={productosPrueba} />)

    const selectOrden = screen.getByLabelText(/Ordenar:/i)
    await usuario.selectOptions(selectOrden, 'nombre-az')

    const titulosAZ = screen.getAllByRole('heading', { level: 5 }).map((h) => h.textContent)
    expect(titulosAZ).toEqual(['Afinador Cromático', 'Batería Acústica Stage', 'Guitarra Folk'])
  })

  // 6. Estado vacio y restablecer
  it('6. Muestra mensaje accesible de estado vacio y permite restablecer los filtros', async () => {
    const usuario = userEvent.setup()
    render(<Catalogo productos={productosPrueba} />)

    const inputBuscar = screen.getByLabelText(/Buscar producto/i)
    await usuario.type(inputBuscar, 'InstrumentoInexistenteXYZ')

    expect(screen.getByText(/No se encontraron productos/i)).toBeInTheDocument()
    expect(screen.getByText(/Intenta con otra palabra clave/i)).toBeInTheDocument()

    const botonRestablecer = screen.getByRole('button', { name: /Restablecer Filtros/i })
    await usuario.click(botonRestablecer)

    expect(screen.getByText('Guitarra Folk')).toBeInTheDocument()
    expect(inputBuscar).toHaveValue('')
  })

  // 7. Agregar al carrito y alerta
  it('7. Ejecuta callback onAgregarAlCarrito y muestra alerta temporal al agregar producto', async () => {
    vi.useFakeTimers()
    const onAgregarMock = vi.fn()
    const onAbrirCarritoMock = vi.fn()
    render(<Catalogo productos={productosPrueba} onAgregarAlCarrito={onAgregarMock} onAbrirCarrito={onAbrirCarritoMock} />)

    const botonesAgregar = screen.getAllByRole('button', { name: /Agregar al Carrito/i })
    await act(async () => {
      botonesAgregar[0].click()
    })

    expect(onAgregarMock).toHaveBeenCalledTimes(1)
    expect(onAgregarMock).toHaveBeenCalledWith(productosPrueba[0])
    expect(screen.getByText(/Agregaste "Guitarra Folk" al carrito de compras/i)).toBeInTheDocument()

    // Ver carrito
    const botonVerCarrito = screen.getByRole('button', { name: /Ver Carrito/i })
    await act(async () => {
      botonVerCarrito.click()
    })
    expect(onAbrirCarritoMock).toHaveBeenCalled()

    // Temporizador alerta
    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(screen.queryByText(/Agregaste "Guitarra Folk" al carrito/i)).not.toBeInTheDocument()

    // Sin callback
    render(<Catalogo productos={[productosPrueba[0]]} />)
    const botonSinCallback = screen.getAllByRole('button', { name: /Agregar al Carrito/i })[0]
    await act(async () => {
      botonSinCallback.click()
    })

    vi.useRealTimers()
  })

  // 8. Stock critico y agotado
  it('8. Deshabilita boton de compra para productos sin stock y resalta stock critico', () => {
    render(<Catalogo productos={productosPrueba} />)

    // Agotado
    expect(screen.getByText('Sin Stock')).toBeInTheDocument()
    const botonAgotado = screen.getByRole('button', { name: /Agotado/i })
    expect(botonAgotado).toBeDisabled()

    // Critico
    expect(screen.getByText('Stock: 2 un.')).toHaveClass('bg-warning')

    // Normal
    expect(screen.getByText('Stock: 5 un.')).toHaveClass('bg-success')
  })

  // 9. Espia localStorage
  it('9. Utiliza un espia vi.spyOn para comprobar la persistencia del carrito en localStorage', async () => {
    const espiaLocalStorage = vi.spyOn(Storage.prototype, 'setItem')
    const usuario = userEvent.setup()

    render(<Catalogo productos={productosPrueba} />)

    const botonesAgregar = screen.getAllByRole('button', { name: /Agregar al Carrito/i })
    await usuario.click(botonesAgregar[0])

    expect(espiaLocalStorage).toHaveBeenCalledWith(
      'carrito_compras',
      expect.stringContaining('GA001')
    )

    // Utilidades persistencia
    guardarCarritoStorage([productosPrueba[1]])
    expect(espiaLocalStorage).toHaveBeenCalledWith(
      'carrito_compras',
      JSON.stringify([productosPrueba[1]])
    )

    const carritoRecuperado = cargarCarritoStorage()
    expect(carritoRecuperado).toEqual([productosPrueba[1]])

    // JSON invalido
    localStorage.setItem('carrito_compras', 'invalido{json')
    expect(cargarCarritoStorage()).toEqual([])

    localStorage.setItem('productos_catalogo', 'invalido{json')
    expect(cargarProductosStorage()).toEqual([])

    espiaLocalStorage.mockRestore()
  })

  // 10. Mocks asincronos
  it('10. Utiliza un mock asincrono vi.fn().mockResolvedValue para simular consulta de stock y checkout del cliente', async () => {
    // Mock stock
    const servicioStockMock = {
      consultarStock: vi.fn().mockResolvedValue({ codigo: 'GA001', disponible: true, unidades: 8 })
    }

    const resultadoStock = await consultarDisponibilidadStock(servicioStockMock, 'GA001')
    expect(servicioStockMock.consultarStock).toHaveBeenCalledWith('GA001')
    expect(resultadoStock.disponible).toBe(true)
    expect(resultadoStock.unidades).toBe(8)

    // Mock checkout
    const servicioCheckoutMock = {
      crearPedido: vi.fn().mockResolvedValue({ exito: true, orderId: 8841, mensaje: 'Pedido recibido' })
    }

    const datosCompra = { cliente: 'Gonzalo', total: 129990, items: ['GA001'] }
    const resultadoCheckout = await procesarCheckoutCliente(servicioCheckoutMock, datosCompra)
    expect(servicioCheckoutMock.crearPedido).toHaveBeenCalledWith(datosCompra)
    expect(resultadoCheckout.exito).toBe(true)
    expect(resultadoCheckout.orderId).toBe(8841)
  })

  // Pruebas adicionales
  it('11. Filtra productos mediante el dropdown select de categorias y maneja fallback de imagenes', async () => {
    const usuario = userEvent.setup()
    const productosConCodigoRaro = [
      ...productosPrueba,
      {
        id: 99,
        categoria: 'Otros',
        nombre: 'Cencerro Metálico',
        marca: 'LP',
        modelo: 'Classic',
        stock: 4,
        precio: 25000,
        descripcion: 'Cencerro sin codigo de imagen'
      }
    ]

    render(<Catalogo productos={productosConCodigoRaro} />)

    const selectCategoria = screen.getByLabelText(/Categoría:/i)
    await usuario.selectOptions(selectCategoria, 'Baterías')

    expect(screen.getByText('Batería Acústica Stage')).toBeInTheDocument()
    expect(screen.queryByText('Guitarra Folk')).not.toBeInTheDocument()

    // Volver a todas
    await usuario.selectOptions(selectCategoria, 'todas')
    expect(screen.getByText('Cencerro Metálico')).toBeInTheDocument()
  })

  it('12. Ordena los productos por menor precio, mayor precio y nombre A-Z', async () => {
    const usuario = userEvent.setup()
    render(<Catalogo productos={productosPrueba} />)

    const selectOrden = screen.getByLabelText(/Ordenar:/i)

    // Menor precio
    await usuario.selectOptions(selectOrden, 'menor-precio')
    expect(selectOrden).toHaveValue('menor-precio')

    // Mayor precio
    await usuario.selectOptions(selectOrden, 'mayor-precio')
    expect(selectOrden).toHaveValue('mayor-precio')

    // Nombre A-Z
    await usuario.selectOptions(selectOrden, 'nombre-az')
    expect(selectOrden).toHaveValue('nombre-az')
  })

  it('13. Muestra botón "Ver Carrito" en la alerta y ejecuta callback onAbrirCarrito', async () => {
    const usuario = userEvent.setup()
    const onAbrirCarritoMock = vi.fn()

    render(
      <Catalogo
        productos={productosPrueba}
        onAbrirCarrito={onAbrirCarritoMock}
      />
    )

    const botonesAgregar = screen.getAllByRole('button', { name: /Agregar al Carrito/i })
    await usuario.click(botonesAgregar[0])

    const botonVerCarrito = screen.getByRole('button', { name: /ver carrito/i })
    expect(botonVerCarrito).toBeInTheDocument()

    await usuario.click(botonVerCarrito)
    expect(onAbrirCarritoMock).toHaveBeenCalledTimes(1)
  })

  it('14. Renderiza sin productos cuando no se entregan propiedades (props por defecto)', () => {
    render(<Catalogo />)
    expect(screen.getByText(/Mostrando/i)).toHaveTextContent('Mostrando 0 de 0 productos')
    expect(screen.getByText('No se encontraron productos')).toBeInTheDocument()
  })
})