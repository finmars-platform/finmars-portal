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

            resolve(result)

        });

    };

    module.exports = {
        getList: getList
    }


}());