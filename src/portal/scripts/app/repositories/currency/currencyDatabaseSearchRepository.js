/**
 * Created by szhitenev on 22.04.2022.
 */
// import baseUrlService from "../../services/baseUrlService";
(function () {

    'use strict';

    var baseUrlService = require("../../services/baseUrlService").default;
    var cookieService = require('../../../../../core/services/cookieService').default;
    var xhrService = require('../../../../../core/services/xhrService').default;
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService').default;
    // var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (searchString, page) {

        // var prefix = baseUrlService.getMasterUserPrefix();
        // var apiVersion = baseUrlService.getApiVersion();

        if (page === null || page === undefined) {
            page = 1
        }

        // var url = baseUrl + '/' + prefix + '/api/v1/'  + 'currencies/currency-database-search/?query=' + searchString + '&page=' + page


        return xhrService.fetch('https://database.finmars.com/api/v1/currency/?query=' + searchString + '&page_size=40' + '&page=' + page,
            {
                method: 'GET',
                // credentials: 'include',
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