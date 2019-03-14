(function () {

    var filterService = require('./filter.service');

    var sortService = require('./sort.service');

    function keyIsEntityField(key) {

        return ['type',
            'instrument_type',
            'transaction_type',
            'currency',
            'pricing_currency',
            'instrument_object_instrument_type',
            'account_object_type',
            'instrument_object_accrued_currency',

            'group'].indexOf(key) !== -1

    }

    function groupAlreadyExist(resultGroup, result) {

        var exist = false;

        result.forEach(function (item) {

            if (item.hasOwnProperty('group_id') && resultGroup.hasOwnProperty('group_id')) {

                if (item.group_id === resultGroup.group_id) {
                    exist = true;
                }

            } else {

                if (item.group_name === resultGroup.group_name) {
                    exist = true;
                }

            }

        });


        return exist;
    }

    var getUniqueGroups = function (items, group, groupType) {

        var result = [];

        var resultGroup;

        items.forEach(function (item) {

            resultGroup = {
                group_name: null
            };

            if (groupType.hasOwnProperty('id')) {

                if (item.hasOwnProperty(groupType.entity + '_object')) {

                    item[groupType.entity + '_object'].attributes.forEach(function (attr) {

                        if (attr.attribute_type === group) {

                            if (groupType.value_type === 20 && attr.value_float) {

                                resultGroup.group_name = attr.value_float.toString();

                            }

                            if (groupType.value_type === 10 && attr.value_string) {

                                resultGroup.group_name = attr.value_string;

                            }

                            if (groupType.value_type === 30 && attr.classifier_object) {

                                resultGroup.group_name = attr.classifier_object.name;
                            }

                            if (groupType.value_type === 40 && attr.value_date) {

                                resultGroup.group_name = attr.value_date;

                            }

                        }

                    })

                }

            } else {

                console.log('group', groupType);
                console.log('group', group);
                console.log('item', item);

                if (groupType.value_type === 'field') {
                    resultGroup.group_id = item[group];
                    resultGroup.group_name = item[group + '_object_user_code'];
                } else {

                    if (item.hasOwnProperty(group) &&
                        item[group] !== null &&
                        item[group] !== undefined &&
                        item[group] !== '-') {

                        resultGroup.group_name = item[group].toString();

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

            var groupingAreaGroups = entityViewerDataService.getGroups();

            var groupType = groupingAreaGroups[options.groups_types.length - 1];

            var group = options.groups_types[options.groups_types.length - 1];

            var groups = getUniqueGroups(items, group, groupType);

            if (options.groups_order === 'desc') {
                groups = sortService.sortItems(groups, '-group_name');
            } else {
                groups = sortService.sortItems(groups, 'group_name');
            }

            result.count = groups.length;
            result.results = groups;

            resolve(result)

        });

    };

    module.exports = {
        getList: getList
    }


}());