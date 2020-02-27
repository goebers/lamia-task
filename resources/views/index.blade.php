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
                <h2 id="modal-title"></h2>
                <h5 class="modal-creator">Spot creator: <span id="modal-creator"></span></h5>
                <p id="modal-desc"></p>
                <div id="modal-map"></div>
            </div>
            <!-- Login modal -->
            <div id="modal-content-login" class="modal-content shadow">
                <button class="close-modal">x</button>
                <h2 id="modal-title"></h2>
                <h5 class="modal-creator">Spot creator: <span id="modal-creator"></span></h5>
                <p id="modal-desc"></p>
                <div id="modal-map"></div>
            </div>
            <!-- About modal -->
            <div id="modal-content-about" class="modal-content shadow">
                <button class="close-modal">x</button>
                <h2 id="modal-title">About SK8-SPOTS</h2>
                <p id="modal-desc">
                    SK8-SPOTS is a web app where skaters can share their favourite skateboarding spots and mark them on a map.
                    Everyone can browse the map for cool new spots and registered users can share new spots and give them a small description.
                    Registering a user is free and if you want to edit or delete your own made spots, that is possible too.
                </p>
            </div>
        </div>

        <div class="title-bar">
            <img src="{{asset('img/sk8.png')}}" alt="skateboard">
            <h1 class="site-title">SK8-SPOTS</h1>
        </div>

        <!-- Login/register/about -->
        <div class="header-links">
            <span id="register-link">REGISTER</span>
            <span id="login-link">LOGIN</span>
            <span id="about-link">ABOUT</span>
        </div>
        <!-- Main view map-->
        <div id="map"></div>
        
        <!-- JS -->
        <script src="{{asset('js/app.js')}}"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key={{env('GMAPS_KEY')}}"></script>
    </body>
</html>
