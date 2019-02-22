/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var rebuildEvents = function (id, instrument) {
        return xhrService.fetch(baseUrl + 'instruments/instrument/' + id + '/rebuild-events/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(instrument)
            })
    };

    module.exports = {
        rebuildEvents: rebuildEvents

    }


}());