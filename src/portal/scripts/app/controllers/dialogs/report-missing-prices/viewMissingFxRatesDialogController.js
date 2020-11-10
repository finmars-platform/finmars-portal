/**
 * Created by szhitenev on 10.11.2020.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.data = data;

        vm.evDataService = vm.data.evDataService;
        vm.items = vm.data.items;

        vm.init = function () {

            vm.reportOptions = vm.evDataService.getReportOptions();
            vm.entityType = vm.evDataService.getEntityType();
            vm.layout = vm.evDataService.getListLayout()

        };

        vm.init();

        vm.agree = function () {

            $mdDialog.hide({status: 'agree'});
        };
    }

}());