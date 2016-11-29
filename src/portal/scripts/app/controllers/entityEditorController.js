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
    var usersGroupService = require('../services/usersGroupService');

    var uiService = require('../services/uiService');

    var gridHelperService = require('../services/gridHelperService');
    var metaService = require('../services/metaService');
    var layoutService = require('../services/layoutService');

    var metaPermissionsService = require('../services/metaPermissionsService');

    module.exports = function ($scope, $state) {

        logService.controller('EntityEditorController', 'initialized');

        var vm = this;
        vm.readyStatus = {content: false, permissions: false, entity: false, me: false};
        console.log('$scope', $scope);
        vm.entityType = $scope.$parent.vm.entityType;
        vm.entityTabs = metaService.getEntityTabs(vm.entityType);
        vm.evAction = $scope.$parent.vm.evAction;
        vm.entityId = $scope.$parent.vm.entityId;
        vm.entity = {$_isValid: true};

        vm.editLayoutEntityInstanceId = null; // could be setted from special rules controller
        vm.editLayoutByEntityInsance = false;
        vm.entitySpecialRules = false;
        vm.specialRulesReady = true;
        if (['complex-transaction'].indexOf(vm.entityType) !== -1) {
            vm.editLayoutByEntityInsance = true;
            vm.entitySpecialRules = true;
            vm.complexTransactionOptions = {};
        }

        logService.property('entityType', vm.entityType);
        logService.property('entityId', vm.entityId);

        vm.getEditListByInstanceId = function () {
            console.log('vm.editLayoutEntityInstanceId', vm.editLayoutEntityInstanceId);

            uiService.getEditLayoutByInstanceId(vm.entityType, vm.editLayoutEntityInstanceId).then(function (data) {

                if (data) {
                    vm.tabs = data.data;
                    vm.userInputs = [];
                    vm.tabs.forEach(function (tab) {
                        tab.layout.fields.forEach(function (field) {
                            if (field.attribute_class = 'userInput') {
                                vm.userInputs.push(field.attribute);
                            }
                        });
                    })
                } else {
                    vm.tabs = uiService.getDefaultEditLayout(vm.entityType)[0].data;
                }

                $scope.$apply();
            });

            $scope.$parent.vm.editLayout = function () {
                $state.go('app.data-constructor', {
                    entityType: vm.entityType,
                    instanceId: vm.editLayoutEntityInstanceId
                });
            };

        };

        if (vm.entityType !== 'transaction-type') {
            if (vm.editLayoutByEntityInsance == true) {
                if (vm.editLayoutEntityInstanceId) {
                    vm.getEditListByInstanceId();
                }
            } else {
                uiService.getEditLayout(vm.entityType).then(function (data) {
                    if (data.results.length) {
                        vm.tabs = data.results[0].data;
                    } else {
                        vm.tabs = uiService.getDefaultEditLayout(vm.entityType)[0].data;
                    }
                    logService.collection('vm.tabs', vm.tabs);
                    $scope.$apply();
                });
            }
        }

        vm.attrs = [];
        vm.baseAttrs = [];
        vm.entityAttrs = [];
        vm.userInputs = []; // setting from edit layout
        vm.layoutAttrs = layoutService.getLayoutAttrs();

        vm.baseAttrs = metaService.getBaseAttrs();
        vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];

        attributeTypeService.getList(vm.entityType).then(function (data) {
            vm.attrs = data.results;
            vm.readyStatus.content = true;
            //$scope.$apply();
            //

            if (vm.entityId) {

                entityResolverService.getByKey(vm.entityType, vm.entityId).then(function (data) {

                    if (vm.entityType == 'complex-transaction') {
                        vm.complexTransactionOptions.transactionType = data.transaction_type;
                        vm.editLayoutEntityInstanceId = data.transaction_type;
                        vm.entity = data;
                        vm.specialRulesReady = true;
                        vm.readyStatus.entity = true;
                        vm.readyStatus.permissions = true;
                        console.log('vm.complexTransactionOptions', vm.complexTransactionOptions);
                        $scope.$apply();
                    } else {
                        vm.entity = data;
                        entityViewerHelperService.transformItems([vm.entity], vm.attrs).then(function (data) {
                            vm.entity = data[0];
                            vm.entity.$_isValid = true;
                            vm.readyStatus.entity = true;
                            console.log('1231231231312?');
                            vm.loadPermissions();
                        });
                    }

                    //$scope.$apply();
                });
            } else {
                vm.readyStatus.entity = true;
                vm.loadPermissions();
            }

        });

        var originatorEv;

        vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getMemberList());
            promises.push(vm.getGroupList());

            Promise.all(promises).then(function (data) {

                vm.readyStatus.permissions = true;
                $scope.$apply();
            });

        };

        usersService.getMe().then(function (data) {
            //console.log('data user', data);
            vm.user = data;
            vm.readyStatus.me = true;
            $scope.$apply();
        });

        vm.resolveSpecialRules = function () {
            return 'views/special-rules/' + vm.entityType + '-special-rules-view.html';
        };

        vm.getGroupList = function () {
            return usersGroupService.getList().then(function (data) {

                //console.log('data MEMBERS', data);

                vm.groups = data.results;

                vm.groups.forEach(function (group) {

                    if (vm.entity["group_object_permissions"]) {
                        vm.entity["group_object_permissions"].forEach(function (permission) {

                            if (permission.group == group.id) {
                                if (!group.hasOwnProperty('objectPermissions')) {
                                    group.objectPermissions = {};
                                }
                                if (permission.permission === "manage_" + vm.entityType) {
                                    group.objectPermissions.manage = true;
                                }
                                if (permission.permission === "change_" + vm.entityType) {
                                    group.objectPermissions.change = true;
                                }
                            }
                        })
                    }

                });
            });

        };

        vm.getMemberList = function () {
            usersService.getMemberList().then(function (data) {

                //console.log('data MEMBERS', data);

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
            //console.log('metaPermissionsService.getEntitiesWithDisabledPermissions()', metaPermissionsService.getEntitiesWithDisabledPermissions());
            //console.log('metaPermissionsService.getEntitiesWithDisabledPermissions()', vm.entityType);
            if (metaPermissionsService.getEntitiesWithDisabledPermissions().indexOf(vm.entityType) !== -1) {
                return false;
            }
            //console.log('matbe re?');
            if (vm.entityId) {
                var i;
                //console.log('user?', vm.user);
                //console.log('members?', vm.members);
                //console.log('entity?', vm.entityId);

                var haveAccess = false;

                var entityType = vm.entityType.split('-').join('');

                if (vm.entity.granted_permissions && vm.entity.granted_permissions.indexOf("manage_" + entityType) !== -1) {
                    haveAccess = true;
                }

                //for (i = 0; i < vm.members.length; i = i + 1) {
                //    if (vm.user.id == vm.members[i].id) {
                //        console.log('vm.members[i]', vm.members[i]);
                //        if (vm.members[i].objectPermissions && vm.members[i].objectPermissions.manage == true) {
                //            haveAccess = true;
                //        }
                //    }
                //}

                //console.log('have access', haveAccess);

                return haveAccess;
            } else {
                return true;
            }
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
            var i, l, e, u;
            if (field && field.type === 'field') {
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

                    console.log('vm.userInputs', vm.userInputs);
                    for (u = 0; u < vm.userInputs.length; u = u + 1) {
                        if (field.name === vm.userInputs[u].name) {
                            vm.userInputs[u].options = field.options;
                            return vm.userInputs[u];
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

        vm.checkViewState = function (tab) {

            if (tab.hasOwnProperty('enabled')) {
                if (tab.enabled.indexOf(vm.evAction) == -1) {
                    return false;
                }
            }

            return true;
        };


        $scope.$parent.vm.copyCallback = function () {
            return new Promise(function (resolve) {
                vm.readyStatus.entity = false;
                setTimeout(function () {
                    vm.entity["user_code"] = vm.entity["user_code"] + '_copy';
                    vm.readyStatus.entity = true;
                    resolve(vm.entity);
                }, 500);
            });
        };

        $scope.$parent.vm.saveCallback = function () {

            if (metaService.getEntitiesWithoutDynAttrsList().indexOf(vm.entityType) == -1) {
                vm.entity.attributes = [];
            }

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

            if (vm.entity.attributes) {
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

            function clearUnusedAttributeValues() {
                var i;
                for (i = 0; i < vm.entity.attributes.length; i = i + 1) {
                    if (vm.entity.attributes[i].classifier == null) {
                        delete vm.entity.attributes[i].classifier;
                    }
                    if (vm.entity.attributes[i].value_date == null) {
                        delete vm.entity.attributes[i].value_date;
                    }
                    if (vm.entity.attributes[i].value_float == null) {
                        delete vm.entity.attributes[i].value_float;
                    }
                    if (vm.entity.attributes[i].value_string == null) {
                        delete vm.entity.attributes[i].value_string;
                    }
                }

            }

            if (vm.entity.attributes) {
                checkEntityAttrTypes();
                clearUnusedAttributeValues();
            }

            if (metaPermissionsService.getEntitiesWithDisabledPermissions().indexOf(vm.entityType) == -1) {
                vm.entity["user_object_permissions"] = [];
            }

            vm.members.forEach(function (member) {

                if (member.objectPermissions && member.objectPermissions.manage == true) {
                    vm.entity["user_object_permissions"].push({
                        "member": member.id,
                        "permission": "manage_" + vm.entityType //TODO remove _vm.entityType
                    })
                }

                if (member.objectPermissions && member.objectPermissions.change == true) {
                    vm.entity["user_object_permissions"].push({
                        "member": member.id,
                        "permission": "change_" + vm.entityType //TODO remove _vm.entityType
                    })
                }

            });

            vm.entity["group_object_permissions"] = [];

            vm.groups.forEach(function (group) {

                if (group.objectPermissions && group.objectPermissions.manage == true) {
                    vm.entity["group_object_permissions"].push({
                        "group": group.id,
                        "permission": "manage_" + vm.entityType
                    })
                }

                if (group.objectPermissions && group.objectPermissions.change == true) {
                    vm.entity["group_object_permissions"].push({
                        "group": group.id,
                        "permission": "change_" + vm.entityType
                    })
                }

            });

            console.log('vm.entity', vm.entity);

            function checkForNulls(item) {
                var i;
                var keys = Object.keys(item);
                var result = {};
                for (i = 0; i < keys.length; i = i + 1) {
                    if (item[keys[i]] && item[keys[i]].length) {
                        result[keys[i]] = item[keys[i]];
                    } else {
                        if (item[keys[i]] != null && !isNaN(item[keys[i]])) {
                            result[keys[i]] = item[keys[i]];
                        }
                    }
                }
                return result;
            }

            function checkForNotNullRestriction(item) {
                var i, e, b, a;
                var keys = Object.keys(item);
                var isValid = true;
                for (i = 0; i < keys.length; i = i + 1) {
                    for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
                        if (keys[i] == vm.entityAttrs[e].key) {
                            if (vm.entityAttrs[e].options && vm.entityAttrs[e].options.notNull == true) {
                                if (item[keys[i]] == '' || item[keys[i]] == null || item[keys[i]] == undefined) {
                                    isValid = false
                                }
                            }
                        }
                    }

                    for (b = 0; b < vm.baseAttrs.length; b = b + 1) {
                        if (keys[i] == vm.baseAttrs[b].key) {
                            if (vm.baseAttrs[b].options && vm.baseAttrs[b].options.notNull == true) {
                                if (item[keys[i]] == '' || item[keys[i]] == null || item[keys[i]] == undefined) {
                                    isValid = false
                                }
                            }
                        }
                    }

                    for (a = 0; a < vm.attrs.length; a = a + 1) {
                        if (keys[i] == vm.attrs[a].name) {
                            if (vm.attrs[a].options && vm.attrs[a].options.notNull == true) {
                                if (item[keys[i]] == '' || item[keys[i]] == null || item[keys[i]] == undefined) {
                                    isValid = false
                                }
                            }
                        }
                    }
                }

                vm.entity.$_isValid = isValid;

                return isValid
            }

            if (checkForNotNullRestriction(vm.entity)) {

                var resultEntity = checkForNulls(vm.entity);
                console.log('resultEntity', resultEntity);


                if (vm.entityType == 'complex-transaction') {

                    resultEntity.values = {};
                    console.log('userInputs', vm.userInputs);

                    vm.userInputs.forEach(function (userInput) {

                        if (userInput !== null) {
                            var keys = Object.keys(vm.entity);
                            keys.forEach(function (key) {
                                if (key == userInput.key) {
                                    resultEntity.values[userInput.name] = vm.entity[userInput.key];
                                }
                            });
                        }
                    });

                    resultEntity.store = true;
                    resultEntity.calculate = true;

                }

                return new Promise(function (resolve, reject) {
                    var options = {
                        entityType: vm.entityType,
                        entity: resultEntity
                    };
                    if (vm.entityId) {
                        options.entityId = vm.entityId
                    }
                    resolve(options);
                });
            }
        };

    }

}());