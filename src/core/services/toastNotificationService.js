/**
 * Created by szhitenev on 15.06.2016.
 */

(function () {


    var error = function (message) {
        toastr.error(message);
    };

    module.exports = {
        error: error
    }


}());