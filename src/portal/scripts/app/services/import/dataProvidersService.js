/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var dataProvidersRepository = require('../../repositories/import/dataProvidersRepository');

    var getList = function () {
        return dataProvidersRepository.getList();
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

    module.exports = {
        getList: getList,
        getConfig: getConfig,
        setConfig: setConfig,
        createConfig: createConfig
    }

}());