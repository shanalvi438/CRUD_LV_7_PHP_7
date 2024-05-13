@extends('mails.email_master_client')
@section('content')
    <tr>
        <td class="esd-block-text es-p20t es-p20b es-p30r es-p30l es-m-txt-l"
            bgcolor="#ffffff" align="left">
            <h4>{{__('Dear')}} {{$user['name']}},</h4>
        </td>
    </tr>
    <tr>
        <td class="esd-block-text es-p20t es-p20b es-p30r es-p30l es-m-txt-l"
            bgcolor="#ffffff" align="left">
            <p>{{__('Thanks for registering at')}} {{config('app.name', 'Bar Fellow')}}</p>
        </td>
    </tr>
    <tr>
        <td class="esd-block-text es-p20t es-p20b es-p30r es-p30l es-m-txt-l"
            bgcolor="#ffffff" align="left">
            <p>{{__('Admin is reviewing your request, your account would soon be approved.')}}</p>
        </td>
    </tr>
@endsection
