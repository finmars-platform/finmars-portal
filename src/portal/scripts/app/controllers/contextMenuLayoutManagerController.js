/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../services/uiService').default;

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.items = [];
        vm.readyStatus = {data: false};

        vm.getData = function () {

            uiService.getContextMenuLayoutList().then(function (data) {

                vm.items = data.results;

                vm.readyStatus.data = true;

                $scope.$apply();

            })

        };

        vm.deleteItem = function ($event, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                multiple: true,
                skipHide: true,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: 'Are you sure you want to delete context menu layout ' + item.name + '?'
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {

                    uiService.deleteContextMenuLayoutByKey(item.id).then(function () {

                        vm.getData();

                    })

                }
            });


        };

        vm.init = function () {

            vm.readyStatus.data = false;

            vm.getData();

        };

        vm.init();

    }

}());
