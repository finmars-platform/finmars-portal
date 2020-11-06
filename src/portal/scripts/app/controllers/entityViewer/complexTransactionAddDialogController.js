/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var usersGroupService = require('../../services/usersGroupService');

    var layoutService = require('../../services/layoutService');
    var metaService = require('../../services/metaService');
    var evEditorEvents = require('../../services/ev-editor/entityViewerEditorEvents');

    var gridHelperService = require('../../services/gridHelperService');
    var attributeTypeService = require('../../services/attributeTypeService');

    var EntityViewerEditorEventService = require('../../services/ev-editor/entityViewerEditorEventService');
    var EntityViewerEditorDataService = require('../../services/ev-editor/entityViewerEditorDataService');

    var transactionTypeService = require('../../services/transactionTypeService');
    var portfolioService = require('../../services/portfolioService');
    var instrumentTypeService = require('../../services/instrumentTypeService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var tooltipsService = require('../../services/tooltipsService');
    var colorPalettesService = require('../../services/colorPalettesService');

    var entityEditorHelper = require('../../helpers/entity-editor.helper');
    var transactionHelper = require('../../helpers/transaction.helper');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');


    module.exports = function complexTransactionAddDialogController($scope, $mdDialog, $state, entityType, entity, data) {

        var vm = this;
        vm.readyStatus = {content: false, entity: true, permissions: true, transactionTypes: false, layout: false};
        vm.entityType = entityType;

        vm.entity = {$_isValid: true};
        var dataConstructorLayout = [];
        var dcLayoutHasBeenFixed = false;
        vm.transactionType = null;

        vm.processing = false;

        vm.transactionTypes = [];

        vm.filters = {
            portfolio: null,
            instrument_type: null
        };

        vm.contextData = null; // data source when we book from report

        vm.entityTabs = metaService.getEntityTabs(vm.entityType);

        vm.transactionTypeId = null;

        vm.attributesLayout = [];
        vm.fixedAreaAttributesLayout = [];

        var tabsWithErrors = {};
        var errorFieldsList = [];
        var notCopiedTransaction = true;
        var inputsWithCalculations;
        var contentType = metaContentTypesService.findContentTypeByEntity('complex-transaction', 'ui');
        //var tooltipsList = [];

        vm.rearrangeMdDialogActions = function () {
            var dialogWindowWidth = vm.dialogElemToResize.clientWidth;

            if (dialogWindowWidth < 695) {
                vm.dialogElemToResize.classList.add("two-rows-dialog-actions");
            } else {
                vm.dialogElemToResize.classList.remove("two-rows-dialog-actions");
            }
        };

        /*var getMatchForLayoutFields = function (tab, tabIndex, fieldsToEmptyList, tabResult) {

            var i, l, e, u;

            tab.layout.fields.forEach(function (field, fieldIndex) {

                var fieldResult = {};

                if (field && field.type === 'field') {

                    var attrFound = false;

                    if (field.attribute_class === 'attr') {

                        for (i = 0; i < vm.attrs.length; i = i + 1) {

                            if (field.key) {

                                if (field.key === vm.attrs[i].user_code) {

                                    vm.attrs[i].options = field.options;
                                    fieldResult = vm.attrs[i];
                                    attrFound = true;
                                    break;

                                }

                            } else {

                                if (field.attribute.user_code) {

                                    if (field.attribute.user_code === vm.attrs[i].user_code) {

                                        vm.attrs[i].options = field.options;
                                        fieldResult = vm.attrs[i];
                                        attrFound = true;
                                        break;

                                    }

                                }

                            }

                        }

                        if (!attrFound) {
                            var fieldPath = {
                                tabIndex: tabIndex,
                                fieldIndex: fieldIndex
                            };

                            fieldsToEmptyList.push(fieldPath);
                        }

                    } else if (field.attribute_class === 'userInput') {

                        for (u = 0; u < vm.userInputs.length; u = u + 1) {
                            //console.log('vm.userInputs[u]', vm.userInputs[u]);
                            if (field.name === vm.userInputs[u].name) {
                                vm.userInputs[u].options = field.options;
                                // return vm.userInputs[u];
                                fieldResult = vm.userInputs[u];

                                attrFound = true;
                                break;
                            }
                        }

                        if (!attrFound) {
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

                                attrFound = true;
                                break;
                            }
                        }

                        if (!attrFound) {
                            for (l = 0; l < vm.layoutAttrs.length; l = l + 1) {
                                if (field.name === vm.layoutAttrs[l].name) {
                                    vm.layoutAttrs[l].options = field.options;
                                    fieldResult = vm.layoutAttrs[l];

                                    attrFound = true;
                                    break;
                                }
                            }
                        }

                    }

                    if (field.backgroundColor) {
                        fieldResult.backgroundColor = field.backgroundColor;
                    }

                    fieldResult.editable = field.editable;

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
                layoutAttrs: vm.layoutAttrs,
                userInputs: vm.userInputs
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

        vm.getContextParameters = function () {

            var result = {};

            if (vm.contextData) {

                Object.keys(vm.contextData).forEach(function (key) {

                    if (key.indexOf('_object') === -1) {
                        result[key] = vm.contextData[key]
                    }

                })

            }

            return result

        };

        var postBookComplexTransactionActions = function (transactionData, recalculationInfo) {
            // ng-repeat with bindFieldControlDirective may not update without this
            vm.tabs = {};
            vm.fixedArea = {};
            // < ng-repeat with bindFieldControlDirective may not update without this >

            if (Array.isArray(transactionData.book_transaction_layout.data)) {
                vm.tabs = transactionData.book_transaction_layout.data;

            } else {
                vm.tabs = transactionData.book_transaction_layout.data.tabs;
                vm.fixedArea = transactionData.book_transaction_layout.data.fixedArea;

            }

            dataConstructorLayout = JSON.parse(JSON.stringify(transactionData.book_transaction_layout)); // unchanged layout that is used to remove fields without attributes

            vm.userInputs = [];
            transactionHelper.updateTransactionUserInputs(vm.userInputs, vm.tabs, vm.fixedArea, vm.transactionType);
            /*vm.tabs.forEach(function (tab) {
                tab.layout.fields.forEach(function (field) {
                    if (field.attribute_class === 'userInput') {
                        vm.userInputs.push(field.attribute);
                    }
                });
            });

            if (vm.fixedArea && vm.fixedArea.isActive) {
                vm.fixedArea.layout.fields.forEach(function (field) {
                    if (field.attribute_class === 'userInput') {
                        vm.userInputs.push(field.attribute);
                    }
                });
            }

            if (vm.tabs.length && !vm.tabs[0].hasOwnProperty('tabOrder')) {
                vm.tabs.forEach(function (tab, index) {
                    tab.tabOrder = index;
                });
            }

            vm.userInputs.forEach(function (userInput) {

                if (!userInput.frontOptions) {
                    userInput.frontOptions = {};
                }

                if (transactionHelper.isUserInputUsedInTTypeExpr(userInput, vm.transactionType.actions)) {
                    userInput.frontOptions.usedInExpr = true;
                }

                if (notCopiedTransaction && (vm.entity[userInput.name] || vm.entity[userInput.name] === 0)) {
                    userInput.frontOptions.autocalculated = true;
                }

            });*/

            inputsWithCalculations = transactionData.transaction_type_object.inputs;

            if (inputsWithCalculations) {
                inputsWithCalculations.forEach(function (inputWithCalc) {

                    vm.userInputs.forEach(function (userInput) {
                        if (userInput.name === inputWithCalc.name) {

                            if (!userInput.buttons) {
                                userInput.buttons = [];
                            }

                            if (inputWithCalc.can_recalculate === true) {
                                userInput.buttons.push({
                                    // iconObj: {type: 'fontawesome', icon: 'fas fa-redo'},
                                    iconObj: {type: 'angular-material', icon: 'refresh'},
                                    tooltip: 'Recalculate this field',
                                    caption: '',
                                    classes: '',
                                    action: {
                                        key: 'input-recalculation',
                                        callback: vm.recalculate,
                                        parameters: {inputs: [inputWithCalc.name], recalculationData: 'input'}
                                    }
                                })
                            }

                            if (inputWithCalc.settings && inputWithCalc.settings.linked_inputs_names) {
                                var linkedInputsList = inputWithCalc.settings.linked_inputs_names.split(',');

                                userInput.buttons.push({
                                    // iconObj: {type: 'fontawesome', icon: 'fas fa-sync-alt'},
                                    iconObj: {type: 'angular-material', icon: 'loop'},
                                    tooltip: 'Recalculate linked fields',
                                    caption: '',
                                    classes: '',
                                    action: {
                                        key: 'linked-inputs-recalculation',
                                        callback: vm.recalculate,
                                        parameters: {inputs: linkedInputsList, recalculationData: 'linked_inputs'}
                                    }
                                })
                            }

                            if (recalculationInfo && recalculationInfo.recalculatedInputs.indexOf(userInput.name) > -1) { // mark userInputs that were recalculated
                                userInput.frontOptions.recalculated = recalculationInfo.recalculationData;
                            }

                        }
                    })

                });
            }


            mapAttributesAndFixFieldsLayout();

        };

        var bookComplexTransaction = function (inputsToRecalculate, recalculationData) {

            vm.processing = true;

            var values = {};

            vm.userInputs.forEach(function (item) {
                values[item.name] = vm.entity[item.name]
            });

            var book = {
                transaction_type: vm.entity.transaction_type,
                recalculate_inputs: inputsToRecalculate,
                process_mode: 'recalculate',
                values: values
            };

            transactionTypeService.bookComplexTransaction(book.transaction_type, book).then(function (data) {

                vm.transactionTypeId = data.transaction_type;
                vm.editLayoutEntityInstanceId = data.transaction_type;

                vm.entity = data.complex_transaction;

                vm.transactionType = data.transaction_type_object;

                vm.specialRulesReady = true;
                vm.readyStatus.entity = true;

                var keys = Object.keys(data.values);

                keys.forEach(function (key) {
                    vm.entity[key] = data.values[key];
                });

                data.complex_transaction.attributes.forEach(function (item) {
                    if (item.attribute_type_object.value_type === 10) {
                        vm.entity[item.attribute_type_object.name] = item.value_string;
                    }
                    if (item.attribute_type_object.value_type === 20) {
                        vm.entity[item.attribute_type_object.name] = item.value_float;
                    }
                    if (item.attribute_type_object.value_type === 30) {
                        vm.entity[item.attribute_type_object.name] = item.classifier;
                    }
                    if (item.attribute_type_object.value_type === 40) {
                        vm.entity[item.attribute_type_object.name] = item.value_date;
                    }
                });


                var recalculationInfo = {
                    recalculatedInputs: inputsToRecalculate,
                    recalculationData: recalculationData
                }


                postBookComplexTransactionActions(data, recalculationInfo);


                vm.processing = false;

                $scope.$apply();

                if (recalculationInfo.recalculatedInputs && recalculationInfo.recalculatedInputs.length) {
                    vm.evEditorEventService.dispatchEvent(evEditorEvents.FIELDS_RECALCULATED);
                }

            }).catch(function (reason) {

                console.log("Something went wrong with recalculation");

                vm.processing = false;
                vm.readyStatus.layout = true;

                $scope.$apply();

            })

        }

        vm.recalculate = function (paramsObj) {

            var inputs = paramsObj.inputs;
            var recalculationData = paramsObj.recalculationData;

            transactionHelper.removeDeletedUserInputs(inputs, vm.transactionType.inputs);

            if (inputs && inputs.length) {
                bookComplexTransaction(inputs, recalculationData);
            }

        };

        vm.getFormLayout = function () {

            return new Promise(function (resolve, reject) {

                vm.readyStatus.layout = false;

                var contextParameters = vm.getContextParameters();

                console.log('contextParameters', contextParameters);

                transactionTypeService.initBookComplexTransaction(vm.transactionTypeId, contextParameters).then(function (data) {

                    vm.transactionType = data.transaction_type_object;

                    vm.entity = data.complex_transaction;


                    vm.specialRulesReady = true;
                    vm.readyStatus.entity = true;

                    var keys = Object.keys(data.values);

                    keys.forEach(function (item) {
                        vm.entity[item] = data.values[item];
                    });

                    if (data.book_transaction_layout) {

                        vm.missingLayoutError = false;


                        postBookComplexTransactionActions(data);


                        /*vm.oldValues = {};

                        vm.userInputs.forEach(function (item) {
                            vm.oldValues[item.name] = vm.entity[item.name]
                        });*/

                    } else {
                        vm.missingLayoutError = true;
                    }

                    vm.readyStatus.layout = true;
                    resolve();


                });

            })
        };

        vm.attrs = [];
        vm.userInputs = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();
        vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];

        vm.formIsValid = true;

        vm.loadPermissions = function () {

            var promises = [];

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
                    data: vm.dataConstructorData
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.layoutAttrs = layoutService.getLayoutAttrs();
                    vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];
                    vm.getAttributeTypes();

                    vm.getFormLayout().then(function (value) {
                        $scope.$apply();
                    })

                }

            });
            /*var entityAddress = {entityType: vm.entityType};
            if (vm.entityType === 'transaction-type' || vm.entityType === 'complex-transaction') {
                entityAddress = {entityType: 'complex-transaction', from: vm.entityType};
            }
            $state.go('app.data-constructor', entityAddress);
            $mdDialog.hide();*/
        };

        vm.manageAttrs = function (ev) {

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

        vm.getAttributeTypes = function () {
            attributeTypeService.getList(vm.entityType, {pageSize: 1000}).then(function (data) {
                vm.attrs = data.results;
                vm.readyStatus.content = true;
                vm.readyStatus.entity = true;
            });
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.content && vm.readyStatus.entity && vm.readyStatus.permissions && vm.readyStatus.transactionTypes;
        };

        vm.range = gridHelperService.range;

        vm.bindFlex = function (tab, field) {
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
                        return item.row === row;
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
                        return false;
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

            if (metaService.getEntitiesWithoutDynAttrsList().indexOf(vm.entityType) === -1) {
                vm.entity.attributes = [];
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
                                    vm.entity.attributes[c] = entityEditorHelper.updateValue(vm.entity.attributes[c], vm.attrs[i], vm.entity[keys[a]]);
                                }
                            }
                            if (!attrExist) {
                                vm.entity.attributes.push(entityEditorHelper.appendAttribute(vm.attrs[i], vm.entity[keys[a]]));
                            }
                        }
                    }
                }
            }

            if (vm.entity.attributes) {
                vm.entity = entityEditorHelper.checkEntityAttrTypes(vm.entity, vm.entityAttrs);
                vm.entity.attributes = entityEditorHelper.clearUnusedAttributeValues(vm.entity.attributes);
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

                });
            }

        };

        vm.book = function ($event) {

            vm.updateEntityBeforeSave();

            var errors = entityEditorHelper.validateComplexTransactionFields(vm.entity,
                vm.transactionType.actions,
                vm.tabs,
                vm.entityAttrs,
                vm.attrs,
                vm.userInputs);

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
                // var resultEntity = entityEditorHelper.removeNullFields(vm.entity);
                var resultEntity = vm.entity;

                resultEntity.values = {};

                vm.userInputs.forEach(function (userInput) {

                    if (userInput !== null) {
                        var keys = Object.keys(vm.entity);
                        keys.forEach(function (key) {
                            if (key === userInput.name) {
                                resultEntity.values[userInput.name] = vm.entity[userInput.name];
                            }
                        });
                    }
                });

                resultEntity.store = true;
                resultEntity.calculate = true;

                console.log('resultEntity', resultEntity);

                new Promise(function (resolve, reject) {

                    vm.processing = true;

                    transactionTypeService.initBookComplexTransaction(resultEntity.transaction_type, {}).then(function (data) {

                        var res = Object.assign(data, resultEntity);

                        res.complex_transaction.is_locked = resultEntity.is_locked;
                        res.complex_transaction.is_canceled = resultEntity.is_canceled;

                        if (dcLayoutHasBeenFixed) {

                            vm.transactionType.book_transaction_layout = dataConstructorLayout;

                            transactionTypeService.update(vm.transactionType.id, vm.transactionType);

                        }

                        transactionTypeService.bookComplexTransaction(resultEntity.transaction_type, res).then(function (data) {

                            vm.processing = false;

                            toastNotificationService.success('Transaction was successfully booked');

                            resolve(data);

                        }).catch(function (data) {

                            console.log('here?', data);

                            if (data.hasOwnProperty('message') && data.message.reason == 410) {

                                vm.processing = false;

                                $mdDialog.show({
                                    controller: 'BookUniquenessWarningDialogController as vm',
                                    templateUrl: 'views/dialogs/book-uniqueness-warning-dialog-view.html',
                                    targetEvent: $event,
                                    parent: angular.element(document.body),
                                    multiple: true,
                                    locals: {
                                        data: {
                                            errorData: data
                                        }
                                    }
                                }).then(function (response) {

                                    console.log('response', response);

                                    if(response.reaction === 'cancel') {
                                        // do nothing
                                    }

                                    if(response.reaction === 'skip') {
                                        $mdDialog.hide({res: 'agree', data: null});
                                    }

                                    if(response.reaction === 'book_without_unique_code') {

                                        // TODO refactor here
                                        // 2 (BOOK_WITHOUT_UNIQUE_CODE, ugettext_lazy('Book without Unique Code ')),

                                        res.uniqueness_reaction = 2;

                                        transactionTypeService.bookComplexTransaction(resultEntity.transaction_type, res).then(function (data) {

                                            vm.processing = false;

                                            toastNotificationService.success('Transaction was successfully booked');

                                            resolve(data);

                                        })

                                    }

                                    if(response.reaction === 'overwrite') {

                                        // TODO refactor here
                                        //  3 (OVERWRITE, ugettext_lazy('Overwrite')),

                                        res.uniqueness_reaction = 3;

                                        transactionTypeService.bookComplexTransaction(resultEntity.transaction_type, res).then(function (data) {

                                            vm.processing = false;

                                            toastNotificationService.success('Transaction was successfully booked');

                                            resolve(data);

                                        })

                                    }

                                })


                            } else {

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
                                            tableColumnsNames: ['Name of fields', 'Error Cause'],
                                            entityType: 'complex-transaction'
                                        }
                                    }
                                });

                                reject(data);

                            }

                        });

                    });

                }).then(function (data) {


                    if (data.hasOwnProperty('has_errors') && data.has_errors === true) {

                        $mdDialog.show({
                            controller: 'ValidationDialogController as vm',
                            templateUrl: 'views/dialogs/validation-dialog-view.html',
                            targetEvent: $event,
                            locals: {
                                validationData: {
                                    errorData: data,
                                    tableColumnsNames: ['Name of fields', 'Error Cause'],
                                    entityType: 'complex-transaction'
                                }
                            },
                            multiple: true
                        })

                    } else {

                        $mdDialog.hide({res: 'agree', data: data});

                    }


                })
            }

        };

        vm.bookAsPending = function ($event) {

            vm.updateEntityBeforeSave();

            vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);

            var hasProhibitNegNums = entityEditorHelper.checkForNegNumsRestriction(vm.entity, vm.entityAttrs, vm.userInputs, vm.layoutAttrs);

            if (vm.entity.$_isValid) {

                if (hasProhibitNegNums.length === 0) {

                    var resultEntity = entityEditorHelper.removeNullFields(vm.entity);

                    resultEntity.values = {};

                    vm.userInputs.forEach(function (userInput) {

                        if (userInput !== null) {
                            var keys = Object.keys(vm.entity);
                            keys.forEach(function (key) {
                                if (key === userInput.name) {
                                    resultEntity.values[userInput.name] = vm.entity[userInput.name];
                                }
                            });
                        }
                    });

                    resultEntity.store = true;
                    resultEntity.calculate = true;

                    console.log('resultEntity', resultEntity);

                    new Promise(function (resolve, reject) {

                        transactionTypeService.initBookPendingComplexTransaction(resultEntity.transaction_type).then(function (data) {

                            var res = Object.assign(data, resultEntity);

                            res.complex_transaction.is_locked = resultEntity.is_locked;
                            res.complex_transaction.is_canceled = resultEntity.is_canceled;

                            transactionTypeService.bookPendingComplexTransaction(resultEntity.transaction_type, res).then(function (data) {

                                toastNotificationService.success('Transaction was successfully booked');

                                resolve(data);
                            });
                        });

                    }).then(function (data) {

                        if (data.hasOwnProperty('has_errors') && data.has_errors === true) {

                            $mdDialog.show({
                                controller: 'ValidationDialogController as vm',
                                templateUrl: 'views/dialogs/validation-dialog-view.html',
                                targetEvent: $event,
                                locals: {
                                    validationData: {
                                        errorData: data,
                                        tableColumnsNames: ['Name of fields', 'Error Cause'],
                                        entityType: 'complex-transaction'
                                    }
                                },
                                multiple: true,
                                preserveScope: true,
                                autoWrap: true,
                                skipHide: true
                            })

                        } else {

                            $mdDialog.hide({res: 'agree'});
                        }

                        $mdDialog.hide({res: 'agree'});

                    }).catch(function (data) {

                        $mdDialog.show({
                            controller: 'ValidationDialogController as vm',
                            templateUrl: 'views/dialogs/validation-dialog-view.html',
                            targetEvent: $event,
                            locals: {
                                validationData: {
                                    errorData: data,
                                    tableColumnsNames: ['Name of fields', 'Error Cause'],
                                    entityType: 'complex-transaction'
                                }
                            },
                            multiple: true,
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true
                        })

                    })

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

        function getGroupsFromItems(items) {

            var groups = {};

            items.forEach(function (item) {

                if (item.group_object) {

                    if (!groups[item.group_object.id]) {
                        groups[item.group_object.id] = item.group_object;
                        groups[item.group_object.id].items = [];
                    }

                    groups[item.group_object.id].items.push(item);

                } else {

                    if (!groups['ungrouped']) {
                        groups['ungrouped'] = {name: 'Ungrouped'};
                        groups['ungrouped'].items = [];
                    }

                    groups['ungrouped'].items.push(item);

                }


            });

            var groupsList = Object.keys(groups).map(function (key) {
                return groups[key]
            });

            groupsList = groupsList.filter(function (item) {
                return !!item
            });

            return groupsList;

        }

        vm.getPortfolios = function () {

            portfolioService.getList().then(function (data) {
                vm.portfolios = data.results;
                $scope.$apply();
            });

        };

        vm.getInstrumentTypes = function () {

            instrumentTypeService.getList().then(function (data) {
                vm.instrumentTypes = data.results;
                $scope.$apply();
            });

        };

        vm.loadTransactionTypes = function () {

            var options = {
                filters: vm.filters,
                pageSize: 1000
            };

            // transactionTypeService.getList(options).then(function (data) {
            transactionTypeService.getListLight(options).then(function (data) {

                vm.transactionGroups = getGroupsFromItems(data.results);

                vm.readyStatus.transactionTypes = true;

                $scope.$apply(function () {
                    setTimeout(function () {
                        $('body').find('.md-select-search-pattern').on('keydown', function (ev) {
                            ev.stopPropagation();
                        });
                    }, 100);
                });
            })

        };

        vm.filtersChange = function () {

            vm.transactionTypeId = null;
            vm.loadTransactionTypes();

        };

        vm.transactionTypeChange = function () {

            notCopiedTransaction = true;
            vm.entity.transaction_type = vm.transactionTypeId;

            vm.dataConstructorData = {
                entityType: vm.entityType,
                instanceId: vm.transactionTypeId
            };

            vm.getFormLayout().then(function () {
                $scope.$apply();
            });

        };

        vm.init = function () {
            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.cTransactionEditorDialogElemToResize');
            }, 100);

            vm.evEditorEventService = new EntityViewerEditorEventService();
            vm.evEditorDataService = new EntityViewerEditorDataService();

            console.log('entity', entity);
            console.log('data', data);

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

            if (Object.keys(data).length) {

                if (data.hasOwnProperty('contextData')) {

                    vm.contextData = Object.assign({}, data.contextData);
                    //delete entity.contextData;

                    vm.transactionTypeId = entity.transaction_type;

                    vm.dataConstructorData = {
                        entityType: vm.entityType,
                        instanceId: vm.transactionTypeId
                    };

                    vm.getFormLayout().then(function (value) {
                        $scope.$apply();
                    })


                } /*else if (entity.hasOwnProperty('transaction_type')) {

                    vm.transactionTypeId = entity.transaction_type;

                    vm.dataConstructorData = {
                        entityType: vm.entityType,
                        instanceId: vm.transactionTypeId
                    };

                    vm.getFormLayout().then(function (value) {
                        $scope.$apply();
                    })

                }*/ else if (data.isCopy) { // if copy

                    console.log("Apply from make copy", entity);
                    notCopiedTransaction = false;
                    vm.entity = entity;

                    var copy = JSON.parse(JSON.stringify(entity));

                    vm.transactionTypeId = vm.entity.transaction_type;

                    vm.getFormLayout().then(function (value) {

                        Object.keys(copy).forEach(function (key) {
                            vm.entity[key] = copy[key];
                        });

                        console.log("Copy finished vm.entity", vm.entity);

                        delete vm.entity.id;

                        vm.entity.is_locked = false;
                        vm.entity.is_active = false;

                        $scope.$apply();
                    });


                }


            }

            vm.getPortfolios();
            vm.getInstrumentTypes();
            vm.loadTransactionTypes();
            vm.loadPermissions();

            vm.getAttributeTypes();

        };

        /*vm.entityChange = function () {

            console.log("entityChange", vm);
            console.log("vm.oldValues", vm.oldValues);

            var changedInput = null;

            vm.userInputs.forEach(function (item) {
                if (vm.oldValues[item.name] !== vm.entity[item.name]) {
                    changedInput = item
                }
            });

            vm.userInputs.forEach(function (item) {
                vm.oldValues[item.name] = vm.entity[item.name]
            });

            var resultInput;

            if (changedInput) {

                vm.transactionType.inputs.forEach(function (item) {
                    if (item.name === changedInput.name) {
                        resultInput = item;
                    }
                });

            }


            if (resultInput && resultInput.settings) {
                if (resultInput.settings.linked_inputs_names) {

                    vm.recalculateInputs(resultInput.settings.linked_inputs_names.split(','))

                }
            }

            console.log('changedInput', changedInput);
            console.log('resultInput', resultInput);

        };*/

        vm.onFieldChange = function (fieldKey) {

            if (fieldKey) {

                if (inputsWithCalculations) {

                    var i, a;
                    for (i = 0; i < vm.userInputs.length; i++) {

                        if (vm.userInputs[i].key === fieldKey) {

                            var uInputName = vm.userInputs[i].name;

                            for (a = 0; a < inputsWithCalculations.length; a++) {
                                var inputWithCalc = inputsWithCalculations[a];

                                if (inputWithCalc.name === uInputName &&
                                    inputWithCalc.settings && inputWithCalc.settings.linked_inputs_names) {

                                    var changedUserInputData = JSON.parse(JSON.stringify(vm.userInputs[i]));

                                    changedUserInputData.frontOptions.linked_inputs_names = JSON.parse(JSON.stringify(inputWithCalc.settings.linked_inputs_names.split(',')));

                                    vm.evEditorDataService.setChangedUserInputData(changedUserInputData);
                                    vm.evEditorEventService.dispatchEvent(evEditorEvents.FIELD_CHANGED);

                                    break;

                                }
                            }

                            break;

                        }

                    }
                }


                var attributes = {
                    entityAttrs: vm.entityAttrs,
                    attrsTypes: vm.attrs,
                    userInputs: vm.userInputs
                }

                entityEditorHelper.checkTabsForErrorFields(fieldKey, errorFieldsList, tabsWithErrors,
                    attributes,
                    vm.entity, vm.entityType, vm.tabs);
            }

        };


        vm.init();

    }

}());