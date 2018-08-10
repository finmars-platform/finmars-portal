(function () {

    var filterService = require('./filter.service');

    var sortService = require('./sort.service');

    function keyIsEntityField(key) {

        return ['type', 'instrument_type', 'currency', 'instrument_object_instrument_type', 'account_object_type', 'group'].indexOf(key) !== -1

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

    var getUniqueGroups = function (items, group) {

        // console.log('resultStrings.group', group);

        var result = [];

        var resultGroup;

        items.forEach(function (item) {

            resultGroup = {
                group_name: null
            };

            if (keyIsEntityField(group)) {
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

            if (!groupAlreadyExist(resultGroup, result)) {

                result.push(resultGroup)
            }

        });

        // console.log('getUniqueGroups.result', result);

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

            items = filterService.filterByRegularFilters(items, regularFilters);
            items = filterService.filterByGroupsFilters(items, options);

            var group = options.groups_types[options.groups_types.length - 1];

            var groups = getUniqueGroups(items, group);

            if (options.groups_order === 'desc') {
                groups = sortService.sortItems(groups, '-group_name');
            } else {
                groups = sortService.sortItems(groups, 'group_name');
            }

            result.count = groups.length;
            result.results = groups;

            // console.log('rv-data-provider-groups-service.getList.options', options);
            // console.log('rv-data-provider-groups-service.getList.entityType', entityType);
            // console.log('rv-data-provider-groups-service.getList.result', result);

            resolve(result)

        });

    };

    module.exports = {
        getList: getList
    }


}());