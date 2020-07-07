(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');

    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {
        if (!options) {
            options = {
                pageSize: 1000
            }
        }

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/color-palette/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    }

    var create = function (palette) {
        return xhrService.fetch(baseUrl + 'ui/color-palette/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(palette)
            })
    };

    var updateById = function (id, palettes) {
        return xhrService.fetch(baseUrl + 'ui/color-palette/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(palettes)
            })
    };

    var deleteById = function (id) {
        return xhrService.fetch(baseUrl + 'ui/color-palette/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {

                return new Promise(function (resolve, reject) {
                    resolve({status: 'deleted'});
                });

        });
    };

    module.exports = {
        getList: getList,
        updateById: updateById,
        deleteById: deleteById,
        create: create
    }

}());