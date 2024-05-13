<?php

namespace App\Helpers;

use Hashids\Hashids;
use Hash;

/**
 * Class DirectoryHelper
 * @package App\Helpers
 */
class DirectoryHelper
{
    /**
     * @param  $id
     * @return string
     */
    public static function encryptId($id)
    {
        $hashids = new Hashids('', 10);
        return $hashids->encode($id);
    }

    /**
     * @param  $id
     * @return mixed
     */
    public static function decryptId($id)
    {
        $hashids = new Hashids('', 10);
        $id  = $hashids->decode($id);
        return $id[0];
    }

    /**
     * Get hash encrypted string
     *
     * @param string $string content of file
     *
     * @return string
     */
    public static function encryptString($string)
    {
        return Hash::make($string);
    }

    /**
     * Get directory path of main model
     *
     * @param int    $id   Id of model
     * @param string $type Type of model
     *
     * @return array
     */
    public static function getPath($id, $type)
    {
        $encId = self::encryptId($id);
        $relative_path = 'uploads/'.$type.'/'.$encId.'/';
        $web_path = asset('storage/uploads/'.$type.'/'.$encId).'/';
        return ['relative_path' => $relative_path, 'web_path' => $web_path];
    }


}
