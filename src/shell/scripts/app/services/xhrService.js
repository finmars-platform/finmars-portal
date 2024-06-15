/**
 * Created by mevstratov on 25.05.2021.
 * Updated by szhitenev on 15.08.2023.
 */

'use strict';


var md5helper = require('./md5.helper').default;

export default function (errorService, cookieService) {

    const getRequestParams = function (method, bodyData) {

        if (!['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
            throw new Error("Invalid request method");
        }

        let reqestParamsObj = {
            method: method,
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        };

        reqestParamsObj.headers['Authorization'] = 'Token ' + cookieService.getCookie('access_token');

        if (['POST', 'PATCH', 'PUT'].includes(method)) {

            reqestParamsObj.headers['X-CSRFToken'] = cookieService.getCookie('csrftoken');
            reqestParamsObj.body = JSON.stringify(bodyData);

        } else if (method === 'DELETE') {
            reqestParamsObj.headers['X-CSRFToken'] = cookieService.getCookie('csrftoken');
        }

        return reqestParamsObj;

    };

    const processResponse = async function (response) {

        try {
            return await response;

        } catch (error) {
            throw error;
        }

    }

    async function refreshToken() {

        return new Promise(function (resolve, reject) {

            window.keycloak.updateToken().then(function () {


                cookieService.setCookie('access_token', window.keycloak.token);
                cookieService.setCookie('refresh_token', window.keycloak.refreshToken);
                cookieService.setCookie('id_token', window.keycloak.idToken);

                resolve(window.keycloak.token);

            })

        })

    }


    const doFetch = async function (url, params = {}, options = {}) {

        const {notifyError = true} = options;

        try {
            let response = await window.fetch(url, params);

            // If a 401 is encountered, try to refresh the token and retry the request
            if (response.status === 401) {

                console.log("Catch Authorization error, trying to refresh token")

                const newToken = await refreshToken();

                // Update the headers with the new token and retry the request
                params.headers = {
                    ...params.headers,
                    Authorization: `Token ${newToken}`
                };

                response = await window.fetch(url, params);
            }

            // console.log('response', response);

            // Handle the refreshed response
            if (response.status === 204) return response;

            if (response.status === 404) {
                throw buildError(response, {
                    message: response.statusText,
                    status_code: response.status,
                    url: response.url,
                    username: '',
                    datetime: '',
                    details: '',
                });
            }

            if (response.status >= 400 && response.status < 600 && response.status !== 401) {
                const errorData = await response.json();
                throw buildError(response, errorData);
            }

            return params.method !== "DELETE" ? await response.json() : response;
        } catch (error) {

            if (params.signal?.aborted) {
                throw params.signal.reason;
            }

            console.error('XHR Service catch error', error);

            if (notifyError) {
                await errorService.notifyError(error);
            }

            throw error;
        }
    };

    function buildError(response, errorData) {
        return {
            error: {
                ...errorData,
                status_code: response.status,
                url: response.url
            }
        };
    }

    const generateHash = function (url, params) {
        const hashContent = `${url}_${JSON.stringify(params)}`;
        return md5helper.md5(hashContent);  // Convert to base64 for simplicity
    }


    const fetch = async function (url, params = {}, options = {}) {

        const hash = generateHash(url, params);

        if (!window.finmarsOngoingRequests) {
            window.finmarsOngoingRequests = {}
        }

        // If this request is ongoing, return its promise.
        if (window.finmarsOngoingRequests[hash]) {
            return window.finmarsOngoingRequests[hash];
        }

        const requestPromise = doFetch(url, params, options).then(data => {
            // Remove from ongoing requests once completed.
            delete window.finmarsOngoingRequests[hash];
            return data // N.B. deep copy possible need, if one of components modify data it will changes in another one
        });

        window.finmarsOngoingRequests[hash] = requestPromise;
        return requestPromise;

    }

    return {
        fetch: fetch,
        getRequestParams: getRequestParams,
        processResponse: processResponse,
    }

};