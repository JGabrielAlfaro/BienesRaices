(function() {

    //Logical OR.
    const lat = document.querySelector("#lat").value || 9.9017054;
    const lng = document.querySelector("#lng").value || -83.9967128;
    const mapa = L.map('mapa').setView([lat, lng ], 13); //16 es el zoom del mapa
    let marker;

    //Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //El pin

    marker = new L.marker([lat,lng],{
        draggable:true,
        autoPan: true,
    })
    .addTo(mapa)

    //Detectar el movimiento del pin 
    marker.on('moveend',function(e){
        marker= e.target
        const posicion = marker.getLatLng();
        // console.log(posicion)
        mapa.panTo(new L.LatLng(posicion.lat,posicion.lng))

        //Obtener la información de las calles al obtener el pin.
        geocodeService.reverse().latlng(posicion,13).run(function(error,resultado){
            console.log(resultado)
            marker.bindPopup(resultado.address.LongLabel).openPopup()
            // marker.bindPopup(resultado.address.LongLabel)

            //Llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })
    })

})()

