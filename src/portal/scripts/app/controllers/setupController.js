/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../services/uiService');
    var usersService = require('../services/usersService');
    var usersGroupService = require('../services/usersGroupService');

    var backendConfigurationImportService = require('../services/backendConfigurationImportService');

    module.exports = function ($scope, $state) {

        var vm = this;

        vm.readyStatus = {content: false, member: false, groups: false};

        vm.currentStep = 1;
        vm.totalSteps = 2;

        vm.interface_level = null;
        vm.activeConfig = null;

        vm.finishingSetup = false;


        vm.finishStep1 = function () {

            vm.member.interface_level = vm.interface_level;

            usersService.updateOwnMemberSettings(vm.member.id, vm.member).then(function () {

                vm.currentStep = vm.currentStep + 1;

                $scope.$apply();
            })

        };

        vm.setActiveConfig = function (id) {

            if (vm.activeConfig !== id) {
                vm.activeConfig = id
            } else {
                vm.activeConfig = null;
            }
        };

        vm.finishSetup = function ($event) {

            vm.finishingSetup = true;

            if (vm.activeConfig === 'custom') {

                setTimeout(function () {

                    $state.go('app.home');

                }, 1000) // because its cool

            } else {

                var item = vm.items.find(function (item) {
                    return item.id === vm.activeConfig
                });

                vm.applyItem($event, item)
            }


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

            backendConfigurationImportService.importConfigurationAsJson(vm.importConfig).then(function (data) {

                vm.importConfig = data;

                vm.counter = data.processed_rows;
                vm.activeItemTotal = data.total_rows;

                $scope.$apply();

                if (vm.importConfig.task_status === 'SUCCESS') {

                    resolve()

                } else {

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

                $state.go('app.home');

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