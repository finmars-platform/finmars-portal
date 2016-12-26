/**
 * Created by szhitenev on 21.12.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var uiService = require('../../../services/uiService');

    module.exports = function ($scope) {

        logService.controller('ReportWizardController', 'initialized');

        var vm = this;

        vm.currentStep = 1;
        vm.readyStatus = {layouts: true};
        vm.wizard = {entityType: null, uiLayout: null};

        //setTimeout(function () {
        //
        //    $scope.$parent.vm.entityType = 'balance-report';
        //    $scope.$parent.vm.isReport = true;
        //    $scope.$parent.vm.onBeforeLoadActionFinish = true;
        //
        //    $scope.$parent.vm.getReport();
        //
        //}, 2000)

        vm.reportTypes = [
            {
                caption: 'Balance report',
                entityType: 'balance-report'
            },
            {
                caption: 'Profit & Lost report',
                entityType: 'pnl-report'
            },
            {
                caption: 'Transaction report',
                entityType: 'transaction-report'
            },
            {
                caption: 'Cash flow projection report',
                entityType: 'cash-flow-projection-report'
            },
            {
                caption: 'Performance report',
                entityType: 'performance-report'
            }
        ];

        vm.selectReport = function (item) {

            vm.reportTypes.forEach(function (reportTypeItem) {
                reportTypeItem.selected = false;
            });

            item.selected = true;
            vm.wizard.entityType = item.entityType;
            vm.currentStep = vm.currentStep + 1;
            vm.renderStep();

        };

        vm.selectLayout = function (item) {

            vm.layouts.forEach(function (layout) {
                layout.selected = false;
            });

            item.selected = true;
            vm.wizard.uiLayout = item.id;
            vm.currentStep = vm.currentStep + 1;
            vm.renderStep();
        };

        vm.checkDisabled = function () {

            if (vm.currentStep == 1 && vm.wizard.entityType !== null) {
                return false;
            }

            if (vm.currentStep == 2 && vm.wizard.uiLayout !== null) {
                return false;
            }

            return true;

        };

        vm.checkReadyStatus = function () {

            if (vm.readyStatus.layouts == true) {
                return true;
            }

            return false;

        };

        vm.getUiLayouts = function () {
            vm.readyStatus.layouts = false;
            uiService.getListLayout(vm.wizard.entityType).then(function (data) {

                vm.layouts = data.results;

                vm.readyStatus.layouts = true;
                $scope.$apply();
            })
        };

        vm.renderStep = function () {

            if (vm.currentStep == 2) {
                vm.getUiLayouts();
            }

            if (vm.currentStep == 3) {
                $scope.$parent.vm.entityType = vm.wizard.entityType;
                $scope.$parent.vm.uiLayoutId = vm.wizard.uiLayout;
                $scope.$parent.vm.isReport = true;
                $scope.$parent.vm.onBeforeLoadActionFinish = true;

                $scope.$parent.vm.getReport();
            }


        };

        vm.nextStep = function () {
            vm.currentStep = vm.currentStep + 1;
            vm.renderStep();
        };

        vm.prevStep = function () {
            vm.currentStep = vm.currentStep - 1;
            vm.renderStep();
        }


    }

}());