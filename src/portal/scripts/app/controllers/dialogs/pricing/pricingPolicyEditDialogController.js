'use strict';

import pricingPolicyService from '../../../services/pricingPolicyService';
import currencyPricingSchemeService from '../../../services/pricing/currencyPricingSchemeService';
import instrumentPricingSchemeService from '../../../services/pricing/instrumentPricingSchemeService';

export default function ($scope, $mdDialog, toastNotificationService, data) {

    var vm = this;

    vm.itemId = data.item.id;

    vm.item = {};

    vm.currencyPricingSchemes = [];
    vm.instrumentPricingSchemes = [];

    vm.readyStatus = {policy: false, currencyPricingSchemes: false, instrumentPricingSchemes: false};

    vm.cancel = function () {
        $mdDialog.hide({status: 'disagree'});
    };

    vm.agree = function () {

        pricingPolicyService.update(vm.item.id, vm.item).then(function (data) {

            vm.item = data;

            toastNotificationService.success("Pricing policy was updated");

            $mdDialog.hide({status: 'agree', data: {item: vm.item}});

        });

    };

    vm.getItem = function () {

        pricingPolicyService.getByKey(vm.itemId).then(function (data) {

            vm.item = data;

            vm.readyStatus.policy = true;

            $scope.$apply();

        })

    };

    vm.editAsJson = function (ev) {

        $mdDialog.show({
            controller: 'EntityAsJsonEditorDialogController as vm',
            templateUrl: 'views/dialogs/entity-as-json-editor-dialog-view.html',
            targetEvent: ev,
            multiple: true,
            locals: {
                data: {
                    item: vm.item,
                    entityType: 'pricing-policy'
                }
            }
        }).then(function (res) {

            if (res.status === "agree") {

                vm.getItem();

            }
        })

    }

    vm.init = function () {

        vm.getItem();

    };

    vm.init();

};