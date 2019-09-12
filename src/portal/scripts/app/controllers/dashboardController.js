/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../services/uiService');

    var DashboardDataService = require('../services/dashboard/dashboardDataService');
    var DashboardEventService = require('../services/dashboard/dashboardEventService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.readyStatus = {data: false};
        vm.layout = null;

        vm.dashboardDataService = null;
        vm.dashboardEventService = null;

        vm.getDefaultLayout = function () {

            vm.readyStatus.data = false;

            // uiService.getDefaultDashboardLayout().then(function (data) {
            uiService.getDashboardLayout().then(function (data) {

                if (data.results.length) {
                    vm.layout = data.results[0];
                }

                console.log('vm.layout', vm.layout);

                vm.dashboardDataService.setData(vm.layout);

                vm.readyStatus.data = true;

                $scope.$apply();


            })

        };

        vm.init = function () {

            vm.dashboardDataService = new DashboardDataService();
            vm.dashboardEventService = new DashboardEventService();

            vm.getDefaultLayout();

        };

        vm.init();

    }

}());
