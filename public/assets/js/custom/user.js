$(document).ready(function(){
    /*****************************************************************************
     *************************Create User Start **************************
     ******************************************************************************/
    // $("#user-create").submit(function(event) {
    //     event.preventDefault();
    //     var form_data = new FormData($('#user-create')[0]);
    //     $.ajaxSetup({
    //         headers: {
    //             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    //         }
    //     });
    //     $.ajax({
    //         url  : base_url() + "/admin/dealers/store",
    //         type : "POST",
    //         data : form_data,
    //         dataType : "JSON",
    //         cache: false,
    //         contentType: false,
    //         processData: false,
    //         beforeSend:function(){
    //             $('#user-create .form-error').html('');
    //             $('#user-create .btn-save').attr('disabled',true).text('Loading....');
    //         },
    //         success: function(response){
    //             if(response.type == "success"){
    //                 toastr.success("Dealer has been created Successfully", {
    //                     timeOut: "30000",
    //                 });
    //                 $('#user-create input').val('');
    //                 $('#user-create .btn-save').attr('disabled',false).text('Invite');
    //                 setTimeout(function(){
    //                     location.reload();
    //                 },3000);
    //             }
    //             else{
    //
    //             }
    //         },
    //         error:function(response)
    //         {
    //             var respObj = response.responseJSON;
    //             // showToaster('error', respObj.message);
    //             errors = respObj.errors;
    //             var keys   = Object.keys(errors);
    //             var count  = keys.length;
    //             for (var i = 0; i < count; i++)
    //             {
    //                 $('#user-create .'+keys[i]).html(errors[keys[i]]).focus();
    //             }
    //             $('#user-create .btn-save').attr('disabled',false).text('Invite');
    //         }
    //     });
    // });
    

    /*****************************************************************************
     *************************Complete User SignUp **************************
     ******************************************************************************/
    $("#complete-signup").submit(function(event) {
        event.preventDefault();
        var form_data = new FormData($('#complete-signup')[0]);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            url  : base_url() + "/complete/process",
            type : "POST",
            data : form_data,
            dataType : "JSON",
            cache: false,
            contentType: false,
            processData: false,
            beforeSend:function(){
                $('#complete-signup .form-error').html('');
                $('#complete-signup .btn-save').attr('disabled',true).text('Loading....');
            },
            success: function(response){
                if(response.type == "success"){
                    swal({
                        type: 'success',
                        title: 'Success!',
                        text: response.msg,
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-lg btn-success'
                    });
                }
                else{
                    swal({
                        type: 'error',
                        title: 'Error!',
                        text: 'Something went wrong!',
                        confirmButtonText: 'Dismiss',
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-lg btn-danger'
                    });
                }
                setTimeout(function(){
                    window.location.href = base_url();
                }, 3000)
            },
            error:function(response)
            {
                var respObj = response.responseJSON;
                // showToaster('error', respObj.message);
                errors = respObj.errors;
                var keys   = Object.keys(errors);
                var count  = keys.length;
                for (var i = 0; i < count; i++)
                {
                    $('#complete-signup .'+keys[i]).html(errors[keys[i]]).focus();
                }
                $('#complete-signup .btn-save').attr('disabled',false).text('Complete');
            }
        });
    });

    $("#reset-client-form").on("form-success-event", function (event, data) {
        if(data.type == 'success'){
            toastr.success(data.msg);
        }
        if(data.type == 'error'){
            toastr.error(data.msg);
        }
    });
});