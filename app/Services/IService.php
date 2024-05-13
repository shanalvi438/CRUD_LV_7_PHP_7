<?php
namespace App\Services;

use App\Forms\IForm;
use Illuminate\Validation\ValidationException;

/**
 * Interface IService
 * @package App\Services
 */
interface IService
{
    /**
     * Store record to database.
     *
     * @param IForm $form From having record properties.
     *
     * @return mixed
     * @throws ValidationException
     */
    public function store(IForm $form);

    /**
     * Find record by primary key.
     *
     * @param int $id Primary key.

     * @return mixed
     */
    public function findById($id);

    /**
     * Remove record using primary key.
     *
     * @param int $id Primary key.
     *
     * @return mixed
     */
    public function remove($id);

}
