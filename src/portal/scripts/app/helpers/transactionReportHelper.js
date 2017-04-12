/**
 * Created by szhitenev on 03.03.2017.
 */
(function () {

    'use strict';

    var transactionClassService = require('../services/transaction/transactionClassService');

    function findEntityObject(report, propertyName, id) {

        var result = null;

        if (report[propertyName]) {
            report[propertyName].forEach(function (item) {

                if (propertyName == 'transaction_classes') {
                    if (item.value == id) {
                        result = item;
                    }
                } else {

                    if (item.id == id) {
                        result = item;
                    }
                }
            });
        }

        //console.error(report);
        //console.error(propertyName);
        //console.error("id ", id);
        //console.error(result);

        return result

    }

    function injectAttributeTypes(report, propertyName, attrs) {

        if (report.hasOwnProperty(propertyName)) {

            report[propertyName].forEach(function (attributeTypeObject) {
                attrs.forEach(function (attr) {

                    if (attr.attribute_type == attributeTypeObject.id) {
                        attr.attribute_type_object = attributeTypeObject;

                        //console.log('attr', attr);

                        if (attr.attribute_type_object.classifiers_flat.length > 0) {
                            attr.attribute_type_object.classifiers_flat.forEach(function (classif) {
                                if (classif.id == attr.classifier) {
                                    attr.classifier_object = classif;
                                }
                            })
                        }

                    }

                })
            })

        }

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
            if (item.allocation_pl) {
                item.allocation_pl_object = findEntityObject(report, 'item_instruments', item.allocation_pl);
            }

            //item.instrument_pricing_currency_history_object = findEntityObject(report, 'item_currencies');
            //item.instrument_price_history_object = findEntityObject(report, 'item_currencies');

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

            //item.pricing_currency_object = findEntityObject(report, 'item_currencies');
            //item.pricing_currency_history_object = findEntityObject(report, 'item_currencies');
            //item.report_currency_history_object = findEntityObject(report, 'item_currencies');

            //item.strategy1_object = findEntityObject(report, 'item_strategies1');
            //item.strategy2_object = findEntityObject(report, 'item_strategies2');
            //item.strategy3_object = findEntityObject(report, 'item_strategies3');

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

            //item.transaction_currency_object = findEntityObject(report, 'item_currencies', item.transaction_currency);
            //item.settlement_currency_object = findEntityObject(report, 'item_currencies', item.settlement_currency);

            if (item.account_cash_object) {
                injectAttributeTypes(report, 'item_account_attribute_types', item.account_cash_object.attributes);
            }
            if (item.account_interim_object) {
                injectAttributeTypes(report, 'item_account_attribute_types', item.account_interim_object.attributes);
            }
            if (item.account_position_object) {
                injectAttributeTypes(report, 'item_account_attribute_types', item.account_position_object.attributes);
            }

            if (item.counterparty_object) {
                injectAttributeTypes(report, 'item_counterparty_attribute_types', item.counterparty_object.attributes);
            }
            if (item.responsible_object) {
                injectAttributeTypes(report, 'item_responsible_attribute_types', item.responsible_object.attributes);
            }

            if (item.transaction_currency_object) {
                injectAttributeTypes(report, 'item_currency_attribute_types', item.transaction_currency_object.attributes);
            }
            if (item.settlement_currency_object) {
                injectAttributeTypes(report, 'item_currency_attribute_types', item.settlement_currency_object.attributes);
            }

            //if (item.instrument_object) {
            //    injectAttributeTypes(report, 'item_instrument_attribute_types', item.instrument_object.attributes);
            //}

            if (item.linked_instrument_object) {
                injectAttributeTypes(report, 'item_instrument_attribute_types', item.linked_instrument_object.attributes);
            }

            if (item.hasOwnProperty('allocation_balance_object')) {

                console.log('item.allocation_balance_object', item.allocation_balance_object);

                injectAttributeTypes(report, 'item_instrument_attribute_types', item.allocation_balance_object.attributes);
            }
            if (item.hasOwnProperty('allocation_pl_object')) {
                injectAttributeTypes(report, 'item_instrument_attribute_types', item.allocation_pl_object.attributes);
            }

            if (item.portfolio_object) {
                injectAttributeTypes(report, 'item_portfolio_attribute_types', item.portfolio_object.attributes);
            }

            if (item.complex_transaction_object) {
                injectAttributeTypes(report, 'item_complex_transaction_attribute_types', item.complex_transaction_object.attributes);
            }

            injectAttributeTypes(report, 'item_transaction_attribute_types', item.attributes);

        });

        console.log('INJECTED', items);

        return items;
    };

    module.exports = {
        injectIntoItems: injectIntoItems
    }

}());