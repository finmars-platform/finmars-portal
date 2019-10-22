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
        var attrsList = [];

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

            attrsList = attrsList.concat(vm.balanceAttrs);
            attrsList = attrsList.concat(vm.allocationAttrs);
            attrsList = attrsList.concat(vm.allocationDynamicAttrs);

            attrsList = attrsList.concat(vm.balancePerformanceAttrs);
            attrsList = attrsList.concat(vm.balanceMismatchAttrs);
            attrsList = attrsList.concat(vm.custom);

            attrsList = attrsList.concat(vm.instrumentAttrs);
            attrsList = attrsList.concat(vm.instrumentDynamicAttrs);

            attrsList = attrsList.concat(vm.linkedInstrumentAttrs);
            attrsList = attrsList.concat(vm.linkedInstrumentDynamicAttrs);

            attrsList = attrsList.concat(vm.accountAttrs);
            attrsList = attrsList.concat(vm.accountDynamicAttrs);

            attrsList = attrsList.concat(vm.portfolioAttrs);
            attrsList = attrsList.concat(vm.portfolioDynamicAttrs);

            attrsList = attrsList.concat(vm.strategy1attrs);
            attrsList = attrsList.concat(vm.strategy2attrs);
            attrsList = attrsList.concat(vm.strategy3attrs);

            vm.allAttributesList = attrsList;

            syncAttrs();
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

        var syncAttrs = function () {

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
                    };
                };

            };

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

        var viewConstructorDnD = {

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
                    var i;

                    var identifier;
                    identifier = $(elem).attr('data-key-identifier');

                    exist = false;
                    if (target === contentWrapElement.querySelector('#columnsbag') ||
                        target === contentWrapElement.querySelector('.g-columns-holder')) {
                        for (i = 0; i < columns.length; i = i + 1) {

                            if (columns[i].key === identifier) {
                                exist = true;
                                columnExist = true;
                            }

                        }
                    }
                    /*if (target === contentWrapElement.querySelector('#groupsbag') ||
                        target === contentWrapElement.querySelector('.g-groups-holder')) {*/
                    if (target === contentWrapElement.querySelector('#groupsbag')) {
                        for (i = 0; i < groups.length; i = i + 1) {
                            if (groups[i].key === identifier) {
                                exist = true;
                                groupExist = true;
                            }

                        }
                    }

                    if (target === contentWrapElement.querySelector('#filtersbag .drop-new-filter') ||
                        target === contentWrapElement.querySelector('.g-filters-holder')) {
                        for (i = 0; i < filters.length; i = i + 1) {
                            if (filters[i].key === identifier) {
                                exist = true;
                                filterExist = true;
                            }
                        }
                    }

                    if (!exist && target) {
                        var a;

                        var nodes = Array.prototype.slice.call(target.children);
                        var index = nodes.indexOf(elem);

                        // .g-columns-holder
                        if (target === contentWrapElement.querySelector('.g-columns-holder') ||
                            target === contentWrapElement.querySelector('#columnsbag')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {

                                if (attrsList[a].key === identifier) {

                                    if (target === contentWrapElement.querySelector('#columnsbag')) {
                                        columns.push(attrsList[a]);
                                    } else {
                                        columns.splice(index, 0, attrsList[a]);
                                    }

                                }

                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(vm.entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(vm.entityViewerDataService);

                            vm.entityViewerEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                            vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        };

                        if (target === contentWrapElement.querySelector('#groupsbag')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].key === identifier) {
                                    groups.push(attrsList[a]);
                                }
                            }

                            syncAttrs();
                            evDataHelper.updateColumnsIds(vm.entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(vm.entityViewerDataService);

                            vm.entityViewerEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                            vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }

                        if (target === contentWrapElement.querySelector('#filtersbag .drop-new-filter') ||
                            target === contentWrapElement.querySelector('.g-filters-holder')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {

                                if (attrsList[a].key === identifier) {
                                    if (target === contentWrapElement.querySelector('#filtersbag .drop-new-filter')) {
                                        filters.push(attrsList[a]);
                                    } else {
                                        filters.splice(index, 0, attrsList[a]);
                                    }
                                }
                            }

                            syncAttrs();
                            evDataHelper.updateColumnsIds(vm.entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(vm.entityViewerDataService);

                            vm.entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                            vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }

                        $scope.$apply();

                    } else if (exist && target) {

                        var errorMessage = 'Item should be unique';

                        if (columnExist) {
                            errorMessage = 'There is already such column in Column Area';
                        } else if (groupExist) {
                            errorMessage = 'There is already such group in Groups Area';
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
                                    description: errorMessage,
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
                });

            },

            dragula: function () {

                var items = [
                    contentWrapElement.querySelector('.g-columns-holder'),
                    contentWrapElement.querySelector('#columnsbag'),
                    // document.querySelector('.g-groups-holder'),
                    contentWrapElement.querySelector('#groupsbag'),
                    contentWrapElement.querySelector('.g-filters-holder'),
                    contentWrapElement.querySelector('#filtersbag .drop-new-filter')
                ];

                var i;
                var itemsElem = document.querySelectorAll('#dialogbag .vcDraggableCard');
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
                this.dragula.destroy();
            }
        };

        // scroll while dragging
        var DnDScrollElem;
        var DnDScrollTimeOutId;

        var DnDWheel = function (event) {
            event.preventDefault();
            clearTimeout(DnDScrollTimeOutId);

            var scrolled = DnDScrollElem.scrollTop;

            var scrollSize = event.deltaY * 50;

            DnDScrollTimeOutId = setTimeout(function () { // timeout needed for smoother scroll
                DnDScrollElem.scroll({
                    top: scrolled + scrollSize,
                    behavior: 'smooth'
                });
            }, 30);

        };
        // < scroll while dragging >

        var selectedDnD = {

            init: function () {
                this.selectedDragulaInit();
                this.eventListeners();
            },

            eventListeners: function () {

                var attributeChanged = false;
                var drake = this.dragula;

                drake.on('drag', function () {
                    document.addEventListener('wheel', DnDWheel);
                });

                drake.on('drop', function (elem, target, source, nextSibling) {

                    var attributeKey = elem.dataset.attributeKey;
                    var attrsVmKey = elem.dataset.vmKey;

                    // dragging from groups
                    if (source.classList.contains('vcSelectedGroups')) {

                        // dragged to columns
                        if (target.classList.contains('vcSelectedColumns')) {

                            attributeChanged = false;

                            for (var i = 0; i < vm[attrsVmKey].length; i++) {
                                if (vm[attrsVmKey][i].key === attributeKey) {
                                    vm[attrsVmKey][i].groups = false;
                                    attributeChanged = true;
                                    break;
                                };
                            };
                        // < dragged to columns >

                        // dragged to filters
                        } else if (target.classList.contains('vcSelectedFilters')) {

                            for (var i = 0; i < vm[attrsVmKey].length; i++) {
                                if (vm[attrsVmKey][i].key === attributeKey) {
                                    vm[attrsVmKey][i].groups = false;
                                    vm[attrsVmKey][i].columns = false;
                                    vm[attrsVmKey][i].filters = true;
                                    attributeChanged = true;
                                    break;
                                }
                            }

                        // < dragged to filters >

                            // If group's order changed
                        } else if (target.classList.contains('vcSelectedGroups')) {

                            var groupElems = source.querySelectorAll('.vcSelectedGroupItem');

                            var groupsAfterDragging = [];

                            for (var i = 0; i < groupElems.length; i = i + 1) {

                                var groupElemKey = groupElems[i].dataset.attributeKey;

                                for (var x = 0; x < groups.length; x = x + 1) {

                                    if (groupElemKey === groups[x].key) {
                                        groupsAfterDragging.push(groups[x]);
                                        break;
                                    }

                                }

                            }

                            var isChanged = false;

                            for (var i = 0; i < groupsAfterDragging.length; i++) {
                                var group = groupsAfterDragging[i];

                                if (group.key !== groups[i].key) {
                                    isChanged = true;
                                    break;
                                }
                            }

                            if (isChanged) {

                                vm.entityViewerDataService.setGroups(groupsAfterDragging);

                                vm.entityViewerEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                $scope.$apply();

                            }

                            // < If group's order changed >
                        }

                        // < dragging from groups >

                    // dragging from columns
                    } else if (source.classList.contains('vcSelectedColumns')) {

                        // dragged to groups
                        if (target.classList.contains('vcSelectedGroups')) {

                            for (var i = 0; i < vm[attrsVmKey].length; i++) {
                                if (vm[attrsVmKey][i].key === attributeKey) {
                                    vm[attrsVmKey][i].groups = true;
                                    attributeChanged = true;
                                    break;
                                }
                            }
                        // < dragged to groups >

                        // dragged to filters
                        } else if (target.classList.contains('vcSelectedFilters')) {

                            for (var i = 0; i < vm[attrsVmKey].length; i++) {
                                if (vm[attrsVmKey][i].key === attributeKey) {
                                    vm[attrsVmKey][i].columns = false;
                                    vm[attrsVmKey][i].filters = true;
                                    attributeChanged = true;
                                    break;
                                }
                            }
                        // < dragged to filters >

                        // If column's order changed
                        } else if (target.classList.contains('vcSelectedColumns')) {

                            var columnElems = source.querySelectorAll('.vcSelectedColumnItem');

                            var columnsAfterDragging = [];

                            for (var i = 0; i < groups.length; i++) { // add columns that has groups

                                var groupKey = groups[i].key;

                                for (var x = 0; x < columns.length; x++) {

                                    if (groupKey === columns[x].key) {
                                        columnsAfterDragging.push(columns[x]);
                                        break;
                                    }

                                }

                            }

                            for (var i = 0; i < columnElems.length; i = i + 1) {

                                var colElemKey = columnElems[i].dataset.attributeKey;

                                for (var x = 0; x < columns.length; x = x + 1) {

                                    if (colElemKey === columns[x].key) {
                                        columnsAfterDragging.push(columns[x]);
                                        break;
                                    }

                                }

                            }

                            var isChanged = false;

                            for (var i = 0; i < columnsAfterDragging.length; i++) {
                                var column = columnsAfterDragging[i];

                                if (column.key !== columns[i].key) {
                                    isChanged = true;
                                    break;
                                }
                            }

                            if (isChanged) {

                                vm.entityViewerDataService.setColumns(columnsAfterDragging);

                                vm.entityViewerEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                $scope.$apply();

                            }

                        // < If column's order changed >
                        }
                    // < dragging from columns >

                    // dragging from filters
                    } else if (source.classList.contains('vcSelectedFilters')) {

                        // dragged to groups
                        if (target.classList.contains('vcSelectedGroups')) {

                            for (var i = 0; i < vm[attrsVmKey].length; i++) {
                                if (vm[attrsVmKey][i].key === attributeKey) {
                                    vm[attrsVmKey][i].groups = true;
                                    attributeChanged = true;
                                    break;
                                }
                            }
                            // < dragged to columns >

                            // dragged to columns
                        } else if (target.classList.contains('vcSelectedColumns')) {

                            for (var i = 0; i < vm[attrsVmKey].length; i++) {
                                if (vm[attrsVmKey][i].key === attributeKey) {
                                    vm[attrsVmKey][i].columns = true;
                                    attributeChanged = true;
                                    break;
                                }
                            }
                        // < dragged to groups >

                            // If filter's order changed
                        } else if (target.classList.contains('vcSelectedFilters')) {

                            var filterElems = source.querySelectorAll('.vcSelectedFilterItem');

                            var filtersAfterDragging = [];

                            for (var i = 0; i < filterElems.length; i = i + 1) {

                                var filterElemKey = filterElems[i].dataset.attributeKey;

                                for (var x = 0; x < filters.length; x = x + 1) {

                                    if (filterElemKey === filters[x].key) {
                                        filtersAfterDragging.push(filters[x]);
                                    }

                                }

                            }

                            var isChanged = false;

                            for (var i = 0; i < filtersAfterDragging.length; i++) {
                                var filter = filtersAfterDragging[i];

                                if (filter.key !== filters[i].key) {
                                    isChanged = true;
                                    break;
                                }
                            }

                            if (isChanged) {

                                vm.entityViewerDataService.setFilters(filtersAfterDragging);

                                vm.entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                                vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                $scope.$apply();

                            }

                        // < If filter's order changed >
                        }

                    }
                    // < dragging from filters >

                    if (attributeChanged) {
                        $(elem).remove();
                        vm.updateAttrs(vm[attrsVmKey]);
                    }

                });

                drake.on('dragend', function () {
                    document.removeEventListener('wheel', DnDWheel);
                });

            },

            selectedDragulaInit: function () {

                var items = [
                    document.querySelector('.vcSelectedGroups'),
                    document.querySelector('.vcSelectedColumns'),
                    document.querySelector('.vcSelectedFilters')
                ];

                this.dragula = dragula(items, {
                    revertOnSpill: true
                });
            },

            destroy: function () {
                this.dragula.destroy();
            }
        };

        vm.cancel = function () {
            $('body').removeClass('drag-dialog');
            viewConstructorDnD.destroy();
            selectedDnD.destroy();
            $mdDialog.hide();
        };

        vm.initDnd = function () {
            setTimeout(function () {
                DnDScrollElem = document.querySelector('.vc-dnd-scrollable-elem');
                viewConstructorDnD.init();
                selectedDnD.init();
            }, 500);
        };

        vm.MABtnVisibility = function (entityType) {
            return metaService.checkRestrictedEntityTypesForAM(entityType);
        };

        var init = function () {

            vm.getAttributes();

            vm.entityViewerEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                columns = vm.entityViewerDataService.getColumns();
                syncAttrs();
                getSelectedAttrs();

            });

            vm.entityViewerEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

                groups = vm.entityViewerDataService.getGroups();
                syncAttrs();
                getSelectedAttrs();

            });

            vm.entityViewerEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

                filters = vm.entityViewerDataService.getFilters();
                syncAttrs();
                getSelectedAttrs();

            });

        };

        init();
    }

}());