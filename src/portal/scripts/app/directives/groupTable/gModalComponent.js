/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../services/logService');

    var uiService = require('../../services/uiService');

    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');

    module.exports = function ($scope, $mdDialog, parentScope, callback) {

        logService.controller('gModalController', 'initialized');

        var vm = this;
        vm.readyStatus = {content: false};


        vm.tabs = parentScope.tabs;
        vm.entityType = parentScope.entityType;

        uiService.getEditLayout(vm.entityType).then(function(data){
            logService.collection('DATA', data);
            vm.tabs = data.results[0].data;
            vm.getAttributes();
            $scope.$apply();
        });
        vm.general = [];
        vm.attrs = [];
        vm.baseAttrs = [];
        vm.custom = [];

        vm.tabAttrsReady = false;

        // refactore this block
        function restoreAttrs() {
            function fillTabWithAttrs() {
                var i, x;
                for (i = 0; i < vm.tabs.length; i = i + 1) {
                    if (!vm.tabs[i].attrs) {
                        vm.tabs[i].attrs = [];

                        for (x = 0; x < vm.tabs[i].layout.fields.length; x = x + 1) {
                           ;
                            if(vm.tabs[i].layout.fields[x].type === 'field') {
                                if (vm.tabs[i].layout.fields[x].hasOwnProperty('id')) {
                                    vm.tabs[i].attrs.push({
                                        id: vm.tabs[i].layout.fields[x].id
                                    })
                                } else {
                                    if (vm.tabs[i].layout.fields[x].type === 'field') {
                                        if (vm.tabs[i].layout.fields[x].name != 'Labeled Line' && vm.tabs[i].layout.fields[x].name != 'Line') {
                                            vm.tabs[i].attrs.push({
                                                name: vm.tabs[i].layout.fields[x].name
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                console.log('vm.tabs[i].attrs', vm.tabs[0].attrs)
            }

            function fillTabAttrs() {

                var a, t, c, b;
                var tab, tabAttr, attr, baseAttr, attributeIsExist;
                console.log('METHOD: restoreAttrs, data: vm.tabs, value: ', vm.tabs);
                console.log('METHOD: restoreAttrs, data: vm.attrs, value: ', vm.attrs);
                for (t = 0; t < vm.tabs.length; t = t + 1) {
                    tab = vm.tabs[t];
                    for (c = 0; c < tab.attrs.length; c = c + 1) {
                        tabAttr = tab.attrs[c];
                        attributeIsExist = false;
                        if (tabAttr.hasOwnProperty('id')) {
                            for (a = 0; a < vm.attrs.length; a = a + 1) {
                                attr = vm.attrs[a];
                                if (tabAttr.id === attr.id) {
                                    vm.tabs[t].attrs[c] = attr;
                                    attributeIsExist = true;
                                }
                            }
                            if(!attributeIsExist) {
                                vm.tabs[t].attrs.splice(c, 1);
                                c = c - 1;
                            }
                        } else {
                            for (b = 0; b < vm.baseAttrs.length; b = b + 1) {
                                baseAttr = vm.baseAttrs[b];
                                if (tabAttr.name === baseAttr.name) {
                                    vm.tabs[t].attrs[c] = baseAttr;
                                    attributeIsExist = true;
                                }
                            }
                            if(!attributeIsExist) {
                                vm.tabs[t].attrs.splice(c, 1);
                                c = c - 1;
                            }
                        }
                    }
                }
            }

            fillTabWithAttrs();
            fillTabAttrs();
            vm.tabAttrsReady = true;
        }

        // end refactore

        var columns = parentScope.columns;
        var filters = parentScope.filters;
        var grouping = parentScope.grouping;

        var attrsList = [];

        $('body').addClass('drag-dialog'); // hide backdrop
        vm.getAttributes = function () {
            return attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
                vm.baseAttrs = metaService.getBaseAttrs();
                attrsList = vm.attrs.concat(vm.baseAttrs);
                restoreAttrs();
                syncAttrs(vm.tabs);
                logService.collection('vm.tabs', vm.tabs);
                vm.readyStatus.content = true;
                $scope.$apply();
            })
        };


        parentScope.$watch('columns', function () {
            if (vm.tabAttrsReady) {
                columns = parentScope.columns;
                syncAttrs(vm.tabs);
                callback();
            }
        });
        parentScope.$watch('filters', function () {
            if (vm.tabAttrsReady) {
                filters = parentScope.filters;
                syncAttrs(vm.tabs);
                callback();
            }
        });
        parentScope.$watch('grouping', function () {
            if (vm.tabAttrsReady) {
                grouping = parentScope.grouping;
                syncAttrs(vm.tabs);
                callback();
            }
        });

        var syncAttrs = function (tabs) {
            var i, t;
            var attrs;
            console.log('METHOD: syncAttrs, data: tabs, value: ', tabs);
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
            var i, c, g, t, f;
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

                    /////// FILTERING

                    for (f = 0; f < filters.length; f = f + 1) {
                        if (vm.tabs[t].attrs[i].name === filters[f].name) {
                            filterExist = true;
                            if (vm.tabs[t].attrs[i].groups === false) {
                                filters.splice(f, 1);
                                f = f - 1;
                            }
                        }
                    }
                    if (!filterExist) {
                        if (vm.tabs[t].attrs[i].filters === true) {
                            filters.push(vm.tabs[t].attrs[i]);
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
                    $(container).addClass('active');
                    $(container).on('mouseleave', function () {
                        $(this).removeClass('active');
                    })

                });
                this.dragula.on('drop', function (elem, target) {
                    //console.log('here?', target); //TODO fallback to ids instead of name/key
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
                    if (target === document.querySelector('#filtersbag .drop-new-filter')) {
                        for (i = 0; i < grouping.length; i = i + 1) {
                            if (filters[i].name === name) {
                                exist = true;
                            }
                        }
                    }
                    if (!exist) {
                        var a;
                        if (target === document.querySelector('#columnsbag')) {
                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === name) {
                                    columns.push(attrsList[a]);
                                }
                            }
                            syncAttrs(vm.tabs);
                            callback();
                        }
                        if (target === document.querySelector('#groupsbag')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === name) {
                                    grouping.push(attrsList[a]);
                                }
                            }
                            syncAttrs(vm.tabs);
                            callback();
                        }
                        if (target === document.querySelector('#filtersbag .drop-new-filter')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === name) {
                                    filters.push(attrsList[a]);
                                }
                            }
                            syncAttrs(vm.tabs);
                            callback();
                        }
                        $scope.$apply();
                    }
                });

                this.dragula.on('dragend', function (el) {
                    $(el).remove();
                })
            },

            dragula: function () {
                var items = [document.querySelector('#columnsbag'), document.querySelector('#groupsbag'), document.querySelector('#filtersbag .drop-new-filter')];
                var i;
                var itemsElem = document.querySelectorAll('#dialogbag .g-modal-draggable-card');
                for (i = 0; i < itemsElem.length; i = i + 1) {
                    items.push(itemsElem[i]);
                }

                this.dragula = dragula(items,
                    {
                        copy: true
                    });
            }
        };

        setTimeout(function () {
            dragAndDrop.init()
        }, 500);

    }


}());