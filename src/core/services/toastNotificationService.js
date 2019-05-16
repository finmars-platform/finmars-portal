/**
 * Created by szhitenev on 15.06.2016.
 */

(function () {


    var error = function (message) {

        var searchParams = new URLSearchParams(window.location.search);

        if (searchParams.get('debug') === 'true') {
            toastr.error(message);
        }

    };

    module.exports = {
        error: error
    }


}());