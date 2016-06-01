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

        vm.tabs = parentScope.tabs;
        vm.general = [];
        vm.attrs = [];
        vm.baseAttrs = metaService.getBaseAttrs();
        vm.custom = [];

        // refactore this block
        function restoreAttrs() {
            var i,x;
            for(i = 0; i < vm.tabs.length; i = i + 1) {
                for(x = 0; x < vm.tabs[i].layout.fields.length; x = x + 1) {
                    if(!vm.tabs[i].attrs) {
                        vm.tabs[i].attrs = [];
                    }
                    if(vm.tabs[i].layout.fields[x].hasOwnProperty('id')) {
                        vm.tabs[i].attrs.push({
                            id: vm.tabs[i].layout.fields[x].id
                        })
                    } else {
                        console.log('пыщ', vm.tabs[i].layout.fields[x]);
                        console.log(vm.tabs[i].layout.fields[x].name != 'Labeled Line');
                        if(vm.tabs[i].layout.fields[x].name != 'Labeled Line' && vm.tabs[i].layout.fields[x].name != 'Line') {
                            console.log(vm.tabs[i].layout.fields[x]);
                            vm.tabs[i].attrs.push({
                                name: vm.tabs[i].layout.fields[x].name
                            })
                        }
                    }
                }
            }

            var a, t, c, b;

            for(t = 0; t < vm.tabs.length; t = t + 1) {
                for(c = 0; c < vm.tabs[t].attrs.length; c = c + 1) {
                    if(vm.tabs[t].attrs[c].hasOwnProperty('id')) {
                        for(a = 0; a < vm.attrs.length; a = a + 1) {
                            if(vm.tabs[t].attrs[c].id === vm.attrs[a].id) {
                                vm.tabs[t].attrs[c] = vm.attrs[a];
                            }
                        }

                    } else {
                        for(b = 0; b < vm.baseAttrs.length; b = b + 1) {
                            if(vm.tabs[t].attrs[c].name === vm.baseAttrs[b].name) {
                                vm.tabs[t].attrs[c] = vm.baseAttrs[b];
                            }
                        }
                    }
                }
            }

            console.log('vm.tabs111111111', vm.tabs);

        }

        // end refactore


        var columns = parentScope.columns;
        var filters = parentScope.filters;
        var grouping = parentScope.grouping;

        var attrsList = [];

        $('body').addClass('drag-dialog'); // hide backdrop

        //console.log('12323232', parentScope);

        portfolioService.getAttributeTypeList().then(function (data) {
            attrsList = data.results;
            vm.attrs = data.results;
            restoreAttrs();
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
            console.log('tabs.length', tabs);
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
            $('body').removeClass('drag-dialog');
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
                this.dragula.on('over', function (elem, container, source) {
                    console.log('container', container);
                    $(container).addClass('active');
                    $(container).on('mouseleave', function(){
                        $(this).removeClass('active');
                    })

                });
                this.dragula.on('drop', function (elem, target) {
                    console.log('here?', target); //TODO fallback to ids instead of name/key
                    $(target).removeClass('active');
                    var name = $(elem).html();
                    var i;
                    exist = false;
                    if (target === document.querySelector('#columnsbag')) {
                        for (i = 0; i < columns.length; i = i + 1) {
                            if (columns[i].name === name) {
                                exist = true;
                            }
                        }
                    }
                    if (target === document.querySelector('#groupsbag')) {
                        for (i = 0; i < grouping.length; i = i + 1) {
                            if (grouping[i].name === name) {
                                exist = true;
                            }
                        }
                    }
                    if (!exist) {
                        console.log('target', target);
                        var a;
                        if (target === document.querySelector('#columnsbag')) {
                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === name) {
                                    columns.push(attrsList[a]);
                                }
                            }
                            syncAttrs(vm.tabs);
                            callback();
                            console.log('updated');
                        }
                        if (target === document.querySelector('#groupsbag')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === name) {
                                    grouping.push(attrsList[a]);
                                }
                            }
                            syncAttrs(vm.tabs);
                            callback();
                            console.log('updated');
                        }
                        $scope.$apply();
                    }
                });

                this.dragula.on('dragend', function (el) {
                    $(el).remove();
                })
            },

            dragula: function () {
                console.log('draguula!');

                var items = [document.querySelector('#columnsbag'), document.querySelector('#groupsbag')];
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