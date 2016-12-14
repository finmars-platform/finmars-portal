/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var attributeTypeService = require('../attributeTypeService');

    var getDynamicAttributes = function (items, filters) {
        console.log();
        var promises = [];
        var attr = [];
        var reportAttrs = [];

        promises.push(attributeTypeService.getList('portfolio'));
        promises.push(attributeTypeService.getList('account'));
        promises.push(attributeTypeService.getList('instrument'));
        promises.push(attributeTypeService.getList('currency'));

        return Promise.all(promises).then(function (data) {

            console.log('attributes in report', data);
            data.forEach(function (reportAttrsList, index) {

                var reportAttrsResults = reportAttrsList.results.map(function (item) {

                    if (index == 0) {
                        item.r_entityType = 'portfolio';
                        item.source_name = item.name;
                        item.name = 'Portfolio: ' + item.name;
                    }
                    if (index == 1) {
                        item.r_entityType = 'account';
                        item.source_name = item.name;
                        item.name = 'Account: ' + item.name;
                    }
                    if (index == 2) {
                        item.r_entityType = 'instrument';
                        item.source_name = item.name;
                        item.name = 'Instrument: ' + item.name;
                    }
                    if (index == 3) {
                        item.r_entityType = 'currency';
                        item.source_name = item.name;
                        item.name = 'Currency: ' + item.name;
                    }


                    return item;
                });
                reportAttrs = reportAttrs.concat(reportAttrsResults);

            });
            return reportAttrs;
        });
    };

    module.exports = {
        getDynamicAttributes: getDynamicAttributes
    }

}());