/**
 * Created by mevstratov on 24.06.2019.
 */
(function () {

    'use strict';

    var processesService = require('../../services/processesService');

    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();


    module.exports = function processesController($scope, $mdDialog) {

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

        vm.interval = null;


        vm.getData = function () {

            vm.readyStatus.data = false;

            return new Promise(function (resolve, reject) {

                processesService.getList(vm.options).then(function (data) {

                    vm.items = data.results;

                    vm.readyStatus.data = true;

                    resolve();

                    $scope.$apply();

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

            if (item.status === 'I') {
                return 'Init'
            }

            if (item.status === 'P') {
                return 'Running'
            }

            if (item.status === 'SUCCESS' || item.status === 'D') {
                return 'Done'
            }

            if (item.status === 'E') {
                return 'Error'
            }

            if (item.status === 'T') {
                return 'Timeout'
            }


            return 'Unknown'

        };

        vm.getStartedAt = function (item) {

            return new Date(item.started_at).toLocaleDateString() + ' ' + new Date(item.started_at).toLocaleTimeString()

        };

        vm.getProcessName = function (item) {

            var result = '';

            if (item.type === 'validate_simple_import') {
                result = 'Entity Import Validation';

                if (item.data) {
                    if (item.data.user_code) {
                        result = result + ': ' + item.data.user_code
                    }

                    if (item.data.file_name) {
                        result = result + '; File: ' + item.data.file_name
                    }
                }

            }

            if (item.type === 'simple_import') {
                result = 'Entity Import';

                if (item.data) {
                    if (item.data.user_code) {
                        result = result + ': ' + item.data.user_code
                    }

                    if (item.data.file_name) {
                        result = result + '; File: ' + item.data.file_name
                    }
                }
            }

            if (item.type === 'validate_transaction_import') {
                result = 'Transaction Import Validation';

                if (item.data) {
                    if (item.data.user_code) {
                        result = result + ': ' + item.data.user_code
                    }

                    if (item.data.file_name) {
                        result = result + '; File: ' + item.data.file_name
                    }
                }
            }

            if (item.type === 'transaction_import') {
                result = 'Transaction Import';

                if (item.data) {
                    if (item.data.user_code) {
                        result = result + ': ' + item.data.user_code
                    }

                    if (item.data.file_name) {
                        result = result + '; File: ' + item.data.file_name
                    }
                }
            }

            if (item.type === 'user_download_pricing') {
                result = 'User Triggered Prices Download'
            }

            if (item.type === 'configuration_import') {
                result = 'Configuration Import';
            }

            if (item.type === 'attribute_recalculation') {
                result = "Attribute Recalculation"
            }

            if (!result) {
                result = 'Unknown Task'
            }

            return result

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

                // $scope.$apply();

                vm.getData();

                // if (!vm.autoRefresh) {
                //
                //     vm.getData();
                // }

            })

        };

        vm.getFileUrl = function (id) {

            var prefix = baseUrlService.getMasterUserPrefix();
            var apiVersion = baseUrlService.getApiVersion();

            return baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'file-reports/file-report/' + id + '/view/';

        };

        vm.init = function () {

            vm.getData()

        };

        vm.init();

    };

}());