/**
 * Created by szhitenev on 04.05.2016.
 */

// import baseUrlService from '../../../../shell/scripts/app/services/baseUrlService.js';

(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService').default;
    var baseUrlService = require('../../../../shell/scripts/app/services/baseUrlService.js').default;

    var baseUrl = baseUrlService.resolve();

    var authorizerUrl = baseUrlService.getAuthorizerUrl();

    var getList = function () {

        var prefix = baseUrlService.getMasterUserPrefix();

        return window.fetch(authorizerUrl + '/two-factor/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            return data.json();
        })
    };

    var pachByKey = function (id, token) {

        var prefix = baseUrlService.getMasterUserPrefix();

        return window.fetch(authorizerUrl + '/two-factor/' + id + '/', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(token)
        }).then(function (data) {
            return data.json();
        })
    };


    var generateCode = function (data) {

        var prefix = baseUrlService.getMasterUserPrefix();

        return window.fetch(authorizerUrl + '/two-factor/generate-code/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function (data) {
            return data.json();
        })
    };

    var validateCode = function (data) {

        var prefix = baseUrlService.getMasterUserPrefix();

        return window.fetch(authorizerUrl + '/two-factor/validate-code/', {
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

        var prefix = baseUrlService.getMasterUserPrefix();

        return window.fetch(authorizerUrl + '/two-factor/' + id + '/', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            return new Promise(function (resolve, reject) {
                resolve({status: 'deleted'});
            });
        })
    };

    var activateTwoFactor = function (id) {

        var prefix = baseUrlService.getMasterUserPrefix();

        return window.fetch(authorizerUrl + '/two-factor/' + id + '/', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({id: id, is_active: true})
        }).then(function (data) {
            return data.json();
        })
    };


    module.exports = {
        getList: getList,
        generateCode: generateCode,
        validateCode: validateCode,
        deleteByKey: deleteByKey,
        activateTwoFactor: activateTwoFactor,
        pachByKey: pachByKey
    }

}());