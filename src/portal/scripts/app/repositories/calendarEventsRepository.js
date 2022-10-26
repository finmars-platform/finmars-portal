/**
 * Created by szhitenev on 19.10.2022.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();


    var getList = function (date_from, date_to, filter_query) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();


        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/utils/calendar-events/?date_from=' + date_from + '&date_to=' + date_to + '&filter=' + filter_query,
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
        getList: getList,

    }

}());