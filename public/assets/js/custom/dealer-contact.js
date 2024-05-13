$(document).ready(function() {
    $('.email-select.browser-default.custom-select').change(function () {
        var elem = $(this);
        var dealer_div = $('.dealers-' + elem.val() + '-detail');
        dealer_div.siblings().addClass('hidden');
        if (dealer_div.hasClass('hidden')) {
            dealer_div.removeClass('hidden');
        }
    });
});
