/**
 * Created by mevstratov on 11.08.2021.
 */
// import websocketService from '../../../../../shell/scripts/app/services/websocketService.js';

(function () {

    'use strict';

    var baseUrlService = require("../../services/baseUrlService").default;

    var csvImportSchemeService = require('../../services/import/csvImportSchemeService');

    var unifiedEntityImportService = require('../../services/import/unifiedEntityImportService');


    // var baseUrlService = require('../../services/baseUrlService');
    // var usersService = require('../../services/usersService');

    // var websocketService = require('../../services/websocketService');

    var baseUrl = baseUrlService.resolve();


    module.exports = function unifiedEntityImportController($scope, $mdDialog, usersService, metaContentTypesService) {

        var vm = this;

        vm.readyStatus = {
            schemes: false,
            processing: false
        };

        vm.dataIsImported = false;
        vm.activeContentType = null;

        vm.config = {
            mode: 'overwrite'
        };
        // vm.processing = false;
        vm.loaderData = {};

        vm.hasSchemeEditPermission = false;

        vm.modes = [
            {
                id: 'skip',
                name: 'Skip'
            },
            {
                id: 'overwrite',
                name: 'Overwrite'
            }
        ]

        vm.loadIsAvailable = function () {
            if (vm.config.file !== null && vm.config.file !== undefined) {
                return true;
            }
            return false;
        };

        vm.contentTypes = metaContentTypesService.getListForSimpleEntityImport();

        vm.checkExtension = function (file, extension, $event) {

            if (file) {

                var ext = file.name.split('.').at(-1);

                if (ext !== extension) {

                    $mdDialog.show({
                        controller: 'SuccessDialogController as vm',
                        templateUrl: 'views/dialogs/success-dialog-view.html',
                        targetEvent: $event,
                        locals: {
                            success: {
                                title: "Warning!",
                                description: 'You are trying to load incorrect file'
                            }
                        },
                        multiple: true,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    }).then(function () {

                        vm.config.file = null;

                    });

                }

            }

        };

        vm.getFileUrl = function (id) {

            var prefix = baseUrlService.getMasterUserPrefix();
            var apiVersion = baseUrlService.getApiVersion();

            return baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'file-reports/file-report/' + id + '/view/';
        };

        vm.import = function (resolve, reject, $event) {

            vm.readyStatus.processing = true;

            var formData = new FormData();

            if (vm.config.task_id) {

                formData.append('task_id', vm.config.task_id);

            } else {

                formData.append('file', vm.config.file);
                formData.append('mode', vm.config.mode);

            }

            unifiedEntityImportService.startImport(formData).then(function (data) {

                vm.config = data;

                vm.loaderData = {
                    current: vm.config.processed_rows,
                    total: vm.config.total_rows,
                    text: 'Import Progress:',
                    status: vm.config.task_status
                };

                $scope.$apply();

                if (vm.config.task_status === 'SUCCESS') {

                    console.log('resolve?');

                    resolve(data)

                } else {

                    setTimeout(function () {
                        vm.import(resolve, reject, $event);
                    }, 1000)

                }
                /*if (websocketService.isOnline()) {

                    websocketService.addEventListener('simple_import_status', function (data) {

                        if (vm.config.task_id === data.task_id) {

                            vm.loaderData = {
                                current: data.processed_rows,
                                total: data.total_rows,
                                text: 'Import Progress:',
                                status: data.state
                            };

                            $scope.$apply();

                            if (data.state === 'D') {
                                websocketService.removeEventListener('simple_import_status');
                                resolve(data)
                            } else {
                                if (data.state !== 'D' && data.state !== 'P') {
                                    websocketService.removeEventListener('simple_import_status');
                                    resolve(data);
                                }
                            }

                        }

                    })

                } else {

                    if (vm.config.task_status === 'SUCCESS') {

                        console.log('resolve?');

                        resolve(data)

                    } else {

                        setTimeout(function () {
                            vm.import(resolve, reject, $event);
                        }, 1000)

                    }

                }*/


            })
                .catch(function (e) {
                    reject(e);
                });

        };

        vm.startImport = function ($event) {

            new Promise(function (resolve, reject) {

                delete vm.config.task_id;
                delete vm.config.task_status;

                // vm.processing = true;
                vm.readyStatus.processing = true;

                vm.loaderData = {
                    current: vm.config.processed_rows,
                    total: vm.config.total_rows,
                    text: 'Import Progress:',
                    status: vm.config.task_status
                };

                vm.import(resolve, reject, $event)

            })
                .then(function (data) {

                    vm.config = {};

                    // vm.processing = false;
                    vm.readyStatus.processing = false;

                    console.log('import.data', data);

                    vm.readyStatus.processing = false;
                    vm.dataIsImported = true;

                    $scope.$apply();


                    var description = '';

                    description = description + '<div> You have successfully imported csv file </div>';

                    description = description + '<div><a href="' + vm.getFileUrl(data.stats_file_report) + '" download>Download Report File</a></div>';

                    $mdDialog.show({
                        controller: 'SuccessDialogController as vm',
                        templateUrl: 'views/dialogs/success-dialog-view.html',
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            success: {
                                title: "Success",
                                description: description
                            }
                        }

                    });


                })
                .catch(function (e) {
                    vm.readyStatus.processing = false;
                    $scope.$apply();
                });

        };

        vm.getMember = function () {

            usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                if (vm.currentMember.is_admin) {
                    vm.hasSchemeEditPermission = true
                }

                vm.currentMember.groups_object.forEach(function (group) {

                    if (group.permission_table) {

                        group.permission_table.configuration.forEach(function (item) {

                            if (item.content_type === 'csv_import.csvimportscheme') {
                                if (item.data.creator_change) {
                                    vm.hasSchemeEditPermission = true
                                }
                            }

                        })

                    }

                });

                $scope.$apply();

            });

        };

        vm.init = function () {

            vm.getMember();

        };

        vm.init();

    };

}());