(function () {

    var filterService = require('./filter.service');
    var sortService = require('./sort.service');

    function groupAlreadyExist(resultGroup, result) {

        var exist = false;

        result.forEach(function (item) {

            if (item.___group_id === resultGroup.___group_id) {
                exist = true;
            }

        });


        return exist;
    }

    var getUniqueGroups = function (items, group, groupType) {

        var result = [];

        var resultGroup;

        console.log('groupType', groupType);
        console.log('items', items);

        items.forEach(function (item) {

            resultGroup = {
                ___group_name: null,
                ___group_id: null
            };

            if (groupType.hasOwnProperty('id')) {

                if (item.hasOwnProperty(groupType.entity + '_object')) {

                    item[groupType.entity + '_object'].attributes.forEach(function (attr) {

                        if (attr.attribute_type === group) {

                            if (groupType.value_type === 20 && attr.value_float) {

                                resultGroup.___group_id = attr.value_float.toString();
                                resultGroup.___group_name = attr.value_float.toString();

                            }

                            if (groupType.value_type === 10 && attr.value_string) {

                                resultGroup.___group_id = attr.value_string;
                                resultGroup.___group_name = attr.value_string;

                            }

                            if (groupType.value_type === 30 && attr.classifier_object) {

                                resultGroup.___group_id = attr.classifier_object.name;
                                resultGroup.___group_name = attr.classifier_object.name;
                            }

                            if (groupType.value_type === 40 && attr.value_date) {

                                resultGroup.___group_id = attr.value_date;
                                resultGroup.___group_name = attr.value_date;

                            }

                        }

                    })

                }

            } else {

                if (groupType.value_type === 'field') {
                    // resultGroup.___group_id = item[group] ;

                    if (item[group + '_object']) {
                        resultGroup.___group_id = item[group + '_object'].user_code;
                        resultGroup.___group_name = item[group + '_object'].name;
                    } else {
                        // TODO Remove later
                        resultGroup.___group_id = item[group];
                        resultGroup.___name = item[group];
                    }

                } else {

                    if (item.hasOwnProperty(group) &&
                        item[group] !== null &&
                        item[group] !== undefined &&
                        item[group] !== '-') {

                        resultGroup.___group_id = item[group].toString();
                        resultGroup.___group_name = item[group].toString();

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

            console.log('getUniqueGroups groups', groups);

            if (options.groups_order === 'desc') {
                groups = sortService.sortItems(groups, '-___group_name');
            } else {
                groups = sortService.sortItems(groups, '___group_name');
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