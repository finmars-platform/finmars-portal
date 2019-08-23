(function () {

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');
    var entityUrlService = require('../../services/entityUrlService');
    var queryParamsHelper = require('../../helpers/queryParamsHelper');

    var filterService = require('./filter.service');

    var baseUrl = baseUrlService.resolve();

    // DEPRECATED
    var getList = function (entityType, options) {

        var entityUrl = entityUrlService.resolve(entityType);

        var queryParams = '';

        if (options) {
            queryParams = '?' + queryParamsHelper.toQueryParamsString(options)
        }

        return window.fetch(baseUrl + entityUrl + '/' + queryParams,
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

        /*return window.fetch(configureRepositoryUrlService.configureUrl(baseUrl + entityUrl, options),
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(function (response) {

                if (!response.ok) {
                    throw response;
                }

                return response.json();
            })
*/
    };

    var filter_settings = [
        {
            "key":"attributes.Asse_Sub_Type",
            "filter_type":"does_not_contains",
            "exclude_empty_cells": false,
            "value_type":10,
            "value":[
                'Bank notes'
            ]
        },
        // {
        //     "key":"attributes.ISIN",
        //     "filter_type":"contains",
        //     "exclude_empty_cells":false,
        //     "value_type":10,
        //     "value":[
        //         'US 12344444'
        //     ]
        // },
        // {
        //     "key":"attributes.number_attr",
        //     "filter_type":"equal",
        //     "exclude_empty_cells":false,
        //     "value_type":20,
        //     "value":[
        //         15242
        //     ]
        // }

    ];

    var getFilteredList = function (entityType, options) {

        // options.filter_settings = filter_settings;

        var entityUrl = entityUrlService.resolve(entityType);

        return window.fetch(baseUrl + entityUrl + '/filtered/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(options)
            }).then(function (data) {
            return data.json();
        })


    };

    module.exports = {
        getList: getList, // DEPRECATED
        getFilteredList: getFilteredList
    }

}());