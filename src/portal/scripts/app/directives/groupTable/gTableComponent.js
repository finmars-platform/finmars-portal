/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    var metaService = require('../../services/metaService').default;
    var rvDataHelper = require('../../helpers/rv-data.helper').default;
    var localStorageService = require('../../../../../shell/scripts/app/services/localStorageService');

    module.exports = function (globalDataService) {
        return {
            restrict: 'AE',
            scope: {
                attributeDataService: '=',
                evDataService: '=',
                evEventService: '=',
                spExchangeService: '=',
                hideFiltersBlock: '=',
                hideUseFromAboveFilters: '=',
            },
			templateUrl: 'views/directives/groupTable/g-table-component-view.html',
            link: function (scope, elem, attrs) {

                console.log("gTableComponent.Link", scope, elem, attrs);

                scope.additions = scope.evDataService.getAdditions();
                scope.verticalAdditions = scope.evDataService.getVerticalAdditions();
                scope.components = scope.evDataService.getComponents();
                scope.entityType = scope.evDataService.getEntityType();
                scope.activeObject = scope.evDataService.getActiveObject();
                scope.isReport = metaService.isReport(scope.entityType);

                scope.viewType = scope.evDataService.getViewType();
                scope.viewSettings = scope.evDataService.getViewSettings(scope.viewType);
                scope.readyToRenderTable = false;

                scope.reportOptions = scope.evDataService.getReportOptions();


                console.log('scope.components', scope.components);
                var iframeMode = globalDataService.insideIframe();
                var interfaceLayout = scope.evDataService.getInterfaceLayout();
                var viewContext = scope.evDataService.getViewContext();
                var contentType = scope.evDataService.getContentType();

                var activeLayoutConfigIsSet = false;

                scope.isInsideDashboard = false;

                if (viewContext === 'dashboard') {

                	scope.isInsideDashboard = true;

                    /* For old rv interface
                    interfaceLayout.groupingArea.collapsed = true;
                    interfaceLayout.groupingArea.height = 2;
                    interfaceLayout.columnArea.collapsed = true;
                    interfaceLayout.columnArea.height = 37;

                    scope.evDataService.setInterfaceLayout(interfaceLayout);
                    */

                    scope.additions.isOpen = false;
                    scope.evDataService.setAdditions(scope.additions);

                }


                scope.dashboardFilterCollapsed = true;

                scope.splitPanelIsActive = scope.evDataService.isSplitPanelActive();
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                scope.isRecon = false;

                if (viewContext === 'reconciliation_viewer') {
                    scope.isRecon = true;
                }

                scope.contentWrapElement = elem[0].querySelector('.g-content-wrap');
                scope.workareaWrapElement = elem[0].querySelector('.g-workarea-wrap');
                scope.rootWrapElement = document.querySelector('.g-wrapper.g-root-wrapper'); // we are looking for parent


                if (scope.isRootEntityViewer) {

                    // we took a local root wrapper = .g-wrapper
                    // because there is an issue with ng-class, we can't set 'g-root-wrapper' before querying it from DOM

                    scope.rootWrapElement = elem[0].querySelector('.g-wrapper');
                }

                if (!scope.isRootEntityViewer) { // if this component inside split panel, set .g-content-wrap height
                    var splitPanelHeight = $(elem).parents(".g-additions").height();
                    scope.contentWrapElement.style.height = splitPanelHeight + 'px';
                }

                console.log('updateDomElementsReadyStatus. scope', scope);
                console.log('groupTable.rootWrapElem', scope.rootWrapElement);
                console.log('groupTable.contentWrapElem', scope.contentWrapElement);
                console.log('groupTable.workareaWrapElem', scope.workareaWrapElement);

                // IMPORTANT, that variable blocks child component rendering
                // because child components require some elements that render in this component
                // we need to query from DOM scope.rootWrapElement, scope.contentWrapElement, scope.workareaWrapElement
                // Here how it looks like in 2 steps:
                // 1) template create .g-wrapper, .g-content-wrap, .g-workarea-wrap' and we query them here
                // 2) then we set domElemsAreReady to true, and child components start rendering and we pass queried elements to them
                scope.domElemsAreReady = true;

                // The point of this complexity is to remove extra
                // setTimeout(function() {... scope.$apply()}, 0)
                // That trigger $digest and everything start refreshing
                // Slowdown really visible in dashboard

                console.log('scope.additions', scope.additions);

                scope.toggleGroupAndColumnArea = function () {

                    interfaceLayout = scope.evDataService.getInterfaceLayout();

                    //scope.groupingAndColumnAreaCollapsed = groupingAndColumnAreaCollapsed;

                    scope.evDataService.setInterfaceLayout(interfaceLayout);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
                };

                scope.toggleDashboardFilter = function () {
                    scope.dashboardFilterCollapsed = !scope.dashboardFilterCollapsed
                };

                scope.getWrapperClasses = function () {

                	var classes = '';

                    if (scope.isRootEntityViewer) {
                        classes = 'g-root-wrapper';
                    } else if (scope.isRecon) {
                        classes = 'g-reconciliation-wrapper';
                    }

                    if (scope.evDataService.isVerticalSplitPanelActive()) {
                        classes += ' g-v-split-panel-active';
                    }

                    if (scope.isReport) {
						classes += ' g-is-report';
					}

                    return classes;

                }

				var applyGroupsFoldingFromLocalStorage = function () {

                	var listLayout = scope.evDataService.getListLayout();
					var reportData = localStorageService.getReportDataForLayout(contentType, listLayout.user_code);

					if (reportData.groupsList && reportData.groupsList.length) {

						var groups = scope.evDataService.getGroups();

						reportData.groupsList.forEach(groupObj => {

							var group = groups.find(group => group.key === groupObj.key);

							if (group) {

								if (!group.report_settings) group.report_settings = {};

								group.report_settings.is_level_folded = groupObj.report_settings.is_level_folded;

							}

						});

						scope.evDataService.setGroups(groups);

						rvDataHelper.markHiddenColumnsBasedOnFoldedGroups(scope.evDataService);

					}

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

                                // delete scope.evEventService.dispatchEvent(evEvents.UPDATE_ENTITY_VIEWER_CONTENT_WRAP_SIZE);
                                scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                            }, 200);


                        }

                        console.log("VERTICAL ADDITIONS CHANGE", scope.verticalAdditions)

                    });

                    scope.evEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {
                        scope.activeObject = scope.evDataService.getActiveObject();
                    });

					scope.evEventService.addEventListener(evEvents.FILTERS_RENDERED, function () {

						scope.readyToRenderTable = true;

						setTimeout(() => {
							scope.$apply();
						}, 0);

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

                    scope.evEventService.addEventListener(evEvents.REPORT_OPTIONS_CHANGE, function () {

                        scope.reportOptions = scope.evDataService.getReportOptions();

                    });

                };

                const waitForColumnArea = function() {

                    const componentsStatuses = scope.evDataService.getComponentsStatuses();

                    if (componentsStatuses.columnArea) {
                        scope.columnsScrollableAreaElement = scope.workareaWrapElement.querySelector('.g-scrollable-area');
                        return;
                    }

                    const carIndex = scope.evEventService.addEventListener(evEvents.COLUMN_AREA_READY, function () {

                        const componentsStatuses = scope.evDataService.getComponentsStatuses();

                        if (componentsStatuses.columnArea) {

                            scope.columnsScrollableAreaElement = scope.workareaWrapElement.querySelector('.g-scrollable-area');

                            scope.evEventService.removeEventListener(evEvents.COLUMN_AREA_READY, carIndex);

                        }

                    });

                }

                scope.init = function () {

                    initEventListeners();

                    if (scope.components.columnArea) {
                        waitForColumnArea();
                    }

					if (scope.isReport) applyGroupsFoldingFromLocalStorage();

                    if (document.querySelector('body').classList.contains('filter-side-nav-collapsed')) {

                        scope.evDataService.toggleRightSidebar(true);

                    }
                };

                scope.init();

                scope.$on("$destroy", function() {

                    console.log("==== Table is destroyed ==== ")

                });

            },
            // controller: function ($scope) {
            //
            //     $scope.domElemsAreReady = false;
            //
            //     console.log("gTableComponent.Controller", $scope);
            //
            //     this.$postLink = function () {
            //         console.log("gTableComponent.PostLink", $scope);
            //     }
            //
            // }
        }
    }

}());
