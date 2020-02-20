<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Spot extends Model
{
    // spot attributes we want to be able to create and update
    protected $fillable = [
        'title',
        'description',
        'long',
        'lat',
        'opening_hour',
        'closing_hour'
    ];
}
