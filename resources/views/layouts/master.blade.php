<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="/images/icon.png" rel="icon">
    <link href="/images/icon.png" rel="BB">

    <title>{{ config('app.name', 'BB') }}</title>
    <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,400i,600,700,800,900" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.9/dist/css/bootstrap-select.min.css">
    @yield('before-css')
    {{-- theme css --}}
    <link id="gull-theme" rel="stylesheet" href="{{asset('/assets/styles/css/themes/lite-purple.min.css')}}">
    <link rel="stylesheet" href="{{asset('/assets/styles/vendor/perfect-scrollbar.css')}}">
    <link rel="stylesheet" href="{{asset('/assets/styles/css/session.css')}}">
    <link rel="stylesheet" href="{{asset('/assets/styles/css/responsive.css')}}">
    <link rel="stylesheet" href="{{asset('/assets/styles/vendor/toastr.css')}}">

    {{-- Font Awesome Css--}}
    <link rel="stylesheet" href="{{asset('/assets/styles/css/all.min.css')}}">
    {{-- Sweet Alert Css--}}
    <link rel="stylesheet" href="{{asset('/assets/styles/vendor/sweetalert2.min.css')}}">

    {{-- DatePicker Css--}}
    <link rel="stylesheet" href="{{asset('/assets/styles/css/datepicker.min.css')}}">

    <link rel="stylesheet" href="{{asset('/assets/styles/css/custom/style.css')}}">
    <link rel="stylesheet" href="{{asset('/assets/styles/css/jquery.datetimepicker.css')}}">
    <script src="{{asset('/assets/js/common-bundle-script.js')}}"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.9/dist/js/bootstrap-select.min.js"></script>

    <link href="https://www.jqueryscript.net/css/jquerysctipttop.css" rel="stylesheet" type="text/css">

{{-- page specific css --}}
    @yield('page-css')

    <style>
        /* The Modal (background) */
        #imgModal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 999; /* Sit on top */
            padding-top: 100px; /* Location of the box */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
        }

        /* Modal Content (Image) */
        #imgModal .modal-content {
            margin: auto;
            display: block;
            width: 80%;
            max-width: 700px;
        }

        /* Add Animation - Zoom in the Modal */
        #imgModal .modal-content {
            animation-name: zoom;
            animation-duration: 0.6s;
        }

        @keyframes zoom {
            from {transform:scale(0)}
            to {transform:scale(1)}
        }

        /* The Close Button */
        #imgModal #img-modal-close {
            position: absolute;
            top: 15px;
            right: 35px;
            color: #f1f1f1;
            font-size: 40px;
            font-weight: bold;
            transition: 0.3s;
        }

        #imgModal #img-modal-close:hover,
        #imgModal #img-modal-close:focus {
            color: #bbb;
            text-decoration: none;
            cursor: pointer;
        }

        /* 100% Image Width on Smaller Screens */
        @media only screen and (max-width: 700px){
            #imgModal .modal-content {
                width: 100%;
            }
        }
    </style>
</head>

<body class="text-left">

<!-- ============ Large SIdebar Layout start ============= -->

{{-- normal layout --}}
<div class="app-admin-wrap layout-sidebar-large clearfix">
@include('layouts.header-menu')
{{-- end of header menu --}}

    @include('layouts.sidebar')
    {{-- end of left sidebar --}}

    <!-- ============ Body content start ============= -->
    @include('partials.loader')
    <div class="main-content-wrap sidenav-open d-flex flex-column">
        <div class="main-content">
            @yield('main-content')
        </div>

        @include('layouts.footer')
    </div>
    <!-- ============ Body content End ============= -->
</div>
<!--=============== End app-admin-wrap ================-->

<!-- ============ Search UI Start ============= -->
@include('layouts.search')
<!-- ============ Search UI End ============= -->

<!-- ============ Large Sidebar Layout End ============= -->

<!-- ============ Modal Layout Start ============= -->

