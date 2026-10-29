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

## Estado

Proyecto en desarrollo.

- Los datos publicados corresponden a julio de 2022; los puntos pueden haber cambiado.
- El acceso a los datos depende de la disponibilidad y los permisos de la API.
- Las coordenadas inválidas deben descartarse antes de mostrar los marcadores.

## Créditos

- Datos publicados por DATA Uruguay, disponibles bajo licencia Creative Commons Atribución 4.0.
- Catálogo Nacional de Datos Abiertos de Uruguay, gestionado por Agesic.
- Mapa base: © OpenStreetMap contributors.

## Licencia del código

Consultar el archivo LICENSE.