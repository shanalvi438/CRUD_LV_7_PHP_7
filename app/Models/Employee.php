<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $table = 'employees';
    protected $fillable = ['name', 'email', 'phone', 'company_id'];

    public function company()
    {
        return $this->belongsTo(Company::class,'company_id');
    }
}
