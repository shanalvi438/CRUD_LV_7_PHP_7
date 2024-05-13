<?php

namespace App\Http\Controllers;

use Session;

class GeneralController extends Controller
{

    /**
     * @param string $filename
     *
     * @return mixed
     *
     */
    public function download( $filename = '' )
    {
        // Check if file exists in app/storage/file folder
        $file_path = storage_path() . "/app/public/" . $filename;
        $headers = array(
            'Content-Type: csv',
            'Content-Disposition: attachment; filename='.$filename,
        );
        if ( file_exists( $file_path ) ) {
            // Send Download
            return \Response::download( $file_path, $filename, $headers );
        }

        $msg     = 'File not found!';
        Session::flash( 'danger', $msg );

        return redirect()->back();
    }
}
