import baseUrlService from "..//services/baseUrlService";
import configureRepositoryUrlService from "../../../../shell/scripts/app/services/configureRepositoryUrlService";

export default function (cookieService, xhrService) {

    const baseUrl = baseUrlService.resolve();
    const prefix = baseUrlService.getMasterUserPrefix();
    const apiVersion = baseUrlService.getApiVersion();

    const getCurrenciesList = function () {

        return xhrService.fetch(configureRepositoryUrlService.configureUrl('https://database.finmars.com/api/v1/currency/'),
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

    const getCounterpartiesList = function (options) {

        return xhrService.fetch(configureRepositoryUrlService.configureUrl('https://database.finmars.com/api/v1/company/', options),
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

    const downloadCounterparty = function (config) {

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/finmars-database/company/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(config)
            })

    }

    return {
        getCurrenciesList: getCurrenciesList,
        getCounterpartiesList: getCounterpartiesList,
        downloadCounterparty: downloadCounterparty,
    }

}