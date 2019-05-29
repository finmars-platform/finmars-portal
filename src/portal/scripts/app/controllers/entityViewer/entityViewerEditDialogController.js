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

    module.exports = function ($scope, $mdDialog, $state, entityType, entityId) {

        var vm = this;

        vm.entityType = entityType;
        vm.entityId = entityId;

        vm.entity = {$_isValid: true};
        vm.complexTransactionOptions = {};

        vm.readyStatus = {attrs: false, permissions: false, entity: false, layout: false};

        vm.entityTabs = metaService.getEntityTabs(vm.entityType);

        vm.editLayoutEntityInstanceId = null;
        vm.editLayoutByEntityInsance = false;

        vm.formIsValid = true;
        vm.TTGroupChosen = true;

        vm.dataConstructorData = {};

        vm.attrs = [];
        vm.entityAttrs = [];
        vm.userInputs = [];
        vm.layoutAttrs = [];

        vm.entityAttrs = [];
        vm.range = gridHelperService.range;

        vm.dataConstructorData = {entityType: vm.entityType};

        vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getMemberList());
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

                    if (vm.entity["group_object_permissions"]) {
                        vm.entity["group_object_permissions"].forEach(function (permission) {

                            if (permission.group == group.id) {
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

        vm.getMemberList = function () {

            usersService.getMemberList().then(function (data) {

                vm.members = data.results;

                vm.members.forEach(function (member) {

                    if (vm.entity["user_object_permissions"]) {
                        vm.entity["user_object_permissions"].forEach(function (permission) {

                            if (permission.member == member.id) {
                                if (!member.hasOwnProperty('objectPermissions')) {
                                    member.objectPermissions = {};
                                }
                                if (permission.permission === "manage_" + vm.entityType.split('-').join('')) {
                                    member.objectPermissions.manage = true;
                                }
                                if (permission.permission === "change_" + vm.entityType.split('-').join('')) {
                                    member.objectPermissions.change = true;
                                }
                            }
                        })
                    }

                });

                vm.readyStatus.permissions = true;

                $scope.$apply();
            });
        };

        vm.checkPermissions = function () {

            if (metaPermissionsService.getEntitiesWithDisabledPermissions().indexOf(vm.entityType) !== -1) {
                return false;
            }

            if (vm.entityId) {

                var haveAccess = false;

                var entityType = vm.entityType.split('-').join('');

                if (vm.entity.granted_permissions && vm.entity.granted_permissions.indexOf("manage_" + entityType) !== -1) {
                    haveAccess = true;
                }

                return haveAccess;
            } else {
                return true;
            }
        };

        vm.entityTypeSlug = function () {

            if (vm.entityType == 'complex-transaction') {
                return 'Transaction';
            }

            return vm.entityType.split('-').join(' ').capitalizeFirstLetter();
        };

        vm.cancel = function () {
            $mdDialog.cancel();
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
            });

            $mdDialog.cancel();

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

                vm.complexTransactionOptions.transactionTypeId = data.transaction_type;
                vm.editLayoutEntityInstanceId = data.transaction_type;
                vm.entity = data.complex_transaction;

                var inputsWithCalculations = data.transaction_type_object.inputs;

                vm.readyStatus.entity = true;
                vm.readyStatus.permissions = true;

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

                inputsWithCalculations.forEach(function (inputWithCalc) {

                    vm.userInputs.forEach(function (userInput) {
                        if (userInput.name === inputWithCalc.name) {
                            if (inputWithCalc.can_recalculate === true) {
                                userInput.buttons = [
                                    {
                                        icon: 'functions',
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

                $scope.$apply();

            };

            entityResolverService.update('complex-transaction', book.id, book).then(handler);

        };

        vm.getLayout = function () {

            uiService.getEditLayout(vm.entityType).then(function (data) {

                if (data.results.length) {
                    vm.tabs = data.results[0].data;
                } else {
                    vm.tabs = uiService.getDefaultEditLayout(vm.entityType)[0].data;
                }

                vm.readyStatus.layout = true;

                $scope.$apply();
            });

        };

        vm.getItem = function (fromChild) {
            return new Promise(function (res, rej) {
                if (vm.entityType === 'complex-transaction') {

                    entityResolverService.getByKey(vm.entityType, vm.entityId).then(function (complextTransactionData) {

                        vm.complexTransactionOptions.transactionTypeId = complextTransactionData.transaction_type;
                        vm.editLayoutEntityInstanceId = complextTransactionData.complex_transaction.id;
                        vm.entity = complextTransactionData.complex_transaction;

                        var inputsWithCalculations = complextTransactionData.transaction_type_object.inputs;

                        var keys = Object.keys(complextTransactionData.values);

                        keys.forEach(function (key) {
                            vm.entity[key] = complextTransactionData.values[key];
                        });

                        complextTransactionData.complex_transaction.attributes.forEach(function (item) {
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

                        vm.tabs = complextTransactionData.book_transaction_layout.data;
                        vm.userInputs = [];
                        vm.tabs.forEach(function (tab) {
                            tab.layout.fields.forEach(function (field) {
                                if (field.attribute_class === 'userInput') {
                                    vm.userInputs.push(field.attribute);
                                }
                            });
                        });

                        inputsWithCalculations.forEach(function (inputWithCalc) {

                            vm.userInputs.forEach(function (userInput) {
                                if (userInput.name === inputWithCalc.name) {
                                    if (inputWithCalc.can_recalculate === true) {
                                        userInput.buttons = [
                                            {
                                                icon: 'functions',
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

                        /*vm.editLayout = function () {
                            $state.go('app.data-constructor', {
                                entityType: vm.entityType,
                                from: vm.entityType,
                                instanceId: vm.complexTransactionOptions.transactionTypeId
                            });
                            $mdDialog.hide();
                        };*/
                        vm.dataConstructorData = {
                            entityType: vm.entityType,
                            from: vm.entityType,
                            instanceId: vm.complexTransactionOptions.transactionTypeId
                        };

                        vm.manageAttrs = function () {
                            $state.go('app.attributesManager', {
                                entityType: vm.entityType,
                                from: vm.entityType,
                                instanceId: vm.complexTransactionOptions.transactionTypeId
                            });
                            $mdDialog.hide();
                        };

                        vm.readyStatus.entity = true;
                        vm.readyStatus.permissions = true;
                        vm.readyStatus.layout = true;

                        $scope.$apply();

                    });

                } else {

                    entityResolverService.getByKey(vm.entityType, vm.entityId).then(function (data) {

                        vm.entity = data;

                        if (vm.entityType === 'transaction-type') {

                            vm.editLayout = function () {
                                $state.go('app.data-constructor', {
                                    entityType: 'complex-transaction',
                                    from: vm.entityType,
                                    instanceId: data.id
                                });
                                $mdDialog.hide();
                            };

                            vm.manageAttrs = function () {
                                $state.go('app.attributesManager', {
                                    entityType: 'transaction-type',
                                    from: vm.entityType,
                                    instanceId: data.id
                                });
                                $mdDialog.hide();
                            };
                        }

                        entityViewerHelperService.transformItems([vm.entity], vm.attrs).then(function (transformEntityData) {
                            vm.entity = transformEntityData[0];
                            vm.entity.$_isValid = true;
                            vm.readyStatus.entity = true;

                            vm.loadPermissions();

                            if (vm.entityType !== 'transaction-type') {

                                vm.getLayout();

                                // Resolving promise to inform child about end of editor building
                                res();

                            } else {
                                vm.readyStatus.layout = true;
                                $scope.$apply();

                            }

                        });
                    });

                }
            });

        };

        vm.getAttrs = function () {
            attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
                vm.readyStatus.attrs = true;
            });
        };

        vm.checkReadyStatus = function () {

            return vm.readyStatus.attrs && vm.readyStatus.entity && vm.readyStatus.permissions && vm.readyStatus.layout;
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

        vm.bindField = function (tab, field) {
            var i, l, e, u;
            if (field && field.type === 'field') {
                if (field.hasOwnProperty('id') && field.id !== null) {
                    for (i = 0; i < vm.attrs.length; i = i + 1) {
                        if (field.id === vm.attrs[i].id) {
                            vm.attrs[i].options = field.options;
                            return vm.attrs[i];
                        }
                    }
                } else {

                    for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
                        if (field.name === vm.entityAttrs[e].name) {
                            vm.entityAttrs[e].options = field.options;
                            return vm.entityAttrs[e];
                        }
                    }
                    for (l = 0; l < vm.layoutAttrs.length; l = l + 1) {
                        if (field.name === vm.layoutAttrs[l].name) {
                            vm.layoutAttrs[l].options = field.options;
                            return vm.layoutAttrs[l];
                        }
                    }

                    //console.log('vm.userInputs', vm.userInputs);
                    for (u = 0; u < vm.userInputs.length; u = u + 1) {
                        //console.log('vm.userInputs[u]', vm.userInputs[u]);
                        if (field.name === vm.userInputs[u].name) {
                            vm.userInputs[u].options = field.options;
                            return vm.userInputs[u];
                        }
                    }
                }
            }
        };

        vm.checkFieldRender = function (tab, row, field) {
            if (field.row === row) {
                if (field.type === 'field') {
                    return true;
                } else {
                    var i, c, x;
                    var spannedCols = [];
                    for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                        if (tab.layout.fields[i].row === row) {

                            if (tab.layout.fields[i].type === 'field') {
                                for (c = tab.layout.fields[i].column; c <= (tab.layout.fields[i].column + tab.layout.fields[i].colspan - 1); c = c + 1) {
                                    spannedCols.push(c);
                                }
                            }
                        }
                    }
                    for (x = 0; x < spannedCols.length; x = x + 1) {
                        if (spannedCols[x] === field.column) {
                            return false;
                        }
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

        vm.handleErrors = function ($event, data) {

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

            if (metaPermissionsService.getEntitiesWithDisabledPermissions().indexOf(vm.entityType) === -1) {
                vm.entity["user_object_permissions"] = [];
            }

            if (vm.members) {
                vm.members.forEach(function (member) {

                    if (member.objectPermissions && member.objectPermissions.manage == true) {
                        vm.entity["user_object_permissions"].push({
                            "member": member.id,
                            "permission": "manage_" + vm.entityType.split('-').join('') //TODO remove _vm.entityType
                        })
                    }

                    if (member.objectPermissions && member.objectPermissions.change == true) {
                        vm.entity["user_object_permissions"].push({
                            "member": member.id,
                            "permission": "change_" + vm.entityType.split('-').join('') //TODO remove _vm.entityType
                        })
                    }

                });
            }

            vm.entity["group_object_permissions"] = [];

            if (vm.groups) {
                vm.groups.forEach(function (group) {

                    if (group.objectPermissions && group.objectPermissions.manage == true) {
                        vm.entity["group_object_permissions"].push({
                            "group": group.id,
                            "permission": "manage_" + vm.entityType.split('-').join('')
                        })
                    }

                    if (group.objectPermissions && group.objectPermissions.change == true) {
                        vm.entity["group_object_permissions"].push({
                            "group": group.id,
                            "permission": "change_" + vm.entityType.split('-').join('')
                        })
                    }

                });
            }

        };

        vm.updateItem = function () {

            // TMP save method for instrument

            return new Promise(function (resolve) {

                vm.updateEntityBeforeSave();

                vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);

                if (vm.entity.$_isValid) {

                    var result = entityEditorHelper.checkForNulls(vm.entity);

                    entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                        resolve(data);

                    });

                }

            })

        };

        vm.save = function ($event) {

            vm.updateEntityBeforeSave();

            vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);

            if (vm.entity.$_isValid) {

                var result = entityEditorHelper.checkForNulls(vm.entity);

                if (vm.entityType === 'complex-transaction') {

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

                }

                entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                    if (vm.entityType === 'complex-transaction') {

                        if (data.hasOwnProperty('has_errors') && data.has_errors === true) {

                            vm.handleComplexTransactionErrors($event, data);

                        } else {
                            $mdDialog.hide({res: 'agree'});
                        }

                    } else {

                        if (data.status === 400) {
                            vm.handleErrors($event, data);
                        } else {
                            $mdDialog.hide({res: 'agree'});
                        }

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

                    vm.getItem();
                    vm.getAttrs();

                    vm.layoutAttrs = layoutService.getLayoutAttrs();
                    vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

                }

            });

        };

        vm.init = function () {

            vm.getItem();
            vm.getAttrs();

            vm.layoutAttrs = layoutService.getLayoutAttrs();
            vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

            if (vm.entityType === 'transaction-type') {

                $scope.$watch('vm.entity.group', function () {
                    if (vm.entity.group === 14 || !vm.entity.group) {
                        vm.TTGroupChosen = false;
                    } else {
                        vm.TTGroupChosen = true;
                    }
                });
            }

        };

        vm.init();


        // Special case for split-panel
        $scope.splitPanelInit = function (entityType, entityId) {
            vm.entityType = entityType;
            vm.entityId = entityId;
        }

    }

}());