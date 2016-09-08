/**
 * Created by szhitenev on 16.06.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');

    var baseUrl = '/api/v1/';

    var getEditLayout = function (entity) {

        var contentType;

        switch (entity) {
            case 'portfolio':
                contentType = 'portfolios.portfolio';
                break;
            case 'account':
                contentType = 'accounts.account';
                break;
            case 'account-type':
                contentType = 'accounts.accounttype';
                break;
            case 'currency':
                contentType = 'currencies.currency';
                break;
            case 'instrument':
                contentType = 'instruments.instrument';
                break;
            case 'instrument-type':
                contentType = 'instruments.instrumenttype';
                break;
            case 'pricing-policy':
                contentType = 'instruments.pricingpolicy';
                break;
            case 'counterparty':
                contentType = 'counterparties.counterparty';
                break;
            case 'counterparty-group':
                contentType = 'counterparties.counterpartygroup';
                break;
            case 'responsible':
                contentType = 'counterparties.responsible';
                break;
            case 'responsible-group':
                contentType = 'counterparties.responsiblegroup';
                break;
            case 'transaction':
                contentType = 'transactions.transaction';
                break;
            case 'transaction-type':
                contentType = 'transactions.transactiontype';
                break;
            case 'price-history':
                contentType = 'instruments.pricehistory';
                break;
            case 'currency-history':
                contentType = 'currencies.currencyhistory';
                break;
            case 'strategy-1':
                contentType = 'strategies.strategy1';
                break;
            case 'strategy-2':
                contentType = 'strategies.strategy2';
                break;
            case 'strategy-3':
                contentType = 'strategies.strategy3';
                break;
            case 'strategy-1-group':
                contentType = 'strategies.strategy2group';
                break;
            case 'strategy-2-group':
                contentType = 'strategies.strategy2group';
                break;
            case 'strategy-3-group':
                contentType = 'strategies.strategy2group';
                break;
            case 'strategy-1-subgroup':
                contentType = 'strategies.strategy1subgroup';
                break;
            case 'strategy-2-subgroup':
                contentType = 'strategies.strategy2subgroup';
                break;
            case 'strategy-3-subgroup':
                contentType = 'strategies.strategy3subgroup';
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

    var createEditLayout = function (entity, ui) {

        var contentType;

        switch (entity) {
            case 'portfolio':
                contentType = 'portfolios.portfolio';
                break;
            case 'account':
                contentType = 'accounts.account';
                break;
            case 'account-type':
                contentType = 'accounts.accounttype';
                break;
            case 'currency':
                contentType = 'currencies.currency';
                break;
            case 'instrument':
                contentType = 'instruments.instrument';
                break;
            case 'instrument-type':
                contentType = 'instruments.instrumenttype';
                break;
            case 'pricing-policy':
                contentType = 'instruments.pricingpolicy';
                break;
            case 'counterparty':
                contentType = 'counterparties.counterparty';
                break;
            case 'counterparty-group':
                contentType = 'counterparties.counterpartygroup';
                break;
            case 'responsible':
                contentType = 'counterparties.responsible';
                break;
            case 'responsible-group':
                contentType = 'counterparties.responsiblegroup';
                break;
            case 'transaction':
                contentType = 'transactions.transaction';
                break;
            case 'transaction-type':
                contentType = 'transactions.transactiontype';
                break;
            case 'price-history':
                contentType = 'instruments.pricehistory';
                break;
            case 'currency-history':
                contentType = 'currencies.currencyhistory';
                break;
            case 'strategy-1':
                contentType = 'strategies.strategy1';
                break;
            case 'strategy-2':
                contentType = 'strategies.strategy2';
                break;
            case 'strategy-3':
                contentType = 'strategies.strategy3';
                break;
            case 'strategy-1-group':
                contentType = 'strategies.strategy2group';
                break;
            case 'strategy-2-group':
                contentType = 'strategies.strategy2group';
                break;
            case 'strategy-3-group':
                contentType = 'strategies.strategy2group';
                break;
            case 'strategy-1-subgroup':
                contentType = 'strategies.strategy1subgroup';
                break;
            case 'strategy-2-subgroup':
                contentType = 'strategies.strategy2subgroup';
                break;
            case 'strategy-3-subgroup':
                contentType = 'strategies.strategy3subgroup';
                break;
        }

        ui.content_type = contentType;

        return window.fetch(baseUrl + 'ui/edit-layout/',
            {
                method: 'POST',
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

    var updateEditLayout = function (id, ui) {
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


    var getListLayout = function (entity, name) {

        var contentType;

        switch (entity) {
            case 'portfolio':
                contentType = 'portfolios.portfolio';
                break;
            case 'account':
                contentType = 'accounts.account';
                break;
            case 'account-type':
                contentType = 'accounts.accounttype';
                break;
            case 'currency':
                contentType = 'currencies.currency';
                break;
            case 'instrument':
                contentType = 'instruments.instrument';
                break;
            case 'instrument-type':
                contentType = 'instruments.instrumenttype';
                break;
            case 'pricing-policy':
                contentType = 'instruments.pricingpolicy';
                break;
            case 'counterparty':
                contentType = 'counterparties.counterparty';
                break;
            case 'counterparty-group':
                contentType = 'counterparties.counterpartygroup';
                break;
            case 'responsible':
                contentType = 'counterparties.responsible';
                break;
            case 'responsible-group':
                contentType = 'counterparties.responsiblegroup';
                break;
            case 'transaction':
                contentType = 'transactions.transaction';
                break;
            case 'transaction-type':
                contentType = 'transactions.transactiontype';
                break;
            case 'price-history':
                contentType = 'instruments.pricehistory';
                break;
            case 'currency-history':
                contentType = 'currencies.currencyhistory';
                break;
            case 'strategy-1':
                contentType = 'strategies.strategy1';
                break;
            case 'strategy-2':
                contentType = 'strategies.strategy2';
                break;
            case 'strategy-3':
                contentType = 'strategies.strategy3';
                break;
            case 'strategy-1-group':
                contentType = 'strategies.strategy2group';
                break;
            case 'strategy-2-group':
                contentType = 'strategies.strategy2group';
                break;
            case 'strategy-3-group':
                contentType = 'strategies.strategy2group';
                break;
            case 'strategy-1-subgroup':
                contentType = 'strategies.strategy1subgroup';
                break;
            case 'strategy-2-subgroup':
                contentType = 'strategies.strategy2subgroup';
                break;
            case 'strategy-3-subgroup':
                contentType = 'strategies.strategy3subgroup';
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

    var updateListLayout = function (id, ui) {
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

    var getDefaultEditLayout = function () {
        return [
            {
                data: [
                    {
                        "name": "General",
                        "id": 1,
                        "layout": {
                            "fields": [
                                {
                                    "row": 1,
                                    "colspan": "1",
                                    "column": 1,
                                    "editMode": false,
                                    "id": null,
                                    "name": "Name",
                                    "disabled": false,
                                    "options": {
                                        "notNull": true
                                    },
                                    "attribute": {
                                        "value_type": 10,
                                        "name": "Name",
                                        "key": "name",
                                        "disabled": true
                                    },
                                    "type": "field",
                                    "key": null
                                }
                            ],
                            "rows": 1,
                            "columns": 1
                        }
                    }
                ]
            }
        ]
    };

    var getDefaultListLayout = function () {
        return [{
            "name": "default",
            "data": {
                "tableAdditions": {
                    "foreignEntityId": null,
                    "table": {
                        "sorting": {
                            "column": {
                                "sort": null,
                                "key": null
                            }
                        },
                        "columns": [],
                        "filters": []
                    },
                    "additionsType": "",
                    "entityType": null
                },
                "table": {
                    "folding": false,
                    "sorting": {
                        "group": {
                            "id": null,
                            "sort": "DESC",
                            "key": null
                        },
                        "column": {
                            "id": null,
                            "sort": "ASC",
                            "key": null
                        }
                    },
                    "grouping": [],
                    "columns": [
                        {
                            "value_type": 10,
                            "name": "Name",
                            "key": "name"
                        }
                    ],
                    "filters": [],
                    "columnsWidth": [
                        238
                    ]
                },
                "additionsType": ""
            }
        }]
    };

    module.exports = {

        getDefaultEditLayout: getDefaultEditLayout,
        getDefaultListLayout: getDefaultListLayout,

        getEditLayout: getEditLayout,
        createEditLayout: createEditLayout,
        updateEditLayout: updateEditLayout,

        getListLayout: getListLayout,
        updateListLayout: updateListLayout

    }

}());