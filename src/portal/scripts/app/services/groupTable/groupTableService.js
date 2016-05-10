/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var groupingService = require('./groupingService');
    var filteringService = require('./filteringService');
    var sortingService = require('./sortingService');
    var columnsService = require('./columnsService');

    var GroupTableService = (function () {

        var items = [];

        var columnsServiceExt = {
            setColumns: function(columns) {
                console.log('setColumns', items);
                items = columnsService.setColumns(items, columns)
            }
        };

        var groupingServiceExt = {
            setGroups: function(groups) {
                items = groupingService.setGroups(items, groups);
            }
        };

        var filteringServiceExt = {
            setFilters: function(filters) {
                items = filteringService.setFilters(items, filters);
            }
        };

        var sortingServiceExt = {
            group: {
                sort: function(sort){
                    items = sortingService.group.sort(items, sort);
                }
            },
            column: {
                sort: function(sort){
                    items = sortingService.column.sort(items, sort);
                }
            }
        };



        function GroupTableService(){
            console.log('instance created');
            this.setItems = function(itemsSource){
                items = itemsSource;
            };
            this.columns = columnsServiceExt;
            this.grouping = groupingServiceExt;
            this.filtering = filteringServiceExt;
            this.sorting = sortingServiceExt;
            this.projection = function(){
                return items;
            }
        }

        var instance;

        GroupTableService.getInstance = function () {
            if (!instance) {
                instance = new GroupTableService();
            }
            return instance
        };

        return GroupTableService;
    }());

    module.exports = GroupTableService

}());