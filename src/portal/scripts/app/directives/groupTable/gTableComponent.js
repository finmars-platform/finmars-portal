/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function () {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/groupTable/group-table-shell-view.html',
            scope: {
                tabs: '=',
                entityType: '=',
                items: '=',
                filters: '=',
                columns: '=',
                columnsWidth: '=',
                grouping: '=',
                folding: '=',
                sorting: '=',

                itemAdditionsEditorEntityId: '=',
                itemAdditionsEditorTemplate: '=',

                itemAdditions: '=',
                itemAdditionsColumns: '=',
                itemAdditionsFilters: '=',
                itemAdditionsSorting: '=',

                externalGetAdditions: '&',
                externalCallback: '&',
                externalAdditionsCallback: '&',
                externalUpdateItem: '&',
                externalUpdateItemAdditions: '&',

                additionsStatus: '=',
                additionsState: '='
            },
            link: function (scope, elem, attrs) {

                logService.component('groupTable', 'initialized');

                scope.findSelectedFeature = function () {
                    var selected = {isOpened: false, templateUrl: ''};
                    //console.log('additionsStatus', scope.additionsStatus);
                    scope.additionsStatus.extraFeatures.forEach(function (item) {
                        if (item.isOpened == true) {
                            selected = item;
                        }
                    });
                    //console.log(selected);

                    return selected;
                }

            }
        }
    }

}());