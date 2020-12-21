(function () {

    const evEvents = require("../../services/entityViewerEvents");
    var popupEvents = require('../../services/events/popupEvents');

    var uiService = require('../../services/uiService');
    var middlewareService = require('../../services/middlewareService');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    'use strict';

    module.exports = function ($mdDialog, $state) {
        return {
            restrict: 'E',
            templateUrl: 'views/components/g-layouts-manager-view.html',
            scope: {
                entityType: '=',
                evDataService: '=',
                evEventService: '=',
            },
            link: function (scope) {
                console.log('#69 scope', scope)
                scope.layout = scope.evDataService.getListLayout()
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                scope.layouts = [];

                scope.deleteItem = function (ev) {

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/warning-dialog-view.html',
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

                            uiService.deleteListLayoutByKey(scope.layout.id).then(async function (data) {

                                scope.layouts = await getLayouts();

                                scope.$apply();
                            });
                        }
                    })
                };

                scope.openLayout = (layout) => {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

/*                    if (layout.user_code) {

                        middlewareService.setNewEntityViewerLayoutName(layout.user_code); // Give signal to update active layout name in the toolbar
                        $state.transitionTo($state.current, {layoutUserCode: layout.user_code});

                    } else {

                        const errorText = 'Layout "' + layout.name + '" has no user code.';
                        toastNotificationService.error(errorText);

                    }*/


                    if (scope.isRootEntityViewer) {

                        if (layout.user_code) {

                            middlewareService.setNewEntityViewerLayoutName(layout.name); // Give signal to update active layout name in the toolbar
                            $state.transitionTo($state.current, {layoutUserCode: layout.user_code});

                        } else {
                            var errorText = 'Layout "' + layout.name + '" has no user code.';
                            toastNotificationService.error(errorText);
                        }

                    } else {
                        middlewareService.setNewSplitPanelLayoutName(layout.name); // Give signal to update active layout name in the toolbar

                        scope.evDataService.setSplitPanelLayoutToOpen(layout.id);
                        scope.evEventService.dispatchEvent(evEvents.LIST_LAYOUT_CHANGE);
                    }

                };

                scope.setAsDefault = () => {

                    scope.layouts.forEach(layout => {

                        layout.is_default = layout.id === scope.layout.id;

                    });

                    uiService.updateListLayout(scope.layout.id, scope.layout).then(function (data) {

                        debugger;

                        // needed to update is_default on front-end
                        scope.layout = scope.evDataService.getListLayout();
                        const activeLayoutConfig = scope.evDataService.getActiveLayoutConfiguration();

                        scope.layout.is_default = true;
                        scope.layout.modified = data.modified;
                        activeLayoutConfig.is_default = true;


                        scope.evDataService.setListLayout(scope.layout);
                        scope.evDataService.setActiveLayoutConfiguration({layoutConfig: activeLayoutConfig});

                        scope.evEventService.dispatchEvent(evEvents.DEFAULT_LAYOUT_CHANGE);

                    });


/*
                    $event.stopPropagation();

                    var layoutData = layoutsList[index];

                    if (isRootEntityViewer) {

                        if (!layoutData.is_default) {

                            for (var i = 0; i < vm.items.length; i++) {

                                var layout = vm.items[i];

                                if (layout.is_default) {

                                    layout.is_default = false;
                                    layoutsList[i].is_default = false;
                                    break;
                                }

                            }

                            layoutData.is_default = true;
                            item.is_default = true;

                            uiService.updateListLayout(layoutData.id, layoutData).then(function (data) {

                                // needed to update is_default on front-end
                                var listLayout = entityViewerDataService.getListLayout();
                                var activeLayoutConfig = entityViewerDataService.getActiveLayoutConfiguration();

                                if (listLayout.id === layoutData.id) { // if active layout made default

                                    listLayout.is_default = true
                                    listLayout.modified = data.modified
                                    activeLayoutConfig.is_default = true
                                    activeLayoutConfig.is_default = true

                                } else {

                                    listLayout.is_default = false
                                    activeLayoutConfig.is_default = false

                                }

                                entityViewerDataService.setListLayout(listLayout);
                                entityViewerDataService.setActiveLayoutConfiguration({layoutConfig: activeLayoutConfig});

                                entityViewerEventService.dispatchEvent(evEvents.DEFAULT_LAYOUT_CHANGE);

                            });

                        }

                    } else if (layoutData.id !== splitPanelLayoutId) {

                        var defaultLayoutData = {
                            layoutId: layoutData.id,
                            name: layoutData.name,
                            content_type: layoutData.content_type
                        };

                        entityViewerDataService.setSplitPanelDefaultLayout(defaultLayoutData);
                        entityViewerEventService.dispatchEvent(evEvents.SPLIT_PANEL_DEFAULT_LIST_LAYOUT_CHANGED);
                        splitPanelLayoutId = layoutData.id;

                    }
*/


                };

                const getLayouts = async () => {

                    const {results} = await uiService.getListLayout(scope.entityType, {pageSize: 1000});

                    console.log('#69 getLayouts', results);

                    return results;

                };

                const init = async () => {

                    scope.layouts = await getLayouts();

                    scope.$apply();

                }

                init();

            }
        }
    }
}());