/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var evLoaderHelper = require('../../helpers/ev-loader.helper');

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

                scope.entityType = scope.evDataService.getEntityType();
                scope.isReport = ['balance-report',
                    'cash-flow-projection-report',
                    'performance-report', 'pnl-report',
                    'transaction-report'].indexOf(scope.entityType) !== -1;

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

                scope.removeGroup = function (group) {

                    if (group.id) {
                        scope.grouping = scope.grouping.map(function (item) {
                            if (item.id === group.id) {
                                item = undefined
                            }
                            return item
                        }).filter(function (item) {
                            return !!item;
                        });
                    }
                    if (group.name) {
                        scope.grouping = scope.grouping.map(function (item) {
                            if (item.name === group.name) {
                                item = undefined
                            }
                            return item
                        }).filter(function (item) {
                            return !!item;
                        });
                    }


                    scope.evDataService.setGroups(scope.grouping);
                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.reportSetSubtotalType = function (group, type, $index) {

                    if (!group.hasOwnProperty('report_settings') || group.report_settings == undefined) {
                        group.report_settings = {};
                    }

                    if (type == 'area') {

                        scope.grouping.forEach(function (groupItem, $itemIndex) {

                            if ($itemIndex > $index) {
                                groupItem.disableLineSubtotal = true;

                                //console.log('group', groupItem);

                                if (groupItem.hasOwnProperty('report_settings')) {

                                    if (groupItem.report_settings.subtotal_type === 'line') {
                                        groupItem.report_settings.subtotal_type = false;
                                    }
                                }
                            } else {
                                if ($itemIndex < $index) {
                                    groupItem.disableLineSubtotal = false;
                                }
                            }


                        });
                    }

                    if (type == 'line') {

                        scope.grouping.forEach(function (groupItem, $itemIndex) {

                            if ($itemIndex > $index) {
                                groupItem.disableLineSubtotal = false;
                            }

                        });
                    }

                    if (group.report_settings.subtotal_type == type) {
                        group.report_settings.subtotal_type = false;
                    } else {
                        group.report_settings.subtotal_type = type;
                    }


                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                };

                scope.isReportGroupHaveExtSettings = function (group, $index) {

                    return scope.columns[$index].key = group.key

                };

                scope.toggleFold = function (group) {

                    createDefaultOptions();

                    group.options.fold = !group.options.fold;

                    var groups = scope.evDataService.getGroups();

                    groups.forEach(function (item) {

                        if (group.key === item.key || group.id === item.id) {
                            item = group
                        }

                    });

                    scope.evDataService.setGroups(groups);

                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

                    if (group.options.fold) {
                        scope.evEventService.dispatchEvent(evEvents.GROUPS_LEVEL_FOLD);
                    } else {
                        scope.evEventService.dispatchEvent(evEvents.GROUPS_LEVEL_UNFOLD);
                    }

                };

                scope.openModalSettings = function (ev) {

                    if (scope.isReport) {

                        var controllerName = '';
                        var templateUrl = '';

                        switch (scope.entityType) {
                            case 'balance-report':
                                controllerName = 'gModalReportController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-view.html';
                                break;
                            case 'pnl-report':
                                controllerName = 'gModalReportPnlController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-view.html';
                                break;
                            case 'performance-report':
                                controllerName = 'gModalReportPerformanceController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-performance-view.html';
                                break;
                            case 'cash-flow-projection-report':
                                controllerName = 'gModalReportCashFlowProjectionController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-cash-flow-projection-view.html';
                                break;
                            case 'transaction-report':
                                controllerName = 'gModalReportTransactionController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-transaction-view.html';
                                break;
                        }

                        $mdDialog.show({
                            controller: controllerName,
                            templateUrl: templateUrl,
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            locals: {
                                entityViewerDataService: scope.evDataService,
                                entityViewerEventService: scope.evEventService
                            }
                        });


                    } else {
                        $mdDialog.show({
                            controller: 'gModalController as vm', // ../directives/gTable/gModalComponents
                            templateUrl: 'views/directives/groupTable/modal-view.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            locals: {
                                entityViewerDataService: scope.evDataService,
                                entityViewerEventService: scope.evEventService
                            }
                        });
                    }
                };

                function createDefaultOptions() {

                    var i;
                    for (i = 0; i < scope.grouping.length; i = i + 1) {
                        if (!scope.grouping[i].options) {
                            scope.grouping[i].options = {};
                        }
                    }

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

                                console.log('groups', groups);
                                console.log('elemItems', elemItems);

                                console.log('element', element);

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
                        setDefaultGroupType();

                        scope.evDataService.resetData();
                        scope.evDataService.resetRequestParameters();

                        var rootGroup = scope.evDataService.getRootGroupData();

                        scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

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