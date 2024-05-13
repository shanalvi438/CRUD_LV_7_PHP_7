<div class="ajax-listing">
    <div class="table-responsive">
        <table class="display table table-striped table-bordered" style="width:100%">
            <thead>
            <tr>
                <th>Name</th>
                <th>E-Mail</th>
{{--                <th>Age</th>--}}
{{--                <th>Gender</th>--}}
{{--                <th>Fitness Goal</th>--}}
{{--                <th>Image</th>--}}
{{--                <th>Type Of Workout</th>--}}
                <th class="text-center">Created at</th>
                <th class="text-center" style="min-width: 90px">Action</th>
            </tr>
            </thead>
            <tbody>
            @if($items->count())
                @foreach($items as $item)
                    <tr>
                        <td>{{$item['name']}}</td>
                        <td>{{$item['email'] ?? ''}}</td>
{{--                        <td>--}}
{{--                            @if($item->age)--}}
{{--                                {{$item['age'] ?? ''}}--}}
{{--                            @else--}}
{{--                                ---}}
{{--                            @endif--}}
{{--                        </td>--}}
{{--                        <td> @if($item->gender)--}}
{{--                                {{$item['gender'] ?? ''}}--}}
{{--                            @else--}}
{{--                                ---}}
{{--                            @endif</td>--}}
{{--                        <td> @if($item->fitness_goal)--}}
{{--                                {{$item['fitness_goal'] ?? ''}}--}}
{{--                            @else--}}
{{--                                ---}}
{{--                            @endif</td>--}}
{{--                        <td>--}}
{{--                            @if($item->image)--}}
{{--                                <img height="50" src="{{ asset('public/'.$item->image ?? null) }}"--}}
{{--                                     class="rounded-circle m-0 avatar-sm-table">--}}
{{--                            @else--}}
{{--                                ---}}
{{--                            @endif--}}
{{--                        </td>--}}
{{--                        <td>{{@$item->typeOfWorkout->name}}</td>--}}

                        <td class="text-center">{{$item->created_at->format('d-m-Y')}}</td>
                        <td class="text-center">
                            <a href="{{route('admin-show',$item->id)}}" class="text-success">
                                <i class="nav-icon i-Eye1 font-weight-bold"></i>
                            </a>

{{--                            <form id="delete-form-{{$item->id}}" method="post" class="delete-form"--}}
{{--                                  action="{{url('user-delete'.$item->id)}}">--}}
{{--                                {{csrf_field()}}--}}
{{--                                <input type="hidden" name="_method" value="DELETE">--}}
{{--                                <button class="text-danger submit p-0" type="submit">--}}
{{--                                    <i class="nav-icon i-Close-Window font-weight-bold"></i>--}}
{{--                                </button>--}}
{{--                            </form>--}}
                        </td>

                        </td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="9" align="center">
                        <strong class="red-text">Record not found</strong>
                    </td>
                </tr>
            @endif

            </tbody>
        </table>
    </div>
    <div class="pagination-container">
        {{isset($items) ? $items->appends(request()->except('page'))->links() : ''}}
    </div>
</div>
