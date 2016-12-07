/**
 * Created by szhitenev on 04.08.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getInstrumentMappingList = function () {
        return window.fetch(baseUrl + 'import/instruments/instrument/mapping/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };


    module.exports = {
        getInstrumentMappingList: getInstrumentMappingList
    }

}());