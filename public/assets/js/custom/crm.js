$(document).ready(
    function () {

        /**
         * Send preview of mail templates to admin.
         */
        $('.send-preview-email').click(
            function (e) {
                // Prevent default on click event.
                e.preventDefault();

                let url = $(this).attr('href')

                $.ajax({
                    url: url,
                    type: 'post',
                    beforeSend: function () {
                        //lock page.
                        lockForm();
                    },
                    success: function (data) {
                        // Unlock page.
                        unlockForm();

                        if ('type' in data) {
                            // Display toaster
                            showToaster(data.type, data.msg);
                        }
                    }
                })
            }
        );
    }
);

/**
 * Create crm mail modals success event.
 */
$(document).on(
    "form-success-event",
    "#mail-group-form, #mail-choice-form, #mail-template-form, #crm-email-form, #contact-form",
    function (event, data) {

        location.reload();
    }
);

/**
 * Display related templates only when choosing a group.
 */
$(document).on(
    'change',
    '#crm-email-form #mail_group',
    function () {

        let group = $(this).val();
        $.ajax(
            {
                url: '/admin/crm/groups/' + group + '/templates',
                success: function (data) {

                    // Display only related template options
                    $('#crm-email-form #mail_template')
                        .html(data).trigger('change');
                }
            }
        );
    }
);

/**
 * Display selected templates subject and content.
 */
$(document).on(
    'change',
    '#crm-email-form #mail_template',
    function () {

        let template = $(this).val();
        $.ajax(
            {
                url: '/admin/crm/templates/' + template + '/to-json',
                success: function (response) {

                    if (response.type === 'success') {
                        $('#crm-email-form #subject')
                            .val(response.data.subject);

                        $('#crm-email-form #body')
                            .val(response.data.content);

                        $('#crm-email-form #body-editor div.ql-editor')
                            .html(response.data.content);
                    }
                }
            }
        );
    }
);


$(document).on("click", ".attachment-btn", function () {

    let formGroup = $(this).closest(".form-group");

    //Remove view file link and button
    formGroup.find('.view-btn-group').remove();

    // Enable remove attachment variable
    formGroup.find('input[name="removed_attachments[]"]').removeAttr('disabled');

    // Display File input
    formGroup.find('input[name^="attachments"]').removeAttr('disabled').removeClass('hidden');

    // Set up ajax settings
    /*ajaxSetup();
    $.ajax({
        url: $(this).data('url'),
        type: 'post',
        beforeSend: function () {
            lockForm();
        },
        success: function (data) {
            // Unlocking form
            unlockForm();
        },
        error: function (data) {
            // Unlocking form
            unlockForm();
            // Show toaster.
            showToaster("error", "Error occurred while removing the file.");
        }
    });*/
});
