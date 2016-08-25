/**
 * Created by szhitenev on 25.08.2016.
 */
(function () {

    'use strict';
    var logService = require('../../../../core/services/logService');

    var attributeTypeService = require('../services/attributeTypeService');
    var entityResolverService = require('../services/entityResolverService');
    var entityViewerHelperService = require('../services/entityViewerHelperService');

    var usersService = require('../services/usersService');

    var uiService = require('../services/uiService');

    var gridHelperService = require('../services/gridHelperService');
    var metaService = require('../services/metaService');
    var layoutService = require('../services/layoutService');

    var metaPermissionsService = require('../services/metaPermissionsService');

    module.exports = function ($scope) {

        logService.controller('EntityEditorController', 'initialized');

        var vm = this;
        vm.readyStatus = {content: false, permissions: false, entity: false, me: false};
        console.log('$scope', $scope);
        vm.entityType = $scope.$parent.vm.entityType;
        vm.entityTabs = metaService.getEntityTabs(vm.entityType);
        vm.evAction = 'update';
        vm.entityId = $scope.$parent.vm.entityId;
        vm.entity = {attributes: []};

        logService.property('entityType', vm.entityType);
        logService.property('entityId', vm.entityId);

        uiService.getEditLayout(vm.entityType).then(function (data) {
            vm.tabs = data.results[0].data;
            logService.collection('vm.tabs', vm.tabs);
            $scope.$apply();
        });

        vm.attrs = [];
        vm.baseAttrs = [];
        vm.entityAttrs = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();

        vm.baseAttrs = metaService.getBaseAttrs();
        vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

        attributeTypeService.getList(vm.entityType).then(function (data) {
            vm.attrs = data.results;
            vm.readyStatus.content = true;
            //$scope.$apply();
            //

            if (vm.entityId) {
                entityResolverService.getByKey(vm.entityType, vm.entityId).then(function (data) {
                    vm.entity = data;
                    entityViewerHelperService.transformItems([vm.entity], vm.attrs).then(function (data) {
                        vm.entity = data[0];
                        vm.readyStatus.entity = true;
                        vm.getMemberList();
                    });

                    //$scope.$apply();
                });
            } else {
                vm.readyStatus.entity = true;
                vm.getMemberList();
            }

        });

        var originatorEv;

        usersService.getMe().then(function (data) {
            vm.user = data;
            vm.readyStatus.me = true;
            $scope.$apply();
        });

        vm.getMemberList = function () {
            usersService.getMemberList().then(function (data) {
                vm.members = data.results;

                vm.members.forEach(function (member) {

                    if (vm.entity["user_object_permissions"]) {
                        vm.entity["user_object_permissions"].forEach(function (permission) {

                            if (permission.member == member.id) {
                                if (!member.hasOwnProperty('objectPermissions')) {
                                    member.objectPermissions = {};
                                }
                                if (permission.permission === "manage_" + vm.entityType) {
                                    member.objectPermissions.manage = true;
                                }
                                if (permission.permission === "change_" + vm.entityType) {
                                    member.objectPermissions.change = true;
                                }
                            }
                        })
                    }

                });

                vm.readyStatus.permissions = true;

                $scope.$apply();
            });
        };

        vm.checkPermissions = function () {
            if (metaPermissionsService.getEntitiesWithDisabledPermissions().indexOf(vm.entityType) !== -1) {
                return false;
            }
            var i;
            for (i = 0; i < vm.members.length; i = i + 1) {
                if (vm.user.id === vm.members[i].id) {
                    if (vm.members[i].objectPermissions && vm.members[i].objectPermissions.manage == true) {
                        return true;
                    }
                }
            }
            return false;
        };

        vm.checkReadyStatus = function () {
            if (vm.readyStatus.content && vm.readyStatus.entity && vm.readyStatus.me && vm.readyStatus.permissions) {
                return true
            }
            return false;
        };

        vm.range = gridHelperService.range;

        vm.bindFlex = function (tab, row, field) {
            var totalColspans = 0;
            var i;
            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row === row) {
                    totalColspans = totalColspans + tab.layout.fields[i].colspan;
                }
            }
            var flexUnit = 100 / tab.layout.columns;
            return Math.floor(field.colspan * flexUnit);

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

        vm.openMenu = function ($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        $scope.$parent.vm.saveCallback = function () {

            function updateValue(entityAttr, attr, value) {

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
                        for (c = 0; c < vm.entity.attributes.length; c = c + 1) {
                            if (vm.entity.attributes[c]['attribute_type'] === vm.attrs[i].id) {
                                attrExist = true;
                                vm.entity.attributes[c] = updateValue(vm.entity.attributes[c], vm.attrs[i], vm.entity[keys[a]]);
                            }
                        }
                        if (!attrExist) {
                            vm.entity.attributes.push(appendAttribute(vm.attrs[i], vm.entity[keys[a]]));
                        }
                    }
                }
            }

            function checkEntityAttrTypes() {
                var i;
                for (i = 0; i < vm.entityAttrs.length; i = i + 1) {
                    //console.log('vm.entityAttrs[i]', vm.entityAttrs[i]);
                    if (vm.entityAttrs[i]['value_type'] === 40) {
                        vm.entity[vm.entityAttrs[i].key] = moment(new Date(vm.entity[vm.entityAttrs[i].key])).format('YYYY-MM-DD');
                    }
                    if (vm.entityAttrs[i]['value_type'] === 20 || vm.entityAttrs[i]['value_type'] === 'float') {
                        //console.log('vm.entity[vm.entityAttrs[i].key]', vm.entity[vm.entityAttrs[i].key]);
                        var withotSpaces = (vm.entity[vm.entityAttrs[i].key] + '').replace(' ', '');
                        var res;
                        if (withotSpaces.indexOf(',') !== -1) {
                            res = withotSpaces.replace(',', '.');
                        } else {
                            res = withotSpaces;
                        }
                        vm.entity[vm.entityAttrs[i].key] = parseFloat(res);
                        //console.log('vm.entity[vm.entityAttrs[i].key]', vm.entity[vm.entityAttrs[i].key]);
                    }
                }

                vm.entity.attributes.forEach(function (item) {
                    if (item['value_date'] !== null) {
                        item['value_date'] = moment(new Date(item['value_date'])).format('YYYY-MM-DD');
                    }
                })
            }

            checkEntityAttrTypes();

            vm.entity["user_object_permissions"] = [];

            vm.members.forEach(function (member) {

                if (member.objectPermissions && member.objectPermissions.manage == true) {
                    vm.entity["user_object_permissions"].push({
                        "member": member.id,
                        "permission": "manage_" + vm.entityType
                    })
                }

                if (member.objectPermissions && member.objectPermissions.change == true) {
                    vm.entity["user_object_permissions"].push({
                        "member": member.id,
                        "permission": "change_" + vm.entityType
                    })
                }

            });

            return new Promise(function (resolve, reject) {
                var options = {
                    entityType: vm.entityType,
                    entity: vm.entity
                };
                if (vm.entityId) {
                    options.entityId = vm.entityId
                }
                resolve(options);
            });
        };

    }

}());