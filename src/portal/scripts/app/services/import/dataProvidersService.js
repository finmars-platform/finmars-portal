/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var dataProvidersRepository = require('../../repositories/import/dataProvidersRepository');

    var getList = function () {
        return dataProvidersRepository.getList();
    };

    var getConfigs = function () {
        return dataProvidersRepository.getConfigs();
    };

    var getConfig = function (providerId) {
        return dataProvidersRepository.getConfig(providerId);
    };

    var setConfig = function (providerId, provider) {
        return dataProvidersRepository.setConfig(providerId, provider);
    };

    var createConfig = function (provider) {
        return dataProvidersRepository.createConfig(provider)
    };

    var bloombergTestCertificate = function(data) {
        return dataProvidersRepository.bloombergTestCertificate(data)
    }

    module.exports = {
        getList: getList,
        getConfigs: getConfigs,
        getConfig: getConfig,
        setConfig: setConfig,
        createConfig: createConfig,
        bloombergTestCertificate: bloombergTestCertificate
    }

}());