@extends('mails.email_master_admin')
@section('content')
    <tr>
        <td class="esd-block-text es-p20t es-p20b es-p30r es-p30l es-m-txt-l"
            bgcolor="#ffffff" align="left"><h4>{{__('Hello Support Manager')}},</h4></td>
    </tr>
    <tr>
        <td class="esd-block-text es-p20t es-p20b es-p30r es-p30l es-m-txt-l"
            bgcolor="#ffffff" align="left"><p>{{__('A new support request is generated, by one of our users.')}}</p></td>
    </tr>
    <tr>
        <td class="esd-block-text es-p20t es-p20b es-p30r es-p30l es-m-txt-l"
            bgcolor="#ffffff" align="left"><p>{{__('Request was generated from')}} {{$request['client_email']}}.</p>
        </td>
    </tr>
    <tr>
        <td class="esd-block-text es-p20t es-p20b es-p30r es-p30l es-m-txt-l"
            bgcolor="#ffffff" align="left"><p>{{$request['title']}}</p>
        </td>
    </tr>
    <tr>
        <td class="esd-block-text es-p20t es-p20b es-p30r es-p30l es-m-txt-l"
            bgcolor="#ffffff" align="left"><p>{{$request['message']}}</p>
        </td>
    </tr>
@endsection
