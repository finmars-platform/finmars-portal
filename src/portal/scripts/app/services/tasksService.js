// import baseUrlService from "../services/baseUrlService";

(function () {

    'use strict';

    var baseUrlService = require("../services/baseUrlService").default;
    const toastNotificationService = require('../../../../core/services/toastNotificationService').default;

    const cookieService = require('../../../../core/services/cookieService').default;
    const xhrService = require('../../../../core/services/xhrService').default;
    const baseUrl = baseUrlService.resolve();

    const configureRepositoryUrlService = require('./configureRepositoryUrlService').default;

    var getStats = function (options) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'tasks/stats/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };


    var getList = function (options) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'tasks/task/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getListLight = function (options) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'tasks/task/light/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };


    var getByKey = function (id) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'tasks/task/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };


    var cancel = function (id) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'tasks/task/' + id + '/cancel/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    const abortTransactionImport = function (id) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/tasks/task/' + id + '/abort-transaction-import/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    'action': 'abort-transaction-import'
                })
            })
    };

    /**
     * Check for status of task until it is ended.
     *
     * @param {Number} id - task id
     * @param {Number} [intervalTime]
     * @returns {{promise: Promise<Object>, stopInterval: Function}} - Promise that is resolved when the task ends and a Function to force clear interval
     */
    const awaitImportTask = function (id, intervalTime=3000) {

        let taskInterval;
        let stopInterval = () => {
            clearInterval(taskInterval);
        };

        const prom = new Promise(async function(resolve, reject) {

            taskInterval = setInterval(async function () {

                try {
                    const res = await getByKey(id);

                    switch (res.status) {
                        case 'C':
                            toastNotificationService.error("Task has been canceled");
                        case 'T':
                            toastNotificationService.error("Task has been timed out");
                            break;
                        case 'E':
                            console.error(`Task error: ${res.error}`);
                            toastNotificationService.error(res.error)
                            break;
                    }

                    if ( 'DCTE'.includes(res.status) ) {

                        resolve(res);
                        clearInterval(taskInterval);

                    }

                } catch (e) {

                    reject(e);
                    clearInterval(taskInterval);

                }

            }, intervalTime);

        });

        return {promise: prom, stopInterval};

    }

    module.exports = {
        getStats: getStats,
        getList: getList,
        getListLight: getListLight,
        getByKey: getByKey,
        cancel: cancel,

        abortTransactionImport: abortTransactionImport,

        awaitImportTask: awaitImportTask,
    }

}());