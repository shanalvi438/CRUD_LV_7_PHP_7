/**
 * Ajax setup CSRF token
 */
var ajaxSetup = function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
}
ajaxSetup();

/**
 * Submit forms using ajax
 *
 * @param event
 */
var ajaxSumbit = function (event) {
    event.preventDefault();
    var form = $(this);
    var formId = $(this).attr('id');
    var formData = new FormData($('#' + formId)[0]);
    var formUrl = form.attr('action');
    var formMethod = form.attr('method');
    var submitText = form.find(".submit").text();
    $.ajax({
        url: formUrl,
        type: formMethod,
        data: formData,
        dataType: "JSON",
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function () {
            form.find('.form-error').html('');
            form.find('.submit').attr('disabled', true).text('Loading....');
            lockForm(form);
            form.trigger('form-before-request-event', form);
        },
        success: function (response) {
            unlockForm(form);
            if (response.type == "success") {
                form.find('.submit').attr('disabled', false).text(submitText);
                form.trigger("form-success-event", response);
            }

            if (typeof response.redirectUrl !== "undefined") {
                location.href = response.redirectUrl;
            }
        },
        error: function (response) {

            // Unlocking form
            unlockForm(form);
            var respObj = response.responseJSON;
            console.log(respObj);

            // If errors object found then display errors
            if (typeof respObj.errors !== "undefined") {
                showErrors(form, respObj.errors || {});
            }

            // Enable form submit button.
            form.find(".submit").attr('disabled', false).text(submitText);
        }
    });
};


var ajaxSubmit2 = function (event) {
    event.preventDefault();
    var form = $(this).closest('form');
    var formId   = form.attr('id');
    var formData = new FormData($('#'+formId)[0]);
    var formUrl  = form.attr('action');
    var formMethod= form.attr('method');
    $.ajax({
        url  : formUrl,
        type : formMethod,
        data : formData,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend:function () {
            // lockForm(form);
        },
        success: function (response) {
            // unlockForm(form);
            form.trigger("form-success-event", response);
        }
    });
};

var submitSwal = function (event) {
    elemId = event.target.id;
    var form = $('#'+elemId).closest('form');
    var formData = new FormData($('#'+elemId)[0]);
    var formUrl  = form.attr('action');
    var formMethod= form.attr('method');
    $.ajax({
        url  : formUrl,
        type : formMethod,
        data : formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            form.trigger("form-success-event", response);
        }
    });
};

function showErrors(form, errors)
{
    var keys   = Object.keys(errors);
    var count  = keys.length;
    for (var i = 0; i < count; i++) {
        form.find("." + keys[i]).html(errors[keys[i]]).show();
    }
}


function lockForm(form)
{
    $("#pageloader").fadeIn();
}

function unlockForm(form)
{
    $("#pageloader").fadeOut();
}

var customSwal = function (
    callback,
    data,
    confirmButtonText = 'Yes, delete it!',
    title = 'Are you sure?',
    text = "You won't be able to revert this!",
    type = 'warning',
    cancelButtonText = 'No, cancel!',
    titleCanceled = 'Cancelled',
    canceledText = 'Your record is safe :)',
    confirmationType = 'double'
) {
    swal({
        title: title,
        text: text,
        type: type,
        showCancelButton: true,
        confirmButtonColor: '#0CC27E',
        cancelButtonColor: '#FF586B',
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        confirmButtonClass: 'btn btn-success mr-5',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
    }).then(function () {
        if( confirmationType === 'double' ){
            if ( confirm(title) ) {
                callbackFunction(callback,data);
            } else {
                canceledFunction( titleCanceled, canceledText );
            }
        } else {
            callbackFunction(callback,data);
        }
    }, function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        if (dismiss === 'cancel') {
            canceledFunction( titleCanceled, canceledText );
        }
    })
};

var callbackFunction = function (callback,data) {
    displayPageLoader();
    if (data) {
        callback(data);
    } else {
        callback();
    }
}

var canceledFunction = function ( titleCanceled, canceledText ) {
    swal(
        titleCanceled,
        canceledText,
        'error'
    );
}

var deleteConfirmation = function (event) {
    event.preventDefault();
    var form = $(this).closest('form');
    swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0CC27E',
        cancelButtonColor: '#FF586B',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success mr-5',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
    }).then(function () {
        form.submit();
    }, function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        if (dismiss === 'cancel') {
            canceledFunction( 'Cancelled', 'Your record is safe :)' );
        }
    })
};


/**
 *
 * @param msg
 * @returns {*}
 */
const confirmation = function () {
    return swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0CC27E',
        cancelButtonColor: '#FF586B',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success mr-5',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
    }).then(function (isConfirm) {
        if (confirm("Are you sure?")) {
            return true;
        } else {
            canceledFunction( 'Cancelled', 'Your record is safe :)' );
        }
    }).catch();
};

/**
 * Ajax Request
 *
 * @param url
 * @param type
 * @param data
 * @param loading
 * @param form
 * @param file
 *
 * @returns {Promise<void>}
 */
const ajaxRequest2 = async function (url, type, data, loading = true, form = null, file = false) {
    setHeaders();
    let settings = {
        url: url,
        type: type,
        data: data,
        processData: true,
        beforeSend: () => {
            (loading === true) ? lockForm() : null;
        },

        success: (res) => {
            unlockForm();
            if(form === null) return;

            form.trigger("form-success-event", res);
            if (res.message !== undefined) {
                if (res.message !== '' && res.message !== null) {
                    toastr.success(res.message);
                }
            }
        },

        error: (err) => {
            unlockForm();
            if(form === null) return;
            
            form.trigger("form-error-event", err);
            if (err.status === 422) {
                let errors = (err.responseJSON)
                    ? err.responseJSON.errors
                    : JSON.parse(err.responseText).errors;

                populateErrors(form, errors);
                return;
            }

            if (err.responseJSON.message !== '' && err.responseJSON.message !== null) {
                toastr.error(err.responseJSON.message);
            }
        }
    };


    if (file !== false) {
        settings.processData = false;
        settings.contentType = false;
    }

    return $.ajax(settings);
};

/**
 *
 * @param form
 * @param errors
 */
const populateErrors = function (form, errors) {
    $.each(errors, function (key, message) {
        if($(form).find(`.${key}-error`).length < 1)
            $(form).find(`input[name=${key}], select[name=${key}]`).after(`<div class="form-error ${key}-error">${message}</div>`);
    });
};
/**
 * Set Default Request Headers
 */
const setHeaders = function () {
    $.ajaxSetup({
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')
        }
    });
};
$(document).ready(function () {

    // Fade out loader after loading the page
    $("#pageloader").fadeOut();

    // Submit form using ajaxSubmit method
    $(document).on("submit", "form.ajax", ajaxSumbit);
    $(document).on("submit", "form.ajax2", ajaxSubmit2);

    // Submit form using ajaxSubmit2 method
    $(document).on("keyup", "form.ajax2 #faq-search-input", ajaxSubmit2);
    $(document).on("change", "form.ajax2 #faq-product-search-input", ajaxSubmit2);
});

$(document).on('click', '.' + 'delete-form .submit', deleteConfirmation);
