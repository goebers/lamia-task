<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>SK8-SPOTS</title>

        <!-- Fonts & CSS -->
        <link href="https://fonts.googleapis.com/css?family=Lacquer|Roboto&display=swap" rel="stylesheet">
        <link href="{{asset('css/app.css')}}" rel="stylesheet">
    </head>
    <body>
        <!-- Modal wrapper -->
        <div id="modal-wrapper">
            <!-- Spot modal -->
            <div id="modal-content-spot" class="modal-content shadow row">
                <button class="close-modal">x</button>
                <div id="modal-text-wrapper" class="column-1 content">
                    <div id="modal-text-part-wrapper" class="upper">
                        <h2 id="modal-title"></h2>
                        <h2 id="modal-edit-title">Edit the spot</h2>
                        <label id="title-edit-label" for="title-edit">Title:</label>
                        <input type="text" name="title-edit" id="title-edit">
                        
                        <h5 id="modal-creator-wrapper">Spot creator: <span id="modal-creator"></span></h5>

                        <h6 id="modal-opening-hr-wrapper">Opening hour: <span id="modal-opening-hr"></span></h6>
                        <label id="opening-hr-edit-label" for="opening-hr-edit">Opening hour:</label>
                        <input type="time" name="opening-hr-edit" id="opening-hr-edit" min="00:00" max="24:00">
                        
                        <h6 id="modal-closing-hr-wrapper">Closing hour: <span id="modal-closing-hr"></span></h6>
                        <label id="closing-hr-edit-label" for="closing-hr-edit">Closing hour:</label>
                        <input type="time" name="closing-hr-edit" id="closing-hr-edit" min="00:00" max="24:00">
                        
                        <p id="modal-desc"></p>
                        <label id="desc-edit-label" for="desc-edit">Description:</label>
                        <textarea cols="30" rows="5" name="desc-edit" id="desc-edit"></textarea>
                    </div>

                    <div id="modal-buttons-part-wrapper">
                        <!-- edit/delete spot buttons -->
                        <div id="delete-edit-btns">
                            <button id="edit-button">Edit spot</button>
                            <button id="delete-button">Delete spot</button>
                        </div>
                        

                        <!-- edit spot buttons -->
                        <div id="edit-btns">
                            <button id="submit-edit-button">Submit edit</button>
                            <button id="cancel-button">Cancel</button>
                        </div>
                    </div>
                </div>
                <div id="modal-map-wrapper" class="column-2">
                    <label id="modal-map-edit-label" for="modal-map">Edit marker position:</label>
                    <div id="modal-map"></div>
                </div>
            </div>

            <!-- Register modal -->
            <div id="modal-content-register" class="modal-content shadow">
                <button class="close-modal">x</button>
                <h2 id="modal-title">Register a new user</h2>
                <form id="register-form">
                    <label for="register-name">Name:</label>
                    <input type="text" id="register-name-input" name="register-name" required>
                    <br>
                    <label for="register-email">E-mail:</label>
                    <input type="email" id="register-email-input" name="register-email" required>
                    <br>
                    <label for="register-password">Password:</label>
                    <input type="password" id="register-password-input" name="register-password" minlength="8" required>
                    <br>
                    <label for="register-password-2">Confirm password:</label>
                    <input type="password" id="register-password-2-input" name="register-password-2" minlength="8" required>
                    <br>
                    <input id="register-submit" type="submit" value="Register">
                </form>
            </div>

            <!-- Create new spot modal -->
            <div id="modal-content-create" class="modal-content shadow">
                <button class="close-modal">x</button>
                <form id="create-spot-form" class="row">
                    <div id="create-spot-form-input-wrapper" class="column-1 content">
                        <div id="create-spot-form-written-input-wrapper" class="upper">
                            <h2 id="modal-title">Create a new spot</h2>
                            <br>
                            <label for="create-title">Title:</label>
                            <input type="text" id="create-title-input" name="create-title" required>
                            <br>
                            <label for="create-description">Description:</label>
                            <textarea cols="30" rows="5" id="create-description-input" name="create-description" required></textarea>
                            <br>
                            <label for="create-opening-hour">Opening Hour:</label>
                            <input type="time" id="create-opening-hour-input" name="create-opening-hour" min="00:00" max="24:00" required>
                            <br>
                            <label for="create-closing-hour">Closing Hour:</label>
                            <input type="time" id="create-closing-hour-input" name="create-closing-hour" min="00:00" max="24:00" required>
                        </div>

                        <div id="create-spot-form-submit-wrapper">
                            <button id="create-submit" type="submit">Create spot</button>
                        </div>
                    </div>

                    <div id="create-spot-map-input-wrapper" class="column-2">
                        <label for="modal-create-map">Place a marker for your spot by clicking on the map:</label>
                        <div id="modal-create-map"></div>
                    </div>
                </form>
            </div>

            <!-- Login modal -->
            <div id="modal-content-login" class="modal-content shadow">
                <button class="close-modal">x</button>
                <h2 id="modal-title">Login</h2>
                <form id="login-form">
                    <label for="login-email">E-mail:</label>
                    <input type="email" id="login-email-input" name="login-email" required>
                    <br>
                    <label for="login-password">Password:</label>
                    <input type="password" id="login-password-input" name="login-password" required>
                    <br>
                    <input id="login-submit" type="submit" value="Log in">
                </form>
            </div>

            <!-- About modal -->
            <div id="modal-content-about" class="modal-content shadow">
                <button class="close-modal">x</button>
                <h2 id="modal-title" class="about-modal-title">About SK8-SPOTS</h2>
                <p id="modal-desc">
                    SK8-SPOTS is a web app where skaters can share their favourite skateboarding spots and mark them on a map. <br>
                    Everyone can browse the map for cool new spots and registered users can share new spots and give them a small description. <br>
                    Registering a user is free and if you want to edit or delete your own made spots, that is possible too.
                </p>
            </div>
        </div>

        <!-- Title -->
        <div class="title-bar">
            <img src="{{asset('img/sk8.png')}}" alt="skateboard">
            <h1 class="site-title">SK8-SPOTS</h1>
        </div>

        <span id="user-name-title">Welcome: <span id="user-name-span"></span></span>

        <!-- Login/register/about -->
        <div id="header-links">
            <div id="logged-in-false">
                <span id="register-link">REGISTER</span>
                <span id="login-link">LOGIN</span>
            </div>

            <div id="logged-in-true">
                <span id="create-link">CREATE SPOT</span>
                <span id="logout-link">LOGOUT</span>
            </div>

            <span id="about-link">ABOUT</span>
        </div>
        <!-- Main view map-->
        <div id="map-wrapper">
            <div id="map"></div>
        </div>
        <!-- JS -->
        <script src="{{asset('js/app.js')}}"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key={{env('GMAPS_KEY')}}"></script>
    </body>
</html>
