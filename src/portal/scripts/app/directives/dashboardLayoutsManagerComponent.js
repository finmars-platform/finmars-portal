(function () {

    'use strict';

    const middlewareService = require('../services/middlewareService');
    const evEvents = require("../services/entityViewerEvents");
    const evRvLayoutsHelper = require('../helpers/evRvLayoutsHelper');
    const popupEvents = require('../services/events/popupEvents');
    const dashboardEvents = require('../services/dashboard/dashboardEvents');

    const uiService = require('../services/uiService');

    const toastNotificationService = require('../../../../core/services/toastNotificationService');

    module.exports = function ($mdDialog, $state) {
        return {
            restrict: 'E',
            templateUrl: 'views/components/dashboard-layouts-manager-view.html',
            scope: {
                onChangeLayoutCallback: '&',
                evDataService: '=',
                evEventService: '=',
            },
            link: function (scope) {

                scope.layout = scope.evDataService.getData()

                scope.processing = false;

                console.log('scope', scope.layout);

                scope.layouts = [];

                scope.createLayout = function (){

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    $state.go('app.dashboard-constructor', {
                        id: 'new'
                    })

                }

                scope.deleteLayout = function (ev) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/dialogs/warning-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        locals: {
                            warning: {
                                title: 'Warning',
                                description: 'Are you sure want to delete this layout?'
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true
                    }).then(function (res) {
                        if (res.status === 'agree') {

                            uiService.deleteDashboardLayoutByKey(scope.layout.id).then(function (){

                                toastNotificationService.success("Dashboard Layout is deleted")

                            })
                        }
                    })
                };

                scope.openLayout = (layout) => {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    console.log('openLayout.layout', layout);

                    scope.evDataService.setLayoutToOpen(layout);

                    scope.evEventService.dispatchEvent(dashboardEvents.DASHBOARD_LAYOUT_CHANGE)


                };

                scope.setAsDefault = (targetLayout) => {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    scope.layout.is_default = true;

                    uiService.updateDashboardLayout(scope.layout.id, scope.layout).then(async function (data) {

                        toastNotificationService.success("Dashboard Layout is set as default")


                    });

                };

                scope.saveLayoutList = function () {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    uiService.updateDashboardLayout(scope.layout.id, scope.layout).then(function (data) {

                        toastNotificationService.success("Dashboard Layout is Saved")


                    });

                };

                scope.saveAsLayoutList = function ($event) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    // TODO save as method?

                };

                scope.renameLayout = function ($event) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    //$event.stopPropagation();
                    // var layoutData = layoutsList[index];
                    const layoutData = scope.layout;

                    $mdDialog.show({
                        controller: 'UiLayoutSaveAsDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-layout-save-as-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        multiple: true,
                        clickOutsideToClose: false,
                        locals: {
                            options: {
                                layoutName: layoutData.name,
                                layoutUserCode: layoutData.user_code
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.layout.name = res.data.name;

                            uiService.updateDashboardLayout(scope.layout.id, scope.layout).then(async function (data) {

                                toastNotificationService.success("Dashboard Layout is renamed")

                            });

                        }

                    })

                };

                scope.shareLayout = function ($event) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    let type = 'entity_viewer';

                    if (scope.evDataService.getEntityType().indexOf('report') !== -1) {
                        type = 'report_viewer';
                    }

                    $mdDialog.show({
                        controller: 'UiShareLayoutDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-share-layout-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        multiple: true,
                        clickOutsideToClose: false,
                        locals: {
                            options: {
                                layout: scope.layout,
                                type: type
                            }
                        }

                    })

                };

                scope.makeCopy = function ($event) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    var layout = JSON.parse(JSON.stringify(scope.layout))

                    layout.name = layout.name + '_copy';
                    layout.user_code = layout.user_code + '_copy';

                    layout.is_default = false;
                    layout.origin_for_global_layout = null;
                    layout.sourced_from_global_layout = null;

                    uiService.createDashboardLayout(layout).then(async function (data) {

                        scope.evDataService.setLayoutToOpen(data);

                        scope.evEventService.dispatchEvent(dashboardEvents.DASHBOARD_LAYOUT_CHANGE)

                        toastNotificationService.success("Dashboard Layout is Duplicated")


                    });

                };

                scope.exportLayout = function ($event) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    $mdDialog.show({
                        controller: 'DashboardLayoutExportDialogController as vm',
                        templateUrl: 'views/dialogs/dashboard/dashboard-layout-export-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: {layout: scope.layout}
                        }
                    })

                };

                scope.getLayouts = function () {

                    scope.processing = true;

                    uiService.getDashboardLayoutList({pageSize: 1000}).then(function (data){

                        scope.layouts = data.results;

                        scope.processing = false;


                        scope.$apply();

                    })

                };

                const init = async () => {

                    scope.getLayouts();

                }

                init();

            }
        }
    }
}());