<?php
namespace App\Forms;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Validation\ValidationException;

/**
 * Interface IForm
 * @package App\Forms
 */
interface IForm extends Arrayable
{
    /**
     * @return mixed
     */
    public function rules();

    /**
     * @return bool
     */
    public function passes();

    /**
     * @return boolean
     */
    public function fails();

    /**
     * @return mixed
     * @throws ValidationException
     */
    public function validate();

    /**
     *
     * @return mixed
     */
    public function errorMessages();

    /**
     * @return mixed
     */
    public function errors();

}
