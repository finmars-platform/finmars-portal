/**
 * Created by mevstratov on 24.10.2019.
 */
(function () {

    'use strict';

    var evEvents = require('../services/entityViewerEvents');

    var evDataHelper = require('../helpers/ev-data.helper');

    module.exports = function ($mdDialog) {
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
                var scrollSize = null;

                var DnDWheel = function (event) {
                    event.preventDefault();

                    var scrolled = DnDScrollElem.scrollTop;

                    if (scrollSize === null) {
                        scrollSize = scrolled
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

                            sourceContainer = source;

                            elem.classList.add('vc-shadow-elem');

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
                                sourceContainer = source;
                            }
                        });

                        drake.on('drag', function () {
                            document.addEventListener('wheel', DnDWheel);
                        });

                        drake.on('drop', function (elem, target, source, nextSibling) {

                            columns = scope.evDataService.getColumns();
                            filters = scope.evDataService.getFilters();
                            groups = scope.evDataService.getGroups();

                            var attributeChanged = false; // needed to call view constructor data reload

                            var attributeKey = elem.dataset.attributeKey;
                            var attrsVmKey = elem.dataset.vmKey;

                            var changeSelectedGroup = function (draggedTo) {

                                for (var i = 0; i < scope.$parent.vm[attrsVmKey].length; i++) {

                                    if (scope.$parent.vm[attrsVmKey][i].key === attributeKey) {
                                        var GCFItems = [];
                                        var updateGCFMethod;

                                        switch (draggedTo) {
                                            case 'groups':
                                                scope.$parent.vm[attrsVmKey][i].groups = true;
                                                GCFItems = groups;
                                                updateGCFMethod = function () {scope.evDataService.setGroups(GCFItems);};
                                                break;
                                            case 'columns':
                                                scope.$parent.vm[attrsVmKey][i].groups = false;
                                                scope.$parent.vm[attrsVmKey][i].columns = true;
                                                GCFItems = columns;
                                                updateGCFMethod = function () {scope.evDataService.setColumns(GCFItems);};
                                                break;
                                            case 'filters':
                                                scope.$parent.vm[attrsVmKey][i].groups = false;
                                                scope.$parent.vm[attrsVmKey][i].columns = false;
                                                scope.$parent.vm[attrsVmKey][i].filters = true;
                                                GCFItems = filters;
                                                updateGCFMethod = function () {scope.evDataService.setFilters(GCFItems);};
                                                break;
                                        }

                                        var attrData = JSON.parse(JSON.stringify(scope.$parent.vm[attrsVmKey][i]));

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
                                            scope.evDataService.setGroups(elemsAfterDragging);
                                            scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                        };
                                        break;
                                    case 'columns':
                                        CGFElems = columns;
                                        GCFHtmlElems = source.querySelectorAll('.vcSelectedColumnItem');
                                        updateGCFMethod = function () {
                                            scope.evDataService.setColumns(elemsAfterDragging);
                                            scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                        };
                                        break;
                                    case 'filters':
                                        CGFElems = filters;
                                        GCFHtmlElems = source.querySelectorAll('.vcSelectedFilterItem');
                                        updateGCFMethod = function () {
                                            scope.evDataService.setFilters(elemsAfterDragging);
                                            scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                                        };
                                        break;
                                }

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
                                // < dragged to filters >

                                // If group's order changed
                                } else if (target.classList.contains('vcSelectedGroups')) {
                                    changeOrder('groups');
                                // < If group's order changed >
                                }

                                // < dragging from groups >

                            // dragging from columns
                            } else if (source.classList.contains('vcSelectedColumns')) {

                                // dragged to groups
                                if (target.classList.contains('vcSelectedGroups')) {
                                    changeSelectedGroup('groups');
                                // < dragged to groups >

                                // dragged to filters
                                } else if (target.classList.contains('vcSelectedFilters')) {
                                    changeSelectedGroup('filters');
                                // < dragged to filters >

                                // If column's order changed
                                } else if (target.classList.contains('vcSelectedColumns')) {
                                    var hasMatchingGroup = false;

                                    for (var i = 0; i < groups.length; i++) {
                                        if (groups[i].key === attributeKey) {
                                            hasMatchingGroup = true;
                                            break;
                                        }
                                    }

                                    if (!hasMatchingGroup) {
                                        changeOrder('columns');
                                    } else {
                                        drake.cancel();

                                        $mdDialog.show({
                                            controller: 'WarningDialogController as vm',
                                            templateUrl: 'views/warning-dialog-view.html',
                                            parent: angular.element(document.body),
                                            clickOutsideToClose: false,
                                            multiple: true,
                                            locals: {
                                                warning: {
                                                    title: 'Error',
                                                    description: "You can't change column's order if it has group.",
                                                    actionsButtons: [{
                                                        name: "OK",
                                                        response: false
                                                    }]
                                                }
                                            }
                                        });
                                    }
                                // < If column's order changed >
                                }
                            // < dragging from columns >

                            // dragging from filters
                            } else if (source.classList.contains('vcSelectedFilters')) {

                                // dragged to groups
                                if (target.classList.contains('vcSelectedGroups')) {
                                    changeSelectedGroup('groups');
                                // < dragged to groups >

                                // dragged to columns
                                } else if (target.classList.contains('vcSelectedColumns')) {
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
                                scope.updateAttrsCallback({attrs: scope.$parent.vm[attrsVmKey]});
                                drake.remove(); // adds delay if called on attributes order change in selected group
                            }

                            elem.classList.remove('vc-shadow-elem');

                        });

                        drake.on('dragend', function (elem) {

                            document.removeEventListener('wheel', DnDWheel);
                            if (sourceContainer) {
                                sourceContainer.classList.remove('dragged-out-card-space');
                            }

                            if (containerWithShadow) {
                                containerWithShadow.classList.remove('remove-card-space');
                            }

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