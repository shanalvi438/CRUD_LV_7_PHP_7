$(document).ready(function () {

    /**
     * Create product modal
     */
    $("#create-product-btn").click(function () {

        $.ajax({
            url: base_url + '/admin/products/create',
            success: function (data) {

                $("#create-product-modal .modal-body").html(data)
                    .find(".submit").addClass("hidden");

                $("#create-product-modal").modal('show');
            }
        })
    });

    /**
     * Create sub-product modal
     */
    $("#create-sub-product-btn").click(function () {

        $.ajax({
            url: base_url + '/admin/sub-products/create',
            success: function (data) {

                $("#create-product-modal .modal-body").html(data)
                    .find(".submit").addClass("hidden");

                $("#create-product-modal").modal('show');
            }
        })
    });

    /**
     * Create product, Form Success Event
     */
    $(document).on("form-success-event", "#product-form", function (event, data) {
        $(this).find('input').val('');
        window.location = base_url + '/admin/products/' + data.data.id + '/edit';
    });

    /**
     * Create sub-product, Form Success Event
     */
    $(document).on("form-success-event", "#create-product-modal #sub-product-form", function (event, data) {
        $(this).find('input').val('');
        window.location = base_url + '/admin/sub-products';
    });

    /**
     * Edit sub-product, Form Success Event
     */
    $(document).on("form-success-event", "#edit-sub-product-modal #sub-product-form", function (event, data) {
        $(this).find('input').val('');
        window.location.reload();
    });

    /**
     * Module fields selection modal
     */
    $(".edit-module-fields-btn").click(function () {

        var moduleId = $(this).attr('data-id');
        $.ajax({
            url: base_url + '/admin/product-modules/' + moduleId + '/fields',
            success: function (data) {
                $("#edit-fields-modal .modal-body").html(data);
                $("#edit-fields-modal").modal('show');
            }
        })
    });


    /*
     * Display sub-product edit modal
     */
    $(".edit-product-btn").click(function () {

        var subProductId = $(this).attr('data-id');

        $.ajax({
            url: base_url + "/admin/sub-products/" + subProductId + "/edit",
            success: function (data) {

                $("#edit-sub-product-modal .modal-body").html(data)
                    .find('.submit').addClass('hidden');
                $("#edit-sub-product-modal").modal('show');
            }
        })
    });

    /**
     *
     */
    $(".modal .submit").addClass("hidden");


    /**
     * Check If no module is selected
     */
    $('.edit-submit').click(function(e){
        e.preventDefault();
        var anyBoxesChecked = false;
        var formId = $(this).closest('.modal').find('form').attr('id');
        $('#' + formId + ' input[type="checkbox"]').each(function() {
            if ($(this).is(":checked")) {
                anyBoxesChecked = true;
                $('.edit-submit').closest('.modal').find('.submit').trigger('click')
            }
        });

        if (anyBoxesChecked == false) {
            $('.edit-error').addClass('show').removeClass('hidden');
        }
    });

    productYears($('#create-product-modal #product-form #years'));
    productYears($('#edit-product-modal #product-form #years'));

    /**
     * Display yrh_renewal_price and dealer_renewal_price if years is greater than 0
     */
    $(document).on('change', '#create-product-modal #product-form #years', function () {
        productYears($('#create-product-modal #product-form #years'));
    });
    $(document).on('change', '#create-product-modal #product-form #registration_type', function () {
        radioRegistrationField($('#create-product-modal #product-form #registration_type'));
    });
    $(document).on('change', '#edit-sub-product-modal #sub-product-form #years', function () {
        subProductYears($('#edit-sub-product-modal #sub-product-form #years'));
    });
    $(document).on('change', '#create-product-modal #sub-product-form #years', function () {
        subProductYears($('#create-product-modal #sub-product-form #years'));
    });
    $(document).on('change', '#edit-product-modal #product-form #years', function () {
        productYears($('#edit-product-modal #product-form #years'));
    });
    $(document).on('change', '#edit-product-modal #product-form #registration_type', function () {
        radioRegistrationField($('#edit-product-modal #product-form #registration_type'));
    });

    function productYears(years){
        if (years.val() === '0' || years.val() === undefined || years.val() === ''){
            $('#yrh_renewal_price').attr('readonly', true).parent('div').addClass('hidden');
            $('#dealer_renewal_price').attr('readonly', true).parent('div').addClass('hidden');
            $('#renewal_price').attr('readonly', true).parent('div').addClass('hidden');
        }
        if(years.val() > 0 ){
            $('#yrh_renewal_price').attr('readonly', false).parent('div').removeClass('hidden');
            $('#dealer_renewal_price').attr('readonly', false).parent('div').removeClass('hidden');
            $('#renewal_price').attr('readonly', false).parent('div').removeClass('hidden');
        }
    }


    function subProductYears(years){
        var renewal_price = $('#renewal_price');
        if (years.val() === '0' || years.val() === undefined || years.val() === ''){
            renewal_price.attr('readonly', true).parent('div').addClass('hidden');
            renewal_price.val(0);
        }
        if(years.val() > 0 ){
            renewal_price.attr('readonly', false).parent('div').removeClass('hidden');
            renewal_price.val(0);
        }
    }


    function radioRegistrationField(val){
        if (val.val() !== '2' || val.val() !== 2){
            $('#radio_type').attr('disabled', true).parent('div').addClass('hidden');
            $('#years').attr('readonly', false).parent('div').removeClass('hidden');
            $('#years').val(0);
            $('#yrh_renewal_price').val(0);
            $('#dealer_renewal_price').val(0);
        }
        if (val.val() === '2' || val.val() === 2){
            $('#radio_type').attr('disabled', false).parent('div').removeClass('hidden');
            $('#years').attr('readonly', true).parent('div').addClass('hidden');
            $('#yrh_renewal_price').attr('readonly', true).parent('div').addClass('hidden');
            $('#dealer_renewal_price').attr('readonly', true).parent('div').addClass('hidden');
        }
    }


    $(".submit-deletion-form-btn").click(function (e) {

        $("#login-confirmation-modal").modal('show');

        $(".login-confirmation-form").attr('data-product-id', '#' + $(this).closest('form').attr('id'));
    });


    $(".login-confirmation-form").on("form-success-event", function (event, data) {

        if (data.type == "success") {

            $("#login-confirmation-modal").modal('hide');
            $($(this).attr('data-product-id') + ' .submit').click();
        }
    });
});
