(function () {

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');
    var entityUrlService = require('../../services/entityUrlService');
    var queryParamsHelper = require('../../helpers/queryParamsHelper');

    var baseUrl = baseUrlService.resolve();

    // DEPRECATED
    var getList = function (entityType, options) {

        var entityUrl = entityUrlService.resolve(entityType);

        var queryParams = '';

        if (options) {
            queryParams = '?' + queryParamsHelper.toQueryParamsString(options)
        }

        return window.fetch(baseUrl + entityUrl + '-ev-group/' + queryParams,
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

    var getFilteredList = function (entityType, options) {

        var entityUrl = entityUrlService.resolve(entityType);

        return window.fetch(baseUrl + entityUrl + '-ev-group/' + '/filtered/',
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