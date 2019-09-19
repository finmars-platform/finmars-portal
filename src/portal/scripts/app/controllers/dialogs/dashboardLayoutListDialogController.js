/**
 * Created by sergey on 04.11.16.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    var uiService = require('../../services/uiService');

    var middlewareService = require('../../services/middlewareService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.readyStatus = {items: false};
        var layoutsList = []; // list of layouts without properties added for rendering
        var selectedLayout = null;

        vm.getList = function () {

            uiService.getDashboardLayoutList().then(function (data) {
                vm.items = data.results;
                layoutsList = data.results;

                vm.readyStatus.items = true;
                $scope.$apply();
            });

        };

        vm.getList();

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
                        layoutName: layoutData.name
                    }
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    layoutData.name = res.data.name;
                    layout.name = res.data.name;

                    uiService.updateDashboardLayout(layoutData.id, layoutData).then(function () {

                        $scope.$apply()

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

                    uiService.deleteDashboardLayoutByKey(item.id).then(function (data) {
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

            if (!layoutData.is_default) {

                for (var i = 0; i < vm.items.length; i++) {
                    var layout = vm.items[i];

                    if (layout.is_default) {

                        layout.is_default = false;
                        layoutsList[i].is_default = false;

                        uiService.updateDashboardLayout(layoutsList[i].id, layoutsList[i]);
                        break;
                    }
                }

                layoutData.is_default = true;
                item.is_default = true;
                uiService.updateDashboardLayout(layoutData.id, layoutData);
            }
        };

        vm.isDefaultLayout = function (layout) {

            return layout.is_default
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            if (selectedLayout) {
                selectedLayout.is_active = true;

                uiService.updateDashboardLayout(selectedLayout.id, selectedLayout).then(function () {
                    $mdDialog.hide({status: 'agree', data: {layout: selectedLayout}});
                });

            } else {
                $mdDialog.hide({status: 'disagree'});
            }

        };

    }

}());