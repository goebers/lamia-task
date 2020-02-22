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

        return response()->json(['error' => 'Request API token wrong or missing.'], 400);
    }
}
