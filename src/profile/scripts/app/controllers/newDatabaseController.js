/**
 * Created by sergey on 30.07.16.
 */
(function () {

    'use strict';

    var systemService = require('../services/systemService');
    var usersService = require('../services/usersService');

    // TODO resolve service from profile module
    var backendConfigurationImportService = require('../services/backendConfigurationImportService')

    module.exports = function ($scope, $state) {

        var vm = this;

        vm.readyStatus = {ecosystemConfigurations: false};

        vm.getEcosystemConfigurationList = function () {

            systemService.getEcosystemConfiguration().then(function (data) {

                vm.ecosystemConfigurations = data.results;

                vm.readyStatus.ecosystemConfigurations = true;

                $scope.$apply();

            })

        };

        vm.currentStep = 1;
        vm.totalSteps = 2;

        vm.interface_level = null;
        // vm.activeConfig = null;
        vm.activeConfig = 'custom'

        vm.finishingSetup = false;

        vm.name = '';
        vm.description = '';

        vm.nameIsUnique = true;


        vm.finishStep1 = function () {

            vm.currentStep = vm.currentStep + 1;

        };

        vm.setActiveConfig = function (id) {

            if (vm.activeConfig !== id) {
                vm.activeConfig = id
            } else {
                vm.activeConfig = null;
            }
        };

        vm.checkUniqueness = function(){

            vm.processingCheckName = true;

            usersService.checkMasterUserUniqueness(vm.name).then(function (data) {

                console.log('data', data);

                if(data.hasOwnProperty('unique')) {
                    vm.nameIsUnique = data.unique
                }

                vm.processingCheckName = false;

                $scope.$apply();

            })

        };

        vm.finishSetup = function ($event) {

            vm.finishingSetup = true;

            usersService.createMasterUser({name: vm.name, description: vm.description}).then(function (data) {

                usersService.setMasterUser(data.id).then(function (value) {

                    if (vm.activeConfig === 'custom') {

                        setTimeout(function () {

                            $state.go('app.home', {}, {reload: true});

                        }, 1000) // because its cool

                    } else {

                        var item = vm.ecosystemConfigurations.find(function (item) {
                            return item.id === vm.activeConfig
                        });

                        vm.applyItem($event, item)
                    }

                })



            });

        };

        vm.importConfiguration = function(resolve){

            backendConfigurationImportService.importConfigurationAsJson(vm.importConfig).then(function (data) {

                vm.importConfig = data;

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
                data: item.data
            };

            new Promise(function (resolve, reject) {

                vm.importConfiguration(resolve)

            }).then(function (data) {

                $state.go('app.home', {}, {reload: true});

            })


        };

        vm.init = function () {

            vm.getEcosystemConfigurationList();

        };

        vm.init()

    }

}());