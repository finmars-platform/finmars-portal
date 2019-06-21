/**
 * Created by sergey on 04.11.16.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var uiService = require('../../../services/uiService');
    var metaContentTypesService = require('../../../services/metaContentTypesService');
    var middlewareService = require('../../../services/middlewareService');
    // var bookmarkService = require('../../../services/bookmarkService');

    module.exports = function ($scope, $mdDialog, options) {

        logService.controller('UiLayoutListDialogController', 'initalized');

        var vm = this;

        vm.readyStatus = {items: false};

        //var contentType = metaContentTypesService.getContentTypeUIByEntity(options.entityType);

        //console.log('contentType', contentType);

        vm.getList = function () {

            uiService.getListLayout(options.entityType).then(function (data) {
                vm.items = data.results;
                vm.readyStatus.items = true;
                $scope.$apply();
            });

        };

        var deleteLayout = function (layoutId) {

            uiService.deleteListLayoutByKey(layoutId).then(function (data) {
                vm.getList();
            });
        };

        vm.getList();

        vm.renameLayout = function (layout, $event) {

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
                        middlewareService.setData('entityActiveLayoutSwitched', true); // Give signal to update active layout name in the toolbar
                    });

                }

            })

        };

        vm.deleteItem = function (ev, item) {

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
                    // deleteLayout(item.id);
                }
            })
        };

        /*vm.selectLayout = function (item) {
            vm.items.forEach(function (item) {
                item.is_default = false;
            });

            item.is_default = true;
        };*/

        vm.setAsDefault = function (item) {
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
        };


        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {

            /*var promises = [];

            vm.items.forEach(function (item) {

                promises.push(uiService.updateListLayout(item.id, item));

            });

            Promise.all(promises).then(function () {

                $mdDialog.hide({status: 'agree'});

            });*/

            $mdDialog.hide({status: 'agree'});
        };

    }

}());