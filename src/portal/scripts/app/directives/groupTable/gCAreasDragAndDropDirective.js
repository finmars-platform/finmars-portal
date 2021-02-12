/**
 * Created by mevstratov on 20.06.2019.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    var metaService = require('../../services/metaService');
    var evHelperService = require('../../services/entityViewerHelperService');

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

                var doesColumnHasGrouping = function (colKey) {

                    var groups = scope.evDataService.getGroups();

                    for (var i = 0; i < groups.length; i++) {
                        if (groups[i].key === colKey) {
                            return true;
                        }
                    }

                    return false;

                }

                var dragAndDrop = {

                    init: function () {
                        this.dragulaInit();
                        this.eventListeners();
                    },

                    eventListeners: function () {
                        var areaItemsChanged;
                        var drake = this.dragula;

                        drake.on('dragstart', function () {
                            areaItemsChanged = false;
                        });

                        drake.on('over', function (elem, container, source) {
                            areaItemsChanged = false;
                            $(container).addClass('active');
                        });

                        drake.on('out', function (elem, container, source) {
                            $(container).removeClass('active');
                        });

                        drake.on('shadow', function (elem, container) { // used to prevent showing shadow of card in deletion area
                            if ($(container).attr('id') === 'gc-delete-area') {
                                $(elem).remove(); // removing only shadow of the dragged element
                            }
                        });

                        drake.on('drop', function (elem, target, source, nextSibling) {

                            $(target).removeClass('active');

                            var columnsHolder = scope.contentWrapElement.querySelector('.g-columns-holder');
                            var columnsBag = scope.contentWrapElement.querySelector('#columnsbag');
                            var groupsHolder = scope.contentWrapElement.querySelector('.g-groups-holder');
                            var groupsBag = scope.contentWrapElement.querySelector('#groupsbag');
                            var deleteArea = scope.contentWrapElement.querySelector('#gc-delete-area');
                            var groups = scope.evDataService.getGroups();
                            var columns = scope.evDataService.getColumns();

                            var changeOrder = function (orderOf) {

                                var htmlElems = [];
                                var GCFitems = [];
                                var GCFKeyProp = '';
                                var itemsAfterDragging = [];
                                var updateGCFMethod = null;

                                switch (orderOf) {
                                    case 'groups':
                                        htmlElems = target.querySelectorAll('.g-groups-holder .group-item');
                                        GCFitems = groups;
                                        GCFKeyProp = 'groupKey';
                                        updateGCFMethod = function () {
                                            scope.evDataService.setGroups(itemsAfterDragging);
                                            scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                        };
                                        break;
                                    case 'columns':
                                        htmlElems = target.querySelectorAll('.g-columns-holder .g-cell.g-column');
                                        GCFitems = columns;
                                        GCFKeyProp = 'columnKey';
                                        updateGCFMethod = function () {
                                            scope.evDataService.setColumns(itemsAfterDragging);
                                            scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                        };
                                        break;
                                }

                                for (var i = 0; i < htmlElems.length; i = i + 1) {

                                    for (var x = 0; x < GCFitems.length; x = x + 1) {

                                        if (htmlElems[i].dataset[GCFKeyProp] === GCFitems[x].key) {
                                            itemsAfterDragging.push(GCFitems[x]);
                                            break;
                                        }

                                    }

                                }

                                var isChanged = false;

                                for (var i = 0; i < itemsAfterDragging.length; i++) {
                                    var item = itemsAfterDragging[i];

                                    if (item.key !== GCFitems[i].key) {
                                        isChanged = true;
                                        break;
                                    }
                                }

                                if (isChanged) {
                                    areaItemsChanged = true;
                                    updateGCFMethod();
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                                }
                            };

                            var deleteItem = function (deletionOf) {

                                var GCFitems = [];
                                var identifier = '';
                                var updateGCFMethod = null;
                                var allowColDeletion = true;

                                switch (deletionOf) {
                                    case 'group':
                                        GCFitems = groups;
                                        identifier = elem.dataset['groupKey'];
                                        updateGCFMethod = function () {
                                            scope.evDataService.setGroups(GCFitems);
                                            scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                        };
                                        break;
                                    case 'column':
                                        GCFitems = columns;
                                        identifier = elem.dataset['columnKey'];

                                        if (isReport) { // prevent column deletion, if there is group with same attr
                                            for (var i = 0; i < groups.length; i++) {
                                                if (groups[i].key === identifier) {
                                                    allowColDeletion = false;
                                                    break;
                                                }
                                            }
                                        }

                                        updateGCFMethod = function () {
                                            scope.evDataService.setColumns(GCFitems);
                                            scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                        };
                                        break;
                                }

                                if (allowColDeletion) {

                                    for (var g = 0; 0 < GCFitems.length; g++) {

                                        if (GCFitems[g].key === identifier) {
                                            GCFitems.splice(g, 1);
                                            break;
                                        }

                                    }

                                    drake.remove();

                                    areaItemsChanged = true;
                                    updateGCFMethod();
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                } else {

                                    drake.cancel();

                                    $mdDialog.show({
                                        controller: 'WarningDialogController as vm',
                                        templateUrl: 'views/dialogs/warning-dialog-view.html',
                                        parent: angular.element(document.body),
                                        clickOutsideToClose: false,
                                        multiple: true,
                                        locals: {
                                            warning: {
                                                title: 'Error',
                                                description: "Can't delete column that has grouping.",
                                                actionsButtons: [{
                                                    name: "OK",
                                                    response: false
                                                }]
                                            }
                                        }
                                    });
                                }

                            };

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

                                        var groupToAdd = evHelperService.getTableAttrInFormOf('group', activeColumn);;

                                        groups.push(groupToAdd);

                                        drake.cancel();

                                        areaItemsChanged = true;
                                        scope.evDataService.setGroups(groups);

                                        scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                    } else {

                                        drake.cancel();

                                        $mdDialog.show({
                                            controller: 'WarningDialogController as vm',
                                            templateUrl: 'views/dialogs/warning-dialog-view.html',
                                            parent: angular.element(document.body),
                                            clickOutsideToClose: false,
                                            multiple: true,
                                            locals: {
                                                warning: {
                                                    title: 'Error',
                                                    description: 'There is already such group in Grouping Area',
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

                                    changeOrder("columns");

                                // < If column's cards order changed >

                                // If column needs to be deleted
                                } else if (target === deleteArea) {

                                    deleteItem("column");

                                    // < If column needs to be deleted >
                                } else if (target === groupsHolder || target === columnsBag) {
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
                                                    }

                                                }

                                            }

                                        }

                                    }

                                    for (var i = 0; i < groups.length; i++) {

                                        if (groups[i].key === identifier) {
                                            groups.splice(i, 1);
                                            break;
                                        }

                                    }

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

                                    /*var groupElems = source.querySelectorAll('.g-groups-holder .group-item');

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

                                    }*/
                                    changeOrder("groups");

                                // < If group's cards order changed >

                                // If group needs to be deleted
                                } else if (target === deleteArea) {

                                    /*var identifier = elem.dataset.groupKey;
                                    for (var g = 0; 0 < groups.length; g++) {

                                        if (groups[g].key === identifier) {
                                            groups.splice(g, 1);
                                            break;
                                        }

                                    }

                                    drake.remove();

                                    areaItemsChanged = true;
                                    scope.evDataService.setGroups(groups);

                                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);*/
                                    deleteItem("group");

                                    // < If group needs to be deleted >
                                }

                            // < Methods for group's cards dragging >
                            }

                        });

                        drake.on('dragend', function (element) {

                            if (areaItemsChanged) {
                                scope.$apply();
                            }

                        });
                    },

                    dragulaInit: function () {

                        var colsHolder = scope.contentWrapElement.querySelector('.g-columns-holder');

                        var items = [
                            colsHolder,
                            scope.contentWrapElement.querySelector('#columnsbag'),
                            scope.contentWrapElement.querySelector('.g-groups-holder'),
                            scope.contentWrapElement.querySelector('#groupsbag'),
                            scope.contentWrapElement.querySelector('#gc-delete-area')
                        ];

                        if (isReport) {

                            this.dragula = dragula(items, {
                                moves: function (elem, source, handle, sibling) { // prevents from moving columns that have groupings

                                    var colKey = elem.dataset.columnKey;

                                    if (source === colsHolder && doesColumnHasGrouping(colKey)) {
                                        return false;
                                    }

                                    return true;
                                },

                                accepts: function (elem, target, source, sibling) {

                                    if (sibling) {
                                        var colKey = sibling.dataset.columnKey;

                                        if (doesColumnHasGrouping(colKey)) {
                                            return false;
                                        }
                                    }

                                    return true;

                                },

                                revertOnSpill: true
                            });

                        } else {
                            this.dragula = dragula(items, {
                                revertOnSpill: true
                            });
                        }

                    }
                };

                setTimeout(function () {
                    dragAndDrop.init();
                }, 500);

            }
        }
    };
}());