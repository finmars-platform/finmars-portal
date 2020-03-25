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
            templateUrl: 'views/directives/groupTable/g-table-component-view.html',
            scope: {
                attributeDataService: '=',
                evDataService: '=',
                evEventService: '=',
                spExchangeService: '='
            },
            link: function (scope, elem, attrs) {

                scope.additions = scope.evDataService.getAdditions();
                scope.verticalAdditions = scope.evDataService.getVerticalAdditions();
                scope.components = scope.evDataService.getComponents();
                scope.entityType = scope.evDataService.getEntityType();
                scope.activeObject = scope.evDataService.getActiveObject();
                scope.isReport = metaService.isReport(scope.entityType);

                scope.viewType = scope.evDataService.getViewType();
                scope.viewSettings = scope.evDataService.getViewSettings(scope.viewType);

                console.log('scope.components', scope.components);

                var interfaceLayout = scope.evDataService.getInterfaceLayout();
                var viewContext = scope.evDataService.getViewContext();

                var activeLayoutConfigIsSet = false;

                scope.isInsideDashboard = false;
                if (viewContext === 'dashboard') {
                    scope.isInsideDashboard = true;

                    interfaceLayout.groupingArea.collapsed = true;
                    interfaceLayout.groupingArea.height = 2;
                    interfaceLayout.columnArea.collapsed = true;
                    interfaceLayout.columnArea.height = 37;

                    scope.evDataService.setInterfaceLayout(interfaceLayout);

                    scope.additions.isOpen = false;
                    scope.evDataService.setAdditions(scope.additions);
                }


                scope.groupingAndColumnAreaCollapsed = interfaceLayout.groupingArea.collapsed;
                scope.dashboardFilterCollapsed = true;

                scope.splitPanelIsActive = scope.evDataService.isSplitPanelActive();
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                scope.isRecon = false;

                if (scope.evDataService.getViewContext() === 'reconciliation_viewer') {
                    scope.isRecon = true;
                }

                setTimeout(function () {

                    // wait until ng-class (.g-root-wrapper) will be applied

                    scope.contentWrapElem = elem[0].querySelector('.g-content-wrap');
                    scope.workareaWrapElem = elem[0].querySelector('.g-workarea-wrap');

                    if (scope.isRootEntityViewer) {
                        scope.rootWrapElem = elem[0].querySelector('.g-root-wrapper');
                    } else {
                        //scope.rootWrapElem = $(elem).parents('.g-root-wrapper');
                        scope.rootWrapElem = document.querySelector('.g-root-wrapper');
                    }

                    if (!scope.isRootEntityViewer) { // if this component inside split panel, set .g-content-wrap height
                        var splitPanelHeight = elem.parents(".g-additions").height();
                        scope.contentWrapElem.style.height = splitPanelHeight + 'px';
                    }

                    scope.$apply();

                }, 0);

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

                    //scope.groupingAndColumnAreaCollapsed = groupingAndColumnAreaCollapsed;

                    scope.evDataService.setInterfaceLayout(interfaceLayout);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
                };

                scope.toggleDashboardFilter = function () {
                    scope.dashboardFilterCollapsed = !scope.dashboardFilterCollapsed
                };

                var initEventListeners = function () {

                    scope.evEventService.addEventListener(evEvents.ADDITIONS_CHANGE, function () {

                        scope.additions = scope.evDataService.getAdditions();

                        console.log('scope.additions', scope.additions);

                        scope.activeObject = scope.evDataService.getActiveObject();

                    });

                    scope.evEventService.addEventListener(evEvents.VERTICAL_ADDITIONS_CHANGE, function () {

                        scope.verticalAdditions = scope.evDataService.getVerticalAdditions();

                        if (!scope.verticalAdditions || !scope.verticalAdditions.isOpen) {

                            setTimeout(function () { // wait for angular to remove vertical split panel

                                scope.evEventService.dispatchEvent(evEvents.UPDATE_ENTITY_VIEWER_CONTENT_WRAP_SIZE);
                                scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                            }, 200);


                        }

                        console.log("VERTICAL ADDITIONS CHANGE", scope.verticalAdditions)

                    });

                    scope.evEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {
                        scope.activeObject = scope.evDataService.getActiveObject();
                    });

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        scope.additions = scope.evDataService.getAdditions();
                        scope.activeObject = scope.evDataService.getActiveObject();

                        if (scope.viewType === 'matrix' && !activeLayoutConfigIsSet) {
                            activeLayoutConfigIsSet = true;

                            scope.evDataService.setActiveLayoutConfiguration({isReport: true}); // saving layout for checking for changes
                            scope.evEventService.dispatchEvent(evEvents.ACTIVE_LAYOUT_CONFIGURATION_CHANGED);
                        }

                    });

                    scope.evEventService.addEventListener(evEvents.VIEW_TYPE_CHANGED, function () {

                        scope.viewType = scope.evDataService.getViewType();
                        scope.viewSettings = scope.evDataService.getViewSettings(scope.viewType);

                        console.log('scope.viewType ', scope.viewType);
                        console.log('scope.viewSettings', scope.viewSettings);

                    });

                    scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_VIEWPORT, function () {

                        var interfaceLayout = scope.evDataService.getInterfaceLayout();

                        if (interfaceLayout.groupingArea.collapsed && interfaceLayout.columnArea.collapsed) {
                            scope.groupingAndColumnAreaCollapsed = true;
                        } else {
                            scope.groupingAndColumnAreaCollapsed = false;
                        }

                    });

                };

                scope.init = function () {
                    initEventListeners();

                    if (document.querySelector('body').classList.contains('filter-side-nav-collapsed')) {

                        scope.evDataService.toggleRightSidebar(true);

                    }
                };

                scope.init();

            }
        }
    }

}());