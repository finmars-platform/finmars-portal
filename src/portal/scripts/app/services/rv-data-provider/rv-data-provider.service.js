(function () {

    var evEvents = require('../entityViewerEvents');
    var groupsService = require('../ev-data-provider/groups.service');
    var objectsService = require('../ev-data-provider/objects.service');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var entityViewerDataResolver = require('../entityViewerDataResolver');
    var stringHelper = require('../../helpers/stringHelper');
    var queryParamsHelper = require('../../helpers/queryParamsHelper');

    var requestData = function () {


        return new Promise(function (resolve, reject) {

            entityViewerDataResolver.getList(vm.entityType, reportOptions).then(function (data) {

                var reportOptions = entityViewerDataService.getReportOptions();

                reportOptions = Object.assign({}, reportOptions, data);

                entityViewerDataService.setReportOptions(reportOptions);

                if (!data.hasOwnProperty('non_field_errors')) {

                    if (data.task_status !== 'SUCCESS') {

                        setTimeout(function () {
                            resolve(requestData());
                        }, 1000)

                    } else {

                        resolve(data);

                    }
                }

            });
        });


    };

    var requestReport = function (entityViewerDataService, entityViewerEventService) {

        console.log('requestReport started');

        requestData().then(function (data) {

            var reportOptions = entityViewerDataService.getReportOptions();

            reportOptions = Object.assign({}, reportOptions, {task_id: null});

            entityViewerDataService.setReportOptions(reportOptions);

            entityViewerDataService.setStatusData('loaded');
            entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

            console.log('requestReport finished');

        });

    };

    var updateDataStructure = function (entityViewerDataService, entityViewerEventService) {

    };

    var sortObjects = function (entityViewerDataService, entityViewerEventService) {

    };

    var sortGroupType = function (entityViewerDataService, entityViewerEventService) {

    };

    module.exports = {
        requestReport: requestReport,
        updateDataStructure: updateDataStructure,
        sortObjects: sortObjects,
        sortGroupType: sortGroupType
    }

}());