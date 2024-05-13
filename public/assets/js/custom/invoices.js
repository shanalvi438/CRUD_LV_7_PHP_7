/**
 * OrderStatus class
 *
 * @constructor
 */
InvoiceStatus = {
     DRAFT              : 0,
     INVOICE_NOT_SEND   : 1,
     PENDING_PAYMENT    : 2,
     PAYMENT_COMPLETE   : 3,
     NOT_PAID           : 4,
     OVERDUE_INVOICE    : 5
};

$(document).ready(function() {

    $('.create-invoice-page .card-to .card-body select:not(.country-select)').on('change', function () {
        displayPageLoader();
        // Save and validate item
        var elem = $(this);
        if(elem.hasClass('')){
            return;
        }
        $.ajax({
            url: "/admin/invoices/add-to",
            type: "POST",
            data: {
                name: elem.attr('name'),
                value: elem.val()
            },
            success: function(data) {
                if (data.type === "success") {
                    if(elem.attr('name') === 'order'){
//                        storeOrderLineItems(elem.val(), data.data['id'] );
                    }
                    window.location.replace('/admin/invoices/'+data.data['id']+'/edit');
                    hidePageLoader();
                }

                if (data.type === "error") {
                    $(elem)
                        .closest(".form-group")
                        .append(`<div class="form-error">${data.msg}</div>`);
                    hidePageLoader();
                }
            }
        });
    });

    $('.edit-invoice-page .card-to .card-body select:not(.country-select)').on('change', function () {
        displayPageLoader();
        // Save and validate item
        var elem = $(this);
        if(elem.hasClass('')){
            return;
        }
        $.ajax({
            url: "/admin/invoices/"+ $('#invoice_id').val()+'/add-to',
            type: "POST",
            data: {
                name: elem.attr('name'),
                value: elem.val()
            },
            success: function(data) {
                if (data.type === "success") {
                    var parent = elem.parent().parent();
                    var sibling = parent.next();
                    parent.addClass('hidden');
                    sibling.removeClass('hidden');
                    sibling.children('p.invoiceable_value_p').first().children('span.invoiceable_value').first().text(data.data['to']);
                    updateAddressInfo(data.data);
                    if(elem.attr('name') === 'order'){
                        updateGeneralInfo(data.data);
                        storeOrderLineItems(elem.val());
                    }else{
                        hidePageLoader();
                    }
                    toastr.success(data.msg);
                }

                if (data.type === "error") {
                    $(elem)
                        .closest(".form-group")
                        .append(`<div class="form-error">${data.msg}</div>`);
                    hidePageLoader();
                }
            }
        });
    });

    $('.card-general .card-body input, .card-address .card-body input, .card-address .card-body select, .card-address .card-body textarea')
        .on('change', function () {
        displayPageLoader();
        var elem = $(this);
        $.ajax({
            url: "/admin/invoices/"+ $('#invoice_id').val(),
            type: "PUT",
            data: elem.serialize(),
            success: function(data) {
                if (data.type === "success") {
                    hidePageLoader();
                }
            }
        });
    });

    $('.card-general .card-body select').on('change', function () {
        displayPageLoader();
        // Save and validate item
        var elem = $(this);
        $.ajax({
            url: "/admin/invoices/"+ $('#invoice_id').val()+"/update-status",
            type: "POST",
            data: elem.serialize(),
            success: function(data) {
                var invoice = data.data;
                if (data.type === "success") {
                    hidePageLoader();
                    if(invoice.status == 3 ){
                        var parts = window.location.pathname.slice(1, -1).split("/");
                        parts.pop();
                        window.location.href = "/" + parts.join("/") + "/";
                    }
                }
            }
        });
    });

    $("#send_to_form").on("form-success-event", function(event, data) {
        if (data.type === 'success') {
            var parts = window.location.pathname.slice(1, -1).split("/");
            parts.pop();
            window.location.href = "/" + parts.join("/") + "/";
        }
    });

    $("#client-email-form").on("form-success-event", function(event, data) {
        if (data.status === 2) {
            showSuccessClient(data.data.data);
        }
        if (data.status === 3) {
            showSuccessClient(data.data);
        }
        if (data.status === 1) {
            $("#client_form_email_conf").html(data.msg);
        }
    });

    $('#view_change_btn').on('click', function () {
        let productSelect = $('#product-select');
        productSelect.removeAttr('required');
    });

    $('.product-select.browser-default.selectpicker').on('change', function () {
        let val = $('.product-select.browser-default.selectpicker').val();
        $(".product-select.browser-default.selectpicker option[value="+val+"]").attr('selected', true);
    });

    var table = $('#invoice-table-table');

    $('#product_th').each(function()
    {
        var th = $(this);
        //$('<i class="ui-icon ui-icon-caret-2-n-s"></i>').insertAfter(th);
        th.css("cursor","pointer");
        th.append('<i class="ui-icon ui-icon-caret-2-n-s"></i>');
        var thIndex = th.index();
        var inverse = false;
        th.click(function()
        {
            th.siblings().find("i.ui-icon").removeClass("ui-icon-caret-1-n").removeClass("ui-icon-caret-1-s").addClass("ui-icon-caret-2-n-s");
            th.find("i.ui-icon").removeClass("ui-icon-caret-2-n-s");
            if (inverse) {
                th.find("i.ui-icon").removeClass("ui-icon-caret-1-n");
                th.find("i.ui-icon").addClass("ui-icon-caret-1-s");
            }
            else
            {
                th.find("i.ui-icon").removeClass("ui-icon-caret-1-s");
                th.find("i.ui-icon").addClass("ui-icon-caret-1-n");
            }
            table.find('tr:not(.add-row) td').filter(function()
            {
                return $(this).index() === thIndex;

            }).sortElements(function(a, b)
            {
                if($.isNumeric($.text([a])))
                {
                    x = $.text([a]);
                    y = $.text([b]);
                    return (eval(x) > eval(y)) ?inverse ? -1 : 1: inverse ? 1 : -1;
                }else
                {
                    return $.text([a]) > $.text([b]) ?inverse ? -1 : 1: inverse ? 1 : -1;
                }

            }, function()
            {
                return this.parentNode;
            });
            inverse = !inverse;
        });

    });

    $('#vat_th, #product_price_th, #tax_th, #discount_th, #price_th')
        .each(function()
        {
            var th = $(this);
            //$('<i class="ui-icon ui-icon-caret-2-n-s"></i>').insertAfter(th);
            th.css("cursor","pointer");
            th.append('<i class="ui-icon ui-icon-caret-2-n-s"></i>');
            var thIndex = th.index();
            var inverse = false;
            th.click(function()
            {
                th.siblings().find("i.ui-icon").removeClass("ui-icon-caret-1-n").removeClass("ui-icon-caret-1-s").addClass("ui-icon-caret-2-n-s");
                th.find("i.ui-icon").removeClass("ui-icon-caret-2-n-s");
                if (inverse) {
                    th.find("i.ui-icon").removeClass("ui-icon-caret-1-n");
                    th.find("i.ui-icon").addClass("ui-icon-caret-1-s");
                }
                else
                {
                    th.find("i.ui-icon").removeClass("ui-icon-caret-1-s");
                    th.find("i.ui-icon").addClass("ui-icon-caret-1-n");
                }
                table.find('tr:not(.add-row) td').filter(function()
                {
                    return $(this).index() === thIndex;

                }).sortElements(function(a, b)
                {
                    if($.isNumeric($.text([a])))
                    {
                        x = $.text([a]);
                        y = $.text([b]);
                        return (eval(x) > eval(y)) ?inverse ? -1 : 1: inverse ? 1 : -1;
                    }else
                    {
                        return $(a).data('value') > $(b).data('value') ?inverse ? -1 : 1: inverse ? 1 : -1;
                    }

                }, function()
                {
                    return this.parentNode;
                });
                inverse = !inverse;
            });

        });

    $('body').on('keydown', '#send_to_form input, .bootstrap-tagsinput, .bootstrap-tagsinput input', function (e) {
        if (e.keyCode === 13) {
            $(this).siblings('.bootstrap-tagsinput:first').click();
            $(this).click();
            e.preventDefault();
        }
    });

    $(".payment-complete-form").on("form-success-event", function (event, data) {
        var invoiceId = data.data.id;
        var msg = data.msg;
        $.ajax({
            url: "/admin/invoice/"+ invoiceId +"/get-tr",
            type: "POST",
            success: function(data) {
                if (data.type === "success") {
                    $('.invoice-tr-'+ invoiceId).replaceWith(data.data);
                    toastr.success(msg);
                }
                hidePageLoader();
            }
        });
    });

    $(document).on('click', '#invoice_master_chk1, #invoice_master_chk2', function(e) {
        if($(this).is(':checked',true))
        {
            $(".invoice_chk").prop('checked', true);
        } else {
            $(".invoice_chk").prop('checked',false);
        }
        var grand_total = 0;
        $.each($('input.invoice_chk:checked').closest('tr'),
            function () {
                grand_total += parseFloat($(this).attr('data-total'));
        });
        if(grand_total === 0){
            $('#total-td1').text('');
            $('#total-td2').text('');
            $('#total-td3').text('');
        } else {
            $('#total-td1').html('<b>Total</b>');
            $('#total-td2').text('€'+number_format(grand_total, 2, '.', ' '));
            $('#total-td3').text('(€'+number_format(grand_total, 2, '.', ' ')+')');
        }
    });

    $(document).on('change', 'input.invoice_chk', function(e) {
        var grand_total = 0;
        $.each($('input.invoice_chk:checked').closest('tr'),
            function () {
                grand_total += parseFloat($(this).attr('data-total'));
        });
        if(grand_total === 0){
            $('#total-td1').text('');
            $('#total-td2').text('');
            $('#total-td3').text('');
        } else {
            $('#total-td1').html('<b>Total</b>');
            $('#total-td2').text('€'+number_format(grand_total, 2, '.', ' '));
            $('#total-td3').text('(€'+number_format(grand_total, 2, '.', ' ')+')');
        }
    });

});
function add_product() {
    let elem = $('.product-select.browser-default.selectpicker');
    if(elem.val()){
        displayPageLoader();
        $.ajax({
            url: "/admin/invoice/"+ $('#invoice_id').val()+"/add-product",
            type: "POST",
            data: elem.serialize(),
            success: function(data) {
                if (data.type === "success") {
                    $('#invoice_line_items_inputs_form').replaceWith(data.data);
                    $('.product-select.browser-default.selectpicker').selectpicker('refresh');
                }
                hidePageLoader();
            }
        });
    } else {
        let elem2 = $('.dropdown.bootstrap-select.product-select.browser-default button.btn.dropdown-toggle');
        setTimeout(function() {elem2.addClass('high-input');}, 200);
        setTimeout(function() {elem2.removeClass('high-input');}, 400);
        setTimeout(function() {elem2.addClass('high-input');}, 500);
        setTimeout(function() {elem2.removeClass('high-input');}, 700);
    }
}

