/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function () {
        return window.fetch(baseUrl + 'import/provider/',
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

    var getConfig = function (providerId) {
        return window.fetch(baseUrl + 'import/config/?provider=' + providerId,
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

    var setConfig = function(providerId, provider) {

        return window.fetch(baseUrl + 'import/config/' + providerId,
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: provider
            }).then(function (data) {
            return new Promise(function (resolve, reject) {
                data.json().then(function (result) {
                    resolve({
                        response: result,
                        status: data.status
                    })
                })
            });
        })


    };

    module.exports = {
        getList: getList,
        getConfig: getConfig,
        setConfig: setConfig
    }

}());