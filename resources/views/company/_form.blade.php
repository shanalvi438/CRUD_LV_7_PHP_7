@if(isset($item))
    {!! Form::open(['url' => route('companies.update', $item['id']), 'class' => 'ajax', 'method' => 'put', 'id' => 'update-company-form']) !!}
@else
    {!! Form::open(['url' => route('companies.store'), 'class' => 'ajax', 'method' => 'post', 'id' => 'create-company-form']) !!}
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
        <label for="logo" class="col-md-12">Logo</label>
        {!! Form::file('logo', ['class' => 'inputfile', 'id' => 'logo', 'data-preview-file-type' => 'text']) !!}
        <label for="logo" class="inputfilelabel"><strong>Choose a file</strong></label>
        <div class="form-error logo"></div>
        <div id="targetV" class="mt-4">
            @if(isset($item))
                @if($item['logo'])
                    <img class="office-logo rounded img-thumbnail" src="{{ asset($item->logo) }}"
                         alt="">
                @endif
            @endif
        </div>
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
