(function () {

    var stringHelper = require('./stringHelper');
    var utilsHelper = require('./utils.helper');
    var evRvCommonHelper = require('./ev-rv-common.helper');
    var metaService = require('../services/metaService');
    var rvSubtotalHelper = require('./rv-subtotal.service');

    var getGroupsByParent = function (parentId, evDataService) {

        var items = evDataService.getDataAsList();

        return items.filter(function (item) {
            return item.___parentId === parentId;
        })

    };

    var calculateItemSubtotal = function (item, evDataService) {

        var columns = evDataService.getColumns();
        var groups = evDataService.getGroups();
        var level = groups.length;

        if (item.___level === level) {

            item.subtotal = rvSubtotalHelper.calculate(item.results, columns);

            console.log('calculateItemSubtotal.item', item);

            evDataService.setData(item);

        } else {

            var items = [];

            var childGroups = getGroupsByParent(item.___id, evDataService);

            childGroups.forEach(function (item) {

                items.push(item.subtotal)

            });

            item.subtotal = rvSubtotalHelper.calculate(items, columns);

            evDataService.setData(item);

        }

    };

    var calculateSubtotals = function (evDataService) {

        var dataList = evDataService.getDataAsList();

        var groups = evDataService.getGroups();
        var level = groups.length;

        // console.log('calculateSubtotals.level', level);

        for (var i = level; i >= 0; i = i - 1) {

            // console.log('calculateSubtotals.current_level', i);

            dataList.forEach(function (item) {

                if (item.___level === i) {
                    calculateItemSubtotal(item, evDataService);
                }

            });

        }

    };

    var insertSubtotalsToResults = function (data, evDataService) {

        var dataList = [];
        var groups = evDataService.getGroups();

        Object.keys(data).forEach(function (key) {
            dataList.push(data[key])
        });


        var subtotalObj;

        dataList.forEach(function (item) {

            groups.forEach(function (group, index) {

                if (item.___level === index + 1 && item.___level <= groups.length) {

                    subtotalObj = Object.assign({}, item.subtotal, {
                        ___type: 'subtotal',
                        ___parentId: item.___id,
                        ___level: item.___level + 1
                    });

                    subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);

                    if (group.report_settings.subtotal_type === 'line') {

                        subtotalObj.___subtotal_type = 'line';

                        item.results.unshift(subtotalObj);

                    }

                    if (group.report_settings.subtotal_type === 'area') {

                        subtotalObj.___subtotal_type = 'area';

                        item.results.push(subtotalObj);

                    }

                }

            })

        });

        console.log('insertSubtotalsToResults.data', data);

        return data;

    };

    var getFlatStructure = function (evDataService) {

        var groups = evDataService.getGroups();

        var data = JSON.parse(JSON.stringify(evDataService.getData()));

        console.log('getFLatStructure.groups', groups);

        if (groups.length) {
            calculateSubtotals(evDataService);
            data = insertSubtotalsToResults(data, evDataService);
        }


        var rootGroup = JSON.parse(JSON.stringify(evDataService.getRootGroupData()));

        var tree = utilsHelper.convertToTree(data, rootGroup);

        console.log('getFlatStructure.tree', tree);

        var list = utilsHelper.convertTreeToList(tree);

        console.log('getFlatStructure.list', list);

        return list;

    };

    module.exports = {
        getFlatStructure: getFlatStructure
    }


}());