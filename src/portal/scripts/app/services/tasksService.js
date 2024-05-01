// import baseUrlService from "../services/baseUrlService";

(function () {

    'use strict';

    var baseUrlService = require("../services/baseUrlService").default;
    const ToastNotificationService = require('../../../../shell/scripts/app/services/toastNotificationService').default;
    const toastNotificationService = new ToastNotificationService();

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
     *
     * @param {Object} [options]
     * @property [options.functionName] - name of the function that caused
     * creation of the task to use in an error message.
     * E.g. importInstrumentCbondsService.download().
     *
     * @returns {{promise: Promise<Object>, stopInterval: Function}} - Promise
     * that is resolved when the task ends and a Function to call clearInterval()
     */
    const awaitTaskEnd = function (id, {intervalDelay=2000, functionName='', showErrorPopup=true}) {

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
                            toastNotificationService.error("Task has been canceled", "Error");
                            break;
                        case 'T':
                            toastNotificationService.error("Task has been timed out", "Error");
                            break;
                        case 'E':

                            let errorTxt = 'Task error';

                            if (functionName) {
                                errorTxt = errorTxt + ` [${functionName}]`
                            }

                            errorTxt = errorTxt + `: ${res.error_message}`;

                            console.error(errorTxt);
                            if (showErrorPopup) toastNotificationService.error(
                                res.error_message,
                                "Error",
                                {
                                    onclick: function (event) {

                                        const listener = function (e) {

                                            e.clipboardData.setData('text/plain', res.error_message);

                                            e.preventDefault();
                                        };

                                        document.addEventListener('copy', listener, {once: true});

                                        document.execCommand("copy");

                                    },
                                }
                            );

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

            }, intervalDelay);

        });

        return {promise: prom, stopInterval};

    }

    /**
     * Wait for celery task created by promise to complete.
     *
     * @param {Promise<{task: Number, [errors]: String}>} promise - promise
     * that is resolved after celery task was created by server.
     * Resolved object properties:
     * `task` - contains id of the created celery task.
     * `errors` - error that occurred while trying to create celery task.
     *
     * @param {Object} [options]
     * @param {String} options.functionName - name of the function that caused
     * creation of the task to use in an error message.
     * E.g. importInstrumentCbondsService.download().
     * @param {Number} [options.intervalDelay] - delay for setInterval
     * @param {Boolean} [options.showErrorPopup]
     *
     * @returns {{promise: Promise<Object>, stopIntervalFn: Function}} - Promise
     * that is resolves with data about celery task end.
     * Function that stops watching for celery task's execution status.
     */
    const processPromiseWithTask = function (promise, {intervalDelay, functionName='', showErrorPopup=true}) {

        let timeOutId;
        let stopIntervalCalled = false;
        let stopIntervalFn;
        let stopInterval = function() {

            if (stopIntervalFn) {
                stopIntervalFn();
            } else {
                stopIntervalCalled = true;
            }

        };

        let prom = new Promise(async (resolve, reject) => {

            try {

                const res = await promise;

                if (res.errors) {

                    console.error(
                        "[tasksService.processPromiseWithTask] Error occurred " +
                        `before celery task was created ${res.errors}`
                    );

                    toastNotificationService.error(res.errors, "Error");
                    return resolve(res);

                }
                else {

                    // stopInterval was called before running taskService.awaitTaskEnd()
                    if (stopIntervalCalled) {
                        return resolve( "Task status check stopped" );
                    }

                    timeOutId = setTimeout(() => {
                        console.error(
                            `Execution of the celery task: ${res.task}` +
                            "takes too long"
                        );
                    }, 60*1000)

                    let atData = awaitTaskEnd(
                        res.task,
                        {
                            functionName: functionName,
                            intervalDelay,
                            showErrorPopup
                        }
                    );

                    stopIntervalFn = atData.stopInterval;
                    clearTimeout(timeOutId);

                    return resolve( atData.promise );
                }

            } catch (e) {
                reject(e);
            }

        })

        return {promise: prom, stopIntervalFn: stopInterval};

    }

    module.exports = {
        getStats: getStats,
        getList: getList,
        getListLight: getListLight,
        getByKey: getByKey,
        cancel: cancel,

        abortTransactionImport: abortTransactionImport,

        awaitTaskEnd: awaitTaskEnd,
        processPromiseWithTask: processPromiseWithTask,
    }

}());