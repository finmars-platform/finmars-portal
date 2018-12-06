/**
 * Created by szhitenev on 25.08.2016.
 */
(function(){

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var updateSchedule = function(schedule){
        return xhrService.fetch(baseUrl + 'import/pricing-automated-schedule/0/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(schedule)
            })
    };

    var getSchedule = function(){
        return xhrService.fetch(baseUrl + 'import/pricing-automated-schedule/0/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    module.exports = {
        updateSchedule: updateSchedule,
        getSchedule: getSchedule
    }

}());