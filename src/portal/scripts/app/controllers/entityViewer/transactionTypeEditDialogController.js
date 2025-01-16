/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    // var usersGroupService = require('../../services/usersGroupService');
    // var usersService = require('../../services/usersService');

    var layoutService = require('../../services/entity-data-constructor/layoutService');
    var metaService = require('../../services/metaService').default;

    var gridHelperService = require('../../services/gridHelperService');

    // var ecosystemDefaultService = require('../../services/ecosystemDefaultService');
    var transactionTypeGroupService = require('../../services/transaction/transactionTypeGroupService').default;

    var portfolioService = require('../../services/portfolioService').default;
    var instrumentTypeService = require('../../services/instrumentTypeService').default;
    var referenceTableService = require('../../services/referenceTablesService');
    var complexTransactionService = require('../../services/transaction/complexTransactionService').default;

    var EventService = require("../../services/eventService");

    var GridTableDataService = require('../../services/gridTableDataService');
    var GridTableEventService = require('../../services/gridTableEventService');

    var entityEditorHelper = require('../../helpers/entity-editor.helper');
    var TransactionTypeEditorSharedLogicHelper = require('../../helpers/entityViewer/sharedLogic/transactionTypeEditorSharedLogicHelper');
    var objectComparisonHelper = require('../../helpers/objectsComparisonHelper');
    var metaHelper = require('../../helpers/meta.helper');
    var evHelperService = require('../../services/entityViewerHelperService').default;

    module.exports = function transactionTypeEditDialogController($scope, $mdDialog, $bigDrawer, $state, toastNotificationService, usersService, usersGroupService, ecosystemDefaultService, metaContentTypesService, entityResolverService, transactionTypeService, attributeTypeService, uiService, fieldResolverService, gridTableHelperService, entityType, entityId, data) {

        var vm = this;

        var sharedLogic = new TransactionTypeEditorSharedLogicHelper(vm, $scope, $mdDialog, ecosystemDefaultService, uiService, fieldResolverService, gridTableHelperService);

        vm.entityType = entityType;
        vm.entityId = entityId;
        vm.entityUserCode = null;

        if (data) {

            if (typeof data !== "object") {

                throw new Error(
                    "Invalid value inside 'data' for " +
                    "transactionTypeEditDialogController. Expected an 'object' got: " +
                    `${typeof data} ${data}`
                )

            }

            vm.entityUserCode = data.userCode;

        }

        if ( Number.isNaN(vm.entityId) &&
            (!vm.entityUserCode || typeof vm.entityUserCode !== "string") ) {

            throw new Error("No valid 'id' or 'user_code' provided")

        }

        vm.entity = {};
        // var originalEntity = {};
        vm.complexTransactionOptions = {};

        var originalEntityInputs = null;
        vm.selectorContentTypes = []; // changed by initAfterMainDataLoaded

        vm.processing = false;

        // Creating various variables to use as search terms for filters of repeating md-select components
        vm.searchTerms = {};

        vm.getInputsFilterST = function (name, index) {
            return name + index;
        };
        // < Creating various variables to use as search terms for filters of repeating md-select components >

        vm.readyStatus = {attrs: false, permissions: true, entity: false, layout: false, inputs: false};

        vm.editLayoutEntityInstanceId = null;
        vm.editLayoutByEntityInsance = false;

        vm.currentMember = null;

        // var ecosystemDefaultData = {};

        // Deprecated
        vm.hasEditPermission = true;
        vm.canManagePermissions = true;

        vm.expressionData = {
            groups: [],
            functions: []
        };

        vm.inputsToDelete = [];
        vm.referenceTables = [];
        vm.inputsForMultiselector = [];

        vm.openedIn = data.openedIn;

        // TODO: ME 2023-09-27 delete later
        vm.inputsWithError = [];
        vm.exprInputEventObj = {
            system: [],
            userFields: [],
            actions: {},
        }

        //# region Tabs
        vm.entityTabs = metaService.getEntityTabs(vm.entityType);
        vm.activeTab = null;

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

        vm.onTabSelect = function (tabKey) {

            if (tabKey) {

                const activeTab = vm.entityTabs.find(
                    tabData => tabData.key === tabKey
                );

                if (!activeTab) {
                    throw new Error(`Could not find a system tab with a key: ${tabKey}`);
                }

                vm.activeTab = activeTab;

            } else {
                vm.activeTab = null;
            }

            if (vm.openedIn === "webpage") {

                let tabKey = null;

                if (vm.activeTab?.key) {
                    tabKey = vm.activeTab.key;
                }

                $state.go(
                    $state.current.name,
                    {tab: tabKey},
                    {reload: false, location: 'replace'}
                );

            }

        }

        //# endregion

        // Deprecated
        vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getCurrentMember());
            promises.push(vm.getGroupList());

            Promise.all(promises).then(function (data) {

                console.log('loadPermissions data', data);

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

        // Deprecated
        vm.getGroupList = function () {

            return new Promise(function (resolve, reject) {

                usersGroupService.getList().then(function (data) {

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

                    resolve(vm.groups)

                });

            })

        };

        vm.getCurrentMember = function () {

            return new Promise(function (resolve, reject) {

                usersService.getMyCurrentMember().then(function (data) {

                    vm.currentMember = data;

                    resolve(vm.currentMember);

                });

            })
        };

        // Deprecated
        vm.checkPermissions = function () {

            if (!vm.currentMember) {
                return false // TODO find out why executes before permissions ready
            }

            if (vm.currentMember && vm.currentMember.is_admin) {
                return true
            }

            console.log('vm.currentMember', vm.currentMember);

            var permission_code = "manage_" + vm.entityType.split('-').join('').toLowerCase();

            var haveAccess = false;

            vm.entity.object_permissions.forEach(function (item) {

                if (item.permission === permission_code && vm.currentMember.groups.indexOf(item.group) !== -1) {
                    haveAccess = true;
                }

            });

            return haveAccess;

        };

        vm.cancel = function () {
            metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, {status: 'disagree'});
            //$mdDialog.hide({status: 'disagree'});
        };

        vm.manageAttrs = function (ev) {
            /*var entityType = {entityType: vm.entityType};
            if (vm.fromEntityType) {
                entityType = {entityType: vm.entityType, from: vm.fromEntityType};
            }
            $state.go('app.portal.attributesManager', entityType);
            $mdDialog.hide();*/

            $mdDialog.show({
                controller: 'AttributesManagerDialogController as vm',
                templateUrl: 'views/dialogs/attributes-manager-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        entityType: vm.entityType
                    }
                }
            });
        };

        function removeIdKeyRecursively(data) {
            if (typeof data !== 'object' || data === null) {
                return data;
            }

            // Remove 'id' key if present
            if (data.hasOwnProperty('id')) {
                delete data.id;
            }

            // Recursively process nested objects
            for (const key in data) {
                if (typeof data[key] === 'object') {
                    removeIdKeyRecursively(data[key]);
                }
            }

            return data;
        }

        vm.copy = function (windowType) {

            var entity = JSON.parse(JSON.stringify(vm.entity));

            entity["user_code"] = vm.entity["user_code"] + '_copy';
            entity["name"] = vm.entity["name"] + '_copy';

            console.log('copy entity', entity);

            delete entity.id;
            entity.inputs = entity.inputs.map(function (input){

                return removeIdKeyRecursively(input)

            })
            // TODO fix id recursive removal

            // $mdDialog.hide();
            if (windowType === 'big-drawer') {

                const responseObj = {status: 'copy', data: {entity: entity, entityType: vm.entityType}};
                return metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, responseObj);

            } else {

                $mdDialog.show({
                    controller: 'TransactionTypeAddDialogController as vm',
                    templateUrl: 'views/entity-viewer/transaction-type-add-dialog-view.html',
                    parent: document.querySelector('.dialog-containers-wrap'),
                    // targetEvent: $event,
                    locals: {
                        entityType: vm.entityType,
                        entity: entity,
                        data: {
                            openedIn: 'dialog'
                        }
                    }
                });

                metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, {status: 'copy'});

            }

        };

        vm.copyLinkToEntity = function() {

            const options = {
                entityUserCode: vm.entity.user_code
            };

            if (vm.activeTab?.key) {
                options.tab = vm.activeTab.key;
            }

            evHelperService.copyLinkToEvForm(
                $state,
                "app.portal.data.transaction-type-edition",
                toastNotificationService,
                options
            );

        }

        vm.getLayout = function () {

            uiService.getEditLayoutByKey(vm.entityType).then(function (data) {

                if (data.results.length) {
                    vm.tabs = data.results[0].data;

                } else {
                    vm.tabs = uiService.getDefaultEditLayout(vm.entityType)[0].data;

                }

                vm.readyStatus.layout = true;

                $scope.$apply();

            });

        };

        vm.attrs = [];
        vm.entityAttrs = [];
        vm.userInputs = [];
        vm.layoutAttrs = [];

        vm.entityAttrs = [];
        vm.range = gridHelperService.range;

        vm.transactionUserFields = {};
        vm.transactionUserFieldsState = {};

        vm.getTransactionUserFields = sharedLogic.getTransactionUserFields;
        vm.updateContextParameters = sharedLogic.updateContextParametersFunctions;

        vm.transformSourceEntityToFrontendLogic = function (){

            vm.expressionData = sharedLogic.updateInputFunctions();
            vm.updateContextParameters();

            if (vm.entity.inputs) {

                vm.entity.inputs.forEach(function (input) {

                    if (!input.settings) {
                        input.settings = {}
                    }

                    if (input.settings.linked_inputs_names) {

                        input.settings.linked_inputs_names = input.settings.linked_inputs_names.split(',')

                    } else {
                        input.settings.linked_inputs_names = []
                    }

                    if (input.settings.recalc_on_change_linked_inputs) {

                        input.settings.recalc_on_change_linked_inputs = input.settings.recalc_on_change_linked_inputs.split(',')

                    } else {
                        input.settings.recalc_on_change_linked_inputs = []
                    }

                    vm.resolveDefaultValue(input)

                });

            }


            if (vm.entity.inputs) {
                originalEntityInputs = JSON.parse(angular.toJson(vm.entity.inputs));
            }

            return new Promise(function (resolve, reject) {

                vm.getTransactionUserFields().then(function () {

                    vm.readyStatus.entity = true;
                    vm.readyStatus.permissions = true;

                    // vm.loadPermissions();

                    vm.readyStatus.layout = true;
                    $scope.$apply();

                    // sharedLogic.setStateInActionsControls();
                    vm.entity.actions = sharedLogic.formatActionsForFrontend();

                    vm.paneActionsMenuPopups = vm.createSelectorPopupDataForActions();

                    resolve();


                }).catch(function (error) { reject(error) });

            })

        }

        vm.getItem = async function () {

            let res;

            if (vm.entityId) {
                res = await transactionTypeService.getByKey(vm.entityId);

            }
            else if (vm.entityUserCode) {
                res = await entityResolverService.getByUserCode(vm.entityType, vm.entityUserCode);
            }

            vm._original_entity = JSON.parse(JSON.stringify(res));

            vm.entity = res;

            vm.draftUserCode = vm.generateUserCodeForDraft();

            await vm.transformSourceEntityToFrontendLogic();

        };

        vm.getAttrs = function () {
            return attributeTypeService.getList(vm.entityType, {pageSize: 1000}).then(function (data) {
                vm.attrs = data.results;

                console.log('vm.attrs', vm.attrs);

                vm.readyStatus.attrs = true;
            });
        };

        /*vm.checkReadyStatus = function () {
            return vm.readyStatus.attrs && vm.readyStatus.entity && vm.readyStatus.permissions && vm.readyStatus.layout && vm.readyStatus.inputs;
        };*/
        vm.checkMainDataReadyStatus = sharedLogic.checkMainDataReadyStatus;

        vm.updateEntityBeforeSave = function (entity) {

            // var updatedEntity = JSON.parse(JSON.stringify(entity));

            if (entity.attributes) {

                entity.attributes.forEach(function (attribute) {

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

            entity.object_permissions = [];

            // code that should be working for Add and Edit complex transaction, add to sharedLogic.updateEntityBeforeSave()
            return sharedLogic.updateEntityBeforeSave(entity);

        };

        const validateTType = async function (entityBeforeSave, proceedButton) {

            const result = sharedLogic.validateTType(entityBeforeSave, vm.inputsToDelete, vm.exprInputEventObj);
            vm.exprInputEventObj = result.exprInputEventObj;

            if (!result.errorsList.length) {
                return;
            }

            // calls $mdDialog.show({});
            return sharedLogic.openErrorsDialog(result.errorsList, proceedButton);

        }

        vm.validateTTypeView = function () {

            let entityBeforeSave = JSON.parse(angular.toJson(vm.entity));
            entityBeforeSave = vm.updateEntityBeforeSave(entityBeforeSave);

            validateTType(entityBeforeSave, false);

        }

        vm.save = function () {

            var saveTTypePromise = new Promise(function (resolve, reject) {

                /*var entityToSave = JSON.parse(JSON.stringify(vm.entity));
                entityToSave = vm.updateEntityBeforeSave(entityToSave);

                var actionsErrors = sharedLogic.checkActionsForEmptyFields(entityToSave.actions);
                var inputsErrors = sharedLogic.validateInputs(entityToSave.inputs);
                actionsErrors = actionsErrors.concat(inputsErrors);

                var entityErrors = sharedLogic.checkEntityForEmptyFields(entityToSave);

                new Promise(function (resolve, reject) {

                    if (actionsErrors.length || entityErrors.length) {

                        $mdDialog.show({
                            controller: 'TransactionTypeValidationErrorsDialogController as vm',
                            templateUrl: 'views/entity-viewer/transaction-type-validation-errors-dialog-view.html',
                            parent: document.querySelector('.dialog-containers-wrap'),
                            clickOutsideToClose: false,
                            multiple: true,
                            locals: {
                                data: {
                                    actionErrors: actionsErrors,
                                    entityErrors: entityErrors
                                }
                            }
                        }).then(function (data) {

                            if (data.status === 'agree') {
                                resolve()
                            } else {
                                reject()
                            }

                        })


                    } else {
                        resolve()
                    }


                })*/
                var entityToSave = JSON.parse(JSON.stringify(vm.entity));
                entityToSave = vm.updateEntityBeforeSave(entityToSave);

                validateTType(entityToSave, true)
                    .then(function () {
                        // validation passed
                        vm.processing = true;

                        transactionTypeService.update(entityToSave.id, entityToSave).then(function (data) {

                            originalEntityInputs = JSON.parse(angular.toJson(vm.entity.inputs));
                            vm.entity.object_permissions = data.object_permissions;

                            vm.processing = false;
                            $scope.$apply();

                            if (data.status !== 400) {

                                toastNotificationService.success("Transaction Type " + vm.entity.name + ' was successfully saved');

                                resolve(data)

                            }

                        })
                        .catch(function (error) {

                            console.log('error', error);

                            vm.processing = false;

                            $scope.$apply();

                            reject()

                        });


                    })

            });

            var removeDeletedInputsPromise = removeInputFromEditLayout();

            return Promise.all([saveTTypePromise, removeDeletedInputsPromise]);

        };

        vm.saveAndExit = function () {

            vm.save().then(function (data) {
                let responseObj = {status: 'agree', data: data};
                metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, responseObj);
            })

        };

        /*vm.getReferenceTables = function () {
            return referenceTableService.getList().then(function (data) {

                vm.referenceTables = data.results.map(function (rTable) {
                    return {id: rTable.name, name: rTable.name};
                });
                /!*vm.referenceTables = data.results;

                console.log('vm.referenceTables', vm.referenceTables);

                $scope.$apply();*!/

            })
        };*/

        vm.recalculatePermissions = function ($event) {

            console.log("Recalculate");

            var config = {
                // content_type: 'portfolios.portfolio'
            };

            // TODO make it recursive like transaction import

            complexTransactionService.recalculatePermissionComplexTransaction(config).then(function (value) {

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
                            description: "Complex Transaction Permissions successfully recalculated"
                        }
                    }
                });

                console.log("Recalculate done");

            })

        };

        var openEditLayoutDialog = function (ev) {
            $mdDialog.show({
                controller: 'EntityDataConstructorDialogController as vm',
                templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
                parent: document.querySelector(".dialog-containers-wrap"),
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        entityType: 'complex-transaction',
                        fromEntityType: vm.entityType,
                        instanceId: vm.entityId
                    }
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.readyStatus.attrs = false;
                    vm.readyStatus.entity = false;
                    vm.readyStatus.layout = false;

                    vm.getItem();
                    vm.getAttrs();

                    vm.layoutAttrs = layoutService.getLayoutAttrs();
                    vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

                }

            });
        };

        vm.editLayout = function (ev) {

            var entityInputs = JSON.parse(angular.toJson(vm.entity.inputs));

            if (objectComparisonHelper.areObjectsTheSame(originalEntityInputs, entityInputs)) {

                openEditLayoutDialog(ev);

            } else {

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/dialogs/warning-dialog-view.html',
                    parent: document.querySelector('.dialog-containers-wrap'),
                    clickOutsideToClose: false,
                    multiple: true,
                    locals: {
                        warning: {
                            title: 'Warning',
                            description: "You have made changes in tab INPUTS. You need to save those changes before editing Transaction Form",
                            actionsButtons: [{
                                name: "Save Transaction Type",
                                response: {status: 'agree'}
                            },
                                {
                                    name: "Cancel",
                                    response: false
                                }]
                        }
                    }

                }).then(function (res) {

                    if (res.status === 'agree') {

                        vm.save().then(function () {

                            openEditLayoutDialog(ev);

                        });

                    }

                });

            }

        };

        vm.editAsJson = function (ev) {

            $mdDialog.show({
                controller: 'EntityAsJsonEditorDialogController as vm',
                templateUrl: 'views/dialogs/entity-as-json-editor-dialog-view.html',
                parent: document.querySelector(".dialog-containers-wrap"),
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        item: vm._original_entity,
                        entityType: vm.entityType,
                    }
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.getItem().then(function () {
                        $scope.$apply();
                    });

                }
            })

        }

        // Transaction type General Controller start

        vm.entity.book_transaction_layout = vm.entity.book_transaction_layout || '';
        vm.entity.actions = vm.entity.actions || [];
        vm.entity.inputs = vm.entity.inputs || [];
        vm.entity.context_parameters = sharedLogic.getContextParameters();

        vm.readyStatus = {transactionTypeGroups: false, instrumentTypes: false, portfolios: false};

        vm.getTransactionTypeGroups = function () {
            transactionTypeGroupService.getList().then(function (data) {
                vm.transactionTypeGroups = data.results;
                vm.readyStatus.transactionTypeGroups = true;
                $scope.$apply();
            })
        };

        vm.getPortfolios = function () {
            portfolioService.getList().then(function (data) {
                vm.portfolios = data.results;
                vm.readyStatus.portfolios = true;
                $scope.$apply();
            })
        };

        vm.getInstrumentTypes = function () {
            instrumentTypeService.getListLight().then(function (data) {
                vm.instrumentTypes = data.results;
                vm.readyStatus.instrumentTypes = true;
                $scope.$apply();
            })
        };

        vm.unselectAllEntities = function (entity) {

            if (entity === 'instruments') {

                if (vm.entity.is_valid_for_all_instruments) {
                    vm.entity.instrument_types = [];
                }

            } else if (entity === 'portfolios') {

                if (vm.entity.is_valid_for_all_portfolios) {
                    vm.entity.portfolios = [];
                }

            }
        };

        vm.notValidForAll = function (entity) {
            if (entity === 'instruments') {

                if (vm.entity.instrument_types && vm.entity.instrument_types.length > 0) {
                    vm.entity.is_valid_for_all_instruments = false;
                }

            } else if (entity === 'portfolios') {

                if (vm.entity.portfolios && vm.entity.portfolios.length > 0) {
                    vm.entity.is_valid_for_all_portfolios = false;
                }

            }

            $scope.$apply();
        };

        vm.contextProperties = sharedLogic.getContextProperties();
        vm.relationItems = {};
        vm.valueTypes = sharedLogic.getValueTypes();
        vm.contentTypes = metaContentTypesService.getListForTransactionTypeInputs();

        /* vm.bindValueType = function (row) { // TODO delete
            var name;

            vm.valueTypes.forEach(function (item) {
                if (row.value_type == item.id) {
                    row.value_type_name = item.name;
                    name = item.name;
                }
            });

            return name;
        };

        vm.bindContentType = function (row) {
            var name;
            vm.contentTypes.forEach(function (item) {
                if (row.content_type == item.key) {
                    row.content_type_name = item.name;
                    name = item.name
                }
            });
            return name;
        }; */

        /* vm.resolveRelation = function (contentType) {

            var entityKey;

            for (var i = 0; i < vm.contentTypes.length; i++) {

                if (vm.contentTypes[i].key === contentType) {
                    entityKey = vm.contentTypes[i].entity;

                    if (entityKey === 'strategy-1') {
                        return 'strategy1'
                    } else if (entityKey === 'strategy-2') {
                        return 'strategy2'
                    } else if (entityKey === 'strategy-3') {
                        return 'strategy3'
                    } else {

                        entityKey = entityKey.replace(/-/g, '_');

                        return entityKey;

                    }
                }
            }

        }; */

        vm.resolveRelation = sharedLogic.resolveRelation;

        vm.resolveDefaultValue = function (item) {

            // console.log('vm.resolveDefaultValue.item', item);
            var entityKey = '';

            vm.contentTypes.forEach(function (contentType) {
                if (item.content_type === contentType.key) {
                    entityKey = contentType.entity;
                }
            });

            if (entityKey === 'strategy-1') {
                entityKey = 'strategy1'
            } else if (entityKey === 'strategy-2') {
                entityKey = 'strategy2'
            } else if (entityKey === 'strategy-3') {
                entityKey = 'strategy3'
            } else {
                entityKey = entityKey.replace(/-/g, '_');
            }

            var obj_from_input = item[entityKey + '_object'];

            if (obj_from_input) {

                if (!vm.relationItems[entityKey]) {
                    vm.relationItems[entityKey] = [];
                }

                var exist = false;

                /* vm.relationItems[entityKey].forEach(function (item) {

                    if (item.user_code) {
                        if (item.user_code === obj_from_input.user_code) {
                            exist = true;
                        }
                    }

                }); */
                vm.relationItems[entityKey].forEach(function (item) {

                    if (item.id && item.id === obj_from_input.user_code) {
                        exist = true;
                    }

                });

                if (!exist) {
                    vm.relationItems[entityKey].push(obj_from_input)
                }

            }

        }

        // Transaction Type tab INPUTS

        vm.delete = function ($event) {

            $mdDialog.show({
                controller: 'EntityViewerDeleteDialogController as vm',
                templateUrl: 'views/entity-viewer/entity-viewer-entity-delete-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
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
                    let responseObj = {status: 'delete'};
                    metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, responseObj);
                }

            })

        };

        var removeInputFromEditLayout = function () {

            return new Promise(function (resolve, reject) {

                if (vm.inputsToDelete.length > 0) {

                    transactionTypeService.getByKey(vm.entityId).then(function (data) {

                        var book_transaction_layout = data.book_transaction_layout;

                        if (book_transaction_layout && book_transaction_layout.data) {

                            if (Array.isArray(book_transaction_layout.data)) {
                                var editLayoutTabs = book_transaction_layout.data;
                            } else {
                                var editLayoutTabs = book_transaction_layout.data.tabs;
                            }

                            editLayoutTabs.forEach(function (tab) {

                                for (var i = 0; i < tab.layout.fields.length; i++) {
                                    var field = tab.layout.fields[i];

                                    if (field.attribute_class === "userInput" && vm.inputsToDelete.indexOf(field.name) !== -1) {
                                        tab.layout.fields[i] = {
                                            colspan: field.colspan,
                                            column: field.column,
                                            editMode: false,
                                            row: field.row,
                                            type: "empty"
                                        }
                                    }

                                }

                            });

                            transactionTypeService.patch(vm.entityId, {
                                book_transaction_layout: book_transaction_layout
                            }).then(function () {
                                resolve();
                            }).catch(function (error) {
                                reject(error);
                            });

                        } else {
                            reject();
                        }

                    });

                } else {
                    resolve();
                }

            });

        };

        /*vm.deleteInput = function (item, index, $event) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                multiple: true,
                skipHide: true,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Please note that in Action all links to this input will be deleted. Expressions will not be affected, so you would need to amend them manually.",
                        actionsButtons: [
                            {
                                name: "OK, PROCEED",
                                response: {status: 'agree'}
                            },
                            {
                                name: "CANCEL",
                                response: {status: 'disagree'}
                            }
                        ]
                    }
                }
            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.entity.inputs.splice(index, 1);
                    vm.updateInputFunctions();
                    removeInputFromActions(item.name);

                }

            });

        };*/

        vm.openExpressionDialog = function ($event, item, options) {

            $mdDialog.show({
                controller: 'ExpressionEditorDialogController as vm',
                templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: {expression: item[options.key]}
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                    item[options.key] = res.data.item.expression;
                }
                // console.log('item', item);
            });
        };

        /* TODO delete. Does not needed after grid table implementation
         vm.valueTypeChanged = function (item) {

            item.content_type = null;
            item.is_fill_from_context = false;
            item.context_property = null;

            if (item.value_type === 100) {
                item.content_type = "accounts.account";
            }

        }; */

        /* vm.validateInputName = function () {

            var errorText = "";

            if (vm.newItem.name.match('[^1-9a-zA-Z_]')) {
                errorText = "Only english letters and 1-9 numbers allowed for input name.";
            }

            if (vm.newItem.name.match('^[0-9]')) {
                if (errorText) {
                    errorText += "\n";
                }

                errorText += "Input name should not start with number.";
            }

            return errorText;

        };

        vm.addRow = function ($event) {

            if (vm.newItem.name && vm.newItem.value_type) {

                var inputNameErrors = vm.validateInputName();

                if (!inputNameErrors) {

                    vm.entity.inputs.push({
                        name: vm.newItem.name,
                        verbose_name: vm.newItem.verbose_name,
                        value_type: vm.newItem.value_type,
                        content_type: vm.newItem.content_type,
                        is_fill_from_context: vm.newItem.is_fill_from_context,
                        reference_table: vm.newItem.reference_table,
                        account: vm.newItem.account,
                        instrument_type: vm.newItem.instrument_type,
                        instrument: vm.newItem.instrument,
                        currency: vm.newItem.currency,
                        counterparty: vm.newItem.counterparty,
                        responsible: vm.newItem.responsible,
                        portfolio: vm.newItem.portfolio,
                        strategy1: vm.newItem.strategy1,
                        strategy2: vm.newItem.strategy2,
                        strategy3: vm.newItem.strategy3,
                        daily_pricing_model: vm.newItem.daily_pricing_model,
                        payment_size_detail: vm.newItem.payment_size_detail,
                        price_download_scheme: vm.newItem.price_download_scheme,
                        pricing_policy: vm.newItem.pricing_policy,
                        value: vm.newItem.value,
                        value_expr: vm.newItem.value_expr
                    });

                    // if created input with name of deleted one, remove it from warning
                    for (var i = 0; i < vm.inputsToDelete.length; i++) {
                        var inputToDelete = vm.inputsToDelete[i];

                        if (inputToDelete === vm.newItem.name) {
                            vm.inputsToDelete.splice(i, 1);
                            break;
                        }
                    }
                    // < if created input with name of deleted one, remove it from warning >

                    vm.newItem.name = null;
                    vm.newItem.verbose_name = null;
                    vm.newItem.value_type = null;
                    vm.newItem.content_type = null;
                    vm.newItem.is_fill_from_context = false;
                    vm.newItem.reference_table = null;
                    vm.newItem.account = null;
                    vm.newItem.instrument_type = null;
                    vm.newItem.instrument = null;
                    vm.newItem.currency = null;
                    vm.newItem.counterparty = null;
                    vm.newItem.responsible = null;
                    vm.newItem.portfolio = null;
                    vm.newItem.strategy1 = null;
                    vm.newItem.strategy2 = null;
                    vm.newItem.strategy3 = null;
                    vm.newItem.daily_pricing_model = null;
                    vm.newItem.payment_size_detail = null;
                    vm.newItem.price_download_scheme = null;
                    vm.newItem.pricing_policy = null;
                    vm.newItem.value = null;
                    vm.newItem.value_expr = null;

                    vm.updateInputFunctions();

                } else {

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/dialogs/warning-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        multiple: true,
                        locals: {
                            warning: {
                                title: 'Warning',
                                description: inputNameErrors,
                                actionsButtons: [
                                    {
                                        name: 'CLOSE',
                                        response: false
                                    }
                                ]
                            }
                        }
                    });

                }

            } else {

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/dialogs/warning-dialog-view.html',
                    parent: document.querySelector('.dialog-containers-wrap'),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    multiple: true,
                    locals: {
                        warning: {
                            title: 'Warning',
                            description: "Please, fill in 'Name' and 'Value type' fields.",
                            actionsButtons: [
                                {
                                    name: 'CLOSE',
                                    response: false
                                }
                            ]
                        }
                    }
                });

            }

        };
        */

        // < Transaction Type tab INPUTS >

        // Transaction Type Recon start

        vm.addReconField = function () {

            vm.entity.recon_fields.push(Object.assign({}, vm.newReconField));

            vm.newReconField = {};

        };

        vm.deleteReconField = function ($event, $index) {

            vm.entity.recon_fields.splice($index, 1);

        };

        // Transaction Type Recon end

        //region Transaction type Actions controller

        vm.relationItems = {};

        vm.onActionAccordionCollapse = sharedLogic.onActionAccordionCollapse;
        vm.toggleItem = sharedLogic.toggleItem;

        vm.getActionTypeName = sharedLogic.getActionTypeName;

        vm.rebookInstrumentReactions = [
            {
                name: "Create Instrument. If exists: Overwrite",
                id: 2
            },
            {
                name: "If exists: Phantom = existing Instrument. If not exists: create Instrument",
                id: 0
            },
            {
                name: "Find the Instrument. If not found: create on the first booking. On rebook: nothing is created, Phantom = Default Instrument.",
                id: 5
            },
            {
                name: 'Try to download from provider, if error, create default',
                id: 8
            }
        ];

        vm.rebookOtherReactions = [
            {
                name: "Append",
                id: 0
            },
            {
                name: "If book: Append. If rebook: Skip",
                id: 4
            },
            {
                name: "Clear & Append",
                id: 3
            },
            {
                name: "If book: Clear & Append. If rebook: Skip",
                id: 6
            },
            {
                name: "Clear",
                id: 7
            }
        ];

        vm.instrumentTypeTransactionTypes = [
            {
                name: 'One Off Event',
                id: 'one_off_event'
            },
            {
                name: 'Regular Event',
                id: 'regular_event'
            },
            {
                name: 'Factor up',
                id: 'factor_up'
            },
            {
                name: 'Factor same',
                id: 'factor_same'
            },
            {
                name: 'Factor down',
                id: 'factor_down'
            }
        ];

        vm.resetProperty = function (item, propertyName, fieldName) {

            item[propertyName][fieldName] = null;
            item[propertyName][fieldName + '_input'] = null;

        };

        vm.onActionMultitypeFieldToggle = sharedLogic.onActionMultitypeFieldToggle;
        vm.onMultitypeFieldValChange = sharedLogic.onMultitypeFieldValChange;

        vm.actionsMultitypeFieldsList = [];
        vm.eventPhantomsOpts = [];
        vm.paneActionsMenuPopups = [];

        // vm.createActionsMenuPopupsList
        vm.createSelectorPopupDataForActions = sharedLogic.createSelectorPopupDataForActions;

        /* vm.deletePane = function ($index, $event) {

            $event.stopPropagation();
            var description = 'Are you sure to delete this action?';

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                multiple: true,
                skipHide: true,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: description
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    vm.entity.actions.splice($index, 1);

                    vm.clearPhantoms();
					vm.createActionsMenuPopupsList();

                }
            });
        }; */

        vm.clearPhantoms = function () {

            console.log('vm.clearPhantoms');

            var count = 0;

            vm.entity.actions.forEach(function (action) {

                Object.keys(action).forEach(function (actionKey) {

                    if (action[actionKey]) {
                        Object.keys(action[actionKey]).forEach(function (key) {

                            if (key.indexOf("phantom") !== -1) {
                                action[actionKey][key] = null
                                count = count + 1
                            }

                        })
                    }


                })

            });

            if (count > 0) {

                toastNotificationService.warning(count + " phantom inputs were reseted")
            }

        };

        vm.generateOperationPopupData = sharedLogic.generateOperationPopupData;
        vm.generateInstrumentOperationPopupData = sharedLogic.generateInstrumentOperationPopupData;

        vm.getActionPaneId = sharedLogic.getActionPaneId;

        /* vm.makeCopyOfAction = function (actionToCopy, index, $event) {

            $event.stopPropagation();
            var actionCopy = JSON.parse(JSON.stringify(actionToCopy));

            delete actionCopy.$$hashKey;
            delete actionCopy.id;
            delete actionCopy.order;

            var actionName = actionCopy.action_notes + ' (Copy)';
            var actionNameOccupied = true;

            var c = 1;
            while (actionNameOccupied) { // check that copy name is unique

                actionNameOccupied = false;

                for (var a = 0; a < vm.entity.actions.length; a++) {

                    if (vm.entity.actions[a].action_notes === actionName) {

                        c = c + 1;
                        actionName = actionCopy.action_notes + ' (Copy ' + c + ')';
                        actionNameOccupied = true;

                        break;

                    }

                }

                if (!actionNameOccupied) {
                    actionCopy.action_notes = actionName;

                    if (actionCopy.transaction && actionCopy.transaction.hasOwnProperty('action_notes')) {
                        actionCopy.transaction.action_notes = actionName;
                    }

                    if (actionCopy.instrument) {
                        actionCopy.instrument.action_notes = actionName;
                    }

                }

            }

            vm.accordion.collapseAll();

            actionCopy.isPaneExpanded = true;

            vm.entity.actions.splice(index + 1, 0, actionCopy);

            vm.findPhantoms();

            vm.paneActionsMenuPopups = vm.createActionsMenuPopupsList();

        }; */

        vm.moveDown = sharedLogic.moveDown;
        vm.moveUp = sharedLogic.moveUp;

        /* vm.setTransactionInstrumentInput = function (item, name, prop) {

            if (prop == 'instrument') {
                item.transaction.instrument_input = name;
                item.transaction.instrument_phantom = null;
                item.transaction.instrument = null;
            }

            if (prop == 'linked_instrument') {
                item.transaction.linked_instrument_input = name;
                item.transaction.linked_instrument_phantom = null;
                item.transaction.linked_instrument = null;
            }

            if (prop == 'allocation_pl') {
                item.transaction.allocation_pl_input = name;
                item.transaction.allocation_pl_phantom = null;
                item.transaction.allocation_pl = null;
            }

            if (prop == 'allocation_balance') {
                item.transaction.allocation_balance_input = name;
                item.transaction.allocation_balance_phantom = null;
                item.transaction.allocation_balance = null;
            }
        };

        vm.setTransactionInstrumentPhantom = function (item, positionOrder, prop) {

            if (prop == 'instrument') {
                item.transaction.instrument_input = null;
                item.transaction.instrument_phantom = positionOrder;
                item.transaction.instrument = null;
            }

            if (prop == 'linked_instrument') {
                item.transaction.linked_instrument_input = null;
                item.transaction.linked_instrument_phantom = positionOrder;
                item.transaction.linked_instrument = null;
            }

            if (prop == 'allocation_pl') {
                item.transaction.allocation_pl_input = null;
                item.transaction.allocation_pl_phantom = positionOrder;
                item.transaction.allocation_pl = null;
            }

            if (prop == 'allocation_balance') {
                item.transaction.allocation_balance_input = null;
                item.transaction.allocation_balance_phantom = positionOrder;
                item.transaction.allocation_balance = null;
            }

        }; */

        vm.setItemInstrumentInput = function (item, key, name, prop) {

            if (prop === 'instrument') {
                item[key].instrument_input = name;
                item[key].instrument_phantom = null;
                item[key].instrument = null;
            }
        };

        vm.setItemInstrumentPhantom = function (item, key, positionOrder, prop) {

            if (prop === 'instrument') {
                item[key].instrument_input = null;
                item[key].instrument_phantom = positionOrder;
                item[key].instrument = null;
            }

        };

        vm.loadRelation = sharedLogic.loadRelation;

        vm.getNameByValueType = function (value) {

            for (var i = 0; i < vm.valueTypes.length; i++) {
                if (vm.valueTypes[i].id === value) {
                    return vm.valueTypes[i].name;
                }
            }

        };

        vm.getNameByContentType = function (contentType) {
            var typeName = '';
            vm.contentTypes.forEach(function (cType) {
                if (cType.key === contentType) {
                    typeName = cType.name;
                }
            });

            return typeName;
        };
        //endregion Transaction type Actions controller


        // Special case for split-panel
        $scope.splitPanelInit = function (entityType, entityId) {
            vm.entityType = entityType;
            vm.entityId = entityId;
        };


        /* vm.getInputTemplates = function () {

            vm.readyStatus.input_templates = false;

            return uiService.getTemplateLayoutList({filters: {type: 'input_template'}}).then(function (data) {

                vm.inputTemplates = data.results;

                vm.readyStatus.input_templates = true;

                $scope.$apply();

            })

        }; */

        vm.getFieldTemplates = function () {

            vm.readyStatus.field_templates = false;

            return uiService.getTemplateLayoutList({filters: {type: 'field_template'}}).then(function (data) {

                vm.fieldTemplates = data.results;

                vm.readyStatus.field_templates = true;

                $scope.$apply();

            })

        };

        vm.getActionTemplates = function () {

            vm.readyStatus.action_templates = false;

            return new Promise(function (res) {

                sharedLogic.getActionTemplates().then(function (actionTemplatesData) {

                    vm.actionTemplatesPopupData = actionTemplatesData;

                    vm.readyStatus.action_templates = true;
                    $scope.$apply();

                    res();

                }).catch(function (error) {
                    res()
                });

            });

        };

        /* vm.appendFromTemplate = function ($event, template) {

            //console.log("Append from Template", template);

            if (template.type === 'input_template') {

                $mdDialog.show({
                    controller: 'InputTemplateLayoutViewerDialogController as vm',
                    templateUrl: 'views/dialogs/input-template-layout-viewer-dialog-view.html',
                    targetEvent: $event,
                    locals: {
                        data: {
                            template: template
                        }
                    },
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true
                }).then(function (res) {

                    if (res.status === 'agree') {

                        var template = res.data.template;

                        template.data.inputs.forEach(function (input) {

                            vm.entity.inputs.push(input);

                        })

                    }

                })

            }

            if (template.type === 'field_template') {

                Object.keys(vm.entity).forEach(function (key) {

                    if (key.indexOf('user_text_') !== -1) {
                        vm.entity[key] = '';
                    }

                    if (key.indexOf('user_number_') !== -1) {
                        vm.entity[key] = '';
                    }

                    if (key.indexOf('user_date_') !== -1) {
                        vm.entity[key] = '';
                    }

                });

                Object.keys(template.data.fields).forEach(function (key) {
                    vm.entity[key] = template.data.fields[key];
                })

            }

            if (template.type === 'action_template') {

                var actionsToAdd = template.data.actions.map(function (action) {

                    Object.keys(action).forEach(function (key) {

                        if (typeof action[key] === 'object' && action[key] !== null) {

                            Object.keys(action[key]).forEach(function (actionItemKey) {

                                if (action[key].hasOwnProperty(actionItemKey + '_input')) {

                                    if (action[key].hasOwnProperty(actionItemKey + '_field_type')) {
                                        /!*if (action[key][actionItemKey + '_field_type'] === 'relation') { // turn on matching regime for field
                                            action[key][actionItemKey + '_toggle'] = true;

                                            setDefaultValueForRelation(action, key, actionItemKey);
                                        }*!/
                                        action[key][actionItemKey + '_toggle'] = true;

                                        setDefaultValueForRelation(action, key, actionItemKey);

                                        delete action[key][actionItemKey + '_field_type']; // remove template specific properties before adding actions
                                    }

                                }

                            })

                        }

                    });

                    return action;
                });

                vm.entity.actions = vm.entity.actions.concat(actionsToAdd);

            }

        }; */
        vm.appendFromTemplate = sharedLogic.appendFromTemplate;
        vm.saveAsTemplate = sharedLogic.saveAsTemplate;

        vm.recalculateUserFields = function ($event, key) {

            transactionTypeService.recalculateUserFields(vm.entity.id, {
                transaction_type_id: vm.entity.id,
                key: key
            }).then(function (data) {

                toastNotificationService.success("User field " + key + " of Transaction Type " + vm.entity.name + ' was successfully recalculated');

            })

        }

        //# region User fields
        vm.userTextFields = [];
        vm.userNumberFields = [];
        vm.userDateFields = [];

        for (var i = 1; i <= 30; i = i + 1) {
            vm.userTextFields.push({
                key: 'user_text_' + i
            })
        }

        for (var i = 1; i <= 20; i = i + 1) {
            vm.userNumberFields.push({
                key: 'user_number_' + i
            })
        }

        for (var i = 1; i <= 5; i = i + 1) {
            vm.userDateFields.push({
                key: 'user_date_' + i
            })
        }
        //# endregion User fields

        //region Context Parameters tab
        vm.deleteContextParameter = sharedLogic.deleteContextParameter
        vm.addContextParameter = sharedLogic.addContextParameter;
        //endregion Context Parameters tab

        //# region DRAFT STARTED

        vm.generateUserCodeForDraft = function (){

            if (!vm.entity.id) {
                return 'transactions.transactiontype.new'
            }

            return 'transactions.transactiontype.' + vm.entity.user_code

        }

        vm.exportToDraft = function ($event) {

            var entityToSave = JSON.parse(JSON.stringify(vm.entity));
            entityToSave = vm.updateEntityBeforeSave(entityToSave);

            return JSON.parse(JSON.stringify(entityToSave))

        }

        vm.applyDraft = function ($event, data) {

            console.log('applyDraft', data);

            vm.readyStatus.inputs = false;
            vm.readyStatus.entity = true;
            vm.readyStatus.permissions = true;
            vm.readyStatus.layout = true;

            vm.entity = data;
            vm.transformSourceEntityToFrontendLogic();


            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.ttypeEditorElemToDrag');
            });

            vm.actionsMFEventService = new EventService();

            vm.inputsGridTableDataService = new GridTableDataService();
            vm.inputsGridTableEventService = new GridTableEventService();

            sharedLogic.initGridTableEvents();

            /* ecosystemDefaultService.getList().then(function (data) {
                ecosystemDefaultData = data.results[0];
            }); */
            sharedLogic.loadEcosystemDefaults();

            // var getItemPromise = vm.getItem();
            var getAttrsPromise = vm.getAttrs();
            var getRefTablesPromise = sharedLogic.getReferenceTables();

            vm.getTransactionTypeGroups();
            vm.getPortfolios();
            vm.getInstrumentTypes();

            var getInputTemplPromise = sharedLogic.getInputTemplates();
            vm.getFieldTemplates();
            var getActionsTemplPromise = vm.getActionTemplates();

            Promise.all([getAttrsPromise, getRefTablesPromise, getInputTemplPromise, getActionsTemplPromise]).then(function () {

                // setups vm.inputsGridTableDataService
                var iamdlResult = sharedLogic.initAfterMainDataLoaded();
                vm.actionsMultitypeFieldsList = iamdlResult.actionsMultitypeFieldsList;
                vm.eventPhantomsOpts = iamdlResult.eventPhantomsOpts;

                vm.readyStatus.inputs = true;
                $scope.$apply();

            });

            vm.layoutAttrs = layoutService.getLayoutAttrs();
            vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);



        }

        //# endregion DRAFT ENDED

        vm.init = function () {

            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.ttypeEditorElemToDrag');
            });

            vm.actionsMFEventService = new EventService();

            vm.inputsGridTableDataService = new GridTableDataService();
            vm.inputsGridTableEventService = new GridTableEventService();

            sharedLogic.initGridTableEvents();

            /* ecosystemDefaultService.getList().then(function (data) {
                ecosystemDefaultData = data.results[0];
            }); */
            sharedLogic.loadEcosystemDefaults();

            vm.exprInputEventObj = sharedLogic.createEventsDataForInputs();

            var getItemPromise = vm.getItem();
            var getAttrsPromise = vm.getAttrs();
            var getRefTablesPromise = sharedLogic.getReferenceTables();

            vm.getTransactionTypeGroups();
            vm.getPortfolios();
            vm.getInstrumentTypes();

            var getInputTemplPromise = sharedLogic.getInputTemplates();
            vm.getFieldTemplates();
            var getActionsTemplPromise = vm.getActionTemplates();

            Promise.all([getItemPromise, getAttrsPromise, getRefTablesPromise, getInputTemplPromise, getActionsTemplPromise]).then(function () {

                // setups vm.inputsGridTableDataService
                var iamdlResult = sharedLogic.initAfterMainDataLoaded();
                vm.actionsMultitypeFieldsList = iamdlResult.actionsMultitypeFieldsList;
                vm.eventPhantomsOpts = iamdlResult.eventPhantomsOpts;

                vm.readyStatus.inputs = true;
                $scope.$apply();

            });

            vm.layoutAttrs = layoutService.getLayoutAttrs();
            vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

            vm.activeTab = getTabFromQueryParams();

        };

        vm.init();

    }

}());