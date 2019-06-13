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
                evDataService: '=',
                evEventService: '='
            },
            link: function (scope, elem, attrs) {

                scope.additions = scope.evDataService.getAdditions();
                scope.components = scope.evDataService.getComponents();
                scope.entityType = scope.evDataService.getEntityType();
                scope.activebject = scope.evDataService.getActiveObject();

                scope.splitPanelIsActive = scope.evDataService.isSplitPanelActive();
                var isNotSplitPanel = !scope.evDataService.isRootEntityViewer();

                scope.contentWrapElem = elem[0].querySelector('.g-content-wrap');

                if (isNotSplitPanel) { // if this component inside split panel, set .g-content-wrap height
                    var splitPanelHeight = elem.parents(".g-additions").height();
                    scope.contentWrapElem.style.height = splitPanelHeight + 'px';
                }

                console.log('scope.additions', scope.additions);

                scope.evEventService.addEventListener(evEvents.ADDITIONS_CHANGE, function () {

                    scope.additions = scope.evDataService.getAdditions();
                    scope.activebject = scope.evDataService.getActiveObject();

                });

                scope.evEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                    scope.activebject = scope.evDataService.getActiveObject();

                });

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    scope.additions = scope.evDataService.getAdditions();
                    scope.activebject = scope.evDataService.getActiveObject();

                })

            }
        }
    }

}());