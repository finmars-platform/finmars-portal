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
                if (item.id == id) {
                    result = item;
                }
            });
        }

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

            item.instrument_object = findEntityObject(report, 'instruments', item.instrument);
            item.linked_instrument_object = findEntityObject(report, 'instruments', item.linked_instrument);

            //item.instrument_pricing_currency_history_object = findEntityObject(report, 'currencies');
            //item.instrument_price_history_object = findEntityObject(report, 'currencies');

            item.account_cash_object = findEntityObject(report, 'accounts', item.account_cash);
            item.account_interim_object = findEntityObject(report, 'accounts', item.account_interim);
            item.account_position_object = findEntityObject(report, 'accounts', item.account_position);
            item.counterparty_object = findEntityObject(report, 'counterparties', item.counterparty);
            item.responsible_object = findEntityObject(report, 'responsibles', item.responsible);
            item.complex_transaction_object = findEntityObject(report, 'complex_transactions', item.complex_transaction);

            item.transaction_class_object = findEntityObject({transaction_classes: transactionClassService.getListSync()}, 'transaction_classes', item.transaction_class);

            item.portfolio_object = findEntityObject(report, 'portfolios', item.portfolio);

            //item.pricing_currency_object = findEntityObject(report, 'currencies');
            //item.pricing_currency_history_object = findEntityObject(report, 'currencies');
            //item.report_currency_history_object = findEntityObject(report, 'currencies');

            //item.strategy1_object = findEntityObject(report, 'strategies1');
            //item.strategy2_object = findEntityObject(report, 'strategies2');
            //item.strategy3_object = findEntityObject(report, 'strategies3');

            item.strategy1_cash_object = findEntityObject(report, 'strategies1', item.strategy1_cash);
            item.strategy1_position_object = findEntityObject(report, 'strategies1', item.strategy1_position);
            item.strategy2_cash_object = findEntityObject(report, 'strategies1', item.strategy2_cash);
            item.strategy2_position_object = findEntityObject(report, 'strategies1', item.strategy2_position);
            item.strategy3_cash_object = findEntityObject(report, 'strategies1', item.strategy3_cash);
            item.strategy3_position_object = findEntityObject(report, 'strategies1', item.strategy3_position);

            item.transaction_currency_object = findEntityObject(report, 'currencies', item.transaction_currency);
            item.settlement_currency_object = findEntityObject(report, 'currencies', item.settlement_currency);

            injectAttributeTypes(report, 'account_attribute_types', item.account_cash_object.attributes);
            injectAttributeTypes(report, 'account_attribute_types', item.account_interim_object.attributes);
            injectAttributeTypes(report, 'account_attribute_types', item.account_position_object.attributes);

            injectAttributeTypes(report, 'counterparty_attribute_types', item.counterparty_object.attributes);
            injectAttributeTypes(report, 'responsible_attribute_types', item.responsible_object.attributes);

            injectAttributeTypes(report, 'currency_attribute_types', item.transaction_currency_object.attributes);
            injectAttributeTypes(report, 'currency_attribute_types', item.settlement_currency_object.attributes);

            injectAttributeTypes(report, 'instrument_attribute_types', item.instrument_object.attributes);
            injectAttributeTypes(report, 'instrument_attribute_types', item.linked_instrument_object.attributes);

            injectAttributeTypes(report, 'portfolio_attribute_types', item.portfolio_object.attributes);

            injectAttributeTypes(report, 'complex_transaction_attribute_types', item.complex_transaction_object.attributes);

            injectAttributeTypes(report, 'transaction_attribute_types', item.attributes);

        });

        console.log('INJECTED', items);

        return items;
    };

    module.exports = {
        injectIntoItems: injectIntoItems
    }

}());