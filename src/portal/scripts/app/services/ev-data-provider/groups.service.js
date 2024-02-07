// import baseUrlService from "../../services/baseUrlService";
(function () {

    var baseUrlService = require("../../services/baseUrlService").default;
    var cookieService = require('../../../../../core/services/cookieService').default;
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService').default;
    // var baseUrlService = require('../../services/baseUrlService');
    var entityUrlService = require('../../services/entityUrlService');
    var queryParamsHelper = require('../../helpers/queryParamsHelper');

    var baseUrl = baseUrlService.resolve();
    var xhrService = require('../../../../../core/services/xhrService').default;


    var getFilteredList = function (entityType, options) {

        var entityUrl = entityUrlService.resolve(entityType);


        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + entityUrl + '/ev-group/',
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