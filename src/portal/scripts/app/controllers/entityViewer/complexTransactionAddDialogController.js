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
    var attributeTypeService = require('../../services/attributeTypeService');
    var metaPermissionsService = require('../../services/metaPermissionsService');

    var transactionTypeService = require('../../services/transactionTypeService');
    var portfolioService = require('../../services/portfolioService');
    var instrumentTypeService = require('../../services/instrumentTypeService');

    var entityEditorHelper = require('../../helpers/entity-editor.helper');

    module.exports = function ($scope, $mdDialog, $state, entityType, entity) {

        console.log('ComplexTransactionAddDialog entityType, entity', entityType, entity);

        var vm = this;
        vm.readyStatus = {content: false, entity: true, permissions: true, transactionTypes: false, layout: false};
        vm.entityType = entityType;

        vm.entity = {$_isValid: true};
        vm.transactionType = null;

        vm.recalculating = false;

        vm.transactionTypes = [];

        vm.filters = {
            portfolio: null,
            instrument_type: null
        };

        vm.contextData = null; // data source when we book from report

        vm.entityTabs = metaService.getEntityTabs(vm.entityType);

        vm.transactionTypeId = null;

        vm.attributesLayout = [];

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

        vm.getFormLayout = function () {

            return new Promise(function (resolve, rejec) {


                vm.readyStatus.layout = false;

                var contextParameters = vm.getContextParameters();

                console.log('contextParameters', contextParameters);

                transactionTypeService.initBookComplexTransaction(vm.transactionTypeId, contextParameters).then(function (data) {

                    var inputsWithCalculations = data.transaction_type_object.inputs;

                    vm.transactionType = data.transaction_type_object;

                    vm.entity = data.complex_transaction;

                    vm.specialRulesReady = true;
                    vm.readyStatus.entity = true;

                    var keys = Object.keys(data.values);

                    keys.forEach(function (item) {
                        vm.entity[item] = data.values[item];
                    });

                    vm.readyStatus.layout = true;

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

                        return item

                    });

                    vm.generateAttributesFromLayoutFields();


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
                preserveScope: true,
                multiple: true,
                locals: {
                    data: vm.dataConstructorData
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    // vm.readyStatus.content = false;

                    /*vm.init();

                    vm.layoutAttrs = layoutService.getLayoutAttrs();
                    vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];*/

                    /*vm.getFormLayout().then(function (value) {

                        Object.keys(copy).forEach(function (key) {
                            vm.entity[key] = copy[key];
                        });

                        delete vm.entity.id;

                        $scope.$apply();
                    });
                    vm.init();*/
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
            var entityAddress = {entityType: vm.entityType};
            if (vm.entityType === 'transaction-type' || vm.entityType === 'complex-transaction') {
                entityAddress = {entityType: vm.entityType, from: vm.entityType};
            }
            $state.go('app.attributesManager', entityAddress);
            $mdDialog.hide();
        };

        vm.recalculate = function (item) {

            vm.recalculating = true;

            var values = {};

            vm.userInputs.forEach(function (item) {
                values[item.name] = vm.entity[item.name]
            });

            var book = {
                transaction_type: vm.entity.transaction_type,
                recalculate_inputs: [item.name],
                process_mode: 'recalculate',
                values: values
            };

            transactionTypeService.bookComplexTransaction(book.transaction_type, book).then(function (data) {

                console.log('data', data);

                // vm.complexTransactionOptions.transactionTypeId = data.transaction_type;
                vm.transactionTypeId = data.transaction_type;
                vm.editLayoutEntityInstanceId = data.transaction_type;

                vm.entity = data.complex_transaction;

                var inputsWithCalculations = data.transaction_type_object.inputs;

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

                    return item

                });

                vm.generateAttributesFromLayoutFields();

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

                console.log('vm.entity', vm.entity);

                vm.recalculating = false;

                $scope.$apply();

            });

        };

        vm.getAttributeTypes = function () {
            attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
                vm.readyStatus.content = true;
                vm.readyStatus.entity = true;

            });
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.content && vm.readyStatus.entity && vm.readyStatus.permissions && vm.readyStatus.transactionTypes
        };

        vm.range = gridHelperService.range;

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

        vm.save = function ($event) {

            vm.updateEntityBeforeSave();

            vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);

            console.log('vm.entity before save', vm.entity);
            var hasProhibitNegNums = entityEditorHelper.checkForNegNumsRestriction(vm.entity, vm.entityAttrs, vm.userInputs, vm.layoutAttrs);

            if (vm.entity.$_isValid) {

                if (hasProhibitNegNums.length === 0) {

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

                        transactionTypeService.initBookComplexTransaction(resultEntity.transaction_type, {}).then(function (data) {

                            var res = Object.assign(data, resultEntity);

                            res.complex_transaction.is_locked = resultEntity.is_locked;
                            res.complex_transaction.is_canceled = resultEntity.is_canceled;

                            transactionTypeService.bookComplexTransaction(resultEntity.transaction_type, res).then(function (data) {
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
                                multiple: true,
                                preserveScope: true,
                                autoWrap: true,
                                skipHide: true
                            })

                        } else {

                            $mdDialog.hide({res: 'agree', data: data});

                        }


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

        vm.bookAsPending = function ($event) {

            vm.updateEntityBeforeSave();

            vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);

            console.log('vm.entity before save', vm.entity);
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
                                        complex_transaction_errors: data.complex_transaction_errors,
                                        instruments_errors: data.instruments_errors,
                                        transactions_errors: data.transactions_errors
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

            vm.entity.transaction_type = vm.transactionTypeId;

            vm.dataConstructorData = {
                entityType: vm.entityType,
                instanceId: vm.transactionTypeId
            };

            vm.getFormLayout();

        };

        vm.init = function () {

            console.log('entity', entity);

            if (Object.keys(entity).length) { // if copy

                if (entity.hasOwnProperty('contextData')) {

                    vm.contextData = Object.assign({}, entity.contextData);
                    delete entity.contextData;

                    vm.transactionTypeId = entity.transaction_type;

                    vm.dataConstructorData = {
                        entityType: vm.entityType,
                        instanceId: vm.transactionTypeId
                    };

                    vm.getFormLayout().then(function (value) {
                        $scope.$apply();
                    })



                } else if (entity.hasOwnProperty('transaction_type')) {

                    vm.transactionTypeId = entity.transaction_type;

                    vm.dataConstructorData = {
                        entityType: vm.entityType,
                        instanceId: vm.transactionTypeId
                    };

                    vm.getFormLayout().then(function (value) {
                        $scope.$apply();
                    })

                } else {

                    console.log("Apply from make copy", entity);

                    vm.entity = entity;

                    var copy = JSON.parse(JSON.stringify(entity));

                    console.log('copy', copy);

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

        vm.init();

    }

}());