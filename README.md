# Mapa de reciclaje de Uruguay

Proyecto experimental que permite visualizar puntos de reciclaje en Uruguay mediante un mapa interactivo con Leaflet y agrupación de marcadores.

Utiliza datos publicados por DATA Uruguay en el Catálogo Nacional de Datos Abiertos de Uruguay, gestionado por Agesic.

### Instalación

1. Cloná el repositorio y abrilo en VS Code.
2. Desde la raíz del proyecto, ejecutá:

   ```bash
   cd proyecto
   npm install
   ```

3. Instalá la extensión **Live Server** de VS Code si todavía no la tenés.
4. Hacé clic derecho sobre `proyecto/index.html` y seleccioná **Open with Live Server**.

## Tecnologías

- HTML, CSS y JavaScript.
- Leaflet.
- Leaflet.markercluster.

## Fuente de datos

Conjunto: **Contenedores, programas para la recepción de residuos reciclables y condiciones de recepción (¿Dónde Reciclo?)**.

Recurso utilizado: **Ubicación e información sobre contenedores para la recepción de residuos reciclables**.

https://catalogodatos.gub.uy/dataset/data-contenedores-para-la-recepcion-de-residuos-reciclables-donde-reciclo

## Proceso de análisis

El análisis está en dos notebooks dentro de `docs/Datos/Análisis de datos/`:

| Notebook | Qué hace | Salida |
|---|---|---|
| `Etapa I - Importación de datos/EDA.ipynb` | Descarga el CSV del recurso de contenedores, lo guarda sin modificar y comprueba que el tamaño coincida con el del catálogo. | `docs/Datos/Dataset - original/containers-2022-07-27.csv` y su `.procedencia.json` |
| `Etapa II - EDA y verificación/Importacion de datos.ipynb` | Revisa la calidad del original, limpia los datos, genera el mapa y arma un DataFrame por departamento. | `docs/Datos/Dataset - limpio/` (parquet, registro de cambios y manifiesto) y `mapa-contenedores.html` |

Pasos de la Etapa II:

1. **Calidad del original:** nulos, duplicados, coordenadas fuera de Uruguay, departamentos mal escritos y outliers.
2. **Limpieza:** normaliza texto, departamentos y localidades; corrige coordenadas intercambiadas y el signo de la longitud; marca visibilidad, posibles duplicados y coordenadas sospechosas. No borra filas.
3. **Revisión posterior:** nulos y atípicos después de la limpieza.
4. **Mapa:** un marcador por contenedor visible con coordenadas válidas, agrupado por departamento con Folium.
5. **DataFrames por departamento:** un DataFrame por departamento con sus contenedores visibles.

**Trazabilidad.** Cada resultado se puede seguir hasta el código:

- Cada regla de limpieza deja una fila por celda modificada en `docs/Datos/Dataset - limpio/containers-cambios.csv`, con el valor antes y el valor después. Son 795 celdas en 640 contenedores.
- Antes de exportar, el notebook comprueba que toda diferencia con el original está en ese registro, que no se perdió ninguna fila y que las columnas sin reglas son idénticas.
- La huella SHA-256 del CSV original se registra en la Etapa I y se verifica antes de leer los datos y después de limpiarlos.
- El parquet se relee y se compara con el DataFrame; `containers-limpio.manifiesto.json` guarda las huellas, las reglas y las versiones de las librerías.
- Las cifras de las conclusiones del notebook salen de variables. Una celda comprueba que coinciden con las de estos README y falla si los datos cambian.

Para reproducir: Python 3.13 con `pandas`, `pyarrow`, `folium`, `matplotlib` y `requests`. Ejecutar primero la Etapa I y después la Etapa II.

## Hallazgos de datos

- **Tamaño:** 2 423 contenedores y 16 columnas en el original.
- **Nulos:** `Latlon` está vacía en todas las filas, así que se descarta. `Information` (93 %), `Custom icon active` (92 %), `Location` (63 %), `Site type` (41 %) y `External` (34 %) tienen muchos faltantes.
- **Repetidos:** no hay filas idénticas ni `Id` repetidos. Hay 14 filas repetidas en contenido y 47 que comparten coordenadas exactas. Quedan 26 marcadas como `posible_duplicado` para revisar.
- **Coordenadas:** 51 filas están fuera de Uruguay o no tienen longitud. De ellas, 44 tienen latitud y longitud intercambiadas (todo el bloque de Colonia). Tras corregirlas, 2 417 tienen coordenadas válidas.
- **Departamentos:** hay 28 escrituras para 19 departamentos (tildes, espacios y errores como «Flroes»). Quedan unificadas, y 1 fila queda sin departamento.
- **Localidades:** 299 valores distintos bajan a 261 al unificar mayúsculas y tildes.
- **Visibilidad:** 2 207 contenedores son visibles (no ocultos y públicos). Los 207 ocultos y los 9 no públicos se conservan con `visible = False`.
- **Concentración:** Montevideo tiene 1 567 de los 2 207 visibles (71 %). Le siguen Canelones (247) y Colonia (61).
- **Coordenadas sospechosas:** 19 puntos están muy lejos del centro de su departamento y sin respaldo de su localidad. Dos son casi seguro erróneos (*Super Costa Verde* y *Veterinaria El Estribo*); el resto son puntos aislados (pueblos del interior con un solo registro y zonas periféricas de Montevideo) que conviene verificar. Se marcan sin modificarlos.
- **Frescura:** el 86 % de los visibles se cargó en 2020, y el 88 % llevaba más de un año sin actualizarse al 27/07/2022.
- **Tipo de sitio:** el 37 % de los visibles no tiene tipo.

## Conclusiones

- El archivo sirve para mapear: quedan 2 201 marcadores con coordenadas válidas y departamento. Quedan fuera 6 contenedores visibles, por falta de coordenadas válidas o de departamento.
- Los errores son de carga, no de contenido. La mayoría son coordenadas intercambiadas en un mismo bloque. Conviene avisar a DATA Uruguay para corregirlo en la fuente, junto con las 2 coordenadas casi seguro erróneas.
- El conteo por departamento muestra dónde están cargados los contenedores, no la cobertura real de cada departamento. Montevideo aparece con el 71 % porque concentra los registros.
- Los datos son de julio de 2022 y el 88 % de los contenedores visibles llevaba más de un año sin actualizarse. Los puntos pueden no reflejar el estado actual.
- Los duplicados no se borraron. Conviene revisar los 26 marcados antes de contar contenedores por local.

## Estado

Proyecto en desarrollo.

- Los datos publicados corresponden a julio de 2022; los puntos pueden haber cambiado.
- El acceso a los datos depende de la disponibilidad y los permisos de la API.
- Las coordenadas inválidas deben descartarse antes de mostrar los marcadores.

## Créditos

- Datos publicados por DATA Uruguay, disponibles bajo licencia Creative Commons Atribución 4.0.
- Catálogo Nacional de Datos Abiertos de Uruguay, gestionado por Agesic.
- Mapa base: © OpenStreetMap contributors.
- Mapa base del notebook de Etapa II: © Esri (World Street Map).

## Licencia del código

Consultar el archivo LICENSE.