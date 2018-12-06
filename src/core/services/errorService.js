/**
 * Created by szhitenev on 15.06.2016.
 */

(function () {

    function ErrorObject(message, status, statusText) {
        this.status = status;
        this.statusText = statusText;
        this.message = message || 'Сообщение по умолчанию';
        this.stack = (new Error()).stack;
    }

    ErrorObject.prototype = Object.create(Error.prototype);
    ErrorObject.prototype.constructor = ErrorObject;


    'use strict';

    var handleXhrErrors = function (response) {

        return new Promise(function (resolve, reject) {

            console.log('response', response);

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

                console.log('response', response);

                if (response.status !== 204) {

                    response.json().then(function (data) {

                        console.log('data', data);

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

        console.log('reason??', reason);
        console.log('code', reason.status);

        var message = reason.statusText + ' (' + reason.status + ')';

        if (reason.hasOwnProperty('message')) {

            if (typeof reason.message === 'object') {

                Object.keys(reason.message).forEach(function (key) {

                    message = message + '<br/>';
                    message = message + key + ': ' + reason.message[key].join('. ');


                })

            }


        }

        console.log('message', message);

        toastr.error(message);

        throw reason

    };

    module.exports = {
        handleXhrErrors: handleXhrErrors,
        notifyError: notifyError
    }


}());