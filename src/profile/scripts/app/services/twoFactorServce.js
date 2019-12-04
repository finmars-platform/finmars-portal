/**
 * Created by szhitenev on 04.05.2016.
 */

(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var baseUrlService = require('./baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function () {
        return window.fetch(baseUrl + 'users/two-factor/', {
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


    var generateCode = function (data) {
        return window.fetch(baseUrl + 'users/two-factor/generate-code/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function (data) {
            return data.json();
        })
    };

    var validateCode = function (data) {
        return window.fetch(baseUrl + 'users/two-factor/validate-code/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function (data) {
            return data.json();
        })
    };

    var deleteByKey = function (id) {
        return window.fetch(baseUrl + 'users/two-factor/' + id + '/', {
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
        })
    };


    module.exports = {
        getList: getList,
        generateCode: generateCode,
        validateCode: validateCode,
        deleteByKey: deleteByKey
    }

}());