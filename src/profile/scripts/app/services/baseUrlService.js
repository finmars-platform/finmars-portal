/**
 * Created by szhitenev on 07.12.2016.
 */
(function () {

    'use strict';

    var prefix = '';

    var resolve = function () {

        if ('__PROJECT_ENV__') {

            var host = '__API_HOST__';

            return host + prefix + '/api/v1/';

        }

        return prefix + '/api/v1/'
    };

    var getAuthorizerUrl = function () {

        return '__AUTHORIZER_URL__'

    }

    var setMasterUserPrefix = function (_prefix) {
        prefix = '/' + _prefix;
    }

    module.exports = {
        resolve: resolve,
        getAuthorizerUrl: getAuthorizerUrl,
        setMasterUserPrefix: setMasterUserPrefix
    }

}());