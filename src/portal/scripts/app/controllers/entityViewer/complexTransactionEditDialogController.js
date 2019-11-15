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

    var entityEditorHelper = require('../../helpers/entity-editor.helper');

    module.exports = function ($scope, $mdDialog, $state, entityType, entityId) {

        var vm = this;

        vm.entityType = entityType;
        vm.entityId = entityId;

        vm.entity = {$_isValid: true};

        vm.readyStatus = {attrs: false, permissions: false, entity: false, layout: false, userFields: false};

        vm.editLayoutEntityInstanceId = null;
        vm.editLayoutByEntityInsance = false;

        vm.formIsValid = true;

        vm.attrs = [];
        vm.userInputs = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();
        vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];

        vm.range = gridHelperService.range;

        vm.dataConstructorData = {entityType: vm.entityType};

        vm.attributesLayout = [];

        vm.hasEditPermission = false;

        vm.generateAttributesFromLayoutFields = function () {

            vm.attributesLayout = [];
            var tabResult;
            var fieldResult;
            var i, l, e, u;

            vm.tabs.forEach(function (tab) {

                tabResult = [];

                tab.layout.fields.forEach(function (field) {

                    fieldResult = {};

                    if (field && field.type === 'field') {

                        if (field.attribute_class === 'attr') {

                            for (i = 0; i < vm.attrs.length; i = i + 1) {

                                if (field.key) {

                                    if (field.key === vm.attrs[i].user_code) {
                                        vm.attrs[i].options = field.options;
                                        fieldResult = vm.attrs[i];
                                    }

                                } else {

                                    if (field.attribute.user_code) {

                                        if (field.attribute.user_code === vm.attrs[i].user_code) {
                                            vm.attrs[i].options = field.options;
                                            fieldResult = vm.attrs[i];
                                        }

                                    }

                                }


                            }

                        } else {

                            var attrFound = false;

                            for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
                                if (field.name === vm.entityAttrs[e].name) {
                                    vm.entityAttrs[e].options = field.options;
                                    fieldResult = vm.entityAttrs[e];

                                    attrFound = true;
                                    break;
                                }
                            }

                            if (!attrFound) {
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

                vm.attributesLayout.push(tabResult);

            });

            console.log('vm.attributesLayout', vm.attributesLayout);

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
                            vm.hasFullViewComplexTransaction = true;
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
                values: values
            };

            var handler = function (data) {

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

                vm.tabs = data.book_transaction_layout.data;
                vm.userInputs = [];
                vm.tabs.forEach(function (tab) {
                    tab.layout.fields.forEach(function (field) {
                        if (field.attribute_class === 'userInput') {
                            vm.userInputs.push(field.attribute);
                        }
                    });
                });

                vm.tabs = vm.tabs.map(function (item, index) {

                    item.index = index;

                    return item;

                });

                vm.generateAttributesFromLayoutFields();

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
                $scope.$apply();

            };

            complexTransactionService.initRebookComplexTransaction(book.id).then(function (data) {

                var originValues = JSON.parse(JSON.stringify(book.values));

                // entity.transactions = data.transactions;
                book.values = data.values;
                book.complex_transaction = data.complex_transaction; // ?

                var originValuesKeys = Object.keys(originValues);
                var defaultValuesKeys = Object.keys(book.values);

                originValuesKeys.forEach(function (originVal) {
                    defaultValuesKeys.forEach(function (defaultVal) {

                        if (originVal === defaultVal) {
                            book.values[defaultVal] = originValues[originVal];
                        }

                    })
                });

                book.process_mode = 'recalculate';

                complexTransactionService.rebookComplexTransaction(book.id, book).then(handler);

            })

        };

        vm.getItem = function (fromChild) {
            return new Promise(function (res, rej) {

                complexTransactionService.initRebookComplexTransaction(vm.entityId).then(function (complexTransactionData) {

                    vm.complexTransactionData = complexTransactionData;

                    vm.transactionTypeId = complexTransactionData.transaction_type;
                    vm.editLayoutEntityInstanceId = complexTransactionData.complex_transaction.id;
                    vm.entity = complexTransactionData.complex_transaction;

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

                    vm.tabs = complexTransactionData.book_transaction_layout.data;
                    vm.userInputs = [];
                    vm.tabs.forEach(function (tab) {
                        tab.layout.fields.forEach(function (field) {
                            if (field.attribute_class === 'userInput') {
                                vm.userInputs.push(field.attribute);
                            }
                        });
                    });

                    vm.tabs = vm.tabs.map(function (item, index) {

                        item.index = index;

                        return item

                    });

                    vm.generateAttributesFromLayoutFields();

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

        vm.bindFlex = function (tab, row, field) {
            var totalColspans = 0;
            var i;
            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row === row) {
                    totalColspans = totalColspans + tab.layout.fields[i].colspan;
                }
            }
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

                            for (var i = item.column; i < columnsToSpan; i = i + 1) {
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

            $mdDialog.show({
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

                $scope.$apply();

            })

        };

        vm.toggleCancelStatus = function ($event) {

            vm.entity.is_canceled = !vm.entity.is_canceled;

            complexTransactionService.updateProperties(vm.entity.id, {is_canceled: vm.entity.is_canceled}).then(function () {

                // console.log('here');

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

            vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);

            if (vm.entity.$_isValid) {

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

                        complexTransactionService.rebookComplexTransaction(result.id, result).then(function (data) {
                            resolve(data);
                        }).catch(function (data) {

                            console.log('data', data);

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

                        })
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

            if (vm.entity.$_isValid) {

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

            }

        };

        vm.editLayout = function (ev) {

            $mdDialog.show({
                controller: 'EntityDataConstructorDialogController as vm',
                templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
                targetEvent: ev,
                preserveScope: true,
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
            vm.getItem();
            vm.getAttributeTypes();
        };

        vm.init();


        // Special case for split-panel
        $scope.splitPanelInit = function (entityType, entityId) {
            vm.entityType = entityType;
            vm.entityId = entityId;
        }

    }

}());