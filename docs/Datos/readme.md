# Datos: contenedores para la recepción de residuos reciclables

Esta carpeta contiene el dato original, el dataset limpio y el análisis de los contenedores de reciclaje publicados por Dónde Reciclo en el Catálogo Nacional de Datos Abiertos de Uruguay.

## Estructura

- `Dataset - original/`: el CSV tal como se descargó (`containers-2022-07-27.csv`). No se modifica. Junto a él, `containers-2022-07-27.procedencia.json` guarda la URL, el tamaño y la huella SHA-256.
- `Dataset - limpio/`: generado por la Etapa II. Tiene `containers-limpio.parquet`, `containers-cambios.csv` (una fila por celda modificada) y `containers-limpio.manifiesto.json` (huellas, reglas y versiones de las librerías).
- `Análisis de datos/Etapa I - Importación de datos/EDA.ipynb`: descarga del CSV.
- `Análisis de datos/Etapa II - EDA y verificación/Importacion de datos.ipynb`: calidad, limpieza, mapa y DataFrames por departamento.
- `Análisis de datos/Etapa II - EDA y verificación/mapa-contenedores.html`: mapa interactivo generado por el notebook.

## Fuente

- **Conjunto:** Contenedores, programas para la recepción de residuos reciclables y condiciones de recepción (¿Dónde Reciclo?).
- **Recurso usado:** Ubicación e información sobre contenedores para la recepción de residuos reciclables (`containers-2022-07-27.csv`, 2 423 filas).
- **Fecha de los datos:** 27 de julio de 2022.
- **Licencia:** Creative Commons Atribución 4.0, según la publicación de DATA Uruguay.

El conjunto tiene además otros cuatro recursos (programas, subprogramas, condiciones de recepción por residuo y materiales). No se usaron en este análisis.

## Proceso

### Etapa I: importación

El notebook descarga el CSV desde el catálogo y lo guarda en `Dataset - original` byte por byte. Si el archivo ya existe, no lo vuelve a bajar. Se lee con `utf-8-sig` porque el archivo trae BOM. Después comprueba que el tamaño local coincida con el que informa el catálogo (403 960 bytes) y registra la huella SHA-256 en el archivo de procedencia. Si el CSV cambia, el notebook falla.

### Etapa II: EDA, limpieza y verificación

1. **Calidad del original.** Se revisan nulos por columna, filas duplicadas exactas, Ids repetidos, filas repetidas en contenido y coordenadas fuera de Uruguay. Se revisan también los valores de departamento tal como vienen, la concentración de contenedores por localidad (IQR), y la relación entre `Hidden` y `Public site`.
2. **Limpieza.** Estas son las reglas aplicadas:
   - **Texto:** se quitan espacios sobrantes y dobles; las celdas vacías pasan a faltantes.
   - **Departamento:** se unifican variantes con y sin tildes y errores de escritura. Si falta, se completa solo cuando la localidad pertenece a un único departamento.
   - **Localidad:** se unifican mayúsculas y tildes con la forma más frecuente (por ejemplo, ATLANTIDA y Atlántida).
   - **Coordenadas:** si latitud y longitud están intercambiadas, se corrigen; si la longitud tiene signo positivo, se invierte. Lo que sigue fuera del rectángulo aproximado de Uruguay (lat −35,1 a −30,0; lon −58,5 a −53,0) queda sin coordenadas. No se inventan valores.
   - **Visibilidad:** `visible` es verdadero cuando el sitio no está oculto y es público. Es la misma regla que usa la API.
   - **Repetidos:** no se borra ninguna fila. Se marcan en `posible_duplicado` porque dos contenedores pueden estar en el mismo local.
   - **Coordenadas sospechosas:** se marca en `coordenada_sospechosa` un punto válido que está muy lejos del centro de su departamento (valla de Tukey: Q3 + 3·IQR de las distancias) y sin otro punto de su localidad a menos de 20 km. No se modifica: los pueblos alejados, como Chuy o Guichón, no se marcan.
   - `Latlon` está vacía en todas las filas y se descarta.
   - El resultado se guarda en `containers-limpio.parquet` con 2 423 filas y 23 columnas, que incluyen las coordenadas originales para poder compararlas. Antes de guardar se comprueba que no se perdió ninguna fila, que los `id` son únicos y que las coordenadas válidas caen dentro de Uruguay. Después se lee el archivo para verificarlo.
3. **Revisión posterior.** Se repiten nulos y atípicos sobre el dataset limpio.
4. **Mapa.** Un marcador por contenedor visible con coordenadas válidas y departamento (2 201 en total, con los sospechosos en rojo). Los marcadores se agrupan por departamento con una capa por cada uno y clusters dentro de cada capa.
5. **DataFrames por departamento.** Se arma `contenedores_por_departamento`, un diccionario con un DataFrame por departamento, con solo los contenedores visibles.

### Cómo se puede seguir cada resultado

