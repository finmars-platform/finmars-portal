/**
 * Created by szhitenev on 07.12.2016.
 */
(function () {

    'use strict';

    var resolve = function () {

        if ('__PROJECT_ENV__' === 'development') {

            var host = '__API_HOST__';

            return host + '/api/v1/';

        }

        return '/api/v1/'
    };

    module.exports = {
        resolve: resolve
    }

}());