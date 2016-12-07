/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {
        return window.fetch(baseUrl + 'reports/report/',
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
        getList: getList
    }

}());