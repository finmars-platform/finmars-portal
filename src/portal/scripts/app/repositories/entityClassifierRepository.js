/**
 * Created by szhitenev on 15.06.2016.
 */

(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');

    var metaRestrictionsService = require('../services/metaRestrictionsService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    function endPointResolver(entity) {
        switch (entity) {
            case 'counterparty':
                return 'counterparties/' + entity + '-classifier/';
                break;
            case 'responsible':
                return 'counterparties/' + entity + '-classifier/';
                break;
            default:
                return entity + 's/' + entity + '-classifier/';
        }
    }

    var getList = function (entity) {

        if (metaRestrictionsService.getEntitiesWithoutDynamicAttrsList().indexOf(entity) !== -1) {
            return new Promise(function (resolve) {
                resolve({results: []})
            })
        }


var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + endPointResolver(entity),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getByKey = function (entity, id) {


var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + endPointResolver(entity) + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var create = function (entity, attributeType) {

var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + endPointResolver(entity),
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(attributeType)
            })
    };

    var update = function (entity, id, attributeType) {

var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + endPointResolver(entity) + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(attributeType)
            })
    };

    var deleteByKey = function (entity, id) {

var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + endPointResolver(entity) + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return new Promise(function (resolve, reject) {
                console.log('data', data);
                if (data.status === 409) {
                    resolve({status: 'conflict'});
                }
                resolve({status: 'success'});

            });
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