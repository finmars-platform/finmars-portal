/**
 * Created by szhitenev on 26.08.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');

    var baseUrl = '/api/v1/';

    var getList = function () {
        return window.fetch(baseUrl + 'instruments/periodicity/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
            .then(function (data) {
                return data.json();
            })
    };

    module.exports = {
        getList: getList
    };

}());