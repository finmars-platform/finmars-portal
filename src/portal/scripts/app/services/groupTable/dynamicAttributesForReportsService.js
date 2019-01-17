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
        var reportAttrs = {};

        promises.push(attributeTypeService.getList('portfolio'));
        promises.push(attributeTypeService.getList('account'));
        promises.push(attributeTypeService.getList('instrument'));
        promises.push(attributeTypeService.getList('currency'));

        return Promise.all(promises).then(function (data) {

            console.log('attributes in report', data);

            reportAttrs['portfolio'] = data[0].results.map(function(item){
                item.source_name = item.name;
                item.entity = 'portfolio';
                item.name = 'Portfolio.' + item.name;
                return item;
            });

            reportAttrs['account'] = data[1].results.map(function(item){
                item.source_name = item.name;
                item.entity = 'account';
                item.name = 'Account.' + item.name;
                return item;
            });

            reportAttrs['instrument'] = data[2].results.map(function(item){
                item.source_name = item.name;
                item.entity = 'instrument';
                item.name = 'Instrument.' + item.name;
                return item;
            });

            return reportAttrs;
        });
    };

    module.exports = {
        getDynamicAttributes: getDynamicAttributes
    }

}());