(function () {

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');
    var entityUrlService = require('../../services/entityUrlService');
    var queryParamsHelper = require('../../helpers/queryParamsHelper');

    var baseUrl = baseUrlService.resolve();

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
        }).then(function (data) {

            data.results = data.results.map(function (item) {
                item.___group_name = item.group_name;
                item.___group_id = item.group_id;
                return item
            });

            return data;

        })


    };

    module.exports = {
        getList: getList
    }


}());