<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>SK8-SPOTS</title>

        <!-- Fonts & CSS -->
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
        <link href="{{asset('css/app.css')}}" rel="stylesheet">
    </head>
    <body>
        <!-- Modal wrapper -->
        <div id="modal-wrapper">
            <!-- Spot modal -->
            <div id="modal-content-spot" class="modal-content shadow">
                <button class="close-modal">x</button>
                <h2 id="modal-title"></h2>
                <h5 class="modal-creator">Spot creator: <span id="modal-creator"></span></h5>
                <p id="modal-desc"></p>
                <div id="modal-map"></div>
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
                    <input type="password" id="register-password-input" name="register-password" required>
                    <br>
                    <label for="register-password-2">Confirm password:</label>
                    <input type="password" id="register-password-2-input" name="register-password-2" required>
                    <br>
                    <input id="register-submit" type="submit" value="Register">
                </form>
            </div>

            <!-- Create new spot modal -->
            <div id="modal-content-create" class="modal-content shadow">
                <button class="close-modal">x</button>
                <h2 id="modal-title">Create a new spot</h2>
                <form id="create-spot-form">
                    <label for="create-title">Title:</label>
                    <input type="text" id="create-title-input" name="create-title" required>
                    <br>
                    <label for="create-description">Description:</label>
                    <input type="text" id="create-description-input" name="create-description" required>
                    <br>
                    <label for="create-opening-hour">Opening Hour:</label>
                    <input type="time" id="create-opening-hour-input" name="create-opening-hour" min="00:00" max="24:00" required>
                    <br>
                    <label for="create-closing-hour">Closing Hour:</label>
                    <input type="time" id="create-closing-hour-input" name="create-closing-hour" min="00:00" max="24:00" required>
                    <br>
                    <div id="modal-create-map"></div>
                    <br>
                    <input id="create-submit" type="submit" value="Register">
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
                <h2 id="modal-title">About SK8-SPOTS</h2>
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

            <h6 id="user-name-title">Welcome: <span id="user-name-span"></span></h6>
        </div>

        <!-- Login/register/about -->
        <div class="header-links">
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
        <div id="map"></div>
        
        <!-- JS -->
        <script src="{{asset('js/app.js')}}"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key={{env('GMAPS_KEY')}}"></script>
    </body>
</html>
