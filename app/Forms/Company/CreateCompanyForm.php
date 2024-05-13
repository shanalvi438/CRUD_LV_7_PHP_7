<?php

namespace App\Forms\Company;

class CreateCompanyForm extends \App\Forms\BaseForm
{
    /* @var $name */
    public $name;

    /* @var $email */
    public $email;

    /* @var $logo */
    public $logo;



    /**
     * @inheritDoc
     */
    public function toArray()
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'logo' => $this->logo,

        ];
    }

    /**
     * @inheritDoc
     */
    public function rules()
    {
        return [
            'name' => 'required',
            'email' => 'required',
            'logo' => 'required',
             

        ];
    }
}
