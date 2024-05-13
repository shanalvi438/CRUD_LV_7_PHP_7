/**
 * OrderStatus class
 *
 * @constructor
 */
OrderStatus = {
    DRAFT_ORDER: 1,
    AWAITING_APPROVAL: 2,
    INCOMPLETE_DOCUMENTS: 3,
    DOCUMENTS_APPROVED: 4,
    PENDING_AUTHORITIES: 5,
    ORDER_CANCELED: 6,
    PERIODIC_CONTINUATION: 7,
    CONCLUDED: 8,
    RENEWAL_INCOMPLETE_DOCUMENTS: 9,
    RENEWAL_PENDING_AUTHORITIES: 10,
    AWAITING_AUTHORIZATION: 12,
    LEAD_FORWARDED: 13
};

$(document).ready(function () {

    $('#accordianCreateOrder').on('show.bs.collapse', function (e) {
        var elem = $(e.target);
        var cardCol = elem.closest('.card-col');
        cardCol.removeClass('col-xl-6');
        cardCol.addClass('col-xl-12');
    });
    $('#accordianCreateOrder').on('hidden.bs.collapse', function (e) {
        var elem = $(e.target);
        var cardCol = elem.closest('.card-col');
        cardCol.removeClass('col-xl-12');
        cardCol.addClass('col-xl-6');
    });

    $(document).on("click", "#myTab .nav-item a.nav-link", function(event){
        localStorage.setItem('url', window.location.href);
        localStorage.setItem('elemId', '#'+event.target.id);
    });

    if(localStorage.getItem('url')){
        if(window.location.href == localStorage.getItem('url')){
            if(localStorage.getItem('elemId')){
                var elemId = localStorage.getItem('elemId');
                $(elemId).click();
            }
        }
    }

    /* Create Order SmartWizard */
    const createOrderSmartWizard = $("#create-order-smartwizard");
    if ($.contains(document, createOrderSmartWizard[0])) {
        /* Toolbar extra buttons */

        const btnPrev = $("<button></button>")
            .text("Previous")
            .addClass("btn btn-secondary sw-btn-prev");

        const btnNext = $("<button></button>")
            .text("Next")
            .addClass("btn btn-secondary sw-btn-next")
            .on("click", function () {

                if (!$(this).hasClass('disabled')) {

                    // Display page loader
                    displayPageLoader();

                    let formData = new FormData(
                        createOrderSmartWizard.find("form")[0]
                    );

                    // Check owner type is required
                    if (formData.get("owner_type") === "") {

                        // Hide page loader
                        hidePageLoader();

                        // Display error message
                        displayInputErrorMsg(
                            $('select[name="owner_type"]'),
                            "Please select owner type first"
                        );

                        // Highlight select named owner_type
                        $('select[name="owner_type"]').focus();
                    } else if (formData.get("product") != null) {
                        createOrderSmartWizard.find("form").submit();
                    }
                }
            });

        // Smart Wizard
        let createOrderSmartWizardObject = {
            selected: 0,
            theme: "arrows",
            transitionEffect: "fade",
            useURLhash: false,
            showStepURLhash: false,
            toolbarSettings: {
                toolbarPosition: "bottom",
                toolbarButtonPosition: "end",
                showPreviousButton: false,
                showNextButton: false,
                toolbarExtraButtons: [btnPrev, btnNext]
            }
        };

        createOrderSmartWizard.smartWizard(createOrderSmartWizardObject);

        /**
         * Select Product Card
         */
        $("#step-products .card").click(function () {
            if (!$(this).hasClass("card-primary")) {
                // Selected owner type
                let ownerType = $('select[name="owner_type"]').val();

                $(this)
                    .closest("form")[0]
                    .reset();

                // Retaining owner type
                if (ownerType !== "") {
                    $('select[name="owner_type"]').val(ownerType);
                }

                // Unselect all cards
                $(this)
                    .closest("#step-products")
                    .find(".card-primary")
                    .removeClass("card-primary")
                    .find(".sub-products-section")
                    .fadeOut();

                // Select card product
                $(this)
                    .addClass("card-primary")
                    .find('input[name="product"]')
                    .prop("checked", true);

                $(this)
                    .find(".sub-products-section")
                    .fadeIn();
                $(".sw-btn-next").removeClass("disabled");
            }
        });

        /* Calculate Prices */
        $('input[name="sub_products[]"], input[name="is_vat_free"]').click(
            function () {
                let elem = this;
                $.ajax({
                    url: "calculate-price",
                    data: createOrderSmartWizard.find("form").serialize(),
                    type: "post",
                    success: function (data) {
                        //
                    }
                });
            }
        );

        $('input[name="is_vat_free"]').change(
            function () {
                let elem = $(this);
                updatePricing($(elem), 'create');
            }
        );

        /**
         * Remove error msg when owner type is selected
         */
        $('select[name="owner_type"]').change(function () {
            $(this)
                .next(".form-error")
                .remove();
        });
    }

    /* Edit Order SmartWizard */
    const editOrderSmartWizard = $("#edit-order-smartwizard");
    if ($.contains(document, editOrderSmartWizard[0])) {

        let editOrderSmartWizardObject = {
            selected: 0,
            keyNavigation: false,
            theme: "arrows",
            transitionEffect: "fade",
            showStepURLhash: false,
            toolbarSettings: {
                toolbarPosition: "bottom",
                toolbarButtonPosition: "end"
            },
            anchorSettings: {
                enableAllAnchors: true,
                markDoneStep: false
            },
            ajaxSettings: setAjaxCSRF()
        };

        if ($.contains(editOrderSmartWizard[0], $('.hidden-step')[0])
        ) {
            let hiddenSteps = [];

            // Generate the hidden steps array
            editOrderSmartWizard.find('.hidden-step').each(
                function (index, hiddenStep) {

                    hiddenSteps.push($(hiddenStep).index());
                }
            );

            // If there is any hidden step then add in smartwizard object.
            if (hiddenSteps.length) {

                editOrderSmartWizardObject.hiddenSteps = hiddenSteps;
            }
        }
        editOrderSmartWizard.smartWizard(editOrderSmartWizardObject);

        // Smart Wizard
        editOrderSmartWizard.on("showStep", function (
            e,
            anchorObject,
            stepNumber,
            stepDirection
        ) {
            let anchor = anchorObject[0];

            // Refresh data if data-refresh-url is available
            if (anchor.hasAttribute("data-refresh-url")) {

                // Display page loader
                displayPageLoader();

                // Request on refresh url
                $.get(
                    anchor.getAttribute("data-refresh-url"),
                    null,
                    response => {

                        // Step content selector
                        let stepContentLink = anchor.getAttribute("href");

                        // Remove add section form from summary
                        if (stepContentLink === "#step-order-summary") {

                            // Render new html and remove add section form
                            $(stepContentLink)
                                .find(".card-body")
                                .html(response.data)
                                .find('form.add-section-form')
                                .remove();
                        } else {

                            // Render new html
                            $(stepContentLink)
                                .find(".card-body")
                                .html(response.data);
                        }

                        // Trigger onload methods
                        $(stepContentLink)
                            .find("input[onload], select[onload]")
                            .trigger("onload");

                        // hide page loader
                        hidePageLoader();
                    }
                );
            }
        });


        editOrderSmartWizard.on("leaveStep", function (e, anchorObject, stepNumber, stepDirection) {
            if (stepNumber === 2 && stepDirection === 'forward') {
                if ($('.sw-btn-next').hasClass('submit-client-form') && $('#btn-order-publish').hasClass('submit-client-form')) {
                    $("#client-email-form").submit();
                } else {
                    return true;
                }
                return false;
            }
        });

        /* Scroll to active step */
        scrollToActiveStep();
        // Also scroll when click on Next / Previous buttons
        editOrderSmartWizard
            .find(".sw-btn-prev, .sw-btn-next")
            .click(scrollToActiveStep);
    }

    /* Make First and last buttons rounded */
    $(".sw-btn-prev, .sw-btn-next").addClass("btn-rounded");

    // Trigger onload input event
    $("input[onload], select[onload]").trigger("onload");

    if (!$("body > .company-owners")) {
        var elements = $(
            ".notarized_passport_id_card_shareholder, .notarized_passport_id_card_director, .company_documents, .proof_of_home_address_shareholder, .proof_of_home_address_director, .proof_of_deregistration"
        );
        elements.attr("disabled", "disabled");
        elements.closest("div.col-md-6").addClass("hidden");
    }
    $("#client-create #email").attr("readonly", "true");
    $("#client-select-form").on("form-success-event", function (event, data) {
        if ($(".client-email-select.browser-default").val() != null) {
            $(".existing-client-col").addClass("hidden");
            $(".client-success-col").removeClass("hidden");
            showSuccessClient(data.data.data);

            // Also set order as updated.
            orderUpdated();
        } else {
            $(
                "#client-select-form .form-group .form-error.email-select.email"
            ).html("Please select an email!");
        }
    });

    $(".client-email-select.browser-default").on('change', function () {
        if ($(".client-email-select.browser-default").val() != null) {
            $("#client-select-form").submit();
        } else {
            $("#client-select-form .form-group .form-error.email-select.email")
                .html("Please select an email!");
        }
    });

    $(".dealer-email-select.browser-default").on('change', function () {
        var office_id = $(this).children("option:selected").attr('data-office');
        $('#dealer-email-office_id').val(office_id);
        if ($(".dealer-email-select.browser-default").val() != null) {
            $("#dealer-email-form").submit();
        } else {
            $("#dealer-email-form .form-group .form-error.email-select.email")
                .html("Please select an email!");
        }
    });
    $("#client-email-form").on("form-success-event", function (event, data) {
        if (data.status === 2) {
            $(".new-client-col").addClass("hidden");
            $(".client-success-col").removeClass("hidden");
            showSuccessClient(data.data.data);
        }
        if (data.status === 3) {
            $(".new-client-col").addClass("hidden");
            $(".client-success-col").removeClass("hidden");
            showSuccessClient(data.data);
            $(
                'form#client-email-form #email, ' +
                'form#client-email-form #email_confirmation, ' +
                'form#client-email-form #first_name, ' +
                'form#client-email-form #last_name'
            ).val('');
        }
        if (data.status === 1) {
            $("#client_form_email_conf").html(data.msg);
        }

        // Also set order as updated.
        orderUpdated();
    });


    $('.invoice-select.browser-default.custom-select').change(function () {
        var elem = $(this);
        var invoice_id = elem.val();
        var url = elem.children("option:selected").attr('data-url');
        $.ajax({
            url: url,
            type: "POST",
            data: {},
            success: function (data) {
                if (data.type === "success") {
                    $('#single-invoice-main-div').html(data.data);
                }
            }
        });
    });

    /**
     * Order Status Form
     */
    $('#order-status-form .status-select').change(
        function () {

            let currentStatus = Number($(this).val());
            let statusForm = $('form#order-status-form');

            // Status Form
            statusForm.submit();

            // Status Settings
            statusForm.find('.order-status-settings').empty().show();
            if (currentStatus === OrderStatus.INCOMPLETE_DOCUMENTS) {

                // Render documents Html with buttons
                $.get(
                    'documents/edit', function (response) {

                        $('.order-status-settings')
                            .html(response);
                    }
                );
            }
        }
    );

    // Order status success form
    $("#order-status-form").on(
        "form-success-event",
        function (event, responsse) {

            if (responsse.type == "success") {

                $("#status-success-txt")
                    .html(responsse.msg)
                    .removeClass('hidden')
                    .fadeIn("fast")
                    .delay("5000")
                    .fadeOut("slow");
            }
        }
    );


    $("#dealer-email-form").on("form-success-event", function (event, data) {
        if (data.type == "success") {
            $('.dealer-select-col').addClass('hidden');
            $('.dealer-success-col').removeClass('hidden');
            showSuccessDealer(data.data);

            // Also set order as updated.
            orderUpdated();
        }
    });

    /**
     * Prevent other character than numbers in the order type number fields
     */
    $(document).on("keypress keyup blur", ".order-module input[type=number]", function (
        event
    ) {
        let code = event.which;
        // If code is between 48 and 57 but not 46 then prevent default.
        let condition1 = ((code < 48 || code > 57) && code != 46);
        // If is phone field then . is not allowed.
        let condition2 = (code == 46 && $(this).attr('id').indexOf('phone') > -1);
        // Only 2 decimal places are allowed.
        let condition3 = $(this).val().substr($(this).val().indexOf('.')).length > 2;
        // Multiple dots (.) not allowed.
        let condition4 = (code == 46 && $(this).val().indexOf('.') != -1);

        // In case of any of the above situation, event would be prevented.
        if (condition1 || condition2 || condition3 || condition4) {
            event.preventDefault();
        }
    });

    // Add step counter
    AddStepCounter();
});

