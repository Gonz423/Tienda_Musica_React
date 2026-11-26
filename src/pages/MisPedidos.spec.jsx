import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import MisPedidos from './MisPedidos'

const pedidosDemo = [
  {
    id: 7,
    codigoPedido: 'PED-AB12CD34',
    fecha: '2026-11-26',
    direccion: 'Av. Libertad 450, Viña del Mar',
    total: 209980,
    estado: 'Despachado',
    productos: [
      { productoId: 1, nombre: 'Guitarra Acústica Folk', cantidad: 1, precio: 129990 },
      { productoId: 5, nombre: 'Guitarra 3/4 Niños', cantidad: 1, precio: 79990 }
    ]
  },
  {
    id: 3,
    codigoPedido: 'PED-0000AAAA',
    fecha: '2026-11-20',
    direccion: 'Calle Valparaíso 100',
    total: 89990,
    estado: 'Cancelado',
    productos: [{ productoId: 3, nombre: 'Guitarra Acústica Clásica 4/4', cantidad: 1, precio: 89990 }]
  }
]

const renderizar = (cargarPedidos) =>
  render(
    <MemoryRouter>
      <MisPedidos cargarPedidos={cargarPedidos} />
    </MemoryRouter>
  )

describe('MisPedidos - historial de compras del cliente', () => {
  it('muestra los pedidos del cliente con su estado, productos y total', async () => {
    const cargar = vi.fn().mockResolvedValue(pedidosDemo)
    renderizar(cargar)

    const tarjetas = await screen.findAllByTestId('tarjeta-pedido')
    expect(cargar).toHaveBeenCalledTimes(1)
    expect(tarjetas).toHaveLength(2)

    const primera = within(tarjetas[0])
    expect(primera.getByText(/PED-AB12CD34/)).toBeInTheDocument()
    expect(primera.getAllByText('Despachado').length).toBeGreaterThan(0)
    expect(primera.getByText('Guitarra Acústica Folk')).toBeInTheDocument()
    expect(primera.getByText(/Total:/)).toHaveTextContent('209.980')
  })

  it('marca las etapas completadas del seguimiento y avisa si el pedido fue cancelado', async () => {
    renderizar(vi.fn().mockResolvedValue(pedidosDemo))
    const tarjetas = await screen.findAllByTestId('tarjeta-pedido')

    const pasoActual = within(tarjetas[0]).getByRole('listitem', { current: 'step' })
    expect(pasoActual).toHaveTextContent('Despachado')
    expect(within(tarjetas[1]).getByText(/pedido cancelado/i)).toBeInTheDocument()
  })

  it('muestra un mensaje y acceso al catálogo cuando no hay pedidos', async () => {
    renderizar(vi.fn().mockResolvedValue([]))
    expect(await screen.findByTestId('mis-pedidos-vacio')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ir al catálogo/i })).toBeInTheDocument()
  })

  it('muestra el error del backend y permite reintentar', async () => {
    const cargar = vi.fn()
      .mockRejectedValueOnce(new Error('Tu sesión expiró. Inicia sesión nuevamente.'))
      .mockResolvedValueOnce(pedidosDemo)
    renderizar(cargar)

    expect(await screen.findByRole('alert')).toHaveTextContent(/sesión expiró/i)
    await userEvent.click(screen.getByRole('button', { name: /actualizar/i }))
    expect(await screen.findAllByTestId('tarjeta-pedido')).toHaveLength(2)
    expect(cargar).toHaveBeenCalledTimes(2)
  })
})
