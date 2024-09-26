/**
 * Created by szhitenev on 29.01.2020.
 */
(function () {

    'use strict';

    var pricingPolicyService = require('../../services/pricingPolicyService').default;;

    module.exports = function ($scope, $mdDialog, $state) {

        var vm = this;

        vm.readyStatus = {content: false};
        vm.items = [];

        vm.pricingPolicyId = null;

        vm.getList = async function () {

            const data = await pricingPolicyService.getList();

            vm.items = data.results;

            vm.readyStatus.content = true;

        };

        vm.editPricingPolicy = function (item) {

            $state.go($state.current.name, { id: item.id });

            $mdDialog.show({
                controller: 'PricingPolicyEditDialogController as vm',
                templateUrl: 'views/dialogs/pricing/pricing-policy-edit-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
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

                $state.go($state.current.name, { id: null });

                if(res.status === 'agree') {
                    vm.getList().then(() => {
                        $scope.apply();
                    });
                }

            })

        };

        vm.addPricingPolicy = function ($event) {

            $mdDialog.show({
                controller: 'PricingPolicyAddDialogController as vm',
                templateUrl: 'views/dialogs/pricing/pricing-policy-add-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {}

                }
            }).then(function (res) {

                if(res.status === 'agree') {
                    vm.getList().then(() => {
                        $scope.apply();
                    });
                }

            })

        };

        vm.deletePricingPolicy = function($event, item, $index){

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "<p>Are you sure you want to delete Pricing Policy <b>" + item.name + '</b>?</p><p>All Settings for instruments and currencies will be also deleted.</p>'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    pricingPolicyService.deleteByKey(item.id).then(function (value) {
                        vm.getList().then(() => {
                            $scope.apply();
                        });
                    })

                }

            })

        };

        vm.init = async function () {

            await vm.getList();

            vm.pricingPolicyId = parseInt($state.params.id);

            if (vm.pricingPolicyId) {

                const ppToEdit = vm.items.find(
                    pp => pp.id === vm.pricingPolicyId
                );

                if (ppToEdit) {

                    vm.editPricingPolicy(ppToEdit);

                } else {

                    console.warn(
                        "A pricing policy with the following id was not " +
                        `found: ${vm.pricingPolicyId}`
                    );

                }

            }

            $scope.$apply();

        };

        vm.init();

    };

}());