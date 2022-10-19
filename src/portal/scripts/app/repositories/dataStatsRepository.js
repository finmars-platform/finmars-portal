/**
 * Created by szhitenev on 15.10.2022.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();


    var getStats = function (period) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();


        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/utils/stats/?period=' + period,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    module.exports = {
        getStats: getStats,

    }

}());