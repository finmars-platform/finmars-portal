(function () {

    var filterService = require('./filter.service');
    var sortService = require('./sort.service');

    function groupAlreadyExist(resultGroup, result) {

        var exist = false;

        result.forEach(function (item) {

            if (item.___group_identifier === resultGroup.___group_identifier) {
                exist = true;
            }

        });


        return exist;
    }

    var getUniqueGroups = function (items, group) {

        var result = [];

        var resultGroup;

        // console.log('items', items);
        // console.log('group', group);

        items.forEach(function (item) {

            resultGroup = {
                ___group_name: null,
                ___group_identifier: null
            };

            if (group.hasOwnProperty('id')) {

                if (item.hasOwnProperty(group.entity + '_object')) {

                    item[group.entity + '_object'].attributes.forEach(function (attr) {

                        if (attr.attribute_type === group.id) {

                            if (group.value_type === 20 && attr.value_float) {

                                resultGroup.___group_identifier = attr.value_float.toString();
                                resultGroup.___group_name = attr.value_float.toString();

                            }

                            if (group.value_type === 10 && attr.value_string) {

                                resultGroup.___group_identifier = attr.value_string;
                                resultGroup.___group_name = attr.value_string;

                            }

                            if (group.value_type === 30 && attr.classifier_object) {

                                resultGroup.___group_identifier = attr.classifier_object.name;
                                resultGroup.___group_name = attr.classifier_object.name;
                            }

                            if (group.value_type === 40 && attr.value_date) {

                                resultGroup.___group_identifier = attr.value_date;
                                resultGroup.___group_name = attr.value_date;

                            }

                        }

                    })

                }

            } else {

                if (group.value_type === 'field') {
                    // resultGroup.___group_identifier = item[group] ;

                    if (item[group.key + '_object']) {
                        resultGroup.___group_identifier = item[group.key + '_object'].user_code;
                        resultGroup.___group_name = item[group.key + '_object'].short_name;
                    }

                } else {

                    var item_value = null;

                    if (['balance-report', 'pnl-report', 'report-mismatch', 'report-addon-performance-pnl', 'transaction-report'].indexOf(group.entity) !== -1) {
                        item_value = item[group.key];
                    } else {
                        if (item[group.entity + '_object']) {
                            item_value = item[group.entity + '_object'][group.key];
                        }
                    }

                    if (
                        item_value !== null &&
                        item_value !== undefined &&
                        item_value !== '-') {

                        resultGroup.___group_identifier = item_value.toString();
                        resultGroup.___group_name = item_value.toString();

                    }

                }
            }

            if (!groupAlreadyExist(resultGroup, result)) {

                result.push(resultGroup)
            }

        });

        return result;

    };

    var getList = function (entityType, options, entityViewerDataService) {

        return new Promise(function (resolve, reject) {

            var result = {
                next: null,
                previous: null,
                count: 0,
                results: []
            };

            var regularFilters = filterService.getRegularFilters(options);

            var reportOptions = entityViewerDataService.getReportOptions();

            var items = reportOptions.items.concat();

            var groupTypes = entityViewerDataService.getGroups();

            items = filterService.filterByRegularFilters(items, regularFilters);
            items = filterService.filterByGroupsFilters(items, options, groupTypes);

            var group = options.groups_types[options.groups_types.length - 1];

            var groups = getUniqueGroups(items, group);

            console.log('getUniqueGroups groups', groups);

            if (options.groups_order === 'desc') {
                groups = sortService.sortItems(groups, '-___group_name');
            } else {
                groups = sortService.sortItems(groups, '___group_name');
            }

            result.count = groups.length;
            result.results = groups;

            console.log('get groups', JSON.parse(JSON.stringify(result)));

            resolve(result)

        });

    };

    module.exports = {
        getList: getList
    }

}());