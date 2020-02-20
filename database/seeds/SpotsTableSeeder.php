<?php

use Illuminate\Database\Seeder;
use App\Spot;

class SpotsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /**
         * truncate/delete possible existing records 
         * to start from scratch every time
         */
        Spot::truncate();

        // create array of arrays with dummy data
        $dummy_data_array = array(
            array(
                'title' => 'North Haaga skatepark',
                'description' => 'Pretty nice but small skatepark with a couple of obstacles.',
                'long' => '24.885505',
                'lat' => '60.225925',
                'opening_hour' => '00:00:00',
                'closing_hour' => '24:00:00',
            ),
            array(
                'title' => 'Vallila indoor skate hall',
                'description' => 'Indoor hall for scooting and skateboarding. 5 euro admission fee for the whole day.',
                'long' => '24.950272',
                'lat' => '60.195159',
                'opening_hour' => '14:00:00',
                'closing_hour' => '20:00:00',
            ),
            array(
                'title' => 'Subilahti DIY',
                'description' => 'Skate park built by collective effort. It is one of Finlands biggest DIY skateparks.',
                'long' => '24.973987',
                'lat' => '60.185767',
                'opening_hour' => '00:00:00',
                'closing_hour' => '24:00:00',
            ),
            array(
                'title' => 'Ponkes Park',
                'description' => 'Skatepark built by the skateshop Ponkes. It is near the Kaivopuisto park and has nice view of the Gulf of Finland.',
                'long' => '24.939568',
                'lat' => '60.153923',
                'opening_hour' => '00:00:00',
                'closing_hour' => '24:00:00',
            ),
        );

        // populate database with our dummy data
        foreach ($dummy_data_array as $dummy) {
            Spot::create([
                'title' => $dummy['title'],
                'description' => $dummy['description'],
                'long' => $dummy['long'],
                'lat' => $dummy['lat'],
                'opening_hour' => $dummy['opening_hour'],
                'closing_hour' => $dummy['closing_hour'],
            ]);
        }
    }
}
