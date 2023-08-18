/**
 * Created by szhitenev on 03.08.2023.
 */
(function () {

    'use strict';

    var portfolioBundleService = require('../../services/portfolioBundleService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.readyStatus = {content: false};
        vm.items = [];

        vm.getList = function () {

            portfolioBundleService.getList().then(function (data) {

                vm.items = data.results;

                vm.readyStatus.content = true;

                $scope.$apply();

            })

        };

        vm.editPortfolioBundle = function ($event, item) {

            $mdDialog.show({
                controller: 'PortfolioBundleDialogController as vm',
                templateUrl: 'views/dialogs/portfolio-bundle-dialog-view.html',
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

                if(res.status === 'agree') {
                    vm.getList();
                }

            })

        };

        vm.addPortfolioBundle = function ($event) {

            $mdDialog.show({
                controller: 'PortfolioBundleDialogController as vm',
                templateUrl: 'views/dialogs/portfolio-bundle-dialog-view.html',
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

                if(res.status === 'agree') {
                    vm.getList();
                }

            })

        };

        vm.deletePortfolioBundle = function($event, item, $index){

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "<p>Are you sure you want to delete Portfolio Bundle <b>" + item.name + '</b>?</p>'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    portfolioBundleService.deleteByKey(item.id).then(function (value) {
                        vm.getList();
                    })

                }

            })

        };

        vm.init = function () {

            vm.getList();

        };

        vm.init();

    };

}());