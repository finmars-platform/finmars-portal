/**
 * Created by szhitenev on 22.12.2020.
 */
(function () {

    'use strict';

    var xhrService = require('../../../../core/services/xhrService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getValuesForSelect = function (contentType, key, valueType) {
        return xhrService.fetch(baseUrl + 'specific-data/values-for-select?content_type=' + contentType + '&key=' + key + '&value_type=' + valueType,
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

        getValuesForSelect: getValuesForSelect,

    }

}());