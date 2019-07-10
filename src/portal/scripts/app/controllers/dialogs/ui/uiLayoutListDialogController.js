/**
 * Created by sergey on 04.11.16.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');
    var evEvents = require('../../../services/entityViewerEvents');

    var uiService = require('../../../services/uiService');

    var middlewareService = require('../../../services/middlewareService');

    module.exports = function ($scope, $mdDialog, options) {

        logService.controller('UiLayoutListDialogController', 'initalized');

        var vm = this;

        vm.readyStatus = {items: false};
        var selectedLayout = null;
        var entityViewerDataService = options.entityViewerDataService;
        var entityViewerEventService = options.entityViewerEventService;
        var isRootEntityViewer = entityViewerDataService.isRootEntityViewer();
        var splitPanelLayoutId = null;

        if (!isRootEntityViewer) {
            splitPanelLayoutId = entityViewerDataService.getSplitPanelDefaultLayout();
        }
console.log("sp save as splitPanelLayoutId", splitPanelLayoutId);
        //var contentType = metaContentTypesService.getContentTypeUIByEntity(options.entityType);

        //console.log('contentType', contentType);

        vm.getList = function () {

            uiService.getListLayout(options.entityType).then(function (data) {
                vm.items = data.results;
                vm.readyStatus.items = true;
                $scope.$apply();
            });

        };

        vm.getList();

        vm.renameLayout = function (layout, $event) {

            $event.stopPropagation();

            $mdDialog.show({
                controller: 'UiLayoutSaveAsDialogController as vm',
                templateUrl: 'views/dialogs/ui/ui-layout-save-as-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                multiple: true,
                clickOutsideToClose: false,
                locals: {
                    options: {
                        layoutName: layout.name
                    }
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    layout.name = res.data.name;
                    uiService.updateListLayout(layout.id, layout).then(function () {
                        if (isRootEntityViewer) {
                            middlewareService.setData('entityActiveLayoutSwitched', true); // Give signal to update active layout name in the toolbar
                        } else {
                            middlewareService.setData('splitPanelActiveLayoutSwitched', true); // Give signal to update active layout name in the toolbar
                        }

                    });

                }

            })

        };

        vm.deleteItem = function (ev, item, $event) {

            $event.stopPropagation();

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
                    };

                });

                selectedElem.classList.add('active');
                selectedLayout = layout;
            }

        };

        vm.setAsDefault = function (item, $event) {

            $event.stopPropagation();

            if (isRootEntityViewer) {
                if (!item.is_default) {
                    vm.items.forEach(function (layout) {

                        if (layout.is_default) {
                            layout.is_default = false;
                            uiService.updateListLayout(layout.id, layout);
                        }

                    });

                    item.is_default = true;

                    uiService.updateListLayout(item.id, item);
                }

            } else if (item.id !== splitPanelLayoutId) {

                entityViewerDataService.setSplitPanelDefaultLayout(item.id);
                entityViewerEventService.dispatchEvent(evEvents.SPLIT_PANEL_DEFAULT_LIST_LAYOUT_CHANGED);
                splitPanelLayoutId = item.id;

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

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            if (selectedLayout) {
                selectedLayout.is_active = true;
                uiService.updateListLayout(selectedLayout.id, selectedLayout).then(function () {
                    $mdDialog.hide({status: 'agree', data: {layoutName: selectedLayout.name}});
                });

            } else {
                $mdDialog.hide({status: 'disagree'});
            }

        };

    }

}());