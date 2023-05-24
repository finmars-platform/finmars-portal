(function () {

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');
    var entityUrlService = require('../../services/entityUrlService');
    var queryParamsHelper = require('../../helpers/queryParamsHelper');

    var filterService = require('./filter.service');
    var xhrService = require('../../../../../core/services/xhrService');

    var baseUrl = baseUrlService.resolve();

    var getFilteredList = function (entityType, options) {

        console.log('getFilteredList.options', options);

        // options.filter_settings = filter_settings;

        var entityUrl = entityUrlService.resolve(entityType);


        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + entityUrl + '/ev-item/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(options)
            })


    };

    module.exports = {
        getFilteredList: getFilteredList
    }

}());