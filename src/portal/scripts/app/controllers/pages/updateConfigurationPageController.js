/**
 * Created by szhitenev on 15.09.2021.
 */
(function () {

    'use strict';

    var uiService = require('../../services/uiService');
    // var usersService = require('../services/usersService');
    // var usersGroupService = require('../services/usersGroupService');

    // var backendConfigurationImportService = require('../services/backendConfigurationImportService');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    module.exports = function ($scope, $state, usersService, usersGroupService, backendConfigurationImportService) {

        var vm = this;

        vm.readyStatus = {content: false, member: false, groups: false};
        vm.processing = false;

        vm.setActiveConfig = function ($event, id) {

            var item = vm.items.find(function (item) {
                return item.id === id
            });

            vm.applyItem($event, item)
        };

        vm.getMember = function () {

            return usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                usersService.getOwnMemberSettings().then(function (data) {
                    vm.member = data.results[0];


                    console.log('vm.member', vm.member);

                    vm.readyStatus.member = true;
                    $scope.$apply();
                });

            });

        };

        vm.getGroupList = function () {

            return usersGroupService.getList().then(function (data) {

                vm.groups = data.results.filter(function (item) {

                    return item.role === 2;

                });

                vm.readyStatus.groups = true;

            });

        };

        vm.getList = function () {

            vm.readyStatus.content = false;

            uiService.getConfigurationList().then(function (data) {

                vm.items = data.results;

                console.log('vm.items', vm.items);

                vm.readyStatus.content = true;

                $scope.$apply();

            })

        };

        vm.importConfiguration = function (resolve) {

            vm.processing = true;

            backendConfigurationImportService.importConfigurationAsJson(vm.importConfig).then(function (data) {

                vm.importConfig = data;

                vm.counter = data.processed_rows;
                vm.activeItemTotal = data.total_rows;



                if (vm.importConfig.task_status === 'SUCCESS') {

                    vm.processing = false;
                    
                    $scope.$apply();

                    resolve()

                } else {

                    $scope.$apply();

                    setTimeout(function () {
                        vm.importConfiguration(resolve);
                    }, 1000)

                }

            })

        };

        vm.applyItem = function ($event, item) {

            vm.importConfig = {
                data: item.data,
                mode: 'overwrite'
            };

            new Promise(function (resolve, reject) {

                vm.importConfiguration(resolve)

            }).then(function (value) {

                toastNotificationService.info("Configuration is applied")

            })


        };

        vm.init = function () {

            vm.getMember();
            vm.getGroupList();
            vm.getList();

        };

        vm.init();

    }

}());