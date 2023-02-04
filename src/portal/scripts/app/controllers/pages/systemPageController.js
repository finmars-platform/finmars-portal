/**
 * Created by szhitenev on 02.02.2023.
 */
(function () {

    'use strict';

    var processesService = require('../../services/processesService');

    var baseUrlService = require('../../services/baseUrlService');
    var utilsService = require('../../services/utilsService');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');

    var baseUrl = baseUrlService.resolve();




    module.exports = function systemPageController($scope, $mdDialog, globalDataService) {

        var vm = this;

        vm.processing = false;

        vm.readyStatus = {
            stats: false,
            logs: false
        }


        vm.getStats = function () {

            vm.readyStatus.stats = false;

            utilsService.getSystemInfo().then(function (data) {
                vm.systemInfoItems = data.results;
                vm.readyStatus.stats = true;
                $scope.$apply();
            })

        }

        vm.getLogs = function () {

            vm.readyStatus.logs = false;

            utilsService.getSystemLogs().then(function (data) {

                vm.logFiles = data.results;

                vm.readyStatus.logs = true;
                $scope.$apply()

            })

        }

        vm.previewLog = function ($event, log_file_name) {

            utilsService.getSystemLog(log_file_name).then(function (data) {

                $mdDialog.show({
                    controller: 'FilePreviewDialogController as vm',
                    templateUrl: 'views/dialogs/file-preview-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        data: {
                            content: data,
                            file_descriptor: {
                                name: log_file_name
                            }
                        }
                    }
                });


            })

        }

        vm.downloadLog = function ($event, log_file_name) {

            utilsService.getSystemLog(log_file_name).then(function (data) {

                downloadFileHelper.downloadFile(data, "plain/text", log_file_name);

            })

        }

        vm.init = function () {

            vm.getStats();
            vm.getLogs()


        };

        vm.init();

    };

}());