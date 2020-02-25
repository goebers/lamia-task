'use strict';

require('./bootstrap');

/**
 * google maps global variables
 * mainMap is the one that gets shown in the frontpage and contains all the spots
 * modalMap is shown in a modal and contains only one spot
 */
let mainMap;
let modalMap;

/**
 * window onload
 * run the following methods every time page is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    populateMap();
});

// init map method 
const initMap = () => {
    // The location of Helsinki city center
    const hel = { lat: 60.182, lng: 24.936 };
    
    // The map, centered at Helsinki
    mainMap = new google.maps.Map(
        document.getElementById('map'),
        { zoom: 11, center: hel }
    );

    // const marker = new google.maps.Marker({position: hel, map: map});
}

// populate the map with existing spots
const populateMap = () => {
    getSpots().then( spots => {
        // iterate through all spots
        spots.forEach(spot => {
            // marker variables
            const title = spot.title;
            const spotLatLng = {
                lat: parseFloat(spot.lat),
                lng: parseFloat(spot.long)
            }

            // create the marker
            const marker = new google.maps.Marker({
                position: spotLatLng,
                map: mainMap,
                title: title
            });

            // attach click listener for the marker
            google.maps.event.addListener(marker, 'click', (m) => {
                openSpotModal(spot);
            })
        });
    });
}

// method for opening 
const openSpotModal = (spotData) => {
    // modal
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    // modal title
    const title = document.getElementById('modal-title');
    title.textContent = spotData.title;

    // modal description
    const desc = document.getElementById('modal-desc');
    desc.textContent = spotData.description;

    // modal map
    const spotLatLng = {
        lat: parseFloat(spotData.lat),
        lng: parseFloat(spotData.long)
    };
    modalMap = new google.maps.Map(
        document.getElementById('modal-map'),
        { zoom: 16, center: spotLatLng}
    );

    const marker = new google.maps.Marker({
        position: spotLatLng,
        map: modalMap,
        title: spotData.title
    });

    // add listener for closing the modal
    const closeButton = document.getElementById('close-modal')
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';

        // delete the modal text when modal gets closed
        title.textContent = '';
        desc.textContent = '';
    });
}

// method that returns the response 
const getSpots = async () => {
    const res = await fetch('/api/spots');

    return res.json();
}