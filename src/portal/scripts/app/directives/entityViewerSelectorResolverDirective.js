/**
 * Created by szhitenev on 17.06.2016.
 */
(function () {

    'use strict';

    var referenceTableService = require('../services/referenceTablesService');

    module.exports = function ($scope) {

        return {
            scope: {
                item: '=',
                entity: '=',
                content_type: '=',
                options: '=',
                entityType: '=',
                itemChange: '&'
            },
            templateUrl: 'views/directives/entity-viewer-selector-resolver-view.html',
            link: function (scope, elem, attrs) {

                scope.readyStatus = {content: false, tags: false};

                scope.fields = [];

                scope.searchTerm = '';

                scope.resolveSort = function (field) {

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

                    console.log('scope,', scope);

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

                            scope.fields = referenceTable.rows;
                        }
                        scope.readyStatus.content = true;

                        scope.$apply(function () {

                            setTimeout(function () {
                                $(elem).find('.md-select-search-pattern').on('keydown', function (ev) {
                                    ev.stopPropagation();
                                });
                            }, 100);
                        });
                    });
                };

                scope.changeHandler = function () {
                    if(scope.itemChange) {
                        scope.itemChange()
                    }
                };

                scope.init = function () {

                    if (scope.entity[scope.item.name]) {
                        scope.fields = [];

                        var obj = {};
                        obj[scope.entity[scope.item.name]] = scope.entity[scope.item.name];

                        scope.fields.push(obj)
                    }


                };

                scope.init()

            }

        }
    }
}());