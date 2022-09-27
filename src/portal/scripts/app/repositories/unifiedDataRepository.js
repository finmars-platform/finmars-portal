/**
 * Created by szhitenev on 19.01.2022.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = 'https://udp.finmars.com'

    var getList = function (entityType, options) {

        var path = '';

        if (entityType === 'counterparty') {
            path = 'company'
        }

        if (entityType === 'currency') {
            return new Promise(function (resolve) {

                resolve({
                    count: 0,
                    results: []
                })
            })

        }

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(   baseUrl  +  '/data/' + path + '/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getConfigurationPackageGroupList = function (options) {

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl  +  '/data/configuration-package-group/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getConfigurationPackageList = function (options) {

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl  +  '/data/configuration-package/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getConfigurationPackageFile = function (id) {

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl  +  '/data/configuration-package/' + id + '/view/', {}),
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

        getList: getList,
        getConfigurationPackageGroupList: getConfigurationPackageGroupList,
        getConfigurationPackageList: getConfigurationPackageList,
        getConfigurationPackageFile: getConfigurationPackageFile

    }

}());