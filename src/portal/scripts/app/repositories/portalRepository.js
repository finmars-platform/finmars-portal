(function () {
  'use strict';
  var baseUrlService = require("../services/baseUrlService").default;
  var cookieService = require('../../../../core/services/cookieService').default;
  var xhrService = require('../../../../core/services/xhrService').default;

  var baseUrl = baseUrlService.resolve();

  var getNavigationRoutingList = function (options) {
    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(
      baseUrl + '/' + prefix + '/' + apiVersion + '/ui/user-interface-access/?role=' + options.role + '&user_doe=' + options.user_code + '&configuration_code=' + options.configuration_code,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': 'Token ' + cookieService.getCookie('access_token'),
          Accept: 'application/json',
          'Content-type': 'application/json'
        }
      }
    )
  };

  module.exports = {
    getNavigationRoutingList: getNavigationRoutingList
  }
}());