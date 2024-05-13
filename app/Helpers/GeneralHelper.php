<?php


namespace App\Helpers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

/**
 * Class GeneralHelper
 * @package App\Helpers
 */
class GeneralHelper {

    /**
     * @param $image
     * @param $path
     * @param bool $unlinkOld
     * @param null $old_image
     *
     * @return string
     */
    public static function uploadImage($image, $path, $unlinkOld = false, $old_image = null) {
        $name = time() . '.' . $image->getClientOriginalExtension();
        if (!File::isDirectory($path)) {
            File::makeDirectory($path, 0777, true, true);
        }
        Storage::disk('public')->putFileAs($path, $image, $name);
        $full_image_name = $path . '/' . $name;
        (!$unlinkOld) ?: self::removeFile($old_image);
        return $full_image_name;
    }

    /**
     * @param $file
     * @param $path
     * @param false $unlinkOld
     * @param null $old_file
     * @return string
     */
    public static function uploadfile($file, $path, $unlinkOld = false, $old_file = null) {
        $name = time() . '.' . $file->getClientOriginalExtension();
        $type = $file->getClientOriginalExtension();
        if (!File::isDirectory($path)) {
            File::makeDirectory($path, 0777, true, true);
        }
        Storage::disk('public')->putFileAs($path, $file, $name);
        $full_file_name = $path . '/' . $name;
        !$unlinkOld || self::deleteFile($old_file);
        
        return [ 'media_type' => $type, 'path' => $full_file_name];
    }

    /**
     * @param $files
     * @param $path
     *
     * @return array
     */
    public static function uploadMultiImages($files, $path): array
    {
        $paths = [];
        foreach ($files as $file) {
            $name = self::uploadImage($file, $path);
            array_push($paths, $name);
        }
        return $paths;
    }
    /**
     * @param $image
     * @param $path
     * @param bool $unlinkOld
     * @param null $old_image
     *
     * @return string
     */
    public static function uploadImageManual($image, $path, $unlinkOld = false, $old_image = null) {
        $extension = $image->getClientOriginalExtension();
        if (!File::isDirectory($path)) {
            File::makeDirectory($path, 0777, true, true);
        }

        $destinationPath = public_path() . '/'.$path.'/'. date('Ymd', time());
        $image_path = $path.'/'.date('Ymd', time());
        $fullName = $image->getClientOriginalName();
        $onlyName = explode('.' . $extension, $fullName);
        $file_name = date('Ymdhsi', time()) . "." . $extension;
        $file_path = $file_name;
        $file_name = $image_path.'/'. $file_name;
        $image->move($destinationPath, $file_name);

        (!$unlinkOld) ?: self::removeFile($old_image);
        return $file_name;
    }



    /**
     * @param $image
     * @param $path
     * @return string
     */
    public static function duplicateFile($image, $path) {

        $filePath           = $path.'/'. date('Ymd', time());
        $destinationPath    = public_path() . '/' . $filePath;
        $oldImageName       = public_path() . '/'.$image;

        if(file_exists($oldImageName)) {
            if (!File::isDirectory($destinationPath)) {
                File::makeDirectory($destinationPath, 0777, true, true);
            }

            $file_part = explode('.', $image);
            $newFileName = date('Ymdhsi', time()) . '.' . $file_part[1];
            $full_name = $destinationPath . '/' . $newFileName;
            if (\File::copy($oldImageName, $full_name)) {
                return $filePath . '/' . $newFileName;
            }
        }
        return FALSE;
    }

    /**
     * @param $image
     * @param $path
     * @param bool $unlinkOld
     * @param null $old_image
     *
     * @return string
     */
    public static function uploadImageBase64($image, $path, $unlinkOld = false, $old_image = null) {

        $file = base64_decode($image);
        $destinationPath = public_path() . '/'.$path.'/'. date('Ymd', time());

        if (!File::isDirectory($destinationPath)) {
            File::makeDirectory($destinationPath, 0777, true, true);
        }

        $file_name = date('Ymdhsi', time()) . '.' .'png';
        file_put_contents($destinationPath.'/'.$file_name, $file);

        (!$unlinkOld) ?: self::removeFile( public_path().$old_image);
        return $path.'/'.$file_name;
    }

