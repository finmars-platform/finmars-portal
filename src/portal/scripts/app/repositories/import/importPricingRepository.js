/**
 * Created by szhitenev on 25.08.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');

    var baseUrl = '/api/v1/';

    var create = function (price) {
        return window.fetch(baseUrl + 'import/pricing/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(price)
            }).then(function (data) {
            return data.json();
        })
    };

    module.exports = {
        create: create
    }

}());