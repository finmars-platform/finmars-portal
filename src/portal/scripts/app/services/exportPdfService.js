/**
 * Created by szhitenev on 13.01.2017.
 */
(function () {

    'use strict';

    var generatePdf = function (data) {


var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return window.fetch('/services/pdf',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.blob();
        })

    };

    module.exports = {
        generatePdf: generatePdf
    }

}());