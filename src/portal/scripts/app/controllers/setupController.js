/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../services/uiService');
    var usersService = require('../services/usersService');

    var configurationImportService = require('../services/configuration-import/configurationImportService');

    module.exports = function ($scope, $state) {

        var vm = this;

        vm.readyStatus = {content: false};

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

            usersService.getOwnMemberSettings().then(function (data) {
                vm.member = data.results[0];


                console.log('vm.member', vm.member);

                vm.readyStatus.member = true;
                $scope.$apply();
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

                // if (item.section_name === 'mappings') {
                //     mappingItems = item.items;
                // }

            });

            // console.log("mappingItems", mappingItems);
            console.log("items", items);

            // vm.items.forEach(function (item) {
            //
            //     item.active = false;
            //
            //     item.content.forEach(function (child) {
            //         child.active = false;
            //     });
            //
            // });

            configurationImportService.importConfiguration(items, settings).then(function () {

                $state.go('app.home');
            })


        };

        vm.init = function () {

            vm.getMember();
            vm.getList();

        };

        vm.init();

    }

}());