function add_blank_product(event) {
    event.preventDefault();
    displayPageLoader();
    $.ajax({
        url: "/admin/invoice/"+ $('#invoice_id').val()+"/add-blank-product",
        type: "POST",
        data: {},
        success: function(data) {
            if (data.type === "success") {
                $('#invoice_line_items_inputs_form').replaceWith(data.data);
                $('.product-select.browser-default.selectpicker').selectpicker('refresh');
            }
            hidePageLoader();
        }
    });

}

function viewChanges(elem){
    $('#product-select').prop('required', true);
    displayPageLoader();
    window.location = elem.data("url");
}

async function deleteProduct(event, id) {
    event.preventDefault();
    if(await confirmation()){
        $.ajax({
            url: "/admin/invoice/"+ $('#invoice_id').val()+"/remove-product/"+id,
            type: "POST",
            data: {},
            success: function(data) {
                if (data.type === "success") {
                    $('#invoice_line_items_inputs_form').replaceWith(data.data);
                    $('.product-select.browser-default.selectpicker').selectpicker('refresh');
                }
            }
        });
    }
}

function updateLineItem(event, id, elem) {
    event.preventDefault();
    displayPageLoader();
    if (elem.val() == '') {
        elem.val(0);
    }
    $.ajax({
        url: "/admin/invoice/" + $('#invoice_id').val() + "/update-line-item/" + id,
        type: "POST",
        data: elem.serialize(),
        success: function (data) {
            if (data.type === "success") {
                $('#invoice-table').replaceWith(data.data);
                $('.product-select.browser-default.selectpicker').selectpicker('refresh');
            }
            hidePageLoader();
        }
    });
}

