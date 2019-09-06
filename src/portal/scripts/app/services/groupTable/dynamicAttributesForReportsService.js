/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var attributeTypeService = require('../attributeTypeService');

    var getDynamicAttributes = function (items, filters) {
        console.log();
        var promises = [];
        var reportAttrs = {};

        promises.push(attributeTypeService.getList('portfolio'));
        promises.push(attributeTypeService.getList('account'));
        promises.push(attributeTypeService.getList('instrument'));
        promises.push(attributeTypeService.getList('currency'));
        promises.push(attributeTypeService.getList('responsible'));
        promises.push(attributeTypeService.getList('counterparty'));
        promises.push(attributeTypeService.getList('complex-transaction'));
        promises.push(attributeTypeService.getList('transaction-type'));

        return Promise.all(promises).then(function (data) {

            reportAttrs['portfolios.portfolio'] = data[0].results;
            reportAttrs['accounts.account'] = data[1].results;
            reportAttrs['instruments.instrument'] = data[2].results;
            reportAttrs['currencies.currency'] = data[3].results;
            reportAttrs['counterparties.responsible'] = data[4].results;
            reportAttrs['counterparties.counterparty'] = data[5].results;
            reportAttrs['transactions.complextransaction'] = data[6].results;
            reportAttrs['transactions.transactiontype'] = data[7].results;

            return reportAttrs;

        });
    };

    module.exports = {
        getDynamicAttributes: getDynamicAttributes
    }

}());