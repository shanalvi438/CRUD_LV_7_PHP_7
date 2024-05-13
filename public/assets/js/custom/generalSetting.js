$(document).ready(
    function () {
        let label = $('#label');
        label.keyup(function () {
            let label_val = label.val();
            $('#slug').val(convertToSlug(label_val));
        });
        $("#general-setting-form").on("form-success-event", function (event, data) {
            $(this).find('input').val('');
            window.location = '/admin/general-settings';
        });
    }
);

function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/ /g,'_')
        .replace(/[^\w-]+/g,'')
        ;
}


$('.monthdate-picker').datepicker({
    selectMonths: true,
    selectYears: true,
    format: 'd-mm',
    autoHide: true
});


let setAjaxCSRF = () => {

    $.ajaxSetup(
        {
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        }
    );
};

/**
 *
 * @param elem
 * @param id
 */
let uploadFile = (elem, id ) => {

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

        data.append("file", file);
        var url = "file/upload";

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
                location.reload(true);
            }
        });
    }
};

/**
 * @param e
 * @param id
 *
 */
let removeFile = (e, id) => {
    let elem = e.currentTarget;

    $.ajax(
        {
            url: 'file/remove',
            data: {},
            processData: false,
            contentType: false,
            type: "POST",
            success: function (data) {
                location.reload(true);
            }
        }
    );
};
