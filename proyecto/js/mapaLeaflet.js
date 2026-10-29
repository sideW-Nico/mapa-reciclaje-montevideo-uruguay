//https://catalogodatos.gub.uy/api/3/action/datastore_search?resource_id=00928700-0b2f-4685-97b3-1dc0d5009d90&limit=10000
const API_CATALOGO_GUB_UY = "https://catalogodatos.gub.uy/api/3/action"
const RECURSO = "datastore_search";
const ID_RECURSO = "00928700-0b2f-4685-97b3-1dc0d5009d90";
const LIMITE = "10000";

var mapa;

const cargaMarcadores = L.markerClusterGroup({
    chunkedLoading: true, // Evita que el navegador se congele
    chunkInterval: 30,   // Tiempo de procesamiento por fragmento en ms
    chunkDelay: 20        // Pausa entre fragmentos en ms
});

function cargarMarcadores(registros) {
    const marcadores = [];

    for (const registro of registros) {
        const lat = Number(registro.Latitude);
        const lng = Number(registro.Longitude);

        //Hay coordenadas que rompen la carga, por lo que son omitidos
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
            continue;
        }

        const marcador = L.marker([lat, lng]).bindPopup("Punto de reciclaje - " + (registro.Location || "Sin localidad") + "<hr>" + "Lugar: " + (registro.Site || "Desconocido") + "</br>" + (registro.Information || "Sin información"));

        marcadores.push(marcador);
    }

    cargaMarcadores.clearLayers();
    mapa.addLayer(cargaMarcadores);
    cargaMarcadores.addLayers(marcadores);
}

//Función asincrónica que recupera del catálogo de datos las ubicaciones de "Ubicación e información sobre contenedores para la recepción de residuos reciclables"
async function recuperarUbicaciones() {
    const url =`${API_CATALOGO_GUB_UY}/${RECURSO}` + `?resource_id=${ID_RECURSO}&limit=${LIMITE}`;
    const respuesta = await fetch(url);

    const json = await respuesta.json();

    const registros = json.result.records;
    console.log(registros);

    /*for (const id of registros) {
        var marcador = L.marker([id.Latitude, id.Longitude]).addTo(mapa);
        console.log(id.Latitude);
    }*/

    cargarMarcadores(registros);
}

function crearMapa() {
    mapa = L.map('mapa').setView([-34.7537620969158, -55.8458202078878], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);
}

crearMapa();
console.log("Se cargó mapa");

recuperarUbicaciones().catch(error => {
    console.error('No se pudieron cargar los marcadores:', error);
});