/**
 * Changes when order updated.
 */
orderUpdated = function () {
    // Make order updated flag to true.
    $('#save-order-btn').data("updated", true);
}

/**
 * Action performed when clicking on save button.
 */
$(document).on(
    "click",
    "#save-order-btn",
    function () {
        // Redirect to save order
        location.href = `draft?updated=${$(this).data("updated")}`;
    }
)

/* Validate each input */
$(document).on(
    "change",
    'input:not(:hidden)[name^="item["],select:not(:hidden)[name^="item["]',
    function () {
        let elem = this;
        let value = [];

        // Value of item
        if ($(elem).attr("type") === "checkbox") {
            $('input[name="' + $(elem).attr("name") + '"]:checked')
                .get()
                .forEach(function (item) {
                    value.push($(item).val());
                });
        } else {
            value = $(elem).val();
        }
        // Validate field
        let itemId = parseInt(
            $(elem)
                .attr("name")
                .replace("item[", "")
        );

        // Save and validate item
        $.ajax({
            url: "item/" + itemId + "/validate",
            data: {value: value},
            success: function (data) {
                $(elem)
                    .closest(".form-group")
                    .find(".form-error")
                    .remove();

                if (data.type === "error") {
                    $(elem)
                        .closest(".form-group")
                        .append(`<div class="form-error">${data.msg}</div>`);
                }

                // Remove error class from highlighted Step
                removeErrorHighlightedStep(elem);

                // Order updated.
                orderUpdated();
            }
        });
    }
);
/**
 * Save item comments
 */
$(document).on(
    "change", 'input[name^="itemComment["]', function () {
        // Item id
        let itemId = parseInt(
            $(this)
                .attr("name")
                .replace("itemComment[", "")
        );

        // Send comment save request
        $.post("item-comment/" + itemId + "/update", {value: $(this).val()});
    }
);

/**
 * Is missing checkbox checked automatically
 * when start writing comment
 */
$(document).on(
    "click", 'input[name^="itemComment["]', function () {
        $(
            'input[name="'
            + $(this)
                .attr("name")
                .replace("itemComment[", "itemIsMissing[")
            + '"]'
        ).prop("checked", true).trigger("change");
    }
);

/**
 * Save request for is missing flag
 */
$(document).on(
    "change", 'input[name^="itemIsMissing["]', function () {
        // Item id
        let itemId = parseInt(
            $(this)
                .attr("name")
                .replace("itemIsMissing[", "")
        );

        // Send is missing flag save request
        $.post("item-missing/" + itemId + "/update", {isMissing: $(this).is(':checked')});
    }
);

/**
 * Send notification for incomplete documents
 */
$(document).on("click", ".notify-incomplete-documents", function () {

    let notifyButton = $(this);

    // Disable the button
    $(this).prop("disabled", true);

    // Send notification request
    $.post(
        "notify-incomplete-documents",
        function (response) {

            // Display toaster
            showToaster(response.type, response.msg);

            // Enable button
            if (response.type == "success") {

                setTimeout(
                    function () {
                        notifyButton.removeAttr("disabled");
                    },
                    10000
                );
            } else {

                notifyButton.removeAttr("disabled");
            }
        }
    );
});


function notifyRegistrationDocuments(event, elem, regId) {
    event.preventDefault();
    let notifyButton = elem;

    // Disable the button
    elem.prop("disabled", true);

    // Send notification request
    $.post(
        "/admin/registrations-doc/"+ regId +"/notify-documents",
        function (response) {

            // Display toaster
            showToaster(response.type, response.msg);

            // Enable button
            if (response.type == "success") {

                setTimeout(
                    function () {
                        notifyButton.removeAttr("disabled");
                    },
                    10000
                );
            } else {

                notifyButton.removeAttr("disabled");
            }
        }
    );
}

