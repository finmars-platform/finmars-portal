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

    var evDataHelper = require('../../helpers/ev-data.helper');

    module.exports = function ($scope, $mdDialog, entityViewerDataService, entityViewerEventService, attributeDataService, contentWrapElement) {

        var vm = this;
        vm.readyStatus = {content: false};

        vm.entityViewerDataService = entityViewerDataService;
        vm.entityViewerEventService = entityViewerEventService;

        vm.contentWrapElement = contentWrapElement;

        vm.entityType = vm.entityViewerDataService.getEntityType();

        vm.general = [];
        vm.attrs = [];
        vm.custom = [];

        vm.instrumentDynamicAttrs = [];
        vm.accountDynamicAttrs = [];
        vm.portfolioDynamicAttrs = [];

        vm.cardsDividedIntoTabs = true;

        var columns = vm.entityViewerDataService.getColumns();
        var filters = vm.entityViewerDataService.getFilters();
        var groups = vm.entityViewerDataService.getGroups();
        //console.log("drag n drop gcf", groups, columns, filters);
        vm.attrsList = [];

        $('body').addClass('drag-dialog'); // hide backdrop

        vm.getAttributes = function () {

            vm.balanceAttrs = attributeDataService.getAllAttributesAsFlatList('reports.balancereport', '', 'Balance', {maxDepth: 1});

            vm.balanceMismatchAttrs = attributeDataService.getAllAttributesAsFlatList('reports.balancereportmismatch', '', 'Mismatch', {maxDepth: 1});

            vm.balancePerformanceAttrs = attributeDataService.getAllAttributesAsFlatList('reports.balancereportperfomance', '', 'Perfomance', {maxDepth: 1});

            vm.allocationAttrs = attributeDataService.getAllAttributesAsFlatList('instruments.instrument', 'allocation', 'Allocation', {maxDepth: 1});

            vm.instrumentAttrs = attributeDataService.getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});

            vm.linkedInstrumentAttrs = attributeDataService.getAllAttributesAsFlatList('instruments.instrument', 'linked_instrument', 'Linked Instrument', {maxDepth: 1});

            vm.accountAttrs = attributeDataService.getAllAttributesAsFlatList('accounts.account', 'account', 'Account', {maxDepth: 1});

            vm.portfolioAttrs = attributeDataService.getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            vm.strategy1attrs = attributeDataService.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1', 'Strategy 1', {maxDepth: 1});

            vm.strategy2attrs = attributeDataService.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2', 'Strategy 2', {maxDepth: 1});

            vm.strategy3attrs = attributeDataService.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3', 'Strategy 3', {maxDepth: 1});

            var instrumentUserFields = attributeDataService.getInstrumentUserFields();

            instrumentUserFields.forEach(function (field) {

                vm.instrumentAttrs = vm.instrumentAttrs.map(function (entityAttr, index) {

                    if (entityAttr.key === 'instrument.' + field.key) {
                        entityAttr.name = 'Instrument. ' + field.name;
                    }

                    return entityAttr;

                });

                vm.allocationAttrs = vm.allocationAttrs.map(function (entityAttr, index) {

                    if (entityAttr.key === 'allocation.' + field.key) {
                        entityAttr.name = 'Allocation. ' + field.name;
                    }

                    return entityAttr;

                });

                vm.linkedInstrumentAttrs = vm.linkedInstrumentAttrs.map(function (entityAttr) {

                    if (entityAttr.key === 'linked_instrument.' + field.key) {
                        entityAttr.name = 'Linked Instrument. ' + field.name;
                    }

                    return entityAttr;

                });


            });

            vm.custom = attributeDataService.getCustomFieldsByEntityType(vm.entityType);

            vm.custom = vm.custom.map(function (customItem) {

                customItem.custom_field = Object.assign({}, customItem);

                customItem.key = 'custom_fields.' + customItem.user_code;
                customItem.name = 'Custom Field. ' + customItem.name;

                return customItem

            });

            var portfolioDynamicAttrs = attributeDataService.getDynamicAttributesByEntityType('portfolio');
            var accountDynamicAttrs = attributeDataService.getDynamicAttributesByEntityType('account');
            var instrumentDynamicAttrs = attributeDataService.getDynamicAttributesByEntityType('instrument');

            vm.portfolioDynamicAttrs = attributeDataService.formatAttributeTypes(portfolioDynamicAttrs, 'portfolios.portfolio', 'portfolio', 'Portfolio');
            vm.accountDynamicAttrs = attributeDataService.formatAttributeTypes(accountDynamicAttrs, 'accounts.account', 'account', 'Account');
            vm.instrumentDynamicAttrs = attributeDataService.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'instrument', 'Instrument');
            vm.allocationDynamicAttrs = attributeDataService.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'allocation', 'Allocation');
            vm.linkedInstrumentDynamicAttrs = attributeDataService.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'linked_instrument', 'Linked Instrument');

            vm.attrsList = vm.attrsList.concat(vm.balanceAttrs);
            vm.attrsList = vm.attrsList.concat(vm.allocationAttrs);
            vm.attrsList = vm.attrsList.concat(vm.allocationDynamicAttrs);

            vm.attrsList = vm.attrsList.concat(vm.balancePerformanceAttrs);
            vm.attrsList = vm.attrsList.concat(vm.balanceMismatchAttrs);
            vm.attrsList = vm.attrsList.concat(vm.custom);

            vm.attrsList = vm.attrsList.concat(vm.instrumentAttrs);
            vm.attrsList = vm.attrsList.concat(vm.instrumentDynamicAttrs);

            vm.attrsList = vm.attrsList.concat(vm.linkedInstrumentAttrs);
            vm.attrsList = vm.attrsList.concat(vm.linkedInstrumentDynamicAttrs);

            vm.attrsList = vm.attrsList.concat(vm.accountAttrs);
            vm.attrsList = vm.attrsList.concat(vm.accountDynamicAttrs);

            vm.attrsList = vm.attrsList.concat(vm.portfolioAttrs);
            vm.attrsList = vm.attrsList.concat(vm.portfolioDynamicAttrs);

            vm.attrsList = vm.attrsList.concat(vm.strategy1attrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy2attrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy3attrs);

            /*vm.allAttributesList = attrsList;*/

            vm.syncAttrs();
            getSelectedAttrs();

            vm.readyStatus.content = true;

        };

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

        vm.syncAttrs = function () {

            syncTypeAttrs(vm.balanceAttrs);
            syncTypeAttrs(vm.balancePerformanceAttrs);
            syncTypeAttrs(vm.balanceMismatchAttrs);
            syncTypeAttrs(vm.custom);
            syncTypeAttrs(vm.allocationAttrs);
            syncTypeAttrs(vm.allocationDynamicAttrs);

            syncTypeAttrs(vm.instrumentAttrs);
            syncTypeAttrs(vm.instrumentDynamicAttrs);

            syncTypeAttrs(vm.linkedInstrumentAttrs);
            syncTypeAttrs(vm.linkedInstrumentDynamicAttrs);

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

                columns.map(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (attrs[i].key === item.key) {
                            attrs[i].columns = true;
                        }


                    }

                });

                filters.map(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (attrs[i].key === item.key) {
                            attrs[i].filters = true;
                        }

                    }

                });

                groups.map(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (attrs[i].key === item.key) {
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

                    if (attr.entity === columns[c].entity) {

                        if (attr.key === columns[c].key) {
                            columnExist = true;
                            if (attr.columns === false) {
                                columns.splice(c, 1);
                                c = c - 1;
                            }
                            break;
                        }


                    }

                }


                /////// GROUPs

                for (g = 0; g < groups.length; g = g + 1) {

                    if (attr.entity === groups[g].entity) {


                        if (attr.key === groups[g].key) {
                            groupExist = true;
                            if (attr.groups === false) {
                                groups.splice(g, 1);
                                g = g - 1;
                            }
                            break;
                        }


                    }

                }


                /////// FILTERING

                for (f = 0; f < filters.length; f = f + 1) {

                    if (attr.entity === filters[f].entity) {

                        if (attr.key === filters[f].key) {
                            filterExist = true;
                            if (attr.filters === false) {
                                filters.splice(f, 1);
                                f = f - 1;
                            }
                            break;
                        }

                    }

                }

                if (!columnExist && attr.columns === true) {
                    columns.push(attr);
                }

                if (!groupExist && attr.groups === true) {
                    groups.push(attr);
                }

                if (!filterExist && attr.filters === true) {
                    filters.push(attr);
                }

            });

            vm.entityViewerDataService.setColumns(columns);
            vm.entityViewerDataService.setGroups(groups);
            vm.entityViewerDataService.setFilters(filters);

        };

        vm.updateAttrs = function (attrs) {

            updateTypeAttrs(attrs);

            evDataHelper.updateColumnsIds(vm.entityViewerDataService);
            evDataHelper.setColumnsDefaultWidth(vm.entityViewerDataService);

            vm.entityViewerEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
            vm.entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
            vm.entityViewerEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

            vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        };

        // format data for SELECTED tab
        var selectedGroups = [];
        var selectedColumns = [];
        var selectedFilters = [];

        var separateSelectedAttrs = function (attributes, attrsVmKey) {

            for (var i = 0; i < attributes.length; i++) {
                var attribute = JSON.parse(angular.toJson(attributes[i]));
                attribute.attrsVmKey = attrsVmKey;

                // attrsVmKey used in vm.updateAttrs and selectedDnD
                if (attribute.groups) {
                    selectedGroups.push(attribute);
                } else if (attribute.columns) {
                    selectedColumns.push(attribute);
                } else if (attribute.filters) {
                    selectedFilters.push(attribute);
                };

            };
        };

        var groupSelectedGroups = function (insideTable, selectedAttrs, vmKey) { // putting selected attributes in the same order as in the table

            var a;
            for (a = 0; a < insideTable.length; a++) {
                var attr = insideTable[a];

                for (var i = 0; i < selectedAttrs.length; i++) {
                    var sAttr = selectedAttrs[i];

                    if (sAttr.key === attr.key) {
                        vm[vmKey].push(sAttr);
                        break;
                    }

                }

            }

        };

        var getSelectedAttrs = function () {

            vm.selectedGroups = [];
            vm.selectedColumns = [];
            vm.selectedFilters = [];

            selectedGroups = [];
            selectedColumns = [];
            selectedFilters = [];

            separateSelectedAttrs(vm.balanceAttrs, 'balanceAttrs');
            separateSelectedAttrs(vm.balancePerformanceAttrs, 'balancePerformanceAttrs');
            separateSelectedAttrs(vm.balanceMismatchAttrs, 'balanceMismatchAttrs');
            separateSelectedAttrs(vm.custom, 'custom');
            separateSelectedAttrs(vm.allocationAttrs, 'allocationAttrs');
            separateSelectedAttrs(vm.allocationDynamicAttrs, 'allocationDynamicAttrs');

            separateSelectedAttrs(vm.instrumentAttrs, 'instrumentAttrs');
            separateSelectedAttrs(vm.instrumentDynamicAttrs, 'instrumentDynamicAttrs');

            separateSelectedAttrs(vm.linkedInstrumentAttrs, 'linkedInstrumentAttrs');
            separateSelectedAttrs(vm.linkedInstrumentDynamicAttrs, 'linkedInstrumentDynamicAttrs');

            separateSelectedAttrs(vm.accountAttrs, 'accountAttrs');
            separateSelectedAttrs(vm.accountDynamicAttrs, 'accountDynamicAttrs');

            separateSelectedAttrs(vm.portfolioAttrs, 'portfolioAttrs');
            separateSelectedAttrs(vm.portfolioDynamicAttrs, 'portfolioDynamicAttrs');

            separateSelectedAttrs(vm.strategy1attrs, 'strategy1attrs');
            separateSelectedAttrs(vm.strategy2attrs, 'strategy2attrs');
            separateSelectedAttrs(vm.strategy3attrs, 'strategy3attrs');


            groupSelectedGroups(groups, selectedGroups, 'selectedGroups');
            groupSelectedGroups(columns, selectedColumns, 'selectedColumns');
            groupSelectedGroups(filters, selectedFilters, 'selectedFilters');

        };
        // < format data for SELECTED tab >

        vm.onSelectedAttrsChange = function (attributesList, selectedAttr) {

            for (var i = 0; i < attributesList.length; i++) {
                if (attributesList[i].key === selectedAttr.key) {
                    attributesList[i].groups = selectedAttr.groups;
                    attributesList[i].columns = selectedAttr.columns;
                    attributesList[i].filters = selectedAttr.filters;
                    break;
                };
            };

            vm.updateAttrs(attributesList);

        };


        vm.cancel = function () {
            $('body').removeClass('drag-dialog');
            $mdDialog.hide();
        };

        vm.MABtnVisibility = function (entityType) {
            return metaService.checkRestrictedEntityTypesForAM(entityType);
        };

        var init = function () {

            vm.getAttributes();

            vm.entityViewerEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                columns = vm.entityViewerDataService.getColumns();
                vm.syncAttrs();
                getSelectedAttrs();

            });

            vm.entityViewerEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

                groups = vm.entityViewerDataService.getGroups();
                vm.syncAttrs();
                getSelectedAttrs();

            });

            vm.entityViewerEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

                filters = vm.entityViewerDataService.getFilters();
                vm.syncAttrs();
                getSelectedAttrs();

            });

        };

        init();
    }

}());