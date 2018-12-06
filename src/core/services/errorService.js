/**
 * Created by szhitenev on 15.06.2016.
 */

(function () {

    function ErrorObject(message, status, statusText) {
        this.status = status;
        this.statusText = statusText;
        this.message = message || 'Oops something went wrong, please try again.';
        this.stack = (new Error()).stack;
    }

    ErrorObject.prototype = Object.create(Error.prototype);
    ErrorObject.prototype.constructor = ErrorObject;

    'use strict';

    var handleXhrErrors = function (response) {

        console.log('handleXhrErrors.response', response);

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

    var notifyError = function (reason) {

        var message = reason.statusText + ' (' + reason.status + ')';

        if (reason.hasOwnProperty('message')) {

            if (typeof reason.message === 'object') {

                Object.keys(reason.message).forEach(function (key) {

                    message = message + '<br/>';

                    if (Array.isArray(reason.message[key])) {
                        message = message + key + ': ' + reason.message[key].join('. ');
                    } else {
                        message = message + key + ': ' + reason.message[key]
                    }

                })

            }


        }

        toastr.error(message);

        throw reason

    };

    module.exports = {
        handleXhrErrors: handleXhrErrors,
        notifyError: notifyError
    }


}());