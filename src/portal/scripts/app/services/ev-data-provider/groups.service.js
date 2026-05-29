import baseUrlService from "../../services/baseUrlService";
import cookieService from '../../../../../core/services/cookieService';
import configureRepositoryUrlService from '../../services/configureRepositoryUrlService';

// var baseUrlService = require('../../services/baseUrlService');
import entityUrlService from '../../services/entityUrlService';

import queryParamsHelper from '../../helpers/queryParamsHelper';

var baseUrl = baseUrlService.resolve();
import xhrService from '../../../../../core/services/xhrService';


var getFilteredList = function (entityType, options) {

    var entityUrl = entityUrlService.resolve(entityType);


    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + entityUrl + '/ev-group/',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(options)
        })


};

export default {
    getFilteredList: getFilteredList
};