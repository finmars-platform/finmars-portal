/**
 * Created by szhitenev on 13.02.2017.
 */
(function () {

    'use strict';

    var transactionClassService = require('../services/transaction/transactionClassService');

    function findEntityObject(report, propertyName, id) {

        var result = null;

        if (report[propertyName]) {
            report[propertyName].forEach(function (item) {

                if (propertyName === 'transaction_classes') {
                    if (item.value === id) {
                        result = item;
                    }
                } else {

                    if (item.id === id) {
                        result = item;
                    }
                }
            });
        }

        return result

    }

    var injectIntoItems = function (items, report) {

        items.forEach(function (item) {

            //console.error('item', item);

            if (item.instrument) {
                item.instrument_object = findEntityObject(report, 'item_instruments', item.instrument);
            }
            if (item.linked_instrument) {
                item.linked_instrument_object = findEntityObject(report, 'item_instruments', item.linked_instrument);
            }
            if (item.allocation_balance) {
                item.allocation_balance_object = findEntityObject(report, 'item_instruments', item.allocation_balance);
            }
            if (item.allocation) {
                item.allocation_object = findEntityObject(report, 'item_instruments', item.allocation);
            }
            if (item.allocation_pl) {
                item.allocation_pl_object = findEntityObject(report, 'item_instruments', item.allocation_pl);
            }

            //item.instrument_pricing_currency_history_object = findEntityObject(report, 'item_currencies');
            //item.instrument_price_history_object = findEntityObject(report, 'item_currencies');

            if (item.account) {
                item.account_object = findEntityObject(report, 'item_accounts', item.account);
            }
            if (item.account_cash) {
                item.account_cash_object = findEntityObject(report, 'item_accounts', item.account_cash);
            }
            if (item.account_interim) {
                item.account_interim_object = findEntityObject(report, 'item_accounts', item.account_interim);
            }
            if (item.account_position) {
                item.account_position_object = findEntityObject(report, 'item_accounts', item.account_position);
            }
            if (item.counterparty) {
                item.counterparty_object = findEntityObject(report, 'item_counterparties', item.counterparty);
            }
            if (item.responsible) {
                item.responsible_object = findEntityObject(report, 'item_responsibles', item.responsible);
            }
            if (item.complex_transaction) {
                item.complex_transaction_object = findEntityObject(report, 'item_complex_transactions', item.complex_transaction);
            }

            if (item.transaction_class) {
                item.transaction_class_object = findEntityObject({transaction_classes: transactionClassService.getListSync()}, 'transaction_classes', item.transaction_class);
            }

            if (item.portfolio) {
                item.portfolio_object = findEntityObject(report, 'item_portfolios', item.portfolio);
            }

            if (item.transaction_currency) {
                item.transaction_currency_object = findEntityObject(report, 'item_currencies', item.transaction_currency);
            }
            if (item.settlement_currency) {
                item.settlement_currency_object = findEntityObject(report, 'item_currencies', item.settlement_currency);
            }

            if (item.currency) {
                item.currency_object = findEntityObject(report, 'item_currencies', item.currency);
            }

            if (item.pricing_currency) {
                item.pricing_currency_object = findEntityObject(report, 'item_currencies', item.pricing_currency);
            }

            //item.pricing_currency_object = findEntityObject(report, 'item_currencies');
            //item.pricing_currency_history_object = findEntityObject(report, 'item_currencies');
            //item.report_currency_history_object = findEntityObject(report, 'item_currencies');

            if (item.strategy1) {
                item.strategy1_object = findEntityObject(report, 'item_strategies1');
            }
            if (item.strategy2) {
                item.strategy2_object = findEntityObject(report, 'item_strategies2');
            }
            if (item.strategy3) {
                item.strategy3_object = findEntityObject(report, 'item_strategies3');
            }
            if (item.strategy1_cash) {
                item.strategy1_cash_object = findEntityObject(report, 'item_strategies1', item.strategy1_cash);
            }
            if (item.strategy1_position) {
                item.strategy1_position_object = findEntityObject(report, 'item_strategies1', item.strategy1_position);
            }
            if (item.strategy2_cash) {
                item.strategy2_cash_object = findEntityObject(report, 'item_strategies1', item.strategy2_cash);
            }
            if (item.strategy2_position) {
                item.strategy2_position_object = findEntityObject(report, 'item_strategies1', item.strategy2_position);
            }
            if (item.strategy3_cash) {
                item.strategy3_cash_object = findEntityObject(report, 'item_strategies1', item.strategy3_cash);
            }
            if (item.strategy3_position) {
                item.strategy3_position_object = findEntityObject(report, 'item_strategies1', item.strategy3_position);
            }

            if (item.custom_fields) {
                item.custom_fields_object = [];

                item.custom_fields.forEach(function (localCustomField) {
                    report.custom_fields_object.forEach(function (reportCustomField) {

                        if (reportCustomField.id == localCustomField.custom_field) {

                            item.custom_fields_object.push(reportCustomField);

                        }

                    })
                })

            }


        });

        console.log('INJECTED', items);

        return items;
    };

    function calculateMarketValueAndExposurePercents(items, reportOptions) {


        var groups = {};

        items.forEach(function (item) {

            var key = '-';

            if (item[reportOptions.calculationGroup]) {
                key = item[reportOptions.calculationGroup];
            }

            if (!groups.hasOwnProperty(key)) {
                groups[key] = []
            }

            groups[key].push(item)

        });

        var groupsTotalMarketValue = {};
        var groupsTotalExposure = {};

        Object.keys(groups).forEach(function (key) {

            groups[key].forEach(function (item) {

                if (!groupsTotalMarketValue.hasOwnProperty(key)) {
                    groupsTotalMarketValue[key] = 0
                }

                if (!groupsTotalExposure.hasOwnProperty(key)) {
                    groupsTotalExposure[key] = 0
                }

                if (item.market_value) {
                    groupsTotalMarketValue[key] = groupsTotalMarketValue[key] + parseFloat(item.market_value);
                }

                if (item.exposure) {
                    groupsTotalExposure[key] = groupsTotalExposure[key] + parseFloat(item.exposure);
                }

            })


        });

        return items.map(function (item) {

            var key = '-';

            if (item[reportOptions.calculationGroup]) {
                key = item[reportOptions.calculationGroup];
            }

            if (item.market_value) {

                item.market_value_percent = item.market_value / groupsTotalMarketValue[key] * 100;

            } else {
                item.market_value_percent = 0;
            }

            if (item.exposure) {

                item.exposure_percent = item.exposure / groupsTotalExposure[key] * 100;

            } else {
                item.exposure_percent = 0;
            }

            return item;

        });

    }

    module.exports = {
        injectIntoItems: injectIntoItems,
        calculateMarketValueAndExposurePercents: calculateMarketValueAndExposurePercents
    }

}());