<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\Handler;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * this method checks if the authorization token
     * in request corresponds to user is found in database
     */
    public function isValidUser(Request $request)
    {
        $user = Auth::guard('api')->user();

        // check if auth header corresponds to user and return user info
        if ($user) {
            return response()->json(['data' => $user->toArray()], 200);
        }

        return response()->json(['error' => 'Sent user token could not be matched to any user in database.'], 403);
    }

    /**
     * this method is for login
     */
    public function login(Request $request)
    {
        $this->validateLogin($request);

        if ($this->attemptLogin($request)) {
            $user = $this->guard()->user();
            $user->generateToken();

            return response()->json(['data' => $user->toArray()], 200);
        }

        return $this->sendFailedLoginResponse($request);
    }

    /**
     * method for logging out the user based on the authorizationa header
     */
    public function logout(Request $request)
    {
        /**
         * if request was authenticated and identified
         * as a user in database continue to null api token
         * and send log out success response
         * (check routes/api.php lin 16 middleware auth:api)
         */
        $user = Auth::guard('api')->user();
        
        if ($user) {
            $user->api_token = null;
            $user->save();

            return response()->json(['data' => 'User logged out.'], 200);
        }

        return response()->json(['error' => 'Request API token wrong or missing.'], 403);
    }
}
