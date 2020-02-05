/**
 * Created by szhitenev on 05.02.2020.
 */
(function () {

    var pricingProcedureService = require('../../services/pricing/pricingProcedureService');


    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.procedures = [];

        vm.readyStatus = {data: false};

        vm.getList = function () {

            pricingProcedureService.getList().then(function (data) {

                vm.procedures = data.results;

                vm.readyStatus.data = true;

                $scope.$apply();

            })
        };

        vm.executeProcedure = function ($event, item) {

            console.log("Execute Procedure", item)

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