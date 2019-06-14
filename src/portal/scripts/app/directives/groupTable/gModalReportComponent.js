/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../../services/uiService');

    var evEvents = require('../../services/entityViewerEvents');

    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var customFieldService = require('../../services/reports/customFieldService');
    var dynamicAttributesForReportsService = require('../../services/groupTable/dynamicAttributesForReportsService');

    var evDataHelper = require('../../helpers/ev-data.helper');
    var rvAttributesHelper = require('../../helpers/rvAttributesHelper');

    module.exports = function ($scope, $mdDialog, entityViewerDataService, entityViewerEventService) {

        var vm = this;
        vm.readyStatus = {content: false};

        vm.entityType = entityViewerDataService.getEntityType();

        vm.general = [];
        vm.attrs = [];
        vm.custom = [];

        vm.instrumentDynamicAttrs = [];
        vm.accountDynamicAttrs = [];
        vm.portfolioDynamicAttrs = [];

        var columns = entityViewerDataService.getColumns();
        var filters = entityViewerDataService.getFilters();
        var grouping = entityViewerDataService.getGroups();

        var attrsList = [];

        $('body').addClass('drag-dialog'); // hide backdrop

        vm.getAttributes = function () {

            vm.balanceAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.balancereport', '', 'Balance', {maxDepth: 1});

            vm.balanceMismatchAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.balancereportmismatch', '', 'Mismatch', {maxDepth: 1});

            vm.balancePerformanceAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.balancereportperfomance', '', 'Perfomance', {maxDepth: 1});

            vm.allocationAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'allocation', 'Allocation', {maxDepth: 1});

            vm.instrumentAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});

            vm.accountAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account', 'Account', {maxDepth: 1});

            vm.portfolioAttrs = rvAttributesHelper.getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            vm.strategy1attrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1', 'Strategy 1', {maxDepth: 1});

            vm.strategy2attrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2', 'Strategy 2', {maxDepth: 1});

            vm.strategy3attrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3', 'Strategy 3', {maxDepth: 1});

            customFieldService.getList(vm.entityType).then(function (data) {
                vm.custom = data.results;

                vm.custom.forEach(function (customItem) {
                    customItem.key = 'custom_fields.' + customItem.user_code;
                    customItem.name = 'Custom Field. ' + customItem.name;
                });

                dynamicAttributesForReportsService.getDynamicAttributes().then(function (data) {

                    vm.portfolioDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['portfolios.portfolio'], 'portfolios.portfolio', 'portfolio', 'Portfolio');
                    vm.accountDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['accounts.account'], 'accounts.account', 'account', 'Account');
                    vm.instrumentDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['instruments.instrument'], 'instruments.instrument', 'instrument', 'Instrument');
                    vm.allocationDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['instruments.instrument'], 'instruments.instrument', 'allocation', 'Allocation');

                    attrsList = attrsList.concat(vm.balanceAttrs);
                    attrsList = attrsList.concat(vm.allocationAttrs);
                    attrsList = attrsList.concat(vm.allocationDynamicAttrs);

                    attrsList = attrsList.concat(vm.balancePerformanceAttrs);
                    attrsList = attrsList.concat(vm.balanceMismatchAttrs);
                    attrsList = attrsList.concat(vm.custom);

                    attrsList = attrsList.concat(vm.instrumentAttrs);
                    attrsList = attrsList.concat(vm.instrumentDynamicAttrs);

                    attrsList = attrsList.concat(vm.accountAttrs);
                    attrsList = attrsList.concat(vm.accountDynamicAttrs);

                    attrsList = attrsList.concat(vm.portfolioAttrs);
                    attrsList = attrsList.concat(vm.portfolioDynamicAttrs);

                    attrsList = attrsList.concat(vm.strategy1attrs);
                    attrsList = attrsList.concat(vm.strategy2attrs);
                    attrsList = attrsList.concat(vm.strategy3attrs);

                    syncAttrs();
                    console.log("draganddrop attrslist", attrsList);
                    vm.readyStatus.content = true;
                    $scope.$apply();
                });
            });

        };

        vm.getAttributes();

        vm.checkAreaAccessibility = function (item, type) {
            if (type === 'group') {
                if (['notes', 'accounts', 'responsibles', 'counterparties', 'transaction_types', 'portfolios', 'tags', 'content_types'].indexOf(item.key) !== -1) {
                    return true;
                }
                return false;
            } else {
                if (['notes'].indexOf(item.key) !== -1) {
                    return true;
                }
                return false;
            }
        };

        vm.bindReportItemName = function (item) {

            // if (item.name.toLocaleLowerCase().indexOf('strategy') == -1) {
            //
            //     var pieces = item.name.split('.');
            //
            //     return pieces[pieces.length - 1];
            // }

            return item.name;
        };

        var syncAttrs = function () {

            syncTypeAttrs(vm.balanceAttrs);
            syncTypeAttrs(vm.balancePerformanceAttrs);
            syncTypeAttrs(vm.balanceMismatchAttrs);
            syncTypeAttrs(vm.custom);
            syncTypeAttrs(vm.allocationAttrs);
            syncTypeAttrs(vm.allocationDynamicAttrs);

            syncTypeAttrs(vm.instrumentAttrs);
            syncTypeAttrs(vm.instrumentDynamicAttrs);

            syncTypeAttrs(vm.accountAttrs);
            syncTypeAttrs(vm.accountDynamicAttrs);

            syncTypeAttrs(vm.portfolioAttrs);
            syncTypeAttrs(vm.portfolioDynamicAttrs);

            syncTypeAttrs(vm.strategy1attrs);
            syncTypeAttrs(vm.strategy2attrs);
            syncTypeAttrs(vm.strategy3attrs);

        };

        function syncTypeAttrs(attrs) {

            var i;
            for (i = 0; i < attrs.length; i = i + 1) {

                attrs[i].columns = false;
                attrs[i].filters = false;
                attrs[i].groups = false;

                columns.forEach(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (item.hasOwnProperty('key')) {

                            if (attrs[i].key === item.key) {
                                attrs[i].columns = true;
                            }
                        }

                        if (item.hasOwnProperty('id')) {

                            if (attrs[i].id === item.id) {
                                attrs[i].columns = true;
                            }
                        }

                    }

                });

                filters.forEach(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (item.hasOwnProperty('key')) {

                            if (attrs[i].key === item.key) {
                                attrs[i].filters = true;
                            }
                        }

                        if (item.hasOwnProperty('id')) {

                            if (attrs[i].id === item.id) {
                                attrs[i].filters = true;
                            }
                        }

                    }

                });

                grouping.forEach(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (item.hasOwnProperty('key')) {
                            if (attrs[i].key === item.key) {
                                attrs[i].groups = true;
                            }
                        }

                        if (item.hasOwnProperty('id')) {

                            if (attrs[i].id === item.id) {
                                attrs[i].groups = true;
                            }
                        }

                    }

                });
            }
        }

        function updateTypeAttrs(attrs) {
            var c, g, f;
            var columnExist, groupExist, filterExist;

            attrs.forEach(function (attr) {

                columnExist = false;
                groupExist = false;
                filterExist = false;

                for (c = 0; c < columns.length; c = c + 1) {

                    if (attr.entity === columns[c].entity) {

                        if (attr.hasOwnProperty('key')) {
                            if (attr.key === columns[c].key) {
                                columnExist = true;
                                if (attr.columns === false) {
                                    columns.splice(c, 1);
                                    c = c - 1;
                                }
                            }
                        }

                        if (attr.hasOwnProperty('id')) {

                            if (attr.id === columns[c].id) {
                                columnExist = true;
                                if (attr.columns === false) {
                                    columns.splice(c, 1);
                                    c = c - 1;
                                }
                            }

                        }

                    }

                }


                /////// GROUPING

                for (g = 0; g < grouping.length; g = g + 1) {

                    if (attr.entity === grouping[g].entity) {

                        if (attr.hasOwnProperty('key')) {

                            if (attr.key === grouping[g].key) {
                                groupExist = true;
                                if (attr.groups === false) {
                                    grouping.splice(g, 1);
                                    g = g - 1;
                                }
                            }
                        }

                        if (attr.hasOwnProperty('id')) {

                            if (attr.id === grouping[g].id) {
                                groupExist = true;
                                if (attr.groups === false) {
                                    grouping.splice(g, 1);
                                    g = g - 1;
                                }
                            }

                        }

                    }

                }


                /////// FILTERING

                for (f = 0; f < filters.length; f = f + 1) {

                    if (attr.entity === filters[f].entity) {

                        if (attr.hasOwnProperty('key')) {
                            if (attr.key === filters[f].key) {
                                filterExist = true;
                                if (attr.filters === false) {
                                    filters.splice(f, 1);
                                    f = f - 1;
                                }
                            }
                        }

                        if (attr.hasOwnProperty('id')) {

                            if (attr.id === filters[f].id) {
                                filterExist = true;
                                if (attr.filters === false) {
                                    filters.splice(f, 1);
                                    f = f - 1;
                                }
                            }
                        }

                    }

                }

                if (!columnExist && attr.columns === true) {
                    columns.push(attr);
                }

                if (!groupExist && attr.groups === true) {
                    grouping.push(attr);
                }

                if (!filterExist && attr.filters === true) {
                    filters.push(attr);
                }

            });

            entityViewerDataService.setColumns(columns);
            entityViewerDataService.setGroups(grouping);
            entityViewerDataService.setFilters(filters);

        }

        vm.updateAttrs = function (attrs) {

            updateTypeAttrs(attrs);

            evDataHelper.updateColumnsIds(entityViewerDataService);
            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);

            entityViewerEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
            entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
            entityViewerEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        };

        vm.openCustomFieldsManager = function () {

            $mdDialog.show({
                controller: 'CustomFieldDialogController as vm',
                templateUrl: 'views/dialogs/custom-field-dialog-view.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        entityType: vm.entityType
                    }
                }
            })

        };

        var dragAndDrop = {

            init: function () {
                this.dragula();
                this.eventListeners();
            },

            eventListeners: function () {

                var exist = false;
                var columnExist = false;
                var groupExist = false;
                var filterExist = false;

                this.dragula.on('over', function (elem, container, source) {
                    $(container).addClass('active');
                    $(container).on('mouseleave', function () {
                        $(this).removeClass('active');
                    })

                });
                this.dragula.on('drop', function (elem, target) {
                    console.log('here?', target, elem); //TODO fallback to ids instead of name/key
                    $(target).removeClass('active');
                    var name = $(elem).html();
                    var i;

                    var identifier;
                    identifier = $(elem).attr('data-key-identifier');

                    /*if ($(elem).attr('data-key-identifier')) {
                        identifier = $(elem).attr('data-key-identifier');
                    } else {
                        identifier = $(elem).html();
                    }*/

                    exist = false;
                    if (target === document.querySelector('#columnsbag') ||
                        target === document.querySelector('.g-columns-holder')) {
                        for (i = 0; i < columns.length; i = i + 1) {

                            if (columns[i].key === identifier) {
                                exist = true;
                                columnExist = true;
                            }

                            /*if (columns[i].name === identifier) {
                                exist = true;
                                columnExist = true;
                            }*/
                        }
                    }
                    if (target === document.querySelector('#groupsbag') ||
                        target === document.querySelector('.g-groups-holder')) {
                        for (i = 0; i < grouping.length; i = i + 1) {
                            if (grouping[i].key === identifier) {
                                exist = true;
                                groupExist = true;
                            }

                            /*if (grouping[i].name === identifier) {
                                exist = true;
                                groupExist = true;
                            }*/
                        }
                    }
                    if (target === document.querySelector('#filtersbag .drop-new-filter') ||
                        target === document.querySelector('.g-filters-holder')) {
                        for (i = 0; i < filters.length; i = i + 1) {
                            if (filters[i].key === identifier) {
                                exist = true;
                                filterExist = true;
                            }

                            /*if (filters[i].name === identifier) {
                                exist = true;
                                filterExist = true;
                            }*/
                        }
                    }

                    if (!exist && target) {
                        var a;
                        //console.log('target', {target: target});
                        //console.log('elem', {elem: elem});

                        var nodes = Array.prototype.slice.call(target.children);
                        var index = nodes.indexOf(elem);

                        // .g-columns-holder
                        //if (target === document.querySelector('#columnsbag')) {
                        if (target === document.querySelector('.g-columns-holder') ||
                            target === document.querySelector('#columnsbag')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {

                                if (attrsList[a].key === identifier) {

                                    if (target === document.querySelector('#columnsbag')) {
                                        columns.push(attrsList[a]);
                                    } else {
                                        columns.splice(index, 0, attrsList[a]);
                                    }

                                    //columns.push(attrsList[a]);
                                }

                                /*if (attrsList[a].name === identifier) {

                                    if (target === document.querySelector('#columnsbag')) {
                                        columns.push(attrsList[a]);
                                    } else {
                                        columns.splice(index, 0, attrsList[a]);
                                    }

                                    //columns.push(attrsList[a]);
                                }*/
                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);

                            entityViewerEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }

                        if (target === document.querySelector('#groupsbag') ||
                            target === document.querySelector('.g-groups-holder')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {

                                if (attrsList[a].key === identifier) {

                                    if (target === document.querySelector('#groupsbag')) {
                                        grouping.push(attrsList[a]);
                                    } else {
                                        grouping.splice(index, 0, attrsList[a]);
                                    }

                                    //columns.push(attrsList[a]);
                                }

                                /*if (attrsList[a].name === identifier) {

                                    if (target === document.querySelector('#groupsbag')) {
                                        grouping.push(attrsList[a]);
                                    } else {
                                        grouping.splice(index, 0, attrsList[a]);
                                    }

                                }*/
                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);

                            entityViewerEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }

                        if (target === document.querySelector('#filtersbag .drop-new-filter') ||
                            target === document.querySelector('.g-filters-holder')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {

                                if (attrsList[a].key === identifier) {

                                    if (target === document.querySelector('#filtersbag .drop-new-filter')) {
                                        filters.push(attrsList[a]);
                                    } else {
                                        filters.splice(index, 0, attrsList[a]);
                                    }

                                    //columns.push(attrsList[a]);
                                }

                                /*if (attrsList[a].name === identifier) {

                                    if (target === document.querySelector('#filtersbag .drop-new-filter')) {
                                        filters.push(attrsList[a]);
                                    } else {
                                        filters.splice(index, 0, attrsList[a]);
                                    }

                                }*/
                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);

                            entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }

                        $scope.$apply();

                    } else if (exist && target) {

                        var errorMessage = 'Item should be unique';

                        if (columnExist) {
                            errorMessage = 'There is already such column in Column Area';
                        } else if (groupExist) {
                            errorMessage = 'There is already such group in Grouping Area';
                        } else if (filterExist) {
                            errorMessage = 'There is already such filter in Filter Area';
                        }

                        $mdDialog.show({
                            controller: 'WarningDialogController as vm',
                            templateUrl: 'views/warning-dialog-view.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: false,
                            multiple: true,
                            locals: {
                                warning: {
                                    title: 'Error',
                                    description: errorMessage
                                },
                                data: {
                                    actionsButtons: [{
                                        name: "OK",
                                        response: false
                                    }]
                                }
                            }
                        });

                    }

                    $scope.$apply();
                });

                this.dragula.on('dragend', function (el) {
                    $scope.$apply();
                    $(el).remove();
                })
            },

            dragula: function () {

                var items = [
                    document.querySelector('.g-columns-holder'),
                    document.querySelector('#columnsbag'),
                    document.querySelector('.g-groups-holder'),
                    document.querySelector('#groupsbag'),
                    document.querySelector('.g-filters-holder'),
                    document.querySelector('#filtersbag .drop-new-filter')
                ];

                var i;
                var itemsElem = document.querySelectorAll('#dialogbag .g-modal-draggable-card');
                for (i = 0; i < itemsElem.length; i = i + 1) {
                    items.push(itemsElem[i]);
                }

                this.dragula = dragula(items,
                    {
                        accepts: function (el, target, source, sibling) {

                            //console.log('el', el, target, source);

                            if (target.classList.contains('g-modal-draggable-card')) {
                                return false;
                            }

                            return true;
                        },
                        copy: true
                    });
            },

            destroy: function () {
                // console.log('this.dragula', this.dragula);
                this.dragula.destroy();
            }
        };

        vm.cancel = function () {
            $('body').removeClass('drag-dialog');
            dragAndDrop.destroy();
            $mdDialog.cancel();
        };

        vm.initDnd = function () {
            setTimeout(function () {
                dragAndDrop.init();
            }, 500);
        };

        vm.MABtnVisibility = function (entityType) {
            return metaService.checkRestrictedEntityTypesForAM(entityType);
        };

        var init = function () {

            entityViewerEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                columns = entityViewerDataService.getColumns();
                syncAttrs();

            });

            entityViewerEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

                grouping = entityViewerDataService.getGroups();
                syncAttrs();

            });

            entityViewerEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

                filters = entityViewerDataService.getFilters();
                syncAttrs();

            });

        };

        init();
    }

}());