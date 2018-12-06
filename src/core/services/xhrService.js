/**
 * Created by szhitenev on 15.06.2016.
 */

(function () {

    var errorService = require('./errorService');

    var fetch = function (url, params) {

        return window
            .fetch(url, params)
            .then(errorService.handleXhrErrors)
            .catch(errorService.notifyError)

    };

    module.exports = {
        fetch: fetch
    }


}());