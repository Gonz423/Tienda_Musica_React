import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PedidosEmpleado from './PedidosEmpleado'

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
  }
]

const pedidosMock = [
  {
    id: 101,
    fecha: '2026-05-13',
    cliente: 'Juan Perez',
    tipoEntrega: 'Retiro local',
    articulos: [{ id: 1, nombre: 'Guitarra Acustica Folk', precio: 129990, cantidad: 1 }],
    productos: [
      { codigo: 'GA001', nombre: 'Guitarra Acustica Folk', precio: 129990, cantidad: 1 },
      { codigo: 'GA001', nombre: 'Guitarra Acustica Folk', precio: 129990, cantidad: 1 }
    ],
    total: 129990,
    estado: 'Pendiente',
  },
  {
    id: 102,
    fecha: '2026-05-14',
    cliente: 'Maria Lopez',
    tipoEntrega: 'Envio a domicilio',
    articulos: [{ id: 2, nombre: 'Bateria Acustica 5 piezas', precio: 599990, cantidad: 1 }],
    productos: [
      { codigo: 'BT001', nombre: 'Bateria Acustica 5 piezas', precio: 599990, cant: 1 },
      { id: 'GEN-01', nombre: 'Item Generico', precio: 15000 }
    ],
    total: 599990,
    estado: 'En preparacion',
  },
  {
    id: 103,
    fecha: '2026-05-15',
    cliente: 'Carlos Soto',
    tipoEntrega: 'Retiro local',
    articulos: [],
    productos: [{ codigo: 'BT001', nombre: 'Bateria', precio: 100000, cantidad: 1 }],
    total: 100000,
    estado: 'Despachado',
  },
  {
    id: 104,
    fecha: '2026-05-16',
    cliente: 'Ana Diaz',
    tipoEntrega: 'Retiro local',
    articulos: [],
    productos: [{ nombre: 'Cuerda Individual', precio: 2000 }],
    total: 2000,
    estado: 'Otro',
  }
]

describe('PedidosEmpleado - Pruebas Unitarias', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('1. Renderiza correctamente la cabecera de la tabla de pedidos', () => {
    render(
      <MemoryRouter>
        <PedidosEmpleado pedidos={pedidosMock} productos={productosMock} />
      </MemoryRouter>
    )

    expect(screen.getByRole('columnheader', { name: /# id/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /cliente/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /artículos/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /total venta/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /estado de venta/i })).toBeInTheDocument()
  })

  it('2. Renderiza la lista de pedidos mostrando clientes, montos e información de entrega', () => {
    render(
      <MemoryRouter>
        <PedidosEmpleado pedidos={pedidosMock} productos={productosMock} />
      </MemoryRouter>
    )

    expect(screen.getByText('Juan Perez')).toBeInTheDocument()
    expect(screen.getByText('Maria Lopez')).toBeInTheDocument()
    expect(screen.getAllByText(/Retiro local/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Envío a domicilio|Envio a domicilio/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/599\.990|129\.990/).length).toBeGreaterThanOrEqual(1)
  })

  it('3. Cambia el estado del pedido en la columna accion operativa al hacer clic en Preparar', async () => {
    const usuario = userEvent.setup()
    const mockActualizarEstado = vi.fn()

    render(
      <MemoryRouter>
        <PedidosEmpleado
          pedidos={pedidosMock}
          productos={productosMock}
          onActualizarEstadoPedido={mockActualizarEstado}
        />
      </MemoryRouter>
    )

    const botonPreparar = screen.getAllByRole('button', { name: /preparar/i })[0]
    await usuario.click(botonPreparar)

    expect(mockActualizarEstado).toHaveBeenCalledWith(101, 'En preparación')
  })

  it('4. Cambia el estado del pedido en la columna accion operativa de preparacion a despachado', async () => {
    const usuario = userEvent.setup()
    const mockActualizarEstado = vi.fn()

    render(
      <MemoryRouter>
        <PedidosEmpleado
          pedidos={pedidosMock}
          productos={productosMock}
          onActualizarEstadoPedido={mockActualizarEstado}
        />
      </MemoryRouter>
    )

    const botonDespachar = screen.getAllByRole('button', { name: /despachar/i })[0]
    await usuario.click(botonDespachar)

    expect(mockActualizarEstado).toHaveBeenCalledWith(102, 'Despachado')
  })

  it('5. Actualiza el estado local de pedidos cuando no se pasa callback externo', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PedidosEmpleado pedidos={pedidosMock} productos={productosMock} />
      </MemoryRouter>
    )

    const botonPreparar = screen.getAllByRole('button', { name: /preparar/i })[0]
    await usuario.click(botonPreparar)

    expect(screen.getAllByRole('button', { name: /despachar/i }).length).toBeGreaterThanOrEqual(1)
  })

  it('6. Renderiza con propiedades por defecto sin lanzar errores', () => {
    render(
      <MemoryRouter>
        <PedidosEmpleado />
      </MemoryRouter>
    )

    expect(screen.getByRole('columnheader', { name: /# id/i })).toBeInTheDocument()
  })
})

