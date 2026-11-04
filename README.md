# Alboriena Motors (Concesionaria EFI)

### Temática
La temática elegida para el trabajo integrador final corresponde al sistema de una concesionaria automotriz de alta gama (**Alboriena Motors**). La aplicación web desarrollada en **React + Vite** y estilizada con **Tailwind CSS** permite consultar el catálogo de unidades, filtrar por categoría (autos y motos), marca y año de modelo, así como gestionar una lista de favoritos persistida en almacenamiento local. A su vez, incluye un modo administrador gobernado por Context API que habilita la creación (POST), edición (PUT) y eliminación (DELETE) de vehículos en la base de datos.

### API y Backend
Consumo asíncrono de API REST desarrollada con **FastAPI** y **SQLModel**, conectada a base de datos SQLite y gestionada con migraciones de **Alembic**.

### Requisitos Técnicos Cumplidos
1. **Enrutamiento (react-router-dom):** Rutas base (`/`, `/vehiculos`, `/gestion`, `/favoritos`), ruta dinámica (`/vehiculos/:id`) y rutas anidadas con `<Outlet />` (Ficha técnica y Fabricante).
2. **Consumo de API y Estado:** Operaciones CRUD (GET, POST, PUT, DELETE) con `useState` y `useEffect` con validación exhaustiva de formularios y manejo de estados (loading, error, success).
3. **Context API Global:** `ThemeContext` (Modo claro/oscuro), `UserContext` (Modo administrador) y `FavoritosContext` (Lista de seguimiento persistida en `localStorage`).
4. **Despliegue Vercel:** Soporte para enrutamiento SPA configurado con `vercel.json`.

### Ejecución en Entorno Local
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Ejecutar servidor de desarrollo:
   ```bash
   npm run dev
   
   ```
Link de la página : 
https://alboriena-motors.vercel.app/vehiculos

### Integrantes
* **Facundo Albornoz**
* **Facundo Moriena**
