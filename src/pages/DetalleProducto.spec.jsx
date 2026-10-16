import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import DetalleProducto from './DetalleProducto'
import * as routerDom from 'react-router-dom'
import { cargarCarritoStorage } from '../utils/persistencia'

describe('Página DetalleProducto - Cobertura Completa', () => {
  const productoBase = {
    id: 1,
    codigo: 'GA001',
    nombre: 'Guitarra Acústica Folk',
    marca: 'Yamaha',
    modelo: 'F310',
    categoria: 'Guitarras Acústicas',
    precio: 129990,
    stock: 5,
    descripcion: 'Guitarra de prueba con excelente resonancia.',
    imagen: 'GA001.jpg'
  }

  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('muestra mensaje de producto no encontrado cuando el ID no coincide', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: 'INEXISTENTE' })

    render(
      <MemoryRouter>
        <DetalleProducto productos={[productoBase]} />
      </MemoryRouter>
    )

    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument()
    expect(screen.getByText(/#INEXISTENTE/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /volver a la tienda/i })).toBeInTheDocument()
  })

  it('renderiza correctamente el producto encontrado y sus especificaciones', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: 'GA001' })

    render(
      <MemoryRouter>
        <DetalleProducto productos={[productoBase]} />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Guitarra Acústica Folk' })).toBeInTheDocument()
    expect(screen.getByText('$129.990')).toBeInTheDocument()
    expect(screen.getByText(/Stock: 5 un\./i)).toBeInTheDocument()
    expect(screen.getByText('Yamaha')).toBeInTheDocument()
    expect(screen.getByText('F310')).toBeInTheDocument()
  })

  it('resuelve imagen externa http y data-url correctamente', () => {
    const prodHttp = {
      ...productoBase,
      codigo: 'HTTP01',
      imagen: 'https://ejemplo.com/foto.jpg'
    }
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: 'HTTP01' })

    const { rerender } = render(
      <MemoryRouter>
        <DetalleProducto productos={[prodHttp]} />
      </MemoryRouter>
    )

    const img = screen.getByRole('img', { name: prodHttp.nombre })
    expect(img).toHaveAttribute('src', 'https://ejemplo.com/foto.jpg')

    // Data URL
    const prodDataUrl = {
      ...productoBase,
      codigo: 'DATA01',
      imagen: 'data:image/png;base64,abc'
    }
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: 'DATA01' })

    rerender(
      <MemoryRouter>
        <DetalleProducto productos={[prodDataUrl]} />
      </MemoryRouter>
    )
    expect(screen.getByRole('img', { name: prodDataUrl.nombre })).toHaveAttribute(
      'src',
      'data:image/png;base64,abc'
    )
  })

  it('resuelve imagen vacia cuando no hay imagen ni codigo, y fallback cuando no esta en el glob', () => {
    const prodSinImagen = {
      id: 99,
      codigo: '',
      imagen: '',
      nombre: 'Sin Foto',
      precio: 10000,
      stock: 2,
      categoria: 'Varios'
    }
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: '99' })

    const { rerender } = render(
      <MemoryRouter>
        <DetalleProducto productos={[prodSinImagen]} />
      </MemoryRouter>
    )

    const img = screen.getByRole('img', { name: 'Sin Foto' })
    expect(img.getAttribute('src')).toBeFalsy()

    // Producto con imagen que no existe en el catálogo de assets
    const prodFotoRara = {
      ...productoBase,
      codigo: 'RARA01',
      imagen: 'inexistente_12345.jpg'
    }
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: 'RARA01' })

    rerender(
      <MemoryRouter>
        <DetalleProducto productos={[prodFotoRara]} />
      </MemoryRouter>
    )
    const imgRara = screen.getByRole('img', { name: prodFotoRara.nombre })
    expect(imgRara.getAttribute('src')).toBeTruthy()
  })

  it('permite incrementar y decrementar la cantidad con los botones + y - respetando los limites', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: '1' })

    render(
      <MemoryRouter>
        <DetalleProducto productos={[{ ...productoBase, stock: 3 }]} />
      </MemoryRouter>
    )

    const btnMenos = screen.getByRole('button', { name: '-' })
    const btnMas = screen.getByRole('button', { name: '+' })

    expect(btnMenos).toBeDisabled()
    expect(screen.getByText('1')).toBeInTheDocument()

    // Subir a 2
    await usuario.click(btnMas)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(btnMenos).not.toBeDisabled()

    // Subir a 3 (máximo)
    await usuario.click(btnMas)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(btnMas).toBeDisabled()

    // Bajar a 2
    await usuario.click(btnMenos)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('agrega unidades al carrito, ejecuta callback y persiste en storage', () => {
    vi.useFakeTimers()
    const onAgregarMock = vi.fn()
    const onAbrirCarritoMock = vi.fn()

    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: 'GA001' })

    render(
      <MemoryRouter>
        <DetalleProducto
          productos={[productoBase]}
          onAgregarAlCarrito={onAgregarMock}
          onAbrirCarrito={onAbrirCarritoMock}
        />
      </MemoryRouter>
    )

    // Aumentar a 2 unidades
    const btnMas = screen.getByRole('button', { name: '+' })
    act(() => {
      btnMas.click()
    })

    // Click Agregar al carrito
    const btnAgregar = screen.getByRole('button', { name: /agregar al carrito/i })
    act(() => {
      btnAgregar.click()
    })

    expect(onAgregarMock).toHaveBeenCalledTimes(2)
    expect(onAgregarMock).toHaveBeenCalledWith(productoBase)

    const carrito = cargarCarritoStorage()
    expect(carrito).toHaveLength(2)

    expect(screen.getByText(/Agregaste 2 unidades de "Guitarra Acústica Folk" al carrito\./i)).toBeInTheDocument()

    // Boton "Ver Carrito" en la alerta
    const btnVerCarrito = screen.getByRole('button', { name: /ver carrito/i })
    act(() => {
      btnVerCarrito.click()
    })
    expect(onAbrirCarritoMock).toHaveBeenCalledTimes(1)

    // Al expirar timer se remueve el mensaje
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.queryByText(/Agregaste 2 unidades/i)).not.toBeInTheDocument()
  })

  it('agrega 1 sola unidad mostrando el texto en singular cuando no se pasa onAgregarAlCarrito', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: 'GA001' })

    render(
      <MemoryRouter>
        <DetalleProducto productos={[productoBase]} />
      </MemoryRouter>
    )

    const btnAgregar = screen.getByRole('button', { name: /agregar al carrito/i })
    await usuario.click(btnAgregar)

    expect(screen.getByText(/Agregaste 1 unidad de "Guitarra Acústica Folk" al carrito\./i)).toBeInTheDocument()
  })

  it('maneja producto con stock 0 deshabilitando boton y mostrando "Sin Stock" y "Agotado"', () => {
    const prodSinStock = {
      ...productoBase,
      stock: 0
    }
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: 'GA001' })

    render(
      <MemoryRouter>
        <DetalleProducto productos={[prodSinStock]} />
      </MemoryRouter>
    )

    expect(screen.getByText('Sin Stock')).toBeInTheDocument()
    const btnAgotado = screen.getByRole('button', { name: /agotado/i })
    expect(btnAgotado).toBeDisabled()

    // fireEvent ejecuta el handler onClick incluso en elemento disabled para cubrir la rama de retorno temprano
    fireEvent.click(btnAgotado)
    expect(cargarCarritoStorage()).toHaveLength(0)
  })

  it('muestra valores por defecto en especificaciones tecnicas cuando no estan definidos', () => {
    const prodMinimo = {
      id: 55,
      nombre: 'Item Básico',
      precio: 5000,
      stock: 2,
      categoria: 'Otros'
    }
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: '55' })

    render(
      <MemoryRouter>
        <DetalleProducto productos={[prodMinimo]} />
      </MemoryRouter>
    )

    expect(screen.getByText('PROD-55')).toBeInTheDocument()
    expect(screen.getByText('Genérica')).toBeInTheDocument()
    expect(screen.getByText('Standard')).toBeInTheDocument()
  })

  it('utiliza el catalogo por defecto de productosIniciales si no se pasa la prop productos', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: 'GA001' })

    render(
      <MemoryRouter>
        <DetalleProducto />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 2, name: /Guitarra Ac[uú]stica Folk/i })).toBeInTheDocument()
  })
})
