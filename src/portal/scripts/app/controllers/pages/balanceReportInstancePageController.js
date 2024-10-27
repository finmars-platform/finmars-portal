/**
 * Created by szhitenev on 29.01.2020.
 */
(function () {

    'use strict';

    var balanceReportInstanceService = require('../../services/balanceReportInstanceService').default;
    ;

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.readyStatus = {content: false};
        vm.items = [];

        vm.getList = function () {

            balanceReportInstanceService.getList({pageSize: 1000}).then(function (data) {

                vm.items = data.results.map(function (item) {
                    item.settings = JSON.stringify(JSON.parse(item.settings), null, 4)
                    return item
                });

                vm.readyStatus.content = true;

                $scope.$apply();

            })

        };

        vm.deleteItem = function ($event, item, $index) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "<p>Are you sure you want to delete Balance Report Instance <b>" + item.name + '</b>?</p>'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    balanceReportInstanceService.deleteByKey(item.id).then(function (value) {
                        vm.getList();
                    })

                }

            })

        };

        vm.init = function () {

            vm.getList();

        };

        vm.clearAllCache = async function () {

            vm.processing = true

            for (const item of vm.items) {

                await balanceReportInstanceService.deleteByKey(item.id)
            }

            vm.processing = false

            vm.getList();
        }

        vm.init();

    };

}());