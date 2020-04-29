/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var usersGroupService = require('../../services/usersGroupService');
    var usersService = require('../../services/usersService');

    var layoutService = require('../../services/layoutService');
    var metaService = require('../../services/metaService');

    var gridHelperService = require('../../services/gridHelperService');

    var complexTransactionService = require('../../services/transaction/complexTransactionService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var metaPermissionsService = require('../../services/metaPermissionsService');

    var uiService = require('../../services/uiService');

    var entityEditorHelper = require('../../helpers/entity-editor.helper');

    module.exports = function ($scope, $mdDialog, $state, entityType, entityId) {

        var vm = this;

        vm.entityType = entityType;
        vm.entityId = entityId;

        vm.entity = {$_isValid: true};
        var dataConstructorLayout = [];
        var dcLayoutHasBeenFixed = false;

        vm.readyStatus = {attrs: false, permissions: false, entity: false, layout: false, userFields: false};

        vm.editLayoutEntityInstanceId = null;
        vm.editLayoutByEntityInsance = false;

        vm.recalculating = false;
        vm.formIsValid = true;
        vm.updateTableOnClose = {lockedStatusChanged: false, cancelStatusChanged: false};

        vm.attrs = [];
        var availableTransactionInputsNames = [];
        vm.userInputs = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();
        vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];

        vm.range = gridHelperService.range;

        vm.dataConstructorData = {entityType: vm.entityType};

        vm.attributesLayout = [];
        vm.fixedAreaAttributesLayout = [];

        vm.hasEditPermission = false;

        vm.textFields = [];
        vm.numberFields = [];
        vm.dateFields = [];

        vm.transactionInputs = [];

        vm.baseTransactions = [];
        vm.reconFields = [];

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
        vm.rearrangeMdDialogActions = function () {
            var dialogWindowWidth = vm.dialogElemToResize.clientWidth;

            if (dialogWindowWidth < 905) {
                vm.dialogElemToResize.classList.add("two-rows-dialog-actions");
            } else {
                vm.dialogElemToResize.classList.remove("two-rows-dialog-actions");
            }
        };

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

        vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getCurrentMember());
            promises.push(vm.getGroupList());

            Promise.all(promises).then(function (data) {

                var hasTransactionTypeEditAccess = false;
                var hasFullViewComplexTransaction = false;

                vm.complexTransactionData.transaction_type_object.object_permissions.forEach(function (perm) {

                    if (perm.permission === "change_transactiontype") {

                        if (vm.currentMember.groups.indexOf(perm.group) !== -1) {
                            hasTransactionTypeEditAccess = true;
                        }

                    }

                });

                vm.complexTransactionData.complex_transaction.object_permissions.forEach(function (perm) {

                    if (perm.permission === "view_complextransaction") {

                        if (vm.currentMember.groups.indexOf(perm.group) !== -1) {
                            hasFullViewComplexTransaction = true;
                        }

                    }

                });

                if (hasTransactionTypeEditAccess && hasFullViewComplexTransaction) {
                    vm.hasEditPermission = true;
                }

                if (vm.currentMember && vm.currentMember.is_admin) {
                    vm.hasEditPermission = true;
                }

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

            return usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                $scope.$apply();

            });
        };

        vm.checkPermissions = function () {

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

        vm.cancel = function () {
            var updateRowIcon = false;

            if (vm.updateTableOnClose.lockedStatusChanged || vm.updateTableOnClose.cancelStatusChanged) {
                updateRowIcon = {
                    is_locked: vm.entity.is_locked,
                    is_canceled: vm.entity.is_canceled
                };
            }

            $mdDialog.hide({status: 'disagree', data: {updateRowIcon: updateRowIcon}});
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

            $mdDialog.show({
                controller: 'ComplexTransactionAddDialogController as vm',
                templateUrl: 'views/entity-viewer/complex-transaction-add-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    entityType: vm.entityType,
                    entity: entity
                }
            });

            $mdDialog.hide();

        };

        vm.recalculate = function (item) {

            vm.recalculating = true;
            vm.readyStatus.layout = false;

            var values = {};

            console.log('vm.userInputs', vm.userInputs);

            vm.userInputs.forEach(function (item) {
                values[item.name] = vm.entity[item.name]
            });

            var book = {
                id: vm.entityId,
                transaction_type: vm.entity.transaction_type,
                recalculate_inputs: [item.name],
                process_mode: 'recalculate',
                complex_transaction: vm.entity,
                values: values
            };

            complexTransactionService.rebookComplexTransaction(book.id, book).then(function (data) {

                // vm.complexTransactionOptions.transactionTypeId = data.transaction_type;
                vm.transactionTypeId = data.transaction_type;
                vm.editLayoutEntityInstanceId = data.transaction_type;
                vm.entity = data.complex_transaction;

                var inputsWithCalculations = data.transaction_type_object.inputs;

                vm.readyStatus.entity = true;

                var keys = Object.keys(data.values);

                keys.forEach(function (item) {
                    vm.entity[item] = data.values[item];
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

                if (Array.isArray(data.book_transaction_layout.data)) {
                    vm.tabs = data.book_transaction_layout.data;
                } else {
                    vm.tabs = data.book_transaction_layout.data.tabs;
                    vm.fixedArea = data.book_transaction_layout.data.fixedArea;
                }

                dataConstructorLayout = JSON.parse(JSON.stringify(data.book_transaction_layout)); // unchanged layout that is used to remove fields without attributes

                availableTransactionInputsNames = [];
                data.transaction_type_object.inputs.forEach(function (tInput) {
                    availableTransactionInputsNames.push(tInput.name);
                });

                vm.userInputs = [];
                vm.tabs.forEach(function (tab) {
                    tab.layout.fields.forEach(function (field) {
                        if (field.attribute_class === 'userInput' && availableTransactionInputsNames.indexOf(field.name) !== -1) {
                            vm.userInputs.push(field.attribute);
                        }
                    });
                });

                if (vm.fixedArea && vm.fixedArea.isActive) {
                    vm.fixedArea.layout.fields.forEach(function (field) {
                        if (field.attribute_class === 'userInput' && availableTransactionInputsNames.indexOf(field.name) !== -1) {
                            vm.userInputs.push(field.attribute);
                        }
                    });
                }

                if (vm.tabs.length && !vm.tabs[0].hasOwnProperty('tabOrder')) {
                    vm.tabs.forEach(function (tab, index) {
                        tab.tabOrder = index;
                    });
                }

                mapAttributesAndFixFieldsLayout();

                vm.readyStatus.layout = true;

                if (inputsWithCalculations) {
                    inputsWithCalculations.forEach(function (inputWithCalc) {

                        vm.userInputs.forEach(function (userInput) {
                            if (userInput.name === inputWithCalc.name) {
                                if (inputWithCalc.can_recalculate === true) {
                                    userInput.buttons = [
                                        {
                                            icon: 'iso',
                                            tooltip: 'Recalculate',
                                            caption: '',
                                            classes: 'md-raised',
                                            action: vm.recalculate
                                        }
                                    ]
                                }
                            }
                        })

                    });

                }

                vm.recalculating = false;

                $scope.$apply();

            });

        };

        vm.recalculateInputs = function (inputs) {

            vm.recalculating = true;
            vm.readyStatus.layout = false;

            var values = {};

            console.log('vm.userInputs', vm.userInputs);

            vm.userInputs.forEach(function (item) {
                values[item.name] = vm.entity[item.name]
            });

            var book = {
                id: vm.entityId,
                transaction_type: vm.entity.transaction_type,
                recalculate_inputs: inputs,
                process_mode: 'recalculate',
                complex_transaction: vm.entity,
                values: values
            };

            complexTransactionService.rebookComplexTransaction(book.id, book).then(function (data) {

                // vm.complexTransactionOptions.transactionTypeId = data.transaction_type;
                vm.transactionTypeId = data.transaction_type;
                vm.editLayoutEntityInstanceId = data.transaction_type;
                vm.entity = data.complex_transaction;

                var inputsWithCalculations = data.transaction_type_object.inputs;

                vm.readyStatus.entity = true;

                var keys = Object.keys(data.values);

                keys.forEach(function (item) {
                    vm.entity[item] = data.values[item];
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


                if (Array.isArray(data.book_transaction_layout.data)) {
                    vm.tabs = data.book_transaction_layout.data;
                } else {
                    vm.tabs = data.book_transaction_layout.data.tabs;
                    vm.fixedArea = data.book_transaction_layout.data.fixedArea;
                }

                dataConstructorLayout = JSON.parse(JSON.stringify(data.book_transaction_layout)); // unchanged layout that is used to remove fields without attributes

                vm.userInputs = [];
                vm.tabs.forEach(function (tab) {
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

                mapAttributesAndFixFieldsLayout();

                vm.readyStatus.layout = true;

                if (inputsWithCalculations) {
                    inputsWithCalculations.forEach(function (inputWithCalc) {

                        vm.userInputs.forEach(function (userInput) {
                            if (userInput.name === inputWithCalc.name) {
                                if (inputWithCalc.can_recalculate === true) {
                                    userInput.buttons = [
                                        {
                                            icon: 'iso',
                                            tooltip: 'Recalculate',
                                            caption: '',
                                            classes: 'md-raised',
                                            action: vm.recalculate
                                        }
                                    ]
                                }
                            }
                        })

                    });

                }

                vm.recalculating = false;

                $scope.$apply();

            });

        };

        vm.fillUserFields = function () {

            vm.textFields = [];
            vm.numberFields = [];
            vm.dateFields = [];

            for (var i = 1; i < 21; i = i + 1) {

                if (vm.entity['user_text_' + i]) {
                    vm.textFields.push({
                        name: 'User Text ' + i,
                        value: vm.entity['user_text_' + i]
                    })
                }

            }

            for (var i = 1; i < 21; i = i + 1) {

                if (vm.entity['user_number_' + i] || vm.entity['user_number_' + i] === 0) {
                    vm.numberFields.push({
                        name: 'User Number ' + i,
                        value: vm.entity['user_number_' + i]
                    })
                }

            }

            for (var i = 1; i < 6; i = i + 1) {

                if (vm.entity['user_date_' + i]) {

                    vm.dateFields.push({
                        name: 'User Date ' + i,
                        value: vm.entity['user_date_' + i]
                    })

                }

            }

        };

        vm.viewBaseTransaction = function ($event, item) {

            console.log("View Base Transaction ", item);

            $mdDialog.show({
                controller: 'EntityViewerEditDialogController as vm',
                templateUrl: 'views/entity-viewer/entity-viewer-edit-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    entityType: 'transaction',
                    entityId: item.id
                }
            })
        };

        vm.fillTransactionInputs = function () {

            vm.transactionInputs = [];

            Object.keys(vm.complexTransactionData.values).forEach(function (key) {

                var input = {};

                var exists_in_ttype = false;

                if (vm.transactionType.inputs) {
                    vm.transactionType.inputs.forEach(function (ttypeInput) {

                        if (ttypeInput.name === key) {

                            exists_in_ttype = true;

                            input.name = key;
                            input.verbose_name = ttypeInput.verbose_name;
                            input.value_type = ttypeInput.value_type;


                            if (input.value_type === 10) {
                                input.verbose_value_type = 'Text'
                            }

                            if (input.value_type === 20) {
                                input.verbose_value_type = 'Number'
                            }

                            if (input.value_type === 40) {
                                input.verbose_value_type = 'Date'
                            }

                            if (input.value_type === 100) {
                                input.verbose_value_type = 'Relation';

                                if (vm.complexTransactionData.values[key + '_object'].name) {
                                    input.value = vm.complexTransactionData.values[key + '_object'].name
                                } else {
                                    input.value = vm.complexTransactionData.values[key + '_object'].public_name
                                }

                            }

                        }

                    });

                }

                if (exists_in_ttype) {

                    input.value = vm.complexTransactionData.values[key];

                    vm.transactionInputs.push(input)

                }

            })

        };

        vm.getItem = function () {

            vm.readyStatus.layout = false;

            return new Promise(function (res, rej) {

                complexTransactionService.initRebookComplexTransaction(vm.entityId).then(function (complexTransactionData) {

                    vm.complexTransactionData = complexTransactionData;

                    vm.transactionTypeId = complexTransactionData.transaction_type;
                    vm.transactionType = complexTransactionData.transaction_type_object;
                    vm.editLayoutEntityInstanceId = complexTransactionData.complex_transaction.id;
                    vm.entity = complexTransactionData.complex_transaction;

                    vm.baseTransactions = vm.entity.transactions_object;
                    vm.reconFields = vm.entity.recon_fields;

                    vm.fillUserFields();
                    vm.fillTransactionInputs();


                    console.log('vm.entity', vm.entity);

                    var inputsWithCalculations = complexTransactionData.transaction_type_object.inputs;

                    var keys = Object.keys(complexTransactionData.values);

                    keys.forEach(function (key) {
                        vm.entity[key] = complexTransactionData.values[key];
                    });

                    complexTransactionData.complex_transaction.attributes.forEach(function (item) {
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

                    if (Array.isArray(complexTransactionData.book_transaction_layout.data)) {
                        vm.tabs = complexTransactionData.book_transaction_layout.data;
                    } else {
                        vm.tabs = complexTransactionData.book_transaction_layout.data.tabs;
                        vm.fixedArea = complexTransactionData.book_transaction_layout.data.fixedArea;
                    }

                    dataConstructorLayout = JSON.parse(JSON.stringify(complexTransactionData.book_transaction_layout)); // unchanged layout that is used to remove fields without attributes

                    availableTransactionInputsNames = [];

                    complexTransactionData.transaction_type_object.inputs.forEach(function (tInput) {
                        availableTransactionInputsNames.push(tInput.name);
                    });

                    vm.userInputs = [];
                    vm.tabs.forEach(function (tab) {
                        tab.layout.fields.forEach(function (field) {
                            if (field.attribute_class === 'userInput' && availableTransactionInputsNames.indexOf(field.name) !== -1) {
                                vm.userInputs.push(field.attribute);
                            }
                        });
                    });

                    if (vm.fixedArea && vm.fixedArea.isActive) {
                        vm.fixedArea.layout.fields.forEach(function (field) {
                            if (field.attribute_class === 'userInput' && availableTransactionInputsNames.indexOf(field.name) !== -1) {
                                vm.userInputs.push(field.attribute);
                            }
                        });
                    }

                    if (vm.tabs.length && !vm.tabs[0].hasOwnProperty('tabOrder')) {
                        vm.tabs.forEach(function (tab, index) {
                            tab.tabOrder = index;
                        });
                    }

                    mapAttributesAndFixFieldsLayout();

                    vm.readyStatus.layout = true;

                    if (inputsWithCalculations) {
                        inputsWithCalculations.forEach(function (inputWithCalc) {

                            vm.userInputs.forEach(function (userInput) {
                                if (userInput.name === inputWithCalc.name) {
                                    if (inputWithCalc.can_recalculate === true) {
                                        userInput.buttons = [
                                            {
                                                icon: 'iso',
                                                tooltip: 'Recalculate',
                                                caption: '',
                                                classes: 'md-raised',
                                                action: vm.recalculate
                                            }
                                        ]
                                    }
                                }
                            })

                        });

                    }

                    vm.dataConstructorData = {
                        entityType: vm.entityType,
                        from: vm.entityType,
                        instanceId: vm.transactionTypeId
                    };

                    vm.manageAttrs = function () {
                        $state.go('app.attributesManager', {
                            entityType: vm.entityType,
                            from: vm.entityType,
                            instanceId: vm.transactionTypeId
                        });
                        $mdDialog.hide();
                    };

                    vm.readyStatus.entity = true;
                    vm.readyStatus.layout = true;
                    vm.readyStatus.userFields = true;

                    vm.oldValues = {};

                    vm.userInputs.forEach(function (item) {
                        vm.oldValues[item.name] = vm.entity[item.name]
                    });

                    vm.loadPermissions();

                    $scope.$apply();

                });


            });

        };

        vm.getAttributeTypes = function () {
            attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
                vm.readyStatus.attrs = true;
            });
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.attrs && vm.readyStatus.entity && vm.readyStatus.permissions && vm.readyStatus.layout && vm.readyStatus.userFields;
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

        vm.handleComplexTransactionErrors = function ($event, data) {

            /*$mdDialog.show({
                controller: 'ValidationDialogController as vm',
                templateUrl: 'views/dialogs/validation-dialog-view.html',
                targetEvent: $event,
                locals: {
                    validationData: {
                        complex_transaction_errors: data.complex_transaction_errors,
                        instruments_errors: data.instruments_errors,
                        transactions_errors: data.transactions_errors
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            });*/
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

        vm.toggleLockStatus = function ($event) {

            vm.entity.is_locked = !vm.entity.is_locked;

            complexTransactionService.updateProperties(vm.entity.id, {is_locked: vm.entity.is_locked}).then(function () {

                // console.log('here');
                vm.updateTableOnClose.lockedStatusChanged = !vm.updateTableOnClose.lockedStatusChanged;

                $scope.$apply();

            })

        };

        vm.toggleCancelStatus = function ($event) {

            vm.entity.is_canceled = !vm.entity.is_canceled;

            complexTransactionService.updateProperties(vm.entity.id, {is_canceled: vm.entity.is_canceled}).then(function () {

                // console.log('here');
                vm.updateTableOnClose.cancelStatusChanged = !vm.updateTableOnClose.cancelStatusChanged;

                $scope.$apply();

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

        vm.updatePermissions = function ($event) {

            var permissions = [];

            if (vm.groups) {
                vm.groups.forEach(function (group) {

                    if (group.objectPermissions && group.objectPermissions.manage === true) {
                        permissions.push({
                            member: null,
                            group: group.id,
                            permission: "manage_" + vm.entityType.split('-').join('')
                        })
                    }

                    if (group.objectPermissions && group.objectPermissions.change === true) {
                        permissions.push({
                            member: null,
                            group: group.id,
                            permission: "change_" + vm.entityType.split('-').join('')
                        })
                    }

                });
            }

            console.log('Update Permissions', permissions);

            complexTransactionService.updateProperties(vm.entity.id, {object_permissions: permissions}).then(function () {

                // console.log('here');

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
                            description: "Permissions successfully updated"
                        }
                    }
                });

                $scope.$apply();

            })

        };

        vm.save = function ($event) {

            vm.updateEntityBeforeSave();

            /*vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);

            var hasProhibitNegNums = entityEditorHelper.checkForNegNumsRestriction(vm.entity, vm.entityAttrs, vm.userInputs, vm.layoutAttrs);*/

            var errors = entityEditorHelper.validateComplexTransactionFields(vm.entity,
                                                                             vm.transactionType.actions,
                                                                             vm.tabs,
                                                                             vm.entityAttrs,
                                                                             vm.attrs,
                                                                             vm.userInputs);

            if (errors.length) {

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

                var result = entityEditorHelper.removeNullFields(vm.entity);

                result.values = {};

                vm.userInputs.forEach(function (userInput) {

                    if (userInput !== null) {
                        var keys = Object.keys(vm.entity);
                        keys.forEach(function (key) {
                            if (key === userInput.name) {
                                result.values[userInput.name] = vm.entity[userInput.name];
                            }
                        });
                    }
                });

                result.store = true;
                result.calculate = true;

                new Promise(function (resolve, reject) {

                    return complexTransactionService.initRebookComplexTransaction(result.id).then(function (data) {

                        var originValues = JSON.parse(JSON.stringify(result.values));

                        // entity.transactions = data.transactions;

                        console.log('result', result);

                        result.values = data.values;
                        result.complex_transaction = data.complex_transaction; // ?
                        result.complex_transaction.is_locked = result.is_locked; // ?
                        result.complex_transaction.is_canceled = result.is_canceled; // ?

                        var originValuesKeys = Object.keys(originValues);
                        var defaultValuesKeys = Object.keys(result.values);

                        originValuesKeys.forEach(function (originVal) {
                            defaultValuesKeys.forEach(function (defaultVal) {

                                if (originVal === defaultVal) {
                                    result.values[defaultVal] = originValues[originVal];
                                }

                            })
                        });

                        result.process_mode = 'rebook';

                        if (dcLayoutHasBeenFixed) {
                            uiService.updateEditLayoutByInstanceId('complex-transaction', vm.entityId, dataConstructorLayout);
                        }

                        complexTransactionService.rebookComplexTransaction(result.id, result).then(function (data) {
                            resolve(data);
                        }).catch(function (data) {

                            console.log('data', data);

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
                                    }
                                }
                            });

                            reject(data);

                        });
                    });
                }).then(function (data) {

                    if (data.hasOwnProperty('has_errors') && data.has_errors === true) {

                        vm.handleComplexTransactionErrors($event, data);

                    } else {
                        $mdDialog.hide({res: 'agree', data: data});
                    }

                });

            }

        };

        vm.rebookAsPending = function ($event) {

            vm.updateEntityBeforeSave();

            vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);

            var hasProhibitNegNums = entityEditorHelper.checkForNegNumsRestriction(vm.entity, vm.entityAttrs, vm.userInputs, vm.layoutAttrs);

            if (vm.entity.$_isValid) {

                if (hasProhibitNegNums.length === 0) {

                    var result = entityEditorHelper.removeNullFields(vm.entity);

                    result.values = {};

                    vm.userInputs.forEach(function (userInput) {

                        if (userInput !== null) {
                            var keys = Object.keys(vm.entity);
                            keys.forEach(function (key) {
                                if (key === userInput.name) {
                                    result.values[userInput.name] = vm.entity[userInput.name];
                                }
                            });
                        }
                    });

                    result.store = true;
                    result.calculate = true;

                    new Promise(function (resolve, reject) {

                        return complexTransactionService.initRebookPendingComplexTransaction(result.id).then(function (data) {

                            var originValues = JSON.parse(JSON.stringify(result.values));

                            // entity.transactions = data.transactions;
                            result.values = data.values;
                            result.complex_transaction = data.complex_transaction; // ?

                            var originValuesKeys = Object.keys(originValues);
                            var defaultValuesKeys = Object.keys(result.values);

                            originValuesKeys.forEach(function (originVal) {
                                defaultValuesKeys.forEach(function (defaultVal) {

                                    if (originVal === defaultVal) {
                                        result.values[defaultVal] = originValues[originVal];
                                    }

                                })
                            });

                            complexTransactionService.rebookPendingComplexTransaction(result.id, result).then(function (data) {
                                resolve(data);
                            });
                        });
                    }).then(function (data) {

                        if (data.hasOwnProperty('has_errors') && data.has_errors === true) {

                            vm.handleComplexTransactionErrors($event, data);

                        } else {
                            $mdDialog.hide({res: 'agree'});
                        }

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

                    vm.readyStatus.attrs = false;
                    vm.readyStatus.entity = false;
                    vm.readyStatus.layout = false;

                    vm.layoutAttrs = layoutService.getLayoutAttrs();
                    vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

                    vm.getItem();
                    vm.getAttributeTypes();

                }

            });

        };

        vm.init = function () {
            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.cTransactionEditorDialogElemToResize');
            }, 100);

            vm.getItem();
            vm.getAttributeTypes();

        };

        vm.init();


        // Special case for split-panel
        $scope.splitPanelInit = function (entityType, entityId) {
            vm.entityType = entityType;
            vm.entityId = entityId;
        };

        vm.entityChange = function () {

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

            vm.transactionType.inputs.forEach(function (item) {

                if(item.name === changedInput.name) {
                    resultInput = item;
                }
            });

            if (resultInput && resultInput.settings) {

                if (resultInput.settings.linked_inputs_names) {

                    vm.recalculateInputs(resultInput.settings.linked_inputs_names.split(','))

                }

            }


            console.log('changedInput', changedInput);
            console.log('resultInput', resultInput);

        };

    }

}());