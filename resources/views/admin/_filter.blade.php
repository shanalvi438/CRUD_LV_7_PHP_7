{!! Form::open(['url' => route('users'), 'method' => 'GET']) !!}
<div class="float-right">
    <label class="recordbtn">
        <div class="input-group mb-3">

            <div class="input-group-prepend">
                    <span class="input-group-text">
                        Records Per Page
                    </span>
            </div>
            <select class="form-control page-size-setter" name="pageSize">
                <option value="10" {{isset($params['pageSize']) ? $params['pageSize'] == 10 ? 'selected' : '' : ''}}>10</option>
                <option value="20" {{isset($params['pageSize']) ? $params['pageSize'] == 20 ? 'selected' : '' : 'selected'}}>20</option>
                <option value="30" {{isset($params['pageSize']) ? $params['pageSize'] == 30 ? 'selected' : '' : ''}}>30</option>
                <option value="50" {{isset($params['pageSize']) ? $params['pageSize'] == 50 ? 'selected' : '' : ''}}>50</option>
                <option value="100" {{isset($params['pageSize']) ? $params['pageSize'] == 100 ? 'selected' : '' : ''}}>100</option>
            </select>
        </div>
    </label>
</div>

<div id="accordian-filters">
    <button id="heading-filters" class="btn btn-gray-300 collapsed" type="button" data-toggle="collapse" data-target="#collapse-filters" aria-controls="collapse-filters" aria-expanded="false">
        <i class="i-Filter-2"></i>
        Filters
    </button>

    <div id="collapse-filters" class="custom-filters-row collapse" aria-labelledby="heading-filters" data-parent="#accordian-filters" style="">

        <div class="col-md-3 mt-3">
            <input class="form-control" placeholder="Name" name="filter[name]" value="{{$params['filter']['name'] ?? ''}}" type="text">
        </div>
{{--        <div class="col-md-3 mt-3">--}}
{{--            <input class="form-control" placeholder="Last Name" name="filter[lastname]" value="{{$params['filter']['lastname'] ?? ''}}" type="text">--}}
{{--        </div>--}}
        <div class="col-md-3 mt-3">
            <input class="form-control" placeholder="Email" name="filter[email]" type="email" value="{{$params['filter']['email'] ?? ''}}">
        </div>

        <div class="col-md-3 mt-3">
            <input class="form-control filter-date" placeholder="Date From"  autocomplete="off" name="filter[date_from]" type="text" value="{{$params['filter']['date_from'] ?? ''}}">
        </div>

        <div class="col-md-3 mt-3">
            <input class="form-control filter-date" placeholder="Date To" autocomplete="off" name="filter[date_to]" type="text" value="{{$params['filter']['date_to'] ?? ''}}">
        </div>
        <div class="col-md-3 mt-3 mb-3">

            <div class="row">

                <div class="col-md-6 p-0 pl-3">

                    <input class="btn btn-primary" type="submit" value="Search">
                </div>

                <div class="col-md-6 pl-1 buttonspace">

                    <a class="btn btn-warning custom-reset-btn" href="{{url('users')}}">
                        Reset
                    </a>
                </div>
            </div>
        </div>
        <div class="col-md-3"></div>
        <div class="col-md-3"></div>
    </div>
</div>
{!! Form::close() !!}