// Section form success event trigger
$(document).on("form-success-event", ".section form", function (event, data) {
    $(".sw-btn-group")
        .after(
            `
                <div class="order-section-btn-alert text-success hidden mt-3">
                    Data Saved Successfully!
                </div>
            `
        )
        .next("div.order-section-btn-alert")
        .fadeIn("slow")
        .delay(2000)
        .queue(function () {
            $(this).remove();
        });
    $(".btn-section-cancel").addClass("hidden");
    $(".btn-section-save").addClass("hidden");
});

// Add section form success trigger
$(document).on("form-success-event", ".add-section-form", function (
    event,
    response
) {
    if (response.type === "success") {
        var elem = $(this).prev(".card-text");

        elem.append(response.data.html);

        scrollToDiv(response.data.id);

        addBtnDecider(elem, response.data.addBtn);
    } else {
        // Display Error Msg
    }
});

// Remove Section form success trigger
$(document).on(
    "form-success-event",
    ".remove-section-form",
    function (
        event,
        response
    ) {
        // Rerender complete module
        if ($.contains(document, $('#edit-order-smartwizard')[0])) {

            $(this)
                .closest('div[id^="step-module-"]')
                .find(".card-body")
                .html(response.data.html).find('[onload]').trigger('onload');
        }
    }
);

function scrollToDiv(id) {

    setTimeout(function () {
        $("html, body").animate(
            {
                scrollTop: $("#" + id).offset().top
            },
            1000,
            "linear"
        );
    }, 1000);
}

/**
 * Upload order file instantly
 *
 * @param elem Html input element
 * @param itemId   Item id null
 * @param id   Order orderId null
 * @param id   Registration  regId null
 */
let uploadOrderItemFile = (elem, itemId = null , orderId = null, regId = null) => {

    // Uploaded file
    let file = elem.files[0];
    let fileSize = file.size;
    // Check file size (20 * 1024 * 1024)
    if (fileSize > 20971520) {
        // Display error
        let errorMsg = "The file may not be greater than 20MB.";
        displayInputErrorMsg(elem, errorMsg);

        // Reset input file
        $(elem).val("");
    } else {

        // Uploading file
        let data = new FormData();
        let inputGroup = $(elem).closest('.input-group');
        if(regId === null) {
            let commentableInput = inputGroup.find($('input[name^="itemComment["]'));
            // Is field has comment field
            data.append(
                "isCommentable",
                $.contains(inputGroup[0], commentableInput[0])
            );
        }

        if(regId === null){
            // File to be uplaoded
            data.append("file", file);
            var url = "file/" + itemId + "/upload";
        } else {
            data.append("file", file);
            data.append("url", file);
            data.append("registration_id", regId);
            data.append("order_id", orderId);
            var url = "registration/"+ regId +"/file/upload";
        }

        // Ajax Request
        setAjaxCSRF();
        $.ajax({
            url: url,
            data: data,
            processData: false,
            contentType: false,
            type: "POST",
            beforeSend: function () {
                $("#pageloader").fadeIn();
            },
            success: function (data) {
                if(regId === null) {
                    $(elem)
                        .closest(".col-md-6")
                        .replaceWith(data);
                } else {
                    getUploadedDiv( $(elem), regId, data['id'] );
                }
                $("#pageloader").fadeOut();

                // Also set order as updated.
                orderUpdated();
            },
            error: function (data, textStatus, errorThrown) {
                let errorMsg = "";
                $("#pageloader").fadeOut();
                if (data.status === 422) {
                    errorMsg = data.responseJSON.errors.file.join(", ");
                    displayInputErrorMsg(elem, errorMsg);
                } else {
                    errorMsg = ucfirst(textStatus) + ": " + errorThrown;
                    displayInputErrorMsg(elem, errorMsg);
                }

                $(elem).val("");
            }
        });
    }
};

/**
 * Remove Order file
 *
 * @param e  Event performed
 * @param id Item unique id
 */
let removeOrderItemFile = (e, id) => {
    let elem = e.currentTarget;
    let inputGroup = $(elem).closest('.input-group');
    let commentableInput = inputGroup.find($('input[name^="itemComment["]'));

    $.ajax(
        {
            url: 'file/' + id + '/remove',
            data: {
                isCommentable: $.contains(inputGroup[0], commentableInput[0])
            },
            success: function (data) {
                $(elem).closest('.col-md-6').replaceWith(data);

                // Also set order as updated.
                orderUpdated();
            }
        }
    );
};

/**
 * @param event
 * @param regId
 * @param fileId
 */
let removeRegistrationDocSwal = (event, regId, fileId) => {
    event.preventDefault();
    let data = {};
    data.elem = event.currentTarget;
    data.regId = regId;
    data.fileId = fileId;
    customSwal(removeRegistrationDoc, data,'Yes, delete it!');
};

/**
 * @param data
 */
let removeRegistrationDoc = (data) => {
    event.preventDefault();
    let elem = $(data['elem']);
    $.ajax(
        {
            url: "registration/"+ data['regId'] +"/file/"+ data['fileId'] +"/remove",
            success: function (data1) {
                $.ajax({
                    url: "/admin/registrations-doc/" + data['regId'] + "/get-uploaded-div/",
                    type: "GET",
                    success: function (res) {
                        if (res.type === "success") {
                            elem.closest('.order_reg_doc_inner').replaceWith(res.data);
                        }
                        hidePageLoader();
                    }
                });
            }
        }
    );
};

/**
 * Update product is vat free or not
 *
 * @param elem
 */
let updateProductVatFree = elem => {
    updatePricing($(elem), 'edit');
    $(elem).parents('.checkbox-primary:first').find('span:first').text('Is VAT Free');
};

let parentSiblingFind = (elem, parent, elemClass, elem2) => {
    return elem.parents(parent).siblings(elemClass).find(elem2+':first');
};

let parentSiblingFindFind = (elem, parent, elemClass1, elemClass2, elem2) => {
    return elem.parents(parent).siblings(elemClass1).find(elemClass2).find(elem2+':first');
};

let findFind = (elem, elemClass, elem2) => {
    return elem.find(elemClass).find(elem2+':first');
};

let priceTrimReplaceMatch = (elemHtml) => {
    return elemHtml.trim().replace(/ /g, '').match(/[+-]?\d+(?:\.\d+)?/g)[0];
};

let updatePricing = (elem, type) => {
    let table = elem.parents('table');
    let is_vat_free_input = elem;
    if (table.parents('.table-responsive').hasClass('order-table') ) {
        let main_total_span = parentSiblingFind(elem, 'td', 'td.td.td-main-total', 'span');
        let main_total = priceTrimReplaceMatch(main_total_span.html());

        let main_price_span = parentSiblingFind(elem, 'td', 'td.td.td-main-price', 'span');
        let main_price = priceTrimReplaceMatch(main_price_span.html());

        let main_vat_span = parentSiblingFind(elem, 'td', 'td.td.td-main-vat', 'span');
        let main_vat = priceTrimReplaceMatch(main_vat_span.html());

        let sub_vat_spans = $('td.td.td-sub-vat').find('span:first');
        let sub_products   = table.find('tr.sub-row td.td.td-sub-name input');

        let grand_vat_span = parentSiblingFindFind(elem, 'tr.main-row', 'tr.grand-row', 'td.td.td-grand-vat', 'b');

        let $grand_total_span = parentSiblingFindFind(elem, 'tr.main-row', 'tr.grand-row','td.td.td-grand-total', 'b');

        if (elem.is(':checked')) {
            let vatSubTotal = subProductPricing(sub_products, is_vat_free_input);
            sub_vat_spans.html('€ 0.00');
            main_vat_span.html('€ 0.00');
            grand_vat_span.html('€ 0.00');
            main_total_span.html('€ ' + numberWithCommas(Number(main_total - main_vat).toFixed(2)));
        } else {
            let vatSubTotal = subProductPricing(sub_products, is_vat_free_input);
            let vatTotal =  numberWithCommas((parseFloat(main_vat_span.data('price')) + parseFloat(vatSubTotal)).toFixed(2));
            main_vat_span.html('€ ' + numberWithCommas(parseFloat(main_vat_span.data('price')).toFixed(2)));
            grand_vat_span.html('€ ' + vatTotal);
            main_total_span.html('€ ' + numberWithCommas(Number(main_total_span.data('price')).toFixed(2)));
        }
        elem.parents('.checkbox-primary:first').find('span:first').text('Is VAT Free');
        calculateGrandTotal(table);
        if (type === 'edit') {
            $.get(
                'product/' + (elem.is(':checked') ? 1 : 0), function (data) {
                    //
                }
            );
        }
    }
};

