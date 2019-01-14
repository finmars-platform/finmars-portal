/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var cookieService = require('../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var exportAll = function () {

        return window.fetch(baseUrl + 'export/configuration/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })

    };

    var getConfigurationData = function () {

        return window.fetch(baseUrl + 'export/configuration/', {
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

    var getMappingData = function () {

        return window.fetch(baseUrl + 'export/mapping/', {
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
        exportAll: exportAll,
        getConfigurationData: getConfigurationData,
        getMappingData: getMappingData
    }


}());