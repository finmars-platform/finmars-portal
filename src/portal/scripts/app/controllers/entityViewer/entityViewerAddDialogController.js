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
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var metaPermissionsService = require('../../services/metaPermissionsService');

    var uiService = require('../../services/uiService');

    var entityEditorHelper = require('../../helpers/entity-editor.helper');

    module.exports = function ($scope, $mdDialog, $state, entityType, entity) {

        console.log('EntityViewerAddDialog entityType, entity', entityType, entity);

        var vm = this;
        vm.readyStatus = {content: false, entity: true, permissions: true};
        vm.entityType = entityType;

        vm.entity = {$_isValid: true};
        var dataConstructorLayout = {};
        var dcLayoutHasBeenFixed = false;

        vm.hasEnabledStatus = true;
        vm.entityStatus = '';

        if (vm.entityType === 'price-history' || vm.entityType === 'currency-history') {
            vm.hasEnabledStatus = false;
        }

        if (Object.keys(entity).length) { // make copy option
            vm.entity = entity;
        }

        vm.entityTabs = metaService.getEntityTabs(vm.entityType);

        vm.attrs = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();
        vm.entityAttrs = [];

        vm.formIsValid = true;
        vm.range = gridHelperService.range;

        vm.fixedFieldsAttributes = [];
        vm.attributesLayout = [];
        vm.fixedAreaAttributesLayout = [];

        vm.isInheritRights = false;

        vm.lastAccountType = null;
        vm.lastInstrumentType = null;

        vm.canManagePermissions = false;

        var keysOfFixedFieldsAttrs = metaService.getEntityViewerFixedFieldsAttributes(vm.entityType);

        var getEntityAttrs = function () {
            vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];
            vm.fixedFieldsAttributes = [];

            var i, a;
            for (i = 0; i < keysOfFixedFieldsAttrs.length; i++) {
                var attrKey = keysOfFixedFieldsAttrs[i];

                if (!attrKey) {

                    vm.fixedFieldsAttributes.push(null);

                } else {

                    for (a = 0; a < vm.entityAttrs.length; a++) {
                        if (vm.entityAttrs[a].key === attrKey) {

                            if (vm.entityAttrs[a]) {
                                var entityAttr = JSON.parse(JSON.stringify(vm.entityAttrs[a]));
                            }

                            vm.fixedFieldsAttributes.push(entityAttr);

                            break;
                        }
                    }

                }
            }

        };

        /*var getMatchForLayoutFields = function (tab, tabIndex, fieldsToEmptyList, tabResult) {

            var i, l, e;

            tab.layout.fields.forEach(function (field, fieldIndex) {

                var fieldResult = {};

                if (field && field.type === 'field') {

                    if (field.attribute_class === 'attr') {

                        var dAttrFound = false;

                        for (i = 0; i < vm.attrs.length; i = i + 1) {

                            if (field.key) {

                                if (field.key === vm.attrs[i].user_code) {

                                    vm.attrs[i].options = field.options;
                                    fieldResult = vm.attrs[i];
                                    dAttrFound = true;
                                    break;

                                }

                            } else {

                                if (field.attribute.user_code) {

                                    if (field.attribute.user_code === vm.attrs[i].user_code) {

                                        vm.attrs[i].options = field.options;
                                        fieldResult = vm.attrs[i];
                                        dAttrFound = true;
                                        break;

                                    }

                                }

                            }

                        }

                        if (!dAttrFound) {
                            var fieldPath = {
                                tabIndex: tabIndex,
                                fieldIndex: fieldIndex
                            };

                            fieldsToEmptyList.push(fieldPath);
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

        };

        vm.generateAttributesFromLayoutFields = function () {

            vm.attributesLayout = [];
            var fieldsToEmptyList = [];

            var tabResult;

            vm.tabs.forEach(function (tab, tabIndex) {

                tabResult = [];

                getMatchForLayoutFields(tab, tabIndex, fieldsToEmptyList, tabResult);

                vm.attributesLayout.push(tabResult);

            });

            if (vm.fixedArea && vm.fixedArea.isActive) {

                vm.fixedAreaAttributesLayout = [];

                getMatchForLayoutFields(vm.fixedArea, 'fixedArea', fieldsToEmptyList, vm.fixedAreaAttributesLayout);

            }


            // Empty sockets that have no attribute that matches them
            fieldsToEmptyList.forEach(function (fieldPath) {

                if (fieldPath.tabIndex === 'fixedArea') {
                    var dcLayoutFields = vm.fixedArea.layout.fields;
                    var layoutFieldsToSave = dataConstructorLayout.data.fixedArea.layout.fields;
                } else {
                    var dcLayoutFields = vm.tabs[fieldPath.tabIndex].layout.fields;

                    // for old layouts compatibility
                    if (Array.isArray(dataConstructorLayout.data)) {
                        var layoutFieldsToSave = dataConstructorLayout.data[fieldPath.tabIndex].layout.fields;
                    } else {
                        var layoutFieldsToSave = dataConstructorLayout.data.tabs[fieldPath.tabIndex].layout.fields;
                    }

                }

                var fieldToEmptyColumn = dcLayoutFields[fieldPath.fieldIndex].column;
                var fieldToEmptyRow = dcLayoutFields[fieldPath.fieldIndex].row;

                dcLayoutFields[fieldPath.fieldIndex] = { // removing from view
                    colspan: 1,
                    column: fieldToEmptyColumn,
                    editMode: false,
                    row: fieldToEmptyRow,
                    type: 'empty'
                };

                layoutFieldsToSave[fieldPath.fieldIndex] = { // removing from layout copy for saving
                    colspan: 1,
                    column: fieldToEmptyColumn,
                    editMode: false,
                    row: fieldToEmptyRow,
                    type: 'empty'
                };

            });

            if (fieldsToEmptyList.length) {
                dcLayoutHasBeenFixed = true;
            }
            // < Empty sockets that have no attribute that matches them >
        };*/

        var fixFieldsLayoutWithMissingSockets = function () {

            var socketsHasBeenAddedToTabs = entityEditorHelper.fixCustomTabs(vm.tabs, dataConstructorLayout);

            if (vm.fixedArea && vm.fixedArea.isActive) {
                var socketsHasBeenAddedToFixedArea = entityEditorHelper.fixCustomTabs(vm.fixedArea, dataConstructorLayout);
            }

            if (socketsHasBeenAddedToTabs || socketsHasBeenAddedToFixedArea) {
                dcLayoutHasBeenFixed = true;
            }

        };

        var mapAttributesToLayoutFields = function () {

            var attributes = {
                entityAttrs: vm.entityAttrs,
                dynamicAttrs: vm.attrs,
                layoutAttrs: vm.layoutAttrs
            };

            var attributesLayoutData = entityEditorHelper.generateAttributesFromLayoutFields(vm.tabs, attributes, dataConstructorLayout, true);

            vm.attributesLayout = attributesLayoutData.attributesLayout;

            if (vm.fixedArea && vm.fixedArea.isActive) {
                var fixedAreaAttributesLayoutData = entityEditorHelper.generateAttributesFromLayoutFields(vm.fixedArea, attributes, dataConstructorLayout, true);

                vm.fixedAreaAttributesLayout = fixedAreaAttributesLayoutData.attributesLayout;
            }

            if (attributesLayoutData.dcLayoutHasBeenFixed || (fixedAreaAttributesLayoutData && fixedAreaAttributesLayoutData.dcLayoutHasBeenFixed)) {
                dcLayoutHasBeenFixed = true;
            }

        };

        var mapAttributesAndFixFieldsLayout = function () {
            dcLayoutHasBeenFixed = false;

            fixFieldsLayoutWithMissingSockets();
            mapAttributesToLayoutFields();
        };


        vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getCurrentMember());
            promises.push(vm.getGroupList());

            Promise.all(promises).then(function (data) {

                vm.readyStatus.permissions = true;

                vm.setPermissionsDefaults();

                if (vm.entityType === 'account' || vm.entityType === 'instrument') {

                    vm.checkInheritRight();

                }

                if (vm.currentMember && vm.currentMember.is_admin) {
                    vm.canManagePermissions = true;
                }


                $scope.$apply();

            });

        };

        vm.getCurrentMember = function () {

            return usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                $scope.$apply();

            });
        };

        vm.getGroupList = function () {

            return usersGroupService.getList().then(function (data) {

                vm.groups = data.results.filter(function (item) {

                    return item.role === 2;

                });

            });

        };

        vm.setPermissionsDefaults = function () {

            var contentType = metaContentTypesService.findContentTypeByEntity(vm.entityType);
            var table;
            var isCreator;

            // console.log('vm.groups', vm.groups);
            // console.log('vm.currentMember.groups', vm.currentMember.groups);



            vm.groups.forEach(function (group) {

                if (group.permission_table && group.permission_table.data) {

                    table = group.permission_table.data.find(function (item) {
                        return item.content_type === contentType
                    }).data;

                    isCreator = vm.currentMember.groups.indexOf(group.id) !== -1;

                    group.objectPermissions = {};

                    if (isCreator) {

                        if (table.creator_manage) {
                            group.objectPermissions.manage = true;

                            vm.canManagePermissions  = true;
                        }

                        if (table.creator_change) {
                            group.objectPermissions.change = true;
                        }

                        if (table.creator_view) {
                            group.objectPermissions.view = true;
                        }


                    } else {

                        if (table.other_manage) {
                            group.objectPermissions.manage = true;

                            vm.canManagePermissions  = true;
                        }

                        if (table.other_change) {
                            group.objectPermissions.change = true;
                        }

                        if (table.other_view) {
                            group.objectPermissions.view = true;
                        }


                    }

                }


            });

        };

        vm.checkInheritRight = function () {

            var contentType = metaContentTypesService.findContentTypeByEntity(vm.entityType);
            var table;

            vm.groups.forEach(function (group) {

                if (vm.currentMember.groups.indexOf(group.id) !== -1) {

                    if (group.permission_table && group.permission_table.data) {

                        table = group.permission_table.data.find(function (item) {
                            return item.content_type === contentType
                        }).data;

                        console.log(' checkInheritRight table', table);

                        if (table.inherit_rights) {
                            vm.isInheritRights = true;
                        }

                    }

                }
            })

        };

        vm.setInheritedPermissions = function () {

            console.log('setInheritedPermissions');

            return new Promise(function (resolve, reject) {

                if (vm.entityType === 'instrument') {

                    console.log('vm.entity', vm.entity);

                    entityResolverService.getByKey('instrument-type', vm.entity.instrument_type).then(function (data) {

                        vm.entity.object_permissions = data.object_permissions.map(function (item) {

                            var result = Object.assign({}, item);

                            result.permission = item.permission.split('_')[0] + '_instrument';

                            return result

                        });

                        console.log('vm.entityPermissions', vm.entity.object_permissions);

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
                                        if (permission.permission === "view_" + vm.entityType.split('-').join('')) {
                                            group.objectPermissions.view = true;
                                        }
                                    }
                                })
                            }

                        });

                        console.log('vm.groups', vm.groups);

                        $scope.$apply();

                    })

                }

                if (vm.entityType === 'account') {

                    entityResolverService.getByKey('account-type', vm.entity.type).then(function (data) {

                        vm.entity.object_permissions = data.object_permissions.map(function (item) {

                            var result = Object.assign({}, item);

                            result.permission = item.permission.split('_')[0] + '_account';

                            return result

                        });

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
                                        if (permission.permission === "view_" + vm.entityType.split('-').join('')) {
                                            group.objectPermissions.view = true;
                                        }
                                    }
                                })
                            }

                        });

                        $scope.$apply();

                    })


                }

            })

        };

        vm.entityTypeSlug = function () {
            return vm.entityType.split('-').join(' ').capitalizeFirstLetter();
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.editLayout = function (ev) {

            $mdDialog.show({
                controller: 'EntityDataConstructorDialogController as vm',
                templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        entityType: vm.entityType
                    }
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    // vm.readyStatus.entity = false;
                    vm.readyStatus.content = false;

                    vm.init();

                    vm.layoutAttrs = layoutService.getLayoutAttrs();
                    getEntityAttrs();

                }

            });

        };

        vm.manageAttrs = function (ev) {

            var entityAddress = {entityType: vm.entityType};
            $state.go('app.attributesManager', entityAddress);
            $mdDialog.hide();

        };


        vm.getFormLayout = function () {

            uiService.getEditLayout(vm.entityType).then(function (data) {

                if (data.results.length && data.results.length > 0 && data.results[0].data) {

                    dataConstructorLayout = data.results[0];

                    if (Array.isArray(data.results[0].data)) {
                        vm.tabs = data.results[0].data;
                    } else {
                        vm.tabs = data.results[0].data.tabs;
                        vm.fixedArea = data.results[0].data.fixedArea;
                    }

                } else {
                    vm.tabs = uiService.getDefaultEditLayout(vm.entityType)[0].data.tabs;
                    vm.fixedArea = uiService.getDefaultEditLayout(vm.entityType)[0].data.fixedArea;
                }

                if (vm.tabs.length && !vm.tabs[0].hasOwnProperty('tabOrder')) {
                    vm.tabs.forEach(function (tab, index) {
                        tab.tabOrder = index;
                    });
                }

                vm.getAttributeTypes().then(function (value) {

                    entityViewerHelperService.transformItem(vm.entity, vm.attrs);

                    //vm.generateAttributesFromLayoutFields();

                    mapAttributesAndFixFieldsLayout();

                    vm.readyStatus.content = true;
                    vm.readyStatus.entity = true;
                    // vm.readyStatus.permissions = true;

                    $scope.$apply();

                });

            });
        };

        vm.getAttributeTypes = function () {
            return attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
            });
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.content && vm.readyStatus.entity && vm.readyStatus.permissions
        };

        vm.bindFlex = function (tab, field) {
            /*var totalColspans = 0;
            var i;
            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row === row) {
                    totalColspans = totalColspans + tab.layout.fields[i].colspan;
                }
            }*/
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

                            for (var i = item.column; i <= columnsToSpan; i = i + 1) {
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
                if (tab.enabled.indexOf(vm.evAction) == -1) {
                    return false;
                }
            }

            return true;
        };

        vm.updateEntityBeforeSave = function () {

            console.log('updateEntityBeforeSave vm.entity', vm.entity);


            if (metaService.getEntitiesWithoutDynAttrsList().indexOf(vm.entityType) === -1) {

                vm.entity.attributes = [];

                vm.attrs.forEach(function (attributeType) {

                    var value = vm.entity[attributeType.user_code];

                    vm.entity.attributes.push(entityEditorHelper.appendAttribute(attributeType, value));

                });
            }

            vm.entity.object_permissions = [];
            console.log('vm.groups', vm.groups);

            if (vm.groups) {
                vm.groups.forEach(function (group) {

                    if (group.objectPermissions && group.objectPermissions.manage === true) {
                        vm.entity.object_permissions.push({
                            member: null,
                            group: group.id,
                            permission: "manage_" + vm.entityType.split('-').join('')
                        })
                    }

                    if (group.objectPermissions && group.objectPermissions.change === true) {
                        vm.entity.object_permissions.push({
                            member: null,
                            group: group.id,
                            permission: "change_" + vm.entityType.split('-').join('')
                        })
                    }
                    if (group.objectPermissions && group.objectPermissions.view === true) {
                        vm.entity.object_permissions.push({
                            member: null,
                            group: group.id,
                            permission: "view_" + vm.entityType.split('-').join('')
                        })
                    }

                });
            }

        };

        /*vm.entityStatusChanged = function () {

            entityResolverService.getByKey(vm.entityType, vm.entity.id).then(function (result) {

                switch (vm.entityStatus) {
                    case 'enabled':
                        result.is_enabled = true;
                        result.is_deleted = false;
                        vm.entity.is_enabled = true;
                        vm.entity.is_deleted = false;
                        break;

                    case 'disabled':
                        result.is_enabled = false;
                        result.is_deleted = false;
                        vm.entity.is_enabled = false;
                        vm.entity.is_deleted = false;
                        break;

                    case 'deleted':
                        result.is_deleted = true;
                        vm.entity.is_deleted = true;
                        break;

                    case 'active':
                        break;

                    case 'inactive':
                        break;
                }

                entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                    $scope.$apply();

                });

            });

        };

        var getEntityStatus = function () {

            vm.entityStatus = 'disabled';

            if (vm.entity.is_enabled) {
                vm.entityStatus = 'enabled';
            }

            if (vm.entity.is_deleted) {
                vm.entityStatus = 'deleted';
            }

        };*/

        vm.save = function ($event) {

            vm.updateEntityBeforeSave();

            vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);
            console.log('vm.entity before save', vm.entity);

            var hasProhibitNegNums = entityEditorHelper.checkForNegNumsRestriction(vm.entity, vm.entityAttrs, [], vm.layoutAttrs);

            if (vm.entity.$_isValid) {

                if (hasProhibitNegNums.length === 0) {

                    var resultEntity = entityEditorHelper.removeNullFields(vm.entity);

                    console.log('resultEntity', resultEntity);

                    if (dcLayoutHasBeenFixed) {
                        uiService.updateEditLayout(dataConstructorLayout.id, dataConstructorLayout);
                    }

                    entityResolverService.create(vm.entityType, resultEntity).then(function (data) {

                        $mdDialog.hide({res: 'agree', data: data});

                    }).catch(function (data) {

                        $mdDialog.show({
                            controller: 'ValidationDialogController as vm',
                            templateUrl: 'views/dialogs/validation-dialog-view.html',
                            targetEvent: $event,
                            parent: angular.element(document.body),
                            locals: {
                                validationData: data
                            },
                            preserveScope: true,
                            multiple: true,
                            autoWrap: true,
                            skipHide: true
                        })

                    });

                } else {

                    var warningDescription = '<p>Next fields should have positive number value to proceed:';

                    hasProhibitNegNums.forEach(function (field) {
                        warningDescription = warningDescription + '<br>' + field;
                    });

                    warningDescription = warningDescription + '</p>';

                    $mdDialog.show({
                        controller: "WarningDialogController as vm",
                        templateUrl: "views/warning-dialog-view.html",
                        multiple: true,
                        clickOutsideToClose: false,
                        locals: {
                            warning: {
                                title: "Warning",
                                description: warningDescription,
                                actionsButtons: [
                                    {
                                        name: "CLOSE",
                                        response: {status: 'disagree'}
                                    }
                                ]
                            }
                        }

                    });

                }

            }

        };

        vm.entityChange = function () {

            console.log("entityChange");

            if (vm.lastAccountType !== vm.entity.type) {
                vm.lastAccountType = vm.entity.type;

                if (vm.isInheritRights && vm.entity.type) {
                    vm.setInheritedPermissions();
                }
            }

            if (vm.lastInstrumentType !== vm.entity.instrument_type) {
                vm.lastInstrumentType = vm.entity.instrument_type;

                if (vm.isInheritRights && vm.entity.instrument_type) {
                    vm.setInheritedPermissions();
                }
            }


        };

        vm.init = function () {
            getEntityAttrs();
            vm.getFormLayout();


            if (vm.entityType === 'price-history' || vm.entityType === 'currency-history') {
                vm.readyStatus.permissions = true;
            } else {
                vm.loadPermissions();
            }


        };

        vm.init();

    }

}());