function subProductPricing(sub_products, is_vat_free_input )
{
    let vatSubTotal = 0;
    sub_products.each(
        function (key, elemt) {
            elemt = $(elemt);

            let subVatBlock = elemt.parents('tr.sub-row').children('td.td.td-sub-vat').find('span:first');
            subVatBlock.html('€ ' + numberWithCommas(Number(subVatBlock.data('price')).toFixed(2)));

            let subTotalBlock = elemt.parents('tr.sub-row').children('td.td.td-sub-total').find('span:first');
            if (elemt.is(':checked')) {
                let subPriceBlock = elemt.parents('tr.sub-row').children('td.td.td-sub-price').find('span:first');
                let subTaxBlock = elemt.parents('tr.sub-row').children('td.td.td-sub-tax').find('span:first');

                let subPrice = priceTrimReplaceMatch(subPriceBlock.html());
                let subTax = priceTrimReplaceMatch(subTaxBlock.html());
                let subVat = priceTrimReplaceMatch(subVatBlock.html());

                if( is_vat_free_input.is(':checked')){
                    subTotalBlock.html('€ ' + numberWithCommas(Number(parseFloat(subPrice) + parseFloat(subTax)).toFixed(2)));
                } else {
                    subTotalBlock.html('€ ' + numberWithCommas(Number(parseFloat(subPrice) + parseFloat(subTax) + parseFloat(subVat)).toFixed(2)));
                    vatSubTotal += parseFloat(subVat);
                }
            } else {
                subTotalBlock.html('-');
            }
        }
    );

    return vatSubTotal;

}

function numberWithCommas(x) {
    return x.toString();
}

function addBtnDecider(elem, decider) {
    if (decider) {
        elem.closest('.card').find('.add-section-form').removeClass('order-btn-hidden');
    } else {
        elem.closest('.card').find('.add-section-form').addClass('order-btn-hidden');
    }
}

function subProduct_pricing(elem, type) {
    elem = $(elem);
    if (type == 'edit') {
        $.get(
            'sub-products/' + elem.val(), function (data) {
                //
            }
        );
    }
    let table = elem.parents('table');
    let is_vat_free_input = $('#is_vat_free');
    if (table.parents('.table-responsive').hasClass('order-table')) {
        let grand_price_span = parentSiblingFindFind(elem, 'tr', 'tr.grand-row', 'td.td.td-grand-price', 'b');
        let grand_tax_span = parentSiblingFindFind(elem, 'tr', 'tr.grand-row', 'td.td.td-grand-tax', 'b');
        let grand_vat_span = parentSiblingFindFind(elem, 'tr', 'tr.grand-row', 'td.td.td-grand-vat', 'b');

        let sub_total_span = elem.parents('td').siblings('td.td.td-sub-total').children('span');
        let sub_vat_span = priceTrimReplaceMatch(elem.parents('td').siblings('td.td.td-sub-vat').children('span').html());
        let sub_price_span = priceTrimReplaceMatch(elem.parents('td').siblings('td.td.td-sub-price').children('span').html());
        let sub_tax_span = priceTrimReplaceMatch(elem.parents('td').siblings('td.td.td-sub-tax').children('span').html());

        let main_price_span = parentSiblingFindFind(elem, 'tr', 'tr.main-row', 'td.td.td-main-price', 'span');
        let main_tax_span = parentSiblingFindFind(elem, 'tr', 'tr.main-row', 'td.td.td-main-tax', 'span');
        let main_vat_span = parentSiblingFindFind(elem, 'tr', 'tr.main-row', 'td.td.td-main-vat', 'span');

        let sub_products = elem.parents('table').find('tr.sub-row td.td.td-sub-name input');

        let main_price = priceTrimReplaceMatch(main_price_span.html());
        let main_tax = priceTrimReplaceMatch(main_tax_span.html());
        let main_vat = priceTrimReplaceMatch(main_vat_span.html());

        let sub_price           = 0;
        let sub_tax             = 0;
        let sub_vat             = 0;

        sub_products.each(
            function (key, elemt) {
                elemt = $(elemt);
                if (elemt.is(':checked')) {
                    sub_price = parseFloat(sub_price) + parseFloat(priceTrimReplaceMatch(parentSiblingFind(elemt, 'td', 'td.td.td-sub-price', 'span').html()));
                    sub_tax = parseFloat(sub_tax) + parseFloat(priceTrimReplaceMatch(parentSiblingFind(elemt, 'td', 'td.td.td-sub-tax', 'span').html()));
                    sub_vat = parseFloat(sub_vat) +parseFloat(priceTrimReplaceMatch(parentSiblingFind(elemt, 'td', 'td.td.td-sub-vat', 'span').html()));
                }
            }
        );
        let new_total_price = Number(parseFloat(main_price) + parseFloat(sub_price) ).toFixed(2);
        let new_total_tax   = Number(parseFloat(main_tax) + parseFloat(sub_tax)).toFixed(2);
        let new_total_vat   = Number(parseFloat(main_vat) + parseFloat(sub_vat)).toFixed(2);

        grand_price_span.html('€ ' + numberWithCommas(Number(new_total_price).toFixed(2)));
        grand_tax_span.html('€ ' + numberWithCommas(Number(new_total_tax).toFixed(2)));
        grand_vat_span.html('€ ' + numberWithCommas(Number(new_total_vat).toFixed(2)));

        if (elem.is(':checked')) {
            if (is_vat_free_input.is(':checked')) {
                let new_span_total   = Number(parseFloat(sub_price_span) + parseFloat(sub_tax_span)).toFixed(2);
                sub_total_span.html('€ ' + numberWithCommas(Number(new_span_total).toFixed(2)));
            } else {
                let new_span_total   = Number(parseFloat(sub_price_span) + parseFloat(sub_vat_span) + parseFloat(sub_tax_span)).toFixed(2);
                sub_total_span.html('€ ' + numberWithCommas(Number(new_span_total).toFixed(2)));
            }
        } else{
            sub_total_span.html('-');
        }
        calculateGrandTotal(table);
    }
}

$(document).on(
    "change",
    'input[name="subProduct[]"], input[name="is_vat_free"]',
    function () {
        // Set order as updated.
        orderUpdated();
    }
);

function calculateGrandTotal(elem) {
    let grand_price = priceTrimReplaceMatch(findFind(elem, 'td.td.td-grand-price', 'b').html());
    let grand_tax = priceTrimReplaceMatch(findFind(elem, 'td.td.td-grand-tax', 'b').html());
    let grand_vat = priceTrimReplaceMatch(findFind(elem, 'td.td.td-grand-vat', 'b').html());

    let $grand_total_span = findFind(elem, 'td.td.td-grand-total', 'b');
    let grand_total = Number((parseFloat(grand_price) + parseFloat(grand_tax) + parseFloat(grand_vat))).toFixed(2);
    $grand_total_span.html('€ ' + numberWithCommas(grand_total));
}

function hideFieldsExceptThis(elem) {
    var className = $(elem).attr('class');
    var decider = $(elem).val();
    var form = $(elem).closest('form');
    if (decider === '' || decider === 'no' || decider === null) {
        form.find('input, select').each(
            function () {
                if (!$(this).hasClass(className) && $(this).attr('name') != '_method') {
                    $(this).attr('disabled', 'disabled');
                    // Radio type inputs sustains their values but unchecked
                    if ($(this).attr('type') === 'radio'
                        || $(this).attr('type') === 'checkbox'
                    ) {
                        $(this).prop('checked', false);
                    } else {
                        $(this).val('');
                    }
                    $(this).closest('div.col-md-6').addClass('hidden');
                    if ($(this).is('select')) {
                        $(this).find('option').first().prop('selected', true);
                    }
                }
            }
        );

        // Hide Add section form button
        $(elem).closest('.card').find('.add-section-form').addClass('hidden');
    } else {
        form.find('input, select').each(
            function () {
                if (!$(this).hasClass(className)) {
                    $(this).removeAttr('disabled');
                    $(this).closest('div.col-md-6').removeClass('hidden');
                }
            }
        );

        // Display Add section form button
        $(elem).closest('.card').find('.add-section-form').removeClass('hidden');
    }
}

