/**
 * Created by mevstratov on 20.06.2019.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    var metaService = require('../../services/metaService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'A',
            scope: {
                evDataService: '=',
                evEventService: '=',
                contentWrapElement: '='
            },
            link: function (scope, elem, attrs) {

                scope.entityType = scope.evDataService.getEntityType();

                var entityType = scope.evDataService.getEntityType();
                var isReport = metaService.isReport(entityType);

                var createTableItemFromAnotherItem = function (item) {

                    var itemToCreate = {};

                    if (item.hasOwnProperty('key')) {
                        itemToCreate.key = item.key;
                    }

                    if (item.hasOwnProperty('entity')) {
                        itemToCreate.entity = item.entity;
                    }

                    if (item.hasOwnProperty('id')) {
                        itemToCreate.id = item.id;
                    }

                    itemToCreate.name = item.name;
                    itemToCreate.value_type = item.value_type;

                    return itemToCreate;

                };

                var dragAndDrop = {

                    init: function () {
                        this.dragulaInit();
                        this.eventListeners();
                    },

                    eventListeners: function () {
                        var areaItemsChanged;
                        var drake = this.dragula;

                        this.dragula.on('dragstart', function () {
                            areaItemsChanged = false;
                        });

                        this.dragula.on('over', function (elem, container, source) {
                            areaItemsChanged = false;
                            $(container).addClass('active');
                        });

                        this.dragula.on('out', function (elem, container, source) {
                            $(container).removeClass('active');
                        });

                        this.dragula.on('shadow', function (elem, container) { // used to prevent showing shadow of card in deletion area
                            if ($(container).attr('id') === 'gc-delete-area') {
                                elem.remove();
                            }
                        });

                        this.dragula.on('drop', function (elem, target, source, nextSibling) {

                            $(target).removeClass('active');

                            var columnsHolder = scope.contentWrapElement.querySelector('.g-columns-holder');
                            var columnsBag = scope.contentWrapElement.querySelector('#columnsbag');
                            var groupsHolder = scope.contentWrapElement.querySelector('.g-groups-holder');
                            var groupsBag = scope.contentWrapElement.querySelector('#groupsbag');
                            var deleteArea = scope.contentWrapElement.querySelector('#gc-delete-area');
                            var groups = scope.evDataService.getGroups();
                            var columns = scope.evDataService.getColumns();

                            // Methods for column's cards dragging
                            if (source === columnsHolder) {

                                // If column's card dragged to grouping area
                                if (target === groupsBag) {

                                    var groupExist = false;
                                    var identifier = elem.dataset.columnKey;

                                    for (var i = 0; i < groups.length; i = i + 1) {
                                        if (groups[i].key === identifier) {
                                            groupExist = true;
                                            break;
                                        }
                                    }

                                    if (!groupExist) {

                                        var activeColumn;
                                        for (var i = 0; i < columns.length; i++) {

                                            if (columns[i].key === identifier) {
                                                activeColumn = columns[i];
                                            }
                                        }

                                        var groupToAdd = createTableItemFromAnotherItem(activeColumn);

                                        groups.push(groupToAdd);

                                        drake.cancel();

                                        areaItemsChanged = true;
                                        scope.evDataService.setGroups(groups);

                                        scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                    } else {

                                        drake.cancel();

                                        var errorMessage = 'There is already such group in Grouping Area';

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

                                // < If column's card dragged to grouping area >

                                // If column's cards order changed
                                } else if (target === columnsHolder) {

                                    var columnElems = source.querySelectorAll('.g-cell.g-column');

                                    var columnsAfterDragging = [];

                                    for (var i = 0; i < columnElems.length; i = i + 1) {

                                        for (var x = 0; x < columns.length; x = x + 1) {

                                            if (columnElems[i].dataset.columnKey === columns[x].key) {
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

                                        areaItemsChanged = true;
                                        scope.evDataService.setColumns(columnsAfterDragging);

                                        scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                    }

                                // < If column's cards order changed >

                                // If column needs to be deleted
                                } else if (target === deleteArea) {

                                    var identifier = elem.dataset.columnKey;
                                    for (var c = 0; 0 < columns.length; c++) {

                                        if (columns[c].key === identifier) {
                                            columns.splice(c, 1);
                                            break;
                                        };

                                    };

                                    drake.remove();

                                    areaItemsChanged = true;
                                    scope.evDataService.setColumns(columns);

                                    scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                    // < If column needs to be deleted >
                                } else {
                                    drake.cancel();
                                }
                            // < Methods for column's cards dragging >

                            // Methods for group's cards dragging
                            } else {

                                // If group's card dragged to column area
                                if (target === columnsHolder || target === columnsBag) {

                                    var identifier = elem.dataset.groupKey;

                                    if (isReport) {

                                        var columnToAdd;
                                        var columnOfDragedGroupIndex;

                                        for (var i = 0; i < columns.length; i = i + 1) {
                                            if (columns[i].key === identifier) {
                                                columnToAdd = columns[i];
                                                columnOfDragedGroupIndex = i;
                                                break;
                                            }
                                        }

                                        if (target === columnsBag) {

                                            columns.push(columnToAdd);
                                            columns.splice(columnOfDragedGroupIndex, 1);

                                        } else {

                                            if (nextSibling.dataset.columnKey !== columnToAdd.key) { // if next column is column of dragged group

                                                columns.splice(columnOfDragedGroupIndex, 1);

                                                for (var i = 0; i < columns.length; i++) {

                                                    if (nextSibling.dataset.columnKey === columns[i].key) {

                                                        /*var indexToAddColumn = i; // we adding group's column before next column
                                                        if (indexToAddColumn < 0) {
                                                            indexToAddColumn = 0;
                                                        };*/

                                                        columns.splice(i, 0, columnToAdd);
                                                        break;
                                                    };

                                                };

                                            };

                                        };

                                    };

                                    for (var i = 0; i < groups.length; i++) {

                                        if (groups[i].key === identifier) {
                                            groups.splice(i, 1);
                                            break;
                                        };

                                    };

                                    drake.remove();

                                    areaItemsChanged = true;

                                    scope.evDataService.setColumns(columns);

                                    if (isReport) {
                                        scope.evDataService.setGroups(groups);

                                        scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                    }

                                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                // < If group's card dragged to column area >

                                // If group's cards order changed
                                } else if (target === groupsHolder) {

                                    var groupElems = source.querySelectorAll('.vcSelectedGroupItem');

                                    var groupsAfterDragging = [];

                                    for (var i = 0; i < groupElems.length; i = i + 1) {

                                        for (var x = 0; x < groups.length; x = x + 1) {

                                            if (groupElems[i].dataset.groupKey === groups[x].key) {
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

                                        areaItemsChanged = true;
                                        scope.evDataService.setGroups(groupsAfterDragging);

                                        scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                    }

                                // < If group's cards order changed >

                                // If group needs to be deleted
                                } else if (target === deleteArea) {

                                    var identifier = elem.dataset.groupKey;
                                    for (var g = 0; 0 < groups.length; g++) {

                                        if (groups[g].key === identifier) {
                                            groups.splice(g, 1);
                                            break;
                                        };

                                    };

                                    drake.remove();

                                    areaItemsChanged = true;
                                    scope.evDataService.setGroups(groups);

                                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                    // < If group needs to be deleted >
                                }

                            // < Methods for group's cards dragging >
                            }

                        });

                        this.dragula.on('dragend', function (element) {

                            if (areaItemsChanged) {
                                scope.$apply();
                            }

                        });
                    },

                    dragulaInit: function () {

                        var items = [
                            scope.contentWrapElement.querySelector('.g-columns-holder'),
                            scope.contentWrapElement.querySelector('#columnsbag'),
                            scope.contentWrapElement.querySelector('.g-groups-holder'),
                            scope.contentWrapElement.querySelector('#groupsbag'),
                            scope.contentWrapElement.querySelector('#gc-delete-area')
                        ];

                        this.dragula = dragula(items, {
                            revertOnSpill: true
                        });

                    }
                };

                setTimeout(function () {
                    dragAndDrop.init();
                }, 500);

            }
        }
    };
}());