/**
 * Load Create Fields Form
 */
$(".create-fields-btn").click(function () {
    var moduleId = $(this).attr('data-id');
    $.ajax({
        url: base_url + '/admin/modules/' + moduleId + '/fields/create',
        success: function (data) {
            $("#fields-modal .modal-body").html(data);
            $("#fields-modal").modal('show');
        }
    })
});

$(document).on('change', ".field-type", function(){
    $('.options').removeClass('show').addClass('hidden');
    if($.inArray($(this).val(), ['select', 'radio', 'checkbox']) !== -1){
        $('.add-option').removeClass('hidden').addClass('show');
    }else{
        $('.add-option').removeClass('show').addClass('hidden');
        $('.field-options').empty();
    }
});

$(document).on('click', '.add-option', function(){
    $('.field-options').append('<input type="text" name="options[]" class="form-control form-control-rounded mb-2 form-field-options" ' +
        'placeholder="Please enter option label" required>');
});

$('.submit-handler').click(function(){
    var error = false;
    $('.options').removeClass('show').addClass('hidden');
    if($.inArray($('.field-type').val(), ['select', 'radio', 'checkbox']) !== -1){
        if($('.form-field-options').length > 0){
            $('.form-field-options').each(function(i, option){
                if(!($(option).val())){
                    error = true;
                    $('.options').removeClass('hidden').addClass('show');
                    return false;
                }
                return false;
            });
        }else{
            error = true;
            $('.options').removeClass('hidden').addClass('show');
        }
    }
    if(!error){
        $('.modal-body form').submit();
    }
});
