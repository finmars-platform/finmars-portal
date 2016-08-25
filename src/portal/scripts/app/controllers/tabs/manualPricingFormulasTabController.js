/**
 * Created by szhitenev on 25.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var pricingPolicyService = require('../../services/pricingPolicyService');

    module.exports = function ($scope) {

        logService.controller('ManualPricingFormulasTabController', 'initialized');

        var vm = this;

        vm.readyStatus = {content: false};

        vm.entity = $scope.$parent.vm.entity;

        vm.newItem = {pricing_policy: '', expr: '', notes: ''};

        pricingPolicyService.getList().then(function (data) {
            vm.policies = data.results;
            vm.readyStatus.content = true;
            $scope.$apply();
        });

        vm.bindPricingPolicy = function (policy) {
            var name;
            vm.policies.forEach(function (item) {
                if (policy.pricing_policy == item.id) {
                    name = item.name
                }
            });
            return name;
        };

        vm.editItem = function (item) {
            item.editStatus = true;
        };

        vm.saveItem = function (item) {
            item.editStatus = false;
        };

        vm.deleteItem = function (item, index) {
            vm.entity.manual_pricing_formulas.splice(index, 1);
        };

        vm.addRow = function () {
            vm.entity.manual_pricing_formulas.push({
                pricing_policy: vm.newItem.pricing_policy,
                expr: vm.newItem.expr,
                notes: vm.newItem.notes
            });

            vm.newItem.pricing_policy = null;
            vm.newItem.expr = null;
            vm.newItem.notes = null;
        }

    }

}());