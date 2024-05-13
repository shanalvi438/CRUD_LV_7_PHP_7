<?php

namespace App\Traits;


trait NotificationTrait
{
    public static function sendNotification($user, $data)
    {
        $data        = [
            "to"           => $user->device_token,
            "notification" =>
                [
                    "title" =>  $data['title'] ?? config('app.name','FlashenPiraten'),
                    "text"  => $data['description'] ?? config('app.name', 'FlashenPiraten'),
                ],
            "data"         =>
                [
                    "title" => $data['title'] ?? config('app.name', 'FlashenPiraten'),
                    "text" => $data['description'] ?? config('app.name', 'FlashenPiraten') ,
                ],
        ];
        $dataString  = json_encode( $data );

        $headers = [
            'Authorization: key=' . config( 'app.firebase_server_key' ),
            'Content-Type: application/json',
        ];

        $ch = curl_init();

        curl_setopt( $ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
        curl_setopt( $ch, CURLOPT_POST, true );
        curl_setopt( $ch, CURLOPT_FAILONERROR, true );
        curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch, CURLOPT_POSTFIELDS, $dataString );

        curl_exec( $ch );

        return true;
    }

}
