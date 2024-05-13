<?php


namespace App\Services;

/**
 * Interface INotification
 * @package App\Services\INotification
 */
interface INotification {

    public const CHAT = 1;
    public const POST = 2;
    public const ADMIN_NOTIFICATION = 3;


    public const STATUSES = [
        self::CHAT => 'CHAT',
        self::POST => 'POST',
        self::ADMIN_NOTIFICATION => 'ADMIN_NOTIFICATION',
    ];
}
