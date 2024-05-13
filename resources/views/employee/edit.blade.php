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
                            <h4 class="card-title">Edit employee</h4>
                        </div>

                        <div class="col-md-6 text-right">
                            <a href="{{route('employees.index')}}" class="btn btn-primary btn-rounded">
                                Back
                            </a>
                        </div>
                    </div>

                    <section>
                        <div id="form">
                            @include('employee._form')
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('bottom-js')
    <script>
        // Order status success form
        $("#update-employee-form").on(
            "form-success-event",
            function (event, responsse) {

                if (responsse.type == "success") {
                    window.location.href = "{{ route('employees.index')}}";
                }
            }
        );
    </script>
@endsection
@section('page-js')
    <script src="{{asset('public/assets/js/custom/pagination.js')}}"></script>
    <script src="{{asset('public/assets/js/vendor/sweetalert2.min.js')}}"></script>
@endsection
