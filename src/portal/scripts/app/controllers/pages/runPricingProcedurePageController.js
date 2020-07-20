/**
 * Created by szhitenev on 05.02.2020.
 */
(function () {

    var pricingProcedureService = require('../../services/pricing/pricingProcedureService');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');


    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.procedures = [];

        vm.readyStatus = {data: false};

        vm.getList = function () {

            pricingProcedureService.getList().then(function (data) {

                vm.procedures = data.results.map(function (item) {

                    item.user_price_date_from =  item.price_date_from_calculated;
                    item.user_price_date_to =  item.price_date_to_calculated;

                    return item
                });

                console.log('vm.procedures', vm.procedures);

                vm.readyStatus.data = true;

                $scope.$apply();

            })
        };

        vm.executeProcedure = function ($event, item) {

            console.log("Execute Procedure", item);

            pricingProcedureService.runProcedure(item.id, item).then(function (data) {

                toastNotificationService.success('Success. Procedure is being processed');


            })

        };

        vm.editProcedure = function ($event, item) {

            $mdDialog.show({
                controller: 'PricingProcedureEditDialogController as vm',
                templateUrl: 'views/dialogs/pricing/pricing-procedure-edit-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        item: item
                    }

                }
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getList();
                }

            })

        };


        vm.init = function () {

            vm.getList();

        };

        vm.init();

    };

}());