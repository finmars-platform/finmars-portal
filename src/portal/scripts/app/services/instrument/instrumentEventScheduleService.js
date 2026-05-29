import baseUrlService from "../../services/baseUrlService";
import cookieService from '../../../../../core/services/cookieService';
import xhrService from '../../../../../core/services/xhrService';
// var baseUrlService = require('../../services/baseUrlService');

var baseUrl = baseUrlService.resolve();

var rebuildEvents = function (id, instrument) {
    
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument/' + id + '/rebuild-events/',
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
               'Authorization': 'Token ' + cookieService.getCookie('access_token'),
Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(instrument)
        })
};

export default {
    rebuildEvents: rebuildEvents

};