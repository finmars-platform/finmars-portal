/**
 * Created by mevstratov on 24.10.2019.
 */
(function () {

    'use strict';

    var evEvents = require('../services/entityViewerEvents');

    var evDataHelper = require('../helpers/ev-data.helper');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                attrsList: '=',
                evDataService: '=',
                evEventService: '=',
                contentWrapElement: '=',
                syncAttrsCallback: '&',
                updateAttrsCallback: '&'
            },
            link: function (scope, elem, attrs) {

                console.log("drag n drop viewConstructorDragAndDrop");

                var columns = scope.evDataService.getColumns();
                var filters = scope.evDataService.getFilters();
                var groups = scope.evDataService.getGroups();

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
                            var i;

                            var identifier;
                            identifier = $(elem).attr('data-key-identifier');

                            columns = scope.evDataService.getColumns();
                            filters = scope.evDataService.getFilters();
                            groups = scope.evDataService.getGroups();

                            exist = false;
                            if (target === scope.contentWrapElement.querySelector('#columnsbag') ||
                                target === scope.contentWrapElement.querySelector('.g-columns-holder')) {
                                for (i = 0; i < columns.length; i = i + 1) {

                                    if (columns[i].key === identifier) {
                                        exist = true;
                                        columnExist = true;
                                    }

                                }
                            }
                            /*if (target === scope.contentWrapElement.querySelector('#groupsbag') ||
                                target === scope.contentWrapElement.querySelector('.g-groups-holder')) {*/
                            if (target === scope.contentWrapElement.querySelector('#groupsbag')) {
                                for (i = 0; i < groups.length; i = i + 1) {
                                    if (groups[i].key === identifier) {
                                        exist = true;
                                        groupExist = true;
                                    }

                                }
                            }

                            if (target === scope.contentWrapElement.querySelector('#filtersbag .drop-new-filter') ||
                                target === scope.contentWrapElement.querySelector('.g-filters-holder')) {
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
                                if (target === scope.contentWrapElement.querySelector('.g-columns-holder') ||
                                    target === scope.contentWrapElement.querySelector('#columnsbag')) {

                                    for (a = 0; a < scope.attrsList.length; a = a + 1) {

                                        if (scope.attrsList[a].key === identifier) {

                                            if (target === scope.contentWrapElement.querySelector('#columnsbag')) {
                                                columns.push(scope.attrsList[a]);
                                            } else {
                                                columns.splice(index, 0, scope.attrsList[a]);
                                            }

                                        }

                                    }

                                    scope.syncAttrsCallback();

                                    evDataHelper.updateColumnsIds(scope.evDataService);
                                    evDataHelper.setColumnsDefaultWidth(scope.evDataService);

                                    scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                                }

                                if (target === scope.contentWrapElement.querySelector('#groupsbag')) {

                                    for (a = 0; a < scope.attrsList.length; a = a + 1) {
                                        if (scope.attrsList[a].key === identifier) {
                                            groups.push(scope.attrsList[a]);
                                        }
                                    }

                                    scope.syncAttrsCallback();

                                    evDataHelper.updateColumnsIds(scope.evDataService);
                                    evDataHelper.setColumnsDefaultWidth(scope.evDataService);

                                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                                }

                                if (target === scope.contentWrapElement.querySelector('#filtersbag .drop-new-filter') ||
                                    target === scope.contentWrapElement.querySelector('.g-filters-holder')) {

                                    for (a = 0; a < scope.attrsList.length; a = a + 1) {

                                        if (scope.attrsList[a].key === identifier) {
                                            if (target === scope.contentWrapElement.querySelector('#filtersbag .drop-new-filter')) {
                                                filters.push(scope.attrsList[a]);
                                            } else {
                                                filters.splice(index, 0, scope.attrsList[a]);
                                            }
                                        }
                                    }

                                    scope.syncAttrsCallback();

                                    evDataHelper.updateColumnsIds(scope.evDataService);
                                    evDataHelper.setColumnsDefaultWidth(scope.evDataService);

                                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                                }

                                scope.$apply();

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

                            scope.$apply();
                        });

                        this.dragula.on('dragend', function (el) {
                            scope.$apply();
                            $(el).remove();
                        });

                    },

                    dragula: function () {

                        var items = [
                            scope.contentWrapElement.querySelector('.g-columns-holder'),
                            scope.contentWrapElement.querySelector('#columnsbag'),
                            // document.querySelector('.g-groups-holder'),
                            scope.contentWrapElement.querySelector('#groupsbag'),
                            scope.contentWrapElement.querySelector('.g-filters-holder'),
                            scope.contentWrapElement.querySelector('#filtersbag .drop-new-filter')
                        ];

                        var i;
                        var itemsElem = document.querySelectorAll('#dialogbag .vcDraggableCard');
                        for (i = 0; i < itemsElem.length; i = i + 1) {
                            items.push(itemsElem[i]);
                        }

                        this.dragula = dragula(items,
                            {
                                accepts: function (el, target, source, sibling) {

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

                        var drake = this.dragula;
                        var containerWithShadow;

                        drake.on('shadow', function (elem, container, source) {

                            if (containerWithShadow) {
                                containerWithShadow.classList.remove('remove-card-space');
                            }

                            if (container === source) {

                                source.classList.remove('dragged-out-card-space');

                            } else {
                                if (!source.classList.contains('dragged-out-card-space')) {
                                    source.classList.add('dragged-out-card-space');
                                }

                                container.classList.add('remove-card-space');
                                containerWithShadow = container;
                            }
                        });

                        drake.on('drag', function () {
                            document.addEventListener('wheel', DnDWheel);
                        });

                        drake.on('drop', function (elem, target, source, nextSibling) {
                            console.log('drag n drop nextSibling', nextSibling);
                            columns = scope.evDataService.getColumns();
                            filters = scope.evDataService.getFilters();
                            groups = scope.evDataService.getGroups();

                            var attributeChanged = false; // needed to call view constructor data reload

                            var attributeKey = elem.dataset.attributeKey;
                            var attrsVmKey = elem.dataset.vmKey;

                            var changeSelectedGroup = function (draggedTo) {

                                for (var i = 0; i < scope.$parent.vm[attrsVmKey].length; i++) {
                                    if (scope.$parent.vm[attrsVmKey][i].key === attributeKey) {
                                        var GCFElems = [];
                                        var updateGCFMethod;

                                        switch (draggedTo) {
                                            case 'groups':
                                                scope.$parent.vm[attrsVmKey][i].groups = true;
                                                GCFElems = groups;
                                                updateGCFMethod = function () {scope.evDataService.setGroups(GCFElems);};
                                                break;
                                            case 'columns':
                                                scope.$parent.vm[attrsVmKey][i].groups = false;
                                                scope.$parent.vm[attrsVmKey][i].columns = true;
                                                GCFElems = columns;
                                                updateGCFMethod = function () {scope.evDataService.setColumns(GCFElems);};
                                                break;
                                            case 'filters':
                                                scope.$parent.vm[attrsVmKey][i].groups = false;
                                                scope.$parent.vm[attrsVmKey][i].columns = false;
                                                scope.$parent.vm[attrsVmKey][i].filters = true;
                                                GCFElems = filters;
                                                updateGCFMethod = function () {scope.evDataService.setFilters(GCFElems);};
                                                break;
                                        }

                                        attributeChanged = true;

                                        if (nextSibling) {
                                            var nextSiblingKey = nextSibling.dataset.attributeKey;
                                            var attrData;

                                            for (var i = 0; i < scope.$parent.vm[attrsVmKey].length; i++) {
                                                var draggedElemAttrData = scope.$parent.vm[attrsVmKey][i];

                                                if (attributeKey === draggedElemAttrData.key) {
                                                    attrData = JSON.parse(JSON.stringify(scope.$parent.vm[attrsVmKey][i]));
                                                    break;
                                                }
                                            }

                                            for (var i = 0; i < GCFElems.length; i++) {
                                                var GCFElem = GCFElems[i];

                                                if (GCFElem.key === nextSiblingKey) {
                                                    GCFElems.splice(i, 0, attrData);
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
                                            console.log("drag n drop updateGCFMethod groups", elemsAfterDragging);
                                            scope.evDataService.setGroups(elemsAfterDragging);
                                            scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                        };
                                        break;
                                    case 'columns':
                                        CGFElems = columns;
                                        GCFHtmlElems = source.querySelectorAll('.vcSelectedColumnItem');
                                        updateGCFMethod = function () {
                                            console.log("drag n drop updateGCFMethod cols", elemsAfterDragging);
                                            scope.evDataService.setColumns(elemsAfterDragging);
                                            scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                        };
                                        break;
                                    case 'filters':
                                        CGFElems = filters;
                                        GCFHtmlElems = source.querySelectorAll('.vcSelectedFilterItem');
                                        updateGCFMethod = function () {
                                            console.log("drag n drop updateGCFMethod filters", elemsAfterDragging);
                                            scope.evDataService.setFilters(elemsAfterDragging);
                                            scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                                        };
                                        break;
                                }
                                console.log("drag n drop changeOrder CGFElems", CGFElems);
                                console.log("drag n drop changeOrder GCFHtmlElems", GCFHtmlElems);
                                if (orderOf === 'columns') {

                                    for (var i = 0; i < GCFHtmlElems.length; i = i + 1) {

                                        var GCFElemKey = GCFHtmlElems[i].dataset.attributeKey;

                                        for (var x = 0; x < groups.length; x = x + 1) {

                                            if (GCFElemKey === groups[x].key) {
                                                elemsAfterDragging.push(groups[x]);
                                                break;
                                            }

                                        }

                                    }

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
                                console.log("drag n drop changeOrder elemsAfterDragging", elemsAfterDragging);
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
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                                    scope.$apply();
                                }
                            };

                            // dragging from groups
                            if (source.classList.contains('vcSelectedGroups')) {

                                // dragged to columns
                                if (target.classList.contains('vcSelectedColumns')) {

                                    changeSelectedGroup('columns');
                                // < dragged to columns >

                                // dragged to filters
                                } else if (target.classList.contains('vcSelectedFilters')) {

                                    changeSelectedGroup('filters');
                                    /*for (var i = 0; i < scope.$parent.vm[attrsVmKey].length; i++) {

                                        if (scope.$parent.vm[attrsVmKey][i].key === attributeKey) {
                                            scope.$parent.vm[attrsVmKey][i].groups = false;
                                            scope.$parent.vm[attrsVmKey][i].columns = false;
                                            scope.$parent.vm[attrsVmKey][i].filters = true;
                                            attributeChanged = true;

                                            if (nextSibling) {
                                                var nextSiblingKey = nextSibling.dataset.attributeKey;

                                                for (var i = 0; i < filters.length; i++) {


                                                    if (scope.$parent.vm[attrsVmKey][i].key === nextSiblingKey) {

                                                        var attrForFilter = JSON.parse(JSON.stringify(scope.$parent.vm[attrsVmKey][i]));
                                                        filters.splice(i, 0, attrForFilter);
                                                        scope.evDataService.setFilters(filters);

                                                    }

                                                }
                                            }

                                            break;
                                        }
                                    }*/

                                // < dragged to filters >

                                // If group's order changed
                                } else if (target.classList.contains('vcSelectedGroups')) {

                                    changeOrder('groups');
                                    /*var groupElems = source.querySelectorAll('.vcSelectedGroupItem');

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
                                        scope.evDataService.setGroups(groupsAfterDragging);

                                        scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                        scope.$apply();
                                    }*/

                                    // < If group's order changed >
                                }

                                // < dragging from groups >

                            // dragging from columns
                            } else if (source.classList.contains('vcSelectedColumns')) {

                                // dragged to groups
                                if (target.classList.contains('vcSelectedGroups')) {

                                    changeSelectedGroup('groups');
                                    /*for (var i = 0; i < scope.$parent.vm[attrsVmKey].length; i++) {
                                        if (scope.$parent.vm[attrsVmKey][i].key === attributeKey) {
                                            scope.$parent.vm[attrsVmKey][i].groups = true;
                                            attributeChanged = true;

                                            if (nextSibling) {
                                                var nextSiblingKey = nextSibling.dataset.attributeKey;

                                                for (var i = 0; i < columns.length; i++) {

                                                    if (scope.$parent.vm[attrsVmKey][i].key === nextSiblingKey) {

                                                        var attrForCol = JSON.parse(JSON.stringify(scope.$parent.vm[attrsVmKey][i]));
                                                        columns.splice(i, 0, attrForCol);
                                                        scope.evDataService.setColumns(columns);

                                                    }

                                                }
                                            }

                                            break;
                                        }
                                    }*/
                                // < dragged to groups >

                                // dragged to filters
                                } else if (target.classList.contains('vcSelectedFilters')) {

                                    changeSelectedGroup('filters');
                                    /*for (var i = 0; i < scope.$parent.vm[attrsVmKey].length; i++) {
                                        if (scope.$parent.vm[attrsVmKey][i].key === attributeKey) {
                                            scope.$parent.vm[attrsVmKey][i].columns = false;
                                            scope.$parent.vm[attrsVmKey][i].filters = true;
                                            attributeChanged = true;
                                            break;
                                        }
                                    }*/
                                // < dragged to filters >

                                // If column's order changed
                                } else if (target.classList.contains('vcSelectedColumns')) {

                                    changeOrder('columns');
                                    /*var columnElems = source.querySelectorAll('.vcSelectedColumnItem');

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

                                        scope.evDataService.setColumns(columnsAfterDragging);

                                        scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                        scope.$apply();

                                    }*/

                                // < If column's order changed >
                                }
                            // < dragging from columns >

                            // dragging from filters
                            } else if (source.classList.contains('vcSelectedFilters')) {

                                // dragged to groups
                                if (target.classList.contains('vcSelectedGroups')) {

                                    changeSelectedGroup('groups');

                                    /*for (var i = 0; i < scope.$parent.vm[attrsVmKey].length; i++) {
                                        if (scope.$parent.vm[attrsVmKey][i].key === attributeKey) {
                                            scope.$parent.vm[attrsVmKey][i].groups = true;
                                            attributeChanged = true;
                                            break;
                                        }
                                    }*/
                                // < dragged to groups >

                                // dragged to columns
                                } else if (target.classList.contains('vcSelectedColumns')) {

                                    changeSelectedGroup('columns');
                                    /*for (var i = 0; i < scope.$parent.vm[attrsVmKey].length; i++) {
                                        if (scope.$parent.vm[attrsVmKey][i].key === attributeKey) {
                                            scope.$parent.vm[attrsVmKey][i].columns = true;
                                            attributeChanged = true;
                                            break;
                                        }
                                    }*/
                                // < dragged to columns >

                                // If filter's order changed
                                } else if (target.classList.contains('vcSelectedFilters')) {

                                    changeOrder('filters');
                                    /*var filterElems = source.querySelectorAll('.vcSelectedFilterItem');

                                    var filtersAfterDragging = [];

                                    for (var i = 0; i < filterElems.length; i = i + 1) {

                                        var filterElemKey = filterElems[i].dataset.attributeKey;

                                        for (var x = 0; x < filters.length; x = x + 1) {

                                            if (filterElemKey === filters[x].key) {
                                                filtersAfterDragging.push(filters[x]);
                                                break
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

                                        scope.evDataService.setFilters(filtersAfterDragging);

                                        scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                        scope.$apply();

                                    }*/

                                // < If filter's order changed >
                                }

                            }
                            // < dragging from filters >

                            if (attributeChanged) {
                                $(elem).remove();
                                scope.updateAttrsCallback({attrs: scope.$parent.vm[attrsVmKey]});
                            }

                            source.classList.remove('dragged-out-card-space');
                            if (containerWithShadow) {
                                containerWithShadow.classList.remove('remove-card-space');
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

                var init = function () {
                    setTimeout(function () {
                        DnDScrollElem = document.querySelector('.vc-dnd-scrollable-elem');
                        viewConstructorDnD.init();
                        selectedDnD.init();
                    });
                };

                init();

                scope.$on('$destroy', function () {
                    viewConstructorDnD.destroy();
                    selectedDnD.destroy();
                });

            }
        }
    }

}());