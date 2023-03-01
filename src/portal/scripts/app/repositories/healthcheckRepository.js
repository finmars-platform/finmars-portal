/**
 * Created by szhitenev on 28.07.2020.
 */
(function () {

    'use strict';

    var xhrService = require('../../../../core/services/xhrService');
    var cookieService = require('../../../../core/services/cookieService');

    var getData = function () {


        // var prefix = baseUrlService.getMasterUserPrefix();
        // var apiVersion = baseUrlService.getApiVersion();

        // return xhrService.fetch('__HEALTHCHECK_HOST__',
        return xhrService.fetch(window.HEALTHCHECK_HOST,
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

        getData: getData
    }

}());