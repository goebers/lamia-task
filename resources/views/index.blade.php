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
        <!-- Modal -->
        <div id="modal">
            <div id="modal-content" class="shadow">
                <button id="close-modal">x</button>
                <h2 id="modal-title"></h2>
                <p id="modal-desc"></p>
                <div id="modal-map"></div>
            </div>
        </div>

        <div class="title-bar">
            <img src="{{asset('img/sk8.png')}}" alt="skateboard">
            <h1 class="site-title">SK8-SPOTS</h1>
        </div>
        <!-- Main view map-->
        <div id="map"></div>
        
        <!-- JS -->
        <script src="{{asset('js/app.js')}}"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key={{env('GMAPS_KEY')}}"></script>
    </body>
</html>
