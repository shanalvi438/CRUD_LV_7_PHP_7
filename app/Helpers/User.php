<?php

namespace App\Helpers;

use App\Services\Users\IUserType;

/**
 * Class User
 * @package App\Helpers
 */
class User
{
    /**
     * Check if user type is admin
     *
     * @param \App\Models\User $user User model object.
     *
     * @return bool
     */
    public static function isAdmin(\App\Models\User $user)
    {
        return self::isUserType($user, \App\Services\Users\IUserType::ADMIN);
    }

    /**
     * @param \App\Models\User $user
     *
     * @return bool
     */
    public static function isUser(\App\Models\User $user)
    {
        return self::isUserType($user, \App\Services\Users\IUserType::USER);
    }
    /**
     * Check if user is of given type
     *
     * @param \App\Models\User $user      User model object.
     * @param int              $user_type Type of user
     *
     * @return bool
     */
    private static function isUserType(\App\Models\User $user, $user_type): bool
    {
        return $user->user_type === $user_type;
    }
}
