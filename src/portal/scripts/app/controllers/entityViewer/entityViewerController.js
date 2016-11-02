/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var attributeTypeService = require('../../services/attributeTypeService');

    var entityViewerHelperService = require('../../services/entityViewerHelperService');
    var metaService = require('../../services/metaService');

    var GroupTableService = require('../../services/groupTable/groupTableService');

    var uiService = require('../../services/uiService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('EntityViewerController', 'initialized');


        //console.log('$scope', $scope);

        $('.save-layout-btn').bind('click', function (e) {
            // saving columns widths
            var tHead = $('.g-columns-component');
            var th = $('.g-columns-component.g-thead').find('.g-cell');
            var thWidths = [];
            for (var i = 0; i < th.length; i = i + 1) {
                var thWidth = $(th[i]).width();
                thWidths.push(thWidth);
            }
            vm.listView.data.table.columnsWidth = thWidths;

            //console.log("View data is ", vm.listView.data);
            vm.listView.data.table = vm.table;
            vm.listView.data.table.columns = vm.columns;
            // vm.listView.data.table.columns['cellWidth']
            //console.log('---------vm.grouping-------', vm.grouping);
            vm.listView.data.table.grouping = vm.grouping;
            vm.listView.data.table.folding = vm.folding;
            vm.listView.data.table.filters = vm.filters;
            vm.listView.data.table.sorting = vm.sorting;

            // vm.listView.data.table.cellWidth = 200;

            vm.listView.data.additionsType = vm.additionsType;

            vm.listView.data.tableAdditions.entityType = vm.additionsEntityType;

            vm.listView.data.tableAdditions = vm.tableAdditions;
            vm.listView.data.tableAdditions.table.columns = vm.entityAdditionsColumns;
            vm.listView.data.tableAdditions.table.filters = vm.entityAdditionsFilters;
            vm.listView.data.tableAdditions.table.sorting = vm.entityAdditionsSorting;
            vm.listView.data.tableAdditions.additionsStatus = vm.additionsStatus;
            vm.listView.data.tableAdditions.additionsState = vm.additionsState;

            //vm.additionsStatus[res.results[0].data.tableAdditions.additionsType] = true;

            if (vm.listView.hasOwnProperty('id')) {
                uiService.updateListLayout(vm.listView.id, vm.listView).then(function () {
                    console.log('saved');
                });
            } else {
                uiService.createListLayout(vm.entityType, vm.listView).then(function () {
                    console.log('saved');
                });
            }
            $mdDialog.show({
                controller: 'SaveLayoutDialogController as vm',
                templateUrl: 'views/save-layout-dialog-view.html',
                targetEvent: e,
                clickOutsideToClose: true
            }).then(function () {
                vm.getView();
            });
        });

        $('.header-add-new-btn').click(function (e) {
            vm.addEntity(e);
        });

        var vm = this;

        vm.paginationPageCurrent = 1;
        vm.paginationItemPerPage = 20;
        vm.paginationItemsTotal = 0;

        if (window.location.hash.split('?')[1]) {
            var queryParams = window.location.hash.split('?')[1].split('&');

            queryParams.forEach(function (queryParameter) {
                if (queryParameter.indexOf('page=') == 0) {
                    vm.paginationPageCurrent = queryParameter.split('=')[1];
                }
            });
        }

        // ATTRIBUTE STUFF START

        vm.attrs = [];
        vm.baseAttrs = [];
        vm.layoutAttrs = [];
        vm.entityAttrs = [];

        // ENTITY STUFF START

        vm.entityRaw = $scope.$parent.vm.entityRaw;
        vm.entity = [];
        vm.entityType = $scope.$parent.vm.entityType;
        vm.isReport = $scope.$parent.vm.isReport || false;

        console.log('vm.isReport', vm.isReport);

        vm.customButtons = $scope.$parent.vm.entityViewer.extraFeatures;


        vm.columns = [];
        vm.columnsWidth = [];
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
        vm.readyStatus = {uiView: false};

        vm.editorTemplate = 'views/additions-editor-view.html';

        vm.additionsStatus = {
            editor: false,
            table: false,
            extraFeatures: []
        };
        vm.additionsState = false;
        vm.additionsStatus.extraFeatures = vm.customButtons;

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

        vm.checkReadyStatus = function () {
            if (vm.tableIsReady == true && vm.readyStatus.uiView == true) {
                return true;
            }
            return false;
        };

        vm.getView = function () {
            return uiService.getListLayout(vm.entityType, 'default').then(function (res) {

                //vm.entityType = data.entityType;

                //vm.tabs = res.data.tabs;

                //console.log('re1233333s', res);
                //console.log('res.results', res.results[0]);
                if (res.results.length) {
                    vm.listView = res.results[0];

                    vm.table = res.results[0].data.table;
                    vm.columns = res.results[0].data.table.columns;
                    vm.columnsWidth = res.results[0].data.table.columnsWidth;
                    vm.grouping = res.results[0].data.table.grouping;
                    vm.folding = res.results[0].data.table.folding;
                    vm.filters = res.results[0].data.table.filters;
                    vm.sorting = res.results[0].data.table.sorting;

                    logService.collection('vm.columns', vm.columns);

                    vm.additionsType = res.results[0].data.tableAdditions.additionsType;

                    vm.additionsEntityType = res.results[0].data.tableAdditions.entityType;
                    vm.additionsStatus = res.results[0].data.tableAdditions.additionsStatus || {
                            editor: false,
                            table: false,
                            extraFeatures: []
                        };

                    vm.additionsState = res.results[0].data.tableAdditions.additionsState;

                    vm.tableAdditions = res.results[0].data.tableAdditions;
                    vm.entityAdditionsColumns = res.results[0].data.tableAdditions.table.columns;
                    vm.entityAdditionsFilters = res.results[0].data.tableAdditions.table.filters;
                    vm.entityAdditionsSorting = res.results[0].data.tableAdditions.table.sorting;

                    //vm.additionsStatus[res.results[0].data.tableAdditions.additionsType] = true;
                } else {

                    var defaultList = uiService.getDefaultListLayout();

                    vm.listView = defaultList[0];

                    vm.table = defaultList[0].data.table;
                    vm.columns = defaultList[0].data.table.columns;
                    vm.columnsWidth = defaultList[0].data.table.columnsWidth;
                    vm.grouping = defaultList[0].data.table.grouping;
                    vm.folding = defaultList[0].data.table.folding;
                    vm.filters = defaultList[0].data.table.filters;
                    vm.sorting = defaultList[0].data.table.sorting;

                    logService.collection('vm.columns', vm.columns);

                    vm.additionsType = defaultList[0].data.tableAdditions.additionsType;

                    vm.additionsEntityType = defaultList[0].data.tableAdditions.entityType;

                    vm.tableAdditions = defaultList[0].data.tableAdditions;
                    vm.entityAdditionsColumns = defaultList[0].data.tableAdditions.table.columns;
                    vm.entityAdditionsFilters = defaultList[0].data.tableAdditions.table.filters;
                    vm.entityAdditionsSorting = defaultList[0].data.tableAdditions.table.sorting;

                    //vm.additionsStatus[defaultList[0].data.tableAdditions.additionsType] = true;
                }


                vm.readyStatus.uiView = true;

                //console.log('vm tabs!', vm.tabs);
                $scope.$apply();
            });
        };

        vm.transformViewAttributes = function () { //deprecated

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
            logService.collection('vm.columns', vm.columns);
        };

        vm.getEntityData = function () {
            //console.log('entityRaw is ', vm.entityRaw);
            entityViewerHelperService.transformItems(vm.entityRaw, vm.attrs).then(function (data) {
                vm.entity = data;
                vm.groupTableService = GroupTableService.getInstance();
                //console.log("Column text ", vm.groupTableService);

                vm.updateTable();

                $scope.$apply();
            })
        };

        vm.getAttributes = function () {
            return attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
                vm.baseAttrs = metaService.getBaseAttrs();
                vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];
                $scope.$apply();
            })
        };

        vm.updateTable = function () {

            var options = {
                sort: {
                    key: vm.sorting.column.key,
                    direction: vm.sorting.column.sort
                },
                filters: {},
                page: vm.paginationPageCurrent,
                pageSize: vm.paginationItemPerPage
            };

            //console.log('vm.filters', vm.filters);

            vm.filters.forEach(function (item) {
                if (item.options && item.options.enabled === true) {
                    options.filters[item.key] = item.options.query;
                }
            });

            console.log('options', options);
            //console.log('entityViewerController parent scope ', $scope.$parent);
            //console.log('ENTITY VIEWER vm.grouping', vm.grouping);
            $scope.$parent.vm.getList(options).then(function (data) {

                vm.paginationItemsTotal = data.count;
                vm.nextExist = !!data.next;
                vm.previousExist = !!data.previous;

                entityViewerHelperService.transformItems(data.results, vm.attrs).then(function (data) {

                    vm.entity = data;
                    vm.groupTableService.setItems(vm.entity);

                    vm.groupTableService.columns.setColumns(vm.columns);
                    //vm.groupTableService.filtering.setFilters(vm.filters);

                    if (vm.isReport == true) {
                        vm.groupTableService.grouping.setGroupsWithColumns(vm.grouping, vm.columns, vm.entityType);
                    } else {
                        vm.groupTableService.grouping.setGroups(vm.grouping, vm.entityType);
                    }
                    //console.log("EXTERNAL CALLBACK ", vm.folding);
                    vm.groupTableService.folding.setFolds(vm.folding);
                    //console.log('UPDATE TABLE scope.sorting.group', vm.sorting.group);
                    vm.sorting.group = findFullAttributeForItem(vm.sorting.group, vm.attrs);
                    //vm.sorting.column = findFullAttributeForItem(vm.sorting.column, vm.attrs);
                    vm.groupTableService.sorting.group.sort(vm.sorting.group);
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
            //console.log('vm.getPortfolioTransaction', portfolioId);
            return demoTransactionsService.getList(portfolioId).then(function (data) {
                //console.log('data', data);
                vm.entityAdditions = data;
                vm.updateAdditionsTable();
                $scope.$apply();
            });
        };

        vm.addEntity = function (ev) {
            //console.log('Add entity dialog have been activated');
            $mdDialog.show({
                controller: 'EntityViewerAddDialogController as vm',
                templateUrl: 'views/entity-viewer/entity-viewer-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                //clickOutsideToClose: true,
                locals: {
                    parentScope: $scope
                }
            }).then(function () {
                vm.updateTable();
            })
        };

        vm.openCustomAdditionsView = function ($event, customButton) {
            vm.additionsStatus.editor = false;
            vm.additionsStatus.table = false;
            vm.additionsState = true;
            vm.additionsStatus.extraFeatures.forEach(function (item) {
                item.isOpened = false;
                if (item.id === customButton.id) {
                    item.isOpened = true;
                }
            });
            console.log('vm.additionsStatus.extraFeatures', vm.additionsStatus.extraFeatures);

        };

        vm.openDataViewPanel = function () {
            vm.additionsStatus.editor = true;
            vm.additionsState = true;
            vm.additionsStatus.extraFeatures.forEach(function (item) {
                item.isOpened = false;
            });
        };

        vm.openEditorViewPanel = function () {
            //vm.editorEntityId = undefined;
            vm.additionsState = true;
            vm.additionsStatus.table = true;
            vm.additionsStatus.extraFeatures.forEach(function (item) {
                item.isOpened = false;
            });
        };

        vm.checkAdditionStatus = function () {
            if (!vm.additionsStatus.table && !vm.additionsStatus.editor) {
                //vm.editorEntityId = undefined;
                return true;
            }
            return false;
        };

        vm.hideAdditions = function () {
            vm.additionsState = false;
            vm.additionsStatus.table = false;
            vm.additionsStatus.editor = false;
            //vm.editorEntityId = undefined;
        };

        vm.getView().then(function () {
            vm.getAttributes().then(function () {
                vm.transformViewAttributes();
                vm.getEntityData();
            });
        });

        vm.checkAddBtn = function () {
            if (["transaction"].indexOf(vm.entityType) !== -1) {
                return false
            }
            return true
        };

        $scope.$on("$destroy", function (event) {

            $('.save-layout-btn').unbind('click');
            logService.controller('EntityViewerController', 'destroyed');
        });


    }

}());