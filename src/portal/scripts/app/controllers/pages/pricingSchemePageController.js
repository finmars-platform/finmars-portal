/**
 * Created by szhitenev on 29.01.2020.
 */
(function () {

    'use strict';

    var pricingPolicyService = require('../../services/pricingPolicyService');

    var currencyPricingSchemeService = require('../../services/pricing/currencyPricingSchemeService');
    var instrumentPricingSchemeService = require('../../services/pricing/instrumentPricingSchemeService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.readyStatus = {currencyPricingSchemes: false, instrumentPricingSchemes: false};

        vm.currencyPricingSchemes = [];
        vm.instrumentPricingSchemes = [];

        vm.getCurrencyPricingSchemesList = function () {

            currencyPricingSchemeService.getList().then(function (data) {

                vm.currencyPricingSchemes = data.results;

                vm.readyStatus.currencyPricingSchemes = true;

                $scope.$apply();

            })

        };

        vm.getInstrumentPricingSchemesList = function () {

            instrumentPricingSchemeService.getList().then(function (data) {

                vm.instrumentPricingSchemes = data.results;

                vm.readyStatus.instrumentPricingSchemes = true;

                $scope.$apply();

            })

        };

        vm.addCurrencyPricingScheme = function ($event) {

            $mdDialog.show({
                controller: 'CurrencyPricingSchemeAddDialogController as vm',
                templateUrl: 'views/dialogs/pricing/currency-pricing-scheme-add-dialog-view.html',
                parent: angular.element(document.body),
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

                if (res.status === 'agree') {
                    vm.getCurrencyPricingSchemesList();
                }

            })

        };

        vm.addInstrumentPricingScheme = function ($event) {

            $mdDialog.show({
                controller: 'InstrumentPricingSchemeAddDialogController as vm',
                templateUrl: 'views/dialogs/pricing/instrument-pricing-scheme-add-dialog-view.html',
                parent: angular.element(document.body),
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

                if (res.status === 'agree') {
                    vm.getInstrumentPricingSchemesList();
                }

            })

        };

        vm.editCurrencyPricingScheme = function ($event, item) {

            $mdDialog.show({
                controller: 'CurrencyPricingSchemeEditDialogController as vm',
                templateUrl: 'views/dialogs/pricing/currency-pricing-scheme-edit-dialog-view.html',
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
                    vm.getCurrencyPricingSchemesList();
                }

            })

        };

        vm.editInstrumentPricingScheme = function ($event, item) {

            $mdDialog.show({
                controller: 'InstrumentPricingSchemeEditDialogController as vm',
                templateUrl: 'views/dialogs/pricing/instrument-pricing-scheme-edit-dialog-view.html',
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
                    vm.getInstrumentPricingSchemesList();
                }

            })

        };

        vm.getErrorHandler = function (item) {

            if (item.error_handler === 1) {
                return 'Skip';
            }

            if (item.error_handler === 2) {
                return 'Default Price';
            }

            if (item.error_handler === 3) {
                return 'Ask For Manual Entry';
            }

            if (item.error_handler === 3) {
                return 'Add to Pricing Log';
            }

        };

        vm.init = function () {

            vm.getCurrencyPricingSchemesList();
            vm.getInstrumentPricingSchemesList();

        };

        vm.init();

    };

}());