(function() {
    //Buscando por ID del formulario mostrar.pug
    const lat = document.querySelector('#lat').textContent;
    const lng = document.querySelector('#lng').textContent;
    const calle = document.querySelector('#calle').textContent;
    const titulo = document.querySelector('#titulo').textContent;
    const mapa = L.map('mapa').setView([lat , lng], 16) //Tamaño del mapa

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Agregar el PIN en el mapa
    L.marker([lat,lng])
        .addTo(mapa)
        .bindPopup(titulo).openPopup()
    
})()