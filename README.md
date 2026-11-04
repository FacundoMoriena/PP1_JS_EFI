# Alboriena Motors — Plataforma Web EFI

> **Evaluación Final Integradora (EFI)**  
> **Carrera:** Técnico Superior en Desarrollo de Software — ITEC Río Cuarto  
> **Unidad Curricular:** Práctica Profesionalizante 1 - JavaScript  
> **Docente:** Valentino Arballo  

---

## 👥 Integrantes
* **Facundo Albornoz**
* **Facundo Moriena**

---

## 📖 Descripción del Proyecto
Aplicación web moderna desarrollada en **React (v19)** con empaquetador **Vite** y estilos en **Tailwind CSS**. La plataforma permite consultar, filtrar, inspeccionar en detalle, agregar a favoritos y gestionar (crear y dar de baja) vehículos consumiendo de forma asíncrona una API REST desarrollada en **FastAPI** (`PP1_PYTHON_EFI`).

---

## 🚀 Requisitos Técnicos Cumplidos

### 1. Enrutamiento y Navegación (`react-router-dom`)
* **Rutas Base:**
  * `/`: Pantalla de Inicio / Presentación y simulación de roles.
  * `/vehiculos`: Catálogo general con búsqueda y filtrado reactivo.
  * `/gestion`: Panel administrativo para registrar nuevos vehículos (POST) y eliminarlos (DELETE).
  * `/favoritos`: Lista personalizada de vehículos favoritos guardados.
* **Ruta Dinámica:**
  * `/vehiculos/:id`: Detalle extendido de cada vehículo obtenido dinámicamente mediante `useParams()`.
* **Rutas Anidadas:**
  * Subrutas implementadas mediante `<Outlet />` dentro del detalle:
    * `/vehiculos/:id`: Ficha técnica y estado del vehículo (subruta indexada).
    * `/vehiculos/:id/fabricante`: Información del fabricante, marca y clasificación.

### 2. Consumo de API y Manejo de Estado
* Peticiones asíncronas con la API (`fetch` y `Promise.all`) para **lectura, creación y eliminación** de datos.
* Uso obligatorio de `useState` para:
  * Estados de datos (`vehiculos`, `marcas`, `tiposVehiculos`).
  * Estados de carga (`loading`) con spinners visuales.
  * Estados de error recuperables con mensajes amigables.
* Uso de `useEffect` para disparar peticiones en la carga inicial y ante cambios de parámetros de ruta (`id`).
* Formularios controlados con validaciones estrictas (campos obligatorios, precios positivos, longitud máxima y selección foránea).

### 3. Estado Global con Context API
* **`FavoritosContext` (`createContext` y `useContext`):**
  * Permite guardar y remover vehículos favoritos desde cualquier vista.
  * Persistencia en el navegador mediante **`localStorage`**.
  * Notificador dinámico de cantidad en la barra de navegación.
* **`UserContext`:**
  * Simulación de roles de usuario (**Administrador** vs **Usuario Estándar**), controlando el acceso al formulario de gestión.

### 4. Preparado para Despliegue en Vercel
* Archivo `vercel.json` con configuración de rewrites para Single Page Applications (SPA).
* Variables de entorno configurables en `.env` (`VITE_API_URL`).

---

## 🛠️ Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/FacundoMoriena/PP1_JS_EFI.git
   cd PP1_JS_EFI
   git checkout develop
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Verificar el archivo `.env` en la raíz:
   ```env
   VITE_API_URL=https://pp1-efi-python.fastapicloud.dev
   ```
   *(O apuntar a `http://127.0.0.1:8000` si se corre el backend local de FastAPI)*.

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abrir en el navegador: [http://localhost:5173](http://localhost:5173)

5. **Compilar para producción:**
   ```bash
   npm run build
   ```
