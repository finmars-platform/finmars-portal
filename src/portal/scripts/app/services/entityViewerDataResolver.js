/**
 * Created by szhitenev on 21.12.2016.
 */
(function () {

    var portfolioService = require('./portfolioService');
    var accountService = require('./accountService');
    var accountTypeService = require('./accountTypeService');
    var responsibleService = require('./responsibleService');
    var responsibleGroupService = require('./responsibleGroupService');
    var counterpartyService = require('./counterpartyService');
    var counterpartyGroupService = require('./counterpartyGroupService');
    var instrumentService = require('./instrumentService');
    var currencyService = require('./currencyService');
    var priceHistoryService = require('./priceHistoryService');
    var currencyHistoryService = require('./currencyHistoryService');
    var transactionService = require('./transactionService');
    var transactionTypeService = require('./transactionTypeService');
    var transactionClassService = require('./transaction/transactionClassService');
    var transactionTypeGroupService = require('./transaction/transactionTypeGroupService');
    var complexTransactionService = require('./transaction/complexTransactionService');

    var pricingPolicyService = require('./pricingPolicyService');
    var instrumentTypeService = require('./instrumentTypeService');
    var accrualCalculationModelService = require('./accrualCalculationModelService');
    var instrumentPeriodicityService = require('./instrumentPeriodicityService');
    var tagService = require('./tagService');

    var strategyService = require('./strategyService');
    var strategyGroupService = require('./strategyGroupService');
    var strategySubgroupService = require('./strategySubgroupService');
    var auditService = require('./auditService');
    var reportService = require('./reportService');


    var getList = function (entityType, options) {

        //console.log('entityType', entityType);

        switch (entityType) {
            case 'account':
                return accountService.getList(options);
                break;
            case 'account-type':
                return accountTypeService.getList(options);
                break;
            case 'counterparty':
                return counterpartyService.getList(options);
                break;
            case 'counterparty-group':
                return counterpartyGroupService.getList(options);
                break;
            case 'currency':
                return currencyService.getList(options);
                break;
            case 'currency-history':
                return currencyHistoryService.getList(options);
                break;
            case 'instrument':
                return instrumentService.getList(options);
                break;
            case 'instrument-type':
                return instrumentTypeService.getList(options);
                break;
            case 'portfolio':
                return portfolioService.getList(options);
                break;
            case 'price-history':
                return priceHistoryService.getList(options);
                break;
            case 'pricing-policy':
                return pricingPolicyService.getList(options);
                break;
            case 'responsible':
                return responsibleService.getList(options);
                break;
            case 'responsible-group':
                return responsibleGroupService.getList(options);
                break;
            case 'strategy-1':
                return strategyService.getList(1, options);
                break;
            case 'strategy-2':
                return strategyService.getList(2, options);
                break;
            case 'strategy-3':
                return strategyService.getList(3, options);
                break;
            case 'strategy-1-group':
                return strategyGroupService.getList(1, options);
                break;
            case 'strategy-2-group':
                return strategyGroupService.getList(2, options);
                break;
            case 'strategy-3-group':
                return strategyGroupService.getList(3, options);
                break;
            case 'strategy-1-subgroup':
                return strategySubgroupService.getList(1, options);
                break;
            case 'strategy-2-subgroup':
                return strategySubgroupService.getList(2, options);
                break;
            case 'strategy-3-subgroup':
                return strategySubgroupService.getList(3, options);
                break;
            case 'tag':
                return tagService.getList(options);
                break;
            case 'audit-transaction':
                return auditService.getList(options);
                break;
            case 'audit-instrument':
                return auditService.getList(options);
                break;
            case 'transaction':
                return transactionService.getList(options);
                break;
            case 'complex-transaction':
                return complexTransactionService.getList(options);
                break;
            case 'transaction-type':
                return transactionTypeService.getList(options);
                break;
            case 'transaction-type-group':
                return transactionTypeGroupService.getList(options);
                break;

            case 'balance-report':
                return reportService.getList(options);
                break;
            case 'pnl-report':
                return reportService.getList(options);
                break;


        }
    };

    module.exports = {
        getList: getList
    }

}());