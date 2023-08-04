(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var evEvents = require('../../services/entityViewerEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var DashboardComponentDataService = require('../../services/dashboard/dashboardComponentDataService');
    var DashboardComponentEventService = require('../../services/eventService');

    const localStorageService = require('../../../../../shell/scripts/app/services/localStorageService');

	module.exports = function ($mdDialog, uiService, dashboardHelper, metaContentTypesService) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-report-viewer-matrix-view.html',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '=',
                fillInModeData: '=?' // data about component inside tabs for filled in component
            },
            link: function (scope, elem, attr) {

                scope.readyStatus = {
                    data: 'processing',
                    disabled: false
                };

                scope.dashboardComponentDataService = new DashboardComponentDataService;
                scope.dashboardComponentEventService = new DashboardComponentEventService;

                var componentData;
				var componentElem = elem[0].querySelector('.dashboardComponent');

                if (scope.item && scope.item.data) {

                	componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    if (componentData.custom_component_name) {
                        scope.customName = componentData.custom_component_name;
                    }

                }

                if (componentData && !componentData.settings.filters) {
                    componentData.settings.filters = {
                        show_filters_area: false,
                        show_use_from_above_filters: false,
                    }
                }

                scope.showFiltersArea = componentData.settings.filters.show_filters_area;
                scope.showUseFromAboveFilters = componentData.settings.filters.show_use_from_above_filters;

                let contentType = metaContentTypesService.findContentTypeByEntity(componentData.settings.entity_type);

                scope.vm = {
                    tabNumber: scope.tabNumber,
                    rowNumber: scope.rowNumber,
                    columnNumber: scope.columnNumber,
                    componentData: componentData,
                    entityType: componentData.settings.entity_type,
                    contentType: contentType,
					componentElement: componentElem,
                    dashboardDataService: scope.dashboardDataService,
                    dashboardEventService: scope.dashboardEventService,
                    dashboardComponentDataService: scope.dashboardComponentDataService,
                    dashboardComponentEventService: scope.dashboardComponentEventService
                };

                if (scope.fillInModeData) {
                    scope.vm.entityViewerDataService = scope.fillInModeData.entityViewerDataService;
                    scope.vm.attributeDataService = scope.fillInModeData.attributeDataService;
                }

                scope.openComponentSettingsDialog = function ($event) {

                    //var attributeDataService = scope.dashboardComponentDataService.getAttributeDataService();
                    var dashboardComponents = scope.dashboardDataService.getComponents();

                    $mdDialog.show({
                        controller: 'DashboardReportViewerMatrixComponentSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/dashboard/component-settings/dashboard-report-viewer-matrix-component-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        autoWrap: true,
                        multiple: true,
                        locals: {
                            item: scope.vm.componentData,
                            data: {
                                dashboardComponents: dashboardComponents
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            componentData = res.data.item;

                            scope.vm.componentData = componentData;
                            scope.vm.entityType = componentData.settings.entity_type;
                            contentType = metaContentTypesService.findContentTypeByEntity(componentData.settings.entity_type);

                            if (componentData.custom_component_name) {
                                scope.customName = componentData.custom_component_name;
                            } else {
                                scope.customName = null;
                            }

                            scope.dashboardDataService.updateComponent(componentData);

                            /*if (scope.fillInModeData) { // Reloading corresponding component inside tabs from it's filled in copy
                                scope.fillInModeData.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                            }*/

                            if (res.action === 'save') {
								dashboardHelper.saveComponentSettingsFromDashboard(scope.dashboardDataService, componentData, true);
                            }

                            if (scope.fillInModeData) {

                                scope.fillInModeData.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                                scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                                scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                            } else {

                                scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                                scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                                scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                            }

                            scope.disableFillInMode();

                            /*scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);*/

                        }

                    })

                };

                scope.enableFillInMode = function () {

                    var entityViewerDataService = scope.vm.dashboardComponentDataService.getEntityViewerDataService();
                    var attributeDataService = scope.vm.dashboardComponentDataService.getAttributeDataService();

                    scope.fillInModeData = {
                        tab_number: scope.tabNumber,
                        row_number: scope.rowNumber,
                        column_number: scope.columnNumber,
                        item: scope.item,
                        entityViewerDataService: entityViewerDataService,
                        attributeDataService: attributeDataService,
                        dashboardComponentEventService: scope.dashboardComponentEventService // needed to update component inside tabs
                    }

                };

                scope.disableFillInMode = function () {
                    scope.fillInModeData = null;
                };

                scope.clearUseFromAboveFilters = function () {
                    scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.CLEAR_USE_FROM_ABOVE_FILTERS);
                };

				scope.toggleFilterBlock = function () {
				    dashboardHelper.toggleFilterBlock(scope);
                };

                scope.initEventListeners = function () {

					dashboardHelper.initEventListeners(scope);

                    if (!scope.fillInModeData) {

                        scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                            var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                            if (status === dashboardComponentStatuses.START) { // Init calculation of a component

                                scope.readyStatus.data = 'ready';

                                setTimeout(function () {
                                    scope.$apply();
                                },0)

                            } else if (status === dashboardComponentStatuses.ERROR) {

                                scope.compErrorMessage = 'ERROR';
                                var componentError = scope.dashboardDataService.getComponentError(scope.item.data.id);

                                if (componentError) {
                                    scope.compErrorMessage = 'ERROR: ' + componentError.displayMessage;
                                }

                                scope.readyStatus.data = 'error';

                                setTimeout(function () {
                                    scope.$apply();
                                },0)

                            }

                        });

                        /* May be needed for FN-1090
                        scope.dashboardEventService.addEventListener(dashboardEvents.RELOAD_COMPONENT, function () {
                            scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                        })
                        */

                    }

					//<editor-fold desc="Dashboard component events">
                    scope.dashboardComponentEventService.addEventListener(dashboardEvents.RELOAD_COMPONENT, function () {

                        if (scope.item && scope.item.data) {
                            componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                            if (componentData.custom_component_name) {
                                scope.customName = componentData.custom_component_name;
                            }
                        }

                        scope.vm.componentData = componentData;
                        scope.vm.entityType = componentData.settings.entity_type;
                        contentType = metaContentTypesService.findContentTypeByEntity(componentData.settings.entity_type);

                        scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_CONTENT_OF_COMPONENT);

                    });

                    scope.dashboardComponentEventService.addEventListener(dashboardEvents.REPORT_VIEWER_DATA_SERVICE_SET, function () {

                        var entityViewerDataService = scope.dashboardComponentDataService.getEntityViewerDataService();
                        var entityViewerEventService = scope.dashboardComponentDataService.getEntityViewerEventService();

                        scope.missingPricesData = entityViewerDataService.getMissingPrices();

                        entityViewerEventService.addEventListener(evEvents.MISSING_PRICES_LOAD_END, function () {

                            scope.missingPricesData = entityViewerDataService.getMissingPrices()

                        });

                    });

					/* scope.dashboardComponentEventService.addEventListener(dashboardEvents.COMPONENT_DATA_CHANGED_INSIDE, function () {

					}); */
					//</editor-fold>

                    scope.dashboardComponentEventService.addEventListener(dashboardEvents.TOGGLE_SHOW_FROM_ABOVE_FILTERS, function () {

                        scope.showUseFromAboveFilters = !scope.showUseFromAboveFilters;

                        const id = scope.vm.componentData.id;
                        const components = scope.dashboardDataService.getComponents();
                        const currentComponent = components.find(component => component.id === id);

                        if (currentComponent) {
                            currentComponent.settings.filters.show_use_from_above_filters = scope.showUseFromAboveFilters;
                        }

                        scope.dashboardDataService.setComponents(components);

                    })

                };

                scope.openMissingPricesDialog = function($event){

                    $mdDialog.show({
                        controller: 'ReportPriceCheckerDialogController as vm',
                        templateUrl: 'views/dialogs/report-missing-prices/report-price-checker-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: {
                                missingPricesData: scope.missingPricesData,
                                evDataService: scope.evDataService
                            }
                        }
                    })

                };

                // Victor 2021.05.27 #113 number format from report layout
                /* const getLayoutById = async function (layoutId) {

                    return new Promise(function (resolve, reject) {

                        let actualLayoutsIds = scope.dashboardDataService.getCachedLayoutsData();

                        if (actualLayoutsIds.includes(layoutId)) {

                            let cachedLayout = localStorageService.getCachedLayout(layoutId);
                            resolve(cachedLayout);

                        } else {

                            uiService.getListLayoutByKey(layoutId).then(function (layoutData) {

                                scope.dashboardDataService.setCachedLayoutsData();
                                resolve(layoutData);

                            }).catch(function (error) {
                                reject(error);
                            });

                        }

                    });

                }; */
                const getLayoutByUserCode = function () {

                    const userCode = componentData.settings.layout;
                    const cachedLayoutsData = scope.dashboardDataService.getCachedLayoutsData();

                    if ( !cachedLayoutsData[contentType] ) {
                        cachedLayoutsData[contentType] = {};
                    }

                    if ( cachedLayoutsData[contentType].hasOwnProperty(userCode) ) {

                        const layoutId = cachedLayoutsData[contentType][userCode];

                        return new Promise(function (resolve) {
                            resolve( localStorageService.getCachedLayout(layoutId) );
                        });

                    }
                    else {

                        return new Promise(function (resolve, reject) {

                            uiService.getListLayoutByUserCode(scope.vm.entityType, userCode).then(function (resData) {

                                if ( resData.results.length ) {

                                    var layoutData = resData.results[0];

                                    scope.dashboardDataService.setCachedLayoutsData(contentType, userCode, layoutData.id);

                                    resolve(layoutData);

                                }

                            }).catch(function (error) { reject(error); });

                        });

                    }

                };

                const getNumberFormatFromLayoutByValueKey = async () => {

                    const defaultNumberFormat = {
                        negative_color_format_id: 0,
                        negative_format_id: 0,
                        percentage_format_id: 0,
                        round_format_id: 0,
                        thousands_separator_format_id: 0,
                        zero_format_id: 0,
                    };

                    // const layoutData = await getLayoutById(layoutId);
                    const layoutData = await getLayoutByUserCode();

                    const columns = layoutData.data.columns;

                    const valueKey = componentData.settings.value_key;
                    const matrixValue = columns.find(column => column.key === valueKey);

                    return matrixValue ? matrixValue.report_settings : defaultNumberFormat;

                }
                // <Victor 2021.05.27 #113 number format from report layout>

                scope.init = async function () {

                    // Victor 2021.05.27 #113 number format from report layout
                    /*const layoutUserCode = componentData.settings.layout;
                    const valueKey = componentData.settings.value_key;*/

                    if ( !componentData.settings.number_format ) {
                        componentData.settings.number_format = await getNumberFormatFromLayoutByValueKey();
                    }
                    // <Victor 2021.05.27 #113 number format from report layout>

                    scope.initEventListeners();

                    if (!scope.fillInModeData) {

                        scope.dashboardDataService.setComponentRefreshRestriction(scope.item.data.id, false);

                        scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    } else {
                        scope.readyStatus.data = 'ready';
                    }

                };

                scope.init()

            }
        }
    }
}());