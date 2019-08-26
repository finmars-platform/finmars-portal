(function () {

    var getCellValueByKey = function (entityViewerDataService, key) {

        var data = entityViewerDataService.getUnfilteredFlatList();
        var result = [];

        data.forEach(function (item) {

            var cellValue = '';

            if (item.hasOwnProperty(key)) {

                var fieldObjKey = key + '_object';

                if (item.hasOwnProperty(fieldObjKey)) {

                    cellValue = item[fieldObjKey].name;

                    if (item[fieldObjKey].display_name) {

                        cellValue = item[fieldObjKey].display_name;

                    };

                } else {

                    cellValue = item[key];

                };

                if (result.indexOf(cellValue) === -1) {

                    result.push(cellValue);

                };

            };

        });

        return result;

    };

    module.exports = {
        getCellValueByKey: getCellValueByKey
    }

}());