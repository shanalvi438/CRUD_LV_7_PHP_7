<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use App\Services\Users\UserService;
use App\Services\MealPlanService;
use App\Services\WorkoutService;
use Illuminate\Contracts\Support\Renderable;

class HomeController extends Controller
{

    /** @var UserService */
    private $userService;

    /** @var ProductService */
    private $productService;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');

    }

    /**
     * Show the application dashboard.
     *
     * @return Renderable
     */
    public function index()
    {


        return view('home');
    }
}
