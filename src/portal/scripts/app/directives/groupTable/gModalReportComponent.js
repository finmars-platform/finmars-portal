/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var uiService = require('../../services/uiService');

    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var balanceReportCustomAttrService = require('../../services/reports/balanceReportCustomAttrService');
    var dynamicAttributesForReportsService = require('../../services/groupTable/dynamicAttributesForReportsService');

    module.exports = function ($scope, $mdDialog, parentScope, callback) {

        logService.controller('gModalController', 'initialized');

        var vm = this;
        vm.readyStatus = {content: false};

        vm.tabs = [];
        vm.entityType = parentScope.entityType;

        //console.log('parentScope', parentScope);
        //console.log('vm', vm);

        logService.property('vm.entityType', vm.entityType);

        vm.general = [];
        vm.attrs = [];
        vm.baseAttrs = [];
        vm.entityAttrs = [];
        vm.custom = [];

        vm.instrumentDynamicAttrs = [];
        vm.accountDynamicAttrs = [];
        vm.portfolioDynamicAttrs = [];

        vm.isReport = parentScope.isReport;

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
                //console.log('METHOD: restoreAttrs, data: vm.tabs, value: ', vm.tabs);
                //console.log('METHOD: restoreAttrs, data: vm.attrs, value: ', vm.attrs);
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
                            for (b = 0; b < vm.baseAttrs.length; b = b + 1) {
                                baseAttr = vm.baseAttrs[b];
                                if (tabAttr.name === baseAttr.name) {
                                    vm.tabs[t].attrs[c] = baseAttr;
                                    attributeIsExist = true;
                                }
                            }
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

        var columns = parentScope.options.columns;
        var currentColumnsWidth = parentScope.columns.length;
        var filters = parentScope.options.filters;
        var grouping = parentScope.options.grouping;

        var attrsList = [];

        $('body').addClass('drag-dialog'); // hide backdrop

        vm.getAttributes = function () {

            if (metaService.getEntitiesWithoutBaseAttrsList().indexOf(vm.entityType) === -1) {
                vm.baseAttrs = metaService.getBaseAttrs();
            }

            //vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

            vm.balanceAttrs = metaService.getEntityAttrs('balance-report').map(function (item) {
                item.name = 'Balance.' + item.name;
                return item;
            });

            vm.balanceMismatchAttrs = metaService.getEntityAttrs('report-mismatch').map(function (item) {
                item.name = 'Mismatch.' + item.name;
                return item;
            });

            vm.balancePerformanceAttrs = metaService.getEntityAttrs('report-addon-performance').map(function (item) {
                item.name = 'Performance.' + item.name;
                return item;
            });

            vm.allocationAttrs = metaService.getEntityAttrs('instrument').map(function (item) {
                item.name = 'Allocation.' + item.name;
                item.attribute_entity = 'instrument';
                item.key = 'allocation_object_' + item.key;
                return item;
            });

            vm.instrumentAttrs = metaService.getEntityAttrs('instrument').map(function (item) {
                item.name = 'Instrument.' + item.name;
                item.attribute_entity = 'instrument';
                item.key = 'instrument_object_' + item.key;
                return item;
            });

            vm.instrumentTypeAttrs = metaService.getEntityAttrs('instrument-type').map(function (item) {
                item.name = 'Instrument.Instrument Type.' + item.name;
                item.key = 'instrument_type_object_' + item.key;
                return item;
            });

            vm.accountAttrs = metaService.getEntityAttrs('account').map(function (item) {
                item.name = 'Account.' + item.name;
                item.attribute_entity = 'account';
                item.key = 'account_object_' + item.key;
                return item;
            });

            vm.accountTypeAttrs = metaService.getEntityAttrs('account-type').map(function (item) {
                item.name = 'Account.Account Type.' + item.name;
                item.key = 'account_type_object_' + item.key;
                return item;
            });

            vm.portfolioAttrs = metaService.getEntityAttrs('portfolio').map(function (item) {
                item.name = 'Portfolio.' + item.name;
                item.attribute_entity = 'portfolio';
                item.key = 'portfolio_object_' + item.key;
                return item;
            });

            vm.strategy1attrs = metaService.getEntityAttrs('strategy-1').map(function (item) {
                item.name = 'Strategy1.' + item.name;
                item.key = 'strategy1_object_' + item.key;
                return item;
            });
            vm.strategy1subgroupAttrs = metaService.getEntityAttrs('strategy-1-subgroup').map(function (item) {
                item.name = 'Strategy1.Subgroup.' + item.name;
                item.key = 'strategy1_subgroup_object' + item.key;
                return item;
            });
            vm.strategy1groupAttrs = metaService.getEntityAttrs('strategy-1-group').map(function (item) {
                item.name = 'Strategy1.Subgroup.Group.' + item.name;
                item.key = 'strategy1_group_object' + item.key;
                return item;
            });

            vm.strategy2attrs = metaService.getEntityAttrs('strategy-2').map(function (item) {
                item.name = 'Strategy2.' + item.name;
                item.key = 'strategy2_object' + item.key;
                return item;
            });
            vm.strategy2subgroupAttrs = metaService.getEntityAttrs('strategy-2-subgroup').map(function (item) {
                item.name = 'Strategy2.Subgroup.' + item.name;
                item.key = 'strategy2_subgroup_object' + item.key;
                return item;
            });
            vm.strategy2groupAttrs = metaService.getEntityAttrs('strategy-2-group').map(function (item) {
                item.name = 'Strategy2.Subgroup.Group.' + item.name;
                item.key = 'strategy2_group_object' + item.key;
                return item;
            });

            vm.strategy3attrs = metaService.getEntityAttrs('strategy-3').map(function (item) {
                item.name = 'Strategy3.' + item.name;
                item.key = 'strategy3_object' + item.key;
                return item;
            });
            vm.strategy3subgroupAttrs = metaService.getEntityAttrs('strategy-3-subgroup').map(function (item) {
                item.name = 'Strategy3.Subgroup.' + item.name;
                item.key = 'strategy3_subgroup_object' + item.key;
                return item;
            });
            vm.strategy3groupAttrs = metaService.getEntityAttrs('strategy-3-group').map(function (item) {
                item.name = 'Strategy3.Subgroup.Group.' + item.name;
                item.key = 'strategy3_group_object' + item.key;
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

                    attrsList = vm.attrs.concat(vm.baseAttrs);
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

        parentScope.$watch('options.columns', function () {
            if (vm.tabAttrsReady) {
                columns = parentScope.options.columns;
                syncAttrs();
                callback({silent: true});
            }
        });
        parentScope.$watch('options.filters', function () {
            if (vm.tabAttrsReady) {
                filters = parentScope.options.filters;
                syncAttrs();
                callback({silent: true});
            }
        });
        parentScope.$watch('options.grouping', function () {
            if (vm.tabAttrsReady) {
                grouping = parentScope.options.grouping;
                syncAttrs();
                callback({silent: true});
            }
        });

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
                columns.map(function (item) {
                    //console.log('item', item);
                    //console.log('attrs[i]', attrs[i]);
                    if (attrs[i].name === item.name) {
                        attrs[i].columns = true;
                    }
                    return item;
                });
                filters.map(function (item) {
                    if (attrs[i].name === item.name) {
                        attrs[i].filters = true;
                    }
                    return item;
                });
                grouping.map(function (item) {
                    if (item.hasOwnProperty('key')) {
                        if (attrs[i].key === item.key) {
                            attrs[i].groups = true;
                        }
                    } else {
                        if (attrs[i].name === item.name) {
                            attrs[i].groups = true;
                        }
                    }
                    return item;
                });
            }
        }

        function updateTypeAttrs(typeAttrs) {
            var i, c, g, f;
            var columnExist, groupExist, filterExist;

            for (i = 0; i < typeAttrs.length; i = i + 1) {
                columnExist = false;
                groupExist = false;
                filterExist = false;
                for (c = 0; c < columns.length; c = c + 1) {
                    if (typeAttrs[i].hasOwnProperty('key')) {
                        if (typeAttrs[i].key === columns[c].key) {
                            columnExist = true;
                            if (typeAttrs[i].columns === false) {
                                columns.splice(c, 1);
                                c = c - 1;
                            }
                        }
                    } else {
                        if (typeAttrs[i].name === columns[c].name) {
                            columnExist = true;
                            if (typeAttrs[i].columns === false) {
                                columns.splice(c, 1);
                                c = c - 1;
                            }
                        }
                    }
                }
                if (!columnExist) {
                    if (typeAttrs[i].columns === true) {
                        columns.push(typeAttrs[i]);
                    }
                }

                /////// GROUPING

                for (g = 0; g < grouping.length; g = g + 1) {
                    if (typeAttrs[i].hasOwnProperty('columnType')
                        && typeAttrs[i].columnType == 'custom-field'
                        && typeAttrs[i].name === grouping[g].name) {
                        groupExist = true;
                        if (typeAttrs[i].groups === false) {
                            grouping.splice(g, 1);
                            g = g - 1;
                        }
                    } else {


                        if (typeAttrs[i].hasOwnProperty('key')) {
                            if (typeAttrs[i].key === grouping[g].key) {
                                groupExist = true;
                                if (typeAttrs[i].groups === false) {
                                    grouping.splice(g, 1);
                                    g = g - 1;
                                }
                            }
                        }
                    }
                    //else if (typeAttrs[i].name === grouping[g].name) {
                    //
                    //    groupExist = true;
                    //    if (typeAttrs[i].groups === false) {
                    //        grouping.splice(c, 1);
                    //        g = g - 1;
                    //    }
                    //}
                    //
                    //else {
                    //    //if (typeAttrs[i].id === grouping[g].id) {
                    //    //    groupExist = true;
                    //    //    if (typeAttrs[i].groups === false) {
                    //    //        grouping.splice(g, 1);
                    //    //        g = g - 1;
                    //    //    }
                    //    //}
                    //}
                }
                if (!groupExist) {
                    if (typeAttrs[i].groups === true) {
                        grouping.push(typeAttrs[i]);
                    }
                }

                /////// FILTERING

                for (f = 0; f < filters.length; f = f + 1) {
                    if (typeAttrs[i].hasOwnProperty('key')) {
                        if (typeAttrs[i].key === filters[f].key) {
                            filterExist = true;
                            if (typeAttrs[i].filters === false) {
                                filters.splice(f, 1);
                                f = f - 1;
                            }
                        }
                    } else {
                        if (typeAttrs[i].name === filters[f].name) {
                            filterExist = true;
                            if (typeAttrs[i].filters === false) {
                                filters.splice(f, 1);
                                f = f - 1;
                            }
                        }
                    }
                }
                if (!filterExist) {
                    if (typeAttrs[i].filters === true) {
                        filters.push(typeAttrs[i]);
                    }
                }
            }

            // console.log('attributes in modal ', vm.attrs, vm.baseAttrs, vm.entityAttrs, parentScope);
        }

        vm.updateAttrs = function () {
            updateTypeAttrs(vm.balanceAttrs);
            updateTypeAttrs(vm.balancePerformanceAttrs);
            updateTypeAttrs(vm.balanceMismatchAttrs);
            updateTypeAttrs(vm.custom);
            updateTypeAttrs(vm.allocationAttrs);

            updateTypeAttrs(vm.instrumentAttrs);
            updateTypeAttrs(vm.instrumentTypeAttrs);
            updateTypeAttrs(vm.instrumentDynamicAttrs);

            updateTypeAttrs(vm.accountAttrs);
            updateTypeAttrs(vm.accountTypeAttrs);
            updateTypeAttrs(vm.accountDynamicAttrs);

            updateTypeAttrs(vm.portfolioAttrs);
            updateTypeAttrs(vm.portfolioDynamicAttrs);

            updateTypeAttrs(vm.strategy1attrs);
            updateTypeAttrs(vm.strategy1subgroupAttrs);
            updateTypeAttrs(vm.strategy1groupAttrs);

            updateTypeAttrs(vm.strategy2attrs);
            updateTypeAttrs(vm.strategy2subgroupAttrs);
            updateTypeAttrs(vm.strategy2groupAttrs);

            updateTypeAttrs(vm.strategy3attrs);
            updateTypeAttrs(vm.strategy3subgroupAttrs);
            updateTypeAttrs(vm.strategy3groupAttrs);

            addColumn();
            callback({
                silent: true, options: {
                    columns: columns,
                    filters: filters,
                    grouping: grouping
                }
            });
        };

        vm.cancel = function () {
            $('body').removeClass('drag-dialog');
            $mdDialog.cancel();
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
                    $(target).removeClass('active');

                    console.log('elem', elem);
                    var identifier;
                    if ($(elem).attr('data-key-identifier')) {
                        identifier = $(elem).attr('data-key-identifier');
                    } else {
                        identifier = $(elem).html();
                    }

                    var i;

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
                    if (!exist) {
                        var a;

                        console.log('attrsList', attrsList);

                        if (target === document.querySelector('#columnsbag')) {
                            for (a = 0; a < attrsList.length; a = a + 1) {

                                if (attrsList[a].key === identifier) {
                                    columns.push(attrsList[a]);
                                } else {
                                    if (attrsList[a].name === identifier) {
                                        columns.push(attrsList[a]);
                                    }
                                }

                            }
                            syncAttrs();
                            callback({silent: true});
                        }
                        if (target === document.querySelector('#groupsbag')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === identifier) {
                                    grouping.push(attrsList[a]);
                                }
                            }
                            syncAttrs();
                            callback({silent: true});
                        }
                        if (target === document.querySelector('#filtersbag .drop-new-filter')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === identifier) {
                                    filters.push(attrsList[a]);
                                }
                            }
                            syncAttrs();
                            callback({silent: true});
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
                var items = [document.querySelector('#columnsbag'), document.querySelector('#groupsbag'), document.querySelector('#filtersbag .drop-new-filter')];
                var i;
                var itemsElem = document.querySelectorAll('#dialogbag .g-modal-draggable-card');
                for (i = 0; i < itemsElem.length; i = i + 1) {
                    items.push(itemsElem[i]);
                }

                this.dragula = dragula(items,
                    {
                        copy: true
                    });
            }
        };

        var addColumn = function () {


            //console.log('parentScope.columns', parentScope.columns);

            //if (currentColumnsWidth < parentScope.columns.length) {
            metaService.columnsWidthGroups(true);
            //}
            //else {
            //    metaService.columnsWidthGroups(false);
            //}
        };

        setTimeout(function () {
            dragAndDrop.init();
        }, 500);

        vm.MABtnVisibility = function (entityType) {
            return metaService.checkRestrictedEntityTypesForAM(entityType);
        }
    }

}());