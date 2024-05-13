<?php


namespace App\Helpers;

use Carbon\Carbon;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;

/**
 * Class Settings
 * @package App\Helpers
 */
class Settings
{
    /**
     * Method: getAppName
     *
     * @return string
     */
    public static function getAppName(): string
    {
        return \config('app.name', 'ELTG');
    }

    /**
     * Get Date with proper format
     *
     * @param string $date Date without formatting
     *
     * @return string
     */
    public static function viewDate($date): string
    {
        return !empty($date)
            ? Carbon::parse($date)->format('d-m-Y')
            : '';
    }

    /**
     * Get date and time with proper format
     *
     * @param string $dateTime Date and time without formatting
     *
     * @return string
     */
    public static function viewDateTime($dateTime): string
    {
        return Carbon::parse($dateTime)->format('d-m-Y h:i a');
    }

    /**
     * Convert sting to boolean type.
     *
     * @param string $var Variable containging value.
     *
     * @return bool
     */
    public static function toBool($var): bool
    {
        return filter_var($var, FILTER_VALIDATE_BOOLEAN);
    }

    /**
     * Default page size for pagination
     *
     * @return int
     */
    public static function getPageSize()
    {
        return request()->input('pageSize') ?? 10;
    }

    /**
     * Get Page Size Options.
     *
     * @return array
     */
    public static function getPageSizeOptions(): array
    {
        $allowedOptions = [10, 20, 30, 50, 100];
        return array_combine(
            $allowedOptions,
            $allowedOptions
        );
    }

    /**
     * Get random string.
     *
     * @param int $length Length of string.
     *
     * @return false|string
     * @throws Exception
     */
    public static function strRandom($length = 10)
    {
        $str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';


        $str = str_repeat(
            $str,
            ceil($length / strlen($str)) + 1
        );
        return substr(
            str_shuffle(
                $str
            ),
            random_int(
                1,
                strlen($str) - $length
            ),
            $length
        );
    }

    /**
     * Method: getWebsiteLogoUrl
     *
     * @return Application|UrlGenerator|string
     */
    public static function getWebsiteLogoUrl()
    {
        return asset('public/images/logo.png');
    }

    /**
     * Method: privateFileLink
     * Generate links for the private files.
     *
     * @param $path
     *
     * @return Application|UrlGenerator|string
     */
    public static function privateFileLink($path)
    {
        return url($path);
    }
}
