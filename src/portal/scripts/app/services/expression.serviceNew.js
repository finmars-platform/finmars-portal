// import baseUrlService from "./baseUrlService";

import baseUrlService from "./baseUrlService";
export default function (cookieService, xhrService) {

    const baseUrl = baseUrlService.resolve();

    var validate = function (data) {

        if (!data.hasOwnProperty('is_eval')) {
            data.is_eval = false;
        }


        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'utils/expression/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })


    };
    /**
     *
     * @param data {Object}
     * @param {string} data.expression - expression formula
     * @param {boolean} [data.is_eval = true]
     * @returns {Promise<Response>}
     */
    var getResultOfExpression = function (data) {

        if (!data.hasOwnProperty('is_eval')) {
            data.is_eval = true;
        }

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'utils/expression/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    /**
     *
     * @param {String} date - A string in YYYY-MM-DD ISO format representing the current date.
     * @param {String} frequency - values: "D" - (dayly) / "W" - (weekly) / "M" - (monthly) /
     *     "Q" - (quarterly) / "Y" - (yearly)
     * @param {Number} shift - Integer indicating how many periods to shift (-N for backward, +N for forward).
     * @param {Boolean} [isOnlyBday] - Whether to adjust the dates to business days.
     * @param start
     * @returns {*}
     */
    var calcPeriodDate = function (date, frequency, shift, isOnlyBday, start) {

        //# region Validation
        if ( !["D", "W", "M", "Q", "Y"].includes(frequency) ) {
            throw new Error('[expressionService.calcPeriodDate] Error: invalid argument "frequency":', frequency);
        }

        if ( !Number.isInteger(shift) ) {

            throw new Error(
                '[expressionService.calcPeriodDate] Error: invalid argument "shift": ' +
                'Expected integer got:', shift
            );

        }
        //# endregion

        const data = {
            date,
            frequency,
            shift,
            is_only_bday: !!isOnlyBday,
            start: !!start
        }

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/utils/date/calc-period-date/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })

    }

    return {
        validate: validate,
        getResultOfExpression: getResultOfExpression,
        calcPeriodDate: calcPeriodDate
    }

}