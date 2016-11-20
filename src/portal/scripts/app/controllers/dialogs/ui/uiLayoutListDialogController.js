/**
 * Created by sergey on 04.11.16.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var uiService = require('../../../services/uiService');
    var metaContentTypesService = require('../../../services/metaContentTypesService');

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

        vm.getList();

        vm.deleteItem = function (ev, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: 'Are you sure to delete layout?'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {
                if (res.status === 'agree') {
                    uiService.deleteListLayoutByKey(item.id).then(function (data) {
                        vm.getList();
                    });
                }
            })
        };

        vm.selectLayout = function (item) {
            vm.items.forEach(function (item) {
                item.is_default = false;
            });

            item.is_default = true;
        };


        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {

            var promises = [];

            vm.items.forEach(function (item) {

                promises.push(uiService.updateListLayout(item.id, item));

            });

            Promise.all(promises).then(function () {

                $mdDialog.hide({status: 'agree'});

            });
        };

    }

}());