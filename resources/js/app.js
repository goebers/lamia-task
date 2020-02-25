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
    let spots = [];

    getSpots().then( spots => {
        console.log(spots);

        // iterate through all spots
        spots.forEach(spot => {
            // marker variables
            const title = spot.title;
            const desc = spot.description;
            const long = parseFloat(spot.long);
            const lat = parseFloat(spot.lat);

            // create the marker
            const marker = new google.maps.Marker({
                position: {
                    lat: lat,
                    lng: long
                },
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
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');

    modal.style.display = 'block';

    const title = document.getElementById('modal-title');
    title.textContent = spotData.title;

    const desc = document.getElementById('modal-desc');
    desc.textContent = spotData.description;

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