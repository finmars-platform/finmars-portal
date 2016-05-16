/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var portfolioService = require('../../services/portfolioService');
    var portfolioHelperService = require('../../services/portfolioHelperService');

    var GroupTableService = require('../../services/groupTable/groupTableService');

    var demoPortfolioService = require('../../services/demoPortfolioService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;
        vm.portfolio = [];
        vm.columns = [
            {
                name: "Name",
                notes: "",
                order: 0,
                is_hidden: false,
                short_name: "Name",
                value_type: 10
            }, {
                name: "Short name",
                notes: "",
                order: 0,
                is_hidden: false,
                short_name: "short name",
                value_type: 10
            }, {
                classifier_root: null,
                id: 5,
                is_hidden: false,
                name: "Country",
                notes: "",
                order: 0,
                short_name: "Country",
                url: "https://dev.finmars.com/api/v1/portfolios/portfolio-attribute-type/5/",
                user_code: "T2",
                value_type: 10
            }];
        vm.grouping = [
            {
                classifier_root: null,
                id: 7,
                is_hidden: false,
                name: "Strategy",
                notes: "",
                order: 0,
                short_name: "Strategy",
                url: "https://dev.finmars.com/api/v1/portfolios/portfolio-attribute-type/7/",
                user_code: "T4",
                value_type: 10
            }];
        vm.tabs = [];
        vm.filters = [];
        vm.sorting = [];

        demoPortfolioService.getTabList().then(function (data) {
            vm.tabs = data;
            console.log('vm tabs!', vm.tabs);
            $scope.$apply();
        });

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

        vm.updateTable = function () {
            console.log('update table!', vm.grouping);
            vm.groupTableService.setItems(vm.portfolio);
            vm.groupTableService.columns.setColumns(vm.columns);
            vm.groupTableService.filtering.setFilters(vm.filters);
            vm.groupTableService.grouping.setGroups(vm.grouping);
            vm.groupTableService.sorting.group.sort(vm.sorting.group);
            vm.groupTableService.sorting.column.sort(vm.sorting.column);
        };



        vm.addPortfolio = function (ev) {
            $mdDialog.show({
                controller: 'PortfolioAddDialogController as vm',
                templateUrl: 'views/administration/portfolio-add-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    parentScope: $scope
                }
            });
        };

        vm.openDataViewPanel = function(){

        }


    }

}());