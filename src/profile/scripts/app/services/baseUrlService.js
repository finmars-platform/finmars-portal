/**
 * Created by szhitenev on 07.12.2016.
 */
import shellBaseUrlService from '../../../../shell/scripts/app/services/baseUrlService.js';

console.log("am i executed rn?", shellBaseUrlService);

'use strict';


/*window.base_api_url = '';
const PROJECT_ENV = window.PROJECT_ENV; // Set by /public/config.js
var resolve = function () {

    if (PROJECT_ENV) {

        var host = '__API_HOST__';

        return host;

    }

    return ''

};

var getAuthorizerUrl = function () {

    return '__AUTHORIZER_URL__'

}

var setMasterUserPrefix = function (_prefix) {
    window.base_api_url = _prefix;
}

var getMasterUserPrefix = function () {
    return window.base_api_url
}

var getApiVersion = function () {
    return 'api/v1'
}

module.exports = {
    resolve: resolve,
    getAuthorizerUrl: getAuthorizerUrl,
    setMasterUserPrefix: setMasterUserPrefix,
    getMasterUserPrefix: getMasterUserPrefix,

    getApiVersion: getApiVersion
} */
export default shellBaseUrlService;