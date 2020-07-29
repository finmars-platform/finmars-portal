/**
 * Created by szhitenev on 28.07.2020.
 */
(function () {

    'use strict';

    var xhrService = require('../../../../core/services/xhrService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getData = function () {

        baseUrl = baseUrl.split('v1/')[0];

        return xhrService.fetch(baseUrl + 'healthcheck/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    module.exports = {

        getData: getData
    }

}());