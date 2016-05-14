/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');
    var portfolioService = require('../../services/portfolioService');

    var demoPortfolioService = require('../../services/demoPortfolioService');

    module.exports = function ($scope, $mdDialog, parentScope, callback) {
        console.log('Group table modal controller initialized...');

        var vm = this;

        vm.tabs = [];
        vm.general = [];
        vm.attrs = [];
        vm.custom = [];

        var columns = parentScope.columns;
        var filters = parentScope.filters;
        var grouping = parentScope.grouping;

        //console.log('12323232', parentScope);

        demoPortfolioService.getTabList().then(function (data) {
            vm.tabs = data;
            syncAttrs(vm.tabs);
            callback();
            $scope.$apply();
        });

        parentScope.$watch('columns', function () {
            columns = parentScope.columns;
            syncAttrs(vm.tabs);
            callback();
        });

        parentScope.$watch('filters', function () {
            filters = parentScope.filters;
            syncAttrs(vm.tabs);
            callback();
        });
        parentScope.$watch('grouping', function () {
            grouping = parentScope.grouping;
            syncAttrs(vm.tabs);
            callback();
        });


        var syncAttrs = function (tabs) {
            var i, t;
            var attrs;
            console.log('columns 123322', columns);
            for (t = 0; t < tabs.length; t = t + 1) {
                attrs = tabs[t].attrs;
                for (i = 0; i < attrs.length; i = i + 1) {
                    attrs[i].columns = false;
                    attrs[i].filters = false;
                    attrs[i].groups = false;
                    columns.map(function (item) {
                        if (attrs[i].name === item.name) {
                            attrs[i].columns = true;
                        }
                        return item;
                    });
                    filters.map(function (item) {
                        if (attrs[i].name === item.name) {
                            attrs[i].filters = true;
                        }
                        return item;
                    });
                    grouping.map(function (item) {
                        if (attrs[i].name === item.name) {
                            attrs[i].groups = true;
                        }
                        return item;
                    });

                }
            }

            return attrs;
        };

        var updateAttrs = function () {
            var i, c, g, t;
            var columnExist, groupExist, filterExist;
            for (t = 0; t < vm.tabs.length; t = t + 1) {

                for (i = 0; i < vm.tabs[t].attrs.length; i = i + 1) {
                    columnExist = false;
                    groupExist = false;
                    filterExist = false;
                    for (c = 0; c < columns.length; c = c + 1) {
                        if (vm.tabs[t].attrs[i].name === columns[c].name) {
                            columnExist = true;
                            if (vm.tabs[t].attrs[i].columns === false) {
                                columns.splice(c, 1);
                                c = c - 1;
                            }
                        }
                    }
                    if (!columnExist) {
                        if (vm.tabs[t].attrs[i].columns === true) {
                            columns.push(vm.tabs[t].attrs[i]);
                        }
                    }

                    /////// GROUPING

                    for (g = 0; g < grouping.length; g = g + 1) {
                        if (vm.tabs[t].attrs[i].name === grouping[g].name) {
                            groupExist = true;
                            if (vm.tabs[t].attrs[i].groups === false) {
                                grouping.splice(g, 1);
                                g = g - 1;
                            }
                        }
                    }
                    if (!groupExist) {
                        if (vm.tabs[t].attrs[i].groups === true) {
                            grouping.push(vm.tabs[t].attrs[i]);
                        }
                    }
                }
            }
        };

        vm.updateAttrs = function () {
            updateAttrs();
            callback();
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        var dragAndDrop = {

            init: function () {
                this.dragula();
                this.eventListeners();
            },

            eventListeners: function () {
                var that = this;
                var exist = false;
                this.dragula.on('drop', function (elem, target) {
                    console.log('here?', target); //TODO fallback to ids instead of name/key
                    var name = $(elem).html();
                    var i;
                    exist = false;
                    for (i = 0; i < columns.length; i = i + 1) {
                        if (columns[i] === name) {
                            exist = true;
                        }
                    }
                    console.log('name', name);
                    console.log('columns', columns);
                    if (!exist) {
                        columns.push(name);
                        syncGeneralAttrs(vm.general);
                        syncAttrs(vm.attrs);
                        callback();
                        console.log('updated');
                    }
                });

                this.dragula.on('dragend', function (el) {
                    $(el).remove();
                })
            },

            dragula: function () {
                console.log('draguula!');

                var items = [document.querySelector('#columnsbag')];
                var i;
                var itemsElem = document.querySelectorAll('#dialogbag .g-modal-draggable-card');
                for (i = 0; i < itemsElem.length; i = i + 1) {
                    items.push(itemsElem[i]);
                }

                this.dragula = dragula(items,
                    {
                        moves: this.canMove.bind(this),
                        copy: true
                    });
            },

            canMove: function () {
                return true;
            }

        };

        setTimeout(function () {
            dragAndDrop.init()
        }, 500);

    }


}());