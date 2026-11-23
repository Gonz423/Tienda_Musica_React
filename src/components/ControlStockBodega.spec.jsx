import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ControlStockBodega from './ControlStockBodega'

const productosApi = [
  { id: 1, codigo: 'GA001', nombre: 'Guitarra Acustica Folk', categoria: 'Guitarras', stock: 2, precio: 1 },
  { id: 2, codigo: 'BT001', nombre: 'Bateria Acustica', categoria: 'Baterias', stock: 10, precio: 1 },
  { id: 3, codigo: 'AC001', nombre: 'Afinador Clip', categoria: 'Accesorios', stock: 3, precio: 1 }
]

function respuesta(status, body) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body))
  })
}

const renderizar = (props = {}) =>
  render(
    <MemoryRouter>
      <ControlStockBodega {...props} />
    </MemoryRouter>
  )

describe('ControlStockBodega - producto-service', () => {
  let fetchMock

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'jwt-vendedor')
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('lista productos y marca con badge los de stock crítico (<= 3)', async () => {
    fetchMock.mockReturnValueOnce(respuesta(200, productosApi))
    renderizar()

    expect(screen.getByText(/Cargando inventario/i)).toBeInTheDocument()
    expect(await screen.findByText('Guitarra Acustica Folk')).toBeInTheDocument()

    expect(screen.getAllByText('Stock crítico')).toHaveLength(2)
    expect(screen.getByText(/stock crítico \(≤ 3\): 2/i)).toBeInTheDocument()
  })

  it('ajusta stock con PATCH /productos/{id}/stock y sincroniza el callback', async () => {
    const usuario = userEvent.setup()
    const onActualizarStock = vi.fn()
    fetchMock
      .mockReturnValueOnce(respuesta(200, productosApi))
      .mockReturnValueOnce(respuesta(200, { ...productosApi[0], stock: 3 }))
    renderizar({ onActualizarStock })
    await screen.findByText('Guitarra Acustica Folk')

    await usuario.click(screen.getByRole('button', { name: /Sumar 1 unidad a Guitarra/i }))

    expect(await screen.findByText(/Stock actual: 3/i)).toBeInTheDocument()
    const [url, opciones] = fetchMock.mock.calls[1]
    expect(url).toMatch(/\/productos\/1\/stock$/)
    expect(opciones.method).toBe('PATCH')
    expect(opciones.headers.Authorization).toBe('Bearer jwt-vendedor')
    expect(JSON.parse(opciones.body)).toMatchObject({ cantidad: 1 })
    expect(onActualizarStock).toHaveBeenCalledWith('GA001', 3)
  })

  it('permite un ajuste personalizado negativo', async () => {
    const usuario = userEvent.setup()
    fetchMock
      .mockReturnValueOnce(respuesta(200, productosApi))
      .mockReturnValueOnce(respuesta(200, { ...productosApi[1], stock: 5 }))
    renderizar()
    await screen.findByText('Bateria Acustica')

    const fila = screen.getByText('Bateria Acustica').closest('tr')
    await usuario.type(within(fila).getByLabelText(/Cantidad a ajustar/i), '-5')
    await usuario.click(within(fila).getByRole('button', { name: /Aplicar/i }))

    expect(await screen.findByText(/reducido en 5/i)).toBeInTheDocument()
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({ cantidad: -5 })
  })

  it('muestra el mensaje del backend ante un error 400', async () => {
    const usuario = userEvent.setup()
    fetchMock
      .mockReturnValueOnce(respuesta(200, productosApi))
      .mockReturnValueOnce(respuesta(400, { error: 'No se permite stock negativo.' }))
    renderizar()
    await screen.findByText('Guitarra Acustica Folk')

    await usuario.click(screen.getByRole('button', { name: /Restar 1 unidad a Guitarra/i }))

    expect(await screen.findByText('No se permite stock negativo.')).toBeInTheDocument()
    expect(screen.getByText('Error 400')).toBeInTheDocument()
  })

  it('muestra error 500 al cargar y permite reintentar', async () => {
    const usuario = userEvent.setup()
    fetchMock
      .mockReturnValueOnce(respuesta(500))
      .mockReturnValueOnce(respuesta(200, productosApi))
    renderizar()

    expect(await screen.findByText(/Error interno/i)).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: /Reintentar/i }))
    expect(await screen.findByText('Guitarra Acustica Folk')).toBeInTheDocument()
  })

  it('filtra solo los productos con stock crítico', async () => {
    const usuario = userEvent.setup()
    fetchMock.mockReturnValueOnce(respuesta(200, productosApi))
    renderizar()
    await screen.findByText('Bateria Acustica')

    await usuario.click(screen.getByRole('switch', { name: /Solo stock crítico/i }))
    expect(screen.queryByText('Bateria Acustica')).not.toBeInTheDocument()
    expect(screen.getByText('Afinador Clip')).toBeInTheDocument()
  })
})
