/**
 * Make Modules and fields sortable
 */
$(function () {
    $("#module-sortable").sortable({
        stop: function (event, ui) {
            var sortOrder = [];
            $("#module-sortable").find('li.module-items').each(function (j, li) {
                sortOrder.push($(li).attr('data-id'));
            });
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                url: base_url + '/admin/product-modules/sort',
                data: {sortOrder: sortOrder},
                type: 'post',
                dataType: 'json',
                success: function (response) {

                }
            });
        },
        handle: '.handle'
    });
    $("#module-sortable").disableSelection();

    $(".fields-sortable").sortable({
        stop: function (event, ui) {
            var listItem = ui.item[0];
            var sortOrder = [];
            $(listItem).parent('ul').find('li').each(function (j, li) {
                sortOrder.push($(li).attr('data-id'));
            });
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                url: base_url + '/admin/product-modules-fields/sort',
                data: {sortOrder: sortOrder},
                type: 'post',
                dataType: 'json',
                success: function (response) {

                }
            });
        },
        handle: '.handle'
    });
    $(".fields-sortable").disableSelection();

});
