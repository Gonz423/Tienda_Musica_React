# Tienda Sonido Vivo - Versión React

Proyecto desarrollado para la Evaluación Parcial de la asignatura Desarrollo Fullstack II (DSY1104) - Duoc UC.

## Integrantes del Equipo
- Gonzalo Yáñez (gonzalo)
- Itsa (itsa)
- Damián (damian)

## Tecnologías Utilizadas
- React 19
- Vite
- Bootstrap 5 y Bootstrap Icons
- Vitest + React Testing Library (72 pruebas unitarias)

## Conexión con Microservicios (.env)
- `VITE_AUTH_API_URL=http://localhost:8081` (auth-service)
- `VITE_PRODUCTOS_API_URL=http://localhost:8083` (producto-service)
- `VITE_PEDIDOS_API_URL=http://localhost:8084` (pedido-service)
- `VITE_METRICAS_API_URL=http://localhost:8085` (metrica-service)

## Instalación y Ejecución Local
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Ejecutar pruebas unitarias (Vitest)
npm test
```

## Estructura de Ramas
- main: Código base consolidado y estable.
- gonzalo: Rama de desarrollo para Gonzalo.
- itsa: Rama de desarrollo para Itsa.
- damian: Rama de desarrollo para Damián.
