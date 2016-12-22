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

    var columnsServiceExt = {
        setColumns: function (columns) {
            //console.log('setColumns', this.items);
            this.items = columnsService.setColumns(this.items, columns)
        }
    };

    var groupingServiceExt = {
        setGroups: function (groups, entityType) {
            this.items = groupingService.setGroups(this.items, groups, entityType);
        },
        setGroupsWithColumns: function (groups, columns, entityType) {
            this.items = groupingService.setGroupsWithColumns(this.items, groups, columns, entityType);
        }
    };

    var foldingServiceExt = {
        setFolds: function (folding) {
            this.items = foldingService.setFolds(this.items, folding);
        }
    };

    var filteringServiceExt = {
        setFilters: function (filters) {
            this.items = filteringService.setFilters(this.items, filters);
        }
    };

    var sortingServiceExt = {
        group: {
            sort: function (sort) {
                this.items = sortingService.group.sort(this.items, sort);
            }
        },
        column: {
            sort: function (sort) {
                this.items = sortingService.column.sort(this.items, sort);
            }
        }
    };


    // THAT IS AWFUL! // TODO make refactor someday

    function GroupTableService() {
        //console.log('instance created');
        var _this = this;
        this.setItems = function (itemsSource) {
            this.items = itemsSource;
        };
        this.extractDynamicAttributes = groupingService.extractDynamicAttributes;
        this.columns = {
            setColumns: function (columns) {
                //console.log('setColumns', this.items);
                _this.items = columnsService.setColumns(_this.items, columns)
            }
        };
        this.grouping = {
            setGroups: function (groups, entityType) {
                console.log('this', _this);
                _this.items = groupingService.setGroups(_this.items, groups, entityType);
            },
            setGroupsWithColumns: function (groups, columns, entityType) {
                _this.items = groupingService.setGroupsWithColumns(_this.items, groups, columns, entityType);
            }
        };
        this.filtering = {
            setFilters: function (filters) {
                _this.items = filteringService.setFilters(_this.items, filters);
            }
        };
        this.folding = {
            setFolds: function (folding) {
                _this.items = foldingService.setFolds(_this.items, folding);
            }
        };
        this.sorting = {
            group: {
                sort: function (sort) {
                    _this.items = sortingService.group.sort(_this.items, sort);
                }
            },
            column: {
                sort: function (sort) {
                    _this.items = sortingService.column.sort(_this.items, sort);
                }
            }
        };
        this.projection = function () {
            return this.items;
        };

    }


    var getInstance = function (recreate) {
        return new GroupTableService();
    };

    module.exports = {
        getInstance: getInstance
    }

}());