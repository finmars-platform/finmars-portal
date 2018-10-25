(function () {

    var filterService = require('./filter.service');
    var sortService = require('./sort.service');
    var metaHelper = require('../../helpers/meta.helper')

    var taskId = null;
    var items = [];

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

            if (taskId == null) {
                taskId = reportOptions.task_id;
                items = metaHelper.recursiveDeepCopy(reportOptions.items);
            }

            if(taskId !== reportOptions.task_id) {
                items = metaHelper.recursiveDeepCopy(reportOptions.items);
            }

            // items = metaHelper.recursiveDeepCopy(reportOptions.items);

            items = filterService.filterByRegularFilters(items, regularFilters);

            items = filterService.filterByGroupsFilters(items, options);

            if (options.ordering) {
                items = sortService.sortItems(items, options.ordering);
            }

            result.count = items.length;
            result.results = items;

            resolve(result)

        });

    };

    module.exports = {
        getList: getList
    }

}());