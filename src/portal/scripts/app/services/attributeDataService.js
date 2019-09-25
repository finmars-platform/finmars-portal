/**
 * Created by szhitenev on 24.09.2019.
 */

(function () {

    'use strict';

    var metaContentTypesService = require('./metaContentTypesService');
    var rvAttributesHelper = require('../helpers/rvAttributesHelper');

    var customFieldService = require('./reports/customFieldService');
    var attributeTypeService = require('./attributeTypeService');
    var uiService = require('./uiService');

    module.exports = function () {

        var reportsEntityTypes = ['balance-report', 'pl-report', 'transaction-report'];

        var entityAttributesData = {
            "portfolio": require('../models/portfolioPropsModel').getAttributes(),
            "audit-transaction": require('../models/auditTransactionPropsModel').getAttributes(),
            "audit-instrument": require('../models/auditInstrumentPropsModel').getAttributes(),
            "account": require('../models/accountPropsModel').getAttributes(),
            "tag": require('../models/tagPropsModel').getAttributes(),
            "account-type": require('../models/accountTypePropsModel').getAttributes(),
            "counterparty": require('../models/counterpartyPropsModel').getAttributes(),
            "counterparty-group": require('../models/counterpartyGroupPropsModel').getAttributes(),
            "responsible": require('../models/responsiblePropsModel').getAttributes(),
            "responsible-group": require('../models/responsibleGroupPropsModel').getAttributes(),
            "pricing-policy": require('../models/pricingPolicyPropsModel').getAttributes(),
            "instrument-type": require('../models/instrumentTypePropsModel').getAttributes(),
            "instrument": require('../models/instrumentPropsModel').getAttributes(),
            "transaction": require('../models/transactionPropsModel').getAttributes(),
            "transaction-type-group": require('../models/transactionTypeGroupPropsModel').getAttributes(),
            "transaction-type": require('../models/transactionTypePropsModel').getAttributes(),
            "currency": require('../models/currencyPropsModel').getAttributes(),
            "currency-history": require('../models/currencyHistoryPropsModel').getAttributes(),
            "price-history": require('../models/priceHistoryPropsModel').getAttributes(),
            "strategy-1": require('../models/strategy1PropsModel').getAttributes(),
            "strategy-2": require('../models/strategy2PropsModel').getAttributes(),
            "strategy-3": require('../models/strategy3PropsModel').getAttributes(),
            "strategy-1-subgroup": require('../models/strategy1subgroupPropsModel').getAttributes(),
            "strategy-2-subgroup": require('../models/strategy2subgroupPropsModel').getAttributes(),
            "strategy-3-subgroup": require('../models/strategy3subgroupPropsModel').getAttributes(),
            "strategy-1-group": require('../models/strategy1groupPropsModel').getAttributes(),
            "strategy-2-group": require('../models/strategy2groupPropsModel').getAttributes(),
            "strategy-3-group": require('../models/strategy3groupPropsModel').getAttributes(),
            "balance-report": require('../models/balanceReportPropsModel').getAttributes(),
            'report-addon-performance': require('../models/reportAddonPerformancePropsModel').getAttributes(),
            'report-addon-performance-pnl': require('../models/reportAddonPerformancePnlPropsModel').getAttributes(),
            'report-mismatch': require('../models/reportMismatchPropsModel').getAttributes(),
            "pl-report": require('../models/pnlReportPropsModel').getAttributes(),
            "transaction-report": require('../models/transactionReportPropsModel').getAttributes(),
            "cash-flow-projection-report": require('../models/cashFlowProjectionReportPropsModel').getAttributes(),
            "performance-report": require('../models/performanceReportPropsModel').getAttributes(),
            "complex-transaction": require('../models/complexTransactionPropsModel').getAttributes(),
            "instrument-scheme": require('../models/instrumentSchemePropsModel').getAttributes()
        };

        var customFieldsData = {};

        var dynamicAttributesData = {};

        var instrumentUserFieldsData = [];
        var transactionUserFieldsData = [];

        function _getBalanceReportAttributes() {

            var result = [];

            var balanceAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.balancereport', '', 'Balance', {maxDepth: 1});

            var balanceMismatchAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.balancereportmismatch', '', 'Mismatch', {maxDepth: 1});

            var balancePerformanceAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.balancereportperfomance', '', 'Perfomance', {maxDepth: 1});

            var allocationAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'allocation', 'Allocation', {maxDepth: 1});

            var instrumentAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});

            var linkedInstrumentAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'linked_instrument', 'Linked Instrument', {maxDepth: 1});

            var accountAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account', 'Account', {maxDepth: 1});

            var portfolioAttrs = rvAttributesHelper.getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            var strategy1attrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1', 'Strategy 1', {maxDepth: 1});

            var strategy2attrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2', 'Strategy 2', {maxDepth: 1});

            var strategy3attrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3', 'Strategy 3', {maxDepth: 1});

            var custom = getCustomFieldsByEntityType('balance-report').map(function (customItem) {

                customItem.custom_field = Object.assign({}, customItem);

                customItem.key = 'custom_fields.' + customItem.user_code;
                customItem.name = 'Custom Field. ' + customItem.name;

                return customItem

            });

            var portfolioDynamicAttrs = getDynamicAttributesByEntityType('portfolio');
            var accountDynamicAttrs = getDynamicAttributesByEntityType('account');
            var instrumentDynamicAttrs = getDynamicAttributesByEntityType('instrument');
            var allocationDynamicAttrs = getDynamicAttributesByEntityType('instrument');
            var linkedInstrumentDynamicAttrs = getDynamicAttributesByEntityType('instrument');

            var portfolioDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(portfolioDynamicAttrs, 'portfolios.portfolio', 'portfolio', 'Portfolio');
            var accountDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(accountDynamicAttrs, 'accounts.account', 'account', 'Account');
            var instrumentDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'instrument', 'Instrument');
            var allocationDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(allocationDynamicAttrs, 'instruments.instrument', 'allocation', 'Allocation');
            var linkedInstrumentDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(linkedInstrumentDynamicAttrs, 'instruments.instrument', 'linked_instrument', 'Linked Instrument');

            result = result.concat(balanceAttrs);
            result = result.concat(balanceMismatchAttrs);
            result = result.concat(balancePerformanceAttrs);
            result = result.concat(allocationAttrs);
            result = result.concat(instrumentAttrs);
            result = result.concat(linkedInstrumentAttrs);
            result = result.concat(accountAttrs);
            result = result.concat(portfolioAttrs);
            result = result.concat(strategy1attrs);
            result = result.concat(strategy2attrs);
            result = result.concat(strategy3attrs);

            result = result.concat(custom);

            result = result.concat(portfolioDynamicAttrsFormatted);
            result = result.concat(accountDynamicAttrsFormatted);
            result = result.concat(instrumentDynamicAttrsFormatted);
            result = result.concat(allocationDynamicAttrsFormatted);
            result = result.concat(linkedInstrumentDynamicAttrsFormatted);

            return result

        }

        function _getPlReportAttributes() {

            var result = [];

            var balanceAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.plreport', '', 'Balance', {maxDepth: 1});

            var balanceMismatchAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.plreportmismatch', '', 'Mismatch', {maxDepth: 1});

            var balancePerformanceAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.plreportperfomance', '', 'Perfomance', {maxDepth: 1});

            var allocationAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'allocation', 'Allocation', {maxDepth: 1});

            var instrumentAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});

            var linkedInstrumentAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'linked_instrument', 'Linked Instrument', {maxDepth: 1});

            var accountAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account', 'Account', {maxDepth: 1});

            var portfolioAttrs = rvAttributesHelper.getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            var strategy1attrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1', 'Strategy 1', {maxDepth: 1});

            var strategy2attrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2', 'Strategy 2', {maxDepth: 1});

            var strategy3attrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3', 'Strategy 3', {maxDepth: 1});

            var custom = getCustomFieldsByEntityType('pl-report').map(function (customItem) {

                customItem.custom_field = Object.assign({}, customItem);

                customItem.key = 'custom_fields.' + customItem.user_code;
                customItem.name = 'Custom Field. ' + customItem.name;

                return customItem

            });

            var portfolioDynamicAttrs = getDynamicAttributesByEntityType('portfolio');
            var accountDynamicAttrs = getDynamicAttributesByEntityType('account');
            var instrumentDynamicAttrs = getDynamicAttributesByEntityType('instrument');
            var allocationDynamicAttrs = getDynamicAttributesByEntityType('instrument');
            var linkedInstrumentDynamicAttrs = getDynamicAttributesByEntityType('instrument');

            var portfolioDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(portfolioDynamicAttrs, 'portfolios.portfolio', 'portfolio', 'Portfolio');
            var accountDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(accountDynamicAttrs, 'accounts.account', 'account', 'Account');
            var instrumentDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'instrument', 'Instrument');
            var allocationDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(allocationDynamicAttrs, 'instruments.instrument', 'allocation', 'Allocation');
            var linkedInstrumentDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(linkedInstrumentDynamicAttrs, 'instruments.instrument', 'linked_instrument', 'Linked Instrument');

            result = result.concat(balanceAttrs);
            result = result.concat(balanceMismatchAttrs);
            result = result.concat(balancePerformanceAttrs);
            result = result.concat(allocationAttrs);
            result = result.concat(instrumentAttrs);
            result = result.concat(linkedInstrumentAttrs);
            result = result.concat(accountAttrs);
            result = result.concat(portfolioAttrs);
            result = result.concat(strategy1attrs);
            result = result.concat(strategy2attrs);
            result = result.concat(strategy3attrs);

            result = result.concat(custom);

            result = result.concat(portfolioDynamicAttrsFormatted);
            result = result.concat(accountDynamicAttrsFormatted);
            result = result.concat(instrumentDynamicAttrsFormatted);
            result = result.concat(allocationDynamicAttrsFormatted);
            result = result.concat(linkedInstrumentDynamicAttrsFormatted);

            return result

        }

        function _getTransactionReportAttributes() {

            var result = [];

            var transactionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.transactionreport', '', 'Transaction', {maxDepth: 1});

            var complexTransactionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('transactions.complextransaction', 'complex_transaction', 'Complex Transaction', {maxDepth: 1});

            var portfolioAttrs = rvAttributesHelper.getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            var instrumentAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});

            var responsibleAttrs = rvAttributesHelper.getAllAttributesAsFlatList('counterparties.responsible', 'responsible', 'Responsible', {maxDepth: 1});

            var counterpartyAttrs = rvAttributesHelper.getAllAttributesAsFlatList('counterparties.counterparty', 'counterparty', 'Counterparty', {maxDepth: 1});

            // instruments

            var linkedInstrumentAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'linked_instrument', 'Linked Instrument', {maxDepth: 1});

            var allocationBalanceAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'allocation_balance', 'Allocation Balance', {maxDepth: 1});

            var allocationPlAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'allocation_pl', 'Allocation P&L', {maxDepth: 1});

            // currencies

            var transactionCurrencyAttrs = rvAttributesHelper.getAllAttributesAsFlatList('currencies.currency', 'transaction_currency', 'Transaction currency', {maxDepth: 1});

            var settlementCurrencyAttrs = rvAttributesHelper.getAllAttributesAsFlatList('currencies.currency', 'settlement_currency', 'Settlement currency', {maxDepth: 1});

            // accounts

            var accountPositionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account_position', 'Account Position', {maxDepth: 1});

            var accountCashAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account_cash', 'Account Cash', {maxDepth: 1});

            var accountInterimAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account_interim', 'Account Interim', {maxDepth: 1});

            // strategies

            var strategy1cashAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1_cash', 'Strategy 1 Cash', {maxDepth: 1});

            var strategy1positionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1_position', 'Strategy 1 Position', {maxDepth: 1});

            var strategy2cashAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2_cash', 'Strategy 2 Cash', {maxDepth: 1});

            var strategy2positionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2_position', 'Strategy 2 Position', {maxDepth: 1});

            var strategy3cashAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3_cash', 'Strategy 3 Cash', {maxDepth: 1});

            var strategy3positionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3_position', 'Strategy 3 Position', {maxDepth: 1});


            var custom = getCustomFieldsByEntityType('transaction-report').map(function (customItem) {

                customItem.custom_field = Object.assign({}, customItem);

                customItem.key = 'custom_fields.' + customItem.user_code;
                customItem.name = 'Custom Field. ' + customItem.name;

                return customItem

            });


            var portfolioDynamicAttrs = getDynamicAttributesByEntityType('portfolio');
            var complexTransactionDynamicAttrs = getDynamicAttributesByEntityType('complex-transaction');
            var transactionTypeDynamicAttrs = getDynamicAttributesByEntityType('transaction-type');
            var responsibleDynamicAttrs = getDynamicAttributesByEntityType('responsible');
            var counterpartyDynamicAttrs = getDynamicAttributesByEntityType('counterparty');

            var instrumentDynamicAttrs = getDynamicAttributesByEntityType('instrument');
            var linkedInstrumentDynamicAttrs = getDynamicAttributesByEntityType('instrument');
            var allocationBalanceDynamicAttrs = getDynamicAttributesByEntityType('instrument');
            var allocationPlDnymaicAttrs = getDynamicAttributesByEntityType('instrument');

            var accountPositionDynamicAttrs = getDynamicAttributesByEntityType('account');
            var accountCashDynamicAttrs = getDynamicAttributesByEntityType('account');
            var accountInterimDynamicAttrs = getDynamicAttributesByEntityType('account');

            var portfolioDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(portfolioDynamicAttrs, 'portfolios.portfolio', 'portfolio', 'Portfolio');
            var complexTransactionDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(complexTransactionDynamicAttrs, 'transactions.complextransaction', 'complex_transaction', 'Complex Transaction');
            var transactionTypeDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(transactionTypeDynamicAttrs, 'transactions.transactiontype', 'transaction_type', 'Transaction Type');
            var responsibleDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(responsibleDynamicAttrs, 'counterparties.responsible', 'responsible', 'Responsible');
            var counterpartyDynmicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(counterpartyDynamicAttrs, 'counterparties.counterparty', 'counterparty', 'Counterparty');

            var instrumentDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'instrument', 'Instrument');
            var linkedInstrumentDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(linkedInstrumentDynamicAttrs, 'instruments.instrument', 'linked_instrument', 'Linked Instrument');
            var allocationBalanceDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(allocationBalanceDynamicAttrs, 'instruments.instrument', 'allocation_balance', 'Allocation Balance');
            var allocationPlDnymaicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(allocationPlDnymaicAttrs, 'instruments.instrument', 'allocation_pl', 'Allocation PL');

            var accountPositionDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(accountPositionDynamicAttrs, 'accounts.account', 'account_position', 'Account Position');
            var accountCashDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(accountCashDynamicAttrs, 'accounts.account', 'account_cash', 'Account Cash');
            var accountInterimDynamicAttrsFormatted = rvAttributesHelper.formatAttributeTypes(accountInterimDynamicAttrs, 'accounts.account', 'account_interim', 'Account Interim');

            result = result.concat(transactionAttrs);
            result = result.concat(complexTransactionAttrs);
            result = result.concat(portfolioAttrs);
            result = result.concat(instrumentAttrs);
            result = result.concat(responsibleAttrs);
            result = result.concat(counterpartyAttrs);

            result = result.concat(linkedInstrumentAttrs);
            result = result.concat(allocationBalanceAttrs);
            result = result.concat(allocationPlAttrs);

            result = result.concat(transactionCurrencyAttrs);
            result = result.concat(settlementCurrencyAttrs);

            result = result.concat(accountPositionAttrs);
            result = result.concat(accountCashAttrs);
            result = result.concat(accountInterimAttrs);

            result = result.concat(strategy1cashAttrs);
            result = result.concat(strategy1positionAttrs);
            result = result.concat(strategy2cashAttrs);
            result = result.concat(strategy2positionAttrs);
            result = result.concat(strategy3cashAttrs);
            result = result.concat(strategy3positionAttrs);

            result = result.concat(custom);

            result = result.concat(portfolioDynamicAttrsFormatted);
            result = result.concat(complexTransactionDynamicAttrsFormatted);
            result = result.concat(transactionTypeDynamicAttrsFormatted);
            result = result.concat(responsibleDynamicAttrsFormatted);
            result = result.concat(counterpartyDynmicAttrsFormatted);

            result = result.concat(instrumentDynamicAttrsFormatted);
            result = result.concat(linkedInstrumentDynamicAttrsFormatted);
            result = result.concat(allocationBalanceDynamicAttrsFormatted);
            result = result.concat(allocationPlDnymaicAttrsFormatted);

            result = result.concat(accountPositionDynamicAttrsFormatted);
            result = result.concat(accountCashDynamicAttrsFormatted);
            result = result.concat(accountInterimDynamicAttrsFormatted);

            return result

        }

        function getEntityAttributesByEntityType(entityType) {
            return entityAttributesData[entityType]
        }

        function getCustomFieldsByEntityType(entityType) {

            if(customFieldsData.hasOwnProperty(entityType)) {
                return customFieldsData[entityType];
            }

            return []
        }

        function getDynamicAttributesByEntityType(entityType) {

            if(dynamicAttributesData.hasOwnProperty(entityType)) {
                return dynamicAttributesData[entityType];
            }

            return []
        }

        function getAllAttributesByEntityType(entityType) {

            var result = [];

            if (reportsEntityTypes.indexOf(entityType) === -1) {

                var entityAttributes = getEntityAttributesByEntityType(entityType);
                var dynamicAttributes = getDynamicAttributesByEntityType(entityType);
                var contentType = metaContentTypesService.findContentTypeByEntity(entityType);

                dynamicAttributes = dynamicAttributes.map(function (attribute) {

                    var result = {};

                    result.attribute_type = Object.assign({}, attribute);
                    result.value_type = attribute.value_type;
                    result.content_type = contentType;
                    result.key = 'attributes.' + attribute.user_code;
                    result.name = attribute.name;

                    return result

                });

                result.concat(entityAttributes);
                result.concat(dynamicAttributes)

            } else {

                if(entityType === 'balance-report') {
                    result = _getBalanceReportAttributes()
                }

                if(entityType === 'pl-report') {
                    result = _getPlReportAttributes()
                }

                if(entityType === 'transaction-report') {
                    result = _getTransactionReportAttributes()
                }

            }

            return result;
        }

        function getInstrumentUserFields() {

            if (instrumentUserFieldsData){
                return instrumentUserFieldsData
            }

            return []

        }

        function getTransactionUserFields() {

            if (transactionUserFieldsData){
                return transactionUserFieldsData
            }

            return []

        }

        function downloadAllAttributesByEntityType(entityType) {

            return new Promise(function (resolve, reject) {

                var result = [];

                var promises = [];


                if (reportsEntityTypes.indexOf(entityType) === -1) {

                    promises.push(downloadDynamicAttributesByEntityType(entityType))

                } else {

                    promises.push(downloadCustomFieldsByEntityType(entityType));
                    promises.push(downloadDynamicAttributesByEntityType('portfolio'));
                    promises.push(downloadDynamicAttributesByEntityType('account'));
                    promises.push(downloadDynamicAttributesByEntityType('instrument'));

                    if(entityType === 'transaction-report') {

                        promises.push(downloadDynamicAttributesByEntityType('responsible'));
                        promises.push(downloadDynamicAttributesByEntityType('counterparty'));
                        promises.push(downloadDynamicAttributesByEntityType('transaction-type'));
                        promises.push(downloadDynamicAttributesByEntityType('complex-transaction'));

                    }


                }

                Promise.all(promises).then(function (data) {

                    result = data;

                    resolve(result);

                })



            })

        }

        function downloadCustomFieldsByEntityType(entityType) {

            return new Promise(function (resolve, reject) {

                var result = [];

                customFieldService.getList(entityType).then(function (data) {

                    result = data.results;

                    customFieldsData[entityType] = result;

                    resolve(result)

                });



            })

        }

        function downloadDynamicAttributesByEntityType(entityType) {
            return new Promise(function (resolve, reject) {

                var result = [];

                attributeTypeService.getList(entityType).then(function (data) {

                    result = data.results;

                    dynamicAttributesData[entityType] = result;

                    resolve(result)

                });


            })
        }

        function downloadInstrumentUserFields() {

            return new Promise(function (resolve, reject) {

                var result = [];

                uiService.getInstrumentFieldList().then(function (data) {

                    result = data.results;

                    instrumentUserFieldsData = result;

                    resolve(result)

                });



            })

        }

        function downloadTransactionUserFields() {

            return new Promise(function (resolve, reject) {

                var result = [];

                uiService.getTransactionFieldList().then(function (data) {

                    result = data.results;

                    transactionUserFieldsData = result;

                    resolve(result)

                });



            })

        }

        return {

            // Remember! Download Custom Fields and Dynamic Attributes and User Fields before .get() them

            downloadAllAttributesByEntityType: downloadAllAttributesByEntityType,

            downloadCustomFieldsByEntityType: downloadCustomFieldsByEntityType,
            downloadDynamicAttributesByEntityType: downloadDynamicAttributesByEntityType,

            downloadInstrumentUserFields: downloadInstrumentUserFields,
            downloadTransactionUserFields: downloadTransactionUserFields,

            // Get method belows

            getAllAttributesByEntityType: getAllAttributesByEntityType,


            getInstrumentUserFields: getInstrumentUserFields,
            getTransactionUserFields: getTransactionUserFields,

            getEntityAttributesByEntityType: getEntityAttributesByEntityType,
            getCustomFieldsByEntityType: getCustomFieldsByEntityType,
            getDynamicAttributesByEntityType: getDynamicAttributesByEntityType

        }

    }

}());