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
                group: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/groupTable/attributeSettingsMenus/g-group-settings-btn-view.html',
            link: function (scope, elem, attrs) {

                scope.openGroupSettings = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                scope.reportSetSubtotalType = function (type) {

                    if (!scope.group.hasOwnProperty('report_settings') || scope.group.report_settings === undefined) {
                        scope.group.report_settings = {};
                    }

                    if (scope.group.report_settings.subtotal_type === type) {
                        scope.group.report_settings.subtotal_type = false;
                    } else {
                        scope.group.report_settings.subtotal_type = type;
                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);
                };

                scope.reportSetBlankLineType = function (type) {

                    if (!scope.group.hasOwnProperty('report_settings') || scope.group.report_settings === undefined) {
                        scope.group.report_settings = {};
                    }

                    if (scope.group.report_settings.blankline_type === type) {
                        scope.group.report_settings.blankline_type = false;
                    } else {
                        scope.group.report_settings.blankline_type = type;
                    }


                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.renameGroup = function ($mdMenu, $event) {

                    $mdDialog.show({
                        controller: 'RenameDialogController as vm',
                        templateUrl: 'views/dialogs/rename-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: scope.group
                        }
                    })

                };

            }
        }
    }

}());