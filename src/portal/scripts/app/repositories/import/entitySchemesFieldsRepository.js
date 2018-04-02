/**
 * Created by szhitenev on 20.03.2018.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getSchemeFields = function (schemeId) {
        return window.fetch(baseUrl + 'import/schema_fields/?schema_id=' + schemeId,
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

    var deleteField = function (id) {
        return window.fetch(baseUrl + 'import/schema_fields/' + id + '/',
            {
                method: 'DELETE',
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
        getSchemeFields: getSchemeFields,
        deleteField: deleteField
    }

} ());