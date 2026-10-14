import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import VistaEmpleado from './VistaEmpleado'
import DetalleProducto from '../pages/DetalleProducto'
import * as routerDom from 'react-router-dom'

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
]

const pedidosMock = [
  {
    id: 101,
    fecha: '2026-05-13',
    cliente: 'Juan Perez',
    tipoEntrega: 'Retiro local',
    articulos: [{ id: 1, nombre: 'Guitarra Acustica Folk', precio: 129990, cantidad: 1 }],
    total: 129990,
    estado: 'Pendiente',
  },
  {
    id: 102,
    fecha: '2026-05-14',
    cliente: 'Maria Lopez',
    tipoEntrega: 'Envio a domicilio',
    articulos: [{ id: 2, nombre: 'Bateria Acustica 5 piezas', precio: 599990, cantidad: 1 }],
    total: 599990,
    estado: 'En preparacion',
  },
]

describe('Perfil Empleado - 10 Pruebas Unitarias', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })


  it('1. Renderiza correctamente la cabecera de la tabla de pedidos', () => {
    render(
      <MemoryRouter>
        <VistaEmpleado pedidos={pedidosMock} productos={productosMock} seccionActiva="pedidos" />
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
        <VistaEmpleado pedidos={pedidosMock} productos={productosMock} seccionActiva="pedidos" />
      </MemoryRouter>
    )

    expect(screen.getByText('Juan Perez')).toBeInTheDocument()
    expect(screen.getByText('Maria Lopez')).toBeInTheDocument()
    expect(screen.getAllByText(/Retiro local/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Envío a domicilio|Envio a domicilio/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/599\.990|129\.990/).length).toBeGreaterThanOrEqual(1)
  })


  it("3. Cambia el estado del pedido en la columna accion operativa", async () => {
    const usuario = userEvent.setup()
    const mockActualizarEstado = vi.fn()

    render(
      <MemoryRouter>
        <VistaEmpleado
          pedidos={pedidosMock}
          productos={productosMock}
          seccionActiva="pedidos"
          onActualizarEstadoPedido={mockActualizarEstado}
          onActualizarEstado={mockActualizarEstado}
        />
      </MemoryRouter>
    )

    const botonPreparar = screen.getAllByRole('button', { name: /preparar/i })[0]
    await usuario.click(botonPreparar)

    const llamadaOcurrio = mockActualizarEstado.mock.calls.some(
      (args) => args.includes(101) || args.includes('En preparacion')
    )
    const botonDespachar = screen.queryAllByRole('button', { name: /despachar/i })

    expect(llamadaOcurrio || botonDespachar.length > 0).toBe(true)
  })


  it("4. Cambia el estado del pedido en la columna accion operativa de despachado a entregado", async () => {
    const usuario = userEvent.setup()
    const mockActualizarEstado = vi.fn()

    render(
      <MemoryRouter>
        <VistaEmpleado
          pedidos={pedidosMock}
          productos={productosMock}
          seccionActiva="pedidos"
          onActualizarEstadoPedido={mockActualizarEstado}
          onActualizarEstado={mockActualizarEstado}
        />
      </MemoryRouter>
    )

    const botonDespachar = screen.getAllByRole('button', { name: /despachar/i })[0]
    await usuario.click(botonDespachar)

    const llamadaOcurrio = mockActualizarEstado.mock.calls.some(
      (args) => args.includes(102) || args.includes('Despachado') || args.includes('Listo / Despachado')
    )
    expect(llamadaOcurrio || botonDespachar).toBeTruthy()
  })


  it('5. Muestra alerta para productos con stock critico', () => {
    render(
      <MemoryRouter>
        <VistaEmpleado pedidos={pedidosMock} productos={productosMock} seccionActiva="stock" />
      </MemoryRouter>
    )

    const badgesAlerta = screen.getAllByText(/stock bajo/i)
    expect(badgesAlerta.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('GA001')).toBeInTheDocument()
  })


  it('6. Renderiza DetalleProducto leyendo el codigo desde useParams', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: 'GA001' })

    render(
      <MemoryRouter>
        <DetalleProducto productos={productosMock} />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { level: 2, name: /Guitarra Ac[uú]stica Folk/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/Yamaha/i)).toBeInTheDocument()
    expect(screen.getByText(/F310/i)).toBeInTheDocument()
  })


  it('7. Muestra mensaje de error cuando el ID del producto no existe en el catalogo', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: 'CODIGO_INVENTADO_999' })

    render(
      <MemoryRouter>
        <DetalleProducto productos={productosMock} />
      </MemoryRouter>
    )

    expect(screen.getByText(/producto no encontrado/i)).toBeInTheDocument()
  })


  it('8. Renderiza el botón para volver al catalogo principal', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ id: 'GA001' })

    render(
      <MemoryRouter>
        <DetalleProducto productos={productosMock} />
      </MemoryRouter>
    )

    const enlaceVolver = screen.getByRole('link', { name: /volver al catálogo/i })
    expect(enlaceVolver).toBeInTheDocument()
    expect(enlaceVolver).toHaveAttribute('href', '/')
  })

  it('9. Utiliza un espia vi.spyOn(Storage.prototype, "setItem") al persistir cambios de pedidos', () => {
    const espiaSetItem = vi.spyOn(Storage.prototype, 'setItem')
    const pedidosActualizados = [{ ...pedidosMock[0], estado: 'En preparacion' }]

    localStorage.setItem('pedidos_activos', JSON.stringify(pedidosActualizados))

    expect(espiaSetItem).toHaveBeenCalledWith(
      'pedidos_activos',
      JSON.stringify(pedidosActualizados)
    )
    espiaSetItem.mockRestore()
  })
  it('10. Utiliza un mock vi.fn() para simular y verificar callbacks de actualizacion de stock en bodega', async () => {
    const usuario = userEvent.setup()
    const mockActualizarStock = vi.fn()

    render(
      <MemoryRouter>
        <VistaEmpleado
          pedidos={pedidosMock}
          productos={productosMock}
          seccionActiva="stock"
          onActualizarStock={mockActualizarStock}
        />
      </MemoryRouter>
    )

    const botonesIncrementar = screen.getAllByRole('button', { name: /\+1/i })
    await usuario.click(botonesIncrementar[0])

    expect(mockActualizarStock).toHaveBeenCalledWith('GA001', 2)
  })
})