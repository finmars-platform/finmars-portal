/**
 * Created by szhitenev on 22.08.2016.
 */
// import baseUrlService from "../../services/baseUrlService";
(function () {

    'use strict';

    var baseUrlService = require("../../services/baseUrlService").default;
    var cookieService = require('../../../../../core/services/cookieService').default;
    var xhrService = require('../../../../../core/services/xhrService').default;
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService').default;
    // var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var startImport = function (config) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/complex-transaction-csv-file-import/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: config
            })
    };

    var validateImport = function (config) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/complex-transaction-csv-file-import-validate/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: config
            })
    };

    var preprocessFile = function (config) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/complex-transaction-preprocess-file/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: config
            })
    };

    var dryRun = function (config) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/transaction-import/dry-run/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: config
            })
    };


    module.exports = {
        startImport: startImport,
        validateImport: validateImport,
        preprocessFile: preprocessFile,
        dryRun: dryRun
    }

}());