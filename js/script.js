'use strict'

let urlFetch;
let latitud;
let longitud;

const botonUbicacion = document.getElementById("boton");
botonUbicacion.addEventListener('click', () => {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(muestraPosicion);

    }

    }, {once:true});

function muestraPosicion(position) {

    latitud = position.coords.latitude;
    longitud = position.coords.longitude;
    urlFetch = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=precipitation&hourly=temperature_2m,precipitation_probability,rain&daily=precipitation_hours&timezone=auto&forecast_hours=9`;
    lluvia();

}


function lluvia() {

    fetch(`${urlFetch}`)

    .then((response) => { 
        return response.json(); 
    })  

    .then((data) => {

        const tiempoPorHoras = data.hourly.time;

        const forecast = data.hourly.precipitation_probability;

        const imagenGif = document.createElement('img');

        if (forecast.some(hour => hour > 0)) {

            const prediccion = document.getElementById("horaActual");
            const prediccionFinal = document.createElement("div");
            prediccionFinal.className = "prediccionFinal";
            prediccionFinal.innerHTML = `<p>Lloverá en las siguientes 8 horas</p>`;
            
            prediccion.appendChild(prediccionFinal);

          } else {

            const prediccion = document.getElementById("horaActual");
            const prediccionFinal = document.createElement("div");
            prediccionFinal.className = "prediccionFinal";
            prediccionFinal.innerHTML = `<p>No lloverá en las proximas 8 horas</p>`;
            
            prediccion.appendChild(prediccionFinal);

          }


        for (let i = 1; i < tiempoPorHoras.length; i++) {
            
            
            if (forecast[i] < 1) {

                imagenGif.src = "./img/day.svg"

            } else if (forecast[i] > 1 && forecast[i] <= 50) {

                imagenGif.src = "./img/rainy-1.svg"

            } else {

                imagenGif.src = "./img/rainy-7.svg"

            }

            let fechaObjeto = new Date(tiempoPorHoras[i]);
            let horas = fechaObjeto.getHours();
            let minutos = fechaObjeto.getMinutes();
            let horaFormateada = `${horas < 10 ? '0' : ''}${horas}:${minutos < 10 ? '0' : ''}${minutos}`;

            const divInfoTiempo = document.getElementById("tiempoPorHora");
            const infoTiempo = document.createElement("li");
            infoTiempo.innerHTML =
                `
                <img class="imagen" alt="${imagenGif.src}" src="${imagenGif.src}">
                <p>${horaFormateada}</p>
                <p>${data.hourly.temperature_2m[i]}ºC</p>
                <p>${forecast[i]}% de probabilidad de lluvia</p>
                `;

            divInfoTiempo.appendChild(infoTiempo);

        }

    });

}