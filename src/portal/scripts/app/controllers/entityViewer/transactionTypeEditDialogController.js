/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var fieldResolverService = require('../../services/fieldResolverService');

    // var usersGroupService = require('../../services/usersGroupService');
    // var usersService = require('../../services/usersService');

    var layoutService = require('../../services/entity-data-constructor/layoutService');
    var metaService = require('../../services/metaService');

    var gridHelperService = require('../../services/gridHelperService');

    var ecosystemDefaultService = require('../../services/ecosystemDefaultService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var transactionTypeGroupService = require('../../services/transaction/transactionTypeGroupService');

    var portfolioService = require('../../services/portfolioService');
    var instrumentTypeService = require('../../services/instrumentTypeService');
    var referenceTableService = require('../../services/referenceTablesService');
    var transactionTypeService = require('../../services/transactionTypeService');
    var complexTransactionService = require('../../services/transaction/complexTransactionService');

    var uiService = require('../../services/uiService');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var GridTableDataService = require('../../services/gridTableDataService');
    var GridTableEventService = require('../../services/gridTableEventService');

    var entityEditorHelper = require('../../helpers/entity-editor.helper');
    var TransactionTypeEditorSharedLogicHelper = require('../../helpers/entityViewer/sharedLogic/transactionTypeEditorSharedLogicHelper');
    var objectComparisonHelper = require('../../helpers/objectsComparisonHelper');
    var metaHelper = require('../../helpers/meta.helper');

    module.exports = function transactionTypeEditDialogController($scope, $mdDialog, $bigDrawer, $state, usersService, usersGroupService, entityType, entityId, data) {

        var vm = this;

        var sharedLogic = new TransactionTypeEditorSharedLogicHelper(vm, $scope, $mdDialog);

        vm.entityType = entityType;
        vm.entityId = entityId;

        vm.entity = {};
        // var originalEntity = {};
        vm.complexTransactionOptions = {};

        var originalEntityInputs = null;
        vm.selectorContentTypes = [];

        vm.processing = false;

        // Creating various variables to use as search terms for filters of repeating md-select components
        vm.searchTerms = {};

        vm.getInputsFilterST = function (name, index) {
            return name + index;
        };
        // < Creating various variables to use as search terms for filters of repeating md-select components >

        vm.readyStatus = {attrs: false, permissions: false, entity: false, layout: false, inputs: false};

        vm.entityTabs = metaService.getEntityTabs(vm.entityType);

        vm.editLayoutEntityInstanceId = null;
        vm.editLayoutByEntityInsance = false;

        vm.currentMember = null;

        // var ecosystemDefaultData = {};

        vm.hasEditPermission = false;
        vm.canManagePermissions = false;

        vm.expressionData = {
            groups: [],
            functions: []
        };

        vm.inputsToDelete = [];
        vm.referenceTables = [];
        vm.inputsForMultiselector = [];

        vm.openedIn = data.openedIn;

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
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        entityType: vm.entityType
                    }
                }
            });
        };

        vm.copy = function (windowType) {

            var entity = JSON.parse(JSON.stringify(vm.entity));

            entity["user_code"] = vm.entity["user_code"] + '_copy';
            entity["name"] = vm.entity["name"] + '_copy';

            console.log('copy entity', entity);

            // $mdDialog.hide();
            if (windowType === 'big-drawer') {

                const responseObj = {status: 'copy', data: {entity: entity, entityType: vm.entityType}};
                return metaHelper.closeComponent(vm.openedIn, $mdDialog, $bigDrawer, responseObj);

            } else {

                $mdDialog.show({
                    controller: 'TransactionTypeAddDialogController as vm',
                    templateUrl: 'views/entity-viewer/transaction-type-add-dialog-view.html',
                    parent: angular.element(document.body),
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

        vm.getItem = function () {

            return new Promise(function (res, rej) {

                transactionTypeService.getByKey(vm.entityId).then(function (data) {

                    vm.entity = data;

                    sharedLogic.updateInputFunctions();
					vm.updateContextParameters();
                    /* vm.expressionData.groups[0] = {
                        "name": "<b>Inputs</b>",
                        "key": 'input'
                    }

                    if (vm.entity.inputs && vm.entity.inputs.length > 0) {
                        vm.expressionData.functions[0] = vm.entity.inputs.map(function (input) {

                            return {
                                "name": "Input: " + input.verbose_name + " (" + input.name + ")",
                                "description": "Transaction Type Input: " + input.verbose_name + " (" + input.name + ") ",
                                "groups": "input",
                                "func": input.name,
								"validation": {
									"func": input.name
								}
                            }

                        });

                    } else {

                        vm.expressionData.functions = []

                    } */

                    // vm.expressionEditorData = {groups: [vm.inputsGroup], functions: [vm.inputsFunctions]};

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

                    console.log('vm.relationItems', vm.relationItems)

                    /*vm.editLayout = function () {
                        $state.go('app.portal.data-constructor', {
                            entityType: 'complex-transaction',
                            from: vm.entityType,
                            instanceId: data.id
                        });
                        $mdDialog.hide();
                    };*/

                    /* vm.manageAttrs = function () {
                        $state.go('app.portal.attributesManager', {
                            entityType: 'transaction-type',
                            from: vm.entityType,
                            instanceId: data.id
                        });
                        $mdDialog.hide();
                    }; */


                    //originalEntity = JSON.parse(angular.toJson(vm.entity));

                    if (vm.entity.inputs) {
                        originalEntityInputs = JSON.parse(angular.toJson(vm.entity.inputs));
                    }

                    vm.getTransactionUserFields().then(function () {

                        vm.readyStatus.entity = true;

                        vm.loadPermissions();

                        vm.readyStatus.layout = true;
                        $scope.$apply();

                        sharedLogic.setStateInActionsControls();

                        res();

                    }).catch(function (error) {
                        rej(error);
                    });

                }).catch(function (error) {
                    rej(error);
                });

            });

        };

        vm.getAttrs = function () {
            return attributeTypeService.getList(vm.entityType, {pageSize: 1000}).then(function (data) {
                vm.attrs = data.results;

                console.log('vm.attrs', vm.attrs);

                vm.readyStatus.attrs = true;
            });
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.attrs && vm.readyStatus.entity && vm.readyStatus.permissions && vm.readyStatus.layout && vm.readyStatus.inputs;
        };

        vm.handleErrors = function (data, $event) {

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

        vm.updateEntityBeforeSave = function (entity) {

            var updatedEntity = JSON.parse(JSON.stringify(entity));

            if (updatedEntity.attributes) {

                updatedEntity.attributes.forEach(function (attribute) {

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

            updatedEntity.object_permissions = [];

            // code that should be working for Add and Edit complex transaction, add to sharedLogic.updateEntityBeforeSave()
            return sharedLogic.updateEntityBeforeSave(updatedEntity);

        };

        vm.updateItem = function () {

            // TMP save method for instrument

            return new Promise(function (resolve) {

                var entityToSave = vm.updateEntityBeforeSave(vm.entity);

                var isValid = entityEditorHelper.checkForNotNullRestriction(entityToSave, vm.entityAttrs, vm.attrs);

                if (isValid) {

                    entityToSave = entityEditorHelper.removeNullFields(entityToSave, vm.entityType);

                    transactionTypeService.update(entityToSave.id, entityToSave).then(function (data) {

                        resolve(data);

                    });

                }

            })

        };

        /* var checkFieldExprForDeletedInput = function (actionFieldValue, actionItemKey, actionNotes) {

            for (var a = 0; a < vm.inputsToDelete.length; a++) {

                var dInputName = vm.inputsToDelete[a];

                var beginningOfExpr = '^' + dInputName + '(?![A-Za-z1-9_])';
                var middleOfExpr = '[^A-Za-z_.]' + dInputName + '(?![A-Za-z1-9_])';

                var dInputRegExpObj = new RegExp(beginningOfExpr + '|' + middleOfExpr, 'g');

                if (actionFieldValue.match(dInputRegExpObj)) {

                    var actionFieldLocation = {
                        action_notes: actionNotes,
                        key: actionItemKey, // for actions errors
                        name: actionItemKey, // for entity errors
                        message: "The deleted input is used in the Expression."
                    };

                    return actionFieldLocation;

                }

            }

        };

        var validateActionsFields = function (actions) {

            var result = [];

            actions.forEach(function (action) {

                var actionKeys = Object.keys(action);

                actionKeys.forEach(function (actionKey) {

                    if (typeof action[actionKey] === 'object' && action[actionKey]) { // check if it is property that contains actions field data

                        var actionItem = action[actionKey];
                        var actionItemKeys = Object.keys(actionItem);

                        actionItemKeys = actionItemKeys.filter(function (key) {

                            return key.indexOf('_object') === -1 && key.indexOf('_input') === -1 && key.indexOf('_phantom') === -1 && key !== 'action_notes';

                        });

                        actionItemKeys.forEach(function (actionItemKey) {

                            if (actionItemKey === 'notes') {

                                if (actionItem[actionItemKey]) {
                                    var fieldWithInvalidExpr = checkFieldExprForDeletedInput(actionItem[actionItemKey], actionItemKey, action.action_notes);

                                    if (fieldWithInvalidExpr) {
                                        result.push(fieldWithInvalidExpr);
                                    }
                                }

                            } else {

                                if (actionItem.hasOwnProperty(actionItemKey + '_input')) {

                                    var inputValue = actionItem[actionItemKey + '_input'];
                                    var relationValue = actionItem[actionItemKey];

                                    var valueIsEmpty = false;

                                    if (actionItem.hasOwnProperty(actionItemKey + '_phantom')) {

                                        var phantomValue = actionItem[actionItemKey + '_phantom'];

                                        if (!inputValue && !relationValue && (phantomValue === null || phantomValue === undefined)) {
                                            valueIsEmpty = true;
                                        }

                                    } else {

                                        if (!inputValue && !relationValue) {
                                            valueIsEmpty = true;
                                        }

                                    }

                                    if (valueIsEmpty) {

                                        result.push({
                                            action_notes: action.action_notes,
                                            key: actionItemKey,
                                            value: actionItem[actionItemKey]
                                        })

                                    }


                                } else {

                                    if (actionItem[actionItemKey] === null ||
                                        actionItem[actionItemKey] === undefined ||
                                        actionItem[actionItemKey] === "") {

                                        result.push({
                                            action_notes: action.action_notes,
                                            key: actionItemKey,
                                            value: actionItem[actionItemKey]
                                        })

                                    } else if (actionItem[actionItemKey] && typeof actionItem[actionItemKey] === 'string') { // deleted inputs use

                                        var fieldWithInvalidExpr = checkFieldExprForDeletedInput(actionItem[actionItemKey], actionItemKey, action.action_notes);

                                        if (fieldWithInvalidExpr) {
                                            result.push(fieldWithInvalidExpr);
                                        }

                                    }

                                }

                            }

                        })

                    }

                });


                if (!action.action_notes) {
                    result.push({
                        action_notes: action.action_notes,
                        key: 'action_notes',
                        value: ''
                    })
                }

            });


            return result;
        };

        var validateUserFields = function (entity, result) {

            var entityKeys = Object.keys(entity);

            entityKeys.forEach(function (entityKey) {

                if (entityKey.indexOf('user_text_') === 0 ||
                    entityKey.indexOf('user_number_') === 0 ||
                    entityKey.indexOf('user_date_') === 0) {

                    var fieldWithInvalidExpr = checkFieldExprForDeletedInput(entity[entityKey], entityKey, 'FIELDS');

                    if (fieldWithInvalidExpr) {
                        result.push(fieldWithInvalidExpr);
                    }

                }

            });
        };

        var checkEntityForEmptyFields = function (entity) {

            var result = [];

            if (entity.name === null || entity.name === undefined || entity.name === '') {
                result.push({
                    action_notes: 'GENERAL',
                    key: 'name',
                    name: 'Name',
                    value: entity.name
                })
            }

            if (entity.user_code === null || entity.user_code === undefined || entity.user_code === '') {
                result.push({
                    action_notes: 'GENERAL',
                    key: 'user_code',
                    name: 'User code',
                    value: entity.user_code
                })
            }

            if (entity.display_expr === null || entity.display_expr === undefined || entity.display_expr === '') {
                result.push({
                    action_notes: 'GENERAL',
                    key: 'display_expr',
                    name: 'Display Expression',
                    value: entity.display_expr
                })
            }

            if (entity.date_expr === null || entity.date_expr === undefined || entity.date_expr === '') {
                result.push({
                    action_notes: 'GENERAL',
                    key: 'date_expr',
                    name: 'Complex Transaction Date',
                    value: entity.date_expr
                })
            }

            if (entity.group === null || entity.group === undefined) {
                result.push({
                    action_notes: 'GENERAL',
                    key: 'group',
                    name: 'Group',
                    value: entity.group
                })
            }

            validateUserFields(entity, result);

            return result;

        };*/

        vm.save = function () {

            var saveTTypePromise = new Promise(function (resolve, reject) {
				console.log("inputsDeletion.save entity", JSON.parse(angular.toJson(vm.entity)));
                var entityToSave = vm.updateEntityBeforeSave(vm.entity);

                /* var actionsErrors = vm.checkActionsForEmptyFields(vm.entity.actions);
                var entityErrors = vm.checkEntityForEmptyFields(vm.entity); */

                var actionsErrors = sharedLogic.checkActionsForEmptyFields(entityToSave.actions);
                var inputsErrors = sharedLogic.validateInputs(entityToSave.inputs);
                actionsErrors = actionsErrors.concat(inputsErrors);

                var entityErrors = sharedLogic.checkEntityForEmptyFields(entityToSave);
				console.log("inputsDeletion.save errors", JSON.parse(JSON.stringify(actionsErrors)), JSON.parse(JSON.stringify(entityErrors)));
                if (actionsErrors.length || entityErrors.length) {

                    $mdDialog.show({
                        controller: 'TransactionTypeValidationErrorsDialogController as vm',
                        templateUrl: 'views/entity-viewer/transaction-type-validation-errors-dialog-view.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        multiple: true,
                        locals: {
                            data: {
                                actionErrors: actionsErrors,
                                entityErrors: entityErrors
                            }
                        }
                    });

                    vm.processing = false;

                    reject();

                } else {

                    vm.processing = true;

                    transactionTypeService.update(entityToSave.id, entityToSave).then(function (data) {

                        console.log('data', data);
                        //originalEntity = JSON.parse(angular.toJson(vm.entity));
                        originalEntityInputs = JSON.parse(angular.toJson(vm.entity.inputs));
                        vm.entity.object_permissions = data.object_permissions;

                        vm.processing = false;
                        $scope.$apply();

                        if (data.status === 400) {
                            vm.handleErrors(data);
                        } else {

                            toastNotificationService.success("Transaction Type " + vm.entity.name + ' was successfully saved');

                            resolve(data)

                        }

                    }).catch(function (error) {

                        console.log('error', error);

                        vm.processing = false;

                        $scope.$apply();

                        reject()

                    });

                }

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
                    parent: angular.element(document.body),
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

                vm.relationItems[entityKey].forEach(function (item) {

                    if (item.user_code) {
                        if (item.user_code === obj_from_input.user_code) {
                            exist = true;
                        }
                    }

                    if (item.user_code) {
                        if (item.user_code === obj_from_input.user_code) {
                            exist = true;
                        }
                    }

                });

                if (!exist) {
                    vm.relationItems[entityKey].push(obj_from_input)
                }

            }

        }

        // Transaction Type tab INPUTS
        /* var onInputsGridTableRowAddition = function () {

            var newRow = vm.inputsGridTableData.body[0];

            var newInput = {
                name: null,
                verbose_name: null,
                value_type: null,
                content_type: null,
                is_fill_from_context: false,
                reference_table: null,
                account: null,
                instrument_type: null,
                instrument: null,
                currency: null,
                counterparty: null,
                responsible: null,
                portfolio: null,
                strategy1: null,
                strategy2: null,
                strategy3: null,
                daily_pricing_model: null,
                payment_size_detail: null,
                price_download_scheme: null,
                pricing_policy: null,
                value: null,
                value_expr: null,
                settings: {}
            }

            newInput.name = newRow.key

            // if there is is_fill_from_context, enable it
            var fillFromContext = gridTableHelperService.getCellFromRowByKey(newRow, 'is_fill_from_context');
            if (fillFromContext.settings.value) {
                newInput.is_fill_from_context = true
            }

            vm.entity.inputs.unshift(newInput);

            vm.entity.inputs.forEach(function (input, iIndex) {
                vm.inputsGridTableData.body[iIndex].order = iIndex
            })

            onInputsGridTableCellChange(newRow.key);

            vm.getInputsForLinking();
            updateLinkedInputsOptionsInsideGridTable();

        };

        var onInputsGridTableCellChange = function (rowKey) {

            // updating whole row because 'value_type' change causes other cells to change
            var gtRow = vm.inputsGridTableDataService.getRowByKey(rowKey);
            var input = vm.entity.inputs[gtRow.order];

            gtRow.columns.forEach(function (gtColumn) {

                if (gtColumn.objPath) {
                    metaHelper.setObjectNestedPropVal(input, gtColumn.objPath, gtColumn.settings.value);

                } else if (gtColumn.objPaths) {

                    gtColumn.objPaths.forEach(function (objPath, index) {
                        metaHelper.setObjectNestedPropVal(input, objPath, gtColumn.settings.value[index]);
                    });

                }

                if (gtColumn.key === 'content_type' && gtColumn.cellType === 'empty') {

                    input.content_type = null
                    input.reference_table = null

                }

            });

            /!* vm.entity.inputs.forEach(function (input, inputIndex) {

                var row = vm.inputsGridTableData.body[inputIndex];

                 row.columns.forEach(function (column) {

                    if (column.objPath) {
                        metaHelper.setObjectNestedPropVal(vm.entity.inputs, column.objPath, column.settings.value);

                    } else {

                        column.objPaths.forEach(function (objPath, index) {
                            metaHelper.setObjectNestedPropVal(vm.entity.inputs, objPath, column.settings.value[index]);
                        });

                    }

                });

            }); *!/

        } */

        // TODO grid table delete
        /*var onRelationFillFromContextChange = function (rowOrder, colOrder, gtDataService) {

            var changedCell = gtDataService.getCell(rowOrder, colOrder);
            var contentTypeCell = gtDataService.getCellByKey(rowOrder, 'content_type');
            var defaultValueCell = gtDataService.getCellByKey(rowOrder, 'default_value');

            if (changedCell.settings.value) {
                defaultValueCell.settings.selectorOptions = vm.contextProperties[contentTypeCell.settings.value]

            } else {

                defaultValueCell.settings.selectorOptions = []

            }

        }*/

        /* TODO delete. Does not needed after grid table implementation
         vm.toggleQuery = function () {
            vm.queryStatus = !vm.queryStatus;
            vm.query = {};
        };

        vm.setSort = function (propertyName) {
            vm.direction = (vm.sort === propertyName) ? !vm.direction : false;
            vm.sort = propertyName;
        };

        vm.updateInputFunctions = function () {

            vm.expressionData.groups[0] = {
                "name": "<b>Inputs</b>",
                "key": 'input'
            }

            if (vm.entity.inputs && vm.entity.inputs.length > 0) {

                vm.expressionData.functions[0] = vm.entity.inputs.map(function (input) {

                    return {
                        "name": "Input: " + input.verbose_name + " (" + input.name + ")",
                        "description": "Transaction Type Input: " + input.verbose_name + " (" + input.name + ") ",
                        "groups": "input",
                        "func": input.name,
						"validation": {
							"func": input.name
						}
                    }

                });

            } else {

                vm.expressionData.functions = []

            }

        }; */

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
                parent: angular.element(document.body),
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
                parent: angular.element(document.body),
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
                        parent: angular.element(document.body),
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
                    parent: angular.element(document.body),
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

        vm.toggleItem = function (pane, item, $event) {

            $event.stopPropagation();

            if (!$event.target.classList.contains('ttype-action-notes-input')) {
                pane.toggle();
                item.isPaneExpanded = !item.isPaneExpanded;
            }

        };

        vm.getActionTypeName = sharedLogic.getActionTypeName;

        vm.preventSpace = function ($event) {

            $event.stopPropagation();

        };

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
                value: 'one_off_event'
            },
            {
                name: 'Regular Event',
                value: 'regular_event'
            },
            {
                name: 'Factor up',
                value: 'factor_up'
            },
            {
                name: 'Factor same',
                value: 'factor_same'
            },
            {
                name: 'Factor down',
                value: 'factor_down'
            }
        ];

        /* vm.setStateInActionsControls = function () {

            vm.actionsKeysList = [
                'instrument',
                'transaction',
                'instrument_factor_schedule',
                'instrument_manual_pricing_formula',
                'instrument_accrual_calculation_schedules',
                'instrument_event_schedule',
                'instrument_event_schedule_action'
            ];

            vm.entity.actions.forEach(function (action) {

                var keys;

                vm.actionsKeysList.forEach(function (actionKey) {

                    if (action[actionKey] !== null) {
                        keys = Object.keys(action[actionKey]);

                        keys.forEach(function (key) {
                            if (action[actionKey].hasOwnProperty(key + '_input')) {
                                if (action[actionKey][key] !== null) {
                                    action[actionKey][key + '_toggle'] = true;
                                }
                            }
                        })
                    }

                })

            });

        }; */

        /* var setDefaultValueForRelation = function (actionData, propertyName, fieldName) {

            var relationType = '';
            switch (fieldName) {
                case 'linked_instrument':
                case 'allocation_pl':
                case 'allocation_balance':
                    relationType = 'instrument';
                    break;
                default:
                    relationType = fieldName;
            }

            var nameProperty = 'name';
            if (fieldName === 'price_download_scheme') {
                nameProperty = 'user_code';
            }

            var defaultValueKey = '';
            switch (relationType) {
                case 'account_position':
                case 'account_cash':
                case 'account_interim':
                    defaultValueKey = 'account';
                    break;
                case 'settlement_currency':
                case 'transaction_currency':
                case 'accrued_currency':
                case 'pricing_currency':
                    defaultValueKey = 'currency';
                    break;
                case 'strategy1_position':
                case 'strategy1_cash':
                    defaultValueKey = 'strategy1';
                    break;
                case 'strategy2_position':
                case 'strategy2_cash':
                    defaultValueKey = 'strategy2';
                    break;
                case 'strategy3_position':
                case 'strategy3_cash':
                    defaultValueKey = 'strategy3';
                    break;
                default:
                    defaultValueKey = relationType;
            }

            var defaultName = ecosystemDefaultData[defaultValueKey + '_object'][nameProperty];

            actionData[propertyName][fieldName] = ecosystemDefaultData[defaultValueKey];

            // needed for displaying default value after turning on 'relation' field
            actionData[propertyName][fieldName + '_object'] = {};
            actionData[propertyName][fieldName + '_object'][nameProperty] = defaultName;
            actionData[propertyName][fieldName + '_object']['id'] = ecosystemDefaultData[defaultValueKey];

        }; */

        vm.resetProperty = function (item, propertyName, fieldName) {

            item[propertyName][fieldName] = null;
            item[propertyName][fieldName + '_input'] = null;

        };

		vm.resetPropertyBtn = sharedLogic.resetPropertyBtn;

        vm.findInputs = function (entity) {

            var content_type = '';
            var result;

            for (var i = 0; i < vm.contentTypes.length; i++) {
                if (vm.contentTypes[i].entity === entity) {
                    content_type = vm.contentTypes[i].key;
                    break;
                }

            }


            result = vm.entity.inputs.filter(function (input) {
                if (input.content_type === content_type) {
                    return true;
                }

                return false;
            });

            return result;

        };

        vm.deletePane = function (item, $index, $event) {

            $event.stopPropagation();
            var description = 'Are you sure to delete this action?';

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
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

                    vm.clearPhantoms()

                }
            });
        };

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

        vm.addAction = function (actionType) {

            vm.accordion.collapseAll();

            var result = {
                isPaneExpanded: true
            };

            result[actionType] = {};

            var fields = {
                'transaction': [
                    'account_cash', 'account_cash_input', 'account_interim',
                    'account_interim_input', 'account_position', 'account_position_input',
                    'accounting_date', 'allocation_balance', 'allocation_balance_input',
                    'allocation_balance_phantom', 'allocation_pl', 'allocation_pl_input',
                    'allocation_pl_phantom', 'carry_with_sign', 'cash_consideration', 'cash_date',
                    'counterparty', 'counterparty_input', 'factor', 'instrument', 'instrument_input', 'instrument_phantom',
                    'linked_instrument', 'linked_instrument_input', 'linked_instrument_phantom', 'notes',
                    'overheads_with_sign', 'portfolio', 'portfolio_input', 'position_size_with_sign',
                    'principal_with_sign', 'reference_fx_rate', 'responsible', 'responsible_input',
                    'settlement_currency', 'settlement_currency_input', 'strategy1_cash', 'strategy1_cash_input',
                    'strategy1_position', 'strategy1_position_input', 'strategy2_cash', 'strategy2_cash_input',
                    'strategy2_position', 'strategy2_position_input', 'strategy3_cash', 'strategy3_cash_input',
                    'strategy3_position', 'strategy3_position_input', 'trade_price', 'transaction_class', 'transaction_currency',
                    'transaction_currency_input'
                ],
                'instrument': [
                    'accrued_currency', 'accrued_currency_input', 'accrued_multiplier',
                    'pricing_condition', 'pricing_condition_input', 'default_accrued',
                    'default_price', 'instrument_type', 'instrument_type_input', 'maturity_date',
                    'maturity_price', 'name', 'notes', 'payment_size_detail', 'payment_size_detail_input',
                    'price_multiplier',
                    'pricing_currency', 'pricing_currency_input', 'public_name', 'reference_for_pricing',
                    'short_name', 'user_code', 'user_text_1', 'user_text_2', 'user_text_3'],
                'instrument_accrual_calculation_schedules': [
                    'accrual_calculation_model', 'accrual_calculation_model_input', 'accrual_size', 'accrual_start_date',
                    'first_payment_date', 'instrument', 'instrument_input', 'instrument_phantom', 'notes', 'periodicity',
                    'periodicity_input', 'periodicity_n'
                ],
                'instrument_event_schedule': [
                    'description', 'effective_date', 'event_class', 'event_class_input', 'final_date', 'instrument',
                    'instrument_input', 'instrument_phantom', 'is_auto_generated', 'name', 'notification_class',
                    'notification_class_input', 'notify_in_n_days', 'periodicity', 'periodicity_input', 'periodicity_input'
                ],
                'instrument_event_schedule_action': [
                    'button_position', 'event_schedule', 'event_schedule_input', 'event_schedule_phantom', 'is_book_automatic',
                    'is_sent_to_pending', 'text', 'transaction_type_from_instrument_type'
                ],
                /* 'instrument_manual_pricing_formula': [
                    'expr', 'instrument', 'instrument_input', 'instrument_phantom', 'notes', 'pricing_policy', 'pricing_policy_input'
                ], */
                'instrument_factor_schedule': [
                    'instrument', 'instrument_input', 'instrument_phantom', 'effective_date', 'factor_value'
                ],
                'execute_command': [
                    'expr'
                ]
            };


            fields[actionType].forEach(function (key) {
                result[actionType][key] = null;
            });

            vm.entity.actions.push(result);

            vm.findPhantoms();
        };

        vm.makeCopyOfAction = function (actionToCopy, index, $event) {

            $event.stopPropagation();
            var actionCopy = JSON.parse(JSON.stringify(actionToCopy));

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
        };

        vm.moveDown = function (item, $index, $event) {

            $event.stopPropagation();

            var swap = JSON.parse(JSON.stringify(item));
            vm.entity.actions[$index] = vm.entity.actions[$index + 1];
            vm.entity.actions[$index + 1] = swap;
            vm.findPhantoms();

        };

        vm.moveUp = function (item, $index, $event) {

            $event.stopPropagation();

            var swap = JSON.parse(JSON.stringify(item));
            vm.entity.actions[$index] = vm.entity.actions[$index - 1];
            vm.entity.actions[$index - 1] = swap;
            vm.findPhantoms();

        };

        vm.resolveInstrumentProp = function (item, key, prop) {

            if (prop === 'instrument') {
                if (item[key].instrument_input !== null) {
                    return 'instrument_input'
                }
                return 'instrument_phantom'
            }

            if (prop === 'linked_instrument') {
                if (item[key].linked_instrument_input !== null) {
                    return 'linked_instrument_input'
                }
                return 'linked_instrument_phantom'
            }
            if (prop === 'allocation_pl') {
                if (item[key].allocation_pl_input !== null) {
                    return 'allocation_pl_input'
                }
                return 'allocation_pl_phantom'
            }

            if (prop === 'allocation_balance') {
                if (item[key].allocation_balance_input !== null) {
                    return 'allocation_balance_input'
                }
                return 'allocation_balance_phantom'
            }

        };

        vm.setTransactionInstrumentInput = function (item, name, prop) {

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

        };

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

        vm.findPhantoms = function () {
            var result = [];
            vm.entity.actions.forEach(function (action, $index) {
                action.positionOrder = $index;
                if (action.instrument !== null) {
                    result.push(action);
                }
            });
            return result;
        };

        vm.findEventSchedulePhantoms = function () {
            var result = [];
            vm.entity.actions.forEach(function (action, $index) {
                action.positionOrder = $index;
                if (action.instrument_event_schedule !== null) {
                    result.push(action);
                }
            });
            return result;
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

            return uiService.getTemplateLayoutList({filters: {type: 'action_template'}}).then(function (data) {

                vm.actionTemplates = data.results;

                vm.readyStatus.action_templates = true;

                $scope.$apply();

            })

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

        vm.saveAsTemplate = function ($event, type) {

            $mdDialog.show({
                controller: 'SaveAsDialogController as vm',
                templateUrl: 'views/dialogs/save-as-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {}
                }
            }).then(function (res) {


                if (res.status === 'agree') {

                    var template = {
                        name: '',
                        type: type,
                        data: {}
                    };

                    template.name = res.data.name;

                    if (type === 'input_template') {

                        template.data.inputs = vm.entity.inputs.map(function (item) {

                            return {
                                name: item.name,
                                verbose_name: item.verbose_name,
                                value_type: item.value_type,
                                content_type: item.content_type,
                                value: item.value,
                                value_expr: item.value_expr
                            }

                        })

                    }

                    if (type === 'field_template') {

                        template.data.fields = {};

                        Object.keys(vm.entity).forEach(function (key) {

                            if (key.indexOf('user_text_') !== -1) {
                                template.data.fields[key] = vm.entity[key];
                            }

                            if (key.indexOf('user_number_') !== -1) {
                                template.data.fields[key] = vm.entity[key];
                            }

                            if (key.indexOf('user_date_') !== -1) {
                                template.data.fields[key] = vm.entity[key];
                            }

                        });

                    }

                    if (type === 'action_template') {

                        template.data.actions = vm.entity.actions.map(function (action) {

                            var result = {};

                            Object.keys(action).forEach(function (key) {

                                if (typeof action[key] === 'object' && action[key] !== null) {

                                    result[key] = {};

                                    Object.keys(action[key]).forEach(function (actionItemKey) {

                                        result[key][actionItemKey] = action[key][actionItemKey];

                                        if (action[key].hasOwnProperty(actionItemKey + '_input')) {

                                            result[key][actionItemKey + '_field_type'] = 'input';

                                            if (action[key][actionItemKey + '_toggle']) {
                                                result[key][actionItemKey + '_field_type'] = 'relation';
                                            }

                                            result[key][actionItemKey] = null; // if its relation property
                                        }

                                        if (actionItemKey.indexOf('_input') !== -1) {
                                            result[key][actionItemKey] = null; // if its relation_input property
                                        }

                                        if (actionItemKey.indexOf('_toggle') !== -1) {
                                            delete result[key][actionItemKey]
                                        }

                                        if (actionItemKey.indexOf('_object') !== -1) {
                                            delete result[key][actionItemKey]
                                        }


                                    })


                                } else {
                                    result[key] = action[key];
                                }

                            });

                            return result

                        })

                    }

                    uiService.createTemplateLayout(template).then(function (data) {

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
                                    description: "Template successfully created"
                                }
                            }
                        });

                        vm.getInputTemplates();
                        vm.getFieldTemplates();
                        vm.getActionTemplates();

                    })

                }

            });

        };

        /*var updateLinkedInputsOptionsInsideGridTable = function () {

            var linkedInputsNames = vm.inputsGridTableDataService.getCellByKey('templateRow', 'linked_inputs_names');
            linkedInputsNames.settings.selectorOptions = inputsForMultiselector

            for (var i = 0; i < vm.inputsGridTableData.body.length; i++) {

                linkedInputsNames = vm.inputsGridTableDataService.getCellByKey(i, 'linked_inputs_names');

                linkedInputsNames.settings.selectorOptions = inputsForMultiselector

            }

        };

        vm.getInputsForLinking = function () {

            vm.inputsForMultiselector = vm.entity.inputs.map(function (input) {

                return {
                    id: input.name,
                    name: input.name
                }

            });

        };

        var initGridTableEvents = function () {

            vm.inputsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
                onInputsGridTableCellChange(argumentsObj.row.key);

            });

            vm.inputsGridTableEventService.addEventListener(gridTableEvents.ROW_ADDED, function () {
                onInputsGridTableRowAddition();
            });

        };*/


        vm.recalculateUserFields = function ($event, key) {

            transactionTypeService.recalculateUserFields(vm.entity.id, {
                transaction_type_id: vm.entity.id,
                key: key
            }).then(function (data) {

                toastNotificationService.success("User field " + key + " of Transaction Type " + vm.entity.name + ' was successfully recalculated');

            })

        }

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

        //region Context Parameters tab
		vm.deleteContextParameter = sharedLogic.deleteContextParameter
        vm.addContextParameter = sharedLogic.addContextParameter;
		//endregion Context Parameters tab

        vm.init = function () {

            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.ttypeEditorElemToDrag');
            });

            vm.inputsGridTableDataService = new GridTableDataService();
            vm.inputsGridTableEventService = new GridTableEventService();

            sharedLogic.initGridTableEvents();

            /* ecosystemDefaultService.getList().then(function (data) {
                ecosystemDefaultData = data.results[0];
            }); */
            sharedLogic.loadEcosystemDefaults();

            var getItemPromise = vm.getItem();
            var getAttrsPromise = vm.getAttrs();
            var getRefTablesPromise = sharedLogic.getReferenceTables();

            vm.getTransactionTypeGroups();
            vm.getPortfolios();
            vm.getInstrumentTypes();

            var getInputTemplPromise = sharedLogic.getInputTemplates();
            vm.getFieldTemplates();
            vm.getActionTemplates();

            Promise.all([getItemPromise, getAttrsPromise, getRefTablesPromise, getInputTemplPromise]).then(function () {

                sharedLogic.initAfterMainDataLoaded();
                vm.readyStatus.inputs = true;

            });

            vm.layoutAttrs = layoutService.getLayoutAttrs();
            vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

        };

        vm.init();

    }

}());