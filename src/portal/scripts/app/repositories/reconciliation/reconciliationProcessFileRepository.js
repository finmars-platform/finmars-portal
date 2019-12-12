/**
 * Created by szhitenev on 10.12.2019.
 */
(function(){

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var process = function (config) {
        return xhrService.fetch(baseUrl + 'reconciliation/process-bank-file/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: config
            })
    };

    module.exports = {
        process: process
    }

}());