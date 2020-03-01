<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // serve files over https if APP_ENV is other than local
        if (env('APP_ENV') !== 'local') {
            \URL::forceScheme('https');
        }
    }
}
