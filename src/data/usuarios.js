export const usuariosIniciales = [
  {
    id: 'USR-000',
    nombre: 'Jefe Administrador',
    email: 'admin@tiendamusica.cl',
    password: 'Admin123!',
    rol: 'jefe',
    activo: true,
    fechaCreacion: '2026-08-01',
    historial: [
      {
        id: 1,
        fecha: '2026-08-01 09:00',
        accion: 'Creacion de cuenta',
        detalle: 'Cuenta creada con rol Jefe / Administrador'
      }
    ]
  },
  {
    id: 'USR-000B',
    nombre: 'Vendedor Bodega',
    email: 'empleado@tiendamusica.cl',
    password: 'Vendedor123!',
    rol: 'trabajador',
    activo: true,
    fechaCreacion: '2026-08-01',
    historial: [
      {
        id: 1,
        fecha: '2026-08-01 10:00',
        accion: 'Creacion de cuenta',
        detalle: 'Cuenta creada con rol Trabajador / Vendedor'
      }
    ]
  },
  {
    id: 'USR-001',
    nombre: 'Gonzalo Yáñez',
    email: 'gonzalo@sonidovivo.cl',
    password: 'admin123',
    rol: 'jefe',
    activo: true,
    fechaCreacion: '2026-08-10',
    historial: [
      {
        id: 1,
        fecha: '2026-08-10 09:00',
        accion: 'Creación de cuenta',
        detalle: 'Cuenta creada con privilegios de Jefe / Administrador'
      },
      {
        id: 2,
        fecha: '2026-10-14 20:15',
        accion: 'Inicio de sesión',
        detalle: 'Ingreso al panel de administración'
      }
    ]
  },
  {
    id: 'USR-002',
    nombre: 'Carlos Empleado',
    email: 'trabajador@sonidovivo.cl',
    password: 'trabajo123',
    rol: 'trabajador',
    activo: true,
    fechaCreacion: '2026-08-15',
    historial: [
      {
        id: 1,
        fecha: '2026-08-15 10:30',
        accion: 'Creación de cuenta',
        detalle: 'Cuenta creada con rol Trabajador'
      },
      {
        id: 2,
        fecha: '2026-10-14 21:00',
        accion: 'Inicio de sesión',
        detalle: 'Recepción y despacho de pedidos'
      }
    ]
  },
  {
    id: 'USR-003',
    nombre: 'Francisca Cliente',
    email: 'cliente@mail.cl',
    password: 'cliente123',
    rol: 'cliente',
    activo: true,
    fechaCreacion: '2026-09-01',
    historial: [
      {
        id: 1,
        fecha: '2026-09-01 16:45',
        accion: 'Creación de cuenta',
        detalle: 'Registro como nuevo cliente en la tienda'
      },
      {
        id: 2,
        fecha: '2026-10-12 18:30',
        accion: 'Compra realizada',
        detalle: 'Orden de compra finalizada por $120.000'
      }
    ]
  },
  {
    id: 'USR-004',
    nombre: 'Matías Silva',
    email: 'matias.silva@musica.cl',
    password: 'pass1234',
    rol: 'cliente',
    activo: false,
    fechaCreacion: '2026-09-10',
    historial: [
      {
        id: 1,
        fecha: '2026-09-10 11:20',
        accion: 'Creación de cuenta',
        detalle: 'Registro de cliente'
      },
      {
        id: 2,
        fecha: '2026-09-25 15:00',
        accion: 'Desactivación',
        detalle: 'Cuenta suspendida temporalmente por inactividad'
      }
    ]
  }
]
