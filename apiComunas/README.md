# API de Vecinos y Comunas

## Descripción

Este proyecto proporciona una API REST para gestionar vecinos y comunas. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre las colecciones de vecinos y comunas. Además, incluye funcionalidades de filtrado y búsqueda por nombre.

## Funcionalidades

- **Vecinos**: Permite ver, crear, actualizar y eliminar vecinos. También incluye filtrados por nombre y comuna.
- **Comunas**: Permite ver crear, actualizar y eliminar comunas.


## Endpoints

### Vecinos

1. **GET /api/vecinos**  
   Obtiene todos los vecinos.

2. **GET /api/vecinos/:id**  
   Obtiene un vecino por su ID.

3. **GET /api/vecinos/nombre/:nombre**  
   Busca vecinos por nombre.

4. **GET /api/vecinos/comuna/:comunaId**  
   Obtiene todos los vecinos de una comuna específica.

5. **POST /api/vecinos**  
   Crea un nuevo vecino.

6. **PUT /api/vecinos/:id**  
   Actualiza la información de un vecino.

7. **DELETE /api/vecinos/:id**  
   Elimina un vecino.



### Comunas

1. **GET /api/comunas**  
   Obtiene todas las comunas.

2. **GET /api/comunas/:id** 
   Obtiene una comuna por su ID.

3. **POST /api/comunas**  
   Crea una nueva comuna.

4. **PUT /api/comunas/:id** 
   Actualizar una comuna por su ID. 

5. **DELETE /api/comunas/:id** 
   Elimina una comuna por su ID.   

## Estructura del Proyecto

El proyecto está dividido en las siguientes carpetas:

- **/controllers**: Contiene los controladores que gestionan la lógica.
- **/models**: Contiene los esquemas.
- **/routes**: Define las rutas de la API.
- **/public**: Archivos estáticos como el `index.html` y `comunas-ids.html`.

## Datos del Proyecto

- **Alumno**: Santiago Martinez Donde
- **Materia**: Aplicaciones Híbridas
- **Docente**: Jonathan Emanuel Cruz
- **Comisión**: DWT4AV
