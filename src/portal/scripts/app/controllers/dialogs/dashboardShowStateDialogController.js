/**
 * Created by szhitenev on 10.11.2023.
 */
(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.dashboardDataService = data.dashboardDataService;
        vm.dashboardEventService = data.dashboardEventService;

        vm.state = JSON.stringify(vm.dashboardDataService.getLayoutState(), null, 4);

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function (responseData) {

            let parsedState = JSON.parse(vm.state)

            // TODO update instead of create new
            if (parsedState) {
                parsedState['meta'] = {
                    'origin': 'finmars'
                }
            }

            vm.dashboardDataService.setLayoutState(parsedState)

            vm.dashboardEventService.dispatchEvent(dashboardEvents.DASHBOARD_STATE_CHANGE);
            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL);

            $mdDialog.hide({status: 'agree', data: {}});

        };
    }

}());