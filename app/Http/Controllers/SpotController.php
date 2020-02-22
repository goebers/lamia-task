<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        // check if user exists
        $user = Auth::guard('api')->user();
        if ($user) {
            Spot::create([
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'long' => $request->input('long'),
                'lat' => $request->input('lat'),
                'opening_hour' => $request->input('opening_hour'),
                'closing_hour' => $request->input('closing_hour'),
                'owner_id' => $user['id'],
            ]);

            return response()->json(['data' => 'New spot created succesfully.'], 201);
        }
        
        return response()->json(['error' => 'Unauthorized.'], 401);
    }

    // update a specific spot
    public function update(Request $request, Spot $spot)
    {
        $requestData = $request->all();
        
        // check if user exists & is the owner of spot
        $user = Auth::guard('api')->user();
        if ($user) {
            if ($user['id'] == $spot['owner_id']) {
                $spot->update($requestData);

                return response()->json(['data' => 'Spot updated succesfully.'], 200);    
            } else {
                return response()->json(['error' => 'You can only update spots you have created.'], 401);
            }
        }

        return response()->json(['error' => 'Unauthorized.'], 401);
    }

    // delete a specific spot
    public function delete(Spot $spot)
    {
        // check if user exists & is the owner of spot
        $user = Auth::guard('api')->user();
        if ($user) {
            if ($user['id'] == $spot['owner_id']) {
                $spot->delete();
                return response()->json(['data' => 'Spot deleted succesfully.'], 200);
            } else {
                return response()->json(['error' => 'You can only delete spots you have created.'], 401);
            }
        }

        return response()->json(['error' => 'Unauthorized.'], 401);
    }
}
