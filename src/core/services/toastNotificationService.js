/**
 * Created by szhitenev on 15.06.2016.
 */

(function () {


    var success = function (message) {
        toastr.success(message);
    };

    var error = function (message) {

        var searchParams = new URLSearchParams(window.location.search);

        // if (searchParams.get('debug') === 'true') {
            toastr.error(message);
        // }

    };

    var info = function (message) {
        toastr.info(message);
    };

    module.exports = {
        success: success,
        error: error,
        info: info
    }


}());