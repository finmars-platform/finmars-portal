/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');
    var fieldResolverService = require('../../services/fieldResolverService');

    var usersGroupService = require('../../services/usersGroupService');
    var usersService = require('../../services/usersService');

    var layoutService = require('../../services/layoutService');
    var metaService = require('../../services/metaService');

    var gridHelperService = require('../../services/gridHelperService');
    var entityViewerHelperService = require('../../services/entityViewerHelperService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var metaPermissionsService = require('../../services/metaPermissionsService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var transactionTypeGroupService = require('../../services/transaction/transactionTypeGroupService');

    var portfolioService = require('../../services/portfolioService');
    var instrumentTypeService = require('../../services/instrumentTypeService');
    var tagService = require('../../services/tagService');

    var uiService = require('../../services/uiService');

    var entityEditorHelper = require('../../helpers/entity-editor.helper');
    var objectComparisonHelper = require('../../helpers/objectsComparisonHelper');

    var referenceTableService = require('../../services/referenceTablesService')

    module.exports = function ($scope, $mdDialog, $state, entityType, entityId) {

        var vm = this;

        vm.entityType = entityType;
        vm.entityId = entityId;

        vm.entity = {};
        var originalEntity = {};
        vm.complexTransactionOptions = {};

        var originalEntityInputs = null;

        vm.processing = false;

        // Creating various variables to use as search terms for filters of repeating md-select components
        vm.searchTerms = {};

        vm.getInputsFilterST = function (name, index) {
            return name + index;
        };
        // < Creating various variables to use as search terms for filters of repeating md-select components >

        vm.readyStatus = {attrs: false, permissions: false, entity: false, layout: false};

        vm.entityTabs = metaService.getEntityTabs(vm.entityType);

        vm.editLayoutEntityInstanceId = null;
        vm.editLayoutByEntityInsance = false;

        vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getCurrentMember());
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

        vm.getCurrentMember = function () {

            usersService.getMyCurrentMember().then(function (data) {

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
            $mdDialog.hide();
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
                controller: 'TransactionTypeAddDialogController as vm',
                templateUrl: 'views/entity-viewer/transaction-type-add-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    entityType: vm.entityType,
                    entity: entity
                }
            });

            $mdDialog.hide();

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

        vm.attrs = [];
        vm.entityAttrs = [];
        vm.userInputs = [];
        vm.layoutAttrs = [];

        vm.entityAttrs = [];
        vm.range = gridHelperService.range;

        vm.transactionUserFields = {};

        vm.getTransactionUserFields = function () {

            return uiService.getTransactionFieldList().then(function (data) {

                data.results.forEach(function (field) {

                    vm.transactionUserFields[field.key] = field.name;

                })

            })

        };

        vm.getItem = function (fromChild) {

            return new Promise(function (res, rej) {

                entityResolverService.getByKey(vm.entityType, vm.entityId).then(function (data) {

                    if (data.inputs) {
                        originalEntityInputs = JSON.parse(JSON.stringify(data.inputs));
                    }

                    vm.entity = data;

                    vm.inputsGroup = {
                        "name": "<b>Inputs</b>",
                        "key": 'input'
                    };

                    vm.inputsFunctions = vm.entity.inputs.map(function (input) {

                        return {
                            "name": "Input: " + input.verbose_name + " (" + input.name + ")",
                            "description": "Transaction Type Input: " + input.verbose_name + " (" + input.name + ") ",
                            "groups": "input",
                            "func": input.name
                        }

                    });


                    /*vm.editLayout = function () {
                        $state.go('app.data-constructor', {
                            entityType: 'complex-transaction',
                            from: vm.entityType,
                            instanceId: data.id
                        });
                        $mdDialog.hide();
                    };*/

                    vm.manageAttrs = function () {
                        $state.go('app.attributesManager', {
                            entityType: 'transaction-type',
                            from: vm.entityType,
                            instanceId: data.id
                        });
                        $mdDialog.hide();
                    };


                    originalEntity = JSON.parse(JSON.stringify(vm.entity));

                    vm.getTransactionUserFields().then(function () {

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

                    vm.setStateInActionsControls();

                });

            });

        };

        vm.getAttrs = function () {
            attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;

                console.log('vm.attrs', vm.attrs);

                vm.readyStatus.attrs = true;
            });
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.attrs && vm.readyStatus.entity && vm.readyStatus.permissions && vm.readyStatus.layout;
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

                var isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);

                if (isValid) {

                    var result = entityEditorHelper.removeNullFields(vm.entity);

                    entityResolverService.update(vm.entityType, result.id, result).then(function (data) {

                        resolve(data);

                    });

                }

            })

        };

        vm.checkActionsForEmptyFields = function (actions) {

            var result = [];

            actions.forEach(function (action) {

                var actionKeys = Object.keys(action);

                actionKeys.forEach(function (actionKey) {

                    if (typeof action[actionKey] === 'object' && action[actionKey]) { // check if it is property that contains actions field data

                        var actionItem = action[actionKey];
                        var actionItemKeys = Object.keys(actionItem);

                        actionItemKeys = actionItemKeys.filter(function (key) {

                            return key.indexOf('_object') === -1 && key.indexOf('_input') === -1 && key.indexOf('_phantom') === -1 && key !== 'action_notes'

                        });

                        actionItemKeys.forEach(function (actionItemKey) {

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

                                if (actionItem[actionItemKey] === null || actionItem[actionItemKey] === undefined || actionItem[actionItemKey] === "") {

                                    result.push({
                                        action_notes: action.action_notes,
                                        key: actionItemKey,
                                        value: actionItem[actionItemKey]
                                    })

                                }

                            }


                        })

                    }


                })


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

        vm.checkEntityForEmptyFields = function (entity) {

            var result = [];

            if (entity.name === null || entity.name === undefined || entity.name === '') {
                result.push({
                    action_notes: 'General',
                    key: 'name',
                    name: 'Name',
                    value: entity.name
                })
            }

            if (entity.user_code === null || entity.user_code === undefined || entity.user_code === '') {
                result.push({
                    action_notes: 'General',
                    key: 'user_code',
                    name: 'User code',
                    value: entity.user_code
                })
            }

            if (entity.display_expr === null || entity.display_expr === undefined || entity.display_expr === '') {
                result.push({
                    action_notes: 'General',
                    key: 'display_expr',
                    name: 'Complex Transaction Date',
                    value: entity.display_expr
                })
            }

            if (entity.date_expr === null || entity.date_expr === undefined || entity.date_expr === '') {
                result.push({
                    action_notes: 'General',
                    key: 'date_expr',
                    name: 'Display Expression',
                    value: entity.date_expr
                })
            }

            if (entity.group === null || entity.group === undefined) {
                result.push({
                    action_notes: 'General',
                    key: 'group',
                    name: 'Group',
                    value: entity.group
                })
            }


            return result;

        };

        vm.save = function (entityToSave, withoutUpdating) {

            vm.processing = true;

            return new Promise(function (resolve, reject) {


                if (!entityToSave) {
                    entityToSave = vm.entity;
                }

                if (!withoutUpdating) {
                    vm.updateEntityBeforeSave();
                }

                var actionsErrors = vm.checkActionsForEmptyFields(entityToSave.actions);
                var entityErrors = vm.checkEntityForEmptyFields(entityToSave);

                console.log('vm.entity', vm.entity);

                console.log('actionsErrors', actionsErrors);
                console.log('entityErrors', entityErrors);

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

                    entityResolverService.update(vm.entityType, vm.entity.id, vm.entity).then(function (data) {

                        console.log('data', data);

                        vm.processing = false;
                        $scope.$apply();

                        if (data.status === 400) {
                            vm.handleErrors(data);
                        } else {

                            if (!withoutUpdating) {
                                // $mdDialog.hide({res: 'agree', data: data});
                                resolve(data)
                            }

                        }

                    }).catch(function (error) {

                        console.log('error', error);

                        vm.processing = false

                        $scope.$apply();

                        reject()

                    })

                }

            })


        };

        vm.saveAndExit = function () {

            vm.save().then(function (data) {
                $mdDialog.hide({res: 'agree', data: data});
            })

        };

        vm.getReferenceTables = function () {
            referenceTableService.getList().then(function (data) {

                vm.referenceTables = data.results;

                console.log('vm.referenceTables', vm.referenceTables);

                $scope.$apply();

            })
        };

        vm.init = function () {

            vm.getItem();
            vm.getAttrs();
            vm.getReferenceTables();


            vm.layoutAttrs = layoutService.getLayoutAttrs();
            vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

        };

        vm.init();

        vm.editLayout = function (ev) {

            var entityInputs = JSON.parse(angular.toJson(vm.entity.inputs));

            if (objectComparisonHelper.comparePropertiesOfObjects(originalEntityInputs, entityInputs)) {

                $mdDialog.show({
                    controller: 'EntityDataConstructorDialogController as vm',
                    templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
                    targetEvent: ev,
                    preserveScope: true,
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

            } else {

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/warning-dialog-view.html',
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
                                    name: "Close",
                                    response: false
                                }]
                        }
                    }

                }).then(function (res) {

                    if (res.status === 'agree') {

                        vm.save();

                    }
                    ;

                });

            }
            ;

            /*$state.go('app.data-constructor', {entityType: vm.entityType});
            $mdDialog.hide();*/
        };

        // Transaction type General Controller start

        vm.entity.book_transaction_layout = vm.entity.book_transaction_layout || '';
        vm.entity.actions = vm.entity.actions || [];
        vm.entity.inputs = vm.entity.inputs || [];

        vm.readyStatus = {transactionTypeGroups: false, instrumentTypes: false, portfolios: false, tags: false};

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
            instrumentTypeService.getList().then(function (data) {
                vm.instrumentTypes = data.results;
                vm.readyStatus.instrumentTypes = true;
                $scope.$apply();
            })
        };

        vm.getTags = function () {
            tagService.getListByContentType('transaction-type').then(function (data) {
                vm.tags = data.results;
                vm.readyStatus.tags = true;
                $scope.$apply();
            });

        };

        vm.unselectAllEntities = function (entity) {

            if (entity === 'instruments') {

                if (vm.entity.is_valid_for_all_instruments) {
                    v.entity.instrument_types = [];
                    ;
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
        };

        vm.bindSelectedText = function (entity, fallback) {
            if (entity) {
                return '[' + entity.length + ']';
            }
            return fallback;
        };

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

        vm.getTransactionTypeGroups();
        vm.getPortfolios();
        vm.getInstrumentTypes();
        vm.getTags();

        vm.tagTransform = function (newTag) {
            //console.log('newTag', newTag);
            var item = {
                name: newTag,
                id: null
            };

            return item;
        };

        $scope.$watch('vm.entity.tags', function () {

            if (vm.entity.tags) {
                vm.entity.tags.forEach(function (item) {
                    if (item.id == null) {
                        tagService.create({
                            name: item.name,
                            content_types: ['transactions.transactiontype']
                        })
                    }
                })

            }
        });

        vm.checkReadyStatus = function () {
            if (vm.readyStatus.transactionTypeGroups == true &&
                vm.readyStatus.portfolios == true &&
                vm.readyStatus.instrumentTypes == true &&
                vm.readyStatus.tags == true) {
                return true;
            }
            return false;
        }


        // Transaction Type General Controller end

        // Transaction Type Inputs Controller start

        vm.contextProperties = {

            'instruments.instrument': [
                {
                    key: 'instrument',
                    name: 'Instrument'
                }

                // TODO is not in use now
                // {
                //     id: 9,
                //     name: 'position'
                // },
                // {
                //     id: 10,
                //     name: 'effective_date'
                // }
            ],
            'currencies.currency': [
                {
                    key: 'pricing_currency',
                    name: 'Pricing Currency'
                },
                {
                    key: 'accrued_currency',
                    name: 'Accrued Currency'
                }
            ],
            'portfolios.portfolio': [
                {
                    key: 'portfolio',
                    name: 'Portfolio'
                }
            ],
            'accounts.account': [
                {
                    key: 'account',
                    name: 'Account'
                }
            ],
            'strategies.strategy1': [
                {
                    key: 'strategy1',
                    name: 'Strategy 1'
                }
            ],
            'strategies.strategy2': [
                {
                    key: 'strategy2',
                    name: 'Strategy 2'
                }
            ],
            'strategies.strategy3': [
                {
                    key: 'strategy3',
                    name: 'Strategy 3'
                }
            ]

        };

        vm.relationItems = {};

        vm.newItem = {
            content_type: null,
            account: null,
            instrument_type: null,
            instrument: null,
            currency: null,
            counterparty: null,
            is_fill_from_context: false,
            reference_table: null,
            responsible: null,
            portfolio: null,
            strategy1: null,
            strategy2: null,
            strategy3: null,
            daily_pricing_model: null,
            payment_size_detail: null,
            price_download_scheme: null,
            pricing_policy: null
        };

        vm.valueTypes = [
            {
                "display_name": "Number",
                "value": 20
            },
            {
                "display_name": "String",
                "value": 10
            },
            {
                "display_name": "Date",
                "value": 40
            },
            {
                "display_name": "Relation",
                "value": 100
            },
            {
                "display_name": "Selector",
                "value": 110
            }
        ];

        vm.contentTypes = metaContentTypesService.getListForTransactionTypeInputs();

        vm.bindValueType = function (row) {
            var name;

            vm.valueTypes.forEach(function (item) {
                if (row.value_type == item.value) {
                    row.value_type_name = item.display_name;
                    name = item.display_name;
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
        };

        vm.resolveRelation = function (item) {
            var relation;

            //console.log('item', item);
            vm.contentTypes.forEach(function (contentType) {
                if (contentType.key == item.content_type) {
                    relation = contentType.entity;
                }
            });

            //console.log('relation', relation);

            return relation
        };

        vm.resolveDefaultValue = function (item) {

            //console.log('item', item);

            if (item.value_type == 100) {

                var itemEntity = '';

                vm.contentTypes.forEach(function (contentType) {
                    if (item.content_type == contentType.key) {
                        itemEntity = contentType.entity;
                    }
                });

                if (item[itemEntity + '_object']) {
                    return item[itemEntity + '_object'].name;
                } else {

                    var entityName = '';

                    if (vm.relationItems[itemEntity]) {
                        vm.relationItems[itemEntity].forEach(function (relationItem) {
                            if (relationItem.id == item[itemEntity]) {
                                entityName = relationItem.name;
                            }
                        });
                    }

                    return entityName;
                }
            } else {
                return item.value;
            }

        };

        vm.toggleQuery = function () {
            vm.queryStatus = !vm.queryStatus;
            vm.query = {};
        };

        vm.setSort = function (propertyName) {
            vm.direction = (vm.sort === propertyName) ? !vm.direction : false;
            vm.sort = propertyName;
        };

        vm.updateInputFunctions = function () {

            vm.inputsGroup = {
                "name": "<b>Inputs</b>",
                "key": 'input'
            };

            vm.inputsFunctions = vm.entity.inputs.map(function (input) {

                return {
                    "name": "Input: " + input.verbose_name + " (" + input.name + ")",
                    "description": "Transaction Type Input: " + input.verbose_name + " (" + input.name + ") ",
                    "groups": "input",
                    "func": input.name
                }

            });

        };

        /*vm.editItem = function (item) {
            item.editStatus = true;
        };

        vm.saveItem = function (item) {

            vm.updateInputFunctions();

            item.editStatus = false;
        };*/

        /*vm.saveInputsRow = function (input) {
            for (var i = 0; i < originalEntity.inputs.length; i++) {

                if (originalEntity.inputs[i].id === input.id) {
                    originalEntity.inputs[i] = JSON.parse(JSON.stringify(input));

                    vm.save(originalEntity, true);
                    break;

                }

            }
        };*/

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

        vm.deleteItem = function (item, index) {

            vm.entity.inputs.splice(index, 1);

            vm.updateInputFunctions();

        };

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

        vm.valueTypeChanged = function (item) {
            item.content_type = null;
            item.is_fill_from_context = false;
            item.context_property = null;

            if (item.value_type === 100) {
                item.content_type = "accounts.account";
            }
        };

        vm.addRow = function () {

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

            originalEntity.inputs.push({
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

            originalEntityInputs = JSON.parse(JSON.stringify(originalEntity.inputs));
            vm.save(originalEntity, true);

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

        };

        // Transaction Type Input Controller end

        // Transaction type Actions controller start

        vm.relationItems = {};

        vm.contentTypes = metaContentTypesService.getListForTransactionTypeInputs();

        vm.toggleItem = function (pane, item, $event) {

            $event.stopPropagation();

            if (!$event.target.classList.contains('ttype-action-notes-input')) {
                pane.toggle();
                item.isPaneExpanded = !item.isPaneExpanded;
            }

        };

        vm.getActionTypeName = function (action) {

            if (action.instrument) {
                return "Create Instrument";
            }
            ;

            if (action.transaction) {
                return "Create Transaction";
            }
            ;

            if (action.instrument_factor_schedule) {
                return "Create Factor Schedule";
            }
            ;

            if (action.instrument_manual_pricing_formula) {
                return "Create Manual Pricing Formula";
            }
            ;

            if (action.instrument_accrual_calculation_schedules) {
                return "Create Accrual Calculation Schedules";
            }
            ;

            if (action.instrument_event_schedule) {
                return "Create Event Schedule";
            }
            ;

            if (action.instrument_event_schedule_action) {
                return "Create Event Schedule Action"
            }
            ;
        };

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

        vm.setStateInActionsControls = function () {

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

        }


        vm.resetProperty = function (item, propertyName, fieldName) {

            item[propertyName][fieldName] = null;
            item[propertyName][fieldName + '_input'] = null;

        };

        vm.resetPropertyBtn = function (item, propertyName, fieldName) {

            item[propertyName][fieldName] = null;
            item[propertyName][fieldName + '_input'] = null;

            if (item[propertyName].hasOwnProperty(fieldName + '_phantom')) {
                item[propertyName][fieldName + '_phantom'] = null;
            }

            item[propertyName][fieldName + '_toggle'] = !item[propertyName][fieldName + '_toggle'];

            if (item[propertyName][fieldName + '_toggle'] && !item[propertyName][fieldName]) {

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

                vm.loadRelation(relationType).then(function (data) {

                    var defaultPropertyName = 'name';
                    if (fieldName === 'price_download_scheme') {
                        defaultPropertyName = 'scheme_name';
                    }

                    vm.relationItems[relationType].forEach(function (relation) {

                        if (relation[defaultPropertyName] === "-" || relation[defaultPropertyName] === 'Default') {
                            item[propertyName][fieldName] = relation.id;

                            item[propertyName][fieldName + '_object'] = {};
                            item[propertyName][fieldName + '_object']['name'] = relation[defaultPropertyName];

                        }

                    });

                    $scope.$apply(function () {
                        setTimeout(function () {
                            $('body').find('.md-select-search-pattern').on('keydown', function (ev) {
                                ev.stopPropagation();
                            });
                        }, 100);
                    });

                });

            }

        };

        vm.findInputs = function (entity) {

            var content_type = '';
            var result;

            for (var i = 0; i < vm.contentTypes.length; i++) {
                if (vm.contentTypes[i].entity === entity) {
                    content_type = vm.contentTypes[i].key;
                    break;
                }
                ;
            }
            ;

            result = vm.entity.inputs.filter(function (input) {

                if (input.content_type === content_type) {
                    return true;
                }
                ;

                return false;
            });

            return result;

        };

        vm.deletePane = function (item, $index, $event) {

            $event.stopPropagation();
            var description = 'Are you sure to delete this action?';

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
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
                }
            });
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
                    'daily_pricing_model', 'daily_pricing_model_input', 'default_accrued',
                    'default_price', 'instrument_type', 'instrument_type_input', 'maturity_date',
                    'maturity_price', 'name', 'notes', 'payment_size_detail', 'payment_size_detail_input',
                    'price_download_scheme', 'price_download_scheme_input', 'price_multiplier',
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
                'instrument_manual_pricing_formula': [
                    'expr', 'instrument', 'instrument_input', 'instrument_phantom', 'notes', 'pricing_policy', 'pricing_policy_input'
                ],
                'instrument_factor_schedule': [
                    'instrument', 'instrument_input', 'instrument_phantom', 'effective_date', 'factor_value'
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
                    console.log("make copy", vm.entity.actions[a].action_notes, actionName);
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

        vm.loadRelation = function (field) {
            console.log("loadrelation2");
            console.log('field', field);

            return new Promise(function (resolve, reject) {
                if (!vm.relationItems[field]) {
                    fieldResolverService.getFields(field).then(function (data) {
                        vm.relationItems[field] = data.data;

                        /*$scope.$apply(function () {
                            setTimeout(function () {
                                $('body').find('.md-select-search-pattern').on('keydown', function (ev) {
                                    ev.stopPropagation();
                                });
                            }, 100);
                        });*/
                        $scope.$apply();

                        resolve(vm.relationItems[field]);
                    })
                } else {

                    resolve(vm.relationItems[field]);
                }

            })
        };

        vm.getNameByValueType = function (value) {

            for (var i = 0; i < vm.valueTypes.length; i++) {
                if (vm.valueTypes[i].value === value) {
                    return vm.valueTypes[i].display_name;
                }
            }

        };

        vm.getNameByContentType = function (contentType) {
            var typeName = '';
            vm.contentTypes.forEach(function (cType) {
                if (cType.key === contentType) {
                    typeName = cType.name;
                }
                ;
            });

            return typeName;
        };
        // Transaction type actions controller end


        // Special case for split-panel
        $scope.splitPanelInit = function (entityType, entityId) {
            vm.entityType = entityType;
            vm.entityId = entityId;
        };

    }

}());