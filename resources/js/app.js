'use strict';

require('./bootstrap');

// store the user info
let userName = '';
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

// The location of Helsinki city center
const hel = {
    lat: 60.182, lng: 24.936
}

// variable to store the api_token
let apiToken = '';

// variable to keep track if user is currently logged in
let loggedIn = false;

window.addEventListener('load', () => {
    // try to get the api_token from the localstorage but set it to empty string if it is null
    apiToken = localStorage.getItem('api_token') || '';

    // check if api token authenticates to some user
    validateUser(apiToken).then(response => {
        // check response to see if api_token matched
        if (response.data) {
            loggedIn = true;
            // render the title links based on the loggedIn boolean
            changeHeaderStyles(loggedIn);
            userName = response.data.name || '';

            const userNameElement = document.getElementById('user-name-span');
            userNameElement.innerHTML = userName;
        } else {
            loggedIn = false;
            localStorage.removeItem('api_token');
            apiToken = '';
            userName = '';
            // render the title links based on the loggedIn boolean
            changeHeaderStyles(loggedIn);
        }
    }).catch(error => {
        console.log(error);
    });

    // render the title links based on the loggedIn boolean
    changeHeaderStyles(loggedIn);

});

/**
 * window onload
 * run the following methods every time page is loaded
 */
window.addEventListener('DOMContentLoaded', () => {
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

    // create click listener for the about link
    document.getElementById('logout-link').addEventListener('click', () => {
        postLogOut().then(response => {
            console.log(response);
            apiToken = '';
            changeHeaderStyles();
        }).catch(error => {
            console.log('error in logging out from server');
        });

        apiToken = '';

        loggedIn = false;
        changeHeaderStyles(loggedIn);

        // clear username
        userName = '';

        document.getElementById('user-name-span').value = userName;
    });

    document.getElementById('create-link').addEventListener('click', () => {
        openModal('create', null);
    });

});

/**
 * init map method (for main view map)
 */
const initMainMap = () => {
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
    getAllSpots().then(spots => {
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
    }).catch(error => {
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
    const createSpotContent = document.getElementById('modal-content-create');

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
            { zoom: 16, center: spotLatLng }
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
            postLogin(formData).then(response => {
                // check if response is successfull
                if (response.data) {
                    apiToken = response.data.api_token;
                    localStorage.setItem('api_token', response.data.api_token);

                    loggedIn = true;
                    changeHeaderStyles(loggedIn);

                    closeModal();

                    emailInput.value = '';
                    passwordInput.value = '';

                    // store new user name
                    userName = response.data.name;

                    const userNameElement = document.getElementById('user-name-span');
                    userNameElement.innerHTML = userName;
                } else {
                    console.log('error in logging in');
                }
            }).catch(error => {
                console.log(error);
            });
        });
    } else if (modalType == 'register') {
        // set modal-content-register display from none to block
        registerContent.style.display = 'block';

        // register form input variables
        const nameInput = document.getElementById('register-name-input');
        const emailInput = document.getElementById('register-email-input');
        const passwordInput = document.getElementById('register-password-input');
        const passwordInput2 = document.getElementById('register-password-2-input');

        // set click listener for the form submit button
        const submitBtn = document.getElementById('register-submit');
        submitBtn.addEventListener('click', event => {
            let formData = new FormData();
            formData.append('name', nameInput.value);
            formData.append('email', emailInput.value);
            formData.append('password', passwordInput.value);
            formData.append('password_confirmation', passwordInput2.value);

            postRegister(formData).then(response => {
                console.log(response);
                if (response.data) {
                    apiToken = response.data.api_token;
                    localStorage.setItem('api_token', response.data.api_token);

                    loggedIn = true;
                    changeHeaderStyles(loggedIn);

                    closeModal();

                    nameInput.value = '';
                    emailInput.value = '';
                    passwordInput.value = '';
                    passwordInput2.value = '';

                    // store new user name
                    userName = response.data.name;

                    const userNameElement = document.getElementById('user-name-span');
                    userNameElement.innerHTML = userName;
                } else {
                    console.log(data.errors);
                }
            }).catch(error => {
                console.log(error);
            });

            event.preventDefault();
        });
    } else if (modalType == 'about') {
        // set modal-content-about display from none to block
        aboutContent.style.display = 'block';
    } else if (modalType = 'create') {
        createSpotContent.style.display = 'block';

        // marker
        let marker;

        modalMap = new google.maps.Map(
            document.getElementById('modal-create-map'),
            { zoom: 11, center: hel }
        );

        modalMap.addListener('click', event => {
            // check if marker exists
            if (marker) {
                marker.setMap(null);
            }

            marker = new google.maps.Marker({
                position: event.latLng,
                map: modalMap
            });
            
        });

        // set click listener for the form submit button
        const submitBtn = document.getElementById('create-submit');
        submitBtn.addEventListener('click', event => {
            const titleInput = document.getElementById('create-title-input');
            const descriptionInput = document.getElementById('create-description-input');
            const openingHrInput = document.getElementById('create-opening-hour-input');
            const closingHrInput = document.getElementById('create-closing-hour-input');

            let formData = new FormData();
            formData.append('title', titleInput.value);
            formData.append('description', descriptionInput.value);
            formData.append('opening_hour', openingHrInput.value);
            formData.append('closing_hour', closingHrInput.value);
            formData.append('long', marker.getPosition().lng());
            formData.append('lat', marker.getPosition().lat());

            postSpot(formData).then(response => {
                if (response.data) {
                    populateMainMap();
                    closeModal();

                    titleInput.value = '';
                    descriptionInput.value = '';
                    openingHrInput.value = '';
                    closingHrInput.value = '';
                } else {
                    console.log(data.errors);
                }
            }).catch(error => {
                console.log(error);
            });

            event.preventDefault();

        });
    }

    // add listener for all the "closing modal"-buttons
    const closeButtons = document.getElementsByClassName('close-modal');
    Array.from(closeButtons).forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal();
        });
    });
    
}

