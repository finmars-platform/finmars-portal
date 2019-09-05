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
                return 'counterparties/' + entity + '-attribute-type/';
                break;
            case 'responsible':
                return 'counterparties/' + entity + '-attribute-type/';
                break;
            case 'currency':
                return 'currencies/' + entity + '-attribute-type/';
                break;
            case 'complex-transaction':
                return 'transactions/' + entity + '-attribute-type/';
                break;
            case 'transaction-type':
                return 'transactions/' + entity + '-attribute-type/';
                break;
            case 'instrument-type':
                return 'instruments/' + entity + '-attribute-type/';
                break;
            case 'account-type':
                return 'accounts/' + entity + '-attribute-type/';
                break;
            case 'strategy-1':
                return 'strategies/1/strategy-attribute-type/';
                break;
            case 'strategy-2':
                return 'strategies/2/strategy-attribute-type/';
                break;
            case 'strategy-3':
                return 'strategies/3/strategy-attribute-type/';
                break;
            default:
                return entity + 's/' + entity + '-attribute-type/';
        }
    }

    var getList = function (entity, options) {

        if (metaRestrictionsService.getEntitiesWithoutDynamicAttrsList().indexOf(entity) !== -1) {
            return new Promise(function (resolve) {
                resolve({results: []})
            })
        }

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + endPointResolver(entity), options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getByKey = function (entity, id) {
        return xhrService.fetch(baseUrl + endPointResolver(entity) + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var create = function (entity, attributeType) {
        return xhrService.fetch(baseUrl + endPointResolver(entity),
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(attributeType)
            })
    };

    var update = function (entity, id, attributeType) {
        return xhrService.fetch(baseUrl + endPointResolver(entity) + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(attributeType)
            })
    };

    var deleteByKey = function (entity, id) {
        return xhrService.fetch(baseUrl + endPointResolver(entity) + id + '/',
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
                console.log('data', data);
                if (data.status === 409) {
                    resolve({status: 'conflict'});
                }
                resolve({status: 'success'});

            });
        })
    };

    var recalculateAttributes = function(entity, id){

        return xhrService.fetch(baseUrl + endPointResolver(entity) + id + '/recalculate/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })

    };

    var getRecalculateAttributeCount = function(entity, id){

        return xhrService.fetch(baseUrl + endPointResolver(entity) + id + '/objects-to-recalculate/',
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

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

        recalculateAttributes: recalculateAttributes,
        getRecalculateAttributeCount: getRecalculateAttributeCount
    }
}());