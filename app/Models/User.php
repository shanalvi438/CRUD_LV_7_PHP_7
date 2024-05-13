<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Bus;
use Laravel\Passport\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Illuminate\Database\Eloquent\SoftDeletes;
use willvincent\Rateable\Rateable;

/**
 * @property string $email
 * @property string $name
 * @property string $password
 * @property string $password_confirmation
 * @property string $device_token
 * @property string $signup_otp
 * @property string $pin
 * @property int $user_type
 * @property string $image
 * @property int $is_verified
 * @property int $is_approved
 * @property int $status
 *
 */
class User extends Authenticatable
{
    use HasApiTokens, Notifiable, ModelHelper, Billable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email',
        'name',
        'user_type',
        'image',
        'device_token',
        'is_verified',
        'is_approved',
        'status',


    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'pin',
        'password',
        'signup_otp',
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'is_verified' => 'boolean',
        'is_approved' => 'boolean',
        'status' => 'boolean',
    ];







}
