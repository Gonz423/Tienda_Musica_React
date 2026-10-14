import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VistaCliente from './VistaCliente'
import Navbar from './Navbar'
import Footer from './Footer'
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

  // 1. Prueba de renderizado correcto de la lista de productos en el catalogo
  it('1. Renderiza correctamente los productos en el catalogo con marcas, precios y stock', () => {
    render(<VistaCliente productos={productosPrueba} />)

    expect(screen.getByText('Guitarra Folk')).toBeInTheDocument()
    expect(screen.getByText('Batería Acústica Stage')).toBeInTheDocument()
    expect(screen.getByText('Afinador Cromático')).toBeInTheDocument()
    expect(screen.getByText('$129.990')).toBeInTheDocument()
    expect(screen.getByText('$499.990')).toBeInTheDocument()
    expect(screen.getByText('$15.990')).toBeInTheDocument()
    expect(screen.getByText(/Mostrando/i)).toHaveTextContent('Mostrando 3 de 3 productos')
  })

  // 2. Prueba del buscador reactivo en tiempo real (por nombre, marca y modelo) y boton de limpiar
  it('2. Filtra productos mediante el buscador por nombre, marca y modelo, permitiendo limpiar el campo', async () => {
    const usuario = userEvent.setup()
    render(<VistaCliente productos={productosPrueba} />)

    const inputBuscar = screen.getByLabelText(/Buscar producto/i)

    // Busqueda por nombre
    await usuario.type(inputBuscar, 'folk')
    expect(screen.getByText('Guitarra Folk')).toBeInTheDocument()
    expect(screen.queryByText('Batería Acústica Stage')).not.toBeInTheDocument()

    // Limpiar busqueda con el boton de la cruz
    const botonLimpiar = screen.getByTitle(/Limpiar busqueda/i)
    await usuario.click(botonLimpiar)
    expect(inputBuscar).toHaveValue('')
    expect(screen.getByText('Batería Acústica Stage')).toBeInTheDocument()

    // Busqueda por marca
    await usuario.type(inputBuscar, 'Pearl')
    expect(screen.getByText('Batería Acústica Stage')).toBeInTheDocument()
    expect(screen.queryByText('Guitarra Folk')).not.toBeInTheDocument()
    await usuario.clear(inputBuscar)

    // Busqueda por modelo
    await usuario.type(inputBuscar, 'CA-50')
    expect(screen.getByText('Afinador Cromático')).toBeInTheDocument()
    expect(screen.queryByText('Guitarra Folk')).not.toBeInTheDocument()
  })

  // 3. Prueba del filtro interactivo por categorias
  it('3. Filtra la lista de productos al seleccionar una categoria especifica', async () => {
    const usuario = userEvent.setup()
    render(<VistaCliente productos={productosPrueba} />)

    const botonBaterias = screen.getByRole('button', { name: /^baterías$/i })
    await usuario.click(botonBaterias)

    expect(screen.getByText('Batería Acústica Stage')).toBeInTheDocument()
    expect(screen.queryByText('Guitarra Folk')).not.toBeInTheDocument()
    expect(screen.queryByText('Afinador Cromático')).not.toBeInTheDocument()

    // Volver a todas
    const botonTodas = screen.getByRole('button', { name: /^todas$/i })
    await usuario.click(botonTodas)
    expect(screen.getByText('Guitarra Folk')).toBeInTheDocument()
    expect(screen.getByText('Batería Acústica Stage')).toBeInTheDocument()
  })

  // 4. Prueba del ordenamiento de productos por menor y mayor precio
  it('4. Ordena correctamente los productos por precio de menor a mayor y viceversa', async () => {
    const usuario = userEvent.setup()
    render(<VistaCliente productos={productosPrueba} />)

    const selectOrden = screen.getByLabelText(/Ordenar:/i)

    // Menor a mayor precio (15.990 -> 129.990 -> 499.990)
    await usuario.selectOptions(selectOrden, 'menor-precio')
    const titulosMenor = screen.getAllByRole('heading', { level: 5 }).map((h) => h.textContent)
    expect(titulosMenor).toEqual(['Afinador Cromático', 'Guitarra Folk', 'Batería Acústica Stage'])

    // Mayor a menor precio (499.990 -> 129.990 -> 15.990)
    await usuario.selectOptions(selectOrden, 'mayor-precio')
    const titulosMayor = screen.getAllByRole('heading', { level: 5 }).map((h) => h.textContent)
    expect(titulosMayor).toEqual(['Batería Acústica Stage', 'Guitarra Folk', 'Afinador Cromático'])
  })

  // 5. Prueba del ordenamiento alfabetico por nombre (A - Z)
  it('5. Ordena alfabeticamente los productos de A a Z por su nombre', async () => {
    const usuario = userEvent.setup()
    render(<VistaCliente productos={productosPrueba} />)

    const selectOrden = screen.getByLabelText(/Ordenar:/i)
    await usuario.selectOptions(selectOrden, 'nombre-az')

    const titulosAZ = screen.getAllByRole('heading', { level: 5 }).map((h) => h.textContent)
    expect(titulosAZ).toEqual(['Afinador Cromático', 'Batería Acústica Stage', 'Guitarra Folk'])
  })

  // 6. Prueba del estado vacio cuando no hay coincidencias y boton de restablecer filtros
  it('6. Muestra mensaje accesible de estado vacio y permite restablecer los filtros', async () => {
    const usuario = userEvent.setup()
    render(<VistaCliente productos={productosPrueba} />)

    const inputBuscar = screen.getByLabelText(/Buscar producto/i)
    await usuario.type(inputBuscar, 'InstrumentoInexistenteXYZ')

    expect(screen.getByText(/No se encontraron productos/i)).toBeInTheDocument()
    expect(screen.getByText(/Intenta con otra palabra clave/i)).toBeInTheDocument()

    const botonRestablecer = screen.getByRole('button', { name: /Restablecer Filtros/i })
    await usuario.click(botonRestablecer)

    expect(screen.getByText('Guitarra Folk')).toBeInTheDocument()
    expect(inputBuscar).toHaveValue('')
  })

  // 7. Prueba de agregar al carrito, ejecucion de callback y alerta con temporizador
  it('7. Ejecuta callback onAgregarAlCarrito y muestra alerta temporal al agregar producto', async () => {
    vi.useFakeTimers()
    const onAgregarMock = vi.fn()
    render(<VistaCliente productos={productosPrueba} onAgregarAlCarrito={onAgregarMock} />)

    const botonesAgregar = screen.getAllByRole('button', { name: /Agregar al Carrito/i })
    await act(async () => {
      botonesAgregar[0].click()
    })

    expect(onAgregarMock).toHaveBeenCalledTimes(1)
    expect(onAgregarMock).toHaveBeenCalledWith(productosPrueba[0])
    expect(screen.getByText(/Agregaste "Guitarra Folk" al carrito de compras/i)).toBeInTheDocument()

    // Avanzar temporizador para comprobar que la alerta desaparece
    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(screen.queryByText(/Agregaste "Guitarra Folk" al carrito/i)).not.toBeInTheDocument()

    // Probar agregar sin callback prop definida
    render(<VistaCliente productos={[productosPrueba[0]]} />)
    const botonSinCallback = screen.getAllByRole('button', { name: /Agregar al Carrito/i })[0]
    await act(async () => {
      botonSinCallback.click()
    })

    vi.useRealTimers()
  })

  // 8. Prueba del manejo de stock critico y producto agotado con boton deshabilitado
  it('8. Deshabilita boton de compra para productos sin stock y resalta stock critico', () => {
    render(<VistaCliente productos={productosPrueba} />)

    // Producto sin stock (AC001: stock 0)
    expect(screen.getByText('Sin Stock')).toBeInTheDocument()
    const botonAgotado = screen.getByRole('button', { name: /Agotado/i })
    expect(botonAgotado).toBeDisabled()

    // Producto con stock critico (BT001: stock 2)
    expect(screen.getByText('Stock: 2 un.')).toHaveClass('bg-warning')

    // Producto con stock normal (GA001: stock 5)
    expect(screen.getByText('Stock: 5 un.')).toHaveClass('bg-success')
  })

  // 9. Prueba con espia vi.spyOn(Storage.prototype, 'setItem') al persistir en localStorage
  it('9. Utiliza un espia vi.spyOn para comprobar la persistencia del carrito en localStorage', async () => {
    const espiaLocalStorage = vi.spyOn(Storage.prototype, 'setItem')
    const usuario = userEvent.setup()

    render(<VistaCliente productos={productosPrueba} />)

    const botonesAgregar = screen.getAllByRole('button', { name: /Agregar al Carrito/i })
    await usuario.click(botonesAgregar[0])

    expect(espiaLocalStorage).toHaveBeenCalledWith(
      'carrito_compras',
      expect.stringContaining('GA001')
    )

    // Probar funciones utilitarias directas de persistencia del carrito
    guardarCarritoStorage([productosPrueba[1]])
    expect(espiaLocalStorage).toHaveBeenCalledWith(
      'carrito_compras',
      JSON.stringify([productosPrueba[1]])
    )

    const carritoRecuperado = cargarCarritoStorage()
    expect(carritoRecuperado).toEqual([productosPrueba[1]])

    // Manejo de error cuando el JSON de localStorage es corrupto
    localStorage.setItem('carrito_compras', 'invalido{json')
    expect(cargarCarritoStorage()).toEqual([])

    localStorage.setItem('productos_catalogo', 'invalido{json')
    expect(cargarProductosStorage()).toEqual([])

    espiaLocalStorage.mockRestore()
  })

  // 10. Prueba con mock asincrono vi.fn().mockResolvedValue(...) para servicios de usuario
  it('10. Utiliza un mock asincrono vi.fn().mockResolvedValue para simular consulta de stock y checkout del cliente', async () => {
    // Mock simulando consulta de stock remota
    const servicioStockMock = {
      consultarStock: vi.fn().mockResolvedValue({ codigo: 'GA001', disponible: true, unidades: 8 })
    }

    const resultadoStock = await consultarDisponibilidadStock(servicioStockMock, 'GA001')
    expect(servicioStockMock.consultarStock).toHaveBeenCalledWith('GA001')
    expect(resultadoStock.disponible).toBe(true)
    expect(resultadoStock.unidades).toBe(8)

    // Mock simulando proceso de checkout y creacion de orden
    const servicioCheckoutMock = {
      crearPedido: vi.fn().mockResolvedValue({ exito: true, orderId: 8841, mensaje: 'Pedido recibido' })
    }

    const datosCompra = { cliente: 'Gonzalo', total: 129990, items: ['GA001'] }
    const resultadoCheckout = await procesarCheckoutCliente(servicioCheckoutMock, datosCompra)
    expect(servicioCheckoutMock.crearPedido).toHaveBeenCalledWith(datosCompra)
    expect(resultadoCheckout.exito).toBe(true)
    expect(resultadoCheckout.orderId).toBe(8841)
  })
})

