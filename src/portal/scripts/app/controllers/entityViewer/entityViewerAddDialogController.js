/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var entityResolverService = require('../../services/entityResolverService');

    var uiService = require('../../services/uiService');

    var metaService = require('../../services/metaService');
    var layoutService = require('../../services/layoutService');

    module.exports = function ($scope, $mdDialog, parentScope, $state) {

        logService.controller('EntityViewerAddDialogController', 'initialized');

        logService.property('parentScope', parentScope);

        var vm = this;
        vm.readyStatus = {content: false, entity: true};
        vm.entityType = parentScope.vm.entityType;
        vm.evAction = 'create';

        uiService.getEditLayout(vm.entityType).then(function (data) {
            vm.tabs = data.results[0].data;
            logService.collection('vm.tabs', vm.tabs);
            $scope.$apply();
        });

        vm.attrs = [];
        vm.baseAttrs = [];
        vm.entityAttrs = [];
        vm.layoutAttrs = [];

        attributeTypeService.getList(vm.entityType).then(function (data) {
            vm.attrs = data.results;
            vm.readyStatus.content = true;
            $scope.$apply();
        });

        vm.baseAttrs = metaService.getBaseAttrs();
        vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);
        vm.layoutAttrs = layoutService.getLayoutAttrs();

        vm.entity = {};

        var originatorEv;

        vm.range = function (rowsCount) {
            var i;
            var rows = [];
            for (i = 1; i <= rowsCount; i = i + 1) {
                rows.push(i);
            }
            return rows;
        };

        vm.checkReadyStatus = function () {
            if (vm.readyStatus.content && vm.readyStatus.entity) {
                return true
            }
            return false;
        };

        vm.checkPermissions = function(){
            return true; // Haha shit code (look at edit controller, because single view for two controllers)
        };

        vm.bindFlex = function (tab, row, field) {
            var totalColspans = 0;
            var i;
            // console.log("tab is", tab, field);
            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row === row) {
                    totalColspans = totalColspans + tab.layout.fields[i].colspan;
                }
            }
            var flexUnit = 100 / tab.layout.columns;
            return Math.floor(field.colspan * flexUnit);

        };

        vm.checkFieldRender = function (tab, row, field) {
            if (field.row === row) {
                if (field.type === 'field') {
                    return true;
                } else {
                    var i, c, x;
                    var spannedCols = [];
                    for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                        if (tab.layout.fields[i].row === row) {

                            if (tab.layout.fields[i].type === 'field') {
                                for (c = tab.layout.fields[i].column; c <= (tab.layout.fields[i].column + tab.layout.fields[i].colspan - 1); c = c + 1) {
                                    spannedCols.push(c);
                                }
                            }
                        }
                    }
                    for (x = 0; x < spannedCols.length; x = x + 1) {
                        if (spannedCols[x] === field.column) {
                            return false;
                        }
                    }

                    return true;
                }
            }
            return false;
        };

        vm.bindField = function (tab, field) {
            var i, l, e;
            //console.log('FIELD', field);
            if (field.type === 'field') {
                if (field.hasOwnProperty('id') && field.id !== null) {
                    for (i = 0; i < vm.attrs.length; i = i + 1) {
                        if (field.id === vm.attrs[i].id) {
                            vm.attrs[i].options = field.options;
                            return vm.attrs[i];
                        }
                    }
                } else {
                    for (i = 0; i < vm.baseAttrs.length; i = i + 1) {
                        if (field.name === vm.baseAttrs[i].name) {
                            vm.baseAttrs[i].options = field.options;
                            return vm.baseAttrs[i];
                        }
                    }
                    for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
                        if (field.name === vm.entityAttrs[e].name) {
                            vm.entityAttrs[e].options = field.options;
                            return vm.entityAttrs[e];
                        }
                    }
                    for (l = 0; l < vm.layoutAttrs.length; l = l + 1) {
                        if (field.name === vm.layoutAttrs[l].name) {
                            vm.layoutAttrs[l].options = field.options;
                            return vm.layoutAttrs[l];
                        }
                    }
                }
            }
        };

        vm.openMenu = function ($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.editLayout = function () {
            $state.go('app.data-constructor', {entityType: vm.entityType});
            $mdDialog.hide();
        };

        vm.save = function () {

            function updateValue(entityAttr, attr, value) {
                console.log(entityAttr, attr, value);

                if (attr['value_type'] === 10) {
                    entityAttr['value_string'] = value;
                }

                if (attr['value_type'] === 20) {
                    entityAttr['value_float'] = value;
                }

                if (attr['value_type'] === 30) {
                    entityAttr['classifier'] = value;
                }

                if (attr['value_type'] === 40) {
                    entityAttr['value_date'] = value;
                }

                return entityAttr;
            }

            function appendAttribute(attr, value) {
                var attribute = {
                    attribute_name: attr.name,
                    attribute_type: attr.id,
                    classifier: null,
                    value_date: null,
                    value_float: null,
                    value_string: null
                };

                if (attr['value_type'] === 10) {
                    attribute['value_string'] = value;
                }

                if (attr['value_type'] === 20) {
                    attribute['value_float'] = value;
                }

                if (attr['value_type'] === 30) {
                    attribute['classifier'] = value;
                }
                if (attr['value_type'] === 40) {
                    attribute['value_date'] = value;
                }

                return attribute;
            }

            var i, a, c;
            var keys = Object.keys(vm.entity), attrExist;
            for (i = 0; i < vm.attrs.length; i = i + 1) {
                for (a = 0; a < keys.length; a = a + 1) {
                    if (vm.attrs[i].name === keys[a]) {
                        attrExist = false;
                        if (vm.entity.attributes) {
                            for (c = 0; c < vm.entity.attributes.length; c = c + 1) {
                                if (vm.entity.attributes[c]['attribute_type'] === vm.attrs[i].id) {
                                    attrExist = true;
                                    vm.entity.attributes[c] = updateValue(vm.entity.attributes[c], vm.attrs[i], vm.entity[keys[a]]);
                                }
                            }
                        }
                        if (!attrExist) {
                            console.log('vm.entity[keys[a]]', vm.entity[keys[a]]);
                            if (!vm.entity.attributes) vm.entity.attributes = [];
                            vm.entity.attributes.push(appendAttribute(vm.attrs[i], vm.entity[keys[a]]));
                        }
                    }
                }
            }


            function checkEntityAttrTypes() {
                var i;
                for (i = 0; i < vm.entityAttrs.length; i = i + 1) {
                    if(vm.entityAttrs[i]['value_type'] === 40) {
                        vm.entity[vm.entityAttrs[i].key] = moment(new Date(vm.entity[vm.entityAttrs[i].key])).format('YYYY-MM-DD');
                    }
                }
            }

            checkEntityAttrTypes();

            entityResolverService.create(vm.entityType, vm.entity).then(function (data) {
                console.log('saved!', data);
                parentScope.vm.updateTable();
                $mdDialog.hide();
            })
        };

    }

}());