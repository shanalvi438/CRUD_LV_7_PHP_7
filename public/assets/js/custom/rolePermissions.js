$(function () {

    $("#update-role-form input:checkbox, #create-role-form input:checkbox").click(function syncPermission(e) {
        console.log("in");
        var selected = this;

        // If checkbox readonly then not to perform any action
        if (typeof $(selected).attr("readonly") != "undefined") {

            e.preventDefault();
            return false;
        }

        // Off syncPermission method to prevent from calling it on every trigger
        $(this).closest('tr').find("input:checkbox").off('click', syncPermission);

        // Update all next checkboxes
        $(this).closest("td").nextAll().each(function () {

            if ($(selected).is(":checked")) {

                $(this).find("input:checkbox:not(:checked)").trigger('click');

                $(this).find("input:checkbox").attr('readonly', true);
            } else {

                $(this).find("input:checkbox").removeAttr('readonly');
                $(this).find("input:checkbox:checked").trigger('click').removeAttr('readonly');
            }
        });

        // Again on the method for real clicks
        $(this).closest('tr').find("input:checkbox").on('click', syncPermission);
    });
});