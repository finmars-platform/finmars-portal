(function () {

    var filterService = require('./filter.service');

    var sortItems = function () {

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

            var items = JSON.parse(JSON.stringify(reportOptions.items));

            items = filterService.filterByRegularFilters(items, regularFilters);

            console.log('rv-data-provider-objects-service.getList.items.length after regular filters', items.length);

            items = filterService.filterByGroupsFilters(items, options);

            console.log('rv-data-provider-objects-service.getList.items.length after groups filters', items.length);

            result.count = items.length;
            result.results = items;

            console.log('rv-data-provider-objects-service.getList', options);
            console.log('rv-data-provider-objects-service.getList', entityType);
            console.log('rv-data-provider-objects-service.getList.result', result);


            resolve(result)

        });

    };

    module.exports = {
        getList: getList
    }

}());