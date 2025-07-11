/**
 * Attribute Data Service.
 * @module attributeDataService
 */
(function () {

    module.exports = function (metaContentTypesService, customFieldService, attributeTypeService, uiService) {

        var reportsEntityTypes = ['balance-report', 'pl-report', 'transaction-report'];

        var entityAttributesData = {
            "portfolio": require('../models/portfolioPropsModel').getAttributes(),
            "portfolio-type": require('../models/portfolioTypePropsModel').getAttributes(),
            "portfolio-reconcile-group": require('../models/portfolioReconcileGroupPropsModel').getAttributes(),
            "portfolio-register": require('../models/portfolioRegisterPropsModel').getAttributes(),
            "portfolio-register-record": require('../models/portfolioRegisterRecordPropsModel').getAttributes(),
            "portfolio-history": require('../models/portfolioHistoryPropsModel').getAttributes(),
            "portfolio-reconcile-history": require('../models/portfolioReconcileHistoryPropsModel').getAttributes(),
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
            "generated-event": require('../models/generatedEventPropsModel').getAttributes(),
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
            "complex-transaction": require('../models/complexTransactionPropsModel').getAttributes(),
            "instrument-scheme": require('../models/instrumentSchemePropsModel').getAttributes(),

            "balance-report": require('../models/balanceReportPropsModel').getAttributes(),
            'balance-report-performance': require('../models/reportAddonPerformancePropsModel').getAttributes(),
            'balance-report-mismatch': require('../models/reportMismatchPropsModel').getAttributes(),
            "pl-report": require('../models/pnlReportPropsModel').getAttributes(),
            'pl-report-performance': require('../models/reportAddonPerformancePnlPropsModel').getAttributes(),
            'pl-report-mismatch': require('../models/reportMismatchPnlPropsModel').getAttributes(),
            "transaction-report": require('../models/transactionReportPropsModel').getAttributes(),
            "cash-flow-projection-report": require('../models/cashFlowProjectionReportPropsModel').getAttributes(),
            "performance-report": require('../models/performanceReportPropsModel').getAttributes(),

            "currency-history-error": require('../models/currencyHistoryErrorPropsModel').getAttributes(),
            "price-history-error": require('../models/priceHistoryErrorPropsModel').getAttributes(),

            "transaction-class": require('../models/transactionClassPropsModel').getAttributes(),
            "complex-transaction-status": require('../models/complextransactionStatusPropsModel').getAttributes(),
            "country": require('../models/countryPropsModel').getAttributes(),
            "complex-transaction-import-scheme": require('../models/complexTransactionImportSchemePropsModel').getAttributes(),
            "csv-import-scheme": require('../models/CsvImportSchemePropsModel').getAttributes(),

        };

        var customFieldsData = {};

        var dynamicAttributesData = {};

        var instrumentUserFieldsData = [];
        var transactionUserFieldsData = [];
        var complexTransactionUserFieldsData = [];

        var reconciliationAttributes = [];

        var attributesAvailableForColumns = [];

        /** Use aliases as names for user field for complex transactions **/
        function applyAliasesToAttrs (attributes, contentType, keyPrefix='', namePrefix='') {

            let userFields = [];

            switch (contentType) {
                case 'transactions.transaction':
                    userFields = getTransactionUserFields();
                    break;
                case 'transactions.complextransaction':
                    userFields = getComplexTransactionUserFields();
                    break;
                case 'instruments.instrument':
                    userFields = getInstrumentUserFields();
                    break;
            }

            userFields.forEach(function (field) {

                attributes = attributes.map(function (attr) {

                    /*if (attr.key === 'complex_transaction.' + field.key) {
                        attr.name = 'Complex Transaction. ' + field.name;
                    }*/
                    if (attr.key === keyPrefix + field.key) {
                        attr.name = namePrefix + field.name;
                    }

                    return attr;

                })

            });

            return attributes;

        }

        function _getBalanceReportAttributes() {

            var result = [];

            var balanceAttrs = getAllAttributesAsFlatList('reports.balancereport', '', 'Balance', {maxDepth: 1});

            var balanceMismatchAttrs = getAllAttributesAsFlatList('reports.balancereportmismatch', '', 'Mismatch', {maxDepth: 1});

            var balancePerformanceAttrs = getAllAttributesAsFlatList('reports.balancereportperformance', '', 'Performance', {maxDepth: 1});

            var instrumentAttrs = getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});
            instrumentAttrs = applyAliasesToAttrs(instrumentAttrs, 'instruments.instrument', 'instrument.', 'Instrument. ');

            var linkedInstrumentAttrs = getAllAttributesAsFlatList('instruments.instrument', 'linked_instrument', 'Linked Instrument', {maxDepth: 1});
            linkedInstrumentAttrs = applyAliasesToAttrs(linkedInstrumentAttrs, 'instruments.instrument', 'linked_instrument.', 'Linked Instrument. ');

            var allocationAttrs = getAllAttributesAsFlatList('instruments.instrument', 'allocation', 'Allocation', {maxDepth: 1});
            allocationAttrs = applyAliasesToAttrs(allocationAttrs, 'instruments.instrument', 'allocation.', 'Allocation. ');

            var currencyAttrs = getAllAttributesAsFlatList('currencies.currency', 'currency', 'Currency', {maxDepth: 1});

            var accountAttrs = getAllAttributesAsFlatList('accounts.account', 'account', 'Account', {maxDepth: 1});

            var portfolioAttrs = getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            var strategy1attrs = getAllAttributesAsFlatList('strategies.strategy1', 'strategy1', 'Strategy 1', {maxDepth: 1});

            var strategy2attrs = getAllAttributesAsFlatList('strategies.strategy2', 'strategy2', 'Strategy 2', {maxDepth: 1});

            var strategy3attrs = getAllAttributesAsFlatList('strategies.strategy3', 'strategy3', 'Strategy 3', {maxDepth: 1});

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

            var portfolioDynamicAttrsFormatted = formatAttributeTypes(portfolioDynamicAttrs, 'portfolios.portfolio', 'portfolio', 'Portfolio');
            var accountDynamicAttrsFormatted = formatAttributeTypes(accountDynamicAttrs, 'accounts.account', 'account', 'Account');
            var currencyDynamicAttrsFormatted = formatAttributeTypes(accountDynamicAttrs, 'currencies.currency', 'currency', 'Currency');
            var instrumentDynamicAttrsFormatted = formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'instrument', 'Instrument');
            var allocationDynamicAttrsFormatted = formatAttributeTypes(allocationDynamicAttrs, 'instruments.instrument', 'allocation', 'Allocation');
            var linkedInstrumentDynamicAttrsFormatted = formatAttributeTypes(linkedInstrumentDynamicAttrs, 'instruments.instrument', 'linked_instrument', 'Linked Instrument');

            // remove attributes that area already inside currency from balance
            balanceAttrs = balanceAttrs.filter(function (bAttr) {
                return !!!currencyAttrs.find(function (cAttr) {return cAttr.key === bAttr.key});
            });

            result = result.concat(balanceAttrs);
            result = result.concat(balanceMismatchAttrs);
            result = result.concat(balancePerformanceAttrs);
            result = result.concat(allocationAttrs);
            result = result.concat(instrumentAttrs);
            result = result.concat(linkedInstrumentAttrs);
            result = result.concat(currencyAttrs);
            result = result.concat(accountAttrs);
            result = result.concat(portfolioAttrs);
            result = result.concat(strategy1attrs);
            result = result.concat(strategy2attrs);
            result = result.concat(strategy3attrs);

            result = result.concat(custom);

            result = result.concat(portfolioDynamicAttrsFormatted);
            result = result.concat(accountDynamicAttrsFormatted);
            result = result.concat(currencyDynamicAttrsFormatted);
            result = result.concat(instrumentDynamicAttrsFormatted);
            result = result.concat(allocationDynamicAttrsFormatted);
            result = result.concat(linkedInstrumentDynamicAttrsFormatted);

            return result

        }

        function _getPlReportAttributes() {

            var result = [];

            var balanceAttrs = getAllAttributesAsFlatList('reports.plreport', '', 'Balance', {maxDepth: 1});

            var balanceMismatchAttrs = getAllAttributesAsFlatList('reports.plreportmismatch', '', 'Mismatch', {maxDepth: 1});

            var balancePerformanceAttrs = getAllAttributesAsFlatList('reports.plreportperformance', '', 'Performance', {maxDepth: 1});

            var instrumentAttrs = getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});
            instrumentAttrs = applyAliasesToAttrs(instrumentAttrs, 'instruments.instrument', 'instrument.', 'Instrument. ');

            var linkedInstrumentAttrs = getAllAttributesAsFlatList('instruments.instrument', 'linked_instrument', 'Linked Instrument', {maxDepth: 1});
            linkedInstrumentAttrs = applyAliasesToAttrs(linkedInstrumentAttrs, 'instruments.instrument', 'linked_instrument.', 'Linked Instrument. ');

            var allocationAttrs = getAllAttributesAsFlatList('instruments.instrument', 'allocation', 'Allocation', {maxDepth: 1});
            allocationAttrs = applyAliasesToAttrs(allocationAttrs, 'instruments.instrument', 'allocation.', 'Allocation. ');

            var accountAttrs = getAllAttributesAsFlatList('accounts.account', 'account', 'Account', {maxDepth: 1});

            var portfolioAttrs = getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            var strategy1attrs = getAllAttributesAsFlatList('strategies.strategy1', 'strategy1', 'Strategy 1', {maxDepth: 1});

            var strategy2attrs = getAllAttributesAsFlatList('strategies.strategy2', 'strategy2', 'Strategy 2', {maxDepth: 1});

            var strategy3attrs = getAllAttributesAsFlatList('strategies.strategy3', 'strategy3', 'Strategy 3', {maxDepth: 1});

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

            result = result.filter(function (attr) {
                return attr.key.indexOf("return") < 0;
            })

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

            var portfolioDynamicAttrsFormatted = formatAttributeTypes(portfolioDynamicAttrs, 'portfolios.portfolio', 'portfolio', 'Portfolio');
            var accountDynamicAttrsFormatted = formatAttributeTypes(accountDynamicAttrs, 'accounts.account', 'account', 'Account');
            var instrumentDynamicAttrsFormatted = formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'instrument', 'Instrument');
            var allocationDynamicAttrsFormatted = formatAttributeTypes(allocationDynamicAttrs, 'instruments.instrument', 'allocation', 'Allocation');
            var linkedInstrumentDynamicAttrsFormatted = formatAttributeTypes(linkedInstrumentDynamicAttrs, 'instruments.instrument', 'linked_instrument', 'Linked Instrument');

            /*result = result.concat(balanceAttrs);
            result = result.concat(balanceMismatchAttrs);
            result = result.concat(balancePerformanceAttrs);
            result = result.concat(allocationAttrs);
            result = result.concat(instrumentAttrs);
            result = result.concat(linkedInstrumentAttrs);
            result = result.concat(accountAttrs);
            result = result.concat(portfolioAttrs);
            result = result.concat(strategy1attrs);
            result = result.concat(strategy2attrs);
            result = result.concat(strategy3attrs);*/

            result = result.concat(custom);

            result = result.concat(portfolioDynamicAttrsFormatted);
            result = result.concat(accountDynamicAttrsFormatted);
            result = result.concat(instrumentDynamicAttrsFormatted);
            result = result.concat(allocationDynamicAttrsFormatted);
            result = result.concat(linkedInstrumentDynamicAttrsFormatted);

            return result

        }

        const ttypeUserFields  = [
            'complex_transaction.transaction_type.user_text_1', 'complex_transaction.transaction_type.user_text_2', 'complex_transaction.transaction_type.user_text_3', 'complex_transaction.transaction_type.user_text_4', 'complex_transaction.transaction_type.user_text_5',
            'complex_transaction.transaction_type.user_text_6', 'complex_transaction.transaction_type.user_text_7', 'complex_transaction.transaction_type.user_text_8', 'complex_transaction.transaction_type.user_text_9', 'complex_transaction.transaction_type.user_text_10',
            'complex_transaction.transaction_type.user_text_11', 'complex_transaction.transaction_type.user_text_12', 'complex_transaction.transaction_type.user_text_13', 'complex_transaction.transaction_type.user_text_14', 'complex_transaction.transaction_type.user_text_15',
            'complex_transaction.transaction_type.user_text_16', 'complex_transaction.transaction_type.user_text_17', 'complex_transaction.transaction_type.user_text_18', 'complex_transaction.transaction_type.user_text_19', 'complex_transaction.transaction_type.user_text_20',
            'complex_transaction.transaction_type.user_text_21', 'complex_transaction.transaction_type.user_text_22', 'complex_transaction.transaction_type.user_text_23', 'complex_transaction.transaction_type.user_text_24', 'complex_transaction.transaction_type.user_text_25',
            'complex_transaction.transaction_type.user_text_26', 'complex_transaction.transaction_type.user_text_27', 'complex_transaction.transaction_type.user_text_28', 'complex_transaction.transaction_type.user_text_29', 'complex_transaction.transaction_type.user_text_30',

            'complex_transaction.transaction_type.user_number_1', 'complex_transaction.transaction_type.user_number_2', 'complex_transaction.transaction_type.user_number_3', 'complex_transaction.transaction_type.user_number_4',
            'complex_transaction.transaction_type.user_number_5', 'complex_transaction.transaction_type.user_number_6', 'complex_transaction.transaction_type.user_number_7', 'complex_transaction.transaction_type.user_number_8',
            'complex_transaction.transaction_type.user_number_9', 'complex_transaction.transaction_type.user_number_10', 'complex_transaction.transaction_type.user_number_11', 'complex_transaction.transaction_type.user_number_12',
            'complex_transaction.transaction_type.user_number_13', 'complex_transaction.transaction_type.user_number_14', 'complex_transaction.transaction_type.user_number_15', 'complex_transaction.transaction_type.user_number_16',
            'complex_transaction.transaction_type.user_number_17', 'complex_transaction.transaction_type.user_number_18', 'complex_transaction.transaction_type.user_number_19', 'complex_transaction.transaction_type.user_number_20',

            'complex_transaction.transaction_type.user_date_1', 'complex_transaction.transaction_type.user_date_2', 'complex_transaction.transaction_type.user_date_3', 'complex_transaction.transaction_type.user_date_4', 'complex_transaction.transaction_type.user_date_5'
        ];

        function _getTransactionReportAttributes() {

            var result = [];

            var transactionAttrs = getAllAttributesAsFlatList('reports.transactionreport', '', 'Transaction', {maxDepth: 1});
            transactionAttrs = applyAliasesToAttrs(transactionAttrs, 'transactions.transaction', '', 'Transaction. ');

            var complexTransactionAttrs = getAllAttributesAsFlatList('transactions.complextransaction', 'complex_transaction', 'Complex Transaction', {maxDepth: 1});

            complexTransactionAttrs = complexTransactionAttrs.filter(function (attr) {
                return ttypeUserFields.indexOf(attr.key) < 0;
            });

            complexTransactionAttrs = applyAliasesToAttrs(complexTransactionAttrs, 'transactions.complextransaction', 'complex_transaction.', 'Complex Transaction. ');

            var portfolioAttrs = getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            var instrumentAttrs = getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});
            instrumentAttrs = applyAliasesToAttrs(instrumentAttrs, 'instruments.instrument', 'instrument.', 'Instrument. ');

            var responsibleAttrs = getAllAttributesAsFlatList('counterparties.responsible', 'responsible', 'Responsible', {maxDepth: 1});

            var counterpartyAttrs = getAllAttributesAsFlatList('counterparties.counterparty', 'counterparty', 'Counterparty', {maxDepth: 1});

            // instruments

            var linkedInstrumentAttrs = getAllAttributesAsFlatList('instruments.instrument', 'linked_instrument', 'Linked Instrument', {maxDepth: 1});
            linkedInstrumentAttrs = applyAliasesToAttrs(linkedInstrumentAttrs, 'instruments.instrument', 'linked_instrument.', 'Linked Instrument. ');

            var allocationBalanceAttrs = getAllAttributesAsFlatList('instruments.instrument', 'allocation_balance', 'Allocation Balance', {maxDepth: 1});
            allocationBalanceAttrs = applyAliasesToAttrs(allocationBalanceAttrs, 'instruments.instrument', 'allocation_balance.', 'Allocation Balance. ');

            var allocationPlAttrs = getAllAttributesAsFlatList('instruments.instrument', 'allocation_pl', 'Allocation P&L', {maxDepth: 1});
            allocationPlAttrs = applyAliasesToAttrs(allocationPlAttrs, 'instruments.instrument', 'allocation_pl.', 'Allocation P&L. ');

            // currencies

            var transactionCurrencyAttrs = getAllAttributesAsFlatList('currencies.currency', 'transaction_currency', 'Transaction currency', {maxDepth: 1});

            var settlementCurrencyAttrs = getAllAttributesAsFlatList('currencies.currency', 'settlement_currency', 'Settlement currency', {maxDepth: 1});

            // accounts

            var accountPositionAttrs = getAllAttributesAsFlatList('accounts.account', 'account_position', 'Account Position', {maxDepth: 1});

            var accountCashAttrs = getAllAttributesAsFlatList('accounts.account', 'account_cash', 'Account Cash', {maxDepth: 1});

            var accountInterimAttrs = getAllAttributesAsFlatList('accounts.account', 'account_interim', 'Account Interim', {maxDepth: 1});

            // strategies

            var strategy1cashAttrs = getAllAttributesAsFlatList('strategies.strategy1', 'strategy1_cash', 'Strategy 1 Cash', {maxDepth: 1});

            var strategy1positionAttrs = getAllAttributesAsFlatList('strategies.strategy1', 'strategy1_position', 'Strategy 1 Position', {maxDepth: 1});

            var strategy2cashAttrs = getAllAttributesAsFlatList('strategies.strategy2', 'strategy2_cash', 'Strategy 2 Cash', {maxDepth: 1});

            var strategy2positionAttrs = getAllAttributesAsFlatList('strategies.strategy2', 'strategy2_position', 'Strategy 2 Position', {maxDepth: 1});

            var strategy3cashAttrs = getAllAttributesAsFlatList('strategies.strategy3', 'strategy3_cash', 'Strategy 3 Cash', {maxDepth: 1});

            var strategy3positionAttrs = getAllAttributesAsFlatList('strategies.strategy3', 'strategy3_position', 'Strategy 3 Position', {maxDepth: 1});


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

            var portfolioDynamicAttrsFormatted = formatAttributeTypes(portfolioDynamicAttrs, 'portfolios.portfolio', 'portfolio', 'Portfolio');
            var complexTransactionDynamicAttrsFormatted = formatAttributeTypes(complexTransactionDynamicAttrs, 'transactions.complextransaction', 'complex_transaction', 'Complex Transaction');
            var transactionTypeDynamicAttrsFormatted = formatAttributeTypes(transactionTypeDynamicAttrs, 'transactions.transactiontype', 'transaction_type', 'Transaction Type');
            var responsibleDynamicAttrsFormatted = formatAttributeTypes(responsibleDynamicAttrs, 'counterparties.responsible', 'responsible', 'Responsible');
            var counterpartyDynmicAttrsFormatted = formatAttributeTypes(counterpartyDynamicAttrs, 'counterparties.counterparty', 'counterparty', 'Counterparty');

            var instrumentDynamicAttrsFormatted = formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'instrument', 'Instrument');
            var linkedInstrumentDynamicAttrsFormatted = formatAttributeTypes(linkedInstrumentDynamicAttrs, 'instruments.instrument', 'linked_instrument', 'Linked Instrument');
            var allocationBalanceDynamicAttrsFormatted = formatAttributeTypes(allocationBalanceDynamicAttrs, 'instruments.instrument', 'allocation_balance', 'Allocation Balance');
            var allocationPlDnymaicAttrsFormatted = formatAttributeTypes(allocationPlDnymaicAttrs, 'instruments.instrument', 'allocation_pl', 'Allocation P&L');

            var accountPositionDynamicAttrsFormatted = formatAttributeTypes(accountPositionDynamicAttrs, 'accounts.account', 'account_position', 'Account Position');
            var accountCashDynamicAttrsFormatted = formatAttributeTypes(accountCashDynamicAttrs, 'accounts.account', 'account_cash', 'Account Cash');
            var accountInterimDynamicAttrsFormatted = formatAttributeTypes(accountInterimDynamicAttrs, 'accounts.account', 'account_interim', 'Account Interim');

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

            if (entityAttributesData[entityType]) {

                let attrs = JSON.parse(JSON.stringify(entityAttributesData[entityType]));

                // Use aliases as names for user fields
                /*const applyAliases = function (uFields) {

                    uFields.forEach(function (field) {

                        attrs = attrs.map(function (attr) {

                            if (attr.key === field.key) {
                                attr.name = field.name;
                            }

                            return attr;

                        })

                    });

                    return attrs;

                }

                attrs = applyAliases( getComplexTransactionUserFields() );
                attrs = applyAliases( getInstrumentUserFields() );
                attrs = applyAliases( getTransactionUserFields() );*/
                var contentType = metaContentTypesService.findContentTypeByEntity(entityType);
                attrs = applyAliasesToAttrs(attrs, contentType);

                return attrs;

            }

            return []
        }

        function getCustomFieldsByEntityType(entityType) {

            if (customFieldsData.hasOwnProperty(entityType)) {
                return JSON.parse(JSON.stringify(customFieldsData[entityType]));
            }

            return []
        }

        function getDynamicAttributesByEntityType(entityType) {

            if (dynamicAttributesData.hasOwnProperty(entityType)) {
                return JSON.parse(JSON.stringify(dynamicAttributesData[entityType]));
            }

            return []
        }

        function getAllAttributesByEntityType(entityType, viewContext) {

            var result;

            /* if (reportsEntityTypes.indexOf(entityType) === -1) {

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

                if (entityType === 'balance-report') {
                    result = _getBalanceReportAttributes()
                }

                if (entityType === 'pl-report') {
                    result = _getPlReportAttributes()
                }

                if (entityType === 'transaction-report') {
                    result = _getTransactionReportAttributes()
                }

            } */
            if (viewContext === 'reconciliation_viewer') {
                result = getReconciliationAttributes();

            }
            else {

                switch (entityType) {
                    case 'balance-report':
                        result = _getBalanceReportAttributes();
                        break;

                    case 'pl-report':
                        result = _getPlReportAttributes();
                        break;

                    case 'transaction-report':
                        result = _getTransactionReportAttributes();
                        break;

                    default: // get attributes for entity viewer

                        var contentType = metaContentTypesService.findContentTypeByEntity(entityType);
                        var entityAttrs = [];
                        var dynamicAttrs = [];

                        result = [];

                        entityAttrs = getEntityAttributesByEntityType(entityType);

                        entityAttrs.forEach(function (item) {
                            if (item.key === 'subgroup' && item.value_entity.indexOf('strategy') !== -1) {
                                item.name = 'Group';
                            }
                            item.entity = entityType;
                        });

                        /*var instrumentUserFields = getInstrumentUserFields();
                        var transactionUserFields = getTransactionUserFields();

                        instrumentUserFields.forEach(function (field) {

                            entityAttrs.forEach(function (entityAttr) {

                                if (entityAttr.key === field.key) {
                                    entityAttr.name = field.name;
                                }

                            })

                        });
                        transactionUserFields.forEach(function (field) {

                            entityAttrs.forEach(function (entityAttr) {

                                if (entityAttr.key === field.key) {
                                    entityAttr.name = field.name;
                                }

                            })

                        });*/

                        dynamicAttrs = getDynamicAttributesByEntityType(entityType);


                        dynamicAttrs = dynamicAttrs.map(function (attribute) {

                            var result = {};

                            result.attribute_type = Object.assign({}, attribute);
                            result.value_type = attribute.value_type;
                            result.content_type = contentType;
                            result.key = 'attributes.' + attribute.user_code;
                            result.name = attribute.name;

                            return result

                        });

                        result = result.concat(entityAttrs);
                        result = result.concat(dynamicAttrs);
                }

            }

            return result;
        }

        function getForAttributesSelector(entityType, viewContext) {
            var attrs = getAllAttributesByEntityType(entityType, viewContext);

            return attrs.filter(function (attr) {
                return attr.value_type !== 'mc_field';
            })
        }

        function getInstrumentUserFields() {

            if (instrumentUserFieldsData) {
                return instrumentUserFieldsData
            }

            return []

        }

        function getTransactionUserFields() {

            if (transactionUserFieldsData) {
                return transactionUserFieldsData
            }

            return []

        }

        function getComplexTransactionUserFields() {

            if (complexTransactionUserFieldsData) {
                return complexTransactionUserFieldsData
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

                    if (entityType === 'transaction-report') {

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

                attributeTypeService.getList(entityType, {pageSize: 1000}).then(function (data) {

                    result = data.results;

                    dynamicAttributesData[entityType] = result;

                    resolve(result)

                });


            })
        }

        function downloadInstrumentUserFields() {

            return new Promise(function (resolve, reject) {

                var result = [];

                // uiService.getInstrumentFieldList().then(function (data) {
                uiService.getInstrumentFieldPrimaryList().then(function (data) {

                    result = data.results;

                    instrumentUserFieldsData = result;

                    resolve(result)

                });
                // resolve(result);

            })

        }

        function downloadComplexTransactionUserFields() {

            return new Promise(function (resolve, reject) {

                var result = [];

                // uiService.getComplexTransactionFieldList({pageSize: 1000}).then(function (data) {
                uiService.getComplexTransactionFieldPrimaryList({pageSize: 1000}).then(function (data) {

                    result = data.results;

                    complexTransactionUserFieldsData = result;

                    resolve(result)

                });
               // resolve(result);


            })

        }

        function downloadTransactionUserFields() {

            return new Promise(function (resolve, reject) {

                var result = [];

                // uiService.getTransactionFieldList({pageSize: 1000}).then(function (data) {
                uiService.getTransactionFieldPrimaryList({pageSize: 1000}).then(function (data) {

                    result = data.results;

                    transactionUserFieldsData = result;

                    resolve(result)

                });
                // resolve(result);

            })

        }



        function appendEntityAttribute(entityType, field) {

            if (entityAttributesData[entityType]) {
                entityAttributesData[entityType].push(field)
            } else {
                console.log('Cant append field')
            }

        }

        /**
         * Get list of entity attributes and all children attributes.
         * @param {string} rootContentType - content type (e.g. instruments.instrument).
         * @param {string} rootKey - key prefix for root level attributes.
         * @param {string} rootName - name prefix for root level attributes.
         * @param {object} options - all other options.
         * @return {Object[]} Array of Attributes.
         * @memberof module:attributeDataService
         */

        function getAllAttributesAsFlatList(rootContentType, rootKey, rootName, options) {

            var result = [];
            var defaultOptions = {
                maxDepth: 1
            };

            var _options = Object.assign({}, defaultOptions, options);

            var currentLevel = 0;

            _getAttributesRecursive(result, currentLevel, rootContentType, rootKey, rootName, _options);
            // console.log('currentLevel', currentLevel);
            // console.log('result', result);

            return result;

        }

        function _getAttributesRecursive(result, currentLevel, contentType, parentKey, parentName, options) {

            // console.log('contentType', contentType);

            var entityType = metaContentTypesService.findEntityByContentType(contentType);

            var attributes = getEntityAttributesByEntityType(entityType);

            var key;
            var name;
            var resultAttr;

            if (attributes) {

                attributes.forEach(function (attribute) {

                    name = parentName + '. ' + attribute.name;

                    if (parentKey) {
                        key = parentKey + '.' + attribute.key;
                    } else {
                        key = attribute.key;
                    }

                    if (attribute.value_type === 'field' && attribute.code === 'user_code') {

                        if (currentLevel < options.maxDepth) {

                            // console.log('attribute', attribute);

                            _getAttributesRecursive(result, currentLevel + 1, attribute.value_content_type, key, name, options)

                        }

                    } else {

                        if (attribute.value_type === 'field' && attribute.code === 'user_code') {

                            resultAttr = Object.assign({}, attribute);

                            resultAttr.content_type = contentType;
                            resultAttr.name = name + '. Name';
                            resultAttr.key = key + '.name';

                            result.push(resultAttr);

                        } else {

                            if (attribute.value_type !== 'mc_field') {

                                resultAttr = Object.assign({}, attribute);

                                resultAttr.content_type = contentType;
                                resultAttr.name = name;
                                resultAttr.key = key;

                                result.push(resultAttr);

                            }

                        }

                    }

                })

            } else {
                console.warn('Can\'t find attributes for content type: ' + contentType)
            }

        }

        /**
         * Get list of entity attribute types.
         * @param {object[]} attributes - source list of attribute types.
         * @param {string} contentType - content type
         * @param {string} rootKey - key prefix for root level attributes.
         * @param {string} rootName - name prefix for root level attributes.
         * @return {Object[]} Array of Attributes.
         * @memberof module:attributeDataService
         */

        function formatAttributeTypes(attributes, contentType, rootKey, rootName) {

            return attributes.map(function (attribute) {

                var result = {};

                result.attribute_type = Object.assign({}, attribute);
                result.value_type = attribute.value_type;
                result.content_type = contentType;
                result.key = rootKey + '.attributes.' + attribute.user_code;
                result.name = rootName + '. ' + attribute.name;

                return result

            })

        }

        function setReconciliationAttributes (attributesList) {
            reconciliationAttributes = attributesList;
        }

        function getReconciliationAttributes () {
            return reconciliationAttributes;
        }

        function setAttributesAvailableForColumns (attributesList) {
            attributesAvailableForColumns = attributesList;
        }

        function getAttributesAvailableForColumns () {
            return attributesAvailableForColumns;
        }

        return {

            // Remember! Download Custom Fields and Dynamic Attributes and User Fields before .get() them

            downloadAllAttributesByEntityType: downloadAllAttributesByEntityType,

            downloadCustomFieldsByEntityType: downloadCustomFieldsByEntityType,
            downloadDynamicAttributesByEntityType: downloadDynamicAttributesByEntityType,

            downloadInstrumentUserFields: downloadInstrumentUserFields,
            downloadTransactionUserFields: downloadTransactionUserFields,
            downloadComplexTransactionUserFields: downloadComplexTransactionUserFields,

            // Get method belows

            getAllAttributesByEntityType: getAllAttributesByEntityType,
            getForAttributesSelector: getForAttributesSelector,


            getInstrumentUserFields: getInstrumentUserFields,
            getTransactionUserFields: getTransactionUserFields,

            getBalanceReportAttributes: _getBalanceReportAttributes,
            getPlReportAttributes: _getPlReportAttributes,
            getTransactionReportAttributes: _getTransactionReportAttributes,

            getEntityAttributesByEntityType: getEntityAttributesByEntityType,
            getCustomFieldsByEntityType: getCustomFieldsByEntityType,
            getDynamicAttributesByEntityType: getDynamicAttributesByEntityType,

            getAllAttributesAsFlatList: getAllAttributesAsFlatList,

            setReconciliationAttributes: setReconciliationAttributes,
            getReconciliationAttributes: getReconciliationAttributes,

            setAttributesAvailableForColumns: setAttributesAvailableForColumns,
            getAttributesAvailableForColumns: getAttributesAvailableForColumns,

            // Append methods

            appendEntityAttribute: appendEntityAttribute,


            // Format Methods

            formatAttributeTypes: formatAttributeTypes

        }

    }

}());