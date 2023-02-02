/**
 * Created by szhitenev on 02.02.2023.
 */
(function () {

    'use strict';

    var processesService = require('../../services/processesService');

    var baseUrlService = require('../../services/baseUrlService');
    var utilsService = require('../../services/utilsService');

    var baseUrl = baseUrlService.resolve();


    module.exports = function systemPageController($scope, $mdDialog, globalDataService) {

        var vm = this;

        vm.processing = false;

        vm.getData = function () {

            vm.processing = true;

            utilsService.getSystemInfo().then(function (data) {
                vm.systemInfo = data;
                vm.processing = false;
                $scope.$apply();
            })

        }

        vm.init = function () {

            vm.getData();


        };

        vm.init();

    };

}());