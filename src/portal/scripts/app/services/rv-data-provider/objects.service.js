(function () {

    var getList = function (entityType, options, entityViewerDataService) {

        return new Promise(function (resolve, reject) {

            var result = {
                status: '200',
                next: null,
                previous: null,
                count: 0,
                results: []
            };

            var reportOptions = entityViewerDataService.getReportOptions();


            if (options.groups_types.length) {

            } else {
                result.count = reportOptions.items.length;
                result.results = reportOptions.items;
            }

            console.log('rv-data-provider-objects-service.getList', entityViewerDataService);
            console.log('rv-data-provider-objects-service.getList', options);
            console.log('rv-data-provider-objects-service.getList', entityType);

            resolve(result)

        });

    };

    module.exports = {
        getList: getList
    }

}());