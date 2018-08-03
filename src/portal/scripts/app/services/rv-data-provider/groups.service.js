(function () {

    var filterService = require('./filter.service');

    var getUniqueGroups = function (items, group) {

        console.log('resultStrings.group', group);

        var resultStrings = [];
        var result = [];

        items.forEach(function (item) {

            if (resultStrings.indexOf(item[group]) === -1) {
                resultStrings.push(item[group].toString());
            }

        });

        resultStrings.forEach(function (item) {

            result.push({
                group_name: item
            })

        });

        console.log('getUniqueGroups.result', result);

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

            result.count = groups.length;
            result.results = groups;

            console.log('rv-data-provider-groups-service.getList.options', options);
            console.log('rv-data-provider-groups-service.getList.entityType', entityType);
            console.log('rv-data-provider-groups-service.getList.result', result);

            resolve(result)

        });

    };

    module.exports = {
        getList: getList
    }


}());