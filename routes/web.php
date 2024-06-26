<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'WelcomeController@index')->name('welcome');


Auth::routes();
Route::get('/home', 'HomeController@index')->name('home');


Route::prefix('admin')->group(static function () {
    Route::get('/', 'Web\UserController@indexAdmin')->name('admin');
    Route::get('/{id}', 'Web\UserController@showAdmin')->name('admin-show');
});


Route::resource('companies', 'Web\CompanyController');

Route::resource('employees', 'Web\EmployeeController');










