/**
 * Created by sergey on 30.07.16.
 */
(function () {

    'use strict';

    var systemService = require('../services/systemService');
    var usersService = require('../services/usersService');

    // TODO resolve service from profile module
    var configurationImportService = require('../../../../portal/scripts/app/services/configuration-import/configurationImportService');


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
        vm.activeConfig = null;

        vm.finishingSetup = false;


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

        vm.finishSetup = function ($event) {

            vm.finishingSetup = true;

            usersService.createMasterUser({name: vm.name}).then(function (data) {

                usersService.setMasterUser(data.id).then(function (value) {

                    if (vm.activeConfig === 'custom') {

                        setTimeout(function () {

                            $state.go('app.home');

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


        vm.applyItem = function ($event, item) {

            var sections = item.data.body;

            console.log('vm.applyItem', items);
            var settings = {mode: 'skip'};

            var items = [];
            // var mappingItems = [];

            sections.forEach(function (item) {

                if (item.section_name === 'configuration') {
                    items = item.items;
                }


            });

            console.log("items", items);

            configurationImportService.importConfiguration(items, settings).then(function () {

                $state.go('app.home', {}, {reload: true});
            })


        };

        vm.init = function () {

            vm.getEcosystemConfigurationList();

        };

        vm.init()

    }

}());