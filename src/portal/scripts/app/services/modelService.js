/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    "use strict";


    var getAttributesByEntityType = function (entityType) {

        var models = {
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

        return models[entityType];
    };

    var getAttributesByContentType = function (contentType) {

        var models = {
            "portfolios.portfolio": require('../models/portfolioPropsModel').getAttributes(),
            "audit.transactionaudit": require('../models/auditTransactionPropsModel').getAttributes(),
            "audit.instrumentaudit": require('../models/auditInstrumentPropsModel').getAttributes(),
            "accounts.account": require('../models/accountPropsModel').getAttributes(),
            "tags.tag": require('../models/tagPropsModel').getAttributes(),
            "accounts.accounttype": require('../models/accountTypePropsModel').getAttributes(),
            "counterparties.counterparty": require('../models/counterpartyPropsModel').getAttributes(),
            "counterparties.counterpartygroup": require('../models/counterpartyGroupPropsModel').getAttributes(),
            "counterparties.responsible": require('../models/responsiblePropsModel').getAttributes(),
            "counterparties.responsiblegroup": require('../models/responsibleGroupPropsModel').getAttributes(),
            "instruments.pricingpolicy": require('../models/pricingPolicyPropsModel').getAttributes(),
            "instruments.instrumenttype": require('../models/instrumentTypePropsModel').getAttributes(),
            "instruments.instrument": require('../models/instrumentPropsModel').getAttributes(),
            "transactions.transaction": require('../models/transactionPropsModel').getAttributes(),
            "transactions.transactiontypegroup": require('../models/transactionTypeGroupPropsModel').getAttributes(),
            "transactions.transactiontype": require('../models/transactionTypePropsModel').getAttributes(),
            "transactions.complextransaction": require('../models/complexTransactionPropsModel').getAttributes(),
            "currencies.currency": require('../models/currencyPropsModel').getAttributes(),
            "currencies.currencyhistory": require('../models/currencyHistoryPropsModel').getAttributes(),
            "instruments.pricehistory": require('../models/priceHistoryPropsModel').getAttributes(),
            "strategies.strategy1": require('../models/strategy1PropsModel').getAttributes(),
            "strategies.strategy2": require('../models/strategy2PropsModel').getAttributes(),
            "strategies.strategy3": require('../models/strategy3PropsModel').getAttributes(),
            "strategies.strategy1subgroup": require('../models/strategy1subgroupPropsModel').getAttributes(),
            "strategies.strategy2subgroup": require('../models/strategy2subgroupPropsModel').getAttributes(),
            "strategies.strategy3subgroup": require('../models/strategy3subgroupPropsModel').getAttributes(),
            "strategies.strategy1group": require('../models/strategy1groupPropsModel').getAttributes(),
            "strategies.strategy2group": require('../models/strategy2groupPropsModel').getAttributes(),
            "strategies.strategy3group": require('../models/strategy3groupPropsModel').getAttributes(),
            "reports.balancereport": require('../models/balanceReportPropsModel').getAttributes(),
            "reports.balancereportperfomance": require('../models/reportAddonPerformancePropsModel').getAttributes(),
            "reports.balancereportmismatch":  require('../models/reportMismatchPropsModel').getAttributes(),
            "reports.plreport": require('../models/pnlReportPropsModel').getAttributes(),
            'reports.plreportperfomance': require('../models/reportAddonPerformancePnlPropsModel').getAttributes(),
            'reports.plreportmismatch': require('../models/reportMismatchPnlPropsModel').getAttributes(),
            "reports.transactionreport": require('../models/transactionReportPropsModel').getAttributes(),
            "reports.cashflowreport": require('../models/cashFlowProjectionReportPropsModel').getAttributes(),
            "reports.performancereport": require('../models/performanceReportPropsModel').getAttributes()

        };

        return models[contentType];
    };


    module.exports = {
        getAttributesByEntityType: getAttributesByEntityType,
        getAttributesByContentType: getAttributesByContentType
    }


}());