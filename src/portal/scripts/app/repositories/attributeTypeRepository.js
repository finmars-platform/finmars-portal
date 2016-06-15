/**
 * Created by szhitenev on 15.06.2016.
 */

(function(){

    'use strict';

    var baseUrl = '/api/v1/';

    var getList = function (entity) {
        return window.fetch(baseUrl + entity + 's/' + entity + '-attribute-type/',
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
        return window.fetch(baseUrl + entity + '/' + entity + '-attribute-type/' + id + '/',
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
        return window.fetch(baseUrl + entity + '/' + entity + '-attribute-type/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(attributeType)
            }).then(function (data) {
            return data.json();
        })
    };

    var update = function (entity, id, attributeType) {
        return window.fetch(baseUrl + entity + '/' + entity + '-attribute-type/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(attributeType)
            }).then(function (data) {
            return data.json();
        })
    };

    var deleteByKey = function (entity, id) {
        return window.fetch(baseUrl + entity + '/' + entity + '-attribute-type/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
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