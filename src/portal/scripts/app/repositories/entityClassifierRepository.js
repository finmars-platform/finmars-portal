/**
 * Created by szhitenev on 15.06.2016.
 */

(function(){

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');

    var metaRestrictionsService = require('../services/metaRestrictionsService');

    var baseUrl = '/api/v1/';

    function endPointResolver(entity) {
        switch (entity){
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

        if(metaRestrictionsService.getEntitiesWithoutDynamicAttrsList().indexOf(entity) !== -1) {
            return new Promise(function(resolve){resolve({results: []})})
        }

        return window.fetch(baseUrl + endPointResolver(entity),
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

    var getByKey = function (entity, id) {

        return window.fetch(baseUrl + endPointResolver(entity) + id + '/',
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

    var create = function (entity, attributeType) {
        return window.fetch(baseUrl + endPointResolver(entity),
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(attributeType)
            }).then(function (data) {
            return data.json();
        })
    };

    var update = function (entity, id, attributeType) {
        return window.fetch(baseUrl + endPointResolver(entity) + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(attributeType)
            }).then(function (data) {
            return data.json();
        })
    };

    var deleteByKey = function (entity, id) {
        return window.fetch(baseUrl + endPointResolver(entity) + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return new Promise(function(resolve,reject) {
                console.log('data', data);
                if(data.status === 409) {
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