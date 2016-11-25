/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                columns: '=',
                sorting: '=',
                isItemAddition: '=',
                entityType: '=',
                items: '=',
                externalCallback: '&',
                isAllSelected: '=',
                isReport: '='
            },
            templateUrl: 'views/directives/groupTable/columns-view.html',
            link: function (scope, elem, attrs) {


                logService.component('groupColumnResizer', 'initialized');

                var baseAttrs = [];
                var entityAttrs = [];
                if (metaService.getEntitiesWithoutBaseAttrsList().indexOf(scope.entityType) === -1) {
                    baseAttrs = metaService.getBaseAttrs();
                }
                entityAttrs = metaService.getEntityAttrs(scope.entityType);

                scope.isAllSelected = false;

                scope.selectAllRows = function () {
                    scope.isAllSelected = !scope.isAllSelected;
                    scope.items.forEach(function (item) {
                        if (item.hasOwnProperty('groups')) {
                            item.selectedRow = scope.isAllSelected;
                            item.items.forEach(function (row) {
                                row.selectedRow = scope.isAllSelected;
                            })
                        } else {
                            item.selectedRow = scope.isAllSelected;
                        }
                    })
                };

                scope.sortHandler = function (column, sort) {
                    var i;
                    for (i = 0; i < scope.columns.length; i = i + 1) {
                        if (!scope.columns[i].options) {
                            scope.columns[i].options = {};
                        }
                        scope.columns[i].options.sort = null;
                    }
                    column.options.sort = sort;

                    if (column.hasOwnProperty('id')) {
                        scope.sorting.column.id = column.id;
                        scope.sorting.column.key = null;
                        scope.sorting.column.sort = sort;
                    } else {
                        scope.sorting.column.id = null;
                        scope.sorting.column.key = column.key;
                        scope.sorting.column.sort = sort;
                    }
                    scope.externalCallback();
                };

                scope.selectSubtotalType = function (column, type) {

                    if (!column.hasOwnProperty('report_settings')) {
                        column.report_settings = {};
                    }

                    if (column.report_settings.subtotal_formula_id == type) {
                        column.report_settings.subtotal_formula_id = null;
                    } else {
                        column.report_settings.subtotal_formula_id = type;
                    }
                    scope.externalCallback();
                };

                scope.checkSubtotalFormula = function (column, type) {

                    if (column.hasOwnProperty('report_settings')) {
                        if (column.report_settings.subtotal_formula_id == type) {
                            return true;
                        }

                    }

                    return false

                };

                scope.$watchCollection('columns', function () {
                    setTimeout(function () {

                        if (scope.isReport == true) {
                            scope.externalCallback();
                            scope.$apply();
                        }

                    }, 0)
                });

                scope.isSortable = function (column) {
                    var b, e;
                    if (baseAttrs && baseAttrs.length) {
                        for (b = 0; b < baseAttrs.length; b = b + 1) {
                            if (baseAttrs[b].key === column.key && baseAttrs[b].key !== 'notes') {
                                return true;
                            }
                        }
                    }
                    if (entityAttrs && entityAttrs.length) {
                        for (e = 0; e < entityAttrs.length; e = e + 1) {
                            if (entityAttrs[e].key === column.key) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

                scope.removeColumn = function (column) {
                    if (column.id) {
                        scope.columns = scope.columns.map(function (item) {
                            if (item.id === column.id || item.key === column.key) {
                                item = undefined
                            }
                            return item
                        }).filter(function (item) {
                            return !!item;
                        });
                    }
                    if (column.key) {
                        scope.columns = scope.columns.map(function (item) {
                            if (item.key === column.key) {
                                return undefined
                            }
                            return item
                        }).filter(function (item) {
                            return !!item;
                        });
                    }
                    //console.log('remove', scope.columns);
                };

                scope.reportHideSubtotal = function (column) {

                    if (!column.hasOwnProperty('report_settings')) {
                        column.report_settings = {};
                    }

                    column.report_settings.hide_subtotal = !column.report_settings.hide_subtotal;

                }
            }
        }
    }


}());