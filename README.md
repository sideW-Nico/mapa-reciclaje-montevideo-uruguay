# Mapa de reciclaje de Uruguay

Proyecto experimental que permite visualizar puntos de reciclaje en Uruguay mediante un mapa interactivo con Leaflet y agrupación de marcadores.

Utiliza datos publicados por DATA Uruguay en el Catálogo Nacional de Datos Abiertos de Uruguay, gestionado por Agesic.

### Instalación

1. Cloná el repositorio y abrilo en VS Code.
2. Ejecutá `npm install` en la carpeta que contiene el archivo `package.json`.
3. Abrí `proyecto/index.html` con Live Server en VS Code.

**Nota:** las rutas del HTML deben apuntar a la carpeta `node_modules` generada durante la instalación.

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