# API de Clima - Proyecto Node.js

## Introducción

Este proyecto es una API construida en Node.js y Express que proporciona acceso a datos climáticos a través de la API de OpenWeather. La API permite a los usuarios obtener información sobre el clima actual, pronósticos, datos de contaminación del aire y geocodificación. Todos los endpoints estan disponibles en el index de nuestro proyecto que ingresas usando localhost:3000

## Integrantes del Grupo

- Ignacio Sotomayor
- Lucas Bertone

## Flujo General de la API

- **Parámetros:** Se reciben los parámetros necesarios para cada operación, verificando si alguno es obligatorio. Si falta alguno, se devuelve un mensaje de error.
- **Peticiones a la API:** Se utiliza la API de OpenWeather para obtener los datos solicitados. Los parámetros requeridos se incluyen en la ruta de la API.
- **Respuesta en JSON:** Los datos obtenidos son procesados y filtrados según la relevancia, devolviendo la respuesta en formato JSON.
- **Manejo de errores:** Se implementan verificaciones de errores, manejándolos adecuadamente y devolviendo respuestas claras con los códigos de estado correspondientes.

## Endpoints Implementados

### Endpoints de Ignacio Sotomayor

1. **Polución Futura por Coordenadas**
   - **Endpoint:** `/api/v1/aire/polucionFutura?lat={lat}&lon={lon}`
   - **Descripción:** Muestra los datos de contaminación del aire a futuro para una ubicación específica dada por coordenadas.

2. **Clima Actual por Coordenadas Filtrado**
   - **Endpoint:** `/api/v1/clima/coordenadas?lat={lat}&lon={lon}`
   - **Descripción:** Muestra los datos climáticos actuales para una ubicación específica dada por sus coordenadas, filtrando los datos no esenciales.

3. **Clima Actual por Ciudad Filtrado**
   - **Endpoint:** `/api/v1/clima/ciudadFiltrada?ciudad={nombre_ciudad}`
   - **Descripción:** Muestra los datos climáticos actuales para la ciudad especificada por el usuario, con los datos relevantes filtrados.

4. **Obtener Coordenadas de una Ciudad**
   - **Endpoint:** `/api/v1/geocoding/coordenadasPorCiudad?ciudad={nombre_ciudad}`
   - **Descripción:** Devuelve las coordenadas geográficas de una ciudad ingresada por el usuario.

5. **Obtener Ciudad por Coordenadas**
   - **Endpoint:** `/api/v1/geocoding/ciudadPorCoordenadas?lat={lat}&lon={lon}`
   - **Descripción:** Devuelve el nombre de la ciudad correspondiente a unas coordenadas geográficas ingresadas.

6. **Obtener Coordenadas por Código Postal**
   - **Endpoint:** `/api/v1/geocoding/coordenadasPorCodigoPostal?zip={codigo_postal}`
   - **Descripción:** Devuelve las coordenadas geográficas de una ubicación ingresada por código postal.

### Endpoints de Lucas Bertone

1. **Clima Actual por Nombre de Ciudad**
   - **Endpoint:** `/api/v1/clima/ciudad?ciudad={nombre_ciudad}`
   - **Ejemplo:** `/api/v1/clima/ciudad?ciudad=bahia%20blanca`
   - **Descripción:** Obtiene el clima actual para una ubicación especificada por su nombre.

2. **Pronóstico a 5 Días por Coordenadas**
   - **Endpoint:** `/api/v1/pronostico/extendido?lat={lat}&lon={lon}`
   - **Ejemplo:** `/api/v1/pronostico/extendido?lat=-34.61&lon=-58.38`
   - **Descripción:** Proporciona el pronóstico del clima a 5 días con datos cada 3 horas para una ubicación específica.

3. **Pronóstico a 5 Días por Ciudad**
   - **Endpoint:** `/api/v1/pronostico/extendidoPorCiudad/:ciudad`
   - **Ejemplo:** `/api/v1/pronostico/extendidoPorCiudad/Bahia Blanca`
   - **Descripción:** Proporciona el pronóstico del clima a 5 días con datos cada 3 horas para una ciudad ingresada como parámetro.

4. **Pronóstico a 5 Días por Código Postal**
   - **Endpoint:** `/api/v1/pronostico/extendidoPorCodigoPostal?zip={zip}`
   - **Ejemplo:** `/api/v1/pronostico/extendidoPorCodigoPostal?zip=8000`
   - **Descripción:** Proporciona el pronóstico del clima a 5 días con datos cada 3 horas, ingresando el código postal.

5. **Datos Actuales de Contaminación del Aire**
   - **Endpoint:** `/api/v1/aire/polucion?lat={lat}&lon={lon}`
   - **Ejemplo:** `/api/v1/aire/polucion?lat=-34.61&lon=-58.38`
   - **Descripción:** Obtiene información actual sobre la contaminación del aire para una ubicación específica.

6. **Datos Históricos de Contaminación del Aire**
   - **Endpoint:** `/api/v1/aire/polucionHistorica?lat={lat}&lon={lon}&start={start}&end={end}`
   - **Ejemplo:** `/api/v1/aire/polucionHistorica?lat=-34.61&lon=-58.38&start=1694803200&end=1694889600`
   - **Descripción:** Obtiene información histórica sobre la contaminación del aire para una ubicación específica y en una franja de tiempo definida. El formato de la fecha está en timestamp Unix (utiliza herramientas como epochconverter.com para convertirlo).


### Endpoints de Lucas Bertone e Ignacio Sotomayor

Ya que la Api que utilizamos solo nos daba metodos GET, decidimos realizar metodos propios para modificar la base de datos del proyecto. 

1. ** Obtener todas las ciudades  
**Ruta:** `GET /ciudades`  
**Descripción:** Recupera la lista completa de ciudades almacenadas en la base de datos con sus respectivos datos climáticos.  
**Funcionamiento:**  
- Ejecuta una consulta SQL para obtener todas las filas de la tabla `clima`.  
- Retorna un JSON con los datos de las ciudades o un error en caso de fallo.  

2. ** Crear una nueva ciudad  
**Ruta:** `POST /ciudades`  
**Descripción:** Agrega una nueva ciudad con información climática a la base de datos.  
**Funcionamiento:**  
- Recibe los datos de la ciudad en el cuerpo de la solicitud (`nombreCiudad`, `descripcion`, `temperatura`, etc.).  
- Verifica que todos los campos obligatorios estén presentes.  
- Inserta los datos en la tabla `clima` mediante una consulta SQL.  
- Retorna un mensaje de éxito o error según corresponda.  

3. ** Marcar o desmarcar una ciudad como favorita  
**Ruta:** `PATCH /ciudades/favorito`  
**Descripción:** Permite marcar una ciudad como favorita o desmarcarla.  
**Funcionamiento:**  
- Recibe el `nombreCiudad` en el cuerpo de la solicitud.  
- Busca la ciudad en la base de datos para verificar si ya está marcada como favorita (`es_favorita`).  
- Alterna el estado de `es_favorita` (0 o 1).  
- Retorna un mensaje indicando el cambio realizado.  

4. ** Eliminar una ciudad  
**Ruta:** `DELETE /ciudades`  
**Descripción:** Elimina una ciudad de la base de datos.  
**Funcionamiento:**  
- Recibe el `nombreCiudad` en el cuerpo de la solicitud.  
- Busca y elimina la ciudad de la tabla `clima`.  
- Retorna un mensaje confirmando la eliminación o un error si la ciudad no existe.  
---


