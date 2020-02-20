<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // clear users table first
        User::truncate();

        /**
         * all dummy users have the same password
         * for testing purposes
         */
        $password = Hash::make('test_pass');

        User::create([
            'name' => 'Administrator',
            'email' => 'admin@test.com',
            'password' => $password,
        ]);

        // uncomment below if more dummy users needed
        /*
        $faker = \Faker\Factory::create();
        
        for ($i = 0; $i < 10; $i++) {
            User::create([
                'name' => $faker->name,
                'email' => $faker->email,
                'password' => $password,
            ]);
        }
        */
    }
}
