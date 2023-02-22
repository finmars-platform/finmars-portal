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
            var globalTableSearch = entityViewerDataService.getGlobalTableSearch();

            if (reportOptions.hasOwnProperty("items") && reportOptions.items.length > 0) {

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

                // console.log('globalTableSearch', globalTableSearch);

                items = filterService.filterTableRows(items, regularFilters, entityType);

                items = filterService.filterByGroupsFilters(items, options, groupTypes);

                if (globalTableSearch) {
                    items = filterService.filterByGlobalTableSearch(items, globalTableSearch)
                }

                // Victor 2021.02.08 filter by rows colors removed to rv-data.helper.js and filter flatList
                /*                const rowTypeFilters = entityViewerDataService.getRowTypeFilters();

                                if (rowTypeFilters) {

                                    items = filterService.filterByRowType(items, rowTypeFilters.markedRowFilters);

                                }*/

                // console.log('groups filters length', items.length);

                // console.log('objectService.getList.options', options);

                var activeColumnSort = entityViewerDataService.getActiveColumnSort();
                var sortProp = activeColumnSort.options.sort === 'DESC' ? '-' + options.ordering : options.ordering;

                if (options.ordering_mode === 'manual') {

                    var key;

                    if (sortProp[0] === '-') {
                        key = sortProp.split('-')[1];
                    } else {
                        key = sortProp;
                    }

                    var columnSortData = entityViewerDataService.getColumnSortData(key)

                    if (columnSortData) {

                        items = sortService.sortItemsManual(items, sortProp, columnSortData);

                    }

                } else {

                    if (sortProp) {
                        items = sortService.sortItems(items, sortProp);
                    }
                }

                // console.log('sorted items, ', items);

                result.count = items.length;
                result.results = items;
            } else {
                result.count = 0;
                result.results = [];
            }

            // console.log('objectService.getList.result', result)

            resolve(result);

        });

    };

    module.exports = {
        getList: getList
    }

}());
