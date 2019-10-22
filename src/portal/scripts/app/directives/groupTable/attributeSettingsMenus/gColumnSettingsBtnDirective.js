/**
 * Created by mevstratov on 22.10.2019.
 */
(function () {

    'use strict';

    var evEvents = require('../../../services/entityViewerEvents');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                column: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/groupTable/attributeSettingsMenus/g-column-settings-btn-view.html',
            link: function (scope, elem, attrs) {

                scope.renameColumn = function ($mdMenu, $event) {

                    $mdDialog.show({
                        controller: 'RenameDialogController as vm',
                        templateUrl: 'views/dialogs/rename-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: scope.column
                        }
                    })

                };

                scope.activateColumnNumberRenderingPreset = function (rendPreset) {

                    if (!scope.column.report_settings) {
                        scope.column.report_settings = {};
                    };

                    switch (rendPreset) {

                        case 'price':
                            scope.column.report_settings.zero_format_id = 1;
                            scope.column.report_settings.negative_color_format_id = 0;
                            scope.column.report_settings.negative_format_id = 0;
                            break;
                        case 'market_value':
                            scope.column.report_settings.zero_format_id = 1;
                            scope.column.report_settings.negative_color_format_id = 1;
                            scope.column.report_settings.negative_format_id = 1;
                            scope.column.report_settings.thousands_separator_format_id = 2;
                            break;
                        case 'amount':
                            scope.column.report_settings.zero_format_id = 1;
                            scope.column.report_settings.negative_color_format_id = 1;
                            scope.column.report_settings.negative_format_id = 0;
                            scope.column.report_settings.thousands_separator_format_id = 2;
                            scope.column.report_settings.round_format_id = 3;
                            scope.column.report_settings.percentage_format_id = 0;
                            break;
                        case 'exposure':
                            scope.column.report_settings.zero_format_id = 1;
                            scope.column.report_settings.negative_color_format_id = 1;
                            scope.column.report_settings.negative_format_id = 1;
                            scope.column.report_settings.round_format_id = 0;
                            scope.column.report_settings.percentage_format_id = 2;
                            break;
                        case 'return':
                            scope.column.report_settings.zero_format_id = 1;
                            scope.column.report_settings.negative_color_format_id = 1;
                            scope.column.report_settings.negative_format_id = 0;
                            scope.column.report_settings.percentage_format_id = 3;
                            break;

                    };

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);

                };

                scope.openColumnNumbersRenderingSettings = function ($event) {

                    $mdDialog.show({
                        controller: 'gColumnNumbersRenderingSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/g-column-numbers-rendering-settings-dialog-view.html',
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                column: scope.column
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.column.report_settings = res.data.report_settings;
                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                            scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);

                        };

                    });
                };

                scope.selectSubtotalType = function (type) {

                    if (!scope.column.hasOwnProperty('report_settings')) {
                        scope.column.report_settings = {};
                    }

                    if (scope.column.report_settings.subtotal_formula_id == type) {
                        scope.column.report_settings.subtotal_formula_id = null;
                    } else {
                        scope.column.report_settings.subtotal_formula_id = type;
                    };

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);
                };

                scope.checkSubtotalFormula = function (type) {

                    if (scope.column.hasOwnProperty('report_settings') && scope.column.report_settings) {
                        if (scope.column.report_settings.subtotal_formula_id === type) {
                            return true;
                        }

                    }

                    return false;

                };

                scope.reportHideSubtotal = function () {

                    if (!scope.column.hasOwnProperty('report_settings')) {
                        scope.column.report_settings = {};
                    }

                    scope.column.report_settings.hide_subtotal = !scope.column.report_settings.hide_subtotal;

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);

                };

            }
        }
    }

}());