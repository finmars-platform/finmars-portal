/**
 * Created by mevstratov on 25.05.2021.
 */

'use strict';


export default function (errorService, cookieService) {

    // var axService = require('../../../../core/services/axService')


    const axfetch = function (url, params, options) {

        let requestId;
        const notifyError = options && options.hasOwnProperty('notifyError') ? options.notifyError : true;

        if (window.developerConsoleService) {
            requestId = window.developerConsoleService.pushRequest({
                url: url,
                params: params
            })
        }

        params.url = url

        return axService.ax.request(params)
            .then(function (response) {

                return new Promise(function (resolve, reject) {

                    if (window.developerConsoleService) {
                        window.developerConsoleService.resolveRequest(requestId, response.clone())
                    }

                    if (response.status === 204) { // No content
                        resolve(response);
                    } else if (response.status >= 400 && response.status < 500) {

                        response.json().then(function (data) {

                            const error = {
                                status: response.status,
                                statusText: response.statusText,
                                message: data
                            };

                            reject(error)

                        })

                    } else if (response.status >= 500 && response.status < 600) {

                        const error = {
                            status: response.status,
                            statusText: response.statusText,
                            message: response.statusText
                        };

                        reject(error)

                    } else {

                        if (params.method !== "DELETE") {
                            resolve(response.data);
                        } else {
                            resolve(response);
                        }


                    }

                })
            })
            .catch(function (reason) {

                console.log('xhrService.reason', reason);

                /*if (window.developerConsoleService) {
                    window.developerConsoleService.rejectRequest(requestId, reason)
                }*/

                if (notifyError !== false) {
                    errorService.notifyError(reason);
                }

                console.log('XHR Service catch error', reason);

                throw reason;

            })

    };

    const fetch = function (url, params, options) {

        let requestId;
        const notifyError = options && options.hasOwnProperty('notifyError') ? options.notifyError : true;

        // Deprecated
        // if (window.developerConsoleService) {
        // 	requestId = window.developerConsoleService.pushRequest({
        // 		url: url,
        // 		params: params
        // 	})
        // }

        return window
            .fetch(url, params)
            .then(async function (response) {

                if (response.status === 204) { // No content
                    // resolve(response);
                    return response;
                } else if (response.status >= 400 && response.status < 500) {

                    /*response.json().then(function (data) {

                        const error = {
                            status: response.status,
                            statusText: response.statusText,
                            message: data
                        };

                        reject(error)

                    })*/

                    const error = await response.json();

                    throw error;

                } else if (response.status >= 500 && response.status < 600) {

                    const error = await response.json();
                    throw error;

                } else {

                    if (params.method !== "DELETE") {
                        return response.json();
                    } else {
                        return response;
                    }

                }

                // })
            })
            .catch(async function (reason) {

                console.log('xhrService.reason', reason)

                if (reason.status !== 401 && (reason.error && reason.error.status_code !== 401)) {

                    if (url.includes('/token-refresh/') &&
                        !url.includes('/token-auth/')) {

                        cookieService.deleteCookie('access_token')
                        cookieService.deleteCookie('refresh_token')
                        window.location.reload();

                        throw reason;

                    }


                }
                else {

                    try {

                        const res = await window.keycloak.updateToken()
                        console.log('res', res)

                        if (res) {

                            cookieService.setCookie('access_token', window.keycloak.token);
                            cookieService.setCookie('refresh_token', window.keycloak.refreshToken);
                            cookieService.setCookie('id_token', window.keycloak.idToken);

                            throw null;
                            // return fetch(url, params, options); // try to request again with refreshed token
                        } else {
                            /*window.keycloak.init({
                                onLoad: 'login-required'
                            })*/
                        }

                    }
                    catch (error) {

                        error.___custom_message = 'Keycloak update error';
                        console.error(error)

                        // in case if refresh token is expired

                        window.keycloak.init({
                            onLoad: 'login-required'
                        })

                        throw null;

                    }

                }

                if (notifyError !== false) {
                    await errorService.notifyError(reason);
                }


                console.error('XHR Service catch error', reason);

                throw reason;

            })

    };

    return {
        fetch: fetch
    }

};