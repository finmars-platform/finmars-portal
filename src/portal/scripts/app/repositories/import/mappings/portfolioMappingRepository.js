/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../../core/services/cookieService');
    var xhrService = require('../../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {
        return xhrService.fetch(baseUrl + 'import/portfolio-mapping/?page_size=1000',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };
    var create = function (map) {
        return xhrService.fetch(baseUrl + 'import/portfolio-mapping/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(map)
            })
    };

    var getByKey = function (id) {
        return xhrService.fetch(baseUrl + 'import/portfolio-mapping/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var update = function (id, map) {
        return xhrService.fetch(baseUrl + 'import/portfolio-mapping/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(map)
            })
    };

    var deleteByKey = function (id) {
        return xhrService.fetch(baseUrl + 'import/portfolio-mapping/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());