<div id="generic-modal" class="modal fade" tabindex="-1" role="dialog"
     aria-labelledby="generic-modal-title" aria-hidden="true">

    <div class="modal-dialog modal-lg">

        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="generic-modal-title">
                    Modal Title
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                {{-- Modal Content --}}
            </div>

            <div class="modal-footer">
                <button class="btn btn-primary btn-modal-save"
                        onclick="$(this).closest('.modal').find('.submit').trigger('click')">
                    Save
                </button>
                <button type="button" class="btn btn-secondary btn-modal-close" data-dismiss="modal">
                    Close
                </button>
            </div>
        </div>
    </div>
</div>
<!-- The Modal -->
<div id="imgModal" class="modal">

    <!-- The Close Button -->
    <span id="img-modal-close">&times;</span>

    <!-- Modal Content (The Image) -->
    <img class="modal-content" id="img01">
</div>
<!-- ============= Modal Layout End ============== -->


{{-- common js --}}
<script src="{{asset('/assets/js/vendor/toastr.min.js')}}"></script>
<script src="{{asset('/assets/js/custom/pagination.js')}}"></script>
{{-- page specific javascript --}}
@yield('page-js')
@yield('sweetalert-page-js')

{{-- theme javascript --}}
<script src="{{asset('/assets/js/es5/script.min.js')}}"></script>
<script src="{{asset('/assets/js/es5/sidebar.large.script.min.js')}}"></script>

{{-- Font Awesome Js--}}
{{--<script src="{{asset('/assets/js/all.min.js')}}"></script>--}}
<script src="{{asset('/assets/js/es5/customizer.script.min.js')}}"></script>

{{-- Custom Js --}}
<script src="{{asset('/assets/js/custom/custom.js')}}"></script>
<script src="{{asset('/assets/js/custom/ajax.js')}}"></script>
<script src="{{asset('/assets/js/jquery.simple-dtpicker.js')}}" type="text/javascript"></script>
<script src="{{asset('/assets/js/jquery.simple-dtpicker.js')}}" type="text/javascript"></script>
<script src="{{asset('/assets/js/jquery.datetimepicker.full.min.js')}}" type="text/javascript"></script>
<script type="text/javascript">
    // Get the modal
    var modal = document.getElementById("imgModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var imgs = document.getElementsByClassName("zoom-img");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    for (var i = 0; i < imgs.length; i++) {
        imgs.item(i).onclick = function(){
            modal.style.display = "block";
            modalImg.src = this.src;
        }
    }

    // Get the <span> element that closes the modal
    var span = document.getElementById("img-modal-close");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    $('.datetimepicker').datetimepicker({
        ownerDocument: document,
        contentWindow: window,
        rtl: false,
        format: 'Y-m-d H:i',
        formatTime: 'H:i',
        formatDate: 'Y-m-d',
        startDate:  false,
        step: 1,
        monthChangeSpinner: true,
        closeOnDateSelect: false,
        closeOnTimeSelect: false,
        closeOnWithoutClick: true,
        closeOnInputClick: true,
        openOnFocus: true,
        timepicker: true,
        datepicker: true,
        // use formatDate format (ex new Date() or '1986/12/08' or '-1970/01/05' or '-1970/01/05')
        defaultDate: false,
        minDateTime: "{{\Carbon\Carbon::now()->format('Y-m-d H:i')}}",

        yearStart: 2022,
        yearEnd: 2030,
        style: '',
        id: '',
    });
    
    $('body').on('click', '.datetimepicker', function(event){
        var target = $( event.target );
        target.datetimepicker({
        ownerDocument: document,
        contentWindow: window,
        rtl: false,
        format: 'Y-m-d H:i',
        formatTime: 'H:i',
        formatDate: 'Y-m-d',
        startDate:  false,
        step: 1,
        monthChangeSpinner: true,
        closeOnDateSelect: false,
        closeOnTimeSelect: false,
        closeOnWithoutClick: true,
        closeOnInputClick: true,
        openOnFocus: true,
        timepicker: true,
        datepicker: true,
        // use formatDate format (ex new Date() or '1986/12/08' or '-1970/01/05' or '-1970/01/05')
        defaultDate: false,
        minDateTime: "{{\Carbon\Carbon::now()->format('Y-m-d H:i')}}",

        yearStart: 2022,
        yearEnd: 2030,
        style: '',
        id: '',
    });
    });
</script>
@yield('bottom-js')
@include('partials.flash_messages')
</body>
</html>

