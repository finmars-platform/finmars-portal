(function () {

    var stringHelper = require('./stringHelper');
    var utilsHelper = require('./utils.helper');
    var metaService = require('../services/metaService');

    var isDataLoading = function (evDataService) {

        var result = false;

        var requestParameters = evDataService.getRequestParametersAsList();

        requestParameters.forEach(function (item) {

            if (item.status === 'loading') {
                result = true;
            }

        });

        return result;

    };

    module.exports = {

        isDataLoading: isDataLoading
    }


}());