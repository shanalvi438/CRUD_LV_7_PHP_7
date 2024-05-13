<?php

namespace App\Forms\Employee;

class UpdateEmployeeForm extends \App\Forms\BaseForm
{
   /* @var $name */
   public $name;

   /* @var $email */
   public $email;

   /* @var $phone */
   public $phone;

   
   /* @var $company_id */
   public $company_id;



   /**
    * @inheritDoc
    */
   public function toArray()
   {
       return [
           'name' => $this->name,
           'email' => $this->email,
           'phone' => $this->phone,
           'company_id' => $this->company_id,

       ];
   }

   /**
    * @inheritDoc
    */
   public function rules()
   {
       return [

            

       ];
   }
}
