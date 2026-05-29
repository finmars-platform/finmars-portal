'use strict';
import baseUrlService from "../services/baseUrlService";
import cookieService from '../../../../core/services/cookieService';
import xhrService from '../../../../core/services/xhrService';

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

export default {
  getNavigationRoutingList: getNavigationRoutingList
};