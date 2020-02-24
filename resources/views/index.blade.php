<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>SK8-SPOTS</title>

        <!-- Fonts & CSS -->
        <link href="https://fonts.googleapis.com/css?family=Roboto:200,600" rel="stylesheet">
        <link href="{{asset('css/app.css')}}" rel="stylesheet">
    </head>
    <body>
        <h1 id="site-title">SK8-SPOTS</h1>

        <div id="map"></div>
        
        <!-- JS -->
        <script src="{{asset('js/app.js')}}"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key={{env('GMAPS_KEY')}}"></script>
    </body>
</html>
