/**
 * Created by szhitenev on 24.09.2019.
 */

(function () {

    'use strict';

    var metaContentTypesService = require('./metaContentTypesService');

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

            var contentType = metaContentTypesService.findContentTypeByEntity(entityType);

            if (reportsEntityTypes.indexOf(entityType) === -1) {

                var entityAttributes = getEntityAttributesByEntityType(entityType);
                var dynamicAttributes = getDynamicAttributesByEntityType(entityType);

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



            }

            return result;
        }

        function downloadAllAttributesByEntityType(entityType) {

            return new Promise(function (resolve, reject) {

                var result = [];

                resolve(result);

            })

        }

        function downloadCustomFieldsByEntityType(entityType) {

            return new Promise(function (resolve, reject) {

                var result = [];

                resolve(result)

            })

        }

        function downloadDynamicAttributesByEntityType(entityType) {
            return new Promise(function (resolve, reject) {

                var result = [];

                resolve(result)
            })
        }

        return {

            // Remember! Download Custom Fields and Dynamic Attributes before .get() them

            downloadAllAttributesByEntityType: downloadAllAttributesByEntityType,

            downloadCustomFieldsByEntityType: downloadCustomFieldsByEntityType,
            downloadDynamicAttributesByEntityType: downloadDynamicAttributesByEntityType,

            // Get method belows

            getAllAttributesByEntityType: getAllAttributesByEntityType,

            getEntityAttributesByEntityType: getEntityAttributesByEntityType,
            getCustomFieldsByEntityType: getCustomFieldsByEntityType,
            getDynamicAttributesByEntityType: getDynamicAttributesByEntityType



        }

    }

}());