<?php


namespace App\Services\Users;


use App\Forms\IForm;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

interface IUserServiceInterface {


    /**
     * @param IForm $form
     *
     * @return mixed
     */
    public function store( IForm $form );

    /**
     * @param  $id
     * @return mixed
     */
    public function findById( $id );

    /**
     * @param  $data
     * @return mixed
     */
    public function find( $data );

    /**
     * @param  $id
     * @return mixed|void
     */
    public function remove( $id );


    /**
     * @return User[]|Collection
     */
    public function getAll();

    /**
     * @param $id
     */
    public function activate( $id );


    /**
     * Get all super admins
     *
     * @return mixed
     */
    public function getSuperAdmins();

    /**
     * Get super admin emails
     *
     * @return mixed
     */
    public function getSuperAdminEmails();

    /**
     * @param $userType
     *
     * @return mixed
     */
    public function getByType($userType);

    /**
     * @param $email
     * @return mixed
     */
    public function fetchByEmail($email);
}
