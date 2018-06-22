/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function () {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/groupTable/group-table-shell-view.html',
            scope: {
                items: '=',
                options: '=',
                reportOptions: '=',
                evDataService: '=',
                evEventService: '='
            },
            link: function (scope, elem, attrs) {

                scope.additions = scope.evDataService.getAdditions();
                scope.components = scope.evDataService.getComponents();
                scope.editorEntityId = scope.evDataService.getEditorEntityId();

                scope.findSelectedFeature = function () {
                    // var selected = {isOpened: false, templateUrl: ''};
                    // //console.log('additionsStatus', scope.additionsStatus);
                    // scope.options.additionsStatus.extraFeatures.forEach(function (item) {
                    //     if (item.isOpened == true) {
                    //         selected = item;
                    //     }
                    // });
                    //
                    // return selected;
                };

                if (scope.options && scope.options.isRootEntityViewer == true) {

                    scope.$watch('options.editorEntityId', function (event, data) {

                        scope.$broadcast('rootEditorEntityIdDown', {
                            editorEntityId: scope.options.editorEntityId,
                            entityType: scope.options.entityType
                        });
                    });
                }

                scope.checkAdditions = function () {
                    // if (scope.additions.additionsState == true && scope.options.isRootEntityViewer == true && scope.components.splitPanel == true) {
                    //     return true;
                    // }
                    // return false;

                    if (scope.additions && scope.additions.additionsState === true && scope.components && scope.components.splitPanel === true) {
                        return true;
                    }
                    return false;
                };

                scope.evEventService.addEventListener(evEvents.ADDITIONS_CHANGE, function () {

                    scope.additions = scope.evDataService.getAdditions();
                    scope.editorEntityId = scope.evDataService.getEditorEntityId();

                });

                scope.evEventService.addEventListener(evEvents.ADDITIONS_EDITOR_ENTITY_ID_CHANGE, function () {

                    scope.editorEntityId = scope.evDataService.getEditorEntityId();

                });


                scope.activateHeightSlider = function () {

                    scope.evEventService.dispatchEvent(evEvents.ADDITIONS_RENDER)

                }

            }
        }
    }

}());