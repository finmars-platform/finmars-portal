(function () {

    var filterService = require('./filter.service');
    var sortService = require('./sort.service');
    var metaHelper = require('../../helpers/meta.helper')

    var reportRecievedAt = null;
    var items = [];
    var itemsCache = [];

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

            if (reportRecievedAt == null) {
                reportRecievedAt = reportOptions.recieved_at;
                itemsCache = metaHelper.recursiveDeepCopy(reportOptions.items);
            }

            if (reportRecievedAt !== reportOptions.recieved_at) {
                reportRecievedAt = reportOptions.recieved_at;
                itemsCache = metaHelper.recursiveDeepCopy(reportOptions.items);
            }


            items = itemsCache.map(function (item) {
                return item
            });

            var groupTypes = entityViewerDataService.getGroups();

            items = filterService.filterByRegularFilters(items, regularFilters);

            console.log('regular filters length', items.length);

            items = filterService.filterByGroupsFilters(items, options, groupTypes);

            console.log('groups filters length', items.length);

            if (options.ordering) {
                items = sortService.sortItems(items, options.ordering);
            }

            // console.log('sorted items, ', items);

            result.count = items.length;
            result.results = items;

            resolve(result)

        });

    };

    module.exports = {
        getList: getList
    }

}());