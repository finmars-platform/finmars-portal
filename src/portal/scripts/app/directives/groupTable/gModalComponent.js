/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var uiService = require('../../services/uiService');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var evEvents = require('../../services/entityViewerEvents');

    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');

    module.exports = function ($scope, $mdDialog, entityViewerDataService, entityViewerEventService) {

        logService.controller('gModalController', 'initialized');

        var vm = this;
        vm.readyStatus = {content: false};

        vm.tabs = [];
        vm.entityType = entityViewerDataService.getEntityType();

        console.log('vm', vm);

        logService.property('vm.entityType', vm.entityType);

        vm.general = [];
        vm.attrs = [];
        vm.entityAttrs = [];

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
                            if (vm.tabs[i].layout.fields[x].type === 'field') {
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
                //console.log('vm.tabs[i].attrs', vm.tabs[0].attrs)
            }

            function fillTabAttrs() {

                var a, t, c, b, e;
                var tab, tabAttr, attr, baseAttr, attributeIsExist, entityAttr;
                //console.log('METHOD: restoreAttrs, data: vm.tabs, value: ', vm.tabs);
                //console.log('METHOD: restoreAttrs, data: vm.attrs, value: ', vm.attrs);
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
                            if (!attributeIsExist) {
                                vm.tabs[t].attrs.splice(c, 1);
                                c = c - 1;
                            }
                        } else {

                            for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
                                entityAttr = vm.entityAttrs[e];
                                if (tabAttr.name === entityAttr.name) {
                                    vm.tabs[t].attrs[c] = entityAttr;
                                    attributeIsExist = true;
                                }
                            }

                            if (!attributeIsExist) {
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

        var columns = entityViewerDataService.getColumns();
        var currentColumnsWidth = columns.length;
        var filters = entityViewerDataService.getFilters();
        var grouping = entityViewerDataService.getGroups();

        var attrsList = [];

        $('body').addClass('drag-dialog'); // hide backdrop
        vm.getAttributes = function () {

            vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

            vm.entityAttrs.forEach(function (item) {
                item.entity = vm.entityType;
            });

            attributeTypeService.getList(vm.entityType).then(function (data) {

                vm.attrs = data.results;

                vm.attrs.forEach(function (item) {
                    item.entity = vm.entityType;
                });

                attrsList = attrsList.concat(vm.entityAttrs);
                attrsList = attrsList.concat(vm.attrs);
                restoreAttrs();
                syncAttrs();

                vm.readyStatus.content = true;
                $scope.$apply();
            })

        };

        vm.getAttributes();

        vm.checkAreaAccessibility = function (item, type) {
            if (type === 'group') {
                if (['notes', 'accounts', 'responsibles', 'counterparties', 'transaction_types', 'portfolios', 'tags', 'content_types'].indexOf(item.key) !== -1) {
                    return true;
                }
                return false;
            }
            else {
                if (['notes'].indexOf(item.key) !== -1) {
                    return true;
                }
                return false;
            }
        };

        var syncAttrs = function () {
            syncTypeAttrs(vm.entityAttrs);
            syncTypeAttrs(vm.attrs);
        };


        function syncTypeAttrs(attrs) {

            var i;
            for (i = 0; i < attrs.length; i = i + 1) {
                attrs[i].columns = false;
                attrs[i].filters = false;
                attrs[i].groups = false;
                columns.map(function (item) {
                    //console.log('item', item);
                    //console.log('attrs[i]', attrs[i]);
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
                    if (item.hasOwnProperty('key')) {
                        if (attrs[i].key === item.key) {
                            attrs[i].groups = true;
                        }
                    } else {
                        if (attrs[i].name === item.name) {
                            attrs[i].groups = true;
                        }
                    }
                    return item;
                });
            }
        }

        function updateTypeAttrs(typeAttrs) {
            var i, c, g, f;
            var columnExist, groupExist, filterExist;

            for (i = 0; i < typeAttrs.length; i = i + 1) {
                columnExist = false;
                groupExist = false;
                filterExist = false;
                for (c = 0; c < columns.length; c = c + 1) {
                    if (typeAttrs[i].hasOwnProperty('key')) {
                        if (typeAttrs[i].key === columns[c].key) {
                            columnExist = true;
                            if (typeAttrs[i].columns === false) {
                                columns.splice(c, 1);
                                c = c - 1;
                            }
                        }
                    } else {
                        if (typeAttrs[i].name === columns[c].name) {
                            columnExist = true;
                            if (typeAttrs[i].columns === false) {
                                columns.splice(c, 1);
                                c = c - 1;
                            }
                        }
                    }
                }
                if (!columnExist) {
                    if (typeAttrs[i].columns === true) {
                        columns.push(typeAttrs[i]);
                    }
                }

                /////// GROUPING

                for (g = 0; g < grouping.length; g = g + 1) {
                    if (typeAttrs[i].hasOwnProperty('key')) {
                        if (typeAttrs[i].key === grouping[g].key) {
                            groupExist = true;
                            if (typeAttrs[i].groups === false) {
                                grouping.splice(g, 1);
                                g = g - 1;
                            }
                        }
                    } else {
                        if (typeAttrs[i].id === grouping[g].id) {
                            groupExist = true;
                            if (typeAttrs[i].groups === false) {
                                grouping.splice(g, 1);
                                g = g - 1;
                            }
                        }
                    }
                }
                if (!groupExist) {
                    if (typeAttrs[i].groups === true) {
                        grouping.push(typeAttrs[i]);
                    }
                }

                /////// FILTERING

                for (f = 0; f < filters.length; f = f + 1) {
                    if (typeAttrs[i].hasOwnProperty('key')) {
                        if (typeAttrs[i].key === filters[f].key) {
                            filterExist = true;
                            if (typeAttrs[i].filters === false) {
                                filters.splice(f, 1);
                                f = f - 1;
                            }
                        }
                    } else {
                        if (typeAttrs[i].name === filters[f].name) {
                            filterExist = true;
                            if (typeAttrs[i].filters === false) {
                                filters.splice(f, 1);
                                f = f - 1;
                            }
                        }
                    }
                }
                if (!filterExist) {
                    if (typeAttrs[i].filters === true) {
                        filters.push(typeAttrs[i]);
                    }
                }
            }

            entityViewerDataService.setColumns(columns);
            entityViewerDataService.setGroups(grouping);
            entityViewerDataService.setFilters(filters);

        }

        vm.updateAttrs = function () {

            updateTypeAttrs(vm.entityAttrs);
            updateTypeAttrs(vm.attrs);

            addColumn();

            evDataHelper.updateColumnsIds(entityViewerDataService);
            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);

            entityViewerEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
            entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
            entityViewerEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

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
                        for (i = 0; i < filters.length; i = i + 1) {
                            if (filters[i].name === name) {
                                exist = true;
                            }
                        }
                    }

                    if (!exist && target) {
                        var a;

                        var nodes = Array.prototype.slice.call(target.children);
                        var index = nodes.indexOf(elem);

                        if (target === document.querySelector('.g-columns-holder') ||
                            target === document.querySelector('#columnsbag')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === name) {

                                    if (target === document.querySelector('#columnsbag')) {
                                        columns.push(attrsList[a]);
                                    } else {
                                        columns.splice(index, 0, attrsList[a]);
                                    }

                                    //columns.push(attrsList[a]);
                                }
                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);
                            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }
                        if (target === document.querySelector('#groupsbag') ||
                            target === document.querySelector('.g-groups-holder')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === name) {

                                    if (target === document.querySelector('#groupsbag')) {
                                        grouping.push(attrsList[a]);
                                    } else {
                                        grouping.splice(index, 0, attrsList[a]);
                                    }

                                }
                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);
                            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }
                        if (target === document.querySelector('#filtersbag .drop-new-filter') ||
                            target === document.querySelector('.g-filters-holder')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === name) {

                                    if (target === document.querySelector('#filtersbag .drop-new-filter')) {
                                        filters.push(attrsList[a]);
                                    } else {
                                        filters.splice(index, 0, attrsList[a]);
                                    }

                                }
                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);
                            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }
                        $scope.$apply();
                    }


                    $scope.$apply();
                });

                this.dragula.on('dragend', function (el) {
                    $scope.$apply();
                    $(el).remove();
                })
            },

            dragula: function () {

                var items = [
                    document.querySelector('.g-columns-holder'),
                    document.querySelector('#columnsbag'),
                    document.querySelector('.g-groups-holder'),
                    document.querySelector('#groupsbag'),
                    document.querySelector('.g-filters-holder'),
                    document.querySelector('#filtersbag .drop-new-filter')
                ];

                var i;
                var itemsElem = document.querySelectorAll('#dialogbag .g-modal-draggable-card');
                for (i = 0; i < itemsElem.length; i = i + 1) {
                    items.push(itemsElem[i]);
                }

                this.dragula = dragula(items,
                    {
                        accepts: function (el, target, source, sibling) {

                            //console.log('el', el, target, source);

                            if (target.classList.contains('g-modal-draggable-card')) {
                                return false;
                            }

                            return true;
                        },
                        copy: true
                    });
            },

            destroy: function () {
                // console.log('this.dragula', this.dragula)
                this.dragula.destroy();
            }
        };

        var addColumn = function () {
            if (currentColumnsWidth < columns.length) {
                metaService.columnsWidthGroups(true);
            }
            else {
                metaService.columnsWidthGroups(false);
            }
        };

        setTimeout(function () {
            dragAndDrop.init()
        }, 500);

        vm.cancel = function () {
            $('body').removeClass('drag-dialog');

            dragAndDrop.destroy();

            $mdDialog.cancel();
        };

        vm.MABtnVisibility = function (entityType) {
            return metaService.checkRestrictedEntityTypesForAM(entityType);
        };

        var init = function () {

            entityViewerEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                columns = entityViewerDataService.getColumns();
                syncAttrs();

            });

            entityViewerEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

                grouping = entityViewerDataService.getGroups();
                syncAttrs();

            });

            entityViewerEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

                filters = entityViewerDataService.getFilters();
                syncAttrs();

            });

        };

        init();


    }

}());