function currentOrPreviousReg(elem) {
    var className = $(elem).attr('class');
    var decider = $(elem).val();
    var form = $(elem).closest('form');
    if (decider === '' || decider === null) {
        form.find('input, select').each(
            function () {
                if (!$(this).hasClass(className) && $(this).attr('name') != '_method') {
                    $(this).attr('disabled', 'disabled');
                    // Radio type inputs sustains their values but unchecked
                    if ($(this).attr('type') === 'radio'
                        || $(this).attr('type') === 'checkbox'
                    ) {
                        $(this).prop('checked', false);
                    } else {
                        $(this).val('');
                    }
                    $(this).closest('div.col-md-6').addClass('hidden');
                    if ($(this).is('select')) {
                        $(this).find('option').first().prop('selected', true);
                    }
                }
            }
        );
    } else if (decider === 'no') {
        form.find('input, select').each(
            function (a, b) {
                var elem_id = $(b).attr('id');
                if (elem_id != null) {
                    var cop = elem_id.split("_")[0];
                    if (cop !== 'before') {
                        if (!$(b).hasClass(className) && $(b).attr('name') != '_method') {
                            $(b).attr('disabled', 'disabled');
                            // Radio type inputs sustains their values but unchecked
                            if ($(b).attr('type') === 'radio'
                                || $(b).attr('type') === 'checkbox'
                            ) {
                                $(b).prop('checked', false);
                            } else {
                                $(b).val('');
                            }
                            $(b).closest('div.col-md-6').addClass('hidden');
                            if ($(b).is('select')) {
                                $(b).find('option').first().prop('selected', true);
                            }
                        }
                    } else {
                        if (!$(b).hasClass(className)) {
                            $(b).removeAttr('disabled');
                            $(b).closest('div.col-md-6').removeClass('hidden');
                        }
                    }
                }
            }
        );
    } else if (decider === 'yes') {
        form.find('input, select').each(
            function (a, b) {
                var elem_id = $(b).attr('id');
                if (elem_id != null) {
                    var cop = elem_id.split("_")[0];
                    if (cop === 'before' || elem_id == '' || elem_id == '') {
                        if (!$(b).hasClass(className) && $(b).attr('name') != '_method') {
                            $(b).attr('disabled', 'disabled');
                            // Radio type inputs sustains their values but unchecked
                            if ($(b).attr('type') === 'radio'
                                || $(b).attr('type') === 'checkbox'
                            ) {
                                $(b).prop('checked', false);
                            } else {
                                $(b).val('');
                            }
                            $(b).closest('div.col-md-6').addClass('hidden');
                            if ($(b).is('select')) {
                                $(b).find('option').first().prop('selected', true);
                            }
                        }
                    } else {
                        if (!$(b).hasClass(className)) {
                            $(b).removeAttr('disabled');
                            $(b).closest('div.col-md-6').removeClass('hidden');
                        }
                    }
                }
            }
        );
    }

    if ($(elem).val() === '' || $(elem).val() === 'no') {
        $('#proof_of_deregistration').attr('disabled', true);
        $('.field_proof_of_deregistration').hide();
    } else {
        $('#proof_of_deregistration').removeAttr('disabled');
        $('.field_proof_of_deregistration').show();
    }
}

function currentWhereWasShipRegistered(elem) {
    whereWasShipRegistered(elem, '')
}

function beforeWhereWasShipRegistered(elem) {
    whereWasShipRegistered(elem, 'before_')
}

function whereWasShipRegistered(elem, type) {

    var location = $(elem).val();
    if (location === '') {
        if (type === 'before_') {
            beforeHideEuUkOtherFields();
        } else {
            hideEuUkOtherFields();
        }
    } else if (location === 'eu') {

        $('#' + type + 'cop_registration_other_location').attr('readonly', 'true').val('');
        $('.field_' + type + 'cop_registration_other_location').hide();

        $('#' + type + 'cop_registration_location_in_the_uk').attr('readonly', 'true').val('');
        $('.field_' + type + 'cop_registration_location_in_the_uk').hide();

        $('#' + type + 'cop_registration_location_in_the_eu').removeAttr('readonly disabled');
        $('.field_' + type + 'cop_registration_location_in_the_eu').show();

    } else if (location === 'uk') {

        $('#' + type + 'cop_registration_other_location').attr('readonly', 'true').val('');
        $('.field_' + type + 'cop_registration_other_location').hide();

        $('#' + type + 'cop_registration_location_in_the_eu').attr('readonly', 'true').val('');
        $('.field_' + type + 'cop_registration_location_in_the_eu').hide();

        $('#' + type + 'cop_registration_location_in_the_uk').removeAttr('readonly disabled');
        $('.field_' + type + 'cop_registration_location_in_the_uk').show();

    } else if (location === 'other') {

        $('#' + type + 'cop_registration_location_in_the_eu').attr('readonly', 'true').val('');
        $('.field_' + type + 'cop_registration_location_in_the_eu').hide();

        $('#' + type + 'cop_registration_location_in_the_uk').attr('readonly', 'true').val('');
        $('.field_' + type + 'cop_registration_location_in_the_uk').hide();

        $('#' + type + 'cop_registration_other_location').removeAttr('readonly disabled');
        $('.field_' + type + 'cop_registration_other_location').show();

    } else if (location != 'uk' && location != 'other' && location != 'eu' && location != '') {

        if (type === 'before_') {
            beforeHideEuUkOtherFields();
        } else {
            hideEuUkOtherFields();
        }
    }

    // Settings for if "No previous registration" available
    if (location === 'no_previous_registration') {

        $('.field_before_registration_number').hide();
        $('.field_before_cop_date_of_deletion').hide();
        $('.field_before_proof_of_deregistration').hide();
    } else {

        $('.field_before_registration_number').show();
        $('.field_before_cop_date_of_deletion').show();
        $('.field_before_proof_of_deregistration').show();
    }
}

function hideEuUkOtherFields() {
    $('#cop_registration_location_in_the_uk, #cop_registration_other_location, #cop_registration_location_in_the_eu').each(
        function () {
            $(this).attr('disabled', true).closest('div[class*=" field_"]').hide();
        }
    );

    $('.field_cop_registration_other_location, .field_cop_registration_other_location, .field_cop_registration_location_in_the_eu').each(
        function () {
            $(this).hide();
        }
    );
}

function beforeHideEuUkOtherFields() {
    $('#before_cop_registration_location_in_the_uk, #before_cop_registration_other_location, #before_cop_registration_location_in_the_eu').each(
        function () {
            $(this).attr('disabled', true).closest('div[class*=" field_"]').hide();
        }
    );

    $('.field_before_cop_registration_other_location, .field_before_cop_registration_other_location, .field_before_cop_registration_location_in_the_eu').each(
        function () {
            $(this).hide();
        }
    );
}

function epirbFields(elem) {

    // Number of EPIRB selected
    let noOfEPIRB = $(elem).children("option:selected").val();

    // Hide all EPIRB dependent fields
    $(
        'input[id^="radio_equipment_epirb_type_"], ' +
        'input[id^="radio_equipment_epirb_serial_number_"], ' +
        'input[id^="radio_equipment_epirb_manufacturer_"]'
    ).each(
        function () {

            $(this).prop('disabled', true);
            $(this).closest('div[class*="field_"]').addClass('hidden_epirb');
        }
    );

    // Show EPIRB fields w.r.t selected EPIRB's
    if (noOfEPIRB > 0) {

        let selectors = '';

        // Dynamic epirb selectors
        for (let i = 1; i <= noOfEPIRB; i++) {

            if (selectors.length !== 0) {

                selectors += ', ';
            }

            selectors += '#radio_equipment_epirb_type_' + i +
                ', #radio_equipment_epirb_serial_number_' + i +
                ', #radio_equipment_epirb_manufacturer_' + i;
        }

        // Enable fields
        $(selectors).each(
            function () {

                $(this).prop('disabled', false);
                $(this).closest('div[class*="field_"]').removeClass('hidden_epirb');
            }
        );
    }
}

function homePort() {
    var registration_type_val = $('#registration_type').val();
    var homeport = $('#homeport');
    // This depends on the constants
    if (registration_type_val == 1 || registration_type_val == 3) {
        homeport.prop('readonly', true);
        homeport.val('Amsterdam');
    } else {
        homeport.prop('readonly', false);
        homeport.val('');
    }
}

