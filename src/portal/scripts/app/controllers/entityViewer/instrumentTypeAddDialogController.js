/**
 * Created by szhitenev on 08.12.2021.
 */
(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');

    // var usersGroupService = require('../../services/usersGroupService');
    // var usersService = require('../../services/usersService');

    var layoutService = require('../../services/entity-data-constructor/layoutService');
    var metaService = require('../../services/metaService');
    var evEditorEvents = require('../../services/ev-editor/entityViewerEditorEvents')

    var gridHelperService = require('../../services/gridHelperService');
    var entityViewerHelperService = require('../../services/entityViewerHelperService');

    var EntityViewerEditorDataService = require('../../services/ev-editor/entityViewerEditorDataService');
    var EventService = require('../../services/eventService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var instrumentTypeService = require('../../services/instrumentTypeService');
    var metaPermissionsService = require('../../services/metaPermissionsService');
    var tooltipsService = require('../../services/tooltipsService');
    var colorPalettesService = require('../../services/colorPalettesService');

    var uiService = require('../../services/uiService');

    var metaHelper = require('../../helpers/meta.helper');
    var entityEditorHelper = require('../../helpers/entity-editor.helper');
    var EntityViewerEditorSharedLogicHelper = require('../../helpers/entityViewer/sharedLogic/entityViewerEditorSharedLogicHelper');

    var currencyPricingSchemeService = require('../../services/pricing/currencyPricingSchemeService');
    var instrumentPricingSchemeService = require('../../services/pricing/instrumentPricingSchemeService');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var SHOW_BY_DEFAULT_OPTIONS = [
        {id: 'name', name: 'Name', visible_name: 'Report Name (Name)'},
        {id: 'public_name', name: 'Public Name', visible_name: 'System Name (Short Name)'},
        {id: 'short_name', name: 'Short Name', visible_name: 'Unique Code (User Code)'},
        {id: 'user_code', name: 'User Code', visible_name: 'Name if Hidden (Public Name)'},
    ];

    module.exports = function entityViewerAddDialogController($scope, $mdDialog, $bigDrawer, $state, authorizerService, usersService, usersGroupService, entityType, entity, data) {

        var vm = this;

        vm.sharedLogic = new EntityViewerEditorSharedLogicHelper(vm, $scope, $mdDialog, $bigDrawer);

        vm.processing = false;

        vm.readyStatus = {permissions: false, entity: false, layout: false};

        vm.entityType = 'instrument-type';

        vm.entity = {$_isValid: true};
        vm.dataConstructorLayout = {};
        vm.dcLayoutHasBeenFixed = false;

        vm.hasEnabledStatus = false;
        vm.entityStatus = '';
        vm.evEditorEvent = null;

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

        vm.canManagePermissions = false;

        vm.attributeTypesByValueTypes = {}; // need for pricing;

        vm.currencies = []; // need for instrument pricing tab;

        // Victor 20020.11.20 #59: fields below needs for new design an fixed area popup
        //region Fixed area popup
        vm.action = 'add';
        vm.typeFieldName = 'type';
        vm.typeFieldLabel = 'Type';

		vm.typeFieldName = 'instrument_class';
		vm.typeFieldLabel = 'Instrument class';

        vm.showByDefaultOptions = SHOW_BY_DEFAULT_OPTIONS;

        vm.showByDefault = vm.showByDefaultOptions[0].id;

        vm.fixedAreaPopup = vm.sharedLogic.getFixedAreaPopup();

        vm.typeSelectorOptions = [];

        vm.pricingConditions = [
            {id: 1, name: "Don't Run Valuation"},
            {id: 2, name: "Run Valuation: if non-zero position"},
            {id: 3, name: "Run Valuation: always"},
        ];
        //endregion

        vm.activeTab = null;

        vm.openedIn = data.openedIn; // 'big-drawer', 'dialog'
        vm.originalFixedAreaPopupFields;

        var formLayoutFromAbove = data.editLayout;

        /* var getShowByDefaultOptions = function (columns, entityType) {
            let result = vm.showByDefaultOptions;
            if (columns > 2 && entityType !== 'instrument' && entityType !== 'account' && entityType !== 'instrument-type') {
                result = result.filter(option => option.id !== 'short_name')
            }

            if (columns >5) {
                if (vm.entityType === 'instrument' || vm.entityType === 'account' || vm.entityType === 'instrument-type') {
                    result = result.filter(option => option.id !== 'short_name');
                } else {
                    result = result.filter(option => option.id !== 'user_code')
                }
            }

            return result;

        }; */

        vm.getEntityPropertyByDefault = function () {
            return vm.entity[vm.showByDefault];
        };

        vm.getPlaceholderByDefault = function () {
            return vm.showByDefaultOptions.find(option => option.id === vm.showByDefault).visible_name;
        };

        vm.isEntityTabActive = function () {
            return vm.activeTab && (vm.activeTab === 'permissions' || vm.entityTabs.includes(vm.activeTab));
        };

        vm.entityTabsMenuTplt = vm.sharedLogic.entityTabsMenuTplt;
        vm.entityTabsMenuPopupData = {viewModel: vm}
        vm.entityTablePopupClasses = "border-radius-2"
        vm.onPopupSaveCallback = vm.sharedLogic.onPopupSaveCallback;
        vm.onFixedAreaPopupCancel = vm.sharedLogic.onFixedAreaPopupCancel;
        // < Victor 20020.11.20 #59: fields below needs for new design an fixed area popup >

        vm.keysOfFixedFieldsAttrs = metaService.getEntityViewerFixedFieldsAttributes(vm.entityType);

        /* vm.tabsWithErrors = {"system_tab": {}, "user_tab": {}};
        vm.formErrorsList = []; */
        var contentType = metaContentTypesService.findContentTypeByEntity(vm.entityType, 'ui');

        var getEntityAttrs = function () {

            vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];
            vm.fixedFieldsAttributes = [];

            var i, a;
            for (i = 0; i < vm.keysOfFixedFieldsAttrs.length; i++) {
                var attrKey = vm.keysOfFixedFieldsAttrs[i];

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

        /* var getMatchForLayoutFields = function (tab, tabIndex, fieldsToEmptyList, tabResult) {

            var i, l, e;

            tab.layout.fields.forEach(function (field, fieldIndex) {

                var fieldResult = {};

                if (field && field.type !== 'empty') {

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
                    var layoutFieldsTofdataConstructorLayout.data.fixedArea.layout.fields;
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

        /* var fixFieldsLayoutWithMissingSockets = function () {

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

            var attributesLayoutData = entityEditorHelper.generateAttributesFromLayoutFields(vm.tabs, attributes, vm.dataConstructorLayout, true);

            vm.attributesLayout = attributesLayoutData.attributesLayout;

            if (vm.fixedArea && vm.fixedArea.isActive) {
                var fixedAreaAttributesLayoutData = entityEditorHelper.generateAttributesFromLayoutFields(vm.fixedArea, attributes, vm.dataConstructorLayout, true);

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
        }; */


        vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getCurrentMember());
            promises.push(vm.getCurrentMasterUser());
            promises.push(vm.getGroupList());

            Promise.all(promises).then(function (data) {

                vm.readyStatus.permissions = true;

                vm.setPermissionsDefaults();

                if (vm.currentMember && vm.currentMember.is_admin) {
                    vm.canManagePermissions = true;
                }

                $scope.$apply();

            });

        };

        vm.getCurrentMasterUser = function () {

            return authorizerService.getCurrentMasterUser().then(function (data) {

                vm.currentMasterUser = data;
                vm.system_currency = data.system_currency;

                vm.systemCurrencies = [data.system_currency_object];

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
            metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, {status: 'disagree'});
        };

        vm.editLayout = function (ev) {

            $mdDialog.show({
                controller: 'EntityDataConstructorDialogController as vm',
                templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        entityType: vm.entityType,
                        layoutId: vm.dataConstructorLayout.id
                    }
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.readyStatus.entity = false;
                    vm.readyStatus.layout = false;

                    formLayoutFromAbove = null; // forcing getFormLayout() to download layout from server

                    vm.init();

                    vm.layoutAttrs = layoutService.getLayoutAttrs();
                    getEntityAttrs();

                }

            });

        };

        vm.manageAttrs = vm.sharedLogic.manageAttributeTypes;

        vm.checkReadyStatus = vm.sharedLogic.checkReadyStatus;
        vm.bindFlex = vm.sharedLogic.bindFlex;
        vm.checkFieldRender = vm.sharedLogic.checkFieldRender;

        vm.checkReadyStatus = vm.sharedLogic.checkReadyStatus;

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
			vm.entity.attributes = [];

			vm.attributeTypes.forEach(function (attributeType) {

				var value = vm.entity[attributeType.user_code];

				vm.entity.attributes.push(entityEditorHelper.appendAttribute(attributeType, value));

			});

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

        var setValuesFromInstrumentType = function (entity) {

            return new Promise(async function (resolve) {

                var activeInstrType = vm.typeSelectorOptions.find(instrType => instrType.id === vm.entity.instrument_type);

                if (activeInstrType) { // if instrument type exist

                    var fullInstrType = vm.instrumentTypesList.find(instrType => instrType.id === vm.entity.instrument_type);

                    if (!fullInstrType) {
                        fullInstrType = await instrumentTypeService.getByKey(activeInstrType.id);
                    }

                    //region Set user attributes

                    fullInstrType.instrument_attributes.forEach(attr => {

                        const key = attr.attribute_type_user_code;
                        const value = entityEditorHelper.instrumentTypeAttrValueMapper(attr);

                        if (!entity[key] && entity[key] !== 0) {
                            entity[key] = value;
                        }

                    });
                    //endregion

                    //region Set accruals properties
                    var propsToSetList = ['accrued_currency', 'payment_size_detail', 'accrued_multiplier', 'default_accrued'];

                    propsToSetList.forEach(function (prop) {

                        if (fullInstrType[prop] || fullInstrType[prop] === 0 &&
                            !entity[prop] && entity[prop] !== 0) {

                            entity[prop] = fullInstrType[prop];

                        }

                    });
                    //endregion

                }

                resolve(entity);

            });

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

        vm.save = async function ($event, isAutoExitAfterSave) {

			if (!vm.entity.instrument_factor_schedule_data) {
				vm.entity.instrument_factor_schedule_data = ''
			}

            vm.updateEntityBeforeSave();

            /* var errors = entityEditorHelper.validateEntityFields(vm.entity,
                vm.entityType,
                vm.tabs,
                vm.keysOfFixedFieldsAttrs,
                vm.entityAttrs,
                vm.attributeTypes,
                []); */

            var errors = entityEditorHelper.validateEntity(
                vm.entity,
                vm.entityType,
                vm.tabs,
                vm.keysOfFixedFieldsAttrs,
                vm.entityAttrs,
                vm.attributeTypes,
                []
            );

            if (errors.length) {

                // vm.sharedLogic.processTabsErrors(errors, $event);
                var processResult = entityEditorHelper.processTabsErrorsInstrumentType(errors, vm.evEditorDataService, vm.evEditorEventService, $mdDialog, $event, vm.fixedAreaPopup);

                if (processResult) {
                    vm.fixedAreaPopup = processResult;
                    vm.originalFixedAreaPopupFields = JSON.parse(JSON.stringify(vm.fixedAreaPopup.fields));
                }

            } else {

                // var resultEntity = entityEditorHelper.removeNullFields(vm.entity, vm.entityType);
                var resultEntity = entityEditorHelper.clearEntityBeforeSave(vm.entity, vm.entityType);
                console.log('resultEntity', resultEntity);

                if (vm.dcLayoutHasBeenFixed) {
                    uiService.updateEditLayout(vm.dataConstructorLayout.id, vm.dataConstructorLayout);
                }

                vm.processing = true;

                entityResolverService.create(vm.entityType, resultEntity).then(function (responseData) {

                    vm.processing = false;

                    var entityTypeVerbose = vm.entityType.split('-').join(' ').capitalizeFirstLetter();

                    toastNotificationService.success(entityTypeVerbose + " " + vm.entity.name + " was successfully created");

                    if (isAutoExitAfterSave) {

                        let responseObj = {status: 'agree', data: responseData};
                        metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, responseObj);

                    } else {

                        vm.entity = {...vm.entity, ...responseData};
                        vm.entity.$_isValid = true;

                        const responseObj = {
                            status: 'edit',
                            data: {
                                entityType: vm.entityType,
                                entity: vm.entity
                            }
                        };

                        metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, responseObj);

                    }

                })
                    .catch(function (data) {

                        console.log('save.data', data);

                        vm.processing = false;

                        var popupText = ''

                        if (data) {
                            if (data.message) {

                                if (data.message.non_field_errors && data.message.non_field_errors.length) {

                                    if (data.message.non_field_errors[0].indexOf('unique set') !== -1) {

                                        popupText = vm.entityTypeSlug() + ' is already exist'

                                    }

                                }


                            }
                        }

                        if (popupText) {

                            toastNotificationService.info(popupText);

                        } else {

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

                        }

                    });

            }

            vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attributeTypes);

            var hasProhibitNegNums = entityEditorHelper.checkForNegNumsRestriction(vm.entity, vm.entityAttrs, [], vm.layoutAttrs);

            if (vm.entity.$_isValid) {

                if (hasProhibitNegNums.length === 0) {

                    var resultEntity = entityEditorHelper.removeNullFields(vm.entity, vm.entityType);

                    console.log('resultEntity', resultEntity);

                    if (dcLayoutHasBeenFixed) {
                        uiService.updateEditLayout(vm.dataConstructorLayout.id, vm.dataConstructorLayout);
                    }

                    entityResolverService.create(vm.entityType, resultEntity).then(function (data) {

                        var responseObj = {res: 'agree', data: data};
                        metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, responseObj);

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
                        templateUrl: "views/dialogs/warning-dialog-view.html",
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

        vm.saveAndExit = function (action) {

            vm.save().then(function (responseData) {

                let responseObj = {status: 'disagree'};

                if (action === 'edit') {

                    vm.entity = {...vm.entity, ...responseData};
                    vm.entity.$_isValid = true;

                    responseObj = {
                        status: 'edit',
                        data: {
                            entityType: vm.entityType,
                            entity: vm.entity
                        }
                    };
                }

                metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, responseObj);
            })

        };

        vm.onEntityChange = function (fieldKey) {

            if (fieldKey) {

                var attributes = {
                    entityAttrs: vm.entityAttrs,
                    attrsTypes: vm.attributeTypes
                }

                entityEditorHelper.checkTabsForErrorFields(fieldKey, vm.evEditorDataService, attributes, vm.entity, vm.entityType, vm.tabs);

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

        vm.getEntityPricingSchemes = vm.getInstrumentPricingSchemes

        // Instrument Type Layout Settings tab start

        vm.instrumentTypeLayouts = [];

        vm.instrumentTypeMoveLayoutUp = function ($event, item) {

            var index = vm.instrumentTypeLayouts.indexOf(item)

            vm.instrumentTypeLayouts.splice(index, 1); // remove old one

            console.log('old index', index)

            var newIndex = index - 1

            if (newIndex < 0) {
                newIndex = 0;
            }

            vm.instrumentTypeLayouts.splice(newIndex, 0, item);

            vm.entity.instrument_form_layouts = vm.instrumentTypeLayouts.join(',')

        }

        vm.instrumentTypeMoveLayoutDown = function ($event, item) {

            var index = vm.instrumentTypeLayouts.indexOf(item)

            vm.instrumentTypeLayouts.splice(index, 1); // remove old one

            var newIndex = index + 1

            vm.instrumentTypeLayouts.splice(newIndex, 0, item);

            vm.entity.instrument_form_layouts = vm.instrumentTypeLayouts.join(',')

        }

        vm.instrumentTypeDeleteLayout = function ($event, item) {

            var index = vm.instrumentTypeLayouts.indexOf(item)

            vm.instrumentTypeLayouts.splice(index, 1);

            vm.entity.instrument_form_layouts = vm.instrumentTypeLayouts.join(',')

        }

        vm.instrumentTypeMoveAddLayout = function ($event) {

            vm.instrumentTypeLayouts.unshift(vm.instrumentTypeNewLayoutUserCode)

            vm.instrumentTypeNewLayoutUserCode = '';

            vm.entity.instrument_form_layouts = vm.instrumentTypeLayouts.join(',')

        }

        // Instrument Type Layout Settings tab end

        // Instrument Type Exposure tab start

        vm.instrumentTypeInstrumentsSelectorOptions = []
        vm.instrumentTypeCurrenciesSelectorOptions = []

        vm.getDataForInstrumentTypeTabs = function () {

            entityResolverService.getListLight('instrument', {pageSize: 1000}).then(function (data) {

                vm.instrumentTypeInstrumentsSelectorOptions = data.results.map(function (item) {
                    return {
                        id: item.user_code,
                        name: item.name
                    }
                })

            })

            entityResolverService.getListLight('currency', {pageSize: 1000}).then(function (data) {

                vm.instrumentTypeCurrenciesSelectorOptions = data.results.map(function (item) {
                    return {
                        id: item.user_code,
                        name: item.name
                    }
                })

            })


        }


        vm.exposureCalculationModelSelectorOptions = [
            {id: 1, name: "Market Value"},
            {id: 2, name: "Price exposure"},
            {id: 3, name: "Delta adjusted price exposure"},
            {id: 4, name: "Underlying long short exposure net"},
            {id: 5, name: "Underlying long short exposure split"},
        ];

        vm.longUnderlyingExposureSelectorOptions = [
            {id: 1, name: "Zero"},
            {id: 2, name: "Long Underlying Instrument Price Exposure"},
            {id: 3, name: "Long Underlying Instrument Price Delta"},
            {id: 4, name: "Long Underlying Currency FX Rate Exposure"},
            {id: 5, name: "Long Underlying Currency FX Rate Delta-adjusted Exposure"},
        ]

        vm.shortUnderlyingExposureSelectorOptions = [
            {id: 1, name: "Zero"},
            {id: 2, name: "Short Underlying Instrument Price Exposure"},
            {id: 3, name: "Short Underlying Instrument Price Delta"},
            {id: 4, name: "Short Underlying Currency FX Rate Exposure"},
            {id: 5, name: "Short Underlying Currency FX Rate Delta-adjusted Exposure"},
        ]
        vm.positionReportingSelectorOptions = [
            {
                id: 1,
                name: 'Direct Position'
            },
            {
                id: 2,
                name: 'Factor-adjusted Position'
            },
            {
                id: 3,
                name: 'Do not show'
            }
        ]

        // Instrument Type Exposure tab end

        // Instrument tab Exposure start

        vm.getDataForInstrumentTabs = function () {

            entityResolverService.getListLight('instrument', {pageSize: 1000}).then(function (data) {

                vm.instrumentInstrumentsSelectorOptions = data.results

            })

            entityResolverService.getListLight('currency', {pageSize: 1000}).then(function (data) {

                vm.instrumentCurrenciesSelectorOptions = data.results

            })


        }

        // Instrument tab Exposure end

        vm.instrumentTypeChange = function ($event) {

            console.log('instrumentTypeChange', vm.entity)

            vm.sharedLogic.getFormLayout().then(formLayoutData => {

                vm.fixedAreaPopup.fields = formLayoutData.fixedAreaData;
                vm.originalFixedAreaPopupFields = JSON.parse(JSON.stringify(formLayoutData.fixedAreaData));

                vm.attributeTypes = formLayoutData.attributeTypes;

                vm.tabs = formLayoutData.tabs;
                vm.attributesLayout = formLayoutData.attributesLayout;

            });

        }

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

            /* setTimeout(function () {

				if (vm.openedIn === 'big-drawer') {

					vm.bigDrawerResizeButton = document.querySelector('.onResizeButtonClick');

					if (vm.bigDrawerResizeButton) {
						vm.bigDrawerResizeButton.addEventListener('click', onBigDrawerResizeButtonClick);
					}

				} else {
					vm.dialogElemToResize = document.querySelector('.evEditorDialogElemToResize');
				}

            }, 100);*/
			uiService.getListEditLayout('instrument').then(function (data) {

				vm.instrumentFormLayouts = data.results;

				$scope.$apply()

			})

			vm.getDataForInstrumentTypeTabs();

            setTimeout(function () {
                vm.dialogElemToResize = vm.sharedLogic.onEditorStart();
            }, 100);

            vm.evEditorDataService = new EntityViewerEditorDataService();
            vm.evEditorEventService = new EventService();

            vm.evEditorDataService.setLocationsWithErrors(null);
            vm.evEditorDataService.setFormErrorsList([]);

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

            // vm.getFormLayout();
            // evEditorSharedLogicHelper.getFormLayout('addition', formLayoutFromAbove);

            vm.sharedLogic.getFormLayout(formLayoutFromAbove).then(formLayoutData => {

                vm.fixedAreaPopup.fields = formLayoutData.fixedAreaData;
                vm.originalFixedAreaPopupFields = JSON.parse(JSON.stringify(formLayoutData.fixedAreaData));

                vm.attributeTypes = formLayoutData.attributeTypes;

                vm.tabs = formLayoutData.tabs;
                vm.attributesLayout = formLayoutData.attributesLayout;

                vm.evEditorDataService.setEntityAttributeTypes(vm.attributeTypes);

				$scope.$apply();

                /* vm.sharedLogic.getFieldsForFixedAreaPopup().then(fieldsData => {

                    vm.fixedAreaPopup.fields = fieldsData;
                    vm.originalFixedAreaPopupFields = JSON.parse(JSON.stringify(fieldsData));

                    $scope.$apply();

                }); */

            });

            vm.getCurrencies();
			vm.loadPermissions();

            /* vm.sharedLogic.getFieldsForFixedAreaPopup().then(function (fields) {

                vm.fixedAreaPopup.fields = fields;
                vm.originalFixedAreaPopupFields = JSON.parse(JSON.stringify(fields));

            }); */

            /* if (vm.fixedAreaPopup.fields) {
				originalFixedAreaPopupFields = JSON.parse(JSON.stringify(vm.fixedAreaPopup.fields));
			} */
            console.log('vm.fixedAreaPopup', vm.fixedAreaPopup)

        };

        vm.init();

    }

}());