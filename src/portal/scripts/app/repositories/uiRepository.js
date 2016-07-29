/**
 * Created by szhitenev on 16.06.2016.
 */
(function(){

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');

    var baseUrl = '/api/v1/';

    var getEditLayout = function(entity){

        var contentType;

        switch (entity) {
            case 'portfolio':
                contentType = 'portfolios.portfolio';
                break;
            case 'account':
                contentType = 'accounts.account';
                break;
            case 'currency':
                contentType = 'currencies.currency';
                break;
            case 'instrument':
                contentType = 'instruments.instrument';
                break;
            case 'counterparty':
                contentType = 'counterparties.counterparty';
                break;
            case 'responsible':
                contentType = 'counterparties.responsible';
                break;
            case 'transaction':
                contentType = 'transactions.transaction';
                break;
            case 'price-history':
                contentType = 'instruments.pricehistory';
                break;
            case 'currency-history':
                contentType = 'currencies.currencyhistory';
                break;
        }


        return window.fetch(baseUrl + 'ui/edit-layout/?content_type=' + contentType,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    var updateEditLayout = function(id, ui){
        return window.fetch(baseUrl + 'ui/edit-layout/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(ui)
            }).then(function (data) {
            return data.json();
        })
    };


    var getListLayout = function(entity, name) {

        var contentType;

        switch (entity) {
            case 'portfolio':
                contentType = 'portfolios.portfolio';
                break;
            case 'account':
                contentType = 'accounts.account';
                break;
            case 'currency':
                contentType = 'currencies.currency';
                break;
            case 'instrument':
                contentType = 'instruments.instrument';
                break;
            case 'counterparty':
                contentType = 'counterparties.counterparty';
                break;
            case 'responsible':
                contentType = 'counterparties.responsible';
                break;
            case 'transaction':
                contentType = 'transactions.transaction';
                break;
            case 'price-history':
                contentType = 'instruments.pricehistory';
                break;
            case 'currency-history':
                contentType = 'currencies.currencyhistory';
                break;
        }

        return window.fetch(baseUrl + 'ui/list-layout/?content_type=' + contentType,
            {
                method: 'GET',
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

    var updateListLayout = function(id, ui){
        return window.fetch(baseUrl + 'ui/list-layout/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(ui)
            }).then(function (data) {
            return data.json();
        })
    };


    module.exports = {

        getEditLayout: getEditLayout,
        updateEditLayout: updateEditLayout,

        getListLayout: getListLayout,
        updateListLayout: updateListLayout

    }

}());