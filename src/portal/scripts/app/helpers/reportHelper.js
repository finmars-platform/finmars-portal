/**
 * Created by szhitenev on 13.02.2017.
 */

/**
 * Report Viewer Helper.
 * @module reportHelper
 */

(function () {

    'use strict';

    var transactionClassService = require('../services/transaction/transactionClassService');
    var modelService = require('../services/modelService');
    var metaService = require('../services/metaService')

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
                item.strategy2_cash_object = findEntityObject(report, 'item_strategies2', item.strategy2_cash);
            }
            if (item.strategy2_position) {
                item.strategy2_position_object = findEntityObject(report, 'item_strategies2', item.strategy2_position);
            }
            if (item.strategy3_cash) {
                item.strategy3_cash_object = findEntityObject(report, 'item_strategies3', item.strategy3_cash);
            }
            if (item.strategy3_position) {
                item.strategy3_position_object = findEntityObject(report, 'item_strategies3', item.strategy3_position);
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

        // console.log('INJECTED', items);

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

    function getContentTypesWithDynamicAttributes() {

        return [
            'accounts.account',
            'counterparties.counterparty',
            'counterparties.responsible',
            'currencies.currency',
            'instruments.instrument',
            'portfolios.portfolio',
            'transactions.complextransaction']

    }

    /**
     * Save to result object all props from relation key in source object
     * @param {object} result - result flat object.
     * @param {string} parentKey - parent key (e.g. instrument.instrument_type).
     * @param {string} contentType - content type.
     * @param {object} source - original item instance.
     * @return {Object[]} Flat object.
     * @memberof module:reportHelper
     */
    var recursiveUnwrapRelation = function (result, parentKey, contentType, source) {

        var attributes = modelService.getAttributesByContentType(contentType);
        var resultKey;

        attributes.forEach(function (attribute) {

            resultKey = parentKey + '.' + attribute.key;

            if (attribute.value_type === 'field' && attribute.code === 'user_code' && source[attribute.key]) {

                recursiveUnwrapRelation(result, resultKey, attribute.value_content_type, source[attribute.key + '_object'])

            } else {

                if (attribute.value_type === 'field' && attribute.code === 'system_code' && source[attribute.key]) {

                    result[resultKey + '.name'] = source[attribute.key + '_object'].name

                } else {

                    if (attribute.value_type !== 'mc_field') {

                        result[resultKey] = source[attribute.key]

                    }
                }
            }

        });

        var contentTypesWithDynamicAttributes = getContentTypesWithDynamicAttributes();

        if (contentTypesWithDynamicAttributes.indexOf(contentType) !== -1) {

            unwrapDynamicAttributes(result, parentKey, contentType, source);

        }


    };

    var unwrapDynamicAttributes = function (result, parentKey, contentType, source) {

        // console.log('unwrapDynamicAttributes.source', source);

        if (source.hasOwnProperty('attributes')) {

            var resultKey = parentKey + '.attributes';
            var localResultKey;

            source.attributes.forEach(function (attribute) {

                // localResultKey = resultKey + '.' + attribute.attribute_type;
                localResultKey = resultKey + '.' + attribute.attribute_type_object.user_code;

                result[localResultKey] = null;

                if (attribute.attribute_type_object.value_type === 10) {
                    result[localResultKey] = attribute.value_string
                }

                if (attribute.attribute_type_object.value_type === 20) {
                    result[localResultKey] = attribute.value_float
                }

                if (attribute.attribute_type_object.value_type === 30) {

                    if (attribute.classifier_object) {

                        result[localResultKey] = attribute.classifier_object.name

                    }

                }

                if (attribute.attribute_type_object.value_type === 40) {
                    result[localResultKey] = attribute.value_date
                }


            })


        }

    };

    var unwrapCustomFields = function (result) {

        if (result.hasOwnProperty('custom_fields')) {
            result.custom_fields.forEach(function (customField) {
                var key = 'custom_fields.' + customField.user_code;

                result[key] = customField.value;

            })
        }

        return result

    };

    /**
     * Convert single object to a flat object.
     * @param {object} item.
     * @return {Object[]} Flat object.
     * @memberof module:reportHelper
     */
    var unwrapItem = function (item) {

        var result = {};
        var keys = Object.keys(item);

        var keysToUnwrap = {
            'instrument': 'instruments.instrument',
            'allocation': 'instruments.instrument',
            'allocation_balance': 'instruments.instrument',
            'allocation_pl': 'instruments.instrument',
            'linked_instrument': 'instruments.instrument',
            'account': 'accounts.account',
            'account_cash': 'accounts.account',
            'account_interim': 'accounts.account',
            'account_position': 'accounts.account',
            'currency': 'currencies.currency',
            'pricing_currency': 'currencies.currency',
            'settlement_currency': 'currencies.currency',
            'transaction_currency': 'currencies.currency',
            'portfolio': 'portfolios.portfolio',
            'complex_transaction': 'transactions.complextransaction',
            'responsible': 'counterparties.responsible',
            'counterparty': 'counterparties.counterparty',
            'strategy1_cash': 'strategies.strategy1',
            'strategy1_position': 'strategies.strategy1',
            'strategy2_cash': 'strategies.strategy2',
            'strategy2_position': 'strategies.strategy2',
            'strategy3_cash': 'strategies.strategy3',
            'strategy3_position': 'strategies.strategy3',
            //TODO add more keys to map
        };


        keys.forEach(function (key) {

            if (keysToUnwrap.hasOwnProperty(key) && item[key]) {

                result[key + '.id'] = item[key];

                recursiveUnwrapRelation(result, key, keysToUnwrap[key], item[key + '_object']);

            } else {
                result[key] = item[key];
            }


        });

        result = unwrapCustomFields(result)

        return result;

    };

    /**
     * Get list of entity attributes and all children attributes.
     * @param {Object[]} items - that were received from REST API.
     * @param {object} reportOptions - report options.
     * @return {Object[]} Array of flat objects.
     * @memberof module:reportHelper
     */
    var convertItemsToFlat = function (items) {

        items = items.map(function (item) {

            return unwrapItem(item);

        });

        return items

    };

    module.exports = {
        convertItemsToFlat: convertItemsToFlat,
        injectIntoItems: injectIntoItems,
        calculateMarketValueAndExposurePercents: calculateMarketValueAndExposurePercents
    }

}());