function typeOfCompany() {
    var type_of_company_val = $('#company_owners_type_of_company').val();
    var type_of_company_other = $('#company_owners_type_of_company_other');
    if (type_of_company_val === 'uk_limited' || type_of_company_val === null) {
        type_of_company_other.val('').prop('disabled', true);
        type_of_company_other.closest('div.col-md-6').addClass('hidden');
    } else {
        type_of_company_other.prop('disabled', false);
        type_of_company_other.closest('div.col-md-6').removeClass('hidden');
    }
}

function changeClient() {
    $(
        'form#client-email-form #email, ' +
        'form#client-email-form #email_confirmation, ' +
        'form#client-email-form #first_name, ' +
        'form#client-email-form #last_name'
    ).val('');
    $('.client-btns-row').removeClass('hidden');
    $('.client-success-col').addClass('hidden');
}

function changeDealer() {
    $('.dealer-select-col').removeClass('hidden');
    $('.dealer-success-col').addClass('hidden');
}
function cancelDealerStep() {
    $('.dealer-success-col').removeClass('hidden');
    $('.dealer-select-col').addClass('hidden');
}
/**
 * Handle Percentage of owners
 */
const ownerPercentageHandler = (elem, name) => {

    let max_percent = 100;

    $('.' + name).not($(elem)).each(
        (key, element) => {

            if ($(element).val().length > 0) {

                max_percent -= parseFloat($(element).val());
            }
        }
    );
    $(elem).attr('max', max_percent);

    if (max_percent <= $(elem).val()) {

        $(elem).val(max_percent);
        $(elem).closest('.step-content').find('.add-section-form').addClass('order-percent-hidden');

        // Remove Validation errors if percentage is completed.
        if (max_percent == $(elem).val()) {

            $('.' + name).closest('.form-group').find('.form-error').remove();
        }
    } else {

        $(elem).closest('.step-content').find('.add-section-form').removeClass('order-percent-hidden');
    }
};

function ifSelectedSelfBuild(elem) {
    var yacht_build = $(elem).val();

    if (yacht_build === '' || yacht_build !== 'self_build') {

        $('#builders_statement, #invoices_of_elements_of_the_yacht').each(
            function () {
                $(this).attr('disabled', true);
            }
        );
        $('.field_invoices_of_elements_of_the_yacht, .field_builders_statement').each(
            function () {
                $(this).hide();
            }
        );
    } else {
        $('#builders_statement, #invoices_of_elements_of_the_yacht').each(
            function () {
                $(this).removeAttr('disabled', true);
            }
        );
        $('.field_invoices_of_elements_of_the_yacht, .field_builders_statement').each(
            function () {
                $(this).show();
            }
        );
    }
}

function showNewClientForm() {
    $('.client-btns-row').addClass('hidden');
    $('.new-client-col').removeClass('hidden');
    $('.sw-btn-next').addClass('submit-client-form');
    if ($("#btn-order-publish").length) {
        let btnOrderPublish = $("#btn-order-publish");
        if (!btnOrderPublish.hasClass('submit-client-form')) {
            btnOrderPublish.addClass('submit-client-form');
        }
    }
    // Remove error class from highlighted Step
    $('a[href="#step-client"]').parent('li').removeClass('danger');
}

function showExistingClientForm(assigner_id) {
    $('.client-btns-row').addClass('hidden');
    displayPageLoader();
    var formUrl = '/' + $('#hidden_role_url_input').val() + '/get-clients/' + assigner_id;
    var formMethod = 'GET';
    setAjaxCSRF();
    $.ajax({
        url: formUrl,
        type: formMethod,
        dataType: "JSON",
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            var select_email = $('select.client-email-select');
            if (response.length === 0) {
                select_email.empty();
                select_email.selectpicker('refresh');
                hidePageLoader();
            } else {
                select_email.empty();
                var selected = '';
                $.each(response, function (index, val) {
                    if (val) {
                        if (val.id === assigner_id) {
                            selected = 'selected';
                        } else {
                            selected = '';
                        }
                        select_email.append('<option data-tokens="' + val.email + '" value="' + val.email + '" ' + selected + '>' + val.email + '</option>');
                    }
                });
                select_email.selectpicker('refresh');
                hidePageLoader();
            }
        }
    });
    $('.existing-client-col').removeClass('hidden');

    // Remove error class from highlighted Step
    $('a[href="#step-client"]').parent('li').removeClass('danger');
}

function backFirstStep(elem) {
    $('.client-btns-row').removeClass('hidden');
    $(
        'form#client-email-form #email, ' +
        'form#client-email-form #email_confirmation, ' +
        'form#client-email-form #first_name, ' +
        'form#client-email-form #last_name'
    ).val('');
    $(elem).parents('form:first').find("select").prop('selectedIndex', 0);
    $(elem).closest('div.col-md-6').addClass('hidden');
}

function showSuccessClient(data) {
    $('.client_email_show').html('<a href="mailto:'+data.email+'">'+data.email+'</a>');
    $('.client_first_name_show').text(data.first_name);
    $('.client_last_name_show').text(data.last_name);
    $('.sw-btn-next').removeClass('submit-client-form');
    $('#btn-order-publish').removeClass('submit-client-form');
}

function showSuccessDealer(data) {
    $('.dealer_email_show').html('<a href="mailto:'+data.email+'">'+data.email+'</a>');
    $('.dealer_first_name_show').text(data.first_name);
    $('.dealer_last_name_show').text(data.last_name);
    if (data.phone !== null) {
        $('.dealer_phone_show').text(data.phone);
    } else {
        $('.dealer_phone_show').text('N/A');
    }
    if (data.skype !== null) {
        $('.dealer_skype_show').text(data.skype);
    } else {
        $('.dealer_skype_show').text('N/A');
    }

    $('.dealer_office_name_show').text(data.office.name);
}

function adminVisible(obj, hide) {
    let elem = $(obj);
    let elemId = elem.attr('id');
    if (hide) {
        $('#' + elemId).attr('disabled', true).attr('readonly', true);
    } else {
        $('#' + elemId).removeAttr('disabled').removeAttr('readonly');
    }
}

function repeatYachtName(e, obj) {
    var registration_type = $('#registration_type').val();
    if (registration_type == 4) {
        var elem = $('.yacht_name');
        // This depends on the product registration constants
        if (elem.length < 2) {
            $(obj).closest('.col-md-6').children('a.text-success').first()
                .trigger('click').trigger('click').addClass('hidden');
            setTimeout(function () {
                $('.yacht_name').closest('.field_yacht_name').find('a').remove();
            }, 500);
        } else {
            elem.closest('.col-md-6').children('a').remove();
        }
    }
}

/**
 * Calls when click on Add button of repeatable section item
 *
 * @param e       Event performed
 * @param itemId Id of item
 */
const addRepeatableSectionItem = (e, itemId) => {
    e.preventDefault();
    let elem = e.currentTarget;
    let url = 'repeatedItems/' + itemId + '/add';

    $.get(
        url, response => {

            if (response.data.addBtn === false) {

                $(elem).closest('.field_' + response.data.field)
                    .find('.order-field-action-btn').fadeOut().remove();
            }

            $('.field_' + response.data.field + ':last').after(response.data.html);
        }
    );
};

/**
 * Calls when click on Remove button of repeated section item
 *
 * @param e
 * @param itemId
 */
const removeRepeatedSectionItem = (e, itemId) => {
    e.preventDefault();
    let elem = e.currentTarget;
    let url = 'repeatedItems/' + itemId + '/remove';

    $.get(
        url, response => {

            $(elem).closest('.field_' + response.data.field).fadeOut().remove();
            $('.field_' + response.data.field + ':first').replaceWith(response.data.defaultItem);
        }
    )
};

const cancelSectionForm = (elem) => {
    $($(elem).attr('data-id')).find('.cancel-save').click();
};

const saveSectionForm = (elem) => {
    $($(elem).attr('data-id')).find('.section-save').click();
};

const renderSection = (elem) => {
    let sectionId = $(elem).closest('form').find('input[name="section_id"]').val();
    let url = base_url + '/orders/sections/' + sectionId + '/render';
    $.get(
        url,
        response => {
            $(elem).closest('.section').replaceWith(response.data);
        }
    );
};

const refreshSummary = (elem, orderId) => {
    let url = 'render-summary';
    $.get(
        url,
        response => {

            $(elem).closest('.card-body').html(response.data);
        }
    );
};

