@if(isset($item))
    {!! Form::open(['url' => route('employees.update', $item['id']), 'class' => 'ajax', 'method' => 'put', 'id' => 'update-employee-form']) !!}
@else
    {!! Form::open(['url' => route('employees.store'), 'class' => 'ajax', 'method' => 'post', 'id' => 'create-employee-form']) !!}
@endif
<div class="row">
    {{ csrf_field() }}
    <div class="col-md-6 form-group mb-3">
        <label for="name">Name <span class="required">*</span></label>
        {!! Form::text('name', $item->name ?? '', ['class' => 'form-control form-control-rounded', 'id' => 'name']) !!}
        <div class="form-error name"></div>
    </div>
    <div class="col-md-6 form-group mb-3">
        <label for="email">Email <span class="required">*</span></label>
        {!! Form::text('email', $item->email ?? '', ['class' => 'form-control form-control-rounded', 'id' => 'email']) !!}
        <div class="form-error email"></div>
    </div>
    <div class="col-md-6 form-group mb-3">
        <label for="phone">Phone <span class="required">*</span></label>
        {!! Form::number('phone', $item->phone ?? '', ['class' => 'form-control form-control-rounded', 'id' => 'phone']) !!}
        <div class="form-error phone"></div>
    </div>
    <div class="col-md-6 form-group mb-3">
        <label for="company_id">Company <span class="required">*</span></label>
        {!! Form::select('company_id', \App\Services\EmployeeService::allWithIdAndName(), $item->company_id ?? '', ['class' => 'form-control form-control-rounded', 'id' => 'company_id', 'placeholder' => 'Please Select']) !!}
        <div class="form-error company_id"></div>
    </div>

   

    <div class="col-md-12">
       
        <button type="submit" class="btn btn-primary submit">Save</button>
    </div>
</div>

{!! Form::close() !!}
<script type="text/javascript">
    // var input   = $('\inputfile')[0];
    let label = $('.inputfilelabel')[0];
    labelVal = label.innerHTML;

    $('input[type=file]').on('change', function (e) {
        let file = e.target.files[0];
        let filename = file.name;
        if (filename) {
            let reader = new FileReader();
            reader.onload = function (e2) {
                $('#target').html('<img class="office-logo rounded img-thumbnail" src="' + e2.target.result + '" alt="">');
            };
            reader.readAsDataURL(file);
            label.innerHTML = filename;
        } else {
            label.innerHTML = labelVal;
        }
    });
</script>
