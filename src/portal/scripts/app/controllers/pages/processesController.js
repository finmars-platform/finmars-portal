/**
 * Created by mevstratov on 24.06.2019.
 */
(function () {

    'use strict';

    var processesService = require('../../services/processesService')

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.items = [];
        vm.readyStatus = {data: false};

        vm.showAll = false;
        vm.autoRefresh = true;

        vm.options = {
            filters: {
                task_status: 'P'
            }
        };

        // TODO Add pagination?


        vm.getData = function () {

            return new Promise(function (resolve, reject) {

                processesService.getList(vm.options).then(function (data) {

                    vm.items = data.results;

                    resolve();

                    $scope.$apply();

                    if (vm.autoRefresh) {

                        setTimeout(function () {
                            vm.getData();
                        }, 1000);

                    }

                })

            })

        };

        vm.toggleShowAll = function () {

            vm.showAll = !vm.showAll;

            if (vm.showAll) {
                delete vm.options.filters.task_status
            } else {
                vm.options.filters.task_status = 'P'
            }

            vm.getData();

        };

        vm.getStatus = function (item) {

            if (item.task_status === 'P') {
                return 'Pending'
            }

            if (item.task_status === 'SUCCESS') {
                return 'Success'
            }

            return 'Unknown'

        };

        vm.getTaskType = function (item) {

            if (item.task_type === 'validate_simple_import') {
                return 'Simple Entity Import Validation'
            }

            if (item.task_type === 'simple_import') {
                return 'Simple Entity Import'
            }

            if (item.task_type === 'validate_transaction_import') {
                return 'Transaction Validation'
            }

            if (item.task_type === 'transaction_import') {
                return 'Transaction Import'
            }

            return 'Unknown Task'

        };

        vm.getInfo = function (item) {

            if (item.data) {

                if (item.data.total_rows) {

                    return 'Progress: ' + item.data.processed_rows + '/' + item.data.total_rows

                }

            }

        };

        vm.delete = function (item) {

            processesService.deleteByKey(item.id).then(function (data) {

                if (!vm.autoRefresh) {

                    vm.getData();
                }

            })

        };

        vm.init = function () {

            vm.getData().then(function (data) {

                vm.readyStatus.data = true;

            })

        };

        vm.init();

    };

}());