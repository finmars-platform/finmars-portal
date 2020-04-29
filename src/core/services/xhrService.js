/**
 * Created by szhitenev on 15.06.2016.
 */

(function () {

    var errorService = require('./errorService');

    var requestsPerMinuteLimit = 400; // 500 on backend
    var requestsCount = 0;
    var lastRequestTime = new Date().getTime();
    var currentTime;
    var minute = 60 * 1000;

    var makeRequest = function (url, params) {
        return window
            .fetch(url, params)
            .then(errorService.handleXhrErrors)
            .then(function (data) {

                if (params.method === 'GET') {

                    if (!window.cached_requests) {
                        window.cached_requests = {}
                    }

                    window.cached_requests[url] = {
                        time: new Date(),
                        data: data,
                        requested_count: 1
                    };

                }

                return data
            })
            .catch(errorService.notifyError)

    };

    var fetch = function (url, params) {

        return new Promise(function (resolve, reject) {

            if (params.method === 'GET' && window.cached_requests && window.cached_requests[url]) {

                window.cached_requests[url].requested_count = window.cached_requests[url].requested_count + 1;

                resolve(window.cached_requests[url].data)

            } else {

                if (params.method === 'POST' || params.method === 'PUT' || params.method === 'PATCH') {

                    var count_cached_requests = 0;

                    if (window.cached_requests) {
                        count_cached_requests = Object.keys(window.cached_requests).length;
                    }

                    window.cached_requests = {};
                    console.log('Clear Cached Requests. Total: ', count_cached_requests);

                }

                // console.log('requestsCount', requestsCount);

                if (requestsCount > requestsPerMinuteLimit) {

                    setTimeout(function () {

                        makeRequest(url, params).then(function (data) {

                            console.log("Timeout 60s");

                            requestsCount = 0;

                            resolve(data)

                        })

                    }, minute + 1000)

                } else {

                    requestsCount = requestsCount + 1;
                    lastRequestTime = new Date().getTime();

                    resolve(makeRequest(url, params))

                }

            }

        })
    };

    module.exports = {
        fetch: fetch
    }


}());