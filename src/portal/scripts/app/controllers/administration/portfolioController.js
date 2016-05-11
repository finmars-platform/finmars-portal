/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var portfolioService = require('../../services/portfolioService');
    var portfolioHelperService = require('../../services/portfolioHelperService');

    var GroupTableService = require('../../services/groupTable/groupTableService');

    module.exports = function ($scope, $mdDialog, $mdMedia) {

        var vm = this;
        vm.portfolio = [];
        vm.columns = ['name', 'short_name', 'Country'];
        vm.grouping = ['Country', 'Industry'];
        vm.filters = [];
        vm.sorting = [];

        console.log('Portfolio controller initialized...');
        portfolioService.getList().then(function (data) {
            console.log('data!', data);

            portfolioHelperService.transformItems(data.results).then(function (data) {
                vm.portfolio = data;
                vm.groupTableService = GroupTableService.getInstance();

                vm.groupTableService.setItems(vm.portfolio);
                vm.groupTableService.columns.setColumns(vm.columns);
                vm.groupTableService.filtering.setFilters(vm.filters);
                vm.groupTableService.grouping.setGroups(vm.grouping);
                vm.groupTableService.sorting.group.sort(vm.sorting.group);
                vm.groupTableService.sorting.column.sort(vm.sorting.column);

                $scope.$apply();
            })
        });

        vm.updateTable = function(){
            vm.groupTableService.setItems(vm.portfolio);
            vm.groupTableService.columns.setColumns(vm.columns);
            vm.groupTableService.filtering.setFilters(vm.filters);
            vm.groupTableService.grouping.setGroups(vm.grouping);
            vm.groupTableService.sorting.group.sort(vm.sorting.group);
            vm.groupTableService.sorting.column.sort(vm.sorting.column);
        };


        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        vm.addPortfolio = function (ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'PortfolioAddDialogController as vm',
                templateUrl: 'views/administration/portfolio-add-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            }).then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        vm.getNodeList = function () {
            portfolioService.getClassifierNodeList().then(function (data) {
                console.log('Portfolio Classifier Node List!', data);
            });
        };

        vm.getClassifierNodeByKey = function () {
            portfolioService.getClassifierNodeByKey(1).then(function (data) {
                console.log('Portfolio Classifier Node Instance!', data);
            });
        };

        vm.getClassifierList = function () {
            portfolioService.getClassifierList().then(function (data) {
                console.log('Portfolio Classifier List!', data);
            });
        };

        vm.getClassifierByKey = function () {
            portfolioService.getClassifierByKey(1).then(function (data) {
                console.log('Portfolio Classifier Instance!', data);
            });
        }


    }

}());