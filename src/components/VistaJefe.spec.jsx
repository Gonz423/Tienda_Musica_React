import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VistaJefe from './VistaJefe'
import { guardarProductoStorage, cargarProductosStorage } from '../utils/persistencia'
import { cargarMetricasAsincronas, guardarProductoRemoto } from '../services/jefeServicio'

describe('Perfil Jefe - Guía 14: 10 Pruebas Unitarias', () => {
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

  const pedidosPrueba = [
    { id: 101, cliente: 'Juan Perez', total: 120000, estado: 'Despachado', fecha: '2026-10-09' },
    { id: 102, cliente: 'Ana Gomez', total: 80000, estado: 'Pendiente', fecha: '2026-10-10' }
  ]

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  // 1. Prueba de renderizado de las tarjetas KPI en la Vista de Jefe (ventas, pedidos, stock critico)
  it('1. Renderiza correctamente las tarjetas de resumen KPI (ventas, pedidos y stock critico)', () => {
    render(<VistaJefe productos={productosPrueba} pedidos={pedidosPrueba} seccionActiva="metricas" />)

    expect(screen.getByText(/Total Ventas Acumuladas/i)).toBeInTheDocument()
    expect(screen.getByText(/Flujo de Pedidos/i)).toBeInTheDocument()
    expect(screen.getByText(/Productos Stock Crítico/i)).toBeInTheDocument()
  })

  // 2. Prueba del calculo correcto del total de ventas acumuladas a partir de pedidos
  it('2. Calcula correctamente el total acumulado de ventas sumando los pedidos', () => {
    render(<VistaJefe productos={productosPrueba} pedidos={pedidosPrueba} seccionActiva="metricas" />)

    // 120000 + 80000 = 200000 en formato chileno ($200.000)
    expect(screen.getByText('$200.000')).toBeInTheDocument()
    expect(screen.getByText(/2 pedidos totales/i)).toBeInTheDocument()
  })

  // 3. Prueba del calculo de cantidad de productos con stock critico (<= 3 unidades)
  it('3. Calcula correctamente la cantidad de productos con stock critico (<= 3 unidades)', () => {
    render(<VistaJefe productos={productosPrueba} pedidos={pedidosPrueba} seccionActiva="metricas" />)

    // Solo GA001 tiene stock <= 3 (tiene 2), GA002 tiene 8
    const badgeCritico = screen.getByText('Stock ≤ 3 unidades')
    expect(badgeCritico).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: '1' })).toBeInTheDocument()
  })

  // 4. Prueba de renderizado del formulario de gestion de productos con todos sus inputs
  it('4. Renderiza el formulario de gestion de productos con todos los campos requeridos', () => {
    render(<VistaJefe productos={productosPrueba} pedidos={[]} seccionActiva="productos" />)

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

  // 5. Prueba de actualizacion del estado al escribir en los inputs (nombre, precio, stock, etc.)
  it('5. Actualiza el estado reactivo al ingresar datos en los campos del formulario', async () => {
    const usuario = userEvent.setup()
    render(<VistaJefe productos={productosPrueba} pedidos={[]} seccionActiva="productos" />)

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

  // 6. Prueba de validacion que bloquea envio y muestra invalid-feedback cuando los campos estan vacios
  it('6. Bloquea el envio y muestra clases is-invalid e invalid-feedback cuando los campos estan vacios', async () => {
    const usuario = userEvent.setup()
    const onAgregarProductoMock = vi.fn()
    render(
      <VistaJefe
        productos={productosPrueba}
        pedidos={[]}
        onAgregarProducto={onAgregarProductoMock}
        seccionActiva="productos"
      />
    )

    await usuario.click(screen.getByRole('button', { name: /Guardar Producto/i }))

    expect(onAgregarProductoMock).not.toHaveBeenCalled()
    expect(screen.getByText('El código es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('La marca es obligatoria')).toBeInTheDocument()
    expect(screen.getByText('El modelo es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('La descripción es obligatoria')).toBeInTheDocument()
  })

  // 7. Prueba de validacion que rechaza precios negativos o no numericos
  it('7. Rechaza precios invalidos o negativos mostrando el error correspondiente', async () => {
    const usuario = userEvent.setup()
    const onAgregarProductoMock = vi.fn()
    render(
      <VistaJefe
        productos={productosPrueba}
        pedidos={[]}
        onAgregarProducto={onAgregarProductoMock}
        seccionActiva="productos"
      />
    )

    await usuario.type(screen.getByLabelText(/Código/i), 'BA001')
    await usuario.type(screen.getByLabelText(/Nombre/i), 'Bajo Activo')
    await usuario.type(screen.getByLabelText(/Marca/i), 'Ibanez')
    await usuario.type(screen.getByLabelText(/Modelo/i), 'GSR200')
    await usuario.type(screen.getByLabelText(/Descripción/i), 'Bajo de 4 cuerdas activo')
    await usuario.type(screen.getByLabelText(/Stock/i), '4')
    await usuario.type(screen.getByLabelText(/Precio/i), '-500')

    await usuario.click(screen.getByRole('button', { name: /Guardar Producto/i }))

    expect(onAgregarProductoMock).not.toHaveBeenCalled()
    expect(screen.getByText('El precio debe ser mayor a 0')).toBeInTheDocument()
  })

  // 8. Prueba de envio exitoso (onSubmit con preventDefault) agregando y editando producto
  it('8. Permite el envio exitoso del formulario (alta y edicion) ejecutando las funciones correspondientes', async () => {
    const usuario = userEvent.setup()
    const onAgregarProductoMock = vi.fn()
    const onActualizarProductoMock = vi.fn()
    render(
      <VistaJefe
        productos={productosPrueba}
        pedidos={[]}
        onAgregarProducto={onAgregarProductoMock}
        onActualizarProducto={onActualizarProductoMock}
        seccionActiva="productos"
      />
    )

    await usuario.type(screen.getByLabelText(/Código/i), 'BT001')
    await usuario.type(screen.getByLabelText(/Nombre/i), 'Batería Electrónica')
    await usuario.type(screen.getByLabelText(/Marca/i), 'Roland')
    await usuario.type(screen.getByLabelText(/Modelo/i), 'TD-02K')
    await usuario.type(screen.getByLabelText(/Precio/i), '349990')
    await usuario.type(screen.getByLabelText(/Stock/i), '5')
    await usuario.type(screen.getByLabelText(/Descripción/i), 'Bateria electronica compacta con pads mesh')

    await usuario.click(screen.getByRole('button', { name: /Guardar Producto/i }))

    expect(onAgregarProductoMock).toHaveBeenCalledTimes(1)
    expect(onAgregarProductoMock).toHaveBeenCalledWith(
      expect.objectContaining({
        codigo: 'BT001',
        nombre: 'Batería Electrónica',
        marca: 'Roland',
        modelo: 'TD-02K',
        precio: 349990,
        stock: 5,
        descripcion: 'Bateria electronica compacta con pads mesh'
      })
    )
    expect(screen.getByText(/agregado con éxito/i)).toBeInTheDocument()

    // Prueba de edicion de producto existente (cargar en formulario y actualizar)
    const botonesEditar = screen.getAllByTitle(/Editar producto/i)
    await usuario.click(botonesEditar[0])
    expect(screen.getByText(/Editar Producto \(GA001\)/i)).toBeInTheDocument()

    const inputStock = screen.getByLabelText(/Stock/i)
    await usuario.clear(inputStock)
    await usuario.type(inputStock, '10')

    await usuario.click(screen.getByRole('button', { name: /Actualizar Producto/i }))
    expect(onActualizarProductoMock).toHaveBeenCalledWith(
      expect.objectContaining({
        codigo: 'GA001',
        stock: 10
      })
    )
  })

  // 9. Prueba con espia vi.spyOn(Storage.prototype, 'setItem') al persistir el nuevo producto en localStorage
  it('9. Utiliza un espia vi.spyOn para verificar la persistencia del producto en localStorage', async () => {
    const usuario = userEvent.setup()
    const espiaLocalStorage = vi.spyOn(Storage.prototype, 'setItem')
    const onAgregarProductoMock = vi.fn()

    render(
      <VistaJefe
        productos={productosPrueba}
        pedidos={[]}
        onAgregarProducto={onAgregarProductoMock}
        seccionActiva="productos"
      />
    )

    await usuario.type(screen.getByLabelText(/Código/i), 'TC001')
    await usuario.type(screen.getByLabelText(/Nombre/i), 'Teclado Digital')
    await usuario.type(screen.getByLabelText(/Marca/i), 'Casio')
    await usuario.type(screen.getByLabelText(/Modelo/i), 'CT-S300')
    await usuario.type(screen.getByLabelText(/Precio/i), '149990')
    await usuario.type(screen.getByLabelText(/Stock/i), '3')
    await usuario.type(screen.getByLabelText(/Descripción/i), 'Teclado con teclas sensitivas')

    await usuario.click(screen.getByRole('button', { name: /Guardar Producto/i }))

    expect(espiaLocalStorage).toHaveBeenCalledWith(
      'productos_catalogo',
      expect.stringContaining('TC001')
    )

    // Tambien probamos la funcion utilitaria de persistencia directamente
    guardarProductoStorage([{ codigo: 'TEST01', nombre: 'Test' }])
    expect(espiaLocalStorage).toHaveBeenCalledWith(
      'productos_catalogo',
      JSON.stringify([{ codigo: 'TEST01', nombre: 'Test' }])
    )
    const datosRecuperados = cargarProductosStorage()
    expect(datosRecuperados).toEqual([{ codigo: 'TEST01', nombre: 'Test' }])

    espiaLocalStorage.mockRestore()
  })

  // 10. Prueba con mock asincrono vi.fn().mockResolvedValue(...) simulando guardado de datos o carga de metricas
  it('10. Utiliza un mock asincrono vi.fn().mockResolvedValue para simular la carga de metricas y guardado remoto', async () => {
    // Mock simulando servicio de metricas del backend
    const servicioMetricasMock = {
      obtenerMetricas: vi.fn().mockResolvedValue({
        totalVentas: 850000,
        pedidosTotales: 15,
        stockCritico: 3
      })
    }

    const resultadoMetricas = await cargarMetricasAsincronas(servicioMetricasMock)
    expect(servicioMetricasMock.obtenerMetricas).toHaveBeenCalledTimes(1)
    expect(resultadoMetricas.totalVentas).toBe(850000)
    expect(resultadoMetricas.pedidosTotales).toBe(15)

    // Mock simulando guardado remoto asincrono en API
    const servicioRemotoMock = {
      guardar: vi.fn().mockResolvedValue({ exito: true, id: 999 })
    }

    const resultadoGuardado = await guardarProductoRemoto(servicioRemotoMock, { codigo: 'TEST99' })
    expect(servicioRemotoMock.guardar).toHaveBeenCalledTimes(1)
    expect(resultadoGuardado.exito).toBe(true)
  })

  // Pruebas anadidas para el nuevo apartado de Gestion de Usuarios
  describe('Gestión de Usuarios en Vista Jefe', () => {
    const usuariosPrueba = [
      {
        id: 'USR-001',
        nombre: 'Admin Principal',
        email: 'admin@sonidovivo.cl',
        password: 'pass',
        rol: 'jefe',
        activo: true,
        fechaCreacion: '2026-09-01',
        historial: [
          { id: 1, fecha: '2026-09-01 10:00', accion: 'Creación de cuenta', detalle: 'Cuenta creada como Jefe' }
        ]
      },
      {
        id: 'USR-002',
        nombre: 'Pedro Cliente',
        email: 'pedro@cliente.cl',
        password: 'pass',
        rol: 'cliente',
        activo: false,
        fechaCreacion: '2026-09-05',
        historial: [
          { id: 1, fecha: '2026-09-05 12:00', accion: 'Creación de cuenta', detalle: 'Cuenta cliente' },
          { id: 2, fecha: '2026-09-10 15:00', accion: 'Desactivación', detalle: 'Cuenta suspendida' }
        ]
      }
    ]

    it('11. Renderiza la sección de Gestión de Usuarios, directorio y KPIs de usuarios', () => {
      render(
        <VistaJefe
          productos={productosPrueba}
          pedidos={pedidosPrueba}
          usuarios={usuariosPrueba}
          seccionActiva="usuarios"
        />
      )

      expect(screen.getByRole('heading', { level: 1, name: /Gestión de Usuarios/i })).toBeInTheDocument()
      expect(screen.getByText('Directorio de Usuarios (2)')).toBeInTheDocument()
      expect(screen.getByText('Admin Principal')).toBeInTheDocument()
      expect(screen.getByText('pedro@cliente.cl')).toBeInTheDocument()
    })

    it('12. Permite alternar el estado (activar / desactivar) de un usuario', async () => {
      const usuario = userEvent.setup()
      const onAlternarEstadoMock = vi.fn()

      render(
        <VistaJefe
          productos={productosPrueba}
          pedidos={pedidosPrueba}
          usuarios={usuariosPrueba}
          onAlternarEstadoUsuario={onAlternarEstadoMock}
          seccionActiva="usuarios"
        />
      )

      const btnDesactivar = screen.getByTitle('Desactivar usuario')
      await usuario.click(btnDesactivar)

      expect(onAlternarEstadoMock).toHaveBeenCalledWith('USR-001')
    })

    it('13. Abre el modal de historial y muestra los eventos registrados', async () => {
      const usuario = userEvent.setup()

      render(
        <VistaJefe
          productos={productosPrueba}
          pedidos={pedidosPrueba}
          usuarios={usuariosPrueba}
          seccionActiva="usuarios"
        />
      )

      const btnsHistorial = screen.getAllByTitle('Ver historial de actividad')
      await usuario.click(btnsHistorial[1]) // Pedro Cliente

      expect(screen.getByText(/Historial de Auditoría: Pedro Cliente/i)).toBeInTheDocument()
      expect(screen.getByText('Cuenta suspendida')).toBeInTheDocument()
    })

    it('14. Abre el modal de nuevo usuario y permite su creación', async () => {
      const usuario = userEvent.setup()
      const onCrearUsuarioMock = vi.fn()

      render(
        <VistaJefe
          productos={productosPrueba}
          pedidos={pedidosPrueba}
          usuarios={usuariosPrueba}
          onCrearUsuario={onCrearUsuarioMock}
          seccionActiva="usuarios"
        />
      )

      await usuario.click(screen.getByRole('button', { name: /Nuevo Usuario/i }))
      expect(screen.getByRole('heading', { name: /Crear Nuevo Usuario/i })).toBeInTheDocument()

      await usuario.type(screen.getByLabelText(/Nombre Completo/i), 'Nuevo Trabajador')
      await usuario.type(screen.getByLabelText(/Correo Electrónico/i), 'trabajador.nuevo@sonidovivo.cl')
      await usuario.type(screen.getByLabelText(/^Contraseña/i), 'clave123')
      await usuario.selectOptions(screen.getByLabelText(/Rol Asignado/i), 'trabajador')

      await usuario.click(screen.getByRole('button', { name: /Crear Usuario/i }))

      expect(onCrearUsuarioMock).toHaveBeenCalledTimes(1)
      expect(onCrearUsuarioMock).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'Nuevo Trabajador',
          email: 'trabajador.nuevo@sonidovivo.cl',
          rol: 'trabajador',
          activo: true
        })
      )
    })

    it('15. Permite eliminar un producto del catálogo cuando se entrega onEliminarProducto', async () => {
      const usuario = userEvent.setup()
      const onEliminarMock = vi.fn()

      render(
        <VistaJefe
          productos={productosPrueba}
          pedidos={[]}
          onEliminarProducto={onEliminarMock}
          seccionActiva="productos"
        />
      )

      const btnEliminar = screen.getAllByTitle('Eliminar producto')[0]
      await usuario.click(btnEliminar)

      expect(onEliminarMock).toHaveBeenCalledWith('GA001')
    })

    it('16. Valida stock inválido y permite cancelar la edición de un producto', async () => {
      const usuario = userEvent.setup()

      render(
        <VistaJefe
          productos={productosPrueba}
          pedidos={[]}
          seccionActiva="productos"
        />
      )

      // Iniciar edición
      const btnEditar = screen.getAllByTitle(/Editar producto/i)[0]
      await usuario.click(btnEditar)
      expect(screen.getByText(/Editar Producto \(GA001\)/i)).toBeInTheDocument()

      // Stock inválido
      const inputStock = screen.getByLabelText(/Stock/i)
      await usuario.clear(inputStock)
      await usuario.type(inputStock, '-5')
      await usuario.click(screen.getByRole('button', { name: /Actualizar Producto/i }))
      expect(screen.getByText(/El stock debe ser un entero no negativo/i)).toBeInTheDocument()

      // Cancelar edición
      await usuario.click(screen.getByRole('button', { name: /Cancelar/i }))
      expect(screen.getByText('Nuevo Producto')).toBeInTheDocument()
    })

    it('17. Filtra la lista de usuarios por término de búsqueda, rol y estado', async () => {
      const usuario = userEvent.setup()

      render(
        <VistaJefe
          productos={productosPrueba}
          pedidos={pedidosPrueba}
          usuarios={usuariosPrueba}
          seccionActiva="usuarios"
        />
      )

      const inputBuscar = screen.getByPlaceholderText(/Buscar por nombre o correo/i)

      // Búsqueda por texto
      await usuario.type(inputBuscar, 'Pedro')
      expect(screen.getByText('Pedro Cliente')).toBeInTheDocument()
      expect(screen.queryByText('Admin Principal')).not.toBeInTheDocument()

      // Limpiar búsqueda
      const btnLimpiar = screen.getByRole('button', { name: '' })
      await usuario.click(btnLimpiar)
      expect(screen.getByText('Admin Principal')).toBeInTheDocument()

      // Filtro por rol
      const selectRol = screen.getByLabelText('Filtrar por rol')
      await usuario.selectOptions(selectRol, 'jefe')
      expect(screen.getByText('Admin Principal')).toBeInTheDocument()
      expect(screen.queryByText('Pedro Cliente')).not.toBeInTheDocument()

      await usuario.selectOptions(selectRol, 'todos')

      // Filtro por estado
      const selectEstado = screen.getByLabelText('Filtrar por estado')
      await usuario.selectOptions(selectEstado, 'inactivos')
      expect(screen.getByText('Pedro Cliente')).toBeInTheDocument()
      expect(screen.queryByText('Admin Principal')).not.toBeInTheDocument()

      await usuario.selectOptions(selectEstado, 'activos')
      expect(screen.getByText('Admin Principal')).toBeInTheDocument()
      expect(screen.queryByText('Pedro Cliente')).not.toBeInTheDocument()
    })

    it('18. Permite editar un usuario existente, alternar visibilidad de contraseña y actualizarlo', async () => {
      const usuario = userEvent.setup()
      const onActualizarMock = vi.fn()

      render(
        <VistaJefe
          productos={productosPrueba}
          pedidos={pedidosPrueba}
          usuarios={usuariosPrueba}
          onActualizarUsuario={onActualizarMock}
          seccionActiva="usuarios"
        />
      )

      const btnEditarUsr = screen.getAllByTitle('Editar datos del usuario')[0]
      await usuario.click(btnEditarUsr)

      expect(screen.getByRole('heading', { name: /Editar Usuario: Admin Principal/i })).toBeInTheDocument()

      // Alternar contraseña
      const btnMostrarPassword = screen.getByRole('button', { name: /mostrar/i })
      await usuario.click(btnMostrarPassword)
      // Contraseña corta en edición
      const inputPass = screen.getByLabelText(/Nueva Contraseña/i)
      await usuario.type(inputPass, '12')
      await usuario.click(screen.getByRole('button', { name: /Actualizar Usuario/i }))
      expect(screen.getByText('La nueva contraseña debe tener al menos 4 caracteres')).toBeInTheDocument()

      // Modificar datos con contraseña válida
      await usuario.clear(inputPass)
      await usuario.type(inputPass, 'nuevaClave123')

      const inputNombre = screen.getByLabelText(/Nombre Completo/i)
      await usuario.clear(inputNombre)
      await usuario.type(inputNombre, 'Admin Actualizado')

      const selectEstado = screen.getByLabelText(/Estado de la Cuenta/i)
      await usuario.selectOptions(selectEstado, 'inactivo')

      await usuario.click(screen.getByRole('button', { name: /Actualizar Usuario/i }))

      expect(onActualizarMock).toHaveBeenCalledTimes(1)
      expect(onActualizarMock).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'Admin Actualizado',
          activo: false
        })
      )
    })

    it('19. Muestra validaciones en el formulario de usuario ante campos vacíos, correo inválido o duplicado', async () => {
      const usuario = userEvent.setup()

      render(
        <VistaJefe
          productos={productosPrueba}
          pedidos={pedidosPrueba}
          usuarios={usuariosPrueba}
          seccionActiva="usuarios"
        />
      )

      await usuario.click(screen.getByRole('button', { name: /Nuevo Usuario/i }))

      // Enviar vacío
      await usuario.click(screen.getByRole('button', { name: /Crear Usuario/i }))
      expect(screen.getByText('El nombre completo es obligatorio')).toBeInTheDocument()
      expect(screen.getByText('El correo electrónico es obligatorio')).toBeInTheDocument()
      expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument()

      // Formato inválido
      await usuario.type(screen.getByLabelText(/Correo Electrónico/i), 'correoInvalido')
      await usuario.type(screen.getByLabelText(/Nombre Completo/i), 'Nombre Valido')
      await usuario.type(screen.getByLabelText(/^Contraseña/i), '123')
      await usuario.click(screen.getByRole('button', { name: /Crear Usuario/i }))
      expect(screen.getByText('Ingresa un formato de correo válido')).toBeInTheDocument()
      expect(screen.getByText('La contraseña debe tener al menos 4 caracteres')).toBeInTheDocument()

      // Correo duplicado
      const inputEmail = screen.getByLabelText(/Correo Electrónico/i)
      await usuario.clear(inputEmail)
      await usuario.type(inputEmail, 'admin@sonidovivo.cl')
      await usuario.click(screen.getByRole('button', { name: /Crear Usuario/i }))
      expect(screen.getByText('Ya existe una cuenta con este correo')).toBeInTheDocument()

      // Cerrar modal con botón X (Cerrar modal)
      await usuario.click(screen.getByLabelText('Cerrar modal'))
      expect(screen.queryByRole('heading', { name: /Crear Nuevo Usuario/i })).not.toBeInTheDocument()
    })

    it('20. Agrega notas administrativas en el modal de historial y valida nota vacía', async () => {
      const usuario = userEvent.setup()
      const onAgregarHistorialMock = vi.fn()

      render(
        <VistaJefe
          productos={productosPrueba}
          pedidos={pedidosPrueba}
          usuarios={usuariosPrueba}
          onAgregarHistorialUsuario={onAgregarHistorialMock}
          seccionActiva="usuarios"
        />
      )

      const btnHistorial = screen.getAllByTitle('Ver historial de actividad')[0]
      await usuario.click(btnHistorial)

      const inputNota = screen.getByPlaceholderText(/Se validó identidad telefónicamente/i)
      await usuario.type(inputNota, 'Nota de auditoria de prueba')

      const btnAgregarNota = screen.getByRole('button', { name: /Añadir Nota/i })
      await usuario.click(btnAgregarNota)

      expect(onAgregarHistorialMock).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Nota de auditoria de prueba')).toBeInTheDocument()

      // Cerrar modal usando botón X (Cerrar modal)
      await usuario.click(screen.getByLabelText('Cerrar modal'))
      expect(screen.queryByText(/Historial de Auditoría/i)).not.toBeInTheDocument()
    })

    it('21. Impide que el administrador actual desactive su propia cuenta activa', async () => {
      const usuario = userEvent.setup()
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      render(
        <VistaJefe
          productos={productosPrueba}
          pedidos={pedidosPrueba}
          usuarios={usuariosPrueba}
          usuarioActual={{ email: 'admin@sonidovivo.cl' }}
          seccionActiva="usuarios"
        />
      )

      const btnDesactivar = screen.getByTitle('Desactivar usuario')
      await usuario.click(btnDesactivar)

      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('Por motivos de seguridad no puedes desactivar tu propia cuenta')
      )
      alertSpy.mockRestore()
    })

    it('22. Renderiza correctamente con propiedades por defecto', () => {
      render(<VistaJefe />)
      expect(screen.getByText(/Total Ventas Acumuladas/i)).toBeInTheDocument()
      expect(screen.getByText('$0')).toBeInTheDocument()
    })
  })
})
