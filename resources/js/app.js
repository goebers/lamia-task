'use strict';

require('./bootstrap');

/**
 * the default headers for all http requests
 */
const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

/**
 * google maps global variables
 * mainMap is the one that gets shown in the frontpage and contains all the spots
 * modalMap is shown in a modal and contains only one spot
 */
let mainMap;
let modalMap;

// variable to store the api_token
let apiToken = '';

// variable to keep track if user is currently logged in
let loggedIn = false;

/**
 * window onload
 * run the following methods every time page is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initMainMap();
    populateMainMap();

    // create click listener for the login link
    document.getElementById('login-link').addEventListener('click', () => {
        openModal('login', null);
    });
    // create click listener for the register link
    document.getElementById('register-link').addEventListener('click', () => {
        openModal('register', null);
    });
    // create click listener for the about link
    document.getElementById('about-link').addEventListener('click', () => {
        openModal('about', null);
    });

    // try to get the api_token from the localstorage but set it to empty string if it is null
    apiToken = localStorage.getItem('api_token') || '';
    
    // check if api token authenticates to some user
    validateUser(apiToken).then( response => {
        // check response to see if api_token matched
        if (response.data) {
            loggedIn = true;
        } else {
            loggedIn = false;
            localStorage.removeItem('api_token');
            apiToken = '';
        }

        console.log('loggedin: '+ loggedIn);
    }).catch( error => {
        console.log(error);
    });
});

/**
 * init map method (for main view map)
 */
const initMainMap = () => {
    // The location of Helsinki city center
    const hel = { lat: 60.182, lng: 24.936 };
    
    // The map, centered at Helsinki
    mainMap = new google.maps.Map(
        document.getElementById('map'),
        { zoom: 11, center: hel }
    );
}

/**
 * populate the main map with existing spots
 */
const populateMainMap = () => {
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
                openModal('spot', spot);
            });
        });
    }).catch( error => {
        alert('There was an error fetching existing skate spots from the backend.')
        console.log(error);
    });
}

/**
 * method for opening a specific modal
 * method also contains a click listener that closes the modal
 * @param {string} modalType 
 * @param {*} data 
 */
const openModal = (modalType, data) => {
    // set the modal display from none to block
    const modalWrapper = document.getElementById('modal-wrapper');
    modalWrapper.style.display = 'block';

    // modal content variables
    const spotContent = document.getElementById('modal-content-spot');
    const loginContent = document.getElementById('modal-content-login');
    const registerContent = document.getElementById('modal-content-register');
    const aboutContent = document.getElementById('modal-content-about');

    // determine what type of content to show in modal
    if (modalType == 'spot') {
        // set modal-content-spot display from none to block
        spotContent.style.display = 'block';

        // spot modal title
        const title = document.getElementById('modal-title');
        title.textContent = data.title;

        // spot modal description
        const desc = document.getElementById('modal-desc');
        desc.textContent = data.description;

        // spot modal creator
        const creator = document.getElementById('modal-creator');
        creator.textContent = data.owner_name;

        // spot modal map
        const spotLatLng = {
            lat: parseFloat(data.lat),
            lng: parseFloat(data.long)
        };

        modalMap = new google.maps.Map(
            document.getElementById('modal-map'),
            { zoom: 16, center: spotLatLng}
        );

        const marker = new google.maps.Marker({
            position: spotLatLng,
            map: modalMap,
            title: data.title
        });
    } else if (modalType == 'login') {
        // set modal-content-login display from none to block
        loginContent.style.display = 'block';

        // login form input variables
        const emailInput = document.getElementById('login-email-input');
        const passwordInput = document.getElementById('login-password-input');

        // set click listener for the form submit button
        const submitBtn = document.getElementById('login-submit');
        submitBtn.addEventListener('click', event => {
            // prevent the normal form submission
            event.preventDefault();

            // construct the formdata that we send to API
            let formData = new FormData();
            formData.append('email', emailInput.value);
            formData.append('password', passwordInput.value);

            // try to log in
            postLogin(formData).then( response => {
                // check if response is successfull
                if (response.data) {
                    apiToken = response.data.api_token;
                    localStorage.setItem('api_token', response.data.api_token);
                } else {
                    console.log('error in logging in')
                }
            }).catch( error => {
                console.log(error);
            });
        });
    } else if (modalType == 'register') {
        // set modal-content-register display from none to block
        registerContent.style.display = 'block';
    } else if (modalType == 'about') {
        // set modal-content-about display from none to block
        aboutContent.style.display = 'block';
    }
    
    // add listener for all the "closing modal"-buttons
    const closeButtons = document.getElementsByClassName('close-modal');
    Array.from(closeButtons).forEach( btn => {
        btn.addEventListener('click', () => {
            // set modal display to none and hide it from user view
            modalWrapper.style.display = 'none';
    
            // set all modal contents displays from none to block
            spotContent.style.display = 'none';
            loginContent.style.display = 'none';
            registerContent.style.display = 'none';
            aboutContent.style.display = 'none';
        });
    });
}

/**
 * method for validating the api token to a existing user
 * returns the fetch response as json
 * @param {string} apiToken 
 */
const validateUser = async (apiToken) => {
    // add the authorization header on top of default headers
    const fetchHeaders = defaultHeaders;
    fetchHeaders['Authorization'] = 'Bearer ' + apiToken;
    
    const req = await fetch('/api/valid', {
        method: 'GET',
        headers: fetchHeaders
    });

    return req.json();
}

/**
 * get all spots method
 * returns the fetch response as json
 */
const getSpots = async () => {
    const req = await fetch('/api/spots', {
        method: 'GET',
        headers: defaultHeaders
    });
    
    return req.json();
}

/**
 * POST method for logging in
 * returns the fetch response as json
 * @param {FormData} formData 
 */
const postLogin = async (formData) => {
    const req = await fetch('/api/login', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(Object.fromEntries(formData))
    });
    return req.json();
}