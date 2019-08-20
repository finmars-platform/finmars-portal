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
            "key":"user_text_1",
            "filter_type":"contains",
            "exclude_empty_cells":false,
            "value_type":10,
            "value":[
                "1"
            ]
        },
        // {
        //     "key":"user_code",
        //     "filter_type":"does_not_contain",
        //     "exclude_empty_cells":false,
        //     "value_type":10,
        //     "value":[
        //         "10"
        //     ]
        // },
        // {
        //     "key":"position_size",
        //     "filter_type":"from_to",
        //     "exclude_empty_cells":false,
        //     "value_type":20,
        //     "value":{
        //         "max_value":900000,
        //         "min_value":0
        //     }
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