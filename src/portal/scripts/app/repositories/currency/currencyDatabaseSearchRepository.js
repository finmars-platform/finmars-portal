/**
 * Created by szhitenev on 22.04.2022.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (name, page) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        if (page === null || page === undefined) {
            page = 0
        }

        var url = baseUrl + '/' + prefix + '/api/'  + 'currencies/currency-database-search/?name=' + name + '&page=' + page


        return xhrService.fetch(url,
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
        getList: getList
    }

}());