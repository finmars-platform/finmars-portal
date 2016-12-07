/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var recalculate = function (dateFrom, dateTo) {
        return window.fetch(baseUrl + 'instruments/instrument/recalculate-prices-accrued-price/?date_0=' + dateFrom + '&date_1=' + dateTo,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };


    module.exports = {
        recalculate: recalculate
    }

}());