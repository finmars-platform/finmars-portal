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

        vm.viewPositions = function($event, item) {

            $mdDialog.show({
                controller: 'ViewMissingPriceHistoryViewPositionsDialogController as vm',
                templateUrl: 'views/dialogs/report-missing-prices/view-missing-price-history-view-positions-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {
                        item: item,
                        items: vm.missingHistoryPrices,
                        evDataService: vm.evDataService
                    }
                }
            });

        };

        vm.init();

        vm.agree = function () {

            $mdDialog.hide({status: 'agree'});
        };
    }

}());