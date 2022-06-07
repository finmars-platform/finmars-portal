/**
 * Created by szhitenev on 17.06.2016.
 */
(function () {

    'use strict';

    var referenceTableService = require('../services/referenceTablesService');
    var metaHelper = require('../helpers/meta.helper');

    module.exports = function () {

        return {
            require: '^^bindFieldControl',
            scope: {
                item: '=',
                model: '=',
                options: '=',
                eventSignal: '=',
                itemChange: '&'
            },
            templateUrl: 'views/directives/entity-viewer-selector-resolver-view.html',
            link: function (scope, elem, attrs, bfcVm) {

                // scope.readyStatus = {content: false};
                scope.readyStatus = bfcVm.readyStatus;
                scope.readyStatus.content = false;

                scope.modelObj = {
                    model: scope.model
                };

                scope.inputTextObj = {
                    value: null
                };

                // scope.searchTerm = '';
                scope.sorted = true;
                scope.fields = [];

                /*scope.resolveSort = function (field) {

                    if (scope.item && scope.item.value_type === 110) {

                        return 'order'

                    } else if (field) {

                        if (field.hasOwnProperty('public_name')) {

                            return '-' + field.public_name

                        } else if (field.hasOwnProperty('user_code')) {

                            return '-' + field.user_code

                        } else if (field.hasOwnProperty('name')) {

                            return '-' + field.name

                        }

                    }

                };*/
                var sortFields = function (fields) {

                    if (scope.item && scope.item.value_type === 110) {

                        return metaHelper.textWithDashSort(fields, 'order');

                    } else {
                        return metaHelper.textWithDashSort(fields);
                    }

                };

                scope.inputBackgroundColor = bfcVm.inputBackgroundColor;

                var getSelectedFieldName = function () {

                    // var id = scope.entity[scope.fieldKey];
                    var id = scope.modelObj.model;

                    if (scope.fields && scope.fields.length) {

                        for (var i = 0; i < scope.fields.length; i = i + 1) {

                            if (scope.fields[i].id === id) {
                                return scope.fields[i].name
                            }

                        }

                    }

                    return '';
                };

                scope.getName = function () {

                    if (scope.item.hasOwnProperty('verbose_name')) {
                        return scope.item.verbose_name
                    }

                    if (scope.item.options && scope.item.options.fieldName) {
                        return scope.item.options.fieldName;
                    }
                    return scope.item.name
                };

                scope.getData = function () {

                    scope.readyStatus.content = false;
                    console.log('scope,', scope);
                    return new Promise(function (resolve, reject) {

                        referenceTableService.getList({
                            filters: {
                                name: scope.item.reference_table
                            }
                        }).then(function (res) {

                            var referenceTable;

                            res.results.forEach(function (item) {

                                if (item.name === scope.item.reference_table) {
                                    referenceTable = item
                                }

                            });

                            if (referenceTable) {

                                console.log('res', res);

                                // scope.fields = referenceTable.rows;
                                scope.fields = referenceTable.rows.filter(function (row) {
                                    return !!row;

                                }).map(function (row) {
                                    return {
                                        id: row.value,
                                        name: row.key
                                    }
                                });

                                scope.fields = sortFields(scope.fields);

                            }

                            scope.readyStatus.content = true;

                            resolve();
                            // scope.readyStatus.content = true;

                            /*scope.$apply(function () {

                                setTimeout(function () {
                                    $(elem).find('.md-select-search-pattern').on('keydown', function (ev) {
                                        ev.stopPropagation();
                                    });
                                }, 100);
                            });*/
                        }).catch(function (error) {
                            reject(error);
                        });

                    });

                };

                /* scope.changeHandler = function () {
                    if(scope.itemChange) {
                        scope.itemChange()
                    }
                }; */
                scope.changeHandler = function () {

                    bfcVm.model = scope.modelObj.model;

                    if (bfcVm.itemChange) {
                        bfcVm.itemChange();
                    }

                };

                scope.init = function () {

                    /*if (scope.entity[scope.item.name]) {
                        scope.fields = [];

                        var obj = {};
                        obj[scope.entity[scope.item.name]] = scope.entity[scope.item.name];

                        scope.fields.push(obj)
                    }*/
                    scope.getData().then(function () {

                        scope.inputTextObj.value = getSelectedFieldName();
                        scope.options = bfcVm.checkForNotNull(scope.options);

                        scope.$apply();

                    });

                };

                scope.init()

            }

        }
    }
}());