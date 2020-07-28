/**
 * Created by szhitenev on 28.07.2020.
 */
(function () {

    'use strict';


    var healthcheckService = require('../../services/healthcheckService');

    module.exports = function HealthcheckController($scope) {

        var vm = this;

        vm.readyStatus = {data: false};

        vm.dataBaseConnectionInfo = null;
        vm.updateInfo = null;
        vm.memoryInfo = null;

        vm.getData = function () {

            return new Promise(function (resolve, reject) {

                healthcheckService.getData().then(function (data) {

                    vm.healthcheckData = data;

                    console.log('HealthcheckController.vm.healthcheckData', vm.healthcheckData);

                    Object.keys(vm.healthcheckData.checks).forEach(function (key) {

                        var item = vm.healthcheckData.checks[key][0];

                        if (key === 'database:responseTime') {
                            vm.dataBaseConnectionInfo = item;
                        }

                        if (key === 'memory:utilization') {
                            vm.memoryInfo = item;
                        }

                        if (key === 'uptime') {
                            vm.updateInfo = item;

                            vm.updateInfo.hours = Math.floor(vm.updateInfo.observedValue / 60 / 60)
                        }


                    });

                    vm.readyStatus.data = true;

                    resolve();

                    $scope.$apply();

                })

            })

        };


        vm.init = function () {

            vm.getData()

        };

        vm.init();

    };

}());