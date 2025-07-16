# PARCIAL 2 – APLICACIONES HÍBRIDAS - SANTIAGO MARTÍNEZ DONDE

Este es un proyecto FullStack hecho para el segundo parcial de la materia Aplicaciones Híbridas. La aplicación permite gestionar Comunas y Vecinos usando el stack MERN: MongoDB, Express, React y Node.js.

## Funcionalidades

### Backend (API - Node.js con Express)

- API hecha con Node y Express. Se encarga de manejar toda la lógica del servidor.
- Autenticación con JWT para registro e inicio de sesión seguros.
- Base de datos MongoDB para guardar la información.
- Se pueden registrar e iniciar sesión usuarios.
- Hay dos tipos de datos principales:
  - **Comunas:** con comisarías (comunal y vecinales) y una lista de barrios.
  - **Vecinos:** se pueden asociar a una comuna.
- Al mostrar vecinos, también se muestra su comuna automáticamente.
- Código ordenado en archivos: controladores, modelos, rutas y middlewares.

### Frontend (App web - React)

- Aplicación de una sola página (SPA) hecha con React.
- Usa componentes funcionales y hooks modernos.
- Navegación con React Router (Home, Login, Registro, Comunas, Vecinos).
- Separa la lógica de la interfaz y las conexiones con la API.
- Manejo de sesión con Context API.
- Conexión con el backend usando `axios`.
- Formularios con validaciones básicas.
- Interfaz sencilla para ver, agregar, editar y borrar comunas y vecinos.

## ¿Cómo ejecutar el proyecto?

### Requisitos:

Debés tener instalado:
- Node.js  
- npm  
- MongoDB Atlas  
- Git  

### 1. Configurar MongoDB Atlas

1.  **Abre una NUEVA TERMINAL.**
2.  **Navega a la carpeta del Frontend:**
    ```bash
    cd frontend-vite
    ```
3.  **Instala las dependencias del Frontend:**
    ```bash
    npm install
    ```
4.  **Inicia la aplicación de React:**
    ```bash
    npm start
    ```
    Esto abrirá tu aplicación en el navegador, generalmente en `http://localhost:5173`.

### 2. Configurar el Backend

1.  Una vez que ambas terminales estén corriendo sin errores y tu navegador muestre la aplicación React en `http://localhost:5173`.
2.  **Regístrate:** Crea una nueva cuenta de usuario en la página de registro (`/register`).
3.  **Inicia Sesión:** Utiliza tus nuevas credenciales para iniciar sesión (`/login`).
4.  **Gestiona Comunas:** Navega a la sección de Comunas (`/comunas`) para crear, ver, editar y eliminar datos de comunas.
5.  **Gestiona Vecinos:** Navega a la sección de Vecinos (`/vecinos`) para crear, ver, editar y eliminar datos de vecinos, asociándolos a las comunas que hayas creado.
5.  **Accede al BackOffice (Administrador):** Si iniciaste sesión como admin, verás un enlace "Administrar Usuarios" en la barra de navegación. Haz clic para acceder a la gestión completa de usuarios.

### 3. Configurar el Frontend

1. Abrir otra terminal.
2. Entrar a la carpeta:
   ```
   cd frontend
   ```
3. Instalar dependencias:
   ```
   npm install
   ```
4. Iniciar la app:
   ```
   npm start
   ```
   Se abrirá en el navegador en `http://localhost:3000`.

### 4. Usar la app

1. Asegurarse de que tanto backend como frontend estén funcionando.
2. Registrarse en la sección de registro.
3. Iniciar sesión.
4. Entrar a **Comunas** para crear, ver, editar o borrar comunas.
5. Entrar a **Vecinos** para hacer lo mismo, vinculando vecinos a comunas.
