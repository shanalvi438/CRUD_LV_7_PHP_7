
<div class="ajax-listing">
    <div class="table-responsive">
        <table class="display table table-striped table-bordered" style="width:100%">
            <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th class="text-center">Created At</th>
                <th class="text-center" style="min-width: 90px">Actions</th>
            </tr>
            </thead>
            <tbody>
            @if($items->count())
                @foreach($items as $item)
                    <tr>
                        <td>{{$item->name}}</td>
                        <td>{{$item->email}}</td>
                        <td>{{$item->phone}}</td>
                        <td>{{$item->company_id ? $item->company->name : "Null"}}</td>
                    
                        <td class="text-center">{{$item->created_at->format('d-m-y')}}</td>
                        <td class="text-center">
                            <a href="{{route('employees.show', $item->id)}}" class="text-success">
                                <i class="nav-icon i-Eye1 font-weight-bold"></i>
                            </a>
                            <a href="{{route('employees.edit', $item->id)}}" class="text-success">
                                <i class="nav-icon i-Pen-2 font-weight-bold"></i>
                            </a>
                            <form id="delete-form-{{$item->id}}" method="post" class="delete-form"
                                  action="{{route('employees.destroy', $item->id)}}">
                                {{csrf_field()}}
                                <input type="hidden" name="_method" value="DELETE">
                                <button class="text-danger submit p-0" type="submit">
                                    <i class="nav-icon i-Close-Window font-weight-bold"></i>
                                </button>
                            </form>
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
        {{ $items->links() }}
    </div>
</div>
