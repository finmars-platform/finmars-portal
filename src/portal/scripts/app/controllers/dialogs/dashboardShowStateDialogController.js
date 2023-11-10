/**
 * Created by szhitenev on 10.11.2023.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.dashboardDataService = data.dashboardDataService;
        vm.dashboardEventService = data.dashboardEventService;

        vm.state = JSON.stringify(vm.dashboardDataService.getAllComponentsOutputs(), null, 4);

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function (responseData) {

            $mdDialog.hide({status: 'agree', data: {}});

        };
    }

}());