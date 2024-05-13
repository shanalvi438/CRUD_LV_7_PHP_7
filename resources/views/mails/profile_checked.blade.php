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
            <p>{{__('Someone Checked Your Profile')}}</p>
        </td>
    </tr>
@component('mail::button',['url'=>'http://bb.test/'])
    visit now
@endcomponent
    Thanks,<br>
    {{config('app.name', 'BB')}}

@endsection
