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

        vm.complexTransactionOptions = {
            portfolio: $scope.$parent.vm.complexTransactionOptions.portfolio,
            instrumentType: $scope.$parent.vm.complexTransactionOptions.instrumentType,
            transactionType: $scope.$parent.vm.complexTransactionOptions.transactionType
        };

        $scope.$parent.vm.specialRulesReady = false;

        function getGroupsFromItems(items) {

            var groups = {};

            items.forEach(function (item) {

                // console.log('item', item);

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

            // console.log('groups', groupsList);

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

        transactionTypeService.getList().then(function (data) {

            console.log('DATA', data);

            vm.transactionGroups = getGroupsFromItems(data.results);
            $scope.$apply();
        });


        vm.loadTransactionTypes = function () {

            var options = {
                filters: {
                    portfolio: vm.complexTransactionOptions.portfolio,
                    'instrument_type': vm.complexTransactionOptions.instrumentType
                }
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

        $scope.$parent.$watchCollection('vm.complexTransactionOptions', function () {

            vm.complexTransactionOptions = $scope.$parent.vm.complexTransactionOptions;

            vm.loadTransactionTypes();
        });


        vm.transactionTypeHandler = function () {
            $scope.$parent.vm.specialRulesReady = false;
            setTimeout(function () {
                $scope.$parent.vm.complexTransactionOptions.transactionType = vm.complexTransactionOptions.transactionType;
                $scope.$parent.vm.editLayoutEntityInstanceId = vm.complexTransactionOptions.transactionType;
                $scope.$parent.vm.specialRulesReady = true;
                $scope.$parent.vm.entity._transaction_type_id = vm.complexTransactionOptions.transactionType;
                console.log('PARENT', $scope.$parent.vm);
                $scope.$parent.vm.getEditListByInstanceId();
                $scope.$apply();
            }, 200); // but why?

        }

    }

}());