/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');
    var portfolioService = require('../../services/portfolioService');

    module.exports = function ($scope, $mdDialog, parentScope, callback) {
        console.log('Group table modal controller initialized...');


        var vm = this;
        vm.general = [];
        vm.attrs = [];
        vm.custom = [];

        var columns = parentScope.columns;
        var filters = parentScope.filters;
        var grouping = parentScope.grouping;

        //console.log('12323232', parentScope);

        parentScope.$watch('columns', function () {
            columns = parentScope.columns;
            syncGeneralAttrs(vm.general);
            syncAttrs(vm.attrs);
            callback();
        });

        parentScope.$watch('filters', function () {
            filters = parentScope.filters;
            syncGeneralAttrs(vm.general);
            syncAttrs(vm.attrs);
            callback();
        });
        parentScope.$watch('grouping', function () {
            grouping = parentScope.grouping;
            syncGeneralAttrs(vm.general);
            syncAttrs(vm.attrs);
            callback();
        });

        var syncGeneralAttrs = function (general) {
            var c;
            for (c = 0; c < general.length; c = c + 1) {
                general[c].columns = false;
                columns.map(function (item) {
                    if (general[c].key === item) {
                        general[c].columns = true;
                    }
                    return item;
                });
            }

            var f;
            for (f = 0; f < general.length; f = f + 1) {
                general[f].filters = false;
                filters.map(function (item) {
                    if (general[f].key === item) {
                        general[f].filters = true;
                    }
                    return item;
                });
            }

            var g;
            for (g = 0; g < general.length; g = g + 1) {
                general[g].groups = false;
                grouping.map(function (item) {
                    if (general[g].key === item) {
                        general[g].groups = true;
                    }
                    return item;
                });

            }


            return general;
        };

        var syncAttrs = function (attrs) {
            var c;
            for (c = 0; c < attrs.length; c = c + 1) {
                attrs[c].columns = false;
                columns.map(function (item) {
                    if (attrs[c].name === item) {
                        attrs[c].columns = true;
                    }
                    return item;
                });

            }

            var f;
            for (f = 0; f < attrs.length; f = f + 1) {
                attrs[f].filters = false;
                filters.map(function (item) {
                    if (attrs[f].name === item) {
                        attrs[f].filters = true;
                    }
                    return item;
                });

            }

            var g;
            for (g = 0; g < attrs.length; g = g + 1) {
                attrs[g].groups = false;
                grouping.map(function (item) {
                    if (attrs[g].name === item) {
                        attrs[g].groups = true;
                    }
                    return item;
                });

            }

            return attrs;
        };

        metaService.getGeneralAttrs().then(function (data) {
            vm.general = data;
            vm.general = syncGeneralAttrs(vm.general);
            //console.log('vm.general', vm.general);
            $scope.$apply();
        });

        portfolioService.getAttributeTypeList().then(function (data) {
            vm.attrs = data.results;
            vm.attrs = syncAttrs(vm.attrs);
            //console.log('vm.attrs', vm.attrs);
            $scope.$apply();
        });

        var updateGeneralAttrs = function () {
            var i, c, g;
            var columnExist, groupExist, filterExist;
            for (i = 0; i < vm.general.length; i = i + 1) {
                columnExist = false;
                for (c = 0; c < columns.length; c = c + 1) {
                    if (vm.general[i].key === columns[c]) {
                        columnExist = true;
                        if (vm.general[i].columns === false) {
                            columns.splice(c, 1);
                            c = c - 1;
                        }
                    }
                }
                if (!columnExist) {
                    if (vm.general[i].columns === true) {
                        columns.push(vm.general[i].key);
                    }
                }

                /////// GROUPING

                for (g = 0; g < grouping.length; g = g + 1) {
                    if (vm.general[i].key === grouping[g]) {
                        groupExist = true;
                        if (vm.general[i].groups === false) {
                            grouping.splice(g, 1);
                            g = g - 1;
                        }
                    }
                }

                if (!groupExist) {
                    if (vm.general[i].groups === true) {
                        grouping.push(vm.general[i].key);
                    }
                }
            }
        };

        var updateAttrs = function () {
            var i, c, g;
            var columnExist, groupExist, filterExist;
            for (i = 0; i < vm.attrs.length; i = i + 1) {
                columnExist = false;
                groupExist = false;
                filterExist = false;
                for (c = 0; c < columns.length; c = c + 1) {
                    if (vm.attrs[i].name === columns[c]) {
                        columnExist = true;
                        if (vm.attrs[i].columns === false) {
                            columns.splice(c, 1);
                            c = c - 1;
                        }
                    }
                }
                if (!columnExist) {
                    if (vm.attrs[i].columns === true) {
                        columns.push(vm.attrs[i].name);
                    }
                }

                /////// GROUPING

                for (g = 0; g < grouping.length; g = g + 1) {
                    if (vm.attrs[i].name === grouping[g]) {
                        groupExist = true;
                        if (vm.attrs[i].groups === false) {
                            grouping.splice(g, 1);
                            g = g - 1;
                        }
                    }
                }
                if (!groupExist) {
                    if (vm.attrs[i].groups === true) {
                        grouping.push(vm.attrs[i].name);
                    }
                }

            }
        };

        vm.updateAttrs = function (item) {
            //console.log('item', item);
            updateGeneralAttrs();
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
                    for(i = 0; i < columns.length; i = i + 1) {
                        if(columns[i] === name) {
                            exist = true;
                        }
                    }
                    console.log('name', name);
                    console.log('columns', columns);
                    if(!exist) {
                        columns.push(name);
                        syncGeneralAttrs(vm.general);
                        syncAttrs(vm.attrs);
                        callback();
                        console.log('updated');
                    }
                });

                this.dragula.on('dragend', function(el){
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