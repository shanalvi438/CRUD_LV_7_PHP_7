@extends('layouts.master')
@section('main-content')
    <div class="col-md-12  mb-4">
        <div class="card text-left">

            <div class="card-body detail-page">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h4 class="card-title mb-2">Admin Details</h4>
                    </div>
                    <div class="col-md-6">
                        <div class="dropdown">
                            <div class="user align-self-end text-right">
                                <a href="{{route('admin')}}" class="btn btn-primary btn-rounded">Back</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="table office-table-view">
                    <ul class="list-group">

                        <div class="office-detail-row">
                            <li class="list-group-item width-50"><strong>Name</strong></li>
                            <li class="list-group-item width-50">{{$item['name']}}</li>
                        </div>

                        <div class="office-detail-row">
                            <li class="list-group-item width-50"><strong>E-Mail</strong></li>
                            <li class="list-group-item width-50">{{$item['email']}}</li>
                        </div>


                    </ul>
                </div>
            </div>
        </div>

    </div>

    <!-- end of col -->
@endsection
@section('page-js')
    <script src="{{asset('/assets/js/vendor/sweetalert2.min.js')}}"></script>
@endsection
