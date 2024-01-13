/**
 * Created by szhitenev on 04.05.2016.
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

    var getList = function (options) {

var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/payment-size-detail/', options),
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