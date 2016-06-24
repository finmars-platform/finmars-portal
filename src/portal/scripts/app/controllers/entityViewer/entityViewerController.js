/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../services/logService');

    var attributeTypeService = require('../../services/attributeTypeService');

    var entityViewerHelperService = require('../../services/entityViewerHelperService');
    var metaService = require('../../services/metaService');

    var GroupTableService = require('../../services/groupTable/groupTableService');

    var uiService = require('../../services/uiService');

    var demoPortfolioService = require('../../services/demo/demoPortfolioService');
    var demoTransactionsService = require('../../services/demo/demoTransactionsService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('EntityViewerController', 'initialized');

        //console.log('$scope', $scope);

        var vm = this;

        // ATTRIBUTE STUFF START

        vm.attrs = [];
        vm.baseAttrs = [];
        vm.layoutAttrs = [];
        vm.entityAttrs = [];

        // ENTITY STUFF START

        vm.entityRaw = $scope.$parent.vm.entityRaw;
        vm.entity = [];
        vm.entityType = $scope.$parent.vm.entityType;

        vm.columns = [];
        vm.grouping = [];
        vm.filters = [];
        vm.sorting = [];

        // ENTITY ADDITIONS STUFF START

        vm.entityAdditions = [];
        vm.additionsType = '';
        vm.additionsEntityType = '';

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

        function returnFullAttributes(items, attrs, baseAttrs, entityAttrs, entityType) {
            var fullItems = [];
            if (!items) {
                return [];
            }
            var i, a, b, e, item, attr, baseAttr, attrOptions, entityAttr;
            for (i = 0; i < items.length; i = i + 1) {
                item = items[i];
                if (item.hasOwnProperty('id')) {
                    for (a = 0; a < attrs.length; a = a + 1) {
                        attr = attrs[a];
                        if (item.id === attr.id) {
                            if (item.options) {
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
                            if (item.options) {
                                attrOptions = JSON.parse(JSON.stringify(item.options));
                            }
                            item.options = attrOptions;
                            item = baseAttr;
                            fullItems.push(item);
                        }
                    }

                    for (e = 0; e < entityAttrs.length; e = e + 1) {
                        entityAttr = entityAttrs[e];
                        if (item.key === entityAttr.key) {
                            if (item.options) {
                                attrOptions = JSON.parse(JSON.stringify(item.options));
                            }
                            item.options = attrOptions;
                            item = entityAttr;
                            fullItems.push(item);
                        }
                    }
                }
            }
            return fullItems;
        }

        function findFullAttributeForItem(item, attrs) {
            if (item.hasOwnProperty('id')) {
                var i;
                for (i = 0; i < attrs.length; i = i + 1) {
                    var sort = item.sort;
                    if (item.id === attrs[i].id) {
                        item = attrs[i];
                        item.sort = sort;
                    }
                }
            }
            return item;
        }

        vm.getView = function () {
            return uiService.getListLayout(vm.entityType, 'default').then(function (res) {

                //vm.entityType = data.entityType;

                //vm.tabs = res.data.tabs;

                console.log('res', res);
                console.log('res.results', res.results[0]);

                vm.table = res.results[0].data.table;
                vm.columns = res.results[0].data.table.columns;
                vm.grouping = res.results[0].data.table.grouping;
                vm.folding = res.results[0].data.table.folding;
                vm.filters = res.results[0].data.table.filters;
                vm.sorting = res.results[0].data.table.sorting;

                logService.collection('vm.columns', vm.columns);

                vm.additionsType = res.results[0].data.tableAdditions.additionsType;

                vm.additionsEntityType = res.results[0].data.tableAdditions.entityType;

                vm.tableAdditions = res.results[0].data.tableAdditions;
                vm.entityAdditionsColumns = res.results[0].data.tableAdditions.table.columns;
                vm.entityAdditionsFilters = res.results[0].data.tableAdditions.table.filters;
                vm.entityAdditionsSorting = res.results[0].data.tableAdditions.table.sorting;

                vm.additionsStatus[res.results[0].data.tableAdditions.additionsType] = true;

                //console.log('vm tabs!', vm.tabs);
                $scope.$apply();
            });
        };

        vm.transformViewAttributes = function () {

            vm.columns = returnFullAttributes(vm.columns, vm.attrs, vm.baseAttrs, vm.entityAttrs, vm.entityType);
            vm.grouping = returnFullAttributes(vm.grouping, vm.attrs, vm.baseAttrs, vm.entityAttrs, vm.entityType);
            vm.filters = returnFullAttributes(vm.filters, vm.attrs, vm.baseAttrs, vm.entityAttrs, vm.entityType);
            vm.sorting.group = findFullAttributeForItem(vm.sorting.group, vm.attrs);
            vm.sorting.column = findFullAttributeForItem(vm.sorting.column, vm.attrs);
            //console.log('vm.sorting.column', vm.sorting.column);
            vm.entityAdditionsColumns = returnFullAttributes(vm.entityAdditionsColumns, vm.attrs, vm.baseAttrs, vm.entityAttrs, vm.additionsEntityType);
            vm.entityAdditionsFilters = returnFullAttributes(vm.entityAdditionsFilters, vm.attrs, vm.baseAttrs, vm.entityAttrs, vm.additionsEntityType);
            vm.entityAdditionsSorting.column = findFullAttributeForItem(vm.entityAdditionsSorting.column, vm.attrs);

            logService.collection('vm.grouping', vm.grouping);
        };

        vm.getEntityData = function () {
            entityViewerHelperService.transformItems(vm.entityRaw, vm.attrs).then(function (data) {
                vm.entity = data;
                vm.groupTableService = GroupTableService.getInstance();

                vm.updateTable();

                $scope.$apply();
            })
        };

        vm.getAttributes = function () {
            return attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
                vm.baseAttrs = metaService.getBaseAttrs();
                vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);
                $scope.$apply();
            })
        };

        vm.updateTable = function () {

            var options = {
                sort: {
                    key: vm.sorting.column.key,
                    direction: vm.sorting.column.sort
                },
                filters: {}
            };

            console.log('options', options);

            $scope.$parent.vm.getList(options).then(function (data) {
                entityViewerHelperService.transformItems(data, vm.attrs).then(function (data) {
                    vm.entity = data;
                    vm.groupTableService.setItems(vm.entity);
                    vm.groupTableService.columns.setColumns(vm.columns);
                    vm.groupTableService.filtering.setFilters(vm.filters);
                    vm.groupTableService.grouping.setGroups(vm.grouping);
                    //console.log("EXTERNAL CALLBACK ", vm.folding);
                    vm.groupTableService.folding.setFolds(vm.folding);
                    vm.sorting.group = findFullAttributeForItem(vm.sorting.group, vm.attrs);
                    //vm.sorting.column = findFullAttributeForItem(vm.sorting.column, vm.attrs);
                    //vm.groupTableService.sorting.group.sort(vm.sorting.group);
                    //vm.groupTableService.sorting.column.sort(vm.sorting.column);
                    vm.tableIsReady = true;

                    $scope.$apply();
                });
            })
        };

        vm.updateAdditionsTable = function () {
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
                vm.updateAdditionsTable();
                $scope.$apply();
            });
        };

        vm.addEntity = function (ev) {
            $mdDialog.show({
                controller: 'EntityViewerAddDialogController as vm',
                templateUrl: 'views/entity-viewer/entity-viewer-dialog-view.html',
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
            vm.getAttributes().then(function () {
                vm.transformViewAttributes();
                vm.getEntityData();
            });
        })
    }

}());