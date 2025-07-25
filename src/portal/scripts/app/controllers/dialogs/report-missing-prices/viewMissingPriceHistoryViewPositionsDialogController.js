/**
 * Created by szhitenev on 10.11.2020.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.data = data;

        vm.positions = [];

        vm.item = vm.data.item;

        vm.evDataService = vm.data.evDataService;

        vm.viewInstrument = function($event, item) {

            $mdDialog.show({
                controller: 'EntityViewerEditDialogController as vm',
                templateUrl: 'views/entity-viewer/entity-viewer-edit-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                multiple: true,
                locals: {
                    entityType: 'instrument',
                    entityId: item.id,
                    data: {}
                }
            })

        };

        vm.viewInstrumentPricingScheme = function($event, item) {

            $mdDialog.show({
                controller: 'InstrumentPricingSchemeEditDialogController as vm',
                templateUrl: 'views/dialogs/pricing/instrument-pricing-scheme-edit-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        item: {
                            id: item.pricing_scheme
                        }
                    }

                }
            })

        };

        vm.init = function () {

            vm.reportOptions = vm.evDataService.getReportOptions();
            vm.entityType = vm.evDataService.getEntityType();
            vm.layout = vm.evDataService.getListLayout();

            var flatList = vm.evDataService.getFlatList();

            console.log('flatList', flatList);


            vm.positions = flatList.filter(function (item) {

                return item['instrument.id'] === vm.item.id

            });

            console.log('vm.positions', vm.positions);
        };

        vm.init();

        vm.agree = function () {

            $mdDialog.hide({status: 'agree'});
        };
    }

}());