<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

/**
 * SPOT ENDPOINTS THAT REQUIRE AUTHENTICATION
 */
Route::group(['middleware' => 'auth:api'], function() {
    // create new spot
    Route::post('spots', 'SpotController@store');

    // update a spot based on id
    Route::put('spots/{spot}', 'SpotController@update');

    // delete a spot based on id
    Route::delete('spots/{spot}', 'SpotController@delete');
});

/**
 * BELOW ARE ENDPOINTS AVAILABLE TO ALL VISIOTRS
 */
// get all spots
Route::get('spots', 'SpotController@index');

// get a single spot based on id
Route::get('spots/{spot}', 'SpotController@show');

/**
 * AUTHENTICATION ENDPOINTS
 */
// register new user
Route::post('register', 'Auth\RegisterController@register');

// login
Route::post('login', 'Auth\LoginController@login');

// logout
Route::post('logout', 'Auth\LoginController@logout');