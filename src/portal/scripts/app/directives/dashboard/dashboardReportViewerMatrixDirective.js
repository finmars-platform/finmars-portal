const EntityViewerDataService = require("../../services/entityViewerDataService");
const EntityViewerEventService = require("../../services/eventService");
const AttributeDataService = require("../../services/attributeDataService");
const dashboardEvents = require("../../services/dashboard/dashboardEvents");
const dashboardComponentStatuses = require("../../services/dashboard/dashboardComponentStatuses");
const evEvents = require("../../services/entityViewerEvents");
(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var evEvents = require('../../services/entityViewerEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    const localStorageService = require('../../../../../shell/scripts/app/services/localStorageService');

    module.exports = function ($mdDialog, uiService, dashboardHelper, metaContentTypesService, reportHelper) {
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

                scope.openComponentSettingsDialog = function ($event) {

                    var dashboardComponents = scope.dashboardDataService.getComponents();

                    $mdDialog.show({
                        controller: 'DashboardReportViewerMatrixComponentSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/dashboard/component-settings/dashboard-report-viewer-matrix-component-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        autoWrap: true,
                        multiple: true,
                        locals: {
                            item: scope.componentData,
                            data: {
                                dashboardComponents: dashboardComponents
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.componentData = res.data.item;

                            scope.dashboardDataService.updateComponent(scope.componentData);

                            if (res.action === 'save') {
                                dashboardHelper.saveComponentSettingsFromDashboard(scope.dashboardDataService, scope.componentData, true);
                            }

                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                        }

                    })

                };

                scope.openMissingPricesDialog = function ($event) {

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

                scope.init = function () {

                    console.log("DASHBOARD.MATRIX.INIT")

                    scope.readyStatus.data = 'processing'

                    scope.componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    console.log("DASHBOARD.MATRIX.INIT.scope.componentData", scope.componentData)

                    scope.showFiltersArea = scope.componentData.settings.filters.show_filters_area;
                    scope.showUseFromAboveFilters = scope.componentData.settings.filters.show_use_from_above_filters;

                    if (scope.componentData && !scope.componentData.settings.filters) {
                        scope.componentData.settings.filters = {
                            show_filters_area: false,
                            show_use_from_above_filters: false,
                        }
                    }

                    scope.entityViewerDataService = new EntityViewerDataService(reportHelper);
                    scope.entityViewerEventService = new EntityViewerEventService();

                    if (scope.componentData.settings.matrix_type == 'balance') {
                        scope.entityViewerDataService.setEntityType('balance-report')
                    }

                    if (scope.componentData.settings.matrix_type == 'pl') {
                        scope.entityViewerDataService.setEntityType('pl-report')
                    }

                    scope.entityViewerDataService.setViewContext('dashboard');

                    // Settings columns, because API returns only requested columns
                    scope.entityViewerDataService.setColumns([
                        {
                            name: scope.componentData.settings.abscissa,
                            key: scope.componentData.settings.abscissa,
                            value_type: 10 // maybe bad idea
                        },
                        {
                            name: scope.componentData.settings.ordinate,
                            key: scope.componentData.settings.ordinate,
                            value_type: 10
                        },
                        {
                            name: scope.componentData.settings.value_key,
                            key: scope.componentData.settings.value_key,
                            value_type: 20,
                            report_settings: { // do not remove, very important, TODO refactor later
                                "subtotal_formula_id": 1
                            }
                        }
                    ])

                    if (scope.componentData.settings.default_report_options) { // in case if default_report_options undefined
                        scope.reportOptions = JSON.parse(JSON.stringify(scope.componentData.settings.default_report_options))
                    } else {
                        scope.reportOptions = {}
                    }

                    // TODO some shady logic here, consider refactor
                    if (scope.componentData.settings.linked_components) {

                        if (scope.componentData.settings.linked_components.report_settings) {

                            var layoutState = scope.dashboardDataService.getLayoutState();

                            Object.keys(scope.componentData.settings.linked_components.report_settings).forEach(function (key) {

                                var mapValue = scope.componentData.settings.linked_components.report_settings[key]

                                scope.reportOptions[key] = layoutState[mapValue];

                            })

                        }

                    }

                    delete scope.reportOptions.report_instance_id

                    console.log('dashboard.matrix.scope.reportOptions', scope.reportOptions);

                    scope.entityViewerDataService.setReportOptions(scope.reportOptions); // settings empty object

                    scope.matrixSettings = {

                        top_left_title: scope.componentData.settings.top_left_title,

                        abscissa: scope.componentData.settings.abscissa,
                        ordinate: scope.componentData.settings.ordinate,
                        value_key: scope.componentData.settings.value_key,
                        available_abscissa_keys: scope.componentData.user_settings.available_abscissa_keys,
                        available_ordinate_keys: scope.componentData.user_settings.available_ordinate_keys,
                        available_value_keys: scope.componentData.user_settings.available_value_keys,

                        number_format: scope.componentData.settings.number_format,
                        subtotal_formula_id: scope.componentData.settings.subtotal_formula_id,

                        matrix_view: scope.componentData.settings.matrix_view, // DEPRECATED possibly

                        styles: scope.componentData.settings.styles,
                        auto_scaling: scope.componentData.settings.auto_scaling,
                        calculate_name_column_width: scope.componentData.settings.calculate_name_column_width,
                        hide_empty_lines: scope.componentData.settings.hide_empty_lines

                    };

                    scope.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    })

                    scope.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                        var activeObject = scope.entityViewerDataService.getActiveObject();

                        scope.dashboardDataService.setComponentOutput(scope.componentData.user_code, activeObject);

                        scope.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + scope.item.data.id);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_OUTPUT_CHANGE);

                    })


                    setTimeout(function () {
                        scope.readyStatus.data = 'ready';
                        scope.$apply();
                    }, 1000)

                };

                // TODO move that func somwhere to utils
                function isEqual(value1, value2) {
                    if (typeof value1 !== typeof value2) return false;
                    if (typeof value1 === 'object' && value1 !== null && value2 !== null) {
                        if (Array.isArray(value1)) {
                            if (!Array.isArray(value2) || value1.length !== value2.length) return false;
                            for (let i = 0; i < value1.length; i++) {
                                if (!isEqual(value1[i], value2[i])) return false;
                            }
                            return true;
                        } else {
                            const keys1 = Object.keys(value1);
                            const keys2 = Object.keys(value2);
                            if (keys1.length !== keys2.length) return false;
                            for (const key of keys1) {
                                if (!keys2.includes(key) || !isEqual(value1[key], value2[key])) return false;
                            }
                            return true;
                        }
                    }
                    return value1 === value2;
                }

                function hasStateChanged(oldState, newState, fieldsToCompare) {

                    if (fieldsToCompare) {
                        for (const field of fieldsToCompare) {
                            if (!isEqual(oldState[field], newState[field])) {
                                return true; // Change detected
                            }
                        }
                    }

                    return false; // No changes detected
                }

                scope.dashboardInit = function () {

                    scope.componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    // Component put himself in INIT Status
                    // so that dashboard manager can start processing it
                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    scope.lastSavedOutput = scope.dashboardDataService.getLayoutState();


                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if (status === dashboardComponentStatuses.START) {
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.PROCESSING);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                            scope.init();
                        }

                    });

                    scope.dashboardEventService.addEventListener(dashboardEvents.REFRESH_ALL, function () {

                        scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.PROCESSING);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                        scope.init();

                    })

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_OUTPUT_CHANGE, function () {

                        var componentsOutputs = scope.dashboardDataService.getLayoutState();

                        var changed = hasStateChanged(scope.lastSavedOutput, componentsOutputs, scope.componentData.settings.components_to_listen)

                        if (changed) {
                            scope.init();
                        }

                        scope.lastSavedOutput = componentsOutputs

                    });

                }

                scope.dashboardInit();

            }
        }
    }
}());