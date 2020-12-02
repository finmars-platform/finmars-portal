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
    var metaPermissionsService = require('../../services/metaPermissionsService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var tooltipsService = require('../../services/tooltipsService');
    var colorPalettesService = require('../../services/colorPalettesService');

    var uiService = require('../../services/uiService');

	var metaHelper = require('../../helpers/meta.helper');
    var entityEditorHelper = require('../../helpers/entity-editor.helper');

    var complexTransactionService = require('../../services/transaction/complexTransactionService');

    var currencyPricingSchemeService = require('../../services/pricing/currencyPricingSchemeService');
    var instrumentPricingSchemeService = require('../../services/pricing/instrumentPricingSchemeService');

    var instrumentTypeService = require('../../services/instrumentTypeService');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var SHOW_BY_DEFAULT_OPTIONS = [
        {id: 'name', name: 'Name'},
        {id: 'public_name', name: 'Public Name'},
        {id: 'short_name', name: 'Short Name'},
        {id: 'user_code', name: 'User Code'},
    ];

    module.exports = function entityViewerEditDialogController(
    	$scope, $mdDialog, $bigDrawer, $state, entityType, entityId, data
	) {

        var vm = this;

        vm.processing = false;

        vm.contextData = {};

        if (data.contextData) {
            vm.contextData = data.contextData;
        }

        vm.entityType = entityType;

        vm.entityId = entityId;

        vm.entity = {$_isValid: true};
        var dataConstructorLayout = {};
        var dcLayoutHasBeenFixed = false;

        vm.hasEnabledStatus = true;
        vm.entityStatus = '';
        vm.evEditorEvent = null;

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

        vm.currencies = []; // need for instrument pricing tab;

        // Victor 20020.11.20 #59: fields below needs for new design an fixed area popup
        vm.typeFieldName = 'type';
        vm.typeFieldLabel = 'Type';

        if (vm.entityType === 'instrument') {
            vm.typeFieldName = 'instrument_type';
            vm.typeFieldLabel = 'Instrument type';
        }

        if (vm.entityType === 'instrument-type') {
            vm.typeFieldName = 'instrument_class';
            vm.typeFieldLabel = 'Instrument class';
        }
        vm.showByDefaultOptions = SHOW_BY_DEFAULT_OPTIONS;

        if (vm.entityType === 'currency') {
            vm.showByDefaultOptions = vm.showByDefaultOptions.filter((item) => item.id !== 'public_name')
        }

        vm.showByDefault = vm.showByDefaultOptions[0].id;

        vm.fixedAreaPopup = {
            fields: {},
            entityType: vm.entityType,
            tabColumns: null,
        };

        vm.typeSelectorOptions = [];

        vm.pricingConditions = [
            {id: 1, name: "Don't Run Valuation"},
            {id: 2, name: "Run Valuation: if non-zero position"},
            {id: 3, name: "Run Valuation: always"},
        ];

        vm.activeTab = null;

        var getShowByDefaultOptions = function (columns, entityType) {
            if (columns > 2 && entityType !== 'instrument' && entityType !== 'account' && entityType !== 'instrument-type') {
                return vm.showByDefaultOptions.filter(option => option.id !== 'short_name')
            }

            return vm.showByDefaultOptions;

        };

        var bigDrawerResizeButton;

        vm.isEntityTabActive = function () {
            return vm.activeTab && (vm.activeTab === 'permissions' || vm.entityTabs.includes(vm.activeTab));
        };

        vm.getEntityPropertyByDefault = function () {
            return vm.entity[vm.showByDefault];
        };

        vm.getPlaceholderByDefault = function () {
            return vm.showByDefaultOptions.find(option => option.id === vm.showByDefault).name;
        };

        vm.onPopupSaveCallback = function () {
            keysOfFixedFieldsAttrs.forEach((key) => {
                if (!key) {
                    return;
                }

                const fieldKey = (key === 'instrument_type' || key === 'instrument_class') ? 'type' : key
                vm.entity[key] = vm.fixedAreaPopup.fields[fieldKey].value;
            })

            if (vm.entityStatus !== vm.fixedAreaPopup.fields.status.value) {
                vm.entityStatus = vm.fixedAreaPopup.fields.status.value;
                vm.entityStatusChanged();
            }

            if (vm.showByDefault !== vm.fixedAreaPopup.fields.showByDefault.value) {
                vm.showByDefault = vm.fixedAreaPopup.fields.showByDefault.value
                // save layout settings
                dataConstructorLayout.data.fixedArea.showByDefault = vm.showByDefault;
                uiService.updateEditLayout(dataConstructorLayout.id, dataConstructorLayout);
            }

        };

        vm.setTypeSelectorOptions = function (options) {
            vm.typeSelectorOptions = options;
        }
        // <Victor 20020.11.20 #59: fields below needs for new design an fixed area popup>

        //vm.currenciesSorted = [];

        var keysOfFixedFieldsAttrs = metaService.getEntityViewerFixedFieldsAttributes(vm.entityType);
        console.log('keysOfFixedFieldsAttrs', keysOfFixedFieldsAttrs)

        var tabsWithErrors = {};
        var errorFieldsList = [];
        var contentType = metaContentTypesService.findContentTypeByEntity(vm.entityType, 'ui');

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

        vm.getCurrencies = function(){

            entityResolverService.getListLight('currency', {pageSize: 1000}).then(function (data) {

                // Victor 19.10.2020
                //vm.currencies = data.results;
                vm.currencies = metaHelper.textWithDashSort(data.results);
                console.log('vm.currencies', vm.currencies)

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
            promises.push(vm.getCurrentMasterUser());
            promises.push(vm.getGroupList());

            Promise.all(promises).then(function (data) {

                // TODO object_permissions is undefined
                vm.entity.object_permissions && vm.entity.object_permissions.forEach(function (perm) {

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

        vm.getCurrentMasterUser = function() {

            return usersService.getCurrentMasterUser().then(function (data) {

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
			metaHelper.closeComponent(data.openedIn, $mdDialog, $bigDrawer, {status: 'disagree'});
            // $mdDialog.hide({status: 'disagree'});
        };

        vm.manageAttrs = function (ev) {

            /*var entityType = {entityType: vm.entityType};
            if (vm.fromEntityType) {
                entityType = {entityType: vm.entityType, from: vm.fromEntityType};
            }
            $state.go('app.attributesManager', entityType);
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
                    entity: entity,
                    data: {}
                }
            }).then(function (res) {

                if (res && res.res === 'agree') {

                    console.log('res', res);

                }

            });

            // $mdDialog.hide();
			metaHelper.closeComponent(data.openedIn, $mdDialog, $bigDrawer, {});

        };

        vm.getFormLayout = function () {

            uiService.getEditLayout(vm.entityType).then(function (editLayout) {

                if (editLayout.results.length && editLayout.results.length > 0 && editLayout.results[0].data) {

                    dataConstructorLayout = JSON.parse(JSON.stringify(editLayout.results[0]));

                    if (Array.isArray(editLayout.results[0].data)) {
                        vm.tabs = editLayout.results[0].data;
                    } else {
                        vm.tabs = editLayout.results[0].data.tabs;
                        vm.fixedArea = editLayout.results[0].data.fixedArea;
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

                // Victor 2020.11.20 #59 Fixed area popup
                if (vm.fixedArea.showByDefault) {
                    vm.showByDefault = vm.fixedArea.showByDefault;
                    vm.fixedAreaPopup.fields.showByDefault.value = vm.showByDefault;
                }

                const columns = entityViewerHelperService.getEditLayoutMaxColumns(vm.tabs);

                if (vm.fixedAreaPopup.tabColumns !== columns) {

                    vm.fixedAreaPopup.tabColumns = columns;
                    vm.fixedAreaPopup.fields.showByDefault.options = getShowByDefaultOptions(vm.fixedAreaPopup.tabColumns, vm.entityType);

                    const bigDrawerWidthPercent = entityViewerHelperService.getBigDrawerWidthPercent(vm.fixedAreaPopup.tabColumns);
                    $bigDrawer.setWidth(bigDrawerWidthPercent);

                    if (vm.fixedAreaPopup.tabColumns !== 6) {
                        bigDrawerResizeButton && bigDrawerResizeButton.classList.remove('display-none');
                        bigDrawerResizeButton && bigDrawerResizeButton.classList.add('display-block');
                    } else {
                        bigDrawerResizeButton && bigDrawerResizeButton.classList.remove('display-block');
                        bigDrawerResizeButton && bigDrawerResizeButton.classList.add('display-none');
                    }

                }
                // <Victor 2020.11.20 #59 Fixed area popup>

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

                    console.log('vm.entity', vm.entity)

                    vm.entity.$_isValid = true;
                    vm.readyStatus.entity = true;
                    // vm.readyStatus.permissions = true;

                    if (['price-history', 'currency-history', 'price-history-error', 'currency-history-error'].indexOf(vm.entityType) === -1) {

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
            return attributeTypeService.getList(vm.entityType, {pageSize: 1000}).then(function (data) {
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

            console.log('updateItem', vm.entity.$_isValid);

            // TMP save method for instrument

            return new Promise(function (resolve) {

                vm.updateEntityBeforeSave();

                vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attributeTypes);

                var result = entityEditorHelper.removeNullFields(vm.entity);

                entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                    resolve(data);

                });

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

                	// $mdDialog.hide({res: 'agree', data: {action: 'delete'}});
					let responseObj = {res: 'agree', data: {action: 'delete'}};
					metaHelper.closeComponent(data.openedIn, $mdDialog, $bigDrawer, responseObj);

                }

            })

        };

        vm.toggleEnableStatus = function () {

            vm.entity.is_enabled = !vm.entity.is_enabled;


            entityResolverService.getByKey(vm.entityType, vm.entity.id).then(function (result) {

                result.is_enabled = vm.entity.is_enabled;

                entityResolverService.update(vm.entityType, result.id, result).then(function (data) {
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

            // Victor 2020.11.20 #59 fixed fields popup
            if (vm.fixedAreaPopup.fields.status) {

                vm.fixedAreaPopup.fields.status.value = vm.entityStatus;

            }
            // <Victor 2020.11.20 #59 fixed fields popup>

        };

        vm.save = function ($event, isAutoExitAfterSave) {

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

                // var result = entityEditorHelper.removeNullFields(vm.entity);
                var result = entityEditorHelper.clearEntityBeforeSave(vm.entity, vm.entityType);

                if (dcLayoutHasBeenFixed) {
                    uiService.updateEditLayout(dataConstructorLayout.id, dataConstructorLayout);
                }

                vm.processing = true;

                entityResolverService.update(vm.entityType, result.id, result).then(function (responseData) {

                    vm.processing = false;

                    if (responseData.status === 400) {
                        vm.handleErrors(responseData);

                    } else {

                        var entityTypeVerbose = vm.entityType.split('-').join(' ').capitalizeFirstLetter();
                        toastNotificationService.success(entityTypeVerbose + " " + vm.entity.name + ' was successfully saved');

                        if (isAutoExitAfterSave) {
                            // $mdDialog.hide({res: 'agree', responseData: responseData});
                            let responseObj = {res: 'agree', data: responseData};
                            metaHelper.closeComponent(data.openedIn, $mdDialog, $bigDrawer, responseObj);
                        }


                    }

                }).catch(function(data) {

                    vm.processing = false;
                    vm.handleErrors(data);

                });

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

                data.results.forEach(function (userField) {

                    vm.tabs.forEach(function (tab) {

                        tab.layout.fields.forEach(function (field) {

                            if (field.attribute && field.attribute.key) {

                                if (field.attribute.key === userField.key) {


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

                })
            })

        };

        vm.recalculateAccountPermissions = function ($event) {

            vm.updateItem().then(function (value) {

                entityResolverService.getList('account', {pageSize: 1000}).then(function (data) {

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

        vm.saveAndApplyPermissionsToInstrumentsByGroup = function ($event, group) {

            vm.updateItem().then(function (value) {

                entityResolverService.getList('instrument', {pageSize: 1000}).then(function (data) {

                    var has_view = group.objectPermissions.view;
                    var has_change = group.objectPermissions.change;
                    var has_manage = group.objectPermissions.manage;

                    var instrumentsWithPermissions = data.results.map(function (item) {

                        var permissions = item.object_permissions.filter(function (perm) {
                            return perm.group !== group.id
                        });

                        if (has_view) {
                            permissions.push({
                                group: group.id,
                                member: null,
                                permission: 'view_instrument'
                            });
                        }

                        if (has_change) {
                            permissions.push({
                                group: group.id,
                                member: null,
                                permission: 'change_instrument'
                            });
                        }

                        if (has_manage) {
                            permissions.push({
                                group: group.id,
                                member: null,
                                permission: 'manage_instrument'
                            });
                        }

                        return {
                            id: item.id,
                            object_permissions: permissions
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

            instrumentTypeService.updatePricing(vm.entity.id, item).then(function (data) {

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
                            description: "New Pricing Settings were applied"
                        }
                    }
                });

            })

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


            if (item.pricing_scheme_object && item.pricing_scheme_object.type_settings) {

                item.data = item.pricing_scheme_object.type_settings.data;
                item.attribute_key = item.pricing_scheme_object.type_settings.attribute_key;
                item.default_value = item.pricing_scheme_object.type_settings.default_value;

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

        vm.runPricingInstrument = function($event) {

            $mdDialog.show({
                controller: 'RunPricingInstrumentDialogController as vm',
                templateUrl: 'views/dialogs/pricing/run-pricing-instrument-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        instrument: vm.entity,
                        contextData: vm.contextData
                    }

                }
            }).then(function (res) {

                if (res.status === 'agree') {

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
                                description: "Pricing Process Initialized."
                            }
                        }
                    });

                }

            });

        };

        vm.runPricingCurrency = function($event) {

            $mdDialog.show({
                controller: 'RunPricingCurrencyDialogController as vm',
                templateUrl: 'views/dialogs/pricing/run-pricing-currency-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        currency: vm.entity,
                        contextData: vm.contextData
                    }

                }
            }).then(function (res) {

                if (res.status === 'agree') {

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
                                description: "Pricing Process Initialized."
                            }
                        }
                    });

                }

            });

        };

        vm.onFieldChange = function (fieldKey) {
            if (fieldKey) {
                var attributes = {
                    entityAttrs: vm.entityAttrs,
                    attrsTypes: vm.attributeTypes
                }

                entityEditorHelper.checkTabsForErrorFields(fieldKey, errorFieldsList, tabsWithErrors,
                    attributes,
                    vm.entity, vm.entityType, vm.tabs);
            }
        }

        vm.onNameInputBlur = function () {

            if (vm.entity.name && !vm.entity.short_name) {
                var entityName = vm.entity.name;
                vm.entity.short_name = entityName;

                $scope.$apply();
            }

        };

        vm.init = function () {

        	setTimeout(function () {

            	vm.dialogElemToResize = document.querySelector('.evEditorDialogElemToResize');

				bigDrawerResizeButton = document.querySelector('.onResizeButtonClick');

				if (bigDrawerResizeButton) {

					bigDrawerResizeButton.addEventListener('click', function () {

						// vm.fixedAreaPopup.tabColumns = 6;
						vm.fixedAreaPopup.fields.showByDefault.options = getShowByDefaultOptions(6, vm.entityType);

						$scope.$apply();
						const bigDrawerWidthPercent = entityViewerHelperService.getBigDrawerWidthPercent(6);

						$bigDrawer.setWidth(bigDrawerWidthPercent);

						bigDrawerResizeButton.classList.add('display-none');
						bigDrawerResizeButton.classList.remove('display-block');

					});

				}

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

            if (vm.entityType === 'instrument') {

                vm.statusSelectorOptions = [
                    {
                        id: 'active',
                        name: 'Active'
                    },
                    {
                        id: 'inactive',
                        name: 'Inactive'
                    },
					{
						id: 'disabled',
						name: 'Disabled'
					},
					{
						id: 'deleted',
						name: 'Deleted'
					}
                ];

            } else {

                vm.statusSelectorOptions = [
                    {
                        id: 'enabled',
                        name: 'Enabled'
                    },
                    {
                        id: 'disabled',
                        name: 'Disabled'
                    },
                    {
                        id: 'deleted',
                        name: 'Deleted'
                    }
                ];

            }

            getEntityAttrs();
            vm.getCurrencies();

            vm.getItem().then(function () {
                getEntityStatus();
                // Victor 2020.11.20 #59 fixed area popup
                vm.fixedAreaPopup.fields = entityViewerHelperService.getFieldsForFixedAreaPopup(vm, keysOfFixedFieldsAttrs);
                console.log('vm.fixedAreaPopup', vm.fixedAreaPopup)
                // <Victor 2020.11.20 #59 fixed area popup>
            });
        };

        vm.init();


        // Special case for split-panel
        $scope.splitPanelInit = function (entityType, entityId) {
            vm.entityType = entityType;
            vm.entityId = entityId;
        };

        /*vm.entityChange = function () {

            console.log("entityChange", vm);

        };*/

    }

}());