/**
 * Created by szhitenev on 04.11.16.
 */
(function () {

    'use strict';

    var evEvents = require('../../../services/entityViewerEvents');

    var uiService = require('../../../services/uiService');

    var middlewareService = require('../../../services/middlewareService');

    var inviteToSharedConfigurationFileService = require('../../../services/inviteToSharedConfigurationFileService');
    var shareConfigurationFileService = require('../../../services/shareConfigurationFileService');
    var backendConfigurationImportService = require('../../../services/backendConfigurationImportService');

    module.exports = function ($scope, $mdDialog, options) {

        var vm = this;

        vm.readyStatus = {items: false};
        var layoutsList = []; // list of layouts without properties added for rendering
        var selectedLayout = null;

        var entityViewerDataService = options.entityViewerDataService;
        var entityViewerEventService = options.entityViewerEventService;

        var isRootEntityViewer = entityViewerDataService.isRootEntityViewer();
        var splitPanelLayoutId = null;

        if (!isRootEntityViewer) {
            var spDefaultLayoutData = entityViewerDataService.getSplitPanelDefaultLayout();
            splitPanelLayoutId = spDefaultLayoutData.layoutId;
        }

        vm.invites = [];

        //var contentType = metaContentTypesService.getContentTypeUIByEntity(options.entityType);

        //console.log('contentType', contentType);

        vm.getList = function () {

            return new Promise(function (resolve, reject) {

                uiService.getListLayout(options.entityType).then(function (data) {
                    vm.items = data.results;
                    layoutsList = data.results;

                    vm.items.forEach(function (item) {

                        if (Array.isArray(item.data.filters)) {
                            var f;
                            for (f = 0; f < item.data.filters.length; f++) {
                                var filter = item.data.filters[f];

                                if (filter.options.hasOwnProperty('use_from_above')) {
                                    item.hasUseFromAboveFilter = true;
                                    break;
                                }


                            }

                        }


                    });

                    resolve();

                    vm.readyStatus.items = true;
                    $scope.$apply();
                });

            })
        };

        vm.renameLayout = function ($event, layout, index) {

            $event.stopPropagation();

            var layoutData = layoutsList[index];

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

                    layoutData.name = res.data.name;
                    layout.name = res.data.name;
                    layoutData.user_code = res.data.user_code;
                    layout.user_code = res.data.user_code;

                    uiService.updateListLayout(layoutData.id, layoutData).then(function () {

                        var listLayout = entityViewerDataService.getListLayout();
                        listLayout.name = layoutData.name;
                        entityViewerDataService.setListLayout(listLayout);

                        if (isRootEntityViewer) {
                            middlewareService.setNewEntityViewerLayoutName(layoutData.name); // Give signal to update active layout name in the toolbar
                        } else {
                            middlewareService.setNewSplitPanelLayoutName(layoutData.name); // Give signal to update active layout name in the toolbar
                        }

                        entityViewerEventService.dispatchEvent(evEvents.LAYOUT_NAME_CHANGE);

                    });

                }

            })

        };

        vm.deleteItem = function (ev, item) {

            ev.stopPropagation();

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

                    uiService.deleteListLayoutByKey(item.id).then(function (data) {
                        vm.getList();
                    });
                }
            })
        };

        vm.selectLayout = function (layout, $event) {
            $event.stopPropagation();

            if (!selectedLayout || layout.id !== selectedLayout.id) {

                var selectedElem = $event.currentTarget;
                var layoutsItemsList = document.querySelectorAll('.ll-layout-item');

                layoutsItemsList.forEach(function (layoutItem) {
                    if (layoutItem.classList.contains('active')) {
                        layoutItem.classList.remove('active');
                    }


                });

                selectedElem.classList.add('active');
                selectedLayout = layout;
            }

        };

        vm.setAsDefault = function ($event, item, index) {

            $event.stopPropagation();

            var layoutData = layoutsList[index];

            if (isRootEntityViewer) {

                if (!layoutData.is_default) {

                    for (var i = 0; i < vm.items.length; i++) {
                        var layout = vm.items[i];

                        if (layout.is_default) {

                            layout.is_default = false;
                            layoutsList[i].is_default = false;

                            uiService.updateListLayout(layoutsList[i].id, layoutsList[i]);
                            break;
                        }
                    }

                    layoutData.is_default = true;
                    item.is_default = true;
                    uiService.updateListLayout(layoutData.id, layoutData);

                    // needed to update is_default on front-end
                    var listLayout = entityViewerDataService.getListLayout();
                    var activeLayoutConfig = entityViewerDataService.getActiveLayoutConfiguration();

                    if (listLayout.id === layoutData.id) {
                        listLayout.is_default = true;
                        activeLayoutConfig.is_default = true;
                    } else {
                        listLayout.is_default = false;
                        activeLayoutConfig.is_default = false;
                    }

                    entityViewerDataService.setListLayout(listLayout);
                    entityViewerDataService.setActiveLayoutConfiguration({layoutConfig: activeLayoutConfig});

                    entityViewerEventService.dispatchEvent(evEvents.DEFAULT_LAYOUT_CHANGE);

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
        };

        vm.isDefaultLayout = function (layout) {

            if (isRootEntityViewer) {

                if (layout.is_default) {
                    return true;
                }

                return false;

            } else {

                if (splitPanelLayoutId) {

                    if (splitPanelLayoutId === layout.id) {
                        return true
                    }

                    return false;

                } else { // if there is no specific layout for split panel, show default entity layout

                    if (layout.is_default) {
                        return true;
                    }

                    return false;
                }

            }
        };

        vm.shareLayout = function ($event, item) {

            var type = 'entity_viewer';

            if (entityViewerDataService.getEntityType().indexOf('report') !== -1) {
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
                        layout: item,
                        type: type
                    }
                }

            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getList();
                }

            })

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            if (selectedLayout) {

                $mdDialog.hide(
                    {
                        status: 'agree',
                        data: {
                            layoutName: selectedLayout.name,
                            layoutId: selectedLayout.id,
                            layoutUserCode: selectedLayout.user_code
                        }
                    }
                );

            } else {
                $mdDialog.hide({status: 'disagree'});
            }

        };

        vm.acceptInvite = function ($event, invite) {

            console.log("Accept invite: ", $event, invite);

            invite.status = 1;

            inviteToSharedConfigurationFileService.updateMyInvite(invite.id, invite).then(function (data) {

                var sharedFile = data;

                vm.importConfig = {data: sharedFile.shared_configuration_file_object.data, mode: 'overwrite'};

                new Promise(function (resolve, reject) {

                    vm.importConfiguration(resolve)

                }).then(function (data) {

                    console.log("Import Finished");

                    vm.getInvites();

                    vm.getList().then(function (data) {

                        vm.items.forEach(function (item) {

                            if (item.name === sharedFile.shared_configuration_file_object.name) {
                                item.sourced_from_global_layout = sharedFile.shared_configuration_file;

                                uiService.updateListLayout(item.id, item).then(function (value) {


                                    vm.getList().then(function (value1) {

                                        $mdDialog.show({
                                            controller: 'InfoDialogController as vm',
                                            templateUrl: 'views/info-dialog-view.html',
                                            parent: angular.element(document.body),
                                            targetEvent: $event,
                                            clickOutsideToClose: false,
                                            preserveScope: true,
                                            autoWrap: true,
                                            skipHide: true,
                                            multiple: true,
                                            locals: {
                                                info: {
                                                    title: 'Success',
                                                    description: "Layout is installed"
                                                }
                                            }
                                        })

                                    })

                                })

                            }

                        })

                    })

                });

            })

        };

        vm.declineInvite = function ($event, invite) {

            console.log("Decline invite: ", $event, invite);

            invite.status = 2;

            inviteToSharedConfigurationFileService.updateMyInvite(invite.id, invite).then(function (value) {

                vm.getInvites();

            })

        };

        vm.importConfiguration = function (resolve) {

            backendConfigurationImportService.importConfigurationAsJson(vm.importConfig).then(function (data) {

                vm.importConfig = data;

                $scope.$apply();

                if (vm.importConfig.task_status === 'SUCCESS') {

                    resolve()

                } else {

                    setTimeout(function () {
                        vm.importConfiguration(resolve);
                    }, 1000)

                }

            })

        };

        vm.pullUpdate = function ($event, item, $index) {

            console.log("Pull Update for Layout:", item);

            shareConfigurationFileService.getByKey(item.sourced_from_global_layout).then(function (data) {

                var sharedFile = data;

                vm.importConfig = {data: sharedFile.data, mode: 'overwrite'};

                new Promise(function (resolve, reject) {

                    vm.importConfiguration(resolve)

                }).then(function (data) {

                    console.log("Import Finished");

                    vm.getList().then(function (value) {

                        $mdDialog.show({
                            controller: 'InfoDialogController as vm',
                            templateUrl: 'views/info-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: $event,
                            clickOutsideToClose: false,
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true,
                            multiple: true,
                            locals: {
                                info: {
                                    title: 'Success',
                                    description: "Layout is updated"
                                }
                            }
                        })

                    })

                })

            })

        };

        vm.getInvites = function () {

            inviteToSharedConfigurationFileService.getListOfMyInvites({
                filters: {
                    status: '0'
                }
            }).then(function (data) {

                vm.invites = data.results;

                console.log('vm.invites', vm.invites);

                $scope.$apply();

            })

        };

        vm.init = function () {

            vm.getInvites();
            vm.getList();

        };

        vm.init();

    }

}());