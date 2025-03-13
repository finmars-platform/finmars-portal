/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var importInstrumentCbondsService = require('../../services/import/importInstrumentCbondsService').default;

    // var usersGroupService = require('../../services/usersGroupService');
    // var usersService = require('../../services/usersService');

    var layoutService = require('../../services/entity-data-constructor/layoutService');
    var metaService = require('../../services/metaService').default;
    var evEditorEvents = require('../../services/ev-editor/entityViewerEditorEvents')

    var gridHelperService = require('../../services/gridHelperService');
    var evHelperService = require('../../services/entityViewerHelperService');

    var EntityViewerEditorDataService = require('../../services/ev-editor/entityViewerEditorDataService');
    var EventService = require('../../services/eventService');

    // var attributeTypeService = require('../../services/attributeTypeService');
    var metaPermissionsService = require('../../services/metaPermissionsService');
    var tooltipsService = require('../../services/tooltipsService');
    var colorPalettesService = require('../../services/colorPalettesService');


    var metaHelper = require('../../helpers/meta.helper');
    var entityEditorHelper = require('../../helpers/entity-editor.helper');
    var EntityViewerEditorSharedLogicHelper = require('../../helpers/entityViewer/sharedLogic/entityViewerEditorSharedLogicHelper');

    var complexTransactionService = require('../../services/transaction/complexTransactionService').default;

    var currencyPricingSchemeService = require('../../services/pricing/currencyPricingSchemeService');
    var instrumentPricingSchemeService = require('../../services/pricing/instrumentPricingSchemeService');

    var instrumentTypeService = require('../../services/instrumentTypeService').default;

    const pricingPolicyService = require('../../services/pricingPolicyService').default;

    module.exports = function entityViewerEditDialogController($scope, $mdDialog, $bigDrawer, $state, toastNotificationService, authorizerService, usersService, usersGroupService, metaContentTypesService, instrumentService, priceHistoryService, entityResolverService, fieldResolverService, attributeTypeService, uiService, configurationService, entityType, entityId, data) {

        var vm = this;

        vm.entityType = entityType;

        vm.sharedLogic = new EntityViewerEditorSharedLogicHelper(vm, $scope, $mdDialog, $bigDrawer, $state, instrumentService, entityResolverService, fieldResolverService, attributeTypeService, uiService);

        vm.processing = false;

        vm.contextData = {};

        if (data.contextData) {
            vm.contextData = data.contextData;
        }

        vm.entityId = entityId;
        vm.entityUserCode = null;

        if (data) {

            if (typeof data !== "object") {

                throw new Error(
                    "Invalid value inside 'data' for " +
                    "entityViewerEditDialogController. Expected an 'object' got: " +
                    `${typeof data} ${data}`
                )

            }

            vm.entityUserCode = data.userCode;

        }

        if ( Number.isNaN(vm.entityId) &&
            (!vm.entityUserCode || typeof vm.entityUserCode !== "string") ) {

            throw new Error("No valid 'id' or 'user_code' provided")

        }

        vm.entity = {$_isValid: true};
        vm.dataConstructorLayout = {};
        vm.dcLayoutHasBeenFixed = false;

        vm.hasEnabledStatus = true;
        vm.entityStatus = '';
        // vm.allowFormLayoutEdition = true;
        vm.evEditorEvent = null;

        if (vm.entityType === 'price-history' || vm.entityType === 'currency-history') {
            vm.hasEnabledStatus = false;
        }

        vm.readyStatus = {...vm.sharedLogic.readyStatusObj, modules: false, content: false, policies: false};

        vm.formIsValid = true;

        vm.attributeTypes = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();
        vm.entityAttrs = [];

        vm.range = gridHelperService.range;

        vm.fixedFieldsAttributes = [];
        vm.attributesLayout = [];
        vm.fixedAreaAttributesLayout = [];

        vm.currentMember = null;

        vm.hasEditPermission = true; // deprecated
        vm.canManagePermissions = false;

        vm.fieldsDataStore = {};

        vm.attributeTypesByValueTypes = {}; // need for pricing tab

        vm.currencies = []; // need for instrument pricing tab;

        vm.isRestorable = evHelperService.isRestorable(vm.entityType);

        // Victor 20020.11.20 #59: fields below needs for new design an fixed area popup
        vm.action = 'edit';
        vm.typeFieldName = 'type';
        vm.typeFieldLabel = 'Type';

        if (vm.entityType === 'instrument') {

            vm.typeFieldName = 'instrument_type';
            vm.typeFieldLabel = 'Instrument type';

            vm.instrumentsSelectorOptions = [];
            vm.currenciesSelectorOptions = [];

        } else if (vm.entityType === 'instrument-type') {
            vm.typeFieldName = 'instrument_class';
            vm.typeFieldLabel = 'Instrument class';
        }

        /*vm.nameToShowOptions = [
            {id: 'name', name: 'Name', visible_name: 'Report Name (Name)'},
            {id: 'public_name', name: 'Public Name', visible_name: 'System Name (Short Name)'},
            {id: 'short_name', name: 'Short Name', visible_name: 'Unique Code (User Code)'},
            {id: 'user_code', name: 'User Code', visible_name: 'Name if Hidden (Public Name)'},
        ];

        if (vm.entityType === 'currency') {
            vm.nameToShowOptions = vm.nameToShowOptions.filter((item) => item.id !== 'public_name')
        }

        // id of popup field which value will be shown when popup closed
        vm.nameToShow = vm.nameToShowOptions[0].id;

        vm.fixedAreaPopup = vm.sharedLogic.getFixedAreaPopup(); */
        vm.tabColumns = data.tabColumns;
        vm.nameToShow;

        vm.typeSelectorOptions = [];
        vm.groupSelectorLabel = 'Group';
        vm.groupSelectorOptions = []; // set by getFormLayout()
        vm.groupSelectorEntityType = vm.sharedLogic.entityTypeForGroupSelectorsData[vm.entityType];

        vm.pricingConditions = [
            {id: 1, name: "Don't Run Valuation"},
            {id: 2, name: "Run Valuation: if non-zero position"},
            {id: 3, name: "Run Valuation: always"},
        ];

        vm.activeTab = null;

        vm.openedIn = data.openedIn;
        // vm.originalFixedAreaPopupFields;

        if (vm.entityType === 'instrument') {

            vm.instrumentTypesList = []; // modified by method resolveEditLayout() inside entityViewerEditorSharedLogicHelper.js

            vm.exposureCalculationModelSelectorOptions = vm.sharedLogic.exposureCalculationModelSelectorOptions;
            vm.longUnderlyingExposureSelectorOptions = vm.sharedLogic.longUnderlyingExposureSelectorOptions;
            vm.shortUnderlyingExposureSelectorOptions = vm.sharedLogic.shortUnderlyingExposureSelectorOptions;
            vm.positionReportingSelectorOptions = vm.sharedLogic.positionReportingSelectorOptions;

        }

        var formLayout = data.editLayout;

        /* var getShowByDefaultOptions = function (columns, entityType) {
            if (columns > 2 && entityType !== 'instrument' && entityType !== 'account' && entityType !== 'instrument-type') {
                return vm.nameToShowOptions.filter(option => option.id !== 'short_name')
            }

            return vm.nameToShowOptions;

        }; */

        //# region Tabs
        vm.entityTabs = metaService.getEntityTabs(vm.entityType);

        const getTabFromQueryParams = function () {

            const tabToOpenKey = $state.params.tab;

            if (!tabToOpenKey) {
                return null;
            }

            const activeTab = vm.entityTabs.find(
                tabData => tabData.key === tabToOpenKey
            );

            if (!activeTab) {
                console.warn(`Could not find a system tab with a key: ${tabToOpenKey}`);
            }

            return activeTab;

        }

        vm.isEntityTabActive = function () {
            return vm.activeTab && vm.entityTabs.includes(vm.activeTab);
        };

        vm.selectTab = function (tabToSelect) {
            vm.activeTab = vm.sharedLogic.selectTab(tabToSelect);
        }
        //# endregion Tabs

        vm.getNameToShowValue = function () {
            return vm.entity[vm.nameToShow] || '';
        };

        /*vm.getNameToShowAlias = function () {
            return vm.nameToShowOptions.find(option => option.id === vm.nameToShow).visible_name;
        };*/

        vm.entityTabsMenuTplt = vm.sharedLogic.entityTabsMenuTplt;
        vm.entityTabsMenuPopupData = {viewModel: vm};
        vm.entityTablePopupClasses = "border-radius-2";
        /* FIXED AREA POPUP

        vm.onPopupSaveCallback = vm.sharedLogic.onPopupSaveCallback;
        vm.onFixedAreaPopupCancel = vm.sharedLogic.onFixedAreaPopupCancel;*/
        if (vm.entityType === 'account-type') {

            vm.ucDisabled = true;
            vm.useUserCodeInput = true;

        }

        vm.onNameToShowChange = vm.sharedLogic.onNameToShowChange;

        vm.getFaField1Classes = vm.sharedLogic.getFaField1Classes;
        vm.getFaField2Classes = vm.sharedLogic.getFaField2Classes;
        vm.getFaField3Classes = vm.sharedLogic.getFaField3Classes;

        //vm.currenciesSorted = [];

        vm.keysOfFixedFieldsAttrs = metaService.getEntityViewerFixedFieldsAttributes(vm.entityType);

        vm.isNotNullInput = vm.sharedLogic.isNotNullInput;

        /* vm.tabsWithErrors = {"system_tab": {}, "user_tab": {}};
        vm.formErrorsList = []; */
        var contentType = metaContentTypesService.findContentTypeByEntity(vm.entityType, 'ui');

        vm.rearrangeMdDialogActions = function () {

            var dialogWindowWidth = vm.dialogElemToResize.clientWidth;

            if (dialogWindowWidth < 805) {
                vm.dialogElemToResize.classList.add("two-rows-dialog-actions");
            } else {
                vm.dialogElemToResize.classList.remove("two-rows-dialog-actions");
            }

        };

        /**
         *
         * @param {Object} paramsObj
         * @param { [String] } paramsObj.keysList - array of keys of attributes
         *
         * @returns {Promise<void>}
         */
        vm.recalculate = async function (paramsObj) {
            const result = await vm.sharedLogic.recalculatePriceHistoryField(
                paramsObj.keysList, vm.entity, vm.attributesLayout, vm.evEditorDataService, vm.evEditorEventService, priceHistoryService
            );

            vm.entity = result.entity;
            vm.attributesLayout = result.attributesLayout;
        };

        /*var getEntityAttrs = function () {

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

        };*/

        vm.getCurrencies = function () {

            entityResolverService.getListLight('currency', {pageSize: 1000}).then(function (data) {

                // Victor 19.10.2020
                //vm.currencies = data.results;
                vm.currencies = metaHelper.textWithDashSort(data.results);
                console.log('vm.currencies', vm.currencies)

                $scope.$apply();

            })

        };

        vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getCurrentMember());
            promises.push(vm.getCurrentMasterUser());
            promises.push(vm.getGroupList());

            return new Promise(function (resolve, reject) {

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

                    resolve();

                }).catch(function (error) {
                    reject(error)
                });

            })

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
            metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, {status: 'disagree'});
        };

        vm.restoreDeleted = function () {

            console.log("Restore deleted here")

            vm.processing = true;

            entityResolverService.getByKey(vm.entityType, vm.entity.id).then(function (result) {

                var name = result.name.split('(del) ')[1];
                var short_name = result.short_name.split('(del) ')[1];

                var current_user_code = result.user_code;

                result.name = name;
                result.short_name = short_name;
                result.user_code = result.deleted_user_code;

                result.is_active = true;
                result.is_enabled = true;
                result.is_deleted = false;

                var entityTypeVerbose = vm.entityType.split('-').join(' ').capitalizeFirstLetter();

                entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                    toastNotificationService.success(entityTypeVerbose + " " + result.name + ' was successfully restored');

                    vm.processing = false;

                    $scope.$apply();

                    vm.init()

                }).catch(function () {

                    result.user_code = current_user_code;

                    entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                        toastNotificationService.success(entityTypeVerbose + " " + result.name + ' was successfully restored. Old user code is already in use.');

                        vm.processing = false;

                        $scope.$apply();

                        vm.init()

                    })

                })

            });

        };



        const getFooterPopupData = function () {

            let data = {
                options: []
            };

            if (vm.openedIn !== "webpage" && vm.entityType !== 'portfolio-register') {

                var duplicateOpt = {
                    icon: 'content_copy',
                    name: 'Duplicate',
                    classes: 'divider-bottom'
                }

                duplicateOpt.isDisabled = !vm.hasEditPermission;
                duplicateOpt.onClick = function (option, _$popup) {

                    _$popup.cancel();
                    vm.copy(vm.openedIn);

                };


                data.options.push(duplicateOpt);
            }

            /*
            `if (evHelperService.doesEntityHaveEditionState(vm.entityType))` must be removed after creating
            router states for editing all entities that use
            entityViewerEditDialogController
            */
            if ( evHelperService.doesEntityHaveEditionState(vm.entityType) ) {

                data.options.push({
                    icon: "link",
                    name: "Share",
                    onClick: () => {

                        let options = {
                            entityId: vm.entityId,
                            entityUserCode: vm.entity.user_code,
                            transactionCode: vm.entity.transaction_code,
                        };

                        if (vm.activeTab && vm.activeTab.type === "system_tab") {
                            options.tab = vm.activeTab.key;
                        }

                        if ( ["strategy-1", "strategy-2", "strategy-3"].includes(vm.entityType) ) {
                            options.strategyNumber = $state.params.strategyNumber;
                        }

                        const editEvStateName = evHelperService.getNameOfStateForEditingEntity($state);

                        evHelperService.copyLinkToEvForm($state, editEvStateName, toastNotificationService, options);

                    }
                });

            }

            data.options.push({
                icon: "edit",
                name: "Edit as JSON",
                onClick: vm.editAsJson
            });

            if ( vm.entity.hasOwnProperty('is_locked') ) {
                /*
                getLockMenuOption uses: vm.entity.is_locked, vm.entity.is_canceled,
                vm.hasEditPermission, vm.processing
                */
                data.options.push(
                    entityEditorHelper.getLockMenuOption(vm, vm.toggleLockStatus)
                )
            }

            data.options.push({
                icon: "list",
                name: "Edit Form",
                onClick: vm.editLayout
            });

            if (vm.entityType !== "transaction") {
                data.options.push({
                    icon: "edit",
                    name: "Manage Attributes",
                    onClick: vm.sharedLogic.manageAttributeTypes
                });
            }

            // if (["price-history", 'currency-history', 'transaction'].indexOf(vm.entityType) === -1) {
            //     data.options.push({
            //         icon: "my_library_books",
            //         name: "View History",
            //         onClick: vm.viewHistory
            //     });
            // }

            data.options.push({
                key: 'toggle_enable_status',
                icon: vm.entity.is_enabled ? "not_interested" : "check_circle",
                name: vm.entity.is_enabled ? "Disable" : "Enable",
                isDisabled: !vm.hasEditPermission,
                classes: 'divider-bottom',
                onClick: function (option, _$popup) {
                    _$popup.cancel();
                    vm.toggleEnableStatus();
                }
            });

            data.options.push({
                icon: 'delete',
                name: "Delete",
                isDisabled: !vm.hasEditPermission,
                onClick: vm.delete,
            });

            return data;

        };

        vm.footerPopupData = null;

        vm.copy = function (windowType) {

            if (windowType === "webpage") {
                return;
            }

            vm.sharedLogic.copy(windowType, 'EntityViewerAddDialogController');

        };

        /* vm.getFormLayout = async function () {

        	var editLayout;
        	var gotEditLayout = true;

			if (formLayout) {
        		editLayout = formLayout;

			} else {

				try {
					editLayout = await uiService.getEditLayoutByKey(vm.entityType);

				} catch (error) {
					gotEditLayout = false;
				}

			}

			if (gotEditLayout && editLayout.results.length && editLayout.results.length && editLayout.results[0].data) {

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

			if (vm.openedIn === 'big-drawer') {

				// Victor 2020.11.20 #59 Fixed area popup
				if (vm.fixedArea && vm.fixedArea.nameToShow) {
					vm.nameToShow = vm.fixedArea.nameToShow;
					vm.fixedAreaPopup.fields.nameToShow.value = vm.nameToShow;
				}

				const columns = entityViewerHelperService.getEditLayoutMaxColumns(vm.tabs);

				if (vm.fixedAreaPopup.tabColumns !== columns) {

					vm.fixedAreaPopup.tabColumns = columns;
					vm.fixedAreaPopup.fields.nameToShow.options = getShowByDefaultOptions(vm.fixedAreaPopup.tabColumns, vm.entityType);

					const bigDrawerWidth = entityViewerHelperService.getBigDrawerWidth(vm.fixedAreaPopup.tabColumns);
					$bigDrawer.setWidth(bigDrawerWidth);

					if (vm.fixedAreaPopup.tabColumns !== 6) {
						bigDrawerResizeButton && bigDrawerResizeButton.classList.remove('display-none');
						bigDrawerResizeButton && bigDrawerResizeButton.classList.add('display-block');
					} else {
						bigDrawerResizeButton && bigDrawerResizeButton.classList.remove('display-block');
						bigDrawerResizeButton && bigDrawerResizeButton.classList.add('display-none');
					}

				}
				// <Victor 2020.11.20 #59 Fixed area popup>

			} else {
				vm.fixedAreaPopup.tabColumns = 6 // in dialog window there are always 2 fields outside of popup
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

        }; */

        vm.transformSourceEntityToFrontendLogic = async function () {

            vm.entity.$_isValid = true;
            var promises = [];
            // vm.readyStatus.entity = true;
            // vm.readyStatus.permissions = true;

            if (![
                'price-history',
                'currency-history',
                'price-history-error',
                'currency-history-error'
            ].includes(vm.entityType)) {

                promises.push(vm.loadPermissions());

            } else {

                vm.readyStatus.permissions = true;
                vm.hasEditPermission = true;

            }

            // vm.getFormLayout();
            promises.push(vm.sharedLogic.getFormLayout(formLayout));

            const resData = await Promise.allSettled(promises);

            const formLayoutDataRes = resData.pop();

            if (formLayoutDataRes.status === 'fulfilled') {

                const formLayoutData = formLayoutDataRes.value;

                vm.typeSelectorOptions = formLayoutData.typeSelectorOptions;
                vm.groupSelectorOptions = formLayoutData.groupSelectorOptions;

                // vm.fixedAreaPopup.fields = formLayoutData.fixedAreaData;
                // vm.originalFixedAreaPopupFields = JSON.parse(JSON.stringify(formLayoutData.fixedAreaData));

                vm.attributeTypes = formLayoutData.attributeTypes;
                vm.entity.attributes = formLayoutData.attributes;

                vm.tabs = formLayoutData.tabs;
                vm.tabColumns = formLayoutData.tabColumns;

                vm.attributesLayout = formLayoutData.attributesLayout;

                vm.footerPopupData = getFooterPopupData(); // have to be called after vm.loadPermissions()

                vm.readyStatus.layout = true;
                vm.readyStatus.entity = true;

            }

            /*
             * DEPRECATED?
             * Resolving promise to inform child about end of editor building
             * resolve();
            */

        }

        vm.getItem = async function () {

            vm.readyStatus.layout = false;
            vm.readyStatus.entity = false;

            if (vm.entityId) {
                vm.entity = await entityResolverService.getByKey(vm.entityType, vm.entityId);

                if (vm.entity?.params && vm.entityType === "portfolio-reconcile-group") {
                    // Merge `params` properties into the main object
                    Object.assign(vm.entity, vm.entity.params);
                    // Remove the `params` key after merging
                    delete vm.entity.params;
                }

                if (
                  vm.entity?.portfolio_reconcile_group_object ||
                  vm.entityType === "portfolio-reconcile-history"
                ) {
                    vm.entity.portfolio_reconcile_group = vm.entity.portfolio_reconcile_group_object.id;
                }
            }
            else if (vm.entityUserCode) {
                vm.entity = await entityResolverService.getByUserCode(vm.entityType, vm.entityUserCode);
            }
            else if (vm.entityType === "transaction") {

                if ( !Number.isInteger(data.transactionCode) ) {
                    throw new Error(
                        "[entityViewerEditDialogController] Error. " +
                        `An invalid transactionCode was passed: ${data.transactionCode}`
                    )
                }

                const opts = {
                    filters: {
                        transaction_code: data.transactionCode,
                    }
                }

                const res = await entityResolverService.getList(vm.entityType, opts);

                if (res.results.length > 1) {
                    throw "[entityViewerEditDialogController getItem] Error " +
                    `Expected 1 object got: ${res.results.length}`;
                }

                vm.entity = res.results[0];

            }

            vm.draftUserCode = vm.generateUserCodeForDraft();

            console.log('vm.entity', vm.entity)

            await vm.transformSourceEntityToFrontendLogic();

            if (vm.entityType === 'instrument') {

                vm.getDataForInstrumentTabs();

                const tabData = await vm.sharedLogic.getDataForInstrumentExposureTab();

                vm.instrumentsSelectorOptions = tabData[0];
                vm.currenciesSelectorOptions = tabData[1];
                vm.readyStatus.exposureTab = true;

            }

        };

        vm.checkReadyStatus = vm.sharedLogic.checkReadyStatus;
        vm.bindFlex = vm.sharedLogic.bindFlex;
        vm.checkFieldRender = vm.sharedLogic.checkFieldRender;

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
                parent: document.querySelector(".dialog-containers-wrap"),
                multiple: true,
                locals: {
                    validationData: {
                        errorData: data,
                        tableColumnsNames: ['Name of fields', 'Error Cause']
                    }
                }
            });

        };

        vm.updateItem = function () {

            console.log('updateItem', vm.entity.$_isValid);

            // TMP save method for instrument

            return new Promise(function (resolve) {

                vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attributeTypes);

                var result = entityEditorHelper.removeNullFields(vm.entity, vm.entityType);

                entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                    resolve(data);

                });

            })

        };

        vm.getEvStateName = vm.sharedLogic.getEvStateName;

        // vm.delete = function ($event) {
        vm.delete = vm.sharedLogic.deleteEntity;

        vm.isFormDisabled = () => {
            return !vm.entity.is_enabled && vm.hasEnabledStatus;
        }

        vm.toggleEnableStatus = function () {

            vm.entity.is_enabled = !vm.entity.is_enabled;

            var enableOpt = vm.footerPopupData.options.find(function (option) {
                return option.key === 'toggle_enable_status';
            });

            enableOpt.icon = vm.entity.is_enabled ? "not_interested" : "check_circle";
            enableOpt.name = vm.entity.is_enabled ? "Disable" : "Enable";

            entityResolverService.getByKey(vm.entityType, vm.entity.id).then(function (result) {

                result.is_enabled = vm.entity.is_enabled;

                entityResolverService.update(vm.entityType, result.id, result).then(function (data) {
                    getEntityStatus();

                    $scope.$apply();
                });
            })


        };

        vm.toggleLockStatus = function () {

            vm.entity.is_locked = !vm.entity.is_locked;

            entityResolverService.getByKey(vm.entityType, vm.entity.id).then(function (result) {

                result.is_locked = vm.entity.is_locked;

                entityResolverService.update(vm.entityType, result.id, result).then(function (data) {
                    getEntityStatus();

                    $scope.$apply();
                });
            })

        };

        vm.entityStatusChanged = function () {

            entityResolverService.getByKey(vm.entityType, vm.entity.id).then(function (result) {

                if (vm.entityType === 'instrument') {

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
            /* FIXED AREA POPUP

            if (vm.fixedAreaPopup.fields.status) {

                vm.fixedAreaPopup.fields.status.value = vm.entityStatus;

            }*/
            // <Victor 2020.11.20 #59 fixed fields popup>

        };

        vm.save = function ($event, isAutoExitAfterSave) {

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

            /* if (entityType === 'instrument-type') {

                vm.entity.accruals.forEach(accrual => {

                    if (accrual.name.trim() === '') {

                        errors.push({
                            fieldName: `#${accrual.order + 1}`,
                            message: 'Empty name',
                            locationData : {type: 'tab', name: 'Accruals', validatorText: 'Tab accruals'}

                        })

                    }

                });

            } */

            if (errors.length) {
                // vm.sharedLogic.processTabsErrors(errors, $event);

                // var processResult = entityEditorHelper.processTabsErrors(errors, vm.evEditorDataService, vm.evEditorEventService, $mdDialog, $event, vm.fixedAreaPopup, vm.entityType, vm.fixedAreaEventObj);
                entityEditorHelper.processTabsErrors(errors, vm.evEditorDataService, vm.evEditorEventService, $mdDialog, $event, vm.entityType, vm.enfEventService);

                /*if (processResult) {
                    vm.fixedAreaPopup = processResult;
                    vm.originalFixedAreaPopupFields = JSON.parse(JSON.stringify(vm.fixedAreaPopup.fields));
                }*/

            } else {

                // var result = entityEditorHelper.removeNullFields(vm.entity);
                var result = entityEditorHelper.clearEntityBeforeSave(vm.entity, vm.entityType);

                if (result && vm.entityType === "portfolio-reconcile-group") {
                    result = {
                        ...result,
                        params: {
                            precision: result.precision,
                            report_ttl: result.report_ttl,
                            only_errors: result.only_errors,
                            round_digits: result.round_digits
                        }
                    }
                    delete result.precision;
                    delete result.report_ttl;
                    delete result.only_errors;
                    delete result.round_digits;
                }

                if (vm.dcLayoutHasBeenFixed) {
                    uiService.updateEditLayout(vm.dataConstructorLayout.id, vm.dataConstructorLayout);
                }

                vm.processing = true;

                entityResolverService.update(vm.entityType, result.id, result).then(function (responseData) {

                    vm.processing = false;

                    if (responseData.status === 400) {
                        vm.handleErrors(responseData);

                    } else {

                        var entityTypeVerbose = vm.entityType.split('-').join(' ').capitalizeFirstLetter();

                        var name = ''

                        if (vm.entity.name) {
                            name = vm.entity.name
                        }

                        toastNotificationService.success(entityTypeVerbose + " " + name + ' was successfully saved');

                        if (isAutoExitAfterSave) {

                            let responseObj = {status: 'agree', data: responseData};
                            metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, responseObj);

                        } else {

                            vm.entity = {...vm.entity, ...responseData};
                            vm.evEditorEventService.dispatchEvent(evEditorEvents.ENTITY_UPDATED);

                            vm.entity.$_isValid = true;
                            $scope.$apply();

                        }


                    }

                }).catch(function (data) {

                    vm.processing = false;
                    vm.handleErrors(data);

                });

            }

        };

        vm.updateLocalInstrument = async function () {

            /*var config = {
                instrument_code: vm.entity.user_code,
                mode: 1
            };

            vm.processing = true;

            importInstrumentCbondsService.download(config).then(function (data) {

                vm.processing = false;

                $scope.$apply();


                if (data.errors.length) {

                    toastNotificationService.error(data.errors[0])


                } else {

                    toastNotificationService.success('Instrument ' + vm.entity.user_code + ' was updated')

                    vm.getItem().then(function () {
                        $scope.$apply();
                    });


                }

            })*/

            try {

                const importData = instrumentService.importFromCbonds(
                    vm.entity.user_code, vm.entity.name, vm.entity.instrument_type_object.user_code
                );

                const res = await importData.promise;

                if (!res.errors) {

                    toastNotificationService.success('Instrument ' + vm.entity.user_code + ' was updated')

                    vm.getItem().then(function () {
                        $scope.$apply();
                    });

                }

            } catch (e) {
                throw e;
            }


        };

        vm.editAsJson = function (option, _$popup) {

            _$popup.cancel();

            vm.sharedLogic.editAsJsonDialog().then(function (res) {

                if (res.status === "agree") {

                    vm.readyStatus.entity = false;

                    vm.getItem().then(function () {
                        vm.evEditorDataService.setEntityAttributeTypes(vm.attributeTypes);
                        $scope.$apply();
                    });

                }
            })

        };

        vm.viewHistory = function (option, _$popup) {

            _$popup.cancel();

            var content_type = metaContentTypesService.findContentTypeByEntity(entityType, null);

            var user_code = null

            if (vm.entity.transaction_unique_code) {
                user_code = vm.entity.transaction_unique_code
            } else if (vm.entity.code) {
                user_code = vm.entity.code
            } else if (vm.entity.user_code) {
                user_code = vm.entity.user_code
            }

            $mdDialog.show({
                controller: 'HistoryDialogController as vm',
                templateUrl: 'views/dialogs/history-dialog-view.html',
                parent: document.querySelector(".dialog-containers-wrap"),
                // targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        id: vm.entity.id,
                        user_code: user_code,
                        content_type: content_type,
                        entityType: vm.entityType
                    }
                }
            })

        }

        vm.editLayout = function (option, _$popup) {

            _$popup.cancel();

            const dataConstructorData = {entityType: vm.entityType};
            if (vm.dataConstructorLayout) dataConstructorData.layoutId = vm.dataConstructorLayout.id;

            $mdDialog.show({
                controller: 'EntityDataConstructorDialogController as vm',
                templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
                parent: document.querySelector(".dialog-containers-wrap"),
                // targetEvent: ev,
                multiple: true,
                locals: {
                    data: dataConstructorData
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.readyStatus.entity = false;
                    vm.readyStatus.layout = false;

                    formLayout = null; // forcing getFormLayout() to download layout from server

                    vm.getItem().then(function () {
                        $scope.$apply();
                    });

                    vm.layoutAttrs = layoutService.getLayoutAttrs();
                    // getEntityAttrs();

                    const attrsData = vm.sharedLogic.getAndApplyEntityAttrs();
                    vm.entityAttrs = attrsData.entityAttributes;
                    vm.fixedFieldsAttributes = attrsData.fixedFieldsAttributes;

                }

            });

        };

        /* vm.getInstrumentUserFields = function () {

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

        }; */

        vm.recalculatePermissions = function ($event) {

            vm.updateItem().then(function (value) {

                var config = {};

                // TODO make it recursive like transaction import

                complexTransactionService.recalculatePermissionTransaction(config).then(function (value) {

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
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

                                return item;

                            })
                        };

                    });

                    entityResolverService.updateBulk('account', accountsWithPermissions).then(function () {

                        $mdDialog.show({
                            controller: 'InfoDialogController as vm',
                            templateUrl: 'views/info-dialog-view.html',
                            parent: document.querySelector('.dialog-containers-wrap'),
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
                                parent: document.querySelector('.dialog-containers-wrap'),
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
                            parent: document.querySelector('.dialog-containers-wrap'),
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

        vm.saveAndApplyPermissionsToInstrumentsByGroup = vm.sharedLogic.saveAndApplyPermissionsToInstrumentsByGroup;
        /** Used inside "PRICING" tab of edit currency form */
        vm.editPricingScheme = function ($event, item) {

            $mdDialog.show({
                controller: 'CurrencyPricingSchemeEditDialogController as vm',
                templateUrl: 'views/dialogs/pricing/currency-pricing-scheme-edit-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
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
            })

        };

        vm.switchPricingPolicyParameter = vm.sharedLogic.switchPricingPolicyParameter;

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

        // vm.getInstrumentPricingSchemes = function () { // TODO Victor. Must removed after introducing new design with grid table.
        //
        //     instrumentPricingSchemeService.getList().then(function (data) {
        //
        //         vm.instrumentPricingSchemes = data.results;
        //
        //         vm.generateInstrumentAttributeTypesByValueTypes();
        //
        //         console.log('instrumentPricingSchemes', vm.instrumentPricingSchemes);
        //
        //         $scope.$apply();
        //
        //     })
        //
        // };

        vm.getEntityPricingSchemes = function () {

            // if (vm.entityType === 'currency') {
            //     vm.getCurrencyPricingSchemes();
            // }
            //
            // if (vm.entityType === 'instrument') {
            //     vm.getInstrumentPricingSchemes();
            // }
            //
            // if (vm.entityType === 'instrument-type') {
            //     vm.getInstrumentPricingSchemes();
            // }

        };

        /* vm.pricingSchemeChange = function (item) {

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
            else if (vm.entityType === 'currency') {

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

        }; */
        vm.pricingSchemeChange = function (pricingPolicy) {
            evHelperService.onPricingSchemeChangeInsidePricingPolicy(pricingPolicy, vm.instrumentPricingSchemes, vm.entity);
        }

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

        vm.typeSelectorChange = null;
        vm.groupSelectorChange = null;

        vm.openPricingMultipleParametersDialog = function ($event, item) {

            $mdDialog.show({
                controller: 'PricingMultipleParametersDialogController as vm',
                templateUrl: 'views/dialogs/pricing/pricing-multiple-parameter-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
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

//  Victor 2020.12.30 transfer t0 pricingPoliciesTabController.js
        /*        vm.runPricingInstrument = function($event) {

                    $mdDialog.show({
                        controller: 'RunPricingInstrumentDialogController as vm',
                        templateUrl: 'views/dialogs/pricing/run-pricing-instrument-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
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
                                parent: document.querySelector('.dialog-containers-wrap'),
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

                };*/

        vm.runPricingCurrency = function ($event) {

            $mdDialog.show({
                controller: 'RunPricingCurrencyDialogController as vm',
                templateUrl: 'views/dialogs/pricing/run-pricing-currency-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
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
                        parent: document.querySelector('.dialog-containers-wrap'),
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

        vm.addPricingPolicy = function () {
            vm.entity.pricing_policies.push({})
        }

        vm.removePricingPolicy = function (item) {
            vm.entity.pricing_policies = vm.entity.pricing_policies.filter(function(policy) {
                return policy !== item;
            });
        }

        vm.getPricingConfigurations = function () {

            configurationService.getList({
                pageSize: 1000,
                page: 1,
                filters: {
                    type: "pricing"
                },
                sort: {
                    direction: "DESC",
                    key: "created_at"
                }
            }).then(function (data) {

                vm.pricingModules = data.results;

                vm.pricingModules = vm.pricingModules.map(function (item) {
                    item._id = item.id;
                    item.id = item.configuration_code;
                    return item
                })
                vm.readyStatus.modules = true;

                $scope.$apply();

            });

        }

        vm.getPricingPolicies = function () {

            pricingPolicyService.getList().then(function (data) {

                vm.pricingPolicies = data.results;
                vm.readyStatus.policies = true;
                $scope.$apply();

            })

        }

        vm.configurePricingModule = function ($event, item) {

            // TODO force entity save before open module configuration iframe dialog

            $mdDialog.show({
                controller: 'ConfigurePricingModuleDialogController as vm',
                templateUrl: 'views/dialogs/configure-pricing-module-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        instrument: vm.entity,
                        instrumentPricingPolicy: item
                    }
                }
            })

        }

        vm.onEntityChange = function (fieldKey) {

            if (fieldKey) {

                var attributes = {
                    entityAttrs: vm.entityAttrs,
                    attrsTypes: vm.attributeTypes
                }

                entityEditorHelper.checkTabsForErrorFields(fieldKey, vm.evEditorDataService, attributes, vm.entity, vm.entityType, vm.tabs);

            }

        };

        vm.onNameInputBlur = function () {

            if (vm.entity.name && !vm.entity.short_name) {
                var entityName = vm.entity.name;
                vm.entity.short_name = entityName;

                $scope.$apply();
            }

        };

        vm.saveBtnDisabled = function () {

            const disabled = !vm.formIsValid || !vm.hasEditPermission || vm.processing;

            if (vm.entityType === 'price-history' || vm.entityType === 'currency-history') {
                return disabled;
            }

            return disabled || !vm.entity.is_enabled;

        };

        /**
         * Set default value for empty dynamic attributes of instrument from instrument type.
         *
         * @param entity {Object}
         * @param dynamicAttributeData {Object}
         */
        const setDynamicAttrValue = function (entity, dynamicAttributeData) {

            var dAttrUserCode = dynamicAttributeData.attribute_type_object.user_code;
            var dAttrValue = evHelperService.getDynamicAttrValue(dynamicAttributeData);

            var notInsideUserTab = !!!entityEditorHelper.getLocationOfAttributeInsideUserTabs(dAttrUserCode, vm.tabs);

            if (notInsideUserTab && (dAttrValue || dAttrValue === 0)) {

                if (dynamicAttributeData.attribute_type_object.value_type === 30) {

                    const EDAIndex = entity.attributes.findIndex(entityDAttr => {
                        return entityDAttr.attribute_type_object.user_code === dAttrUserCode;
                    });

                    entity.attributes[EDAIndex].classifier = dynamicAttributeData.classifier;
                    entity.attributes[EDAIndex].classifier_object = dynamicAttributeData.classifier_object;

                } else {
                    entity.attributes = evHelperService.setDynamicAttrValueByUserCode(dAttrUserCode, entity.attributes, dAttrValue);
                }

            }

            return entity;

        };

        // replace user_code with id
        var exposureProperties = ['co_directional_exposure_currency', 'counter_directional_exposure_currency', 'long_underlying_instrument', 'short_underlying_instrument'];

        var getExposureOptionId = function (exposureProp, userCode) {

            var optionsList = []

            switch (exposureProp) {
                case 'co_directional_exposure_currency':
                case 'counter_directional_exposure_currency':
                    optionsList = vm.currenciesSelectorOptions;
                    break;

                case 'long_underlying_instrument':
                case 'short_underlying_instrument':
                    optionsList = vm.instrumentsSelectorOptions;
                    break;

            }

            var eOption = optionsList.find(function (option) {
                return option.user_code === userCode;
            })

            return eOption.id;

        };

        vm.bookInstrument = function () {

            return new Promise(function (resolve, reject) {
                instrumentTypeService.bookInstrument(vm.entity.instrument_type).then(function (data) {

                    Object.keys(data.instrument).forEach(function (prop) {

                        if (prop === 'attributes') {

                            data.instrument.attributes.forEach(function (dAttr) {

                                vm.entity = setDynamicAttrValue(vm.entity, dAttr);

                            });

                        } else if (['accrual_calculation_schedules', 'event_schedules'].indexOf(prop) < 0) {

                            const notInsideUserTab = !!!entityEditorHelper.getLocationOfAttributeInsideUserTabs(prop, vm.tabs);

                            if (notInsideUserTab && (data.instrument[prop] || data.instrument[prop] === 0)) {

                                if (exposureProperties.includes(prop)) {

                                    vm.entity[prop] = getExposureOptionId(prop, data.instrument[prop]);

                                } else {
                                    vm.entity[prop] = data.instrument[prop];
                                }

                            }

                        }

                    });

                    const result = vm.sharedLogic.mapPermissionsToInstrument(data.instrument_type_object.object_permissions);
                    vm.entity.object_permissions = result.objectPermissions;
                    vm.groups = result.groups;
                    // vm.entity.object_permissions = data.instrument_type_object.object_permissions;
                    vm.evEditorEventService.dispatchEvent(evEditorEvents.ENTITY_UPDATED);

                    resolve()

                })

            })

        }

        // DRAFT STARTED

        vm.generateUserCodeForDraft = function () {

            var contentType = metaContentTypesService.findContentTypeByEntity(vm.entityType);


            if (!vm.entity.id) {
                return contentType + '.new'
            }

            if (vm.entity.user_code) {
                return contentType + '.' + vm.entity.user_code
            }

            return contentType + '.' + vm.entity.id


        }

        vm.exportToDraft = function ($event) {

            var entity = JSON.parse(JSON.stringify(vm.entity));

            return JSON.parse(JSON.stringify(entity))

        }

        vm.applyDraft = async function ($event, data) {

            vm.readyStatus.layout = false;
            vm.readyStatus.entity = false;

            vm.entity = data;

            await vm.transformSourceEntityToFrontendLogic();

            $scope.$apply();

        }

        // DRAFT ENDED

        vm.init = function () {

            setTimeout(function () {
                vm.dialogElemToResize = vm.sharedLogic.onEditorStart();
            }, 100);

            /*vm.groupSelectorEventObj = { // sending signal to crud select that is inside fixed area but outside popup
                event: {}
            };*/

            /*vm.fixedAreaEventObj = { // sending signal to fields that are inside fixed area but outside of popup
                event: {}
            };*/

            vm.enfEventService = new EventService();

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

                vm.typeSelectorChange = function () {

                    vm.bookInstrument().then(function () {

                        vm.sharedLogic.typeSelectorChangeFns[vm.entityType]().then(data => {

                            vm.tabs = data.tabs;
                            vm.attributesLayout = data.attributesLayout;

                            $scope.$apply();

                        });

                    })

                };

            }
            else {

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

            // getEntityAttrs();
            const attrsData = vm.sharedLogic.getAndApplyEntityAttrs();
            vm.entityAttrs = attrsData.entityAttributes;
            vm.fixedFieldsAttributes = attrsData.fixedFieldsAttributes;

            vm.getCurrencies();

            vm.getItem().then(function () {

                getEntityStatus();

                vm.evEditorDataService.setEntityAttributeTypes(vm.attributeTypes);

                /* evHelperService.getFieldsForFixedAreaPopup(vm).then(function (fields) {

                    vm.fixedAreaPopup.fields = fields;
                    vm.originalFixedAreaPopupFields = JSON.parse(JSON.stringify(fields));

                }); */
                $scope.$apply();

            });
            vm.getPricingPolicies();
            vm.getPricingConfigurations();
            vm.readyStatus.content = true;

            vm.activeTab = getTabFromQueryParams();

        };

        vm.init();
        // Special case for split-panel
        /* $scope.splitPanelInit = function (entityType, entityId) {
            vm.entityType = entityType;
            vm.entityId = entityId;
        }; */

        /*vm.onEntityChange = function () {

            console.log("entityChange", vm);

        };*/

    }

}());