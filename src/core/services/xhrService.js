/**
 * Created by szhitenev on 15.06.2016.
 */

(function () {

    var errorService = require('./errorService');

    var requestsPerMinuteLimit = 500;
    var requestsCount = 0;
    var lastRequestTime = new Date().getTime();
    var currentTime;
    var minute = 60 * 1000;

    var makeRequest = function (url, params) {
        return window
            .fetch(url, params)
            .then(errorService.handleXhrErrors)
            .catch(errorService.notifyError)

    };

    var fetch = function (url, params) {

        console.log('requestsCount', requestsCount);

        return new Promise(function (resolve, reject) {

            if (requestsCount > requestsPerMinuteLimit) {

                currentTime = new Date().getTime();

                if (lastRequestTime + minute < currentTime) {

                    requestsCount = 0;
                    lastRequestTime = new Date().getTime();

                    resolve(makeRequest(url, params))

                } else {

                    setTimeout(function () {

                        makeRequest(url, params).then(function (data) {

                            console.log("Timeout 60s");

                            requestsCount = 0;

                            resolve(data)

                        })

                    }, minute)

                }

            } else {

                requestsCount = requestsCount + 1;
                lastRequestTime = new Date().getTime();

                resolve(makeRequest(url, params))

            }

        })
    };

    module.exports = {
        fetch: fetch
    }


}());