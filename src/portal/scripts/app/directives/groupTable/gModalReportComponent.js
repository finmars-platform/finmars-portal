/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../../services/uiService');

    var evEvents = require('../../services/entityViewerEvents');

    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var balanceReportCustomAttrService = require('../../services/reports/balanceReportCustomAttrService');
    var dynamicAttributesForReportsService = require('../../services/groupTable/dynamicAttributesForReportsService');

    var evDataHelper = require('../../helpers/ev-data.helper');

    module.exports = function ($scope, $mdDialog, entityViewerDataService, entityViewerEventService) {

        var vm = this;
        vm.readyStatus = {content: false};

        vm.tabs = [];
        vm.entityType = entityViewerDataService.getEntityType();

        vm.general = [];
        vm.attrs = [];
        vm.entityAttrs = [];
        vm.custom = [];

        vm.instrumentDynamicAttrs = [];
        vm.accountDynamicAttrs = [];
        vm.portfolioDynamicAttrs = [];

        vm.isReport = ['balance-report',
            'cash-flow-projection-report',
            'performance-report', 'pnl-report',
            'transaction-report'].indexOf(vm.entityType) !== -1;

        vm.tabAttrsReady = false;

        // refactore this block
        function restoreAttrs() {
            function fillTabWithAttrs() {
                var i, x;
                for (i = 0; i < vm.tabs.length; i = i + 1) {
                    if (!vm.tabs[i].attrs) {
                        vm.tabs[i].attrs = [];

                        for (x = 0; x < vm.tabs[i].layout.fields.length; x = x + 1) {
                            ;
                            if (vm.tabs[i].layout.fields[x].type === 'field') {
                                if (vm.tabs[i].layout.fields[x].hasOwnProperty('id')) {
                                    vm.tabs[i].attrs.push({
                                        id: vm.tabs[i].layout.fields[x].id
                                    })
                                } else {
                                    if (vm.tabs[i].layout.fields[x].type === 'field') {
                                        if (vm.tabs[i].layout.fields[x].name != 'Labeled Line' && vm.tabs[i].layout.fields[x].name != 'Line') {
                                            vm.tabs[i].attrs.push({
                                                name: vm.tabs[i].layout.fields[x].name
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                //console.log('vm.tabs[i].attrs', vm.tabs[0].attrs)
            }

            function fillTabAttrs() {

                var a, t, c, b, e;
                var tab, tabAttr, attr, baseAttr, attributeIsExist, entityAttr;


                for (t = 0; t < vm.tabs.length; t = t + 1) {
                    tab = vm.tabs[t];
                    for (c = 0; c < tab.attrs.length; c = c + 1) {
                        tabAttr = tab.attrs[c];
                        attributeIsExist = false;
                        if (tabAttr.hasOwnProperty('id')) {
                            for (a = 0; a < vm.attrs.length; a = a + 1) {
                                attr = vm.attrs[a];
                                if (tabAttr.id === attr.id) {
                                    vm.tabs[t].attrs[c] = attr;
                                    attributeIsExist = true;
                                }
                            }
                            if (!attributeIsExist) {
                                vm.tabs[t].attrs.splice(c, 1);
                                c = c - 1;
                            }
                        } else {

                            for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
                                entityAttr = vm.entityAttrs[e];
                                if (tabAttr.name === entityAttr.name) {
                                    vm.tabs[t].attrs[c] = entityAttr;
                                    attributeIsExist = true;
                                }
                            }

                            if (!attributeIsExist) {
                                vm.tabs[t].attrs.splice(c, 1);
                                c = c - 1;
                            }
                        }
                    }
                }
            }

            fillTabWithAttrs();
            fillTabAttrs();
            vm.tabAttrsReady = true;
        }

        // end refactore

        var columns = entityViewerDataService.getColumns();
        var currentColumnsWidth = columns.length;
        var filters = entityViewerDataService.getFilters();
        var grouping = entityViewerDataService.getGroups();

        var attrsList = [];

        $('body').addClass('drag-dialog'); // hide backdrop

        vm.getAttributes = function () {

            //vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

            vm.balanceAttrs = metaService.getEntityAttrs('balance-report').map(function (item) {
                item.name = 'Balance.' + item.name;
                item.entity = 'balance-report';
                return item;
            });

            vm.balanceMismatchAttrs = metaService.getEntityAttrs('report-mismatch').map(function (item) {
                item.name = 'Mismatch.' + item.name;
                item.entity = 'report-mismatch';
                return item;
            });

            vm.balancePerformanceAttrs = metaService.getEntityAttrs('report-addon-performance').map(function (item) {
                item.name = 'Performance.' + item.name;
                item.entity = 'report-addon-performance';
                return item;
            });

            vm.allocationAttrs = metaService.getEntityAttrs('instrument').map(function (item) {
                item.name = 'Allocation.' + item.name;
                // item.key = 'allocation_object_' + item.key;
                item.entity = 'allocation';
                return item;
            });

            vm.instrumentAttrs = metaService.getEntityAttrs('instrument').map(function (item) {
                item.name = 'Instrument.' + item.name;
                // item.key = 'instrument_object_' + item.key;
                item.entity = 'instrument';
                return item;
            });

            vm.instrumentTypeAttrs = metaService.getEntityAttrs('instrument-type').map(function (item) {
                item.name = 'Instrument.Instrument Type.' + item.name;
                // item.key = 'instrument_type_object_' + item.key;
                item.entity = 'instrument-type';
                return item;
            });

            vm.accountAttrs = metaService.getEntityAttrs('account').map(function (item) {
                item.name = 'Account.' + item.name;
                // item.key = 'account_object_' + item.key;
                item.entity = 'account';
                return item;
            });

            vm.accountTypeAttrs = metaService.getEntityAttrs('account-type').map(function (item) {
                item.name = 'Account.Account Type.' + item.name;
                // item.key = 'account_type_object_' + item.key;
                item.entity = 'account-type';
                return item;
            });

            vm.portfolioAttrs = metaService.getEntityAttrs('portfolio').map(function (item) {
                item.name = 'Portfolio.' + item.name;
                // item.key = 'portfolio_object_' + item.key;
                item.entity = 'portfolio';
                return item;
            });

            vm.strategy1attrs = metaService.getEntityAttrs('strategy-1').map(function (item) {
                item.name = 'Strategy1.' + item.name;
                // item.key = 'strategy1_object_' + item.key;
                item.entity = 'strategy-1';
                return item;
            });
            vm.strategy1subgroupAttrs = metaService.getEntityAttrs('strategy-1-subgroup').map(function (item) {
                item.name = 'Strategy1.Subgroup.' + item.name;
                // item.key = 'strategy1_subgroup_object' + item.key;
                item.entity = 'strategy-1-subgroup';
                return item;
            });
            vm.strategy1groupAttrs = metaService.getEntityAttrs('strategy-1-group').map(function (item) {
                item.name = 'Strategy1.Subgroup.Group.' + item.name;
                // item.key = 'strategy1_group_object' + item.key;
                item.entity = 'strategy-1-group';
                return item;
            });

            vm.strategy2attrs = metaService.getEntityAttrs('strategy-2').map(function (item) {
                item.name = 'Strategy2.' + item.name;
                // item.key = 'strategy2_object' + item.key;
                item.entity = 'strategy-2';
                return item;
            });
            vm.strategy2subgroupAttrs = metaService.getEntityAttrs('strategy-2-subgroup').map(function (item) {
                item.name = 'Strategy2.Subgroup.' + item.name;
                // item.key = 'strategy2_subgroup_object' + item.key;
                item.entity = 'strategy-2-subgroup';
                return item;
            });
            vm.strategy2groupAttrs = metaService.getEntityAttrs('strategy-2-group').map(function (item) {
                item.name = 'Strategy2.Subgroup.Group.' + item.name;
                // item.key = 'strategy2_group_object' + item.key;
                item.entity = 'strategy-2-group';
                return item;
            });

            vm.strategy3attrs = metaService.getEntityAttrs('strategy-3').map(function (item) {
                item.name = 'Strategy3.' + item.name;
                // item.key = 'strategy3_object' + item.key;
                item.entity = 'strategy-3';
                return item;
            });
            vm.strategy3subgroupAttrs = metaService.getEntityAttrs('strategy-3-subgroup').map(function (item) {
                item.name = 'Strategy3.Subgroup.' + item.name;
                // item.key = 'strategy3_subgroup_object' + item.key;
                item.entity = 'strategy-3-subgroup';
                return item;
            });
            vm.strategy3groupAttrs = metaService.getEntityAttrs('strategy-3-group').map(function (item) {
                item.name = 'Strategy3.Subgroup.Group.' + item.name;
                // item.key = 'strategy3_group_object' + item.key;
                item.entity = 'strategy-3-group';
                return item;
            });

            balanceReportCustomAttrService.getList().then(function (data) {
                vm.custom = data.results;
                vm.custom.forEach(function (customItem) {
                    customItem.columnType = 'custom-field';
                });

                dynamicAttributesForReportsService.getDynamicAttributes().then(function (data) {

                    vm.portfolioDynamicAttrs = data['portfolio'];
                    vm.accountDynamicAttrs = data['account'];
                    vm.instrumentDynamicAttrs = data['instrument'];

                    attrsList = attrsList.concat(vm.entityAttrs);
                    attrsList = attrsList.concat(vm.balanceAttrs);
                    attrsList = attrsList.concat(vm.allocationAttrs);

                    attrsList = attrsList.concat(vm.balancePerformanceAttrs);
                    attrsList = attrsList.concat(vm.balanceMismatchAttrs);
                    attrsList = attrsList.concat(vm.custom);

                    attrsList = attrsList.concat(vm.instrumentAttrs);
                    attrsList = attrsList.concat(vm.instrumentTypeAttrs);
                    attrsList = attrsList.concat(vm.instrumentDynamicAttrs);

                    attrsList = attrsList.concat(vm.accountAttrs);
                    attrsList = attrsList.concat(vm.accountTypeAttrs);
                    attrsList = attrsList.concat(vm.accountDynamicAttrs);

                    attrsList = attrsList.concat(vm.portfolioAttrs);
                    attrsList = attrsList.concat(vm.portfolioDynamicAttrs);

                    attrsList = attrsList.concat(vm.strategy1attrs);
                    attrsList = attrsList.concat(vm.strategy1subgroupAttrs);
                    attrsList = attrsList.concat(vm.strategy1groupAttrs);

                    attrsList = attrsList.concat(vm.strategy2attrs);
                    attrsList = attrsList.concat(vm.strategy2subgroupAttrs);
                    attrsList = attrsList.concat(vm.strategy2groupAttrs);

                    attrsList = attrsList.concat(vm.strategy3attrs);
                    attrsList = attrsList.concat(vm.strategy3subgroupAttrs);
                    attrsList = attrsList.concat(vm.strategy3groupAttrs);

                    restoreAttrs();
                    syncAttrs();


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
            }
            else {
                if (['notes'].indexOf(item.key) !== -1) {
                    return true;
                }
                return false;
            }
        };

        vm.bindReportItemName = function (item) {

            if (item.name.toLocaleLowerCase().indexOf('strategy') == -1) {

                var pieces = item.name.split('.');

                return pieces[pieces.length - 1];
            }

            return item.name;
        };

        var syncAttrs = function () {

            syncTypeAttrs(vm.balanceAttrs);
            syncTypeAttrs(vm.balancePerformanceAttrs);
            syncTypeAttrs(vm.balanceMismatchAttrs);
            syncTypeAttrs(vm.custom);
            syncTypeAttrs(vm.allocationAttrs);

            syncTypeAttrs(vm.instrumentAttrs);
            syncTypeAttrs(vm.instrumentTypeAttrs);
            syncTypeAttrs(vm.instrumentDynamicAttrs);

            syncTypeAttrs(vm.accountAttrs);
            syncTypeAttrs(vm.accountTypeAttrs);
            syncTypeAttrs(vm.accountDynamicAttrs);

            syncTypeAttrs(vm.portfolioAttrs);
            syncTypeAttrs(vm.portfolioDynamicAttrs);

            syncTypeAttrs(vm.strategy1attrs);
            syncTypeAttrs(vm.strategy1subgroupAttrs);
            syncTypeAttrs(vm.strategy1groupAttrs);

            syncTypeAttrs(vm.strategy2attrs);
            syncTypeAttrs(vm.strategy2subgroupAttrs);
            syncTypeAttrs(vm.strategy2groupAttrs);

            syncTypeAttrs(vm.strategy3attrs);
            syncTypeAttrs(vm.strategy3subgroupAttrs);
            syncTypeAttrs(vm.strategy3groupAttrs);

        };

        function syncTypeAttrs(attrs) {

            var i;
            for (i = 0; i < attrs.length; i = i + 1) {

                attrs[i].columns = false;
                attrs[i].filters = false;
                attrs[i].groups = false;

                columns.forEach(function (item) {

                    if (item.hasOwnProperty('key')) {

                        if (attrs[i].key === item.key && attrs[i].entity === item.entity) {
                            attrs[i].columns = true;
                        }
                    }

                    if (item.hasOwnProperty('id')) {

                        if (attrs[i].id === item.id && attrs[i].entity === item.entity) {
                            attrs[i].columns = true;
                        }
                    }

                });

                filters.forEach(function (item) {

                    if (item.hasOwnProperty('key')) {

                        if (attrs[i].key === item.key && attrs[i].entity === item.entity) {
                            attrs[i].filters = true;
                        }
                    }

                    if (item.hasOwnProperty('id')) {

                        if (attrs[i].id === item.id && attrs[i].entity === item.entity) {
                            attrs[i].filters = true;
                        }
                    }

                });

                grouping.forEach(function (item) {

                    if (item.hasOwnProperty('key')) {
                        if (attrs[i].key === item.key && attrs[i].entity === item.entity) {
                            attrs[i].groups = true;
                        }
                    }

                    if (item.hasOwnProperty('id')) {

                        if (attrs[i].id === item.id && attrs[i].entity === item.entity) {
                            attrs[i].groups = true;
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

                    if (attr.hasOwnProperty('key')) {
                        if (attr.key === columns[c].key && attr.entity === columns[c].entity) {
                            columnExist = true;
                            if (attr.columns === false) {
                                columns.splice(c, 1);
                                c = c - 1;
                            }
                        }
                    }

                    if (attr.hasOwnProperty('id')) {

                        if (attr.id === columns[c].id && attr.entity === columns[c].entity) {
                            columnExist = true;
                            if (attr.columns === false) {
                                columns.splice(c, 1);
                                c = c - 1;
                            }
                        }

                    }

                }


                /////// GROUPING

                for (g = 0; g < grouping.length; g = g + 1) {


                    if (attr.hasOwnProperty('key')) {
                        if (attr.key === grouping[g].key && attr.entity === grouping[g].entity) {
                            groupExist = true;
                            if (attr.groups === false) {
                                grouping.splice(g, 1);
                                g = g - 1;
                            }
                        }
                    }

                    if (attr.hasOwnProperty('id')) {

                        if (attr.id === grouping[g].id && attr.entity === grouping[g].entity) {
                            groupExist = true;
                            if (attr.groups === false) {
                                grouping.splice(g, 1);
                                g = g - 1;
                            }
                        }

                    }

                }


                /////// FILTERING

                for (f = 0; f < filters.length; f = f + 1) {
                    if (attr.hasOwnProperty('key')) {
                        if (attr.key === filters[f].key && attr.entity === filters[f].entity) {
                            filterExist = true;
                            if (attr.filters === false) {
                                filters.splice(f, 1);
                                f = f - 1;
                            }
                        }
                    }

                    if (attr.hasOwnProperty('id')) {

                        if (attr.id === filters[f].id && attr.entity === filters[f].entity) {
                            filterExist = true;
                            if (attr.filters === false) {
                                filters.splice(f, 1);
                                f = f - 1;
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


        var dragAndDrop = {

            init: function () {
                this.dragula();
                this.eventListeners();
            },

            eventListeners: function () {
                var that = this;
                var exist = false;
                this.dragula.on('over', function (elem, container, source) {
                    $(container).addClass('active');
                    $(container).on('mouseleave', function () {
                        $(this).removeClass('active');
                    })

                });
                this.dragula.on('drop', function (elem, target) {
                    //console.log('here?', target); //TODO fallback to ids instead of name/key
                    $(target).removeClass('active');
                    var name = $(elem).html();
                    var i;

                    var identifier;
                    if ($(elem).attr('data-key-identifier')) {
                        identifier = $(elem).attr('data-key-identifier');
                    } else {
                        identifier = $(elem).html();
                    }

                    exist = false;
                    if (target === document.querySelector('#columnsbag')) {
                        for (i = 0; i < columns.length; i = i + 1) {
                            if (columns[i].key === identifier) {
                                exist = true;
                            }

                            if (columns[i].name === identifier) {
                                exist = true;
                            }
                        }
                    }
                    if (target === document.querySelector('#groupsbag')) {
                        for (i = 0; i < grouping.length; i = i + 1) {
                            if (grouping[i].key === identifier) {
                                exist = true;
                            }

                            if (grouping[i].name === identifier) {
                                exist = true;
                            }
                        }
                    }
                    if (target === document.querySelector('#filtersbag .drop-new-filter')) {
                        for (i = 0; i < filters.length; i = i + 1) {
                            if (filters[i].key === identifier) {
                                exist = true;
                            }

                            if (filters[i].name === identifier) {
                                exist = true;
                            }
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

                                if (attrsList[a].name === identifier) {

                                    if (target === document.querySelector('#columnsbag')) {
                                        columns.push(attrsList[a]);
                                    } else {
                                        columns.splice(index, 0, attrsList[a]);
                                    }

                                    //columns.push(attrsList[a]);
                                }
                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);
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

                                if (attrsList[a].name === identifier) {

                                    if (target === document.querySelector('#groupsbag')) {
                                        grouping.push(attrsList[a]);
                                    } else {
                                        grouping.splice(index, 0, attrsList[a]);
                                    }

                                }
                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);
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

                                if (attrsList[a].name === identifier) {

                                    if (target === document.querySelector('#filtersbag .drop-new-filter')) {
                                        filters.push(attrsList[a]);
                                    } else {
                                        filters.splice(index, 0, attrsList[a]);
                                    }

                                }
                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);
                            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }
                        $scope.$apply();
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