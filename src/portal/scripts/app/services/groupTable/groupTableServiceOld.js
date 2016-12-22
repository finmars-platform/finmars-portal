/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var groupingService = require('./groupingService');
    var filteringService = require('./filteringService');
    var sortingService = require('./sortingService');
    var columnsService = require('./columnsService');
    var foldingService = require('./foldingService');

    var GroupTableService = (function () {

        var items = [];
        var itemsAdditions = [];

        var columnsServiceExt = {
            setColumns: function (columns) {
                //console.log('setColumns', items);
                items = columnsService.setColumns(items, columns)
            }
        };

        var groupingServiceExt = {
            setGroups: function (groups, entityType) {
                items = groupingService.setGroups(items, groups, entityType);
            },
            setGroupsWithColumns: function (groups, columns, entityType) {
                items = groupingService.setGroupsWithColumns(items, groups, columns, entityType);
            }
        };

        var foldingServiceExt = {
            setFolds: function (folding) {
                items = foldingService.setFolds(items, folding);
            }
        };

        var filteringServiceExt = {
            setFilters: function (filters) {
                items = filteringService.setFilters(items, filters);
            }
        };

        var sortingServiceExt = {
            group: {
                sort: function (sort) {
                    items = sortingService.group.sort(items, sort);
                }
            },
            column: {
                sort: function (sort) {
                    itemsAdditions = sortingService.column.sort(items, sort);
                }
            }
        };

        // ADDITIONS

        var columnsAdditionsServiceExt = {
            setColumns: function (columns) {
                //console.log('setColumns', items);
                itemsAdditions = columnsService.setColumns(itemsAdditions, columns)
            }
        };

        var filteringAdditionsServiceExt = {
            setFilters: function (filters) {
                itemsAdditions = filteringService.setFilters(itemsAdditions, filters);
            }
        };

        var sortingAdditionsServiceExt = {
            column: {
                sort: function (sort) {
                    itemsAdditions = sortingService.column.additions.sort(itemsAdditions, sort);
                }
            }
        };


        function GroupTableService() {
            //console.log('instance created');
            this.setItems = function (itemsSource) {
                items = itemsSource;
            };
            this.extractDynamicAttributes = groupingService.extractDynamicAttributes;
            this.columns = columnsServiceExt;
            this.grouping = groupingServiceExt;
            this.filtering = filteringServiceExt;
            this.folding = foldingServiceExt;
            this.sorting = sortingServiceExt;
            this.projection = function () {
                return items;
            };
            //this.additions = {
            //    setItems: function (itemsAdditionsSource) {
            //        itemsAdditions = itemsAdditionsSource;
            //    },
            //    columns: columnsAdditionsServiceExt,
            //    filtering: filteringAdditionsServiceExt,
            //    sorting: sortingAdditionsServiceExt,
            //    projection: function () {
            //        return itemsAdditions;
            //    }
            //}
        }

        var instance;

        GroupTableService.getInstance = function (recreate) {

            if (recreate && recreate == true) {
                instance = null;
            }

            if (!instance) {
                instance = new GroupTableService();
            }

            console.log('----------------------------instance----------------------------', instance);

            return instance
        };

        return GroupTableService;


    }());

    module.exports = GroupTableService

}());