describe('Componentes Complementarios de la Vista del Usuario', () => {
  it('Renderiza correctamente el Footer con mapa, datos de contacto y boton de volver arriba', async () => {
    const usuario = userEvent.setup()
    const scrollToMock = vi.fn()
    window.scrollTo = scrollToMock

    render(<Footer />)

    expect(screen.getByText('Sonido Vivo')).toBeInTheDocument()
    expect(document.getElementById('nosotros')).toBeInTheDocument()
    expect(screen.getByText(/Av. Libertad 1045, Local 4/i)).toBeInTheDocument()
    expect(screen.getByText('+56 32 268 4590')).toBeInTheDocument()
    expect(screen.getByText('+56 9 8452 1198')).toBeInTheDocument()
    expect(screen.getByText('contacto@sonidovivo.cl')).toBeInTheDocument()
    expect(screen.getByTitle(/Ubicación de Tienda Sonido Vivo en Viña del Mar/i)).toBeInTheDocument()

    // Hacer clic en boton volver arriba
    const botonScrollTop = screen.getByTitle(/Volver arriba/i)
    await usuario.click(botonScrollTop)
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })

    // Probar enlace de inicio en footer
    const enlaceInicio = screen.getByRole('link', { name: /Inicio/i })
    await usuario.click(enlaceInicio)
    expect(scrollToMock).toHaveBeenCalled()
  })

  it('Permite navegar en Navbar y el boton Nosotros desplaza hacia el footer #nosotros', async () => {
    const usuario = userEvent.setup()
    const scrollIntoViewMock = vi.fn()
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock

    render(
      <div>
        <Navbar rolActual="cliente" />
        <div id="inicio">Inicio</div>
        <div id="catalogo">Catalogo</div>
        <Footer />
      </div>
    )

    const navbar = screen.getByRole('navigation')
    const botonNosotros = within(navbar).getByRole('link', { name: /Nosotros/i })
    expect(botonNosotros).toHaveAttribute('href', '#nosotros')

    await usuario.click(botonNosotros)
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' })

    const botonCatalogo = within(navbar).getByRole('link', { name: /Catalogo/i })
    await usuario.click(botonCatalogo)
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' })

    const botonInicio = within(navbar).getByRole('link', { name: /Inicio/i })
    await usuario.click(botonInicio)
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('Maneja VistaCliente con prop vacia por defecto y producto con imagen desconocida', () => {
    // Renderizado sin props para cubrir default productos = []
    render(<VistaCliente />)
    expect(screen.getByText(/No se encontraron productos/i)).toBeInTheDocument()

    // Renderizado con id en lugar de codigo para ejercitar rama producto.id y fallback de imagen
    const productoConId = [{ id: 'ITEM_ID_99', categoria: 'Otros', nombre: 'Item Raro', marca: 'X', modelo: 'Y', stock: 1, precio: 1000 }]
    render(<VistaCliente productos={productoConId} />)
    expect(screen.getByText('Item Raro')).toBeInTheDocument()
  })
})

