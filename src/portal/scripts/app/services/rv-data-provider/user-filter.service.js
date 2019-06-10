(function () {

    var getDataByKey = function (entityViewerDataService, key) {

        var data = entityViewerDataService.getUnfilteredFlatList();
        var result = [];

        data.forEach(function (item) {

            if (item.hasOwnProperty(key)) {

                if (result.indexOf(item[key]) === -1) {

                    result.push(item[key]);

                }

            }

        });

        return result;

    };

    module.exports = {
        getDataByKey: getDataByKey
    }

}());