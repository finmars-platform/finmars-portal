/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var evLoaderHelper = require('../../helpers/ev-loader.helper');
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    var evDomManager = require('../../services/ev-dom-manager/ev-dom.manager')

    var metaService = require('../../services/metaService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                options: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/groupTable/grouping-view.html',
            link: function (scope, elem, attrs) {

                scope.entityType = scope.evDataService.getEntityType();
                scope.isReport = metaService.isReport(scope.entityType);

                scope.rootGroupOptions = scope.evDataService.getRootGroupOptions();

                scope.grouping = scope.evDataService.getGroups();
                setDefaultGroupType(scope.evDataService);
                scope.components = scope.evDataService.getComponents();

                scope.columns = scope.evDataService.getColumns();

                function setDefaultGroupType(evDataService) {

                    var groups = evDataService.getGroups();

                    groups.forEach(function (group) {

                        if (!group.hasOwnProperty('report_settings')) {
                            group.report_settings = {};
                        }

                        if (!group.report_settings.subtotal_type) {
                            group.report_settings.subtotal_type = 'area';
                        }

                        if (!scope.isReport && !group.hasOwnProperty('ev_folded')) {
                            group.ev_group_folded = true;
                        }

                    });

                    evDataService.setGroups(groups);

                }

                scope.updateGroupTypeIds = function () {

                    var groups = scope.evDataService.getGroups();

                    groups.forEach(function (item) {

                        item.___group_type_id = evDataHelper.getGroupTypeId(item);

                    });

                    scope.evDataService.setGroups(groups);

                };

                if (scope.options) {

                    scope.sorting = scope.options.sorting;
                    scope.folding = scope.options.folding;

                }

                scope.sortHandler = function (group, sort) {

                    createDefaultOptions();

                    group.options.sort = sort;

                    var groups = scope.evDataService.getGroups();

                    groups.forEach(function (item) {

                        if (group.key === item.key || group.id === item.id) {
                            item = group
                        }

                    });

                    scope.evDataService.setGroups(groups);
                    scope.evDataService.setActiveGroupTypeSort(group);

                    scope.evEventService.dispatchEvent(evEvents.GROUP_TYPE_SORT_CHANGE);
                };

                scope.openGroupSettings = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };


                scope.toggleGroupFold = function () {
                    scope.folding = !scope.folding;
                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                };

                scope.reportSetBlankLineType = function (group, type, $index) {

                    if (!group.hasOwnProperty('report_settings') || group.report_settings === undefined) {
                        group.report_settings = {};
                    }

                    if (group.report_settings.blankline_type === type) {
                        group.report_settings.blankline_type = false;
                    } else {
                        group.report_settings.blankline_type = type;
                    }


                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.renameGroup = function (group, $mdMenu, $event) {

                    $mdMenu.close();


                    $mdDialog.show({
                        controller: 'RenameDialogController as vm',
                        templateUrl: 'views/dialogs/rename-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: group
                        }
                    })


                };

                scope.removeGroup = function (group) {

                    if (group.id) {
                        scope.grouping = scope.grouping.filter(function (item) {
                            if (item.id === group.id) {
                                return false;
                            }
                            return true
                        })
                    }

                    if (group.key) {
                        scope.grouping = scope.grouping.filter(function (item) {
                            if (item.key === group.key) {
                                return false;
                            }
                            return true
                        })
                    }

                    scope.evDataService.setGroups(scope.grouping);
                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.reportSetGrandtotalType = function (type) {

                    if (scope.rootGroupOptions.subtotal_type === type) {
                        scope.rootGroupOptions.subtotal_type = false;
                    } else {
                        scope.rootGroupOptions.subtotal_type = type;
                    }

                    scope.evDataService.setRootGroupOptions(scope.rootGroupOptions);

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)
                };

                scope.reportSetSubtotalType = function (group, type) {

                    if (!group.hasOwnProperty('report_settings') || group.report_settings === undefined) {
                        group.report_settings = {};
                    }

                    if (group.report_settings.subtotal_type === type) {
                        group.report_settings.subtotal_type = false;
                    } else {
                        group.report_settings.subtotal_type = type;
                    }


                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                };

                scope.isReportGroupHaveExtSettings = function (group, $index) {

                    return scope.columns[$index].key = group.key

                };

                scope.foldLevel = function (item, $index) {
                    item.report_settings.is_level_folded = true;

                    var groups = scope.evDataService.getGroups();
                    for (; $index < groups.length; $index = $index + 1) {

                        groups[$index].report_settings.is_level_folded = true;

                        var groupsContent = evDataHelper.getGroupsByLevel($index + 1, scope.evDataService);

                        groupsContent.forEach(function (groupItem) {
                            groupItem.___is_open = false;

                            var childrens = evDataHelper.getAllChildrenGroups(groupItem.___id, scope.evDataService);
                            childrens.forEach(function (children) {

                                if (children.___type === 'group') {

                                    item = scope.evDataService.getData(children.___id);

                                    if (item) {
                                        item.___is_open = false;
                                        scope.evDataService.setData(item);
                                    } else {
                                        children.___is_open = false;
                                        scope.evDataService.setData(children);
                                    }


                                }

                            })


                        });

                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.unfoldLevel = function (item, $index) {

                    item.report_settings.is_level_folded = false;

                    var groups = scope.evDataService.getGroups();

                    for (; $index >= 0; $index = $index - 1) {

                        var groupsContent = evDataHelper.getGroupsByLevel($index + 1, scope.evDataService);
                        groups[$index].report_settings.is_level_folded = false;

                        groupsContent.forEach(function (groupItem) {
                            groupItem.___is_open = true;
                            scope.evDataService.setData(groupItem);
                        });

                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                function createDefaultOptions() {

                    var i;
                    for (i = 0; i < scope.grouping.length; i = i + 1) {
                        if (!scope.grouping[i].options) {
                            scope.grouping[i].options = {};
                        }
                    }

                }

                function syncColumnsWithGroups() {

                    var columns = scope.evDataService.getColumns();
                    var groups = scope.evDataService.getGroups();

                    var newColumnList = [];

                    console.log('columns', columns);

                    groups.forEach(function (group, index) {

                        var column = {
                            name: group.name,
                            value_type: group.value_type,
                            entity: group.entity
                        };

                        if (group.hasOwnProperty('key')) {
                            column.key = group.key;
                        }

                        if (group.hasOwnProperty('id')) {
                            column.id = group.id;
                        }

                        newColumnList.push(column);

                    });

                    newColumnList.forEach(function (newColumn) {

                        columns.forEach(function (column) {

                            if (newColumn.hasOwnProperty('key') && newColumn.key === column.key) {
                                newColumn.___column_id = column.___column_id;
                                newColumn.style = column.style;
                            }

                            if (newColumn.hasOwnProperty('id') && newColumn.id === column.id) {
                                newColumn.___column_id = column.___column_id;
                                newColumn.style = column.style;
                            }

                        })

                    });

                    var oldColumns = columns.filter(function (oldColumn) {

                        var exists = false;

                        newColumnList.forEach(function (newColumn) {

                            if (newColumn.___column_id === oldColumn.___column_id) {
                                exists = true;
                            }

                        });

                        return !exists;

                    });

                    var resultColumns = newColumnList.concat(oldColumns);

                    scope.evDataService.setColumns(resultColumns);

                    evDataHelper.updateColumnsIds(scope.evDataService);
                    evDataHelper.setColumnsDefaultWidth(scope.evDataService);

                    scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);

                }

                var dragAndDrop = {

                    init: function () {
                        this.dragula();
                        this.eventListeners();
                    },

                    eventListeners: function () {

                        this.dragula.on('over', function (elem, container, source) {
                            $(container).addClass('active');
                            $(container).on('mouseleave', function () {
                                $(this).removeClass('active');
                            })
                        });
                        this.dragula.on('drop', function (elem, target) {
                            $(target).removeClass('active');
                        });

                        this.dragula.on('dragend', function (element) {

                            var parent = element.parentElement;

                            var elemItems = parent.querySelectorAll('.group-item');

                            var result = [];
                            var groups = scope.evDataService.getGroups();

                            for (var i = 0; i < elemItems.length; i = i + 1) {

                                for (var x = 0; x < groups.length; x = x + 1) {

                                    if (elemItems[i].dataset.groupTypeId === groups[x].___group_type_id) {
                                        result.push(groups[x]);
                                    }

                                }

                            }

                            var isChanged = false;

                            console.log('result', result);
                            console.log('groups', groups);

                            result.forEach(function (resultItem, index) {

                                if (resultItem.___group_type_id !== groups[index].___group_type_id) {
                                    isChanged = true;
                                }


                            });

                            if (isChanged) {

                                scope.evDataService.setGroups(result);

                                // console.log('groups', groups);
                                // console.log('elemItems', elemItems);
                                //
                                // console.log('element', element);

                                scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

                            }

                        })
                    },

                    dragula: function () {

                        var items = [document.querySelector('.g-groups-holder')];

                        this.dragula = dragula(items);
                    }
                };

                setTimeout(function () {
                    dragAndDrop.init();
                }, 500);

                var init = function () {

                    scope.updateGroupTypeIds();

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_START, function () {

                        scope.dataLoader = evLoaderHelper.isDataLoading(scope.evDataService)

                    });


                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        scope.dataLoader = evLoaderHelper.isDataLoading(scope.evDataService);

                        scope.$apply();

                    });

                    scope.evEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

                        scope.updateGroupTypeIds();

                        scope.grouping = scope.evDataService.getGroups();
                        setDefaultGroupType(scope.evDataService);

                        scope.evDataService.resetData();
                        scope.evDataService.resetRequestParameters();

                        var rootGroup = scope.evDataService.getRootGroupData();

                        scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                        if (scope.isReport) {

                            syncColumnsWithGroups();

                        }

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                    });

                    scope.evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                        scope.columns = scope.evDataService.getColumns();

                    })

                };

                init();
            }
        }
    }


}());