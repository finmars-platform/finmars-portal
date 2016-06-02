/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var portfolioService = require('../../services/portfolioService');
    var portfolioHelperService = require('../../services/portfolioHelperService');
    var metaService = require('../../services/metaService');

    var GroupTableService = require('../../services/groupTable/groupTableService');

    var demoPortfolioService = require('../../services/demo/demoPortfolioService');
    var demoTransactionsService = require('../../services/demo/demoTransactionsService');

    module.exports = function ($scope, $mdDialog) {

        console.log('Portfolio controller initialized...');

        var vm = this;

        // ATTRIBUTE STUFF START

        vm.attrs = [];
        vm.baseAttrs = [];
        vm.layoutAttrs = [];

        // ENTITY STUFF START

        vm.entity = [];
        vm.entityType = '';

        vm.columns = [];
        vm.grouping = [];
        vm.filters = [];
        vm.sorting = [];

        // ENTITY ADDITIONS STUFF START

        vm.entityAdditions = [];
        vm.additionsType = '';

        vm.entityAdditionsColumns = [];
        vm.entityAdditionsFilters = [];
        vm.entityAdditionsSorting = [];

        // OTHER STUFF START

        vm.tabs = [];
        vm.table = {};
        vm.tableAdditions = {};

        vm.tableIsReady = false;

        vm.additionsStatus = {
            editor: false,
            table: false
        };

        function returnFullAttributes(items, attrs, baseAttrs) {
            var fullItems = [];
            if (!items) {
                return [];
            }
            var i, a, b, item, attr, baseAttr, attrOptions;
            for (i = 0; i < items.length; i = i + 1) {
                item = items[i];
                if (item.hasOwnProperty('id')) {
                    for (a = 0; a < attrs.length; a = a + 1) {
                        attr = attrs[a];
                        if (item.id === attr.id) {
                            if(item.options) {
                                attrOptions = JSON.parse(JSON.stringify(item.options));
                            }
                            item = attr;
                            item.options = attrOptions;
                            fullItems.push(item);
                        }
                    }
                } else {
                    for (b = 0; b < baseAttrs.length; b = b + 1) {
                        baseAttr = baseAttrs[b];
                        if (item.key === baseAttr.key) {
                            if(item.options) {
                                attrOptions = JSON.parse(JSON.stringify(item.options));
                            }
                            item.options = attrOptions;
                            item = baseAttr;
                            fullItems.push(item);
                        }
                    }
                }
            }
            return fullItems;
        }

        vm.getView = function () {
            return demoPortfolioService.getView().then(function (data) {

                vm.entityType = data.entityType;

                vm.tabs = data.tabs;

                vm.table = data.table;
                vm.columns = data.table.columns;
                vm.grouping = data.table.grouping;
                vm.filters = data.table.filters;
                vm.sorting = data.table.sorting;

                vm.additionsType = data.tableAdditions.additionsType;

                vm.tableAdditions = data.tableAdditions;
                vm.entityAdditionsColumns = data.tableAdditions.columns;
                vm.entityAdditionsFilters = data.tableAdditions.filters;
                vm.entityAdditionsSorting = data.tableAdditions.sorting;

                vm.additionsStatus[data.tableAdditions.additionsType] = true;

                console.log('vm tabs!', vm.tabs);
                $scope.$apply();
            });
        };

        vm.transformViewAttributes = function(){

            vm.columns = returnFullAttributes(vm.columns, vm.attrs, vm.baseAttrs);
            vm.grouping = returnFullAttributes(vm.grouping, vm.attrs, vm.baseAttrs);
            vm.filters = returnFullAttributes(vm.filters, vm.attrs, vm.baseAttrs);
            vm.sorting = returnFullAttributes(vm.sorting, vm.attrs, vm.baseAttrs);

            vm.entityAdditionsColumns = returnFullAttributes(vm.entityAdditionsColumns, vm.attrs, vm.baseAttrs);
            vm.entityAdditionsFilters = returnFullAttributes(vm.entityAdditionsFilters, vm.attrs, vm.baseAttrs);
            vm.entityAdditionsSorting = returnFullAttributes(vm.entityAdditionsSorting, vm.attrs, vm.baseAttrs);

        };

        vm.getEntityData = function () {
            portfolioService.getList().then(function (data) {
                portfolioHelperService.transformItems(data.results).then(function (data) {
                    vm.entity = data;
                    vm.groupTableService = GroupTableService.getInstance();

                    vm.updateTable();

                    $scope.$apply();
                })
            });
        };

        vm.getAttributes = function () {
            return portfolioService.getAttributeTypeList().then(function (data) {
                vm.attrs = data.results;
                return metaService.getBaseAttrs().then(function(data){
                    vm.baseAttrs = data[vm.entityType];
                    console.log('METHOD: getAttributes' + 'data: vm.attrs', 'values:', vm.attrs);
                    console.log('METHOD: getAttributes' + 'data: vm.baseAttrs', 'values:', vm.baseAttrs);
                    $scope.$apply();
                });


            })
        };

        vm.updateTable = function () {
            vm.groupTableService.setItems(vm.entity);
            vm.groupTableService.columns.setColumns(vm.columns);
            vm.groupTableService.filtering.setFilters(vm.filters);
            vm.groupTableService.grouping.setGroups(vm.grouping);
            vm.groupTableService.sorting.group.sort(vm.sorting.group);
            vm.groupTableService.sorting.column.sort(vm.sorting.column);
            vm.tableIsReady = true;
        };

        vm.updateAdditions = function () {
            vm.groupTableService.additions.setItems(vm.entityAdditions);
            vm.groupTableService.additions.columns.setColumns(vm.entityAdditionsColumns);
            vm.groupTableService.additions.filtering.setFilters(vm.entityAdditionsFilters);
            vm.groupTableService.additions.sorting.column.sort(vm.entityAdditionsSorting.column);
        };

        vm.getEntityAdditions = function (portfolioId) {
            console.log('vm.getPortfolioTransaction', portfolioId);
            return demoTransactionsService.getList(portfolioId).then(function (data) {
                console.log('data', data);
                vm.entityAdditions = data;
                vm.updateAdditions();
                $scope.$apply();
            });
        };

        vm.addEntity = function (ev) {
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

        vm.openDataViewPanel = function () {

        };

        vm.openEditorViewPanel = function () {
            vm.additionsStatus.table = true;
        };

        vm.checkAdditionStatus = function () {
            if (!vm.additionsStatus.table && !vm.additionsStatus.editor) {
                return true;
            }
            return false;
        };

        vm.hideAdditions = function () {
            vm.additionsStatus.table = false;
            vm.additionsStatus.editor = false;
        }

        vm.getView().then(function () {
            vm.getAttributes().then(function(){
                vm.transformViewAttributes();
                vm.getEntityData();
            });
        })
    }

}());