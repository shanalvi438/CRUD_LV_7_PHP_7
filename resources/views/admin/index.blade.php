@extends('layouts.master')
@section('page-css')
    <link rel="stylesheet" href="{{asset('public/assets/styles/vendor/datatables.min.css')}}">
@endsection

@section('main-content')
    <div class="row mb-4">
        <div class="col-md-12 mb-4">
            <div class="card text-left">
                <div class="card-body">
                    <div class="row p-3 items-align-center">
                        <div class="col-md-6">
                            <h4 class="card-title">Admin</h4>

                        </div>

                    </div>

                    <section>
                        <div id="itemlis">

                            @include('admin._list')
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('bottom-js')
    <script>
        {{-- Date Created Filter Datepicker --}}
        $(".filter-date").datepicker({
            showButtonPanel: true,
            autoHide: true,
            format: 'dd-mm-yyyy',
        });

    </script>
@endsection
@section('page-js')
    <script src="{{asset('public/assets/js/vendor/sweetalert2.min.js')}}"></script>
@endsection
