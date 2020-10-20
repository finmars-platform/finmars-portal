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
    var evEditorEvents = require('../../services/ev-editor/entityViewerEditorEvents')

    var gridHelperService = require('../../services/gridHelperService');
    var entityViewerHelperService = require('../../services/entityViewerHelperService');

    var EntityViewerEditorDataService = require('../../services/ev-editor/entityViewerEditorDataService');
    var EntityViewerEditorEventService = require('../../services/ev-editor/entityViewerEditorEventService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var metaPermissionsService = require('../../services/metaPermissionsService');
    var tooltipsService = require('../../services/tooltipsService');
    var colorPalettesService = require('../../services/colorPalettesService');

    var uiService = require('../../services/uiService');

    var entityEditorHelper = require('../../helpers/entity-editor.helper');

    var currencyPricingSchemeService = require('../../services/pricing/currencyPricingSchemeService');
    var instrumentPricingSchemeService = require('../../services/pricing/instrumentPricingSchemeService');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    module.exports = function entityViewerAddDialogController($scope, $mdDialog, $state, entityType, entity, data) {

        console.log('EntityViewerAddDialog entityType, entity', entityType, entity);

        var vm = this;

        vm.processing = false;

        vm.readyStatus = {content: false, entity: true, permissions: true};
        vm.entityType = entityType;

        vm.entity = {$_isValid: true};
        var dataConstructorLayout = {};
        var dcLayoutHasBeenFixed = false;

        vm.hasEnabledStatus = true;
        vm.entityStatus = '';
        vm.evEditorEvent = null;

        if (vm.entityType === 'price-history' || vm.entityType === 'currency-history') {
            vm.hasEnabledStatus = false;
        }

        if (Object.keys(entity).length) { // make copy option
            vm.entity = entity;
        }

        vm.entityTabs = metaService.getEntityTabs(vm.entityType);

        vm.attributeTypes = [];
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

        vm.attributeTypesByValueTypes = {}; // need for pricing;

        vm.currencies = []; // need for instrument pricing tab;

        var keysOfFixedFieldsAttrs = metaService.getEntityViewerFixedFieldsAttributes(vm.entityType);

        var tabsWithErrors = {};
        var errorFieldsList = [];
        var contentType = metaContentTypesService.findContentTypeByEntity(vm.entityType, 'ui');

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

        vm.getCurrencies = function () {

            entityResolverService.getListLight('currency', {pageSize: 1000}).then(function (data) {

                vm.currencies = data.results;

                $scope.$apply();

            })

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
            promises.push(vm.getCurrentMasterUser());
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

        vm.getCurrentMasterUser = function () {

            return usersService.getCurrentMasterUser().then(function (data) {

                vm.currentMasterUser = data;
                vm.system_currency = data.system_currency;

                $scope.$apply();

            })

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

                            vm.canManagePermissions = true;
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

                            vm.canManagePermissions = true;
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

        vm.setInheritedPricing = function () {

            return new Promise(function (resolve, reject) {

                if (vm.entityType === 'instrument') {

                    console.log('vm.entity', vm.entity);

                    entityResolverService.getByKey('instrument-type', vm.entity.instrument_type).then(function (data) {

                        console.log("get instrument type ", data);

                        vm.entity.pricing_policies = data.pricing_policies.map(function (policy) {

                            var item = Object.assign({}, policy);

                            delete item.id;
                            delete item.overwrite_default_parameters;

                            return item;

                        });

                        $scope.$apply();

                    })

                }

            });

        };

        vm.entityTypeSlug = function () {
            return vm.entityType.split('-').join(' ').capitalizeFirstLetter();
        };

        vm.onNameInputBlur = function () {

            if (vm.entity.name && !vm.entity.short_name) {
                var entityName = vm.entity.name;
                vm.entity.short_name = entityName;

                $scope.$apply();
            }

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

            /*var entityAddress = {entityType: vm.entityType};
            $state.go('app.attributesManager', entityAddress);
            $mdDialog.hide();*/

            $mdDialog.show({
                controller: 'AttributesManagerDialogController as vm',
                templateUrl: 'views/dialogs/attributes-manager-dialog-view.html',
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        entityType: vm.entityType
                    }
                }
            });

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

                    entityViewerHelperService.transformItem(vm.entity, vm.attributeTypes);
                    //vm.generateAttributesFromLayoutFields();
                    vm.getEntityPricingSchemes();

                    mapAttributesAndFixFieldsLayout();

                    vm.readyStatus.content = true;
                    vm.readyStatus.entity = true;
                    // vm.readyStatus.permissions = true;

                    console.log("vm.entity", vm.entity);

                    $scope.$apply();

                });

            });
        };

        vm.getAttributeTypes = function () {
            return attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attributeTypes = data.results;
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

                vm.attributeTypes.forEach(function (attributeType) {

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

            var errors = entityEditorHelper.validateEntityFields(vm.entity,
                vm.entityType,
                vm.tabs,
                keysOfFixedFieldsAttrs,
                vm.entityAttrs,
                vm.attributeTypes,
                []);

            if (errors.length) {

                tabsWithErrors = {};

                errors.forEach(function (errorObj) {

                    if (errorObj.locationData &&
                        errorObj.locationData.type === 'tab') {

                        var tabName = errorObj.locationData.name.toLowerCase();

                        var selectorString = ".tab-name-elem[data-tab-name='" + tabName + "']";

                        var tabNameElem = document.querySelector(selectorString);

                        tabNameElem.classList.add('error-tab');

                        if (!tabsWithErrors.hasOwnProperty(tabName)) {
                            tabsWithErrors[tabName] = [errorObj.key];

                        } else if (tabsWithErrors[tabName].indexOf(errorObj.key) < 0) {
                            tabsWithErrors[tabName].push(errorObj.key);

                        }

                        errorFieldsList.push(errorObj.key);


                    }

                });

                vm.evEditorEventService.dispatchEvent(evEditorEvents.MARK_FIELDS_WITH_ERRORS);
                //vm.evEditorEvent = {key: 'mark_not_valid_fields'};

                $mdDialog.show({
                    controller: 'EvAddEditValidationDialogController as vm',
                    templateUrl: 'views/dialogs/ev-add-edit-validation-dialog-view.html',
                    targetEvent: $event,
                    multiple: true,
                    locals: {
                        data: {
                            errorsList: errors
                        }
                    }
                })

            } else {

                // var resultEntity = entityEditorHelper.removeNullFields(vm.entity);
                var resultEntity = entityEditorHelper.clearEntityBeforeSave(vm.entity, vm.entityType);

                console.log('resultEntity', resultEntity);

                if (dcLayoutHasBeenFixed) {
                    uiService.updateEditLayout(dataConstructorLayout.id, dataConstructorLayout);
                }

                vm.processing = true;

                entityResolverService.create(vm.entityType, resultEntity).then(function (data) {

                    vm.processing = false;

                    var entityTypeVerbose = vm.entityType.split('-').join(' ').capitalizeFirstLetter();

                    toastNotificationService.success(entityTypeVerbose + " " + vm.entity.name + ' was successfully created');

                    $mdDialog.hide({res: 'agree', data: data});

                }).catch(function (data) {

                    vm.processing = false;

                    $mdDialog.show({
                        controller: 'ValidationDialogController as vm',
                        templateUrl: 'views/dialogs/validation-dialog-view.html',
                        targetEvent: $event,
                        parent: angular.element(document.body),
                        multiple: true,
                        locals: {
                            validationData: {
                                errorData: data,
                                tableColumnsNames: ['Name of fields', 'Error Cause']
                            },

                        }
                    })

                });

            }

            /*vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attributeTypes);

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
                            multiple: true,
                            locals: {
                                validationData: {
                                    errorData: data,
                                    tableColumnsNames: ['Name of fields', 'Error Cause']
                                },

                            }
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

            }*/

        };

        vm.entityChange = function (fieldKey) {

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

                vm.setInheritedPricing();
            }

            if (fieldKey) {

                var attributes = {
                    entityAttrs: vm.entityAttrs,
                    attrsTypes: vm.attributeTypes
                }

                entityEditorHelper.checkTabsForErrorFields(fieldKey, errorFieldsList, tabsWithErrors,
                                                           attributes,
                                                           vm.entity, vm.entityType, vm.tabs);

                /*var fieldIndex = errorFieldsList.indexOf(fieldKey);

                if (fieldIndex > -1) {

                    var entityAttrs = [];
                    var attrsTypes = [];

                    var i;
                    if (fieldType === 'entity-attribute') {
                        for (i = 0; i < vm.entityAttrs.length; i++) {

                            if (vm.entityAttrs[i].key === fieldKey) {

                                entityAttrs.push(vm.entityAttrs[i]);
                                break;

                            }

                        }

                    } else if (fieldType === 'dynamic-attribute') {

                        for (i = 0; i < vm.attributeTypes.length; i++) {
                            if (vm.attributeTypes[i].user_code === fieldKey) {

                                attrsTypes.push(vm.attributeTypes[i]);
                                break;

                            }
                        }

                    }

                    var errors = entityEditorHelper.validateEntityFields(vm.entity,
                        vm.entityType,
                        vm.tabs,
                        [], entityAttrs, attrsTypes, []);

                    if (!errors.length) {
                        errorFieldsList.splice(fieldIndex, 1);

                        var tabKeys = Object.keys(tabsWithErrors);

                        for (i = 0; i < tabKeys.length; i++) {
                            var tKey = tabKeys[i];
                            var tabFields = tabsWithErrors[tKey];

                            var tabFieldIndex = tabFields.indexOf(fieldKey);
                            if (tabFields.indexOf(fieldKey) > -1) {

                                tabsWithErrors[tKey].splice(tabFieldIndex, 1);

                                if (!tabsWithErrors[tKey].length) {

                                    var selectorString = ".tab-name-elem[data-tab-name='" + tKey + "']";
                                    var tabNameElem = document.querySelector(selectorString);

                                    tabNameElem.classList.remove('error-tab');

                                }

                                break;

                            }

                        }
                    }
                }*/

            }

        };

        vm.generateCurrencyAttributeTypesByValueTypes = function () {

            vm.attributeTypesByValueTypes = {

                10: [],
                20: [],
                40: []

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

                vm.generateCurrencyAttributeTypesByValueTypes()

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

                console.log('instrumentPricingSchemes', vm.instrumentPricingSchemes);

                vm.generateInstrumentAttributeTypesByValueTypes();

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

            vm.evEditorDataService = new EntityViewerEditorDataService();
            vm.evEditorEventService = new EntityViewerEditorEventService();

            var tooltipsOptions = {
                pageSize: 1000,
                filters: {
                    'content_type': contentType
                }
            }

            tooltipsService.getTooltipsList(tooltipsOptions).then(function (data) {
                var tooltipsList = data.results;
                vm.evEditorDataService.setTooltipsData(tooltipsList);
            });

            colorPalettesService.getList({pageSize: 1000}).then(function (data) {
                var palettesList = data.results;
                vm.evEditorDataService.setColorPalettesList(palettesList);
            });

            getEntityAttrs();
            vm.getFormLayout();
            vm.getCurrencies();

            if (vm.entityType === 'price-history' || vm.entityType === 'currency-history') {
                vm.readyStatus.permissions = true;
            } else {
                vm.loadPermissions();
            }

        };

        vm.init();

    }

}());