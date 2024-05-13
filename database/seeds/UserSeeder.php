<?php

use App\Models\User;
use App\Services\Users\IUserType;
use Illuminate\Database\Seeder;

/**
 * Class UserSeeder
 */
class UserSeeder extends Seeder {

    /**
     * @var User $userModel
     */
    private $userModel;

    /**
     * UserSeeder constructor.
     */
    public function __construct() {
        $this->userModel = new User();
    }


    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run() {
        $this->userModel->findOrCreate( [
            'email'        => 'admin@admin.com',
            'name'    => 'super admin',
            'user_type'    => IUserType::ADMIN,
            // 'mobile'       => '123456789',
//        'address'      => 'xyz',
//            'image'        => '/public/image/admin',
            'device_token' => 'token',
            'is_verified'  => true,
            'password'     => Hash::make( 'admin' ),
//            'address'       => '1, NY, USA',

        ] );
    }
}
