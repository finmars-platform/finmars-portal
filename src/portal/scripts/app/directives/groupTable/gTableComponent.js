/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    var metaService = require('../../services/metaService');

    module.exports = function () {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/groupTable/group-table-shell-view.html',
            scope: {
                evDataService: '=',
                evEventService: '=',
                spExchangeService: '='
            },
            link: function (scope, elem, attrs) {

                scope.additions = scope.evDataService.getAdditions();
                scope.components = scope.evDataService.getComponents();
                scope.entityType = scope.evDataService.getEntityType();
                scope.activeObject = scope.evDataService.getActiveObject();
                scope.activeObjectsCount = scope.evDataService.getActiveObjectsCount();
                scope.isReport = metaService.isReport(scope.entityType);

                console.log('scope.components', scope.components);

                var interfaceLayout = scope.evDataService.getInterfaceLayout();

                scope.groupingAndColumnAreaCollapsed = interfaceLayout.groupingArea.collapsed;

                scope.splitPanelIsActive = scope.evDataService.isSplitPanelActive();
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                scope.contentWrapElem = elem[0].querySelector('.g-content-wrap');

                console.log(elem[0].querySelector('.g-rootentity-content-wrap'))

                scope.rootEntityContentWrapElem = elem[0].querySelector('.g-rootentity-content-wrap');

                console.log('table scope', scope);


                if (!scope.isRootEntityViewer) { // if this component inside split panel, set .g-content-wrap height
                    var splitPanelHeight = elem.parents(".g-additions").height();
                    scope.contentWrapElem.style.height = splitPanelHeight + 'px';
                }

                console.log('scope.additions', scope.additions);

                scope.toggleGroupAndColumnArea = function () {

                    interfaceLayout = scope.evDataService.getInterfaceLayout();

                    var groupingAndColumnAreaCollapsed = !scope.groupingAndColumnAreaCollapsed;

                    if (groupingAndColumnAreaCollapsed) {

                        interfaceLayout.groupingArea.collapsed = true;
                        interfaceLayout.groupingArea.height = 2;
                        interfaceLayout.columnArea.collapsed = true;
                        interfaceLayout.columnArea.height = 37;

                    } else {

                        interfaceLayout.groupingArea.collapsed = false;
                        interfaceLayout.groupingArea.height = 98;
                        interfaceLayout.columnArea.collapsed = false;
                        interfaceLayout.columnArea.height = 70;

                    }

                    scope.groupingAndColumnAreaCollapsed = groupingAndColumnAreaCollapsed;

                    scope.evDataService.setInterfaceLayout(interfaceLayout);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
                };

                scope.evEventService.addEventListener(evEvents.ADDITIONS_CHANGE, function () {

                    scope.additions = scope.evDataService.getAdditions();

                    console.log('scope.additions', scope.additions);

                    scope.activeObject = scope.evDataService.getActiveObject();

                });

                scope.evEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                    scope.activeObject = scope.evDataService.getActiveObject();
                    scope.activeObjectsCount = scope.evDataService.getActiveObjectsCount();

                });

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    scope.additions = scope.evDataService.getAdditions();
                    scope.activeObject = scope.evDataService.getActiveObject();

                });

            }
        }
    }

}());