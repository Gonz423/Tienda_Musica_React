import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  guardarProductoStorage,
  cargarProductosStorage,
  guardarCarritoStorage,
  cargarCarritoStorage,
  calcularTotalPedido,
  avanzarEstadoPedido,
  esStockCritico,
  ajustarStock,
  guardarUsuariosStorage,
  cargarUsuariosStorage
} from './persistencia'

describe('Utilidades de Persistencia y Negocio', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  // Productos Storage
  it('guarda y carga productos desde localStorage correctamente', () => {
    const productos = [{ codigo: 'GA001', nombre: 'Guitarra Acústica' }]
    guardarProductoStorage(productos)

    const recuperados = cargarProductosStorage()
    expect(recuperados).toEqual(productos)
  })

  it('cargarProductosStorage retorna arreglo vacio si no hay datos', () => {
    expect(cargarProductosStorage()).toEqual([])
  })

  it('cargarProductosStorage retorna arreglo vacio si ocurre un error de parseo JSON', () => {
    localStorage.setItem('productos_catalogo', 'JSON_INVALIDO{{{')
    expect(cargarProductosStorage()).toEqual([])
  })

  // Carrito Storage
  it('guarda y carga carrito desde localStorage correctamente', () => {
    const carrito = [{ codigo: 'BA001', precio: 200000 }]
    guardarCarritoStorage(carrito)

    const recuperado = cargarCarritoStorage()
    expect(recuperado).toEqual(carrito)
  })

  it('cargarCarritoStorage retorna arreglo vacio si no hay datos', () => {
    expect(cargarCarritoStorage()).toEqual([])
  })

  it('cargarCarritoStorage retorna arreglo vacio si ocurre un error de parseo JSON', () => {
    localStorage.setItem('carrito_compras', 'INVALID_JSON_DATA')
    expect(cargarCarritoStorage()).toEqual([])
  })

  // Usuarios Storage
  it('guarda y carga usuarios desde localStorage correctamente', () => {
    const usuarios = [{ id: 'USR-01', nombre: 'Admin' }]
    guardarUsuariosStorage(usuarios)

    const recuperados = cargarUsuariosStorage()
    expect(recuperados).toEqual(usuarios)
  })

  it('cargarUsuariosStorage retorna fallback si no hay datos o por defecto arreglo vacio', () => {
    const fallback = [{ id: 'DEFAULT' }]
    expect(cargarUsuariosStorage(fallback)).toEqual(fallback)
    expect(cargarUsuariosStorage()).toEqual([])
  })

  it('cargarUsuariosStorage retorna fallback si ocurre un error en JSON.parse', () => {
    localStorage.setItem('usuarios_sistema', '{error')
    const fallback = [{ id: 'FALLBACK' }]
    expect(cargarUsuariosStorage(fallback)).toEqual(fallback)
  })

  // calcularTotalPedido
  it('calcularTotalPedido calcula la suma considerando precio y cantidad', () => {
    const articulos = [
      { precio: 10000, cantidad: 2 },
      { precio: 5000 } // sin cantidad explicita, usa fallback 1
    ]
    expect(calcularTotalPedido(articulos)).toBe(25000)
  })

  it('calcularTotalPedido retorna 0 para articulos vacios o no arreglos', () => {
    expect(calcularTotalPedido([])).toBe(0)
    expect(calcularTotalPedido(null)).toBe(0)
    expect(calcularTotalPedido()).toBe(0)
    expect(calcularTotalPedido('no-array')).toBe(0)
  })

  // avanzarEstadoPedido
  it('avanzarEstadoPedido avanza correctamente el flujo de estados', () => {
    expect(avanzarEstadoPedido('Pendiente')).toBe('En preparacion')
    expect(avanzarEstadoPedido('En preparacion')).toBe('Listo / Despachado')
    expect(avanzarEstadoPedido('Listo / Despachado')).toBe('Completado')
    expect(avanzarEstadoPedido('Completado')).toBe('Completado')
    expect(avanzarEstadoPedido('Cancelado')).toBe('Cancelado')
  })

  // esStockCritico
  it('esStockCritico retorna true si el stock es menor a 3, y false en caso contrario', () => {
    expect(esStockCritico(0)).toBe(true)
    expect(esStockCritico(2)).toBe(true)
    expect(esStockCritico('2')).toBe(true)
    expect(esStockCritico(3)).toBe(false)
    expect(esStockCritico(10)).toBe(false)
  })

  // ajustarStock
  it('ajustarStock calcula el stock ajustado y previene valores negativos', () => {
    expect(ajustarStock(5, 3)).toBe(8)
    expect(ajustarStock(5, -2)).toBe(3)
    expect(ajustarStock(2, -5)).toBe(0) // no baja de cero
  })
})
