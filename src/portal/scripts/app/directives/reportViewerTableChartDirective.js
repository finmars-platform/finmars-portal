(function () {

    'use strict';

    var rvDataHelper = require('../helpers/rv-data.helper');
    var renderHelper = require('../helpers/render.helper');

    var reportViewerMatrixHelper = require('../helpers/report-viewer-matrix.helper');

    var evEvents = require('../services/entityViewerEvents');

    module.exports = function ($mdDialog) {
        return {
            restriction: 'E',
            scope: {
                tableChartSettings: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/report-viewer-table-chart-view.html',
            link: function (scope, elem, attr) {

                scope.activeItem = null;

                // console.log('Report Viewer Matrix Component', scope);

                scope.processing = true;

                scope.viewContext = scope.evDataService.getViewContext();

                scope.init = function () {

                    scope.evDataService.setActiveObject({});

                    // If we already have data (e.g. viewType changed) start
                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);

                    console.log('flatList', flatList);

                    if (flatList.length > 1) {

                        scope.processing = false;

                        // scope.createMatrix();

                        /*setTimeout(function () {

                            scope.$apply();

                            initMatrixMethods();
                        }, 0)*/
                    }

                    // If we already have data (e.g. viewType changed) end

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        scope.processing = false;

                        // scope.createMatrix();

                    });

                };

                scope.init();

                scope.$on('$destroy', function () {

                    // window.removeEventListener('resize', scope.alignGrid);
                    //
                    // scope.evEventService.removeEventListener(evEvents.CLEAR_USE_FROM_ABOVE_FILTERS, clearUseFromAboveFilterId);

                });

            }
        }
    }

}());