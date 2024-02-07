/**
 * Created by szhitenev on 10.12.2019.
 */
// import baseUrlService from "../../services/baseUrlService";
(function () {

    var baseUrlService = require("../../services/baseUrlService").default;
    var cookieService = require('../../../../../core/services/cookieService').default;
    var xhrService = require('../../../../../core/services/xhrService').default;
    // var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var process = function (config) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'reconciliation/process-bank-file/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: config
            })
    };

    module.exports = {
        process: process
    }

}());