/**
 * Created by szhitenev on 19.10.2022.
 */
// import baseUrlService from "../services/baseUrlService";
(function () {

    'use strict';

    var baseUrlService = require("../services/baseUrlService").default;
    var cookieService = require('../../../../core/services/cookieService').default;
    var xhrService = require('../../../../core/services/xhrService').default;
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService').default;

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