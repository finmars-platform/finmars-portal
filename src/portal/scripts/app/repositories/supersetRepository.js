/**
 * Created by szhitenev on 27.06.2022.
 */
// import baseUrlService from "../services/baseUrlService";
(function () {

    'use strict';

    var baseUrlService = require("../services/baseUrlService").default;
    var cookieService = require('../../../../core/services/cookieService').default;
    var xhrService = require('../../../../core/services/xhrService').default;
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService').default;
    // var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();


    var getSecurityToken = function (id) {

        var prefix = baseUrlService.getMasterUserPrefix();

        return xhrService.fetch(baseUrl  +  '/' + prefix + '/api/' + 'integrations/superset/get-security-token/?id='+id,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    module.exports = {

        getSecurityToken: getSecurityToken,

    }

}());