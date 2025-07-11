(function () {

    'use strict';

    const popupEvents = require('../services/events/popupEvents');
    const dashboardEvents = require('../services/dashboard/dashboardEvents');

    const uiService = require('../services/uiService').default;
    const shareConfigurationFileService = require('../services/shareConfigurationFileService');
    // const backendConfigurationImportService = require('../services/backendConfigurationImportService');

    const toastNotificationService = require('../../../../core/services/toastNotificationService').default;


    module.exports = function ($mdDialog, $state, toastNotificationService, uiService, backendConfigurationImportService, evRvLayoutsHelper) {
        return {
            restrict: 'E',
            templateUrl: 'views/components/layouts-manager-view.html',
            scope: {
                onChangeLayoutCallback: '&',
                dashboardDataService: '=',
                dashboardEventService: '=',
				        parentPopup: '='
            },
            link: function (scope) {

                scope.layout = scope.dashboardDataService.getData();
				        scope.viewContext = 'dashboard';

                scope.invites = [];

                scope.processing = false;

                console.log('scope', scope.layout);

                scope.layouts = [];

                scope.prepareNuxtLink = function (id) {
                    const { protocol, host, pathname: currentPathName } = window.location;
                    const pathname = `${currentPathName.slice(0, -2)}v/`;
                    return `${protocol}//${host}${pathname}configuration/dashboard-constructor/${id}`;
                }

                scope.createNewLayout = function () {
                    scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    const url = scope.prepareNuxtLink('new');
                    window.location.href = url;
                }

                scope.deleteLayout = function (ev) {

                    scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/dialogs/warning-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
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
                            uiService.deleteDashboardLayoutByKey(scope.layout.id).then(function () {
                                toastNotificationService.success("Dashboard Layout is deleted");
                                // Refresh layouts and check if the current layout was deleted
                                return scope.getLayouts();
                            }).then(function (layouts) {
                                // Check if the current layout (being viewed) was deleted
                                const layoutExists = layouts.some(l => l.id === scope.layout.id);
                                if (!layoutExists) {
                                    // Redirect to dashboard and reload to trigger default layout check
                                    $state.go('app.portal.dashboard', {}, { reload: true });
                                }
                            }).catch(function (error) {
                                console.error('Error deleting layout:', error);
                            });
                        }
                    });
                };

                scope.openLayout = (layout) => {

                    scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    console.log('openLayout.layout', layout);

                    scope.dashboardDataService.setLayoutToOpen(layout);

                    scope.dashboardEventService.dispatchEvent(dashboardEvents.DASHBOARD_LAYOUT_CHANGE)


                };

                /* scope.getLinkToLayout = function (userCode) {
                  return $state.current.name + "({layoutUserCode: '" + userCode + "'})";
                }; */
                scope.onLayoutLinkClick = function ($event, layout) {

                  scope.parentPopup.cancel();
                  $event.preventDefault();

                  scope.dashboardDataService.setLayoutToOpen(layout);
                  scope.dashboardEventService.dispatchEvent(dashboardEvents.DASHBOARD_LAYOUT_CHANGE)

                };

                scope.getLinkToLayout = function (userCode) {

                  let link = $state.href($state.current.name);
                  if (userCode) link = link + '?layout=' + userCode;
                  return link;

                };

                scope.layoutIsDefault = layout => layout.is_default;

                scope.setAsDefault = (targetLayout) => {

                  if (targetLayout.is_default) {
                    return;
                  }

                    scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

					          targetLayout.is_default = true;

                    uiService.updateDashboardLayout(targetLayout.id, targetLayout).then(async function (data) {
                        scope.dashboardDataService.updateModifiedDate(data.modified_at);
                        toastNotificationService.success("Dashboard Layout is set as default");

                    });

                };

                scope.editDashboardLayout = () => {
                    const url = scope.prepareNuxtLink(scope.layout.id);
                    window.open(url, '_blank');
                };

                scope.saveLayoutList = function () {

                    uiService.updateDashboardLayout(scope.layout.id, scope.layout).then(function (data) {

                        toastNotificationService.success("Dashboard Layout is Saved")
                        scope.dashboardDataService.updateModifiedDate(data.modified_at);

                        scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);


                    });

                };

                scope.saveAsLayoutList = function ($event) {

                    scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    // TODO save as method?

                };

                scope.renameLayout = function ($event) {

                    scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    //$event.stopPropagation();
                    // var layoutData = layoutsList[index];
                    const layoutData = scope.layout;

                    $mdDialog.show({
                        controller: 'UiLayoutSaveAsDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-layout-save-as-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        multiple: true,
                        clickOutsideToClose: false,
                        locals: {
                            data: {
                                layoutName: layoutData.name,
                                layoutUserCode: layoutData.user_code,
                                dashboard: true,
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.layout.name = res.data.name;
                            scope.layout.user_code = res.data.user_code;
                            scope.layout.configuration_code = res.data.configuration_code;

                            uiService.updateDashboardLayout(scope.layout.id, scope.layout).then(async function (data) {
                                scope.dashboardDataService.updateModifiedDate(data.modified_at);
                                toastNotificationService.success("Dashboard Layout is renamed")

                            });

                        }

                    })

                };

                scope.shareLayout = function ($event) {

                    scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    var type = 'dashboard_viewer';

                    $mdDialog.show({
                        controller: 'UiShareLayoutDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-share-layout-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
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

                scope.importConfiguration = function (resolve) {

                    backendConfigurationImportService.importConfigurationAsJson(scope.importConfig).then(function (data) {

                        scope.importConfig = data;

                        scope.$apply();

                        if (scope.importConfig.task_status === 'SUCCESS') {

                            resolve()

                        } else {

                            setTimeout(function () {
                                scope.importConfiguration(resolve);
                            }, 1000)

                        }

                    })

                };

                scope.pullUpdate = function ($event) {

                    scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    shareConfigurationFileService.getByKey(scope.layout.sourced_from_global_layout).then(function (data) {

                        var sharedFile = data;

                        scope.importConfig = {data: sharedFile.data, mode: 'overwrite'};

                        new Promise(function (resolve, reject) {

                            scope.importConfiguration(resolve)

                        }).then(function (data) {

                            toastNotificationService.success("Layout '" + scope.layout.name + "' was updated");

                        })

                    })

                };

                scope.makeCopy = function ($event) {

                    scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    var layout = JSON.parse(JSON.stringify(scope.layout))

                    layout.name = layout.name + '_copy';
                    layout.user_code = layout.user_code + '_copy';

                    layout.is_default = false;
                    layout.origin_for_global_layout = null;
                    layout.sourced_from_global_layout = null;

                    uiService.createDashboardLayout(layout).then(async function (data) {

                        scope.dashboardDataService.setLayoutToOpen(data);

                        scope.dashboardEventService.dispatchEvent(dashboardEvents.DASHBOARD_LAYOUT_CHANGE)

                        toastNotificationService.success("Dashboard Layout is Duplicated")


                    });

                };

                scope.exportLayout = function ($event) {

                    scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    $mdDialog.show({
                        controller: 'DashboardLayoutExportDialogController as vm',
                        templateUrl: 'views/dialogs/dashboard/dashboard-layout-export-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        locals: {
                            data: {layout: scope.layout}
                        }
                    })

                };

                scope.openInvites = function ($event) {

                    scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    $mdDialog.show({
                        controller: 'UiLayoutListInvitesDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-layout-list-invites-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        preserveScope: false,
                        locals: {
                            options: {
                                entityViewerDataService: scope.dashboardDataService,
                                entityViewerEventService: scope.dashboardEventService
                            }
                        }
                    })

                }

                scope.openLayoutList = function ($event) {

                    scope.dashboardEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    $mdDialog.show({
                        controller: 'DashboardLayoutListDialogController as vm',
                        templateUrl: 'views/dialogs/dashboard/layout-list-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        preserveScope: false,
                        locals: {
                            data: {
                                dashboardDataService: scope.dashboardDataService,
                                dashboardEventService: scope.dashboardEventService
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.dashboardDataService.setLayoutToOpen(res.data.layout);

                            scope.dashboardEventService.dispatchEvent(dashboardEvents.DASHBOARD_LAYOUT_CHANGE)


                        }

                    })

                };

                scope.getLayouts = function () {
                    scope.processing = true;
                    return uiService.getDashboardLayoutList({ pageSize: 1000 }).then(function (data) {
                        scope.layouts = data.results;
                        scope.processing = false;
                        scope.$apply();
                        return data.results; // Return the layouts for chaining
                    });
                };

                const init = async () => {

                    scope.getLayouts();

                }

                init();

            }
        }
    }
}());