- **El original no se toca.** La Etapa II compara la huella SHA-256 del CSV con la registrada en la Etapa I antes de leerlo y otra vez al terminar.
- **Cada cambio queda registrado.** Las reglas R1 a R7 del notebook guardan una fila por celda modificada en `containers-cambios.csv`: el `id` del contenedor, la regla, la columna, el valor antes y el valor después. Son 795 celdas en 640 contenedores.
- **El registro se verifica.** Antes de exportar, el código comprueba que cada celda que difiere del original figura en el registro, que no se perdió ninguna fila y que las columnas sin reglas son idénticas.
- **El dataset limpio se verifica.** El parquet se relee y se compara con el DataFrame. El manifiesto guarda las huellas del CSV y del parquet, las reglas aplicadas y las versiones de Python y de las librerías.
- **Las cifras no están escritas a mano.** Las conclusiones del notebook se generan a partir de variables. Una celda comprueba que coinciden con las que citan este README y el principal, y falla si los datos cambian.
- **Qué no se puede seguir.** Las marcas `posible_duplicado` y `coordenada_sospechosa` no modifican datos: señalan filas para revisar, y la decisión final es de quien use el dataset.

## Hallazgos

- **Nulos:** `Information` (93 %), `Custom icon active` (92 %), `Location` (63 %), `Site type` (41 %) y `External` (34 %) tienen muchos faltantes. `Latlon` está vacía en todas las filas.
- **Repetidos:** no hay filas idénticas ni `Id` repetidos. Hay 14 filas repetidas en contenido y 47 filas que comparten coordenadas exactas. Tras la limpieza quedan 26 marcadas como `posible_duplicado`.
- **Coordenadas:** 51 filas están fuera de Uruguay o no tienen longitud. De ellas, 44 tienen latitud y longitud intercambiadas, todas en el bloque de Colonia. Hay además 1 con signo positivo en la longitud, 1 con un 0 y 1 sin longitud. Tras la corrección quedan 2 417 con coordenadas válidas.
- **Departamentos:** hay 28 escrituras distintas para 19 departamentos reales. Tras la limpieza quedan 19, y 1 fila sin departamento.
- **Localidades:** 299 valores distintos bajan a 261 al unificar mayúsculas y tildes.
- **Visibilidad:** 2 207 contenedores son visibles. Hay 207 ocultos y 9 no públicos; se conservan con `visible = False`.
- **Outliers:** el IQR sobre latitud y longitud no sirve para detectar errores, porque marca la dispersión geográfica del país. Por eso se usa la distancia al centro del departamento. Por localidad, el IQR marca 23 con muchos contenedores (Montevideo, Colonia, Paysandú, Trinidad, entre otras).
- **Coordenadas sospechosas:** 19 puntos (16 visibles). Dos son casi seguro erróneos: *Super Costa Verde* (Costa Azul, Canelones, a 215 km del centro del departamento) y *Veterinaria El Estribo* (Montevideo, a 152 km). El resto son puntos aislados: pueblos del interior con un solo registro (Merinos, Belén, Quebracho) y zonas periféricas de Montevideo (Pajas Blancas, Melilla). Hay que verificarlos, pero no son necesariamente errores.
- **Frescura:** 1 889 de los 2 207 visibles (86 %) se cargaron en 2020. Al 27/07/2022, 1 932 (88 %) llevaban más de un año sin actualizarse (mediana: 748 días). En 2022 se cargaron 227.
- **Tipo de sitio:** 820 de los 2 207 visibles (37 %) no tienen tipo. Entre los que sí, predominan en vía pública (567), farmacia (367), supermercado (143) y sucursal (117).
- **Concentración:** Montevideo tiene 1 567 de los 2 207 visibles (71 %), seguido por Canelones (247) y Colonia (61).

## Conclusiones

- El dataset sirve para mapear. Quedan 2 201 contenedores con coordenadas válidas y departamento. Quedan fuera 6 contenedores visibles, por falta de coordenadas o de departamento.
- Los errores son de carga, no de contenido. La mayoría son coordenadas intercambiadas en un mismo bloque (Colonia). Conviene avisar a DATA Uruguay para corregirlo en la fuente, junto con las 2 coordenadas casi seguro erróneas.
- El conteo por departamento muestra dónde están cargados los contenedores, no la cobertura real de reciclaje. Que Montevideo tenga el 71 % refleja dónde se registraron los puntos.
- Los datos son de julio de 2022 y el 88 % de los contenedores visibles llevaba más de un año sin actualizarse. Pueden no reflejar el estado actual de los contenedores.
- Los duplicados no se borraron. Conviene revisar los 26 marcados antes de contar contenedores por local.

## Cómo reproducir

Instalar las dependencias:

```bash
python -m pip install pandas pyarrow folium matplotlib requests
```

Ejecutar los notebooks en orden: primero la Etapa I (descarga el CSV) y después la Etapa II (limpieza, parquet, mapa y DataFrames).