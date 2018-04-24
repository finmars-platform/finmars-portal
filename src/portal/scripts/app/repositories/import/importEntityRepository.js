/**
 * Created by szhitenev on 18.03.2018.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var startImport = function (config) {
        return window.fetch(baseUrl + 'import/csv/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: config
            }).then(function (data) {
                console.log('import entity response data', data, typeof data);
                // return data
                return new Promise(function (resolve, reject) {
                    data.text().then(function (result) {
                        resolve({
                            response: result,
                            status: data.status
                        })
                    })
                });
            })
    };

    module.exports = {
        startImport: startImport
    }

}());