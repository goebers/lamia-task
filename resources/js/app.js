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
let mainMapMarkers = [];
let modalMap;
let modalMapMarker;

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
    // reset all markers
    mainMapMarkers.forEach( marker => {
        marker.setMap(null);
    })

    // get all spots from backend and construct markers
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

            mainMapMarkers.push(marker);

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
        const creatorWrapper = document.getElementById('modal-creator-wrapper');
        const creator = document.getElementById('modal-creator');
        creator.textContent = data.owner_name;

        // spot modal opening hour
        const openingHrWrapper = document.getElementById('modal-opening-hr-wrapper');
        const openingHr = document.getElementById('modal-opening-hr');
        openingHr.textContent = data.opening_hour;

        // spot modal closing hour
        const closingHrWrapper = document.getElementById('modal-closing-hr-wrapper');
        const closingHr = document.getElementById('modal-closing-hr');
        closingHr.textContent = data.closing_hour;

        // the id of the current spot
        const currentSpotId = data.id;

        // spot modal map
        const spotLatLng = {
            lat: parseFloat(data.lat),
            lng: parseFloat(data.long)
        };

        modalMap = new google.maps.Map(
            document.getElementById('modal-map'),
            { zoom: 16, center: spotLatLng }
        );

        modalMapMarker = new google.maps.Marker({
            position: spotLatLng,
            map: modalMap,
            title: data.title
        });

        // check if the spot is made by user that might be logged in
        validateUser(apiToken).then( response => {
            if (response.data) {
                // if the spot owner_id and logged in users id match make elements visible
                if (response.data.id == data.owner_id) {
                    creator.textContent = 'You!';

                    // edit/delete buttons variables
                    const editDeleteBtnsDiv = document.getElementById('delete-edit-btns');
                    const editBtn = document.getElementById('edit-button');
                    const deleteBtn = document.getElementById('delete-button');

                    editDeleteBtnsDiv.style.display = 'block';

                    /**
                     * get references to multiple buttons, divs & labels
                     * that are needed for editing & deleting spot
                     */
                    const titleEditInput = document.getElementById('title-edit');
                    const descriptionEditInput = document.getElementById('desc-edit');
                    const openingHrInput = document.getElementById('opening-hr-edit');
                    const closingHrInput = document.getElementById('closing-hr-edit');
                    
                    const modalEditTitle = document.getElementById('modal-edit-title');
                    const modalEditTitleLabel = document.getElementById('title-edit-label');
                    const modalEditOpeningHrLabel = document.getElementById('opening-hr-edit-label');
                    const modalEditClosingHrLabel = document.getElementById('closing-hr-edit-label');
                    const modalEditDescLabel = document.getElementById('desc-edit-label');
                    const modalEditMapLabel = document.getElementById('modal-map-edit-label');
                    
                    const editBtnsDiv = document.getElementById('edit-btns');
                    const submitBtn = document.getElementById('submit-edit-button');
                    const cancelbtn = document.getElementById('cancel-button');

                    // edit marker position
                    let editMarker = modalMapMarker;

                    // set edit button click listener
                    editBtn.addEventListener('click', () => {
                        // set input values to existing ones
                        titleEditInput.value = data.title;
                        descriptionEditInput.value = data.description;
                        openingHrInput.value = data.opening_hour;
                        closingHrInput.value = data.closing_hour;

                        // set edit spot modal styles accordingly
                        titleEditInput.style.display = 'block';
                        descriptionEditInput.style.display = 'block';
                        openingHrInput.style.display = 'block';
                        closingHrInput.style.display = 'block';
                        modalEditTitle.style.display = 'block';
                        modalEditTitleLabel.style.display = 'block';
                        modalEditOpeningHrLabel.style.display = 'block';
                        modalEditClosingHrLabel.style.display = 'block';
                        modalEditDescLabel.style.display = 'block';
                        modalEditMapLabel.style.display = 'block';
                        editDeleteBtnsDiv.style.display = 'none';

                        // show buttons suitable for edit mode
                        editBtnsDiv.style.display = 'block';

                        // hide all normal modal elements
                        title.style.display = 'none';
                        desc.style.display = 'none';
                        creatorWrapper.style.display = 'none';
                        openingHrWrapper.style.display = 'none';
                        closingHrWrapper.style.display = 'none';

                        // add click listener to the modal map so that it can be edited
                        modalMap.addListener('click', event => {
                            // check if marker exists
                            if (editMarker) {
                                editMarker.setMap(null);
                            }

                            editMarker = new google.maps.Marker({
                                position: event.latLng,
                                map: modalMap
                            });
                        });
                    });

                    // submit edit button click listener
                    submitBtn.addEventListener('click', () => {
                        // create formdata object
                        let formData = new FormData();
                        formData.append('title', titleEditInput.value);
                        formData.append('description', descriptionEditInput.value);
                        formData.append('long', editMarker.getPosition().lng());
                        formData.append('lat', editMarker.getPosition().lat());
                        formData.append('opening_hour', openingHrInput.value);
                        formData.append('closing_hour', closingHrInput.value);

                        // try to send the formdata and spot id
                        editSpot(formData, currentSpotId).then( response => {
                            if (response.data) {
                                editBtnsDiv.style.display = 'none';
                                openingHrInput.style.display = 'none';
                                closingHrInput.style.display = 'none';
                                populateMainMap();
                                closeModal();

                                // just reverse the stuff that editBtn click does
                                titleEditInput.style.display = 'none';
                                descriptionEditInput.style.display = 'none';
                                editDeleteBtnsDiv.style.display = 'block';
                                editBtnsDiv.style.display = 'none';
                                openingHrInput.style.display = 'none';
                                closingHrInput.style.display = 'none';
                                modalEditTitle.style.display = 'none';
                                modalEditTitleLabel.style.display = 'none';
                                modalEditOpeningHrLabel.style.display = 'none';
                                modalEditClosingHrLabel.style.display = 'none';
                                modalEditDescLabel.style.display = 'none';
                                modalEditMapLabel.style.display = 'none';

                                // show again all the normal modal elements
                                title.style.display = 'block';
                                desc.style.display = 'block';
                                creatorWrapper.style.display = 'block';
                                openingHrWrapper.style.display = 'block';
                                closingHrWrapper.style.display = 'block';
                            } else {
                                alert('There was a problem trying to edit the spot!');
                            }
                        }).catch( error => {
                            console.log(error);
                        })
                    });

                    // cancel edit button click listener
                    cancelbtn.addEventListener('click', () => {
                        // just reverse the stuff that editBtn click does
                        titleEditInput.style.display = 'none';
                        descriptionEditInput.style.display = 'none';
                        editDeleteBtnsDiv.style.display = 'block';
                        editBtnsDiv.style.display = 'none';
                        openingHrInput.style.display = 'none';
                        closingHrInput.style.display = 'none';
                        modalEditTitle.style.display = 'none';
                        modalEditTitleLabel.style.display = 'none';
                        modalEditOpeningHrLabel.style.display = 'none';
                        modalEditClosingHrLabel.style.display = 'none';
                        modalEditDescLabel.style.display = 'none';
                        modalEditMapLabel.style.display = 'none';

                        // show again all the normal modal elements
                        title.style.display = 'block';
                        desc.style.display = 'block';
                        creatorWrapper.style.display = 'block';
                        openingHrWrapper.style.display = 'block';
                        closingHrWrapper.style.display = 'block';
                    });

                    // set delete button click listener
                    deleteBtn.addEventListener('click', () => {
                        if (window.confirm('Are you sure you want to delete this spot?')) {
                            deleteSpot(currentSpotId).then( response => {
                                if (response.data) {
                                    populateMainMap();
                                    closeModal();
                                }
                            }).catch( error => {
                                console.log(error);
                            });
                        }
                    });
                }
            }
        }).catch( error => {
            console.log(error);
        });

    } else if (modalType == 'login') {
        // set modal-content-login display from none to block
        loginContent.style.display = 'block';

        // login form input variables
        const emailInput = document.getElementById('login-email-input');
        const passwordInput = document.getElementById('login-password-input');

        // set submit listener for the login form
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', event => {
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
                    alert('Logging in was unsuccessfull. Please check your credentials. If the problem persists please notify the admin.');
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

        // set submit listener for the register form
        const registerForm = document.getElementById('register-form');
        registerForm.addEventListener('submit', event => {
            // prevent default form function
            event.preventDefault();

            // if register form validation is successfull
            if (formValidation('register')) {
                let formData = new FormData();
                formData.append('name', nameInput.value);
                formData.append('email', emailInput.value);
                formData.append('password', passwordInput.value);
                formData.append('password_confirmation', passwordInput2.value);

                postRegister(formData).then(response => {
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
            } else {
                alert('Your passwords do not match! Please type both passwords the same.');
            }
        });
    } else if (modalType == 'about') {
        // set modal-content-about display from none to block
        aboutContent.style.display = 'block';
    } else if (modalType = 'create') {
        createSpotContent.style.display = 'block';

        modalMap = new google.maps.Map(
            document.getElementById('modal-create-map'),
            { zoom: 11, center: hel }
        );

        modalMap.addListener('click', event => {
            // check if marker exists
            if (modalMapMarker) {
                modalMapMarker.setMap(null);
            }

            modalMapMarker = new google.maps.Marker({
                position: event.latLng,
                map: modalMap
            });
        });

        // set submit listener for the create spot form
        const createForm = document.getElementById('create-spot-form');
        createForm.addEventListener('submit', event => {
            // prevent normal form submitting
            event.preventDefault();

            // if create spot form validation is successfull
            if (formValidation('create')) {
                // form input variables
                const titleInput = document.getElementById('create-title-input');
                const descriptionInput = document.getElementById('create-description-input');
                const openingHrInput = document.getElementById('create-opening-hour-input');
                const closingHrInput = document.getElementById('create-closing-hour-input');

                // formdata variables
                let formData = new FormData();
                formData.append('title', titleInput.value);
                formData.append('description', descriptionInput.value);
                formData.append('opening_hour', openingHrInput.value);
                formData.append('closing_hour', closingHrInput.value);
                formData.append('long', modalMapMarker.getPosition().lng());
                formData.append('lat', modalMapMarker.getPosition().lat());

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
            } else {
                alert('Please fill all the inputs! Make sure you have placed a marker on the map!');
            }
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

    // add spot edit/delete buttons here also
    const editDeleteBtnsDiv = document.getElementById('delete-edit-btns');


    // set all modal contents displays from none to block
    spotContent.style.display = 'none';
    loginContent.style.display = 'none';
    registerContent.style.display = 'none';
    aboutContent.style.display = 'none';
    createSpotContent.style.display = 'none';
    editDeleteBtnsDiv.style.display = 'none';
}

/**
 * method that checks if the given form is validated
 * returns true if form is valid and false if form is not valid
 * @param {string} formString 
 */
const formValidation = (formString) => {
    if (formString == 'register') {
        const pwd1 = document.getElementById('register-password-input').value;
        const pwd2 = document.getElementById('register-password-2-input').value;

        if (pwd1 == pwd2) {
            return true;
        } else {
            return false;
        }
    } else if ('create') {
        // check if marker is set
        if (modalMapMarker !== undefined) {
            return true;
        } else {
            return false;
        }
    }
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
 * PUT method for updating a spot based on spot id
 * returns the fetch promise
 * @param {FormData} formData 
 * @param {Number} spotId 
 */
const editSpot = async (formData, spotId) => {
    const fetchHeaders = defaultHeaders;
    fetchHeaders["Content-Type"] = 'application/x-www-form-urlencoded' // we need to do this specifically for the PUT method
    fetchHeaders.Authorization = 'Bearer ' + apiToken;

    const req = await fetch('/api/spots/' + spotId, {
        method: 'PUT',
        headers: fetchHeaders,
        body: new URLSearchParams(formData).toString()
    });
    return req.json();
}

/**
 * DELETE method for removing a spot based on spot id
 * returns the fetch promise
 * @param {Number} spotId 
 */
const deleteSpot = async (spotId) => {
    const fetchHeaders = defaultHeaders;
    fetchHeaders.Authorization = 'Bearer ' + apiToken;

    const req = await fetch('/api/spots/' + spotId, {
        method: 'DELETE',
        headers: fetchHeaders,
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
