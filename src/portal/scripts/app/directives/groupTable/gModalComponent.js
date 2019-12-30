/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var uiService = require('../../services/uiService');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var evEvents = require('../../services/entityViewerEvents');

    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');

    module.exports = function ($scope, $mdDialog, entityViewerDataService, entityViewerEventService, attributeDataService, contentWrapElement) {

        var vm = this;
        vm.readyStatus = {content: false};

        vm.entityViewerDataService = entityViewerDataService;
        vm.entityViewerEventService = entityViewerEventService;

        vm.entityType = vm.entityViewerDataService.getEntityType();
        vm.contentType = vm.entityViewerDataService.getContentType();

        console.log('vm', vm);

        logService.property('vm.entityType', vm.entityType);

        vm.attrs = [];
        vm.entityAttrs = [];

        vm.userTextFields = [];
        vm.userNumberFields = [];
        vm.userDateFields = [];

        vm.cardsDividedIntoTabs = true;

        var columns = vm.entityViewerDataService.getColumns();
        var currentColumnsWidth = columns.length;
        var filters = vm.entityViewerDataService.getFilters();
        var groups = vm.entityViewerDataService.getGroups();

        vm.attrsList = [];

        var attrsWithoutGroups = ['notes', 'accounts', 'responsibles', 'counterparties', 'transaction_types', 'portfolios', 'tags', 'content_types'];
        var attrsWithoutFilters = ['notes'];

        $('body').addClass('drag-dialog'); // hide backdrop

        vm.getUserFields = function () {

            return new Promise(function (resolve) {

                if (vm.entityType === 'complex-transaction') {
                    uiService.getTransactionFieldList({pageSize: 1000}).then(function (data) {
                        resolve(data);
                    })
                } else {

                    if (vm.entityType === 'instrument') {
                        uiService.getInstrumentFieldList().then(function (data) {
                            resolve(data);
                        })

                    } else {
                        resolve({results: []})
                    }

                }

            })

        };

        vm.getAttributes = function () {

            var viewContext = vm.entityViewerDataService.getViewContext();

            if (viewContext === 'reconciliation_viewer') {

                /*var columns = vm.entityViewerDataService.getColumns();

                console.log('columns', columns);

                vm.entityAttrs = columns.map(function (item) {
                    return item
                });*/

                vm.entityAttrs = attributeDataService.getReconciliationAttributes();

                syncAttrs();
                getSelectedAttrs();

                vm.readyStatus.content = true;


            } else {

                vm.entityAttrs = attributeDataService.getEntityAttributesByEntityType(vm.entityType);

                var transactionUserFields = attributeDataService.getTransactionUserFields();

                vm.entityAttrs = vm.entityAttrs.filter(function (item, index) {

                    if (item.key === 'subgroup' && item.value_entity.indexOf('strategy') !== -1) {
                        item.name = 'Group';
                    }
                    item.entity = vm.entityType;

                    for (var i = 0; i < transactionUserFields.length; i++) {
                        var transField = transactionUserFields[i];

                        if (item.key === transField.key) {
                            item.name = transField.name;
                            break;
                        }
                    }

                    if (item.key.indexOf("user_text_") !== -1) {
                        vm.userTextFields.push(item);
                        return false;
                    } else if (item.key.indexOf("user_number_") !== -1) {
                        vm.userNumberFields.push(item);
                        return false;
                    } else if (item.key.indexOf("user_date_") !== -1) {
                        vm.userDateFields.push(item);
                        return false;
                    }

                    return true;
                });

                vm.attrs = attributeDataService.getDynamicAttributesByEntityType(vm.entityType);

                console.log('vm.attrs', vm.attrs);

                vm.attrs = vm.attrs.map(function (attribute) {

                    var result = {};

                    result.attribute_type = Object.assign({}, attribute);
                    result.value_type = attribute.value_type;
                    result.content_type = vm.contentType;
                    result.key = 'attributes.' + attribute.user_code;
                    result.name = attribute.name;

                    return result

                });

                vm.attrsList = vm.attrsList.concat(vm.entityAttrs);
                vm.attrsList = vm.attrsList.concat(vm.userTextFields);
                vm.attrsList = vm.attrsList.concat(vm.userNumberFields);
                vm.attrsList = vm.attrsList.concat(vm.userDateFields);
                vm.attrsList = vm.attrsList.concat(vm.attrs);

                syncAttrs();
                getSelectedAttrs();

                vm.readyStatus.content = true;

            }

        };

        vm.checkAreaAccessibility = function (item, type) {
            if (type === 'group') {
                if (attrsWithoutGroups.indexOf(item.key) !== -1) {
                    return true;
                }
                return false;
            } else {
                if (attrsWithoutFilters.indexOf(item.key) !== -1) {
                    return true;
                }
                return false;
            }
        };

        var syncAttrs = function () {
            syncTypeAttrs(vm.entityAttrs);
            syncTypeAttrs(vm.attrs);
        };

        function syncTypeAttrs(attrs) {

            var i;
            for (i = 0; i < attrs.length; i = i + 1) {
                attrs[i].columns = false;
                attrs[i].groups = false;
                attrs[i].filters = false;

                groups.map(function (item) {
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

                columns.map(function (item) {
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
                            break;
                        }
                    } else {
                        if (typeAttrs[i].name === columns[c].name) {
                            columnExist = true;
                            if (typeAttrs[i].columns === false) {
                                columns.splice(c, 1);
                                c = c - 1;
                            }
                            break;
                        }
                    }
                }

                if (!columnExist) {
                    if (typeAttrs[i].columns === true) {
                        columns.push(typeAttrs[i]);
                    }
                }

                /////// GROUPING

                for (g = 0; g < groups.length; g = g + 1) {
                    if (typeAttrs[i].hasOwnProperty('key')) {
                        if (typeAttrs[i].key === groups[g].key) {
                            groupExist = true;
                            if (typeAttrs[i].groups === false) {
                                groups.splice(g, 1);
                                g = g - 1;
                            }
                            break;
                        }
                    } else {
                        if (typeAttrs[i].id === groups[g].id) {
                            groupExist = true;
                            if (typeAttrs[i].groups === false) {
                                groups.splice(g, 1);
                                g = g - 1;
                            }
                            break;
                        }
                    }
                }
                if (!groupExist) {
                    if (typeAttrs[i].groups === true) {
                        groups.push(typeAttrs[i]);
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
                            break;
                        }
                    } else {
                        if (typeAttrs[i].name === filters[f].name) {
                            filterExist = true;
                            if (typeAttrs[i].filters === false) {
                                filters.splice(f, 1);
                                f = f - 1;
                            }
                            break;
                        }
                    }
                }
                if (!filterExist) {
                    if (typeAttrs[i].filters === true) {
                        filters.push(typeAttrs[i]);
                    }
                }
            }

            vm.entityViewerDataService.setColumns(columns);
            vm.entityViewerDataService.setGroups(groups);
            vm.entityViewerDataService.setFilters(filters);

        }

        vm.updateAttrs = function (attributes) {

            updateTypeAttrs(attributes);

            addColumn();

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
                attribute['attrsVmKey'] = attrsVmKey;

                // attrsVmKey used in vm.updateAttrs and selectedDnD
                if (attribute.columns) {
                    selectedColumns.push(attribute);
                } else if (attribute.groups) {
                    selectedGroups.push(attribute);
                }

                if (attribute.filters) {
                    selectedFilters.push(attribute);
                }
            }

        };

        var groupSelectedGroups = function (insideTable, selectedAttrs) { // putting selected attributes in the same order as in the table

            var orderedSelAttrs = [];

            var a;
            for (a = 0; a < insideTable.length; a++) {
                var attr = insideTable[a];

                for (var i = 0; i < selectedAttrs.length; i++) {
                    var sAttr = selectedAttrs[i];

                    if (sAttr.key === attr.key) {
                        orderedSelAttrs.push(sAttr);
                        break;
                    }
                }

            }

            return orderedSelAttrs;

        };

        vm.selectedGroups = [];
        vm.selectedColumns = [];
        vm.selectedFilters = [];

        var getSelectedAttrs = function () {

            selectedGroups = [];
            selectedColumns = [];
            selectedFilters = [];

            separateSelectedAttrs(vm.entityAttrs, 'entityAttrs');
            separateSelectedAttrs(vm.attrs, 'attrs');

            vm.selectedGroups = groupSelectedGroups(groups, selectedGroups);
            vm.selectedColumns = groupSelectedGroups(columns, selectedColumns);
            vm.selectedFilters = groupSelectedGroups(filters, selectedFilters);

        };

        // < format data for SELECTED tab >

        vm.onSelectedAttrsChange = function (attributesList, selectedAttr) {

            for (var i = 0; i < attributesList.length; i++) {
                if (attributesList[i].key === selectedAttr.key) {
                    attributesList[i].groups = selectedAttr.groups;
                    attributesList[i].columns = selectedAttr.columns;
                    attributesList[i].filters = selectedAttr.filters;
                    break;
                }
            }

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

                    $(target).removeClass('active');
                    // var name = $(elem).html();
                    var identifier = $(elem).attr('data-key-identifier');
                    var i;


                    exist = false;
                    if (target === contentWrapElement.querySelector('#columnsbag') ||
                        target === contentWrapElement.querySelector('.g-columns-holder')) {
                        for (i = 0; i < columns.length; i = i + 1) {
                            if (columns[i].key === identifier) {
                                exist = true;
                                columnExist = true;
                            }
                            /*if (columns[i].name === name) {
                                exist = true;
                            }*/
                        }
                    }

                    if (target === contentWrapElement.querySelector('#groupsbag') ||
                        target === contentWrapElement.querySelector('.g-groups-holder')) {
                        for (i = 0; i < groups.length; i = i + 1) {
                            /*if (groups[i].name === name) {
                                exist = true;
                            }*/
                            if (groups[i].key === identifier) {
                                exist = true;
                                groupExist = true;
                            }
                        }
                    }

                    if (target === contentWrapElement.querySelector('#filtersbag .drop-new-filter') ||
                        target === contentWrapElement.querySelector('.g-filters-holder')) {
                        for (i = 0; i < filters.length; i = i + 1) {
                            /*if (filters[i].name === name) {
                                exist = true;
                            }*/

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

                        if (target === contentWrapElement.querySelector('.g-columns-holder') ||
                            target === contentWrapElement.querySelector('#columnsbag')) {

                            for (a = 0; a < vm.attrsList.length; a = a + 1) {

                                if (vm.attrsList[a].key === identifier) {

                                    if (target === contentWrapElement.querySelector('#columnsbag')) {
                                        columns.push(vm.attrsList[a]);
                                    } else {
                                        columns.splice(index, 0, vm.attrsList[a]);
                                    }

                                    //columns.push(vm.attrsList[a]);
                                }

                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(vm.entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(vm.entityViewerDataService);
                            vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }

                        if (target === contentWrapElement.querySelector('#groupsbag') ||
                            target === contentWrapElement.querySelector('.g-groups-holder')) {

                            for (a = 0; a < vm.attrsList.length; a = a + 1) {

                                if (vm.attrsList[a].key === identifier) {

                                    if (target === contentWrapElement.querySelector('#groupsbag')) {
                                        groups.push(vm.attrsList[a]);
                                    } else {
                                        groups.splice(index, 0, vm.attrsList[a]);
                                    }

                                    //columns.push(vm.attrsList[a]);
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

                            for (a = 0; a < vm.attrsList.length; a = a + 1) {

                                if (vm.attrsList[a].key === identifier) {

                                    if (target === contentWrapElement.querySelector('#filtersbag .drop-new-filter')) {
                                        filters.push(vm.attrsList[a]);
                                    } else {
                                        filters.splice(index, 0, vm.attrsList[a]);
                                    }

                                }

                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(vm.entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(vm.entityViewerDataService);
                            vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }

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
                    contentWrapElement.querySelector('.g-columns-holder'),
                    contentWrapElement.querySelector('#columnsbag'),
                    contentWrapElement.querySelector('.g-groups-holder'),
                    contentWrapElement.querySelector('#groupsbag'),
                    contentWrapElement.querySelector('.g-filters-holder'),
                    contentWrapElement.querySelector('#filtersbag .drop-new-filter')
                ];

                var i;
                var itemsElem = document.querySelectorAll('#dialogbag .vcDraggableCard');

                for (i = 0; i < itemsElem.length; i = i + 1) {
                    items.push(itemsElem[i]);
                }
                ;

                this.dragula = dragula(items,
                    {
                        accepts: function (el, target, source, sibling) {

                            //console.log('el', el, target, source);

                            if (target.classList.contains('vcDraggableCard')) {
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
        var scrollSize = null;

        var DnDWheel = function (event) {
            event.preventDefault();

            var scrolled = DnDScrollElem.scrollTop;

            if (scrollSize === null) {
                scrollSize = scrolled;
            }

            if (event.deltaY > 0) {
                scrollSize = scrollSize + 100;
            } else {
                scrollSize = scrollSize - 100;
            }

            clearTimeout(DnDScrollTimeOutId);

            DnDScrollTimeOutId = setTimeout(function () { // timeout needed for smoother scroll
                DnDScrollElem.scroll({
                    top: Math.max(0, scrollSize)
                });
                scrollSize = null;
            }, 30);

        };
        // < scroll while dragging >

        var selectedDnD = {

            init: function () {
                this.selectedDragulaInit();
                this.eventListeners();
            },

            eventListeners: function () {

                var drake = this.dragula;
                var containerWithShadow;
                var sourceContainer;

                drake.on('shadow', function (elem, container, source) {

                    if (containerWithShadow) {
                        containerWithShadow.classList.remove('remove-card-space');
                    }

                    if (container === source) {
                        source.classList.remove('dragged-out-card-space');
                    } else {
                        source.classList.add('dragged-out-card-space');

                        container.classList.add('remove-card-space');
                        containerWithShadow = container;
                        sourceContainer = source;
                    }
                });

                drake.on('drag', function () {
                    document.addEventListener('wheel', DnDWheel);
                });

                drake.on('drop', function (elem, target, source, nextSibling) {

                    var attributeChanged = false; // needed to call view constructor data reload
                    var attributeKey = elem.dataset.attributeKey;
                    var attrsVmKey = elem.dataset.vmKey;

                    var changeSelectedGroup = function (draggedTo) {

                        for (var i = 0; i < vm[attrsVmKey].length; i++) {

                            if (vm[attrsVmKey][i].key === attributeKey) {
                                var GCFItems = [];
                                var updateGCFMethod;

                                switch (draggedTo) {
                                    case 'groups':
                                        vm[attrsVmKey][i].groups = true;
                                        GCFItems = groups;
                                        updateGCFMethod = function () {
                                            vm.entityViewerDataService.setGroups(GCFItems);
                                        };
                                        break;
                                    case 'columns':
                                        vm[attrsVmKey][i].groups = false;
                                        vm[attrsVmKey][i].columns = true;
                                        GCFItems = columns;
                                        updateGCFMethod = function () {
                                            vm.entityViewerDataService.setColumns(GCFItems);
                                        };
                                        break;
                                    case 'filters':
                                        vm[attrsVmKey][i].groups = false;
                                        vm[attrsVmKey][i].columns = false;
                                        vm[attrsVmKey][i].filters = true;
                                        GCFItems = filters;
                                        updateGCFMethod = function () {
                                            vm.entityViewerDataService.setFilters(GCFItems);
                                        };
                                        break;
                                }

                                var attrData = JSON.parse(JSON.stringify(vm[attrsVmKey][i]));

                                attributeChanged = true;

                                for (var a = 0; a < GCFItems.length; a++) { // remove same element from selected group
                                    if (GCFItems[a].key === attributeKey) {
                                        GCFItems.splice(a, 1);
                                        break;
                                    }
                                }

                                if (nextSibling) {
                                    var nextSiblingKey = nextSibling.dataset.attributeKey;

                                    for (var a = 0; a < GCFItems.length; a++) {
                                        var GCFElem = GCFItems[a];

                                        if (GCFElem.key === nextSiblingKey) {
                                            GCFItems.splice(a, 0, attrData);
                                            updateGCFMethod();
                                            break;
                                        }
                                    }
                                }

                                break;
                            }

                        }

                    };

                    var changeOrder = function (orderOf) {

                        var CGFElems = [];
                        var GCFHtmlElems = [];
                        var updateGCFMethod;

                        var elemsAfterDragging = [];

                        switch (orderOf) {
                            case 'groups':
                                CGFElems = groups;
                                GCFHtmlElems = source.querySelectorAll('.vcSelectedGroupItem');
                                updateGCFMethod = function () {
                                    vm.entityViewerDataService.setGroups(elemsAfterDragging);
                                    vm.entityViewerEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                };
                                break;
                            case 'columns':
                                CGFElems = columns;
                                GCFHtmlElems = source.querySelectorAll('.vcSelectedColumnItem');
                                updateGCFMethod = function () {
                                    vm.entityViewerDataService.setColumns(elemsAfterDragging);
                                    vm.entityViewerEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                };
                                break;
                            case 'filters':
                                CGFElems = filters;
                                GCFHtmlElems = source.querySelectorAll('.vcSelectedFilterItem');
                                updateGCFMethod = function () {
                                    vm.entityViewerDataService.setFilters(elemsAfterDragging);
                                    vm.entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                                };
                                break;

                        }

                        for (var i = 0; i < GCFHtmlElems.length; i = i + 1) {

                            var GCFElemKey = GCFHtmlElems[i].dataset.attributeKey;

                            for (var x = 0; x < CGFElems.length; x = x + 1) {

                                if (GCFElemKey === CGFElems[x].key) {
                                    elemsAfterDragging.push(CGFElems[x]);
                                    break;
                                }

                            }

                        }

                        var isChanged = false;

                        for (var i = 0; i < elemsAfterDragging.length; i++) {
                            var CGFElem = elemsAfterDragging[i];

                            if (CGFElem.key !== CGFElems[i].key) {
                                isChanged = true;
                                break;
                            }
                        }

                        if (isChanged) {
                            updateGCFMethod();
                            vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                            $scope.$apply();
                        }
                    };

                    if (source.classList.contains('vcSelectedColumns')) {

                        // dragged to filters
                        if (target.classList.contains('vcSelectedFilters')) {
                            changeSelectedGroup('filters');
                            // < dragged to filters >

                            // If column's order changed
                        } else if (target.classList.contains('vcSelectedColumns')) {
                            changeOrder('columns');
                            // < If column's order changed >
                        }
                        // < dragging from columns >

                        // dragging from filters
                    } else if (source.classList.contains('vcSelectedFilters')) {

                        // dragged to columns
                        if (target.classList.contains('vcSelectedColumns')) {
                            changeSelectedGroup('columns');
                            // < dragged to columns >

                            // If filter's order changed
                        } else if (target.classList.contains('vcSelectedFilters')) {
                            changeOrder('filters');
                            // < If filter's order changed >
                        }

                    }
                    // < dragging from filters >

                    if (attributeChanged) { // does not trigger on order change

                        vm.updateAttrs(vm[attrsVmKey]);
                        drake.remove(); // adds delay if called when only attributes order changed in group

                    }

                });

                drake.on('dragend', function () {
                    if (sourceContainer) {
                        sourceContainer.classList.remove('dragged-out-card-space');
                    }

                    if (containerWithShadow) {
                        containerWithShadow.classList.remove('remove-card-space');
                    }
                    document.removeEventListener('wheel', DnDWheel);
                });

            },

            selectedDragulaInit: function () {

                var items = [
                    //document.querySelector('.vcSelectedGroups'),
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

        /*var selectedDnD = {

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

                drake.on('shadow', function (elem, container, source) {

                    var attrKey = elem.dataset.attributeKey;

                    if (container.classList.contains('vcSelectedGroups')) {
                        if (attrsWithoutGroups.indexOf(attrKey) !== -1) {
                            elem.remove();
                        }
                    }

                    if (container.classList.contains('vcSelectedFilters')) {
                        if (attrsWithoutFilters.indexOf(attrKey) !== -1) {
                            elem.remove();
                        }
                    }
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
                                }
                            }
                        // < dragged to columns >

                        // dragged to filters
                        } else if (target.classList.contains('vcSelectedFilters')) {

                            if (attrsWithoutFilters.indexOf(attributeKey) !== -1) {

                                drake.cancel();

                            } else {

                                for (var i = 0; i < vm[attrsVmKey].length; i++) {
                                    if (vm[attrsVmKey][i].key === attributeKey) {
                                        vm[attrsVmKey][i].groups = false;
                                        vm[attrsVmKey][i].columns = false;
                                        vm[attrsVmKey][i].filters = true;
                                        attributeChanged = true;
                                        break;
                                    }
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

                            if (attrsWithoutGroups.indexOf(attributeKey) !== -1) {

                                drake.cancel();

                            } else {
                                for (var i = 0; i < vm[attrsVmKey].length; i++) {
                                    if (vm[attrsVmKey][i].key === attributeKey) {
                                        vm[attrsVmKey][i].groups = true;
                                        attributeChanged = true;
                                        break;
                                    }
                                }
                            }
                        // < dragged to groups >

                        // dragged to filters
                        } else if (target.classList.contains('vcSelectedFilters')) {

                            if (attrsWithoutFilters.indexOf(attributeKey) !== -1) {
                                drake.cancel();
                            } else {
                                for (var i = 0; i < vm[attrsVmKey].length; i++) {
                                    if (vm[attrsVmKey][i].key === attributeKey) {
                                        vm[attrsVmKey][i].columns = false;
                                        vm[attrsVmKey][i].filters = true;
                                        attributeChanged = true;
                                        break;
                                    }
                                }
                            }
                        // < dragged to filters >

                        // If column's order changed
                        } else if (target.classList.contains('vcSelectedColumns')) {

                            var columnElems = source.querySelectorAll('.vcSelectedColumnItem');

                            var columnsAfterDragging = [];

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

                            if (attrsWithoutGroups.indexOf(attributeKey) !== -1) {

                                drake.cancel();

                            } else {

                                for (var i = 0; i < vm[attrsVmKey].length; i++) {
                                    if (vm[attrsVmKey][i].key === attributeKey) {
                                        vm[attrsVmKey][i].groups = true;
                                        attributeChanged = true;
                                        break;
                                    };
                                };
                            };
                        // < dragged to groups >

                        // dragged to columns
                        } else if (target.classList.contains('vcSelectedColumns')) {

                            for (var i = 0; i < vm[attrsVmKey].length; i++) {
                                if (vm[attrsVmKey][i].key === attributeKey) {
                                    vm[attrsVmKey][i].columns = true;
                                    attributeChanged = true;
                                    break;
                                };
                            };
                        // < dragged to columns >

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

                    };
                    // < dragging from filters >

                    if (attributeChanged) {
                        $(elem).remove();
                        vm.updateAttrs(vm[attrsVmKey]);
                    };

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
        };*/

        var addColumn = function () {
            if (currentColumnsWidth < columns.length) {
                metaService.columnsWidthGroups(true);
            } else {
                metaService.columnsWidthGroups(false);
            }
        };


        vm.selectAttribute = function (selectedGroup, event) {

            var availableAttrs;
            var dialogTitle;

            switch (selectedGroup) {
                case 'column':
                    dialogTitle = 'Choose column to add';
                    availableAttrs = vm.attrsList.filter(function (attr) {
                        return !attr.columns;
                    });
                    break;
                case 'filter':
                    dialogTitle = 'Choose filter to add';
                    availableAttrs = vm.attrsList.filter(function (attr) {
                        if (attrsWithoutFilters.indexOf(attr.key) === -1 || attr.filters) {
                            return true;
                        }
                        return false;
                    });
                    break;
            }

            $mdDialog.show({
                controller: "TableAttributeSelectorDialogController as vm",
                templateUrl: "views/dialogs/table-attribute-selector-dialog-view.html",
                targetEvent: event,
                multiple: true,
                locals: {
                    data: {
                        availableAttrs: availableAttrs,
                        title: dialogTitle
                    }
                }
            }).then(function (res) {

                if (res && res.status === "agree") {

                    for (var i = 0; i < vm.attrsList.length; i++) {

                        if (vm.attrsList[i].key === res.data.key) {

                            if (selectedGroup === 'column') {
                                vm.attrsList[i].columns = true;
                            } else {
                                vm.attrsList[i].filters = true;
                            }
                            vm.updateAttrs(vm.attrsList);
                            break;
                        }

                    }

                }

            });

        };

        vm.initDnd = function () {
            setTimeout(function () {
                DnDScrollElem = document.querySelector('.vc-dnd-scrollable-elem');
                viewConstructorDnD.init();
                selectedDnD.init();
            }, 500);
        };

        vm.cancel = function () {
            $('body').removeClass('drag-dialog');
            viewConstructorDnD.destroy();
            selectedDnD.destroy();

            $mdDialog.hide();
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