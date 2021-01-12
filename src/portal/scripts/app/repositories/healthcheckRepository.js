/**
 * Created by szhitenev on 28.07.2020.
 */
(function () {

    'use strict';

    var xhrService = require('../../../../core/services/xhrService');

    var getData = function () {

        return xhrService.fetch('__HEALTHCHECK_HOST__',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    module.exports = {

        getData: getData
    }

}());