function validateMail(email1, email2) {
    if (email1.value != email2.value || email1.value == '' || email2.value == '') {
        email2.setCustomValidity("Email doesn't match!");
    } else {
        email2.setCustomValidity('');
    }
}

function changeClient() {
    displayPageLoader();
    $(
        'form#client-email-form #email, ' +
        'form#client-email-form #email_confirmation, ' +
        'form#client-email-form #first_name, ' +
        'form#client-email-form #last_name, ' +
        'form#client-email-form #house_number, ' +
        'form#client-email-form #street, ' +
        'form#client-email-form #zip_code, ' +
        'form#client-email-form #city'
    ).val('');
    $('.card-to .card-body select').val('');
    $('.card-to .card-body select').selectpicker('refresh');
    $('.client-success-col').addClass('hidden');
    $('.new-client-col').removeClass('hidden');
    hidePageLoader();
}

function changeAttachTo(elem) {
    displayPageLoader();
    $(
        'form#client-email-form #email, ' +
        'form#client-email-form #email_confirmation, ' +
        'form#client-email-form #first_name, ' +
        'form#client-email-form #last_name, ' +
        'form#client-email-form #house_number, ' +
        'form#client-email-form #street, ' +
        'form#client-email-form #zip_code, ' +
        'form#client-email-form #city'
    ).val('');
    $('.card-to .card-body select').val('');
    $('.card-to .card-body select').selectpicker('refresh');
    elem.parent().addClass('hidden');
    elem.parent().prev().removeClass('hidden');
    hidePageLoader();
}

