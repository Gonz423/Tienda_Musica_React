import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import StockEmpleado from './StockEmpleado'

const productosMock = [
  {
    codigo: 'GA001',
    id: 1,
    nombre: 'Guitarra Acustica Folk',
    marca: 'Yamaha',
    modelo: 'F310',
    categoria: 'Guitarras Acusticas',
    precio: 129990,
    stock: 1,
    descripcion: 'Tapa de abeto ideal para principiantes.',
  },
  {
    codigo: 'BT001',
    id: 2,
    nombre: 'Bateria Acustica 5 piezas',
    marca: 'Pearl',
    modelo: 'Roadshow',
    categoria: 'Baterias',
    precio: 599990,
    stock: 6,
    descripcion: 'Set completo con atriles.',
  },
  {
    codigo: 'AC001',
    nombre: 'Afinador Clip',
    marca: 'Korg',
    modelo: 'Clip-on',
    categoria: 'Accesorios',
    precio: 15990,
    stock: 0,
    descripcion: 'Afinador de prueba agotado.'
  }
]

describe('StockEmpleado - Pruebas Unitarias', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('1. Muestra alerta de badge para productos con stock critico menor a 3', () => {
    render(
      <MemoryRouter>
        <StockEmpleado productos={productosMock} />
      </MemoryRouter>
    )

    const badgesAlerta = screen.getAllByText(/stock bajo/i)
    expect(badgesAlerta.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('GA001')).toBeInTheDocument()
  })

  it('2. Utiliza un mock vi.fn() para simular y verificar callbacks de actualizacion de stock en bodega', async () => {
    const usuario = userEvent.setup()
    const mockActualizarStock = vi.fn()

    render(
      <MemoryRouter>
        <StockEmpleado
          productos={productosMock}
          onActualizarStock={mockActualizarStock}
        />
      </MemoryRouter>
    )

    const botonesIncrementar = screen.getAllByRole('button', { name: /\+1/i })
    await usuario.click(botonesIncrementar[0])

    expect(mockActualizarStock).toHaveBeenCalledWith('GA001', 2)
  })

  it('3. Decrementa el stock utilizando el botón -1 y respeta el límite inferior de cero', async () => {
    const usuario = userEvent.setup()
    const mockActualizarStock = vi.fn()

    render(
      <MemoryRouter>
        <StockEmpleado
          productos={productosMock}
          onActualizarStock={mockActualizarStock}
        />
      </MemoryRouter>
    )

    const botonesDecrementar = screen.getAllByRole('button', { name: /-1/i })
    await usuario.click(botonesDecrementar[0])

    expect(mockActualizarStock).toHaveBeenCalledWith('GA001', 0)
    expect(botonesDecrementar[2]).toBeDisabled()
  })

  it('4. Actualiza el stock local cuando no se proporciona callback externo', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <StockEmpleado productos={productosMock} />
      </MemoryRouter>
    )

    const botonesIncrementar = screen.getAllByRole('button', { name: /\+1/i })
    await usuario.click(botonesIncrementar[0])

    expect(screen.getByRole('cell', { name: '2' })).toBeInTheDocument()
  })

  it('5. Renderiza correctamente con propiedades por defecto', () => {
    render(
      <MemoryRouter>
        <StockEmpleado />
      </MemoryRouter>
    )

    expect(screen.getByText(/Control de Stock e Inventario/i)).toBeInTheDocument()
  })
})