    /**
     * @param $path
     *
     * @return bool
     */
    public static function removeFile($path) {
        return @unlink('storage/' . $path ?? '');
    }

    /**
     * @param $path
     * @return bool
     */
    public static function deleteFile($path) {
        return @unlink('storage/' . $path ?? '');
    }

    /**
     * @param $path
     *
     * @return bool
     */
    public static function removeFilePublic($path) {
        return @unlink('public/' . $path ?? '');
    }

    /**
     * @return bool
     */
    public static function whoAmI() {
        $guards = array_keys(config('auth.guards'));
        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                return $guard;
            }
        }

        return 'web';
    }

    /**
     * @return mixed
     */
    public static function authenticated() {
        return Auth::guard(whoAmI())->check();
    }

    /**
     * @return int|null
     */
    public static function myId() {
        return mySelf()->id;
    }

    /**
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public static function mySelf() {
        return auth()->guard(whoAmI())->user();
    }

    /**
     * @param $date
     *
     * @return mixed
     */
    public static function dateReadable($date) {

        if ($date instanceof Carbon) {
            return $date->diffForHumans();
        }

        return \Carbon\Carbon::createFromTimestamp(strtotime($date))->diffForHumans();
    }

    /**
     * @param $to
     * @param $data
     *
     * @return mixed
     */
    public static function mailService($to, $data) {
//        return \Illuminate\Support\Facades\Mail::to($to)->send(new App\Mail\MailHandler($data));
    }

    /**
     * @param $msg
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public static function error($msg, $path = null) {
        return ($path == null)
            ? redirect()->back()->with(['message' => $msg, 'alert_type' => 'error'])
            : redirect($path)->with(['message' => $msg, 'alert_type' => 'error']);
    }

    /**
     * @param $msg
     * @param null $data
     * @param bool $status
     * @param int $code
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public static function json($msg, $data = null, $status = true, $code = 200) {
        return response()->json(['msg' => $msg, 'data' => $data, 'status' => $status], $code);
    }

    /**
     * @param $msg
     * @param null $path
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public static function success($msg, $path = null) {
        return ($path == null)
            ? redirect()->back()->with(['message' => $msg, 'alert_type' => 'success'])
            : redirect($path)->with(['message' => $msg, 'alert_type' => 'success']);
    }

    /**
     * @param $request
     * @param null $data
     * @param null $msg
     * @param null $path
     *
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public static function sendResponse($request, $data = null, $msg = null, $path = null) {
        if($request->ajax())
            return ($data)
                ? json($msg, $data)
                : json('Something went wrong', null, false, 500);
        else
            return ($data)
                ? success($msg, $path)
                : error('Something went wrong');
    }

    /**
     * @param $message
     * @param $type
     *
     * @return string
     */
    public static function toast($message, $type) {
        return "<script>toastr.{$type}('{$message}');</script>";
    }

    /**
     * @param $data
     *
     * @return object
     */
    public static function toObject($data) {
        return (object) $data;
    }

    /**
     * @param $data
     *
     * @return mixed
     * @throws Exception
     */
    public static function dataTable($data) {
        return datatables()->of($data)->toJson();
    }

    /**
     * @param $value
     * @param $percentage
     *
     * @return float|int
     */
    public static function calPercentageValue( $value, $percentage ) {
        return ( $percentage / 100 ) * $value;
    }

    /**
     * String Conversion.
     *
     * @param string $string     String to be converted.
     * @param string $case     Case of output name string.
     * @param null   $splitter Splitter to separate the words.
     *
     * @return mixed
     */
    public static function strConvert($string, $case = 'lower', $splitter = null)
    {
        // Replace connected sign with space
        $string = str_replace(['-', '.', '_'], ' ', $string);

        // Apply relative case
        switch ($case) {
            case 'upper':
                $string = strtoupper($string);
                $splitter = $splitter ?? '_';
                break;
            case 'camel':
                $string = ucwords($string);
                $splitter = $splitter ?? '';
                break;
            case 'lower':
            default:
                $string = strtolower($string);
                $splitter = $splitter ?? '_';
                break;
        }

        return str_replace(
            ['  ', ' '],
            $splitter,
            trim(
                str_replace(
                    ['/' , '&', ')', '(', '-', '%', '?', '.'],
                    '',
                    $string
                )
            )
        );
    }
}