function displayToBlock(value) {
    var to_block = $('#to_block');
    to_block.children('.to_block_child').addClass('hidden');
    to_block.find("div[data-invoiceable_type='" + value + "']").removeClass('hidden');
    $('.result-row').addClass('hidden');
    $('.select-row').removeClass('hidden');
    $('.card-to .card-body select').val('');
    $('.card-to .card-body select').selectpicker('refresh');
}

function showSuccessClient(originalData){
    $.ajax({
        url: "/admin/invoices/add-to",
        type: "POST",
        data: {
            name: 'client',
            value: originalData.id
        },
        success: function(data) {
            if (data.type === "success") {
                var current_data = {
                        'house_number' : $('#house_number').val(),
                        'street' : $('#street').val(),
                        'zip_code' : $('#zip_code').val(),
                        'city' : $('#city').val(),
                        'country' : $('#country').val()
                    };
                $.ajax({
                    url: "/admin/users/"+ originalData.id+'/update-details',
                    type: "PATCH",
                    data: current_data,
                    success: function(data) {
                        if (data.type === "success") {
                            //
                        }
                    }
                });
                window.location.replace('/admin/invoices/'+data.data['id']+'/edit');
            }
        }
    });
}

function storeOrderLineItems(orderId, invoiceId = null) {
    if(invoiceId){
        var url = "/admin/invoices/"+ invoiceId +'/add-order-line-items';
    } else {
        var url = "/admin/invoices/"+ $('#invoice_id').val()+'/add-order-line-items';
    }
    $.ajax({
        url: url,
        type: "POST",
        data: {
            orderId: orderId,
        },
        success: function(data) {
            if (data.type === "success") {
                //
            }
            if (data.type === "error") {
                $(elem)
                    .closest(".form-group")
                    .append(`<div class="form-error">${data.msg}</div>`);
                hidePageLoader();
            }
        }
    });
}

function updateGeneralInfo(data) {
    if(data['yacht_name']){
        $('#yacht_name_input').val(data['yacht_name']);
    }
    if(data['owner_name']) {
        $('#owner_name_input').val(data['owner_name']);
    }
}

function updateAddressInfo(data) {
    $('#address_div_input').val(data['address']);
    $('#city_div_input').val(data['city']);
    $('#zip_div_input').val(data['zip']);
}

number_format = function (number, decimals, dec_point, thousands_sep) {
    number = number.toFixed(decimals);

    var nstr = number.toString();
    nstr += '';
    x = nstr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? dec_point + x[1] : '';
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1))
        x1 = x1.replace(rgx, '$1' + thousands_sep + '$2');

    return x1 + x2;
}

