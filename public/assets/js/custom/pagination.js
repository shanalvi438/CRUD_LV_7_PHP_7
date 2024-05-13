/**
 * Override the default behaviour of Pagination.
 * Change sync request to async.
 * Render only data list html.
 *
 * ************ Html Structure Instructions ************
 *
 * Filter form must contain
 *      "data-id" attribute
 * And
 *      class "search-filters".
 *
 * "data-id" is is the ID of Data List element
 * e.g data-id="#userList" (must contain #)
 *
 * ************ Data list Html Structure ************
 *
 *  <div id="dataList"> // Replace dataList with unique ID
 *      // File containing list Start //
 *      <div class="ajax-listing">
 *          <div class="table-responsive">
 *              <table>
 *                  // Table of data
 *              </table>
 *          </div>
 *          // Render "Pagination" here
 *      </div>
 *      // File containing list End //
 *  </div>
 *
 *  Also Make sure to that form action url send only ajax-listing element.
 */

/**
 * Render list with chosen page size.
 */
$(document).on(
    'change',
    '.page-size-setter',
    function () {

        $(this).closest('form').submit();
    }
);

/**
 * Render Searched data through filters.
 */
$(document).on(
    'submit',
    'form.search-filters',
    function (e) {

        // Prevent default pagination
        e.preventDefault();

        // Request settings
        let requestSettings = {
            url: $(this).prop('action'),
            data: $(this).serialize()
        };

        // Element containing list
        let renderElemId = $(this).data('id');
        let renderElem = $(renderElemId);

        // Render output list html
        _getDataList(
            requestSettings,
            renderElem,
            true
        );
    }
);

// /**
//  * Render pagination data list.
//  */
// $(document).on(
//     'click',
//     '.ajax-listing .pagination a',
//     function (e) {

//         // Prevent default pagination
//         e.preventDefault();

//         // Request settings
//         let requestSettings = {
//             url: $(this).prop('href')
//         };

//         // Element containing list
//         let renderElem = $(this).closest('.ajax-listing').parent();

//         // Render output list html
//         _getDataList(
//             requestSettings,
//             renderElem,
//             false
//         );
//     }
// );

/**
 * Get data list using AJAX request.
 *
 * @param settings
 * @param renderElem
 *
 * @private
 */
function _getDataList(settings, renderElem, isDisplayLoader)
{
    // Display page pre-loader
    if (isDisplayLoader) {
        displayPageLoader('fast');
    }

    // Send request to get filter data
    $.ajax(
        settings
    ).done(
        function (data) {

            // Render data list html
            renderElem.html(data);
        }
    ).fail(
        function () {

            // Display error alert
            showToaster(
                'error',
                'Data could not be loaded!'
            );
        }
    ).always(
        function () {

            // Hide page pre-loader
            if (isDisplayLoader) {
                hidePageLoader('fast');
            }
        }
    );
}

