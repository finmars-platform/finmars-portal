/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');

    var usersGroupService = require('../../services/usersGroupService');
    var usersService = require('../../services/usersService');

    var layoutService = require('../../services/layoutService');
    var metaService = require('../../services/metaService');

    var gridHelperService = require('../../services/gridHelperService');
    var entityViewerHelperService = require('../../services/entityViewerHelperService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var metaPermissionsService = require('../../services/metaPermissionsService');

    var uiService = require('../../services/uiService');

    var entityEditorHelper = require('../../helpers/entity-editor.helper');

    module.exports = function ($scope, $mdDialog, $state, entityType, entityId) {

        var vm = this;

        vm.entityType = entityType;
        vm.entityId = entityId;

        vm.entity = {$_isValid: true};

        vm.hasEnabledStatus = true;

        if (vm.entityType === 'price-history' || vm.entityType === 'currency-history') {
            vm.hasEnabledStatus = false;
        }

        vm.readyStatus = {attrs: false, permissions: false, entity: false, layout: false, userFields: false};

        vm.entityTabs = metaService.getEntityTabs(vm.entityType);

        vm.formIsValid = true;

        vm.dataConstructorData = {};

        vm.attrs = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();
        vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];

        vm.range = gridHelperService.range;

        vm.dataConstructorData = {entityType: vm.entityType};

        vm.attributesLayout = [];

        vm.generateAttributesFromLayoutFields = function () {

            var tabResult;
            var fieldResult;
            var i, l, e;

            vm.tabs.forEach(function (tab) {

                tabResult = [];

                tab.layout.fields.forEach(function (field) {

                    fieldResult = {};

                    if (field && field.type === 'field') {

                        if (field.attribute_class === 'attr') {

                            for (i = 0; i < vm.attrs.length; i = i + 1) {

                                if (field.key) {

                                    if (field.key === vm.attrs[i].user_code) {
                                        vm.attrs[i].options = field.options;
                                        fieldResult = vm.attrs[i];
                                    }

                                } else {

                                    if (field.attribute.user_code) {

                                        if (field.attribute.user_code === vm.attrs[i].user_code) {
                                            vm.attrs[i].options = field.options;
                                            fieldResult = vm.attrs[i];
                                        }

                                    }

                                }


                            }

                        } else {

                            for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
                                if (field.name === vm.entityAttrs[e].name) {
                                    vm.entityAttrs[e].options = field.options;
                                    fieldResult = vm.entityAttrs[e];
                                }
                            }

                            for (l = 0; l < vm.layoutAttrs.length; l = l + 1) {
                                if (field.name === vm.layoutAttrs[l].name) {
                                    vm.layoutAttrs[l].options = field.options;
                                    fieldResult = vm.layoutAttrs[l];
                                }
                            }

                        }

                        if (field.backgroundColor) {
                            fieldResult.backgroundColor = field.backgroundColor;
                        }

                    }

                    tabResult.push(fieldResult)


                });

                vm.attributesLayout.push(tabResult);

            });

            console.log('vm.attributesLayout', vm.attributesLayout);

        };

        vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getCurrentMember());
            promises.push(vm.getGroupList());

            Promise.all(promises).then(function (data) {

                vm.readyStatus.permissions = true;
                $scope.$apply();
            });

        };

        vm.getGroupList = function () {

            return usersGroupService.getList().then(function (data) {

                vm.groups = data.results;

                vm.groups.forEach(function (group) {

                    if (vm.entity.object_permissions) {
                        vm.entity.object_permissions.forEach(function (permission) {

                            if (permission.group === group.id) {
                                if (!group.hasOwnProperty('objectPermissions')) {
                                    group.objectPermissions = {};
                                }
                                if (permission.permission === "manage_" + vm.entityType.split('-').join('')) {
                                    group.objectPermissions.manage = true;
                                }
                                if (permission.permission === "change_" + vm.entityType.split('-').join('')) {
                                    group.objectPermissions.change = true;
                                }
                            }
                        })
                    }

                });
            });

        };

        vm.getCurrentMember = function () {

            usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                $scope.$apply();

            });
        };

        vm.checkPermissions = function () {

            if (metaPermissionsService.getEntitiesWithDisabledPermissions().indexOf(vm.entityType) !== -1) {
                return false;
            }

            if (vm.currentMember.is_admin) {
                return true
            }

            var permission_code = "manage_" + vm.entityType.split('-').join('').toLowerCase();

            var haveAccess = false;

            vm.entity.object_permissions.forEach(function (item) {

                if (item.permission === permission_code && vm.currentMember.groups.indexOf(item.group) !== -1) {
                    haveAccess = true;
                }

            });

            return haveAccess;
        };

        vm.entityTypeSlug = function () {
            return vm.entityType.split('-').join(' ').capitalizeFirstLetter();
        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.manageAttrs = function (ev) {

            var entityType = {entityType: vm.entityType};
            if (vm.fromEntityType) {
                entityType = {entityType: vm.entityType, from: vm.fromEntityType};
            }
            $state.go('app.attributesManager', entityType);
            $mdDialog.hide();
        };

        vm.copy = function ($event) {

            var entity = JSON.parse(JSON.stringify(vm.entity));

            entity["user_code"] = vm.entity["user_code"] + '_copy';
            entity["name"] = vm.entity["name"] + '_copy';

            console.log('copy entity', entity);

            $mdDialog.show({
                controller: 'EntityViewerAddDialogController as vm',
                templateUrl: 'views/entity-viewer/entity-viewer-add-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    entityType: vm.entityType,
                    entity: entity
                }
            }).then(function (res) {

                if (res && res.res === 'agree') {

                    console.log('res', res);

                }

            });

            $mdDialog.hide();

        };

        vm.getFormLayout = function () {

            uiService.getEditLayout(vm.entityType).then(function (data) {

                if (data.results.length) {
                    vm.tabs = data.results[0].data;
                } else {
                    vm.tabs = uiService.getDefaultEditLayout(vm.entityType)[0].data;
                }

                vm.tabs = vm.tabs.map(function (item, index) {

                    item.index = index;

                    return item

                });

                vm.getAttributeTypes().then(function () {

                    entityViewerHelperService.transformItem(vm.entity, vm.attrs);

                    vm.generateAttributesFromLayoutFields();

                    vm.readyStatus.layout = true;
                    vm.readyStatus.attrs = true;

                    if (vm.entityType === 'instrument') {
                        vm.getInstrumentUserFields();
                    } else {
                        vm.readyStatus.userFields = true;
                    }

                    $scope.$apply();

                });


            });

        };

        vm.getItem = function (fromChild) {
            return new Promise(function (res, rej) {

                entityResolverService.getByKey(vm.entityType, vm.entityId).then(function (data) {

                    vm.entity = data;

                    vm.entity.$_isValid = true;
                    vm.readyStatus.entity = true;

                    // vm.readyStatus.permissions = true;

                    vm.loadPermissions();

                    vm.getFormLayout();

                    // Resolving promise to inform child about end of editor building
                    res();


                });

            });

        };

        vm.getAttributeTypes = function () {
            return attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
            });
        };

        vm.checkReadyStatus = function () {

            return vm.readyStatus.attrs && vm.readyStatus.entity && vm.readyStatus.permissions && vm.readyStatus.layout && vm.readyStatus.userFields;
        };

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

        vm.checkFieldRender = function (tab, row, field) {

            if (field.row === row) {
                if (field.type === 'field') {
                    return true;
                } else {

                    var spannedCols = [];
                    var itemsInRow = tab.layout.fields.filter(function (item) {
                        return item.row === row
                    });

                    itemsInRow.forEach(function (item) {

                        if (item.type === 'field' && item.colspan > 1) {
                            var columnsToSpan = item.column + item.colspan - 1;

                            for (var i = item.column; i < columnsToSpan; i = i + 1) {
                                spannedCols.push(i);
                            }

                        }

                    });

                    if (spannedCols.indexOf(field.column) !== -1) {
                        return false
                    }

                    return true;
                }
            }
            return false;

        };

        vm.checkViewState = function (tab) {

            if (tab.hasOwnProperty('enabled')) {
                if (tab.enabled.indexOf(vm.evAction) === -1) {
                    return false;
                }
            }

            return true;
        };

        vm.handleErrors = function ($event, data) {

            $mdDialog.show({
                controller: 'ValidationDialogController as vm',
                templateUrl: 'views/dialogs/validation-dialog-view.html',
                targetEvent: $event,
                locals: {
                    validationData: data
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            });

        };

        vm.updateEntityBeforeSave = function () {

            if (vm.entity.attributes) {

                vm.entity.attributes.forEach(function (attribute) {

                    var value_type = attribute.attribute_type_object.value_type;
                    var key = attribute.attribute_type_object.user_code;

                    if (value_type === 10) {
                        attribute.value_string = vm.entity[key];
                    }
                    if (value_type === 20) {
                        attribute.value_float = vm.entity[key];
                    }
                    if (value_type === 30) {
                        attribute.classifier = vm.entity[key];
                    }
                    if (value_type === 40) {
                        attribute.value_date = vm.entity[key];
                    }

                })

            }

            if (metaPermissionsService.getEntitiesWithDisabledPermissions().indexOf(vm.entityType) === -1) {
                vm.entity["user_object_permissions"] = [];
            }

            if (vm.members) {
                vm.members.forEach(function (member) {

                    if (member.objectPermissions && member.objectPermissions.manage == true) {
                        vm.entity["user_object_permissions"].push({
                            "member": member.id,
                            "permission": "manage_" + vm.entityType.split('-').join('') //TODO remove _vm.entityType
                        })
                    }

                    if (member.objectPermissions && member.objectPermissions.change == true) {
                        vm.entity["user_object_permissions"].push({
                            "member": member.id,
                            "permission": "change_" + vm.entityType.split('-').join('') //TODO remove _vm.entityType
                        })
                    }

                });
            }

            vm.entity["group_object_permissions"] = [];

            if (vm.groups) {
                vm.groups.forEach(function (group) {

                    if (group.objectPermissions && group.objectPermissions.manage == true) {
                        vm.entity["group_object_permissions"].push({
                            "group": group.id,
                            "permission": "manage_" + vm.entityType.split('-').join('')
                        })
                    }

                    if (group.objectPermissions && group.objectPermissions.change == true) {
                        vm.entity["group_object_permissions"].push({
                            "group": group.id,
                            "permission": "change_" + vm.entityType.split('-').join('')
                        })
                    }

                });
            }

        };

        vm.updateItem = function () {

            // TMP save method for instrument

            return new Promise(function (resolve) {

                vm.updateEntityBeforeSave();

                vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);

                if (vm.entity.$_isValid) {

                    var result = entityEditorHelper.removeNullFields(vm.entity);

                    entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                        resolve(data);

                    });

                }

            })

        };

        vm.delete = function ($event) {

            $mdDialog.show({
                controller: 'EntityViewerDeleteDialogController as vm',
                templateUrl: 'views/entity-viewer/entity-viewer-entity-delete-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                //clickOutsideToClose: false,
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    entity: vm.entity,
                    entityType: vm.entityType
                }
            }).then(function (res) {

                console.log('here', res);

                if (res.status === 'agree') {
                    $mdDialog.hide({res: 'agree', data: {action: 'delete'}});
                }

            })

        };

        vm.toggleEnableStatus = function ($event) {

            vm.entity.is_enabled = !vm.entity.is_enabled;


            entityResolverService.getByKey(vm.entityType, vm.entity.id).then(function (result) {

                result.is_enabled = vm.entity.is_enabled;

                entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                    console.log('enable/disable toggle success');

                    $scope.$apply();

                });
            })


        };

        vm.save = function ($event) {

            vm.updateEntityBeforeSave();

            vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);

            if (vm.entity.$_isValid) {

                var result = entityEditorHelper.removeNullFields(vm.entity);

                entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                    if (data.status === 400) {
                        vm.handleErrors($event, data);
                    } else {
                        $mdDialog.hide({res: 'agree', data: data});
                    }

                });

            }

        };

        vm.editLayout = function (ev) {

            $mdDialog.show({
                controller: 'EntityDataConstructorDialogController as vm',
                templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
                targetEvent: ev,
                preserveScope: true,
                multiple: true,
                locals: {
                    data: vm.dataConstructorData
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.readyStatus.attrs = false;
                    vm.readyStatus.entity = false;
                    vm.readyStatus.layout = false;

                    vm.getItem();


                    vm.layoutAttrs = layoutService.getLayoutAttrs();
                    vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

                }

            });

        };

        vm.getInstrumentUserFields = function () {

            uiService.getInstrumentFieldList().then(function (data) {

                console.log('data', data);
                console.log('vm.tabs', vm.tabs);

                data.results.forEach(function (userField) {

                    vm.tabs.forEach(function (tab) {

                        tab.layout.fields.forEach(function (field) {

                            if (field.attribute && field.attribute.key) {

                                if (field.attribute.key === userField.key) {

                                    console.log('here?', field);

                                    if (!field.options) {
                                        field.options = {};
                                    }

                                    field.options.fieldName = userField.name;
                                }

                            }

                        })

                    })

                });

                vm.readyStatus.userFields = true;

                $scope.$apply();

            })

        };

        vm.init = function () {

            vm.getItem();

        };

        vm.init();


        // Special case for split-panel
        $scope.splitPanelInit = function (entityType, entityId) {
            vm.entityType = entityType;
            vm.entityId = entityId;
        }

    }

}());