/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                entityType: '=',
                filters: '=',
                columns: '=',
                tabs: '=',
                sorting: '=',
                isReport: '=',
                folding: '=',
                grouping: '=',
                externalCallback: '&'
            },
            templateUrl: 'views/directives/groupTable/grouping-view.html',
            link: function (scope, elem, attrs) {

                logService.component('groupGrouping', 'initialized');
                console.log(' scope.grouping', scope.grouping);

                scope.sortHandler = function (group, sort) {
                    var i;
                    for (i = 0; i < scope.grouping.length; i = i + 1) {
                        if (!scope.grouping[i].options) {
                            scope.grouping[i].options = {};
                        }
                        scope.grouping[i].options.sort = null;
                    }
                    group.options.sort = sort;
                    if (group.hasOwnProperty('id')) {
                        scope.sorting.group = {};
                        scope.sorting.group.id = group.id;
                        scope.sorting.group.key = null;
                        scope.sorting.group.sort = sort;
                    } else {
                        scope.sorting.group = {};
                        scope.sorting.group.id = null;
                        scope.sorting.group.key = group.key;
                        scope.sorting.group.sort = sort;
                    }
                    scope.externalCallback();
                };

                scope.openGroupSettings = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                scope.$watchCollection('grouping', function () {


                    if (scope.isReport == true) {
                        scope.grouping.forEach(function (group) {

                            if (!group.hasOwnProperty('report_settings') && !group.report_settings) {
                                group.report_settings = {subtotal_type: 'area'};
                            } else {
                                if (group.report_settings.subtotal_type == undefined) {
                                    group.report_settings.subtotal_type = 'area';
                                }

                            }

                        })
                    }

                    setTimeout(function () {
                        scope.externalCallback();
                        scope.$apply();
                    }, 0)
                });

                scope.toggleGroupFold = function () {
                    scope.folding = !scope.folding;
                    setTimeout(function () {
                        scope.externalCallback();
                        scope.$apply();
                    }, 0)
                };

                scope.removeGroup = function (group) {
                    //console.log('grouping', scope.grouping);
                    //console.log('remove', group);
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
                    //console.log('grouping after', scope.grouping);
                    setTimeout(function () {
                        scope.externalCallback();
                    }, 0)
                };

                scope.reportSetSubtotalType = function (group, type, $index) {

                    if (!group.hasOwnProperty('report_settings') || group.report_settings == undefined) {
                        group.report_settings = {};
                    }

                    if (type == 'area') {

                        scope.grouping.forEach(function (groupItem, $itemIndex) {

                            if ($itemIndex > $index) {
                                groupItem.disableLineSubtotal = true;

                                console.log('group', groupItem);

                                if (groupItem.hasOwnProperty('report_settings')) {

                                    if (groupItem.report_settings.subtotal_type == 'line') {
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


                    scope.externalCallback();
                };

                scope.isReportGroupHaveExtSettings = function (group, $index, subtotalType) {

                    var haveAccess = false;
                    var preInitOffset = 0;
                    var initIndex = 0;

                    scope.grouping.forEach(function (groupItem, $groupItemIndex) {

                        if (scope.columns.length > $groupItemIndex) {
                            if (groupItem.hasOwnProperty('id')) {
                                if (groupItem.id == scope.columns[$groupItemIndex - preInitOffset].id) {
                                    initIndex = preInitOffset;
                                } else {
                                    preInitOffset = preInitOffset + 1;
                                }
                            } else {
                                if (groupItem.hasOwnProperty('key') && scope.columns[$groupItemIndex] && scope.columns[$groupItemIndex].hasOwnProperty('key')) {

                                    if (groupItem.key == scope.columns[$groupItemIndex - preInitOffset].key) {
                                        initIndex = preInitOffset;
                                    } else {
                                        preInitOffset = preInitOffset + 1;
                                    }
                                } else {
                                    preInitOffset = preInitOffset + 1;
                                }
                            }
                        }

                    });

                    if (scope.columns.length > $index) {
                        if (group.hasOwnProperty('id') && scope.columns[$index - initIndex] && scope.columns[$index - initIndex].hasOwnProperty('id')) {
                            if (group.id == scope.columns[$index - initIndex].id) {
                                haveAccess = true;
                            }
                        } else {
                            if (group.hasOwnProperty('key') && scope.columns[$index - initIndex] && scope.columns[$index - initIndex].hasOwnProperty('key')) {
                                if (group.key == scope.columns[$index - initIndex].key) {
                                    haveAccess = true;
                                }
                            }

                        }
                    }

                    if (group.hasOwnProperty('disableLineSubtotal') && group.disableLineSubtotal == true && subtotalType == 'line') {
                        haveAccess = false;
                    }

                    return haveAccess;

                };

                scope.openModalSettings = function (ev) {
                    $mdDialog.show({
                        controller: 'gModalController as vm', // ../directives/gTable/gModalComponents
                        templateUrl: 'views/directives/groupTable/modal-view.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: {
                            callback: scope.externalCallback,
                            parentScope: scope
                        }
                    });
                }
            }
        }
    }


}());