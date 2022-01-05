/**
 * Created by szhitenev on 15.06.2016.
 *
 * Deprecated. Use shell/scripts/app/services/errorService.js instead.
 *
 */

(function () {

    var toastNotificationService = require('./toastNotificationService');

    function ErrorObject(message, status, statusText) {
        this.status = status;
        this.statusText = statusText;
        this.message = message || 'Oops something went wrong, please try again.';
        this.stack = (new Error()).stack;
    }

    ErrorObject.prototype = Object.create(Error.prototype);
    ErrorObject.prototype.constructor = ErrorObject;

    'use strict';

    // DEPRECATED
    var handleXhrErrors = function (response) {

        // console.log('handleXhrErrors.response', response);

        return new Promise(function (resolve, reject) {

            if (response.status === 500) {

                if (!response.ok) {

                    var errorObj = {
                        status: response.status,
                        statusText: response.statusText,
                        message: response.statusText
                    };

                    reject(new ErrorObject(errorObj.message, errorObj.status, response.statusText))
                }

                reject(response)

            } else {

                if (response.status !== 204) {

                    response.json().then(function (data) {

                        if (!response.ok) {

                            var errorObj = {
                                status: response.status,
                                statusText: response.statusText,
                                message: data
                            };

                            reject(new ErrorObject(errorObj.message, errorObj.status, response.statusText));

                        }

                        resolve(data)

                    })

                } else {
                    resolve({});
                }

            }

        })
    };

    var getFullErrorAsHtml = function (obj, message) {

        // console.log('getFullErrorAsHtml.obj', obj);

        Object.keys(obj).forEach(function (key) {

            message = message + '<br/>';

            if (Array.isArray(obj[key])) {

                if (obj[key].length) {

                    if (typeof obj[key][0] === 'object') {

                        obj[key].forEach(function (item) {

                            message = getFullErrorAsHtml(item, message)

                        })

                    } else {

                        message = message + key + ': ' + obj[key].join('. ');
                    }
                }
            } else {

                if (typeof obj[key] === 'object') {

                    message = getFullErrorAsHtml(obj[key], message)

                } else {
                    message = message + key + ': ' + obj[key]
                }
            }

        });

        return message;

    };

    var notifyError = function (data) {



        // if (reason.hasOwnProperty('message')) {
        //
        //     if (typeof reason.message === 'object') {
        //
        //         message = getFullErrorAsHtml(reason.message, message)
        //
        //     }
        //
        //
        // }

        var message = '';

        if (data.message) {
            message = data.status + ' ' + data.statusText + '<br>' + data.message.message

            toastNotificationService.error(message);
        } else {
            message = data.statusText + ' (' + data.status + ')';
            toastNotificationService.error(message);
        }



        // return reason

        // throw new Error("Error processing request", reason);

        return Promise.reject(data)

    };

    var recordError = function (data){

        if (!window.system_errors) {
            window.system_errors = []
        }

        window.system_errors.push({
            created: new Date().toISOString(),
            location: window.location.href,
            data: data,
            text: JSON.stringify(data)
        })


        return Promise.reject(data)
    }

    module.exports = {
        handleXhrErrors: handleXhrErrors,
        notifyError: notifyError,
        recordError: recordError
    }


}());