/**
 * Created by szhitenev on 27.09.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var transactionTypeGroupService = require('../../../services/transaction/transactionTypeGroupService');
    var portfolioService = require('../../../services/portfolioService');
    var instrumentTypeService = require('../../../services/instrumentTypeService');
    var tagService = require('../../../services/tagService');

    module.exports = function ($scope, $mdDialog) {
        logService.controller('TransactionTypeGeneralTabController', 'initialized');

        var vm = this;

        vm.entity = $scope.$parent.vm.entity;

        vm.entity.book_transaction_layout = vm.entity.book_transaction_layout || '';
        vm.entity.actions = vm.entity.actions || [];
        vm.entity.inputs = vm.entity.inputs || [];

        vm.readyStatus = {transactionTypeGroups: false, instrumentTypes: false, portfolios: false, tags: false};

        vm.getTransactionTypeGroups = function () {
            transactionTypeGroupService.getList().then(function (data) {
                vm.transactionTypeGroups = data.results;
                vm.readyStatus.transactionTypeGroups = true;
                $scope.$apply();
            })
        };

        vm.getPortfolios = function () {
            portfolioService.getList().then(function (data) {
                vm.portfolios = data.results;
                vm.readyStatus.portfolios = true;
                $scope.$apply();
            })
        };

        vm.getInstrumentTypes = function () {
            instrumentTypeService.getList().then(function (data) {
                vm.instrumentTypes = data.results;
                vm.readyStatus.instrumentTypes = true;
                $scope.$apply();
            })
        };

        vm.getTags = function () {
            tagService.getListByContentType('transaction-type').then(function (data) {
                vm.tags = data.results;
                vm.readyStatus.tags = true;
                $scope.$apply();
            });

        };

        vm.unselectAllEntities = function (entity) {

            if (entity === 'instruments') {

              if (vm.entity.is_valid_for_all_instruments) {
                  vm.entity.instrument_types = [];;
              }

            } else if (entity === 'portfolios') {

                if (vm.entity.is_valid_for_all_portfolios) {
                    vm.entity.portfolios = [];
                }

            }
        };

        vm.notValidForAll = function (entity) {
            if (entity === 'instruments') {

                if (vm.entity.instrument_types && vm.entity.instrument_types.length > 0) {
                    vm.entity.is_valid_for_all_instruments = false;
                }

            } else if (entity === 'portfolios') {

                if (vm.entity.portfolios && vm.entity.portfolios.length > 0) {
                    vm.entity.is_valid_for_all_portfolios = false;
                }

            }
        };

        vm.bindSelectedText = function (entity, fallback) {
            if (entity) {
                return '[' + entity.length + ']';
            }
            return fallback;
        };

        vm.openExpressionDialog = function ($event, item, options) {


            $mdDialog.show({
                controller: 'ExpressionEditorDialogController as vm',
                templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: {expression: item[options.key]}
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                    item[options.key] = res.data.item.expression;
                }
                // console.log('item', item);
            });
        };

        vm.getTransactionTypeGroups();
        vm.getPortfolios();
        vm.getInstrumentTypes();
        vm.getTags();

        vm.tagTransform = function (newTag) {
            //console.log('newTag', newTag);
            var item = {
                name: newTag,
                id: null
            };

            return item;
        };

        $scope.$watch('vm.entity.tags', function () {

            if (vm.entity.tags) {
                vm.entity.tags.forEach(function (item) {
                    if (item.id == null) {
                        tagService.create({
                            name: item.name,
                            content_types: ['transactions.transactiontype']
                        })
                    }
                })

            }
        });

        $scope.$watch('vm.entity.group', function () {
            if (vm.entity.group && vm.entity.group.name != null) {
                transactionTypeGroupService.create({
                    name: vm.entity.group.name
                })
            }
        });

        vm.checkReadyStatus = function () {
            if (vm.readyStatus.transactionTypeGroups == true &&
                vm.readyStatus.portfolios == true &&
                vm.readyStatus.instrumentTypes == true &&
                vm.readyStatus.tags == true) {
                return true;
            }
            return false;
        }
    }

}());