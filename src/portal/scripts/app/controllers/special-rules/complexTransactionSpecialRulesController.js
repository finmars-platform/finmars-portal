/**
 * Created by szhitenev on 03.10.2016.
 */
(function () {

    'use strict';

    var portfolioService = require('../../services/portfolioService');
    var instrumentTypeService = require('../../services/instrumentTypeService');
    var transactionTypeService = require('../../services/transactionTypeService');

    module.exports = function ComplexTransactionSpecialRulesController($scope) {

        var vm = this;

        vm.filters = {
            portfolio: $scope.$parent.vm.complexTransactionOptions.portfolio,
            instrument_type: $scope.$parent.vm.complexTransactionOptions.instrumentType
        };

        vm.transactionTypeId = $scope.$parent.vm.complexTransactionOptions.transactionTypeId;

        $scope.$parent.vm.specialRulesReady = false;

        function getGroupsFromItems(items) {

            var groups = {};

            items.forEach(function (item) {

                if (item.group_object) {

                    if (!groups[item.group_object.id]) {
                        groups[item.group_object.id] = item.group_object;
                        groups[item.group_object.id].items = [];
                    }

                    groups[item.group_object.id].items.push(item);

                } else {

                    if (!groups['ungrouped']) {
                        groups['ungrouped'] = {name: 'Ungrouped'};
                        groups['ungrouped'].items = [];
                    }

                    groups['ungrouped'].items.push(item);

                }


            });

            var groupsList = Object.keys(groups).map(function (key) {
                return groups[key]
            });

            groupsList = groupsList.filter(function (item) {
                return !!item
            });

            return groupsList;

        }

        portfolioService.getList().then(function (data) {
            vm.portfolios = data.results;
            $scope.$apply();
        });


        instrumentTypeService.getList().then(function (data) {
            vm.instrumentTypes = data.results;
            $scope.$apply();
        });

        transactionTypeService.getList({pageSize: 1000}).then(function (data) {

            vm.transactionGroups = getGroupsFromItems(data.results);
            $scope.$apply();

        });


        vm.loadTransactionTypes = function () {

            var options = {
                filters: vm.filters,
                pageSize: 1000
            };

            transactionTypeService.getList(options).then(function (data) {

                vm.transactionGroups = getGroupsFromItems(data.results);

                $scope.$apply(function () {
                    setTimeout(function () {
                        $('body').find('.md-select-search-pattern').on('keydown', function (ev) {
                            ev.stopPropagation();
                        });
                    }, 100);
                });
            })

        };

        vm.transactionTypeHandler = function () {

            $scope.$parent.vm.complexTransactionOptions.transactionTypeId = vm.transactionTypeId;
            $scope.$parent.vm.specialRulesReady = true;

            $scope.$parent.vm.getEditListByInstanceId();

        }

    }

}());