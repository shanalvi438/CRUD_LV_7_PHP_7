/**
 * Used currency format
 *
 * @type {Intl.NumberFormat} formatter
 */
const formatter = new Intl.NumberFormat(
    "en-US", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2
    }
);

/**
 * View Price with format
 *
 * @param price Calculated Price
 *
 * @returns {string}
 */
const viewPrice = price => {
    price = parseFloat(price);
    let parts = formatter.formatToParts(price);
    let formattedPrice = "";

    for (let i = 0; i < parts.length; i++) {
        formattedPrice += parts[i].value;

        if (i === 0) {
            formattedPrice += " ";
        }
    }

    return formattedPrice;
};

/**
 * Display Input error message
 *
 * @param elem Errored Input element
 * @param msg  Message you want to display
 */
const displayInputErrorMsg = (elem, msg) => {
    // Display error in form against given field
    $(elem).closest(".form-group").find('.form-error').remove();
    $(elem).closest(".form-group").append(
        `
        <div class="form-error">
            ${msg}
        </div>
        `
    );
};

/**
 * Make first letter upper cased
 *
 * @param s Word or string
 *
 * @returns {string}
 */
const ucfirst = s => {
    if (typeof s !== "string") {
        return "";
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Show toaster for success or error messages
 *
 * @param type Type of toaster success or error.
 * @param msg  Message to be displayed in toaster.
 */
const showToaster = (type, msg) => {
    if (msg.length > 0) {
        switch (type) {
        case 'success':
            toastr.success(
                msg,
                {timeOut: "30000"}
            );
                break;
        case 'error':
            toastr.error(
                msg,
                {timeOut: "30000"}
            );
                break;
        }
    }
};

/**
 * Display page loader.
 */
const displayPageLoader = (duration = '') => {

    $("#pageloader").fadeIn(duration);
};

/**
 * Hide page loader.
 */
const hidePageLoader = (duration = '') => {

    $("#pageloader").fadeOut(duration);
};

/**
 * Date input Datepicker
 */
function loadDatePicker() {
    // Of autocomplet for the date input
    $(".date-picker").prop('autocomplete', 'off');

    // Load datepicker having class date-picker.
    $(".date-picker").datepicker(
        {
            showButtonPanel: true,
            format: 'yyyy-mm-dd',
            autoHide: true,
            zIndex: 1051
        }
    );
}

/**
 * Execute when document is ready.
 */
$(document).ready(
    function () {

        /**
         * Scroll active sidebar tab to view.
         */
        if ($('.sidebar-left').is(':visible')) {

            $('.sidebar-left .nav-item.active')[0]
                .scrollIntoView(false);

        }

        // Load date-picker
        loadDatePicker();
    }
);

//Main menu script
$(".sub-menu-link").click(function(){
   $(this).find(".sub-menu").slideToggle();
   $(this).find(".nav-icon2").toggleClass("i-Arrow-Down-3 i-Arrow-Up-3");
    var get_top = $(".ps:hover > .ps__rail-y").offset();
    var get_top2 = get_top.top;
    console.log(get_top2);
    $(get_top2).css('top', '20px');
});

//Set date format
function stringToDate(_date,_format,_delimiter) {
    var formatLowerCase=_format.toLowerCase();
    var formatItems=formatLowerCase.split(_delimiter);
    var dateItems=_date.split(_delimiter);
    var monthIndex=formatItems.indexOf("mm");
    var dayIndex=formatItems.indexOf("dd");
    var yearIndex=formatItems.indexOf("yyyy");
    var month=parseInt(dateItems[monthIndex]);
    month-=1;
    var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    return formatedDate;
}

//Calender end date validation
function endDateValidation(event, elem, elem2) {

    var startDate = elem.val();
    var dateFormat= stringToDate(startDate,"dd-mm-yyyy","-");
    var calendarStartDate = (dateFormat.getDate())+'-'+(dateFormat.getMonth()+1)+'-'+dateFormat.getFullYear();

    if (startDate !== '') {
        elem2.removeAttr('disabled');
        elem2.datepicker('destroy');
        elem2.datepicker({
            startDate: calendarStartDate,
            selectMonths: true,
            selectYears: true,
            format: 'dd-mm-yyyy',
            autoHide: true
        });

    } else {
        elem2.val('');
        elem2.attr('disabled', true);
    }
}

/**
 * Generic modal
 * Open modal and render the body according to given url (i.e href for anchor or data-url for button).
 */
$(document).on(
    "click",
    ".generic-modal-btn",
    function (e) {
        // Prevent the default behavior of link.
        e.preventDefault();

        // modal id
        let modalId = "#generic-modal";
        let url;

        // Request url
        if ($(this).is(':button')) {
            url = $(this).data('url');
        } else {
            url = $(this).attr('href');
        }

        // Send request and render form
        $.ajax(
            {
                url: url,
                success: function (data) {

                    let submitBtn = $(modalId + " .modal-body").html(data)
                        .find(".submit");

                    if (submitBtn.length > 0) {
                        submitBtn.addClass("hidden");
                        $(modalId + " .modal-footer button.btn-modal-save").removeClass("hidden");
                    } else {
                        $(modalId + " .modal-footer button.btn-modal-save").addClass("hidden");
                    }

                    // Display modal with embedded body
                    $(modalId).modal('show');
                }
            }
        )
    }
);

/**
 * Display path of file when chooses through custom input file.
 */
$(document).on(
    "change",
    ".custom-file input:file",
    function () {
        $(this).next('label.custom-file-label').text($(this).val());
    }
);
