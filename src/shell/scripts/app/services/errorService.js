/**
 * Created by mevstratov on 25.05.2021.
 */
'use strict';

export default function (toastNotificationService) {

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
    const handleXhrErrors = function (response) {

        // console.log('handleXhrErrors.response', response);

        return new Promise(function (resolve, reject) {

            if (response.status === 500) {

                if (!response.ok) {

                    const errorObj = {
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

                            const errorObj = {
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

    const getFullErrorAsHtml = function (obj, message) {

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

    const notifyError = function (reason) {

        console.log('notifyError.reason', reason);

        let error_object = reason.hasOwnProperty('error') ? reason.error : reason.response.data.error;

        let message = '';
        let title = '';

        // WTF?
        if (reason.error.error) {
            error_object = reason.error.error;
        }

        if (error_object.status_code === 403) {

            message = message + '<span class="toast-shield-icon" style="text-align: center; display: block">' +
                '<span class="material-icons" style="font-size: 64px; margin: 0; color: deepskyblue;">security</span>' +
                '</span>'

            // Strange that we need to get .error level, may cause error in future (2023-11-09 szhitenev)
            message = message + '<span class="toast-error-field">URL</span>: ' + error_object.url + '<br/>'
            message = message + '<span class="toast-error-field">Username</span>: ' + error_object.error.username + '<br/>'
            message = message + '<span class="toast-error-field">Date & Time</span>: ' + error_object.error.datetime + '<br/>'

            let raw_title = '<span  data-text="Access Denied">Access Denied</span>'
            title = raw_title + '<span class="toast-click-to-copy" style="left: 140px;">click to copy</span>'

            toastNotificationService.info(message, title, {
                progressBar: true,
                closeButton: true,
                tapToDismiss: false,
                onclick: function (event) {

                    var listener = function (e) {

                        e.clipboardData.setData('text/plain', JSON.stringify(error_object, null, 4));

                        e.preventDefault();
                    };

                    document.addEventListener('copy', listener, false);

                    document.execCommand("copy");

                    document.removeEventListener('copy', listener, false);

                },
                // timeOut: '10000',
                // extendedTimeOut: '10000'
                timeOut: 0,
                extendedTimeOut: 0
            });

        } else if (error_object.status_code === 500) {

            message = message + '<span class="toast-error-field">Title</span>: ' + error_object.message + '<br/>'
            message = message + '<span class="toast-error-field">Code</span>: ' + error_object.status_code + '<br/>'
            message = message + '<span class="toast-error-field">URL</span>: ' + error_object.url + '<br/>'
            message = message + '<span class="toast-error-field">Username</span>: ' + error_object.username + '<br/>'
            message = message + '<span class="toast-error-field">Date & Time</span>: ' + error_object.datetime + '<br/>'
            message = message + '<span class="toast-error-field">Details</span>: <div><pre>' + JSON.stringify(error_object.details, null, 4) + '</pre></div>'

            let raw_title = '<span class="glitch" data-text="Server Error">Server Error</span>'

            title = raw_title + '<span class="toast-click-to-copy">click to copy</span>'

            toastNotificationService.error(message, title, {
                progressBar: true,
                closeButton: true,
                tapToDismiss: false,
                onclick: function (event) {

                    var listener = function (e) {

                        e.clipboardData.setData('text/plain', JSON.stringify(error_object, null, 4));

                        e.preventDefault();
                    };

                    document.addEventListener('copy', listener, false);

                    document.execCommand("copy");

                    document.removeEventListener('copy', listener, false);

                },
                timeOut: '10000',
                extendedTimeOut: '10000'
                // timeOut: 0,
                // extendedTimeOut: 0
            });

        } else {

            let errorDetails = '';

            try {
                error_object.details.errors.forEach(function (item) {

                    errorDetails = errorDetails + item.detail + ' ' + '<b>' + item.attr + '</b></br>';

                });

            } catch (error) {
                errorDetails = JSON.stringify(error_object.details, null, 4);

            }

            let context = '';

            try {

                function formatString(str) {
                    // Split the string by slashes and remove empty elements
                    const parts = str.split('/').filter(part => part.length > 0);

                    // Capitalize the first letter of each part and join them
                    const formattedParts = parts.map(part =>
                        part.charAt(0).toUpperCase() + part.slice(1)
                    );

                    return formattedParts.join(' - ');
                }


                context = error_object.url.split('api/v1/')[1]

                context = formatString(context);

            } catch (error) {
                context = ''
            }

            message = message + '<span class="toast-error-field">Title</span>: Please double-check your input and try again.<br/>'
            // message = message + '<span class="toast-error-field">Code</span>: ' + error_object.status_code + '<br/>'
            // message = message + '<span class="toast-error-field">URL</span>: ' + error_object.url + '<br/>'
            // message = message + '<span class="toast-error-field">Username</span>: ' + error_object.username + '<br/>'
            // message = message + '<span class="toast-error-field">Date & Time</span>: ' + error_object.datetime + '<br/>'
            if (context) {
                message = message + '<span class="toast-error-field">Context</span>: ' + context + '<br/>'
            }
            message = message + '<span class="toast-error-field">Details</span>: <div><pre>' + errorDetails + '</pre></div>'

            let raw_title = '<span data-text="Client Error">Warning</span>'

            title = raw_title;
            // title = raw_title + '<span class="toast-click-to-copy">click to copy</span>'

            toastNotificationService.warning(message, title, {
                progressBar: true,
                closeButton: true,
                tapToDismiss: false,
                onclick: function (event) {

                    var listener = function (e) {

                        e.clipboardData.setData('text/plain', JSON.stringify(error_object, null, 4));

                        e.preventDefault();
                    };

                    document.addEventListener('copy', listener, false);

                    document.execCommand("copy");

                    document.removeEventListener('copy', listener, false);

                },
                timeOut: '10000',
                extendedTimeOut: '10000'
                // timeOut: 0,
                // extendedTimeOut: 0
            });

        }


        // DEPRECATED
        // if (reason.statusText) {
        //
        // 	message = reason.statusText + ' (' + reason.status + ')';
        //
        // 	if (reason.hasOwnProperty('message')) {
        //
        // 		if (typeof reason.message === 'object') {
        //
        // 			message = getFullErrorAsHtml(reason.message, message)
        //
        // 		}
        //
        //
        // 	}
        //
        // } else if (reason.message) {
        //
        // 	message = reason.message
        //
        // }
        //
        // toastNotificationService.error(message);
        //
        // // return reason
        //
        // // throw new Error("Error processing request", reason);

        return Promise.reject(reason)

    };

    const error = function (message) {
        if (!message || typeof message !== 'string') throw "No message for an error were specified";
        toastNotificationService.error(...arguments)
    }

    return {
        handleXhrErrors: handleXhrErrors,
        notifyError: notifyError,
        error: error,
    }

};