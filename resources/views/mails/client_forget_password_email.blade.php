@extends('mails.email_master_client')
@section('content')
    <tr>
        <td class="esd-block-text es-p20t es-p20b es-p30r es-p30l es-m-txt-l"
            bgcolor="#ffffff" align="left">
            <h4>Dear {{$user['name']}},</h4>
        </td>
    </tr>
    <tr>
        <td class="esd-block-text es-p20t es-p20b es-p30r es-p30l es-m-txt-l"
            bgcolor="#ffffff" align="left"><p>{{__('We have received your request for Password reset, the pin given below can
                be used to reset your password')}}</p></td>
    </tr>
    <tr>
        <td class="esd-block-button es-p35t es-p35b es-p10r es-p10l"
            align="center"><span class="es-button-border"
                                 style="border-color:#39772a;background:#01b3cf;padding: 10px;border-radius: 2px;color: #fff;font-weight: 800;">{{$user['pin']}}</span>
        </td>
    </tr>
@endsection