const makeVatFree = (elem1, elem2) => {
    if ($(elem2).prop("checked")) {
        $(elem1).addClass('hidden');
        $(elem1).children('b.fs-16').removeClass('price');
        calculatePrice(elem2);
    } else {
        $(elem1).removeClass('hidden');
        $(elem1).children('b.fs-16').addClass('price');
        calculatePrice(elem2);
    }
};

const calculatePrice = (elem) => {

    let card = $(elem).closest('.card-primary');
    let price = 0;

    // Toggle Class to calculate price
    $(elem).next().next().next().toggleClass('price');

    let priceElem = card.find('.price');

    priceElem.each(
        function () {
            let currentPrice = parseFloat($(elem).attr('data-price'));
            if (!isNaN(currentPrice)) {
                price += currentPrice;
            }

        }
    );
    card.find('.total-initial')
        .html(
            viewPrice(
                parseFloat(price)
            )
        );
};

const publishOrder = () => {
    $("#client-email-form").submit();
    $.ajax(
        {
            url: 'publish',
            success: function (response) {

                if (response.type === 'error') {

                    // Display error toaster
                    toastr.error(response.msg);

                    // Check if data is available
                    if (Object.keys(response.data).length > 0) {

                        // Remove error class from steps
                        $('#edit-order-smartwizard .nav-item.danger').removeClass('danger');

                        // Highlight the steps having validation error fields.
                        response.data.steps.forEach(
                            function (step) {

                                $('#edit-order-smartwizard .nav-item:eq(' + step + ')')
                                    .removeClass('done active').addClass('danger');
                            }
                        );

                        // Remove all old error messages.
                        $('#edit-order-smartwizard form .form-error').not('#step-client .form-error').remove();

                        // Display error messages.
                        let dataItems = response.data.items;
                        Object.keys(dataItems).forEach(
                            function (key) {

                                // Add new validation messages.
                                $(key).closest('.form-group').append(
                                    `
                                        <div class="form-error">
                                            ${dataItems[key]}
                                         </div>
                                    `
                                );
                            }
                        );
                    }
                } else if (response.type === 'success') {

                    // Redirect to Details page
                    location.href = window.location.href.replace('edit', 'view');
                }
            }
        }
    );
};

function validateMail(email1, email2) {
    if (email1.value != email2.value || email1.value == '' || email2.value == '') {
        email2.setCustomValidity("Email doesn't match!");
    } else {
        email2.setCustomValidity('');
    }
}

/**
 * Scroll steps to display the active step
 */
let scrollToActiveStep = () => {
    let stepsUl = $('#edit-order-smartwizard .fix-order-header');
    let stepsUlLeft = stepsUl.offset().left;
    let stepsUlRight = stepsUlLeft + stepsUl.width() - 175;
    let activeStep = stepsUl.find('.nav-item.active');
    let activeStepLeft = activeStep.offset().left;
    let stepNumber = activeStep.index();

    if (activeStepLeft < stepsUlLeft) {
        let scrollLeft = (stepNumber - 5) * 175;
        stepsUl.animate({scrollLeft: scrollLeft}, 1000);
    } else if (activeStepLeft > stepsUlRight) {
        let scrollLeft = stepNumber * 175;
        stepsUl.animate({scrollLeft: scrollLeft}, 1000);
    }
    scrollToTopfunction();
};

let scrollToTopfunction = () => {
    var scroll_pos = (0);
    $('html, body').animate({scrollTop: (scroll_pos)}, 100);
};

/* Remove Highlight error steps  */
let removeErrorHighlightedStep = (elem) => {

    let contentDiv = $(elem).closest('.step-content');
    if (contentDiv.find('.form-error:visible').length < 1) {

        $('a[href="#' + contentDiv.get(0).id + '"]').parent('li').removeClass('danger');
    }
};

let setAjaxCSRF = () => {

    $.ajaxSetup(
        {
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        }
    );
};

let jumpToEdit = (elem, module, id) => {
    $('.nav-' + module).click();
    $('html, body').animate({
        scrollTop: $(elem).offset().top
    }, 800);
    setTimeout(function () {
        $(id).addClass('high-input');
    }, 1100);
    setTimeout(function () {
        $(id).removeClass('high-input');
    }, 1300);
    setTimeout(function () {
        $(id).addClass('high-input');
    }, 1400);
    setTimeout(function () {
        $(id).removeClass('high-input');
    }, 1600);
};

/**
 * Copy shareholder section fields' value to director section
 *
 * @param button Clicked button element
 * @param section Section unique id
 * @param num Section number / position
 */
let copyShareholderFields = (button, section, num) => {

    // Request to copy shareholder data to director
    $.post(
        'shareholders/' + section + '/copy',
        {
            sectionNum: num
        },
        function (response) {

            // Render updated section
            $(button).closest('.section').replaceWith(response.data);
        }
    )
};

/**
 * Add step counter for all steps
 *
 * @constructor
 */
let AddStepCounter = () => {

    // All headings
    $('.step-counter:visible').each(
        // Callback
        function (index, elem) {

            $(elem).text((index + 1) + '.');
        }
    );
};

function addZeroes(num) {
    // Cast as number
    var num = Number(num);
    // If not a number, return 0
    if (isNaN) {
        return 0;
    }
    // If there is no decimal, or the decimal is less than 2 digits, toFixed
    if (String(num).split(".").length < 2 || String(num).split(".")[1].length <= 2) {
        num = num.toFixed(2);
    }
    // Return the number
    return num;
}

function showEditRegTr(event, $id, $roleUrl) {
    event.preventDefault();
    displayPageLoader();
    $.ajax({
        url: "/" + $roleUrl + "/registrations/" + $id + "/render-editable-tr/",
        type: "GET",
        success: function (data) {
            if (data.type === "success") {
                $('.reg-table table tbody tr[data-reg-id="' + $id + '"]').html(data.data);
                $('#payment_completion_date_input, #registration_start_date_input, #registration_end_date_input').datepicker({
                    selectMonths: true,
                    selectYears: true,
                    format: 'dd-mm-yyyy',
                    autoHide: true
                });
            }
            hidePageLoader();
        }
    });
}

function showEditLicenseDiv(event, elem, regId) {
    event.preventDefault();
    displayPageLoader();
    $.ajax({
        url: "/admin/registrations/" + regId + "/render-editable-licence-div/",
        type: "GET",
        success: function (data) {
            if (data.type === "success") {
                $('.radio_block_details_' + regId).replaceWith(data.data);
            }
            $('#completion_date_input').datepicker({
                selectMonths: true,
                selectYears: true,
                format: 'dd-mm-yyyy',
                useCurrent: false,
                autoHide: true
            });
            hidePageLoader();
        }
    });
}

function showEditCompanyDetailsDiv(event, elem, CompanyDetailsId) {
    event.preventDefault();
    displayPageLoader();
    $.ajax({
        url: "/admin/company-details/" + CompanyDetailsId + "/render-editable-div/",
        type: "GET",
        success: function (data) {
            if (data.type === "success") {
                $('.company_details_block_details').replaceWith(data.data);
            }
            $('#last_filling_of_accounts_input').datepicker({
                selectMonths: true,
                selectYears: true,
                format: 'dd-mm-yyyy',
                useCurrent: false,
                autoHide: true
            });
            $('#last_confirmation_statement_input').datepicker({
                selectMonths: true,
                selectYears: true,
                format: 'dd-mm-yyyy',
                useCurrent: false,
                autoHide: true
            });
            hidePageLoader();
        }
    });
}

function saveLicenseDiv(event, regId) {
    event.preventDefault();
    displayPageLoader();
    elem = $(event.target);
    $.ajax({
        url: "/admin/registrations/" + regId,
        type: "POST",
        data: {
            '_method': 'PUT',
            'order_id': $('#order_id_input_reg').val(),
            'mmsi_number': elem.closest('.row').find('.mmsi_number_input').val(),
            'atis_number': elem.closest('.row').find('.atis_number_input').val(),
            'call_sign': elem.closest('.row').find('.call_sign_input').val(),
            'completion_date': elem.closest('.row').find('.completion_date_input').val(),
        },
        success: function (data1) {
            if (data1.type === "success") {
                $.ajax({
                    url: "/admin/registrations/" + regId + "/render-show-licence-div/",
                    type: "GET",
                    success: function (data) {
                        if (data.type === "success") {
                            $('.radio_block_details_' + regId).replaceWith(data.data);
                        }
                        hidePageLoader();
                    }
                });
            }
            toastr.success(data1.msg);
        }
    });
}

