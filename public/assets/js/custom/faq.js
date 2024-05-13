$(document).ready(
    function () {

        $(".publish-form.publish").on("form-success-event", function (event, data) {
            var form = $(this);
            var status  = form.parent('div.col-md-1').siblings('div.col-md-1').children('.faq-status');;
            form.addClass('hidden');
            form.siblings('form').removeClass('hidden');
            status.removeClass('badge-danger');
            status.text('Published');
            status.addClass('badge-success');
        });

        $(".publish-form.unpublish").on("form-success-event", function (event, data) {
            var form    = $(this);
            var status  = form.parent('div.col-md-1').siblings('div.col-md-1').children('.faq-status');
            form.addClass('hidden');
            form.siblings('form').removeClass('hidden');
            status.addClass('badge-danger');
            status.text('Un Published');
            status.removeClass('badge-success');
        });

        $("#faq-form").on("form-success-event", function (event, data) {
            $(this).find('input').val('');
            window.location = '/admin/faqs';
        });

        $('#faqs-search-form').on('keyup keypress', function(e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode === 13) {
                e.preventDefault();
                return false;
            }
        });

        $("#faqs-search-form").on("form-success-event", function (event, data) {
            $('#accordionFaqs').html(data)
        });

    }
);
