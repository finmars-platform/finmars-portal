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

    var complexTransactionService = require('../../services/transaction/complexTransactionService');

    var currencyPricingSchemeService = require('../../services/pricing/currencyPricingSchemeService');
    var instrumentPricingSchemeService = require('../../services/pricing/instrumentPricingSchemeService');


    module.exports = function ($scope, $mdDialog, $state, entityType, entityId) {

        var vm = this;

        vm.entityType = entityType;
        vm.entityId = entityId;

        vm.entity = {$_isValid: true};
        var dataConstructorLayout = {};
        var dcLayoutHasBeenFixed = false;

        vm.hasEnabledStatus = true;
        vm.entityStatus = '';

        if (vm.entityType === 'price-history' || vm.entityType === 'currency-history') {
            vm.hasEnabledStatus = false;
        }

        vm.readyStatus = {attributeTypes: false, permissions: false, entity: false, layout: false, userFields: false};

        vm.entityTabs = metaService.getEntityTabs(vm.entityType);

        vm.formIsValid = true;

        vm.dataConstructorData = {};

        vm.attributeTypes = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();
        vm.entityAttrs = [];

        vm.range = gridHelperService.range;

        vm.dataConstructorData = {entityType: vm.entityType};

        vm.fixedFieldsAttributes = [];
        vm.attributesLayout = [];
        vm.fixedAreaAttributesLayout = [];

        vm.currentMember = null;

        vm.hasEditPermission = false;
        vm.canManagePermissions = false;

        vm.attributeTypesByValueTypes = {}; // need for pricing tab

        var keysOfFixedFieldsAttrs = metaService.getEntityViewerFixedFieldsAttributes(vm.entityType);

        vm.rearrangeMdDialogActions = function () {
            var dialogWindowWidth = vm.dialogElemToResize.clientWidth;

            if (dialogWindowWidth < 805) {
                vm.dialogElemToResize.classList.add("two-rows-dialog-actions");
            } else {
                vm.dialogElemToResize.classList.remove("two-rows-dialog-actions");
            }
        };

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

                        for (i = 0; i < vm.attributeTypes.length; i = i + 1) {

                            if (field.key) {

                                if (field.key === vm.attributeTypes[i].user_code) {

                                    vm.attributeTypes[i].options = field.options;
                                    fieldResult = vm.attributeTypes[i];
                                    dAttrFound = true;
                                    break;

                                }

                            } else {

                                if (field.attribute.user_code) {

                                    if (field.attribute.user_code === vm.attributeTypes[i].user_code) {

                                        vm.attributeTypes[i].options = field.options;
                                        fieldResult = vm.attributeTypes[i];
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
            dcLayoutHasBeenFixed = false;

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
                dynamicAttrs: vm.attributeTypes,
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

                vm.entity.object_permissions.forEach(function (perm) {

                    if (perm.permission === "change_" + vm.entityType.split('-').join('')) {

                        if (vm.currentMember.groups.indexOf(perm.group) !== -1) {
                            vm.hasEditPermission = true;
                        }

                    }

                });

                if (vm.currentMember && vm.currentMember.is_admin) {
                    vm.hasEditPermission = true;
                    vm.canManagePermissions = true;
                }

                vm.readyStatus.permissions = true;
                $scope.$apply();
            });

        };

        vm.getGroupList = function () {

            return usersGroupService.getList().then(function (data) {

                vm.groups = data.results.filter(function (item) {

                    return item.role === 2;

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

                                    vm.canManagePermissions = true;

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
            });

        };

        vm.getCurrentMember = function () {

            return usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                $scope.$apply();

            });
        };

        vm.checkPermissions = function () {

            if (metaPermissionsService.getEntitiesWithDisabledPermissions().indexOf(vm.entityType) !== -1) {
                return false;
            }

            if (vm.currentMember && vm.currentMember.is_admin) {
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
            $mdDialog.hide({status: 'disagree'});
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

                if (data.results.length && data.results.length > 0 && data.results[0].data) {

                    dataConstructorLayout = JSON.parse(JSON.stringify(data.results[0]));

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

                if (vm.tabs.length && !vm.tabs[0].hasOwnProperty('tabOrder')) { // for old layouts
                    vm.tabs.forEach(function (tab, index) {
                        tab.tabOrder = index;
                    });
                }

                vm.getAttributeTypes().then(function () {

                    entityViewerHelperService.transformItem(vm.entity, vm.attributeTypes);

                    //vm.generateAttributesFromLayoutFields();
                    mapAttributesAndFixFieldsLayout();

                    vm.readyStatus.layout = true;
                    vm.readyStatus.attributeTypes = true;

                    if (vm.entityType === 'instrument') {
                        vm.getInstrumentUserFields();
                    } else {
                        vm.readyStatus.userFields = true;
                    }

                    vm.getEntityPricingSchemes();

                    $scope.$apply();

                });


            });

        };

        vm.getItem = function () {
            return new Promise(function (res, rej) {

                entityResolverService.getByKey(vm.entityType, vm.entityId).then(function (data) {

                    vm.entity = data;
                    console.log("fixed fields vm.entity", vm.entity);
                    vm.entity.$_isValid = true;
                    vm.readyStatus.entity = true;
                    // vm.readyStatus.permissions = true;

                    if (vm.entityType !== 'price-history' && vm.entityType !== 'currency-history') {

                        vm.loadPermissions();

                    } else {

                        vm.readyStatus.permissions = true;
                        vm.hasEditPermission = true;

                    }

                    vm.getFormLayout();

                    // Resolving promise to inform child about end of editor building
                    res();


                });

            });

        };

        vm.getAttributeTypes = function () {
            return attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attributeTypes = data.results;
            });
        };

        vm.checkReadyStatus = function () {

            return vm.readyStatus.attributeTypes && vm.readyStatus.entity && vm.readyStatus.permissions && vm.readyStatus.layout && vm.readyStatus.userFields;
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
                if (tab.enabled.indexOf(vm.evAction) === -1) {
                    return false;
                }
            }

            return true;
        };

        vm.handleErrors = function (data) {

            $mdDialog.show({
                controller: 'ValidationDialogController as vm',
                templateUrl: 'views/dialogs/validation-dialog-view.html',
                multiple: true,
                locals: {
                    validationData: {
                        errorData: data,
                        tableColumnsNames: ['Name of fields', 'Error Cause']
                    }
                }
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

            vm.entity.object_permissions = [];

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

        vm.updateItem = function () {

            // TMP save method for instrument

            return new Promise(function (resolve) {

                vm.updateEntityBeforeSave();

                vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attributeTypes);

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

        vm.toggleEnableStatus = function () {

            vm.entity.is_enabled = !vm.entity.is_enabled;


            entityResolverService.getByKey(vm.entityType, vm.entity.id).then(function (result) {

                result.is_enabled = vm.entity.is_enabled;

                entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                    console.log('enable/disable toggle success');
                    getEntityStatus();

                    $scope.$apply();

                });
            })


        };

        vm.entityStatusChanged = function () {

            entityResolverService.getByKey(vm.entityType, vm.entity.id).then(function (result) {

                if (vm.entityStatus === 'instrument') {

                    switch (vm.entityStatus) {
                        case 'active':
                            result.is_active = true;
                            result.is_enabled = true;
                            result.is_deleted = false;
                            vm.entity.is_active = true;
                            vm.entity.is_enabled = true;
                            vm.entity.is_deleted = false;
                            break;

                        case 'inactive':
                            result.is_active = false;
                            result.is_enabled = true;
                            result.is_deleted = false;
                            vm.entity.is_active = false;
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
                    }

                } else {

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
                    }

                }


                entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                    $scope.$apply();

                });

            });

        };

        var getEntityStatus = function () {

            if (vm.entityType === 'instrument') {

                vm.entityStatus = 'inactive';

                if (vm.entity.is_active) {
                    vm.entityStatus = 'active';
                }

                if (!vm.entity.is_enabled) {
                    vm.entityStatus = 'disabled';
                }

                if (vm.entity.is_deleted) {
                    vm.entityStatus = 'deleted';
                }

            } else {

                vm.entityStatus = 'enabled';

                if (!vm.entity.is_enabled) {
                    vm.entityStatus = 'disabled';
                }

                if (vm.entity.is_deleted) {
                    vm.entityStatus = 'deleted';
                }

            }

        };

        vm.save = function ($event) {

            vm.updateEntityBeforeSave();

            vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attributeTypes);

            var hasProhibitNegNums = entityEditorHelper.checkForNegNumsRestriction(vm.entity, vm.entityAttrs, [], vm.layoutAttrs);

            if (vm.entity.$_isValid) {

                if (hasProhibitNegNums.length === 0) {

                    var result = entityEditorHelper.removeNullFields(vm.entity);

                    if (dcLayoutHasBeenFixed) {
                        uiService.updateEditLayout(dataConstructorLayout.id, dataConstructorLayout);
                    }

                    entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                        if (data.status === 400) {
                            vm.handleErrors(data);
                        } else {
                            $mdDialog.hide({res: 'agree', data: data});
                        }

                    }).catch(function(data) {
                        vm.handleErrors(data);
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

        vm.editLayout = function (ev) {

            $mdDialog.show({
                controller: 'EntityDataConstructorDialogController as vm',
                templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: vm.dataConstructorData
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.readyStatus.attributeTypes = false;
                    vm.readyStatus.entity = false;
                    vm.readyStatus.layout = false;

                    vm.getItem();


                    vm.layoutAttrs = layoutService.getLayoutAttrs();
                    getEntityAttrs();

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

        vm.recalculatePermissions = function ($event) {

            console.log("Recalculate");


            vm.updateItem().then(function (value) {

                var config = {};

                // TODO make it recursive like transaction import

                complexTransactionService.recalculatePermissionTransaction(config).then(function (value) {

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true,
                        locals: {
                            info: {
                                title: 'Success',
                                description: "Transaction Permissions successfully recalculated"
                            }
                        }
                    });

                    console.log("Recalculate done");

                })
            })

        };

        vm.recalculateAccountPermissions = function ($event) {

            vm.updateItem().then(function (value) {

                entityResolverService.getList('account', {pageSize: 1000}).then(function (data) {

                    console.log('data', data);

                    var accountsWithPermissions = data.results.map(function (item) {

                        return {
                            id: item.id,
                            object_permissions: item.type_object.object_permissions.map(function (item) {

                                item.permission = item.permission.split('_')[0] + '_account';

                                return item

                            })
                        }

                    });

                    entityResolverService.updateBulk('account', accountsWithPermissions).then(function () {

                        $mdDialog.show({
                            controller: 'InfoDialogController as vm',
                            templateUrl: 'views/info-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: $event,
                            clickOutsideToClose: false,
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true,
                            multiple: true,
                            locals: {
                                info: {
                                    title: 'Success',
                                    description: "Accounts Permissions successfully updated"
                                }
                            }
                        });

                    })


                })

            });

        };

        vm.recalculateAccountWithTransactionPermissions = function ($event) {

            vm.updateItem().then(function (value) {

                entityResolverService.getList('account', {pageSize: 1000}).then(function (data) {

                    console.log('data', data);

                    var accountsWithPermissions = data.results.map(function (item) {

                        return {
                            id: item.id,
                            object_permissions: item.type_object.object_permissions.map(function (item) {

                                item.permission = item.permission.split('_')[0] + '_account';

                                return item

                            })
                        }

                    });

                    entityResolverService.updateBulk('account', accountsWithPermissions).then(function () {

                        complexTransactionService.recalculatePermissionTransaction().then(function (value) {

                            $mdDialog.show({
                                controller: 'InfoDialogController as vm',
                                templateUrl: 'views/info-dialog-view.html',
                                parent: angular.element(document.body),
                                targetEvent: $event,
                                clickOutsideToClose: false,
                                preserveScope: true,
                                autoWrap: true,
                                skipHide: true,
                                multiple: true,
                                locals: {
                                    info: {
                                        title: 'Success',
                                        description: "Accounts Permissions and Transaction Permissions successfully updated"
                                    }
                                }
                            });


                        })

                    })


                })

            });
        };

        vm.recalculateInstrumentsPermissions = function ($event) {


            vm.updateItem().then(function (value) {

                entityResolverService.getList('instrument', {pageSize: 1000}).then(function (data) {

                    console.log('data', data);

                    var instrumentsWithPermissions = data.results.map(function (item) {

                        return {
                            id: item.id,
                            object_permissions: item.instrument_type_object.object_permissions.map(function (item) {

                                item.permission = item.permission.split('_')[0] + '_instrument';

                                return item

                            })
                        }

                    });

                    entityResolverService.updateBulk('instrument', instrumentsWithPermissions).then(function () {

                        $mdDialog.show({
                            controller: 'InfoDialogController as vm',
                            templateUrl: 'views/info-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: $event,
                            clickOutsideToClose: false,
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true,
                            multiple: true,
                            locals: {
                                info: {
                                    title: 'Success',
                                    description: "Instrument Permissions successfully updated"
                                }
                            }
                        });

                    });

                });

            });


        };

        vm.editPricingScheme = function ($event, item) {

            if (vm.entityType === 'currency') {

                $mdDialog.show({
                    controller: 'CurrencyPricingSchemeEditDialogController as vm',
                    templateUrl: 'views/dialogs/pricing/currency-pricing-scheme-edit-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        data: {
                            item: item
                        }

                    }
                }).then(function (res) {

                    if (res.status === 'agree') {
                        // Do what?
                    }

                })

            } else {

                $mdDialog.show({
                    controller: 'InstrumentPricingSchemeEditDialogController as vm',
                    templateUrl: 'views/dialogs/pricing/instrument-pricing-scheme-edit-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        data: {
                            item: item
                        }

                    }
                }).then(function (res) {

                    if (res.status === 'agree') {
                        // Do what?
                    }

                })

            }

        };

        vm.switchPricingPolicyParameter = function ($event, item) {

            if (item.switchState === 'default_value') {
                item.switchState = 'attribute_key'
            } else {
                item.switchState = 'default_value'
            }

            item.default_value = null;
            item.attribute_key = null;

        };

        vm.applyPricingToAllInstruments = function ($event, item) {

            console.log('vm.applyPricingToAllInstruments', item);

        };

        vm.generateCurrencyAttributeTypesByValueTypes = function () {

            vm.attributeTypesByValueTypes = {

                10: [

                ],
                20: [

                ],
                40: [

                ]

            };

            vm.attributeTypesByValueTypes[10] = vm.attributeTypesByValueTypes[10].concat(vm.attributeTypes.filter(function (item) {
                return item.value_type === 10;
            }).map(function (item) {

                return {
                    name: item.name,
                    user_code: 'attributes.' + item.user_code
                }

            }));

            vm.attributeTypesByValueTypes[20] = vm.attributeTypesByValueTypes[20].concat(vm.attributeTypes.filter(function (item) {
                return item.value_type === 20;
            }).map(function (item) {

                return {
                    name: item.name,
                    user_code: 'attributes.' + item.user_code
                }

            }));

            vm.attributeTypesByValueTypes[40] = vm.attributeTypesByValueTypes[40].concat(vm.attributeTypes.filter(function (item) {
                return item.value_type === 40;
            }).map(function (item) {

                return {
                    name: item.name,
                    user_code: 'attributes.' + item.user_code
                }

            }));

            console.log('vm.attributeTypesByValueTypes', vm.attributeTypesByValueTypes);


        };

        vm.getCurrencyPricingSchemes = function () {

            currencyPricingSchemeService.getList().then(function (data) {

                vm.currencyPricingSchemes = data.results;

                vm.generateCurrencyAttributeTypesByValueTypes();

                $scope.$apply();

            })

        };

        vm.generateInstrumentAttributeTypesByValueTypes = function () {

            vm.attributeTypesByValueTypes = {

                10: [
                    {
                        name: 'Reference For Pricing',
                        user_code: 'reference_for_pricing'
                    }
                ],
                20: [
                    {
                        name: 'Default Price',
                        user_code: 'default_price'
                    }
                ],
                40: [
                    {
                        name: 'Maturity Date',
                        user_code: 'maturity_date'
                    }
                ]

            };

            vm.attributeTypesByValueTypes[10] = vm.attributeTypesByValueTypes[10].concat(vm.attributeTypes.filter(function (item) {
                return item.value_type === 10;
            }).map(function (item) {

                return {
                    name: item.name,
                    user_code: 'attributes.' + item.user_code
                }

            }));

            vm.attributeTypesByValueTypes[20] = vm.attributeTypesByValueTypes[20].concat(vm.attributeTypes.filter(function (item) {
                return item.value_type === 20;
            }).map(function (item) {

                return {
                    name: item.name,
                    user_code: 'attributes.' + item.user_code
                }

            }));

            vm.attributeTypesByValueTypes[40] = vm.attributeTypesByValueTypes[40].concat(vm.attributeTypes.filter(function (item) {
                return item.value_type === 40;
            }).map(function (item) {

                return {
                    name: item.name,
                    user_code: 'attributes.' + item.user_code
                }

            }));

            console.log('vm.attributeTypesByValueTypes', vm.attributeTypesByValueTypes);


        };

        vm.getInstrumentPricingSchemes = function () {

            instrumentPricingSchemeService.getList().then(function (data) {

                vm.instrumentPricingSchemes = data.results;

                vm.generateInstrumentAttributeTypesByValueTypes();

                console.log('instrumentPricingSchemes', vm.instrumentPricingSchemes);

                $scope.$apply();

            })

        };

        vm.getEntityPricingSchemes = function () {

            if (vm.entityType === 'currency') {
                vm.getCurrencyPricingSchemes();
            }

            if (vm.entityType === 'instrument') {
                vm.getInstrumentPricingSchemes();
            }

            if (vm.entityType === 'instrument-type') {
                vm.getInstrumentPricingSchemes();
            }

        };

        vm.pricingSchemeChange = function ($event, item) {

            console.log('pricingSchemeChange.item', item);

            item.pricing_scheme_object = null;
            item.default_value = null;
            item.attribute_key = null;
            item.data = null;

            if (vm.entityType === 'instrument' || vm.entityType === 'instrument-type') {

                vm.instrumentPricingSchemes.forEach(function (scheme) {

                    if (scheme.id === item.pricing_scheme) {

                        item.pricing_scheme_object = scheme;
                    }

                })

            }

            if (vm.entityType === 'currency') {

                vm.currencyPricingSchemes.forEach(function (scheme) {

                    if (scheme.id === item.pricing_scheme) {

                        item.pricing_scheme_object = scheme;
                    }

                })

            }

            vm.entity.pricing_policies = vm.entity.pricing_policies.map(function (policy) {

                if (policy.id === item.id) {
                    return Object.assign({}, item);
                }

                return policy

            })

        };

        vm.openPricingMultipleParametersDialog = function ($event, item) {

            $mdDialog.show({
                controller: 'PricingMultipleParametersDialogController as vm',
                templateUrl: 'views/dialogs/pricing/pricing-multiple-parameter-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        item: item,
                        entityType: vm.entityType,
                        attributeTypes: vm.attributeTypes
                    }

                }
            }).then(function (res) {

                if (res.status === 'agree') {
                    item.data = res.data.item.data
                }

            })

        };

        vm.init = function () {
            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.evEditorDialogElemToResize');
            }, 100);

            getEntityAttrs();

            vm.getItem().then(function () {

                getEntityStatus();



            });
        };

        vm.init();


        // Special case for split-panel
        $scope.splitPanelInit = function (entityType, entityId) {
            vm.entityType = entityType;
            vm.entityId = entityId;
        }

    }

}());