function saveCompanyDetailsDiv(event, CompanyDetailsId) {
    event.preventDefault();
    displayPageLoader();
    elem = $(event.target);
    $.ajax({
        url: "/admin/company-details/" + CompanyDetailsId,
        type: "POST",
        data: {
            '_method': 'PUT',
            'order_id': $('#order_id_input_reg').val(),
            'company_number': elem.closest('.row').find('.company_number_input').val(),
            'auth_code': elem.closest('.row').find('.auth_code_input').val(),
            'utr_code': elem.closest('.row').find('.utr_code_input').val(),
            'last_filling_of_accounts': elem.closest('.row').find('.last_filling_of_accounts_input').val(),
            'last_confirmation_statement': elem.closest('.row').find('.last_confirmation_statement_input').val(),
        },
        success: function (data1) {
            if (data1.type === "success") {
                $.ajax({
                    url: "/admin/company-details/" + CompanyDetailsId + "/render-show-div/",
                    type: "GET",
                    success: function (data) {
                        if (data.type === "success") {
                            $('.company_details_block_details').replaceWith(data.data);
                        }
                        hidePageLoader();
                    }
                });
            }
            toastr.success(data1.msg);
        }
    });
}

function saveReg(event, $id, $roleUrl) {
    event.preventDefault();
    displayPageLoader();
    var orderId = $('#order_id_input_reg').val();
    $.ajax({
        url: "/" + $roleUrl + "/registrations/" + $id,
        type: "PUT",
        data: {
            'payment_completion_date' : $('#payment_completion_date_input').val(),
            'registration_start_date' : $('#registration_start_date_input').val(),
            'registration_end_date' : $('#registration_end_date_input').val(),
            'status' : $('#status-select').val(),
            'order_id' : orderId,
        },
        success: function (data1) {
            if (data1.type === "success") {
                $.ajax({
                    url: "/" + $roleUrl + "/registrations/" + $id + "/render-show-tr/",
                    type: "GET",
                    success: function (data) {
                        if (data.type === "success") {
                            $('.reg-table table tbody tr[data-reg-id="' + $id + '"]').html(data.data);
                        }
                        hidePageLoader();
                    }
                });
                localStorage.setItem('url', window.location.href);
                localStorage.setItem('elemId', '#registrations-tab');
                location.reload(true);
            }
        },
        error: function(){
            toastr.error('Please check your records and try again.');
            hidePageLoader();
        }
    });
}

function expireReg(event, $id, $roleUrl) {
    event.preventDefault();
    let data = {};
    data.id = $id;
    data.roleUrl = $roleUrl;
    customSwal(expireRegfunc, data,'Yes, Expire it!');

}

var expireRegfunc = function (dataArray){
    let $id = dataArray['id'];
    let $roleUrl = dataArray['roleUrl'];
    $.ajax({
        url: "/" + $roleUrl + "/registrations/" + $id + "/expire",
        type: "GET",
        success: function (data) {
            if (data.type === "success") {
                $.ajax({
                    url: "/" + $roleUrl + "/registrations/" + $id + "/render-show-tr/",
                    type: "GET",
                    success: function (dataRow) {
                        if (dataRow.type === "success") {
                            $('.reg-table table tbody tr[data-reg-id="' + $id + '"]').html(dataRow.data);
                        }
                        hidePageLoader();
                    }
                });
            }
        }
    });
};

function unExpireReg(event, $id, $roleUrl) {
    event.preventDefault();
    let data = {};
    data.id = $id;
    data.roleUrl = $roleUrl;
    customSwal(unExpireRegfuc, data,'Yes, Re-Activate it!');
}

var unExpireRegfuc = function (dataArray){
    let $id = dataArray['id'];
    let $roleUrl = dataArray['roleUrl'];
    $.ajax({
        url: "/" + $roleUrl + "/registrations/" + $id + "/re-activate",
        type: "GET",
        success: function (data) {
            if (data.type === "success") {
                $.ajax({
                    url: "/" + $roleUrl + "/registrations/" + $id + "/render-show-tr/",
                    type: "GET",
                    success: function (dataRow) {
                        if (dataRow.type === "success") {
                            $('.reg-table table tbody tr[data-reg-id="' + $id + '"]').html(dataRow.data);
                        }
                        hidePageLoader();
                    }
                });
            }
        }
    });
};

function renewReg(event, $id, $roleUrl, elem ) {
    event.preventDefault();
    displayPageLoader();
    $.ajax({
        url: "/" + $roleUrl + "/registrations/" + $id + "/renew",
        type: "GET",
        success: function (data1) {
            if (data1.type === "success") {
                elem.remove();
                hidePageLoader();
                toastr.success(data1.msg);
            } else {
                hidePageLoader();
                toastr.error(data1.msg);
            }
        }
    });
}

function cancelViewRegTr(event, $id, $roleUrl) {
    event.preventDefault();
    displayPageLoader();
    $.ajax({
        url: "/" + $roleUrl + "/registrations/" + $id + "/render-show-tr/",
        type: "GET",
        success: function (data) {
            if (data.type === "success") {
                $('.reg-table table tbody tr[data-reg-id="' + $id + '"]').html(data.data);
            }
            hidePageLoader();
        }
    });
}

function addEmptyUploadDiv(event, elem, reg_id) {
    event.preventDefault();
    displayPageLoader();
    $.ajax({
        url: "/admin/registrations-doc/"+reg_id+"/add-empty-upload-div/",
        type: "GET",
        success: function (data) {
            if (data.type === "success") {
                $('.reg_block_'+ reg_id+ ' .upload-inputs').append(data.data);
            }
            hidePageLoader();
        }
    });
}

function getUploadedDiv(elem, reg_id, doc_id) {
    $.ajax({
        url: "/admin/registrations-doc/" + reg_id + "/get-uploaded-div/",
        type: "GET",
        success: function (data) {
            if (data.type === "success") {
                elem.closest('.order_reg_doc_inner').replaceWith(data.data);
            }
            hidePageLoader();
        }
    });
}

function removeEmptyUploadDiv(event, elem) {
    event.preventDefault();
    displayPageLoader();
    elem.closest('.upload-input').remove();
    hidePageLoader();
}

function storeOrderLineItems(orderId, invoiceId = null, url = null) {
    var ajaxUrl;
    if (invoiceId) {
        ajaxUrl = "/admin/invoices/" + invoiceId + '/add-order-line-items';
    } else {
        ajaxUrl = "/admin/invoices/" + $('#invoice_id').val() + '/add-order-line-items';
    }
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        async: false,
        data: {
            orderId: orderId,
        },
        success: function(data) {
            if (data.type === "success") {
                if(url){
                    window.location.replace(url);
                }
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

function reCreateInvoice(event, orderId, invoiceId, url ) {
    event.preventDefault();
    displayPageLoader();
    storeOrderLineItems(orderId, invoiceId, url );
}

function updateRegistrationDocComment(event, elem, docId) {
    event.preventDefault();
    var data = {
        comments: elem.val(),
    };
    $.ajax({
        url: "/admin/registrations-doc/" + docId + "/update-comment",
        type: "POST",
        data: data,
        success: function (data) {
            if (data.type === "success") {
                elem.closest('.input-group').replaceWith(data.data);
            }
            hidePageLoader();
        }
    });
}

function updateExpirationDate(event, elem) {

    var startDate = elem.val();
    var renewalYears = $('.renewal_years').text();
    var expiryDate = elem.closest('tr').find('td .registration_end_date_input');
    if(renewalYears != 0 ){
        if (startDate !== '') {
            expiryDate.removeAttr('disabled');
            $('#registration_end_date_input').datepicker('destroy');
            $.ajax({
                url: "../../../calculate-expiry/"+ startDate + "/" + renewalYears,
                type: "POST",
                success: function (data) {
                    expiryDate.val(data);
                    $('#registration_end_date_input').datepicker('destroy');
                    $('#registration_end_date_input').datepicker({
                        startDate: data,
                        selectMonths: true,
                        selectYears: true,
                        format: 'dd-mm-yyyy',
                        autoHide: true
                    });
                }
            });
        } else {
            expiryDate.val('');
            expiryDate.attr('disabled', true);
        }

    }
}
