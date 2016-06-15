/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var baseUrl = '/api/v1/';

    var getClassifierNodeList = function () {
        return window.fetch(baseUrl + 'portfolios/portfolio-classifier/node/',
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

    var getClassifierNodeByKey = function (id) {
        return window.fetch(baseUrl + 'portfolios/portfolio-classifier/node/' + id + '/',
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

    var getClassifierList = function () {
        return window.fetch(baseUrl + 'portfolios/portfolio-classifier/',
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

    var getClassifierByKey = function (id) {
        return window.fetch(baseUrl + 'portfolios/portfolio-classifier/' + id + '/',
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

    var getList = function () {
        return window.fetch(baseUrl + 'portfolios/portfolio/',
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

    var getByKey = function (id) {
        return window.fetch(baseUrl + 'portfolios/portfolio/' + id + '/',
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

    var create = function (portfolio) {
        return window.fetch(baseUrl + 'portfolios/portfolio/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(portfolio)
            }).then(function (data) {
            return data.json();
        })
    };

    var update = function (id, portfolio) {
        return window.fetch(baseUrl + 'portfolios/portfolio/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(portfolio)
            }).then(function (data) {
            return data.json();
        })
    };

    var deleteByKey = function (id) {
        return window.fetch(baseUrl + 'portfolios/portfolio/' + id + '/',
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
        getClassifierNodeList: getClassifierNodeList,
        getClassifierNodeByKey: getClassifierNodeByKey,

        getClassifierList: getClassifierList,
        getClassifierByKey: getClassifierByKey,

        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());