(function () {

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');
    var entityUrlService = require('../../services/entityUrlService');
    var queryParamsHelper = require('../../helpers/queryParamsHelper');

    var filterService = require('./filter.service');

    var baseUrl = baseUrlService.resolve();

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

    module.exports = {
        getList: getList
    }

}());