'use strict';

require('./bootstrap');

// google maps variable
let map;

// window onload
document.addEventListener('DOMContentLoaded', () => {
    initMap();
});

// init map method 
const initMap = () => {
    // The location of Helsinki city center
    const hel = { lat: 60.170, lng: 24.941 };
    
    // The map, centered at Helsinki
    map = new google.maps.Map(
        document.getElementById('map'),
        { zoom: 12, center: hel }
    );

    // const marker = new google.maps.Marker({position: hel, map: map});
}