const closeModal = () => {
    // set modal display to none and hide it from user view
    const modalWrapper = document.getElementById('modal-wrapper');
    modalWrapper.style.display = 'none';

    // modal content variables
    const spotContent = document.getElementById('modal-content-spot');
    const loginContent = document.getElementById('modal-content-login');
    const registerContent = document.getElementById('modal-content-register');
    const aboutContent = document.getElementById('modal-content-about');
    const createSpotContent = document.getElementById('modal-content-create');


    // set all modal contents displays from none to block
    spotContent.style.display = 'none';
    loginContent.style.display = 'none';
    registerContent.style.display = 'none';
    aboutContent.style.display = 'none';
    createSpotContent.style.display = 'none';
}

/**
 * change the header links styles based on the loggedIn boolean
 * loggedIn == true REGISTER | LOGIN | ABOUT
 * loggedIn == false CREATE SPOT | LOGOUT | ABOUT
 * @param {boolean} loggedIn
 */
const changeHeaderStyles = (loggedIn) => {
    const loggedInFalseDiv = document.getElementById('logged-in-false');
    const loggedInTrueDiv = document.getElementById('logged-in-true');
    const userNameElement = document.getElementById('user-name-title');

    if (loggedIn == true) {
        loggedInFalseDiv.style.display = 'none';
        loggedInTrueDiv.style.display = 'inline';
        userNameElement.style.display = 'block';

    } else if (loggedIn == false) {
        loggedInFalseDiv.style.display = 'inline';
        loggedInTrueDiv.style.display = 'none';
        userNameElement.style.display = 'none';
    }
}

/**
 * method for validating the api token to a existing user
 * returns the fetch response as json
 * @param {string} apiToken 
 */
const validateUser = async (apiToken) => {
    // add the authorization header on top of default headers
    const fetchHeaders = defaultHeaders;
    fetchHeaders.Authorization = 'Bearer ' + apiToken;

    const req = await fetch('/api/valid', {
        method: 'GET',
        headers: fetchHeaders
    });

    return req.json();
}

/**
 * GET method for getting all spots
 * returns the fetch promise
 */
const getAllSpots = async () => {
    const req = await fetch('/api/spots', {
        method: 'GET',
        headers: defaultHeaders
    });

    return req.json();
}

/**
 * POST method for creating a new spot
 * returns the fetch promise
 * @param {FormData} formData 
 */
const postSpot = async (formData) => {
    const fetchHeaders = defaultHeaders;
    fetchHeaders.Authorization = 'Bearer ' + apiToken;

    const req = await fetch('/api/spots', {
        method: 'POST',
        headers: fetchHeaders,
        body: JSON.stringify(Object.fromEntries(formData))
    });
    return req.json();
}

/**
 * POST method for creating a new user
 * returns the fetch promise
 * @param {FormData} formData 
 */
const postRegister = async (formData) => {
    const req = await fetch('/api/register', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(Object.fromEntries(formData))
    });
    return req.json();
}

/**
 * POST method for logging in
 * returns the fetch promise
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

/**
 * POST method for loggin out user
 * and clearing the localstorage api_token
 * @param {FormData} formData
 */
const postLogOut = async () => {
    // add the authorization header on top of default headers
    const fetchHeaders = defaultHeaders;
    fetchHeaders.Authorization = 'Bearer ' + apiToken;

    const req = await fetch('api/logout', {
        method: 'POST',
        headers: fetchHeaders
    });

    return req.json();
}
