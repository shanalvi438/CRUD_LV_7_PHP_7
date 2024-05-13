<?php


namespace App\Http\Controllers\API;

/**
 * Interface IResponseCodes
 * @package App\Http\Controllers\API
 */
interface IResponseCodes {
    const SUCCESS = 200;
    const UNAUTHORISED = 401;
    const UNPROCESSABLE_ENTITY = 422;
    const INTERNAL_SERVER_ERROR = 500;
}
