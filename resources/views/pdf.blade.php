<!DOCTYPE html>
<html lang="en">

<head>
    <title>PDF</title>
    <meta charset="utf-8">
    <style>
        @page {
            margin: 0px;
            padding: 0px;
        }
    </style>
</head>

<body style="padding: 0px; margin:0px;">

<table style="font-family: sans-serif; width: 100%; margin: 0 auto; border-collapse: collapse;">
    <tr>
        <td style="width: 75%; background-size: 100%; vertical-align: top; height: 200px;">
            <img src="{{asset('public/images/bb.jpg')}}" style="height:100px; margin-top: 20px; margin-left: 15px;" alt=""/>
            <h1 style="font-size: 30px; color: #469a15; font-weight: bold; margin-top: 5px; padding-left: 10px; text-transform: uppercase;">
                Receipt</h1>
        </td>
        <td style="text-align: right">
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <table style="width: 100%; border-collapse: collapse; padding: 15px;">
                <tr>
                    <td width="100%" colspan="2">
                        <span style="font-size: 16px; font-weight: bold; color: #469a15;">Receipt Title: </span>
                        <span style="font-size: 16px; font-weight: 400; color: #363a45;">{!! $title !!}</span>
                    </td>
                </tr>
                <tr>
                    <td width="100%" colspan="2">
                        <span style="font-size: 16px; font-weight: 400; color: #363a45;">{!! $description ?? '' !!}</span>
                    </td>
                </tr>
                <tr>
                    <td width="100%" colspan="2">
                        <span style="font-size: 16px; font-weight: bold; color: #469a15;">Company Name:</span>
                        <span style="font-size: 16px; font-weight: 400; color: #363a45;">{!! $company['name'] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td width="100%" colspan="2">
                        <span style="font-size: 16px; font-weight: bold; color: #469a15;">Company Url:</span>
                        <span style="font-size: 16px; font-weight: 400; color: #363a45;">{!! $company['url'] !!}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<table style="font-family: sans-serif; width: 100%; border-collapse: collapse; padding: 0 15px; margin: 0 2px; ">
    <tr style="background: #469a15;">
        <th style="width:15%; padding:15px 5px; color: #fff; text-align: center;">Product</th>
        <th style="width:15%;padding:15px 5px; color: #fff; text-align: center;">Pr.Price</th>
        <th style="width:15%;padding:15px 5px; color: #fff; text-align: center;">Quantity</th>
        <th style="width:15%; padding:15px 5px; color: #fff; text-align: center;">Price</th>
    </tr>
</table>
<table style="font-family: sans-serif; width: 100%; border-collapse: collapse; padding: 0 15px; margin: 0 2px; ">
    @if(count($content->items) > 0)
        @foreach($content->items as $key => $item)
            <tr>
                <td style="width:15%; word-wrap:break-word; padding: 15px 5px; background: #469a1587; color: #363a45; font-weight: bold; border-bottom: #c3c1c7 solid 1px;">{{$item->name}}</td>
                <td style="width:15%; word-wrap:break-word; padding: 15px 5px; background: #f7f5fa; color: #363a45; font-weight: 700; text-align: center; border-bottom: #c3c1c7 solid 1px;">
                    $ {{$item->price}}</td>
                <td style="width:15%; word-wrap:break-word; padding: 15px 5px; background: #f7f5fa; color: #363a45; font-weight: 700; text-align: center; border-bottom: #c3c1c7 solid 1px;">{{$item->quanity}}</td>
                <td style="width:15%; word-wrap:break-word; padding: 15px 5px; background: #efeaf5; color: #363a45; font-weight: bold; text-align: center; border-bottom: #c3c1c7 solid 1px;">
                    $ {{$item->total}}</td>
            </tr>
        @endforeach
        <tr>
            <td></td>
            <td></td>
            <td style="padding: 15px; background: #469a1587; font-weight: bold; color: #363a45; text-align: center;">
                VAT:
            </td>
            <td style="padding: 15px 10px; background: #469a1587; font-weight: bold; color: #363a45; text-align: center;">
                $ {{$content->vat}}</td>
        </tr>
            <tr>
            <td></td>
            <td></td>
            <td style="padding: 15px; background: #469a1587; font-weight: bold; color: #363a45; text-align: center;">
                Discount:
            </td>
            <td style="padding: 15px 10px; background: #469a1587; font-weight: bold; color: #363a45; text-align: center;">
                $ {{$content->discount}}</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td style="padding: 15px; background: #469a15; font-weight: bold; color: #fff; text-align: center;">Total:
            </td>
            <td style="padding: 15px 10px; background: #469a15; font-weight: bold; color: #fff; text-align: center;">
                $ {{$content->total}}</td>
        </tr>
    @else
        <table
            style="font-family: sans-serif; width: 100%; border-collapse: collapse; padding: 0 15px; margin: 0 2px; ">
            <tr>
                <td style="text-align: center;" colspan="4">No items added!</td>
            </tr>
        </table>
    @endif
</table>
</body>

</html>

