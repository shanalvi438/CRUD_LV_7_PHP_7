<?php
namespace App\Forms;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\MessageBag;
use Illuminate\Validation\ValidationException;

/**
 * Class BaseForm
 * @package App\Forms
 */
abstract class BaseForm implements IForm
{
    /**
     * @return MessageBag
     */
    public function errors(): MessageBag
    {
        return $this->getValidator()->errors();
    }

    /**
     * @return bool
     */
    public function passes(): bool
    {
        return $this->getValidator()->passes();
    }

    /**
     * @return bool
     */
    public function fails(): bool
    {
        return $this->getValidator()->fails();
    }

    /**
     * @return array|mixed
     */
    public function errorMessages()
    {
        return [];
    }

    /**
     * Load Form properties from given array
     *
     * @param array $params Array containing form data
     *
     * @return void
     */
    public function loadFromArray(array $params)
    {
        foreach ($params as $key => $value) {

            if (property_exists($this, $key)) {

                $this->$key = $value;
            }
        }
    }

    /**
     * @param $model
     */
    public function loadToModel($model){
        $keys = $model->getFillable();
        foreach($keys as $key){
            if(property_exists($this, $key) && !empty($this->$key)){
                $model->$key = $this->$key;
            }
        }
    }

    /**
     * @return \Illuminate\Contracts\Validation\Validator
     */
    private function getValidator(): \Illuminate\Contracts\Validation\Validator
    {
        return Validator::make($this->toArray(), $this->rules(), $this->errorMessages());
    }

    /**
     * @return mixed|void
     */
    public function validate()
    {
        $this->getValidator()->validate();
    }

    /**
     * @param $name
     * @return mixed
     */
    public function nameToClass($name){
        return str_replace(
            ['  ', ' '],
            '_',
            trim(
                str_replace(
                    ['/' , '&', ')', '(', '-', '%', '?'],
                    '',
                    strtolower($name)
                )
            )
        );
    }
}
