/**
 * Created by szhitenev on 04.08.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService'); var xhrService = require('../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getInstrumentMappingList = function () {
        return xhrService.fetch(baseUrl + 'import/instruments/instrument/mapping/',
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
        getInstrumentMappingList: getInstrumentMappingList
    }

}());