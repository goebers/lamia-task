<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Spot;

class SpotController extends Controller
{
    // get all spots
    public function index()
    {
        return Spot::all();
    }
 
    // get a specific spot
    public function show(Spot $spot)
    {
        return $spot;
    }

    // create a new spot
    public function store(Request $request)
    {
        $spot = Spot::create($request->all());

        return response()->json($spot, 201);
    }

    // update a specific spot
    public function update(Request $request, Spot $spot)
    {
        $spot->update($request->all());

        return response()->json($spot, 200);
    }

    // delete a specific spot
    public function delete(Spot $spot)
    {
        $spot->delete();

        return response()->json(null, 204);
    }
}
