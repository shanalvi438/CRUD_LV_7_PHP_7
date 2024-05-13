<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $table = 'companies';
    protected $fillable = ['name', 'email', 'logo'];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}
