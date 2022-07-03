/**
 * Created by szhitenev on 27.06.2022.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();


    var getSecurityToken = function (id) {

        var prefix = baseUrlService.getMasterUserPrefix();

        return xhrService.fetch(baseUrl  +  '/' + prefix + '/api/' + 'integrations/superset/get-security-token/?id='+id,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    module.exports = {

        getSecurityToken: getSecurityToken,

    }

}());