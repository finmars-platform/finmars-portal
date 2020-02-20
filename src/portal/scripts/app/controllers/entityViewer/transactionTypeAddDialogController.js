/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');
    var fieldResolverService = require('../../services/fieldResolverService');

    var usersGroupService = require('../../services/usersGroupService');

    var layoutService = require('../../services/layoutService');
    var metaService = require('../../services/metaService');

    var gridHelperService = require('../../services/gridHelperService');

    var ecosystemDefaultService = require('../../services/ecosystemDefaultService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var transactionTypeGroupService = require('../../services/transaction/transactionTypeGroupService');

    var portfolioService = require('../../services/portfolioService');
    var instrumentTypeService = require('../../services/instrumentTypeService');
    var tagService = require('../../services/tagService');
    var usersService = require('../../services/usersService');


    var uiService = require('../../services/uiService');

    var entityEditorHelper = require('../../helpers/entity-editor.helper');

    module.exports = function ($scope, $mdDialog, $state, entityType, entity) {

        var vm = this;
        vm.readyStatus = {content: false, entity: true, permissions: true};
        vm.entityType = entityType;

        vm.entity = {$_isValid: true, visibility_status: 1};

        vm.processing = false;

        if (Object.keys(entity).length) {
            vm.entity = entity;
        }

        vm.entityTabs = metaService.getEntityTabs(vm.entityType);

        vm.editLayoutEntityInstanceId = null;
        vm.editLayoutByEntityInsance = false;
        vm.entitySpecialRules = false;
        vm.specialRulesReady = true;

        vm.attrs = [];
        var complexTransactionsAttrs = [];
        vm.entityAttrs = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();

        vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];

        // Creating various variables to use as search terms for filters of repeating md-select components
        vm.searchTerms = {};

        vm.getInputsFilterST = function (name, index) {
            return name + index;
        };
        // < Creating various variables to use as search terms for filters of repeating md-select components >

        vm.formIsFilled = false;

        vm.canManagePermissions = false;

        var ecosystemDefaultData = {};
        var inputsToDelete = [];

        vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getCurrentMember());
            promises.push(vm.getGroupList());

            Promise.all(promises).then(function (data) {

                vm.readyStatus.permissions = true;

                vm.setPermissionsDefaults();

                if (vm.currentMember && vm.currentMember.is_admin) {
                    vm.canManagePermissions = true;
                }

                $scope.$apply();
            });

        };

        vm.getCurrentMember = function () {

            return new Promise(function (resolve, reject) {

                usersService.getMyCurrentMember().then(function (data) {

                    vm.currentMember = data;

                    resolve(vm.currentMember);

                });

            })
        };

        vm.getGroupList = function () {

            return usersGroupService.getList().then(function (data) {

                vm.groups = data.results.filter(function (item) {

                    return item.role === 2;

                });

            });

        };

        vm.setPermissionsDefaults = function () {

            var contentType = metaContentTypesService.findContentTypeByEntity(vm.entityType);
            var table;
            var isCreator;

            // console.log('vm.groups', vm.groups);
            // console.log('vm.currentMember.groups', vm.currentMember.groups);


            vm.groups.forEach(function (group) {

                if (group.permission_table && group.permission_table.data) {

                    table = group.permission_table.data.find(function (item) {
                        return item.content_type === contentType
                    }).data;

                    isCreator = vm.currentMember.groups.indexOf(group.id) !== -1;

                    group.objectPermissions = {};

                    if (isCreator) {

                        if (table.creator_manage) {
                            group.objectPermissions.manage = true;

                            vm.canManagePermissions = true;
                        }

                        if (table.creator_change) {
                            group.objectPermissions.change = true;
                        }

                        if (table.creator_view) {
                            group.objectPermissions.view = true;
                        }


                    } else {

                        if (table.other_manage) {
                            group.objectPermissions.manage = true;

                            vm.canManagePermissions = true;
                        }

                        if (table.other_change) {
                            group.objectPermissions.change = true;
                        }

                        if (table.other_view) {
                            group.objectPermissions.view = true;
                        }


                    }

                }


            });

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        /*vm.editLayout = function (ev) {

            $mdDialog.show({
                controller: 'EntityDataConstructorDialogController as vm',
                templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        entityType: vm.entityType,
                        fromEntityType: vm.entityType
                    }
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.readyStatus.entity = false;
                    vm.readyStatus.layout = false;

                    vm.getList();

                    vm.layoutAttrs = layoutService.getLayoutAttrs();
                    vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];

                }

            });

        };*/

        vm.manageAttrs = function (ev) {
            var entityAddress = {entityType: vm.entityType};
            if (vm.entityType === 'transaction-type' || vm.entityType === 'complex-transaction') {
                entityAddress = {entityType: vm.entityType, from: vm.entityType};
            }
            $state.go('app.attributesManager', entityAddress);
            $mdDialog.hide();
        };

        vm.transactionUserFields = {};

        vm.getTransactionUserFields = function () {

            return uiService.getTransactionFieldList({pageSize: 1000}).then(function (data) {

                data.results.forEach(function (field) {

                    vm.transactionUserFields[field.key] = field.name;

                })

            })

        };

        vm.getAttributeTypes = function () {
            attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
                vm.readyStatus.content = true;

                vm.getTransactionUserFields().then(function () {

                    vm.readyStatus.entity = true;
                    vm.loadPermissions();

                })

            });

            attributeTypeService.getList('complex-transaction').then(function (data) {
                complexTransactionsAttrs = data.results;
            });


        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.content && vm.readyStatus.entity && vm.readyStatus.permissions
        };

        vm.range = gridHelperService.range;

        vm.updateEntityBeforeSave = function () {

            if (metaService.getEntitiesWithoutDynAttrsList().indexOf(vm.entityType) === -1) {

                vm.entity.attributes = [];

                vm.attrs.forEach(function (attributeType) {

                    var value = vm.entity[attributeType.user_code];

                    vm.entity.attributes.push(entityEditorHelper.appendAttribute(attributeType, value));

                });
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

        var checkActionsFieldsExpr = function (actionFieldValue, actionItemKey, actionNotes) {

            for (var a = 0; a < inputsToDelete.length; a++) {
                var dInputName = inputsToDelete[a];

                var propWithSameName = '.' + dInputName;

                if (actionFieldValue.indexOf(dInputName) !== -1 &&
                    actionFieldValue.indexOf(propWithSameName) === -1) { // check whether expression refers to input and not property with same name

                    var actionFieldLocation = {
                        action_notes: actionNotes,
                        key: actionItemKey,
                        message: "The deleted input is used in the Expression."
                    };

                    return actionFieldLocation;

                }
            }

        };

        vm.checkActionsForEmptyFields = function (actions) {

            var result = [];

            actions.forEach(function (action) {

                var actionKeys = Object.keys(action);

                actionKeys.forEach(function (actionKey) {

                    if (typeof action[actionKey] === 'object' && action[actionKey]) {

                        var actionItem = action[actionKey];
                        var actionItemKeys = Object.keys(actionItem);

                        actionItemKeys = actionItemKeys.filter(function (key) {

                            return key.indexOf('_object') === -1 && key.indexOf('_input') === -1 && key.indexOf('_phantom') === -1

                        });

                        console.log('actionItemKeys', actionItemKeys);

                        actionItemKeys.forEach(function (actionItemKey) {

                            if (actionItem.hasOwnProperty(actionItemKey + '_input')) {

                                var inputValue = actionItem[actionItemKey + '_input'];
                                var relationValue = actionItem[actionItemKey];

                                var valueIsEmpty = false;

                                console.log('actionItemKey', actionItemKey);
                                console.log('inputValue', inputValue);
                                console.log('relationValue', relationValue);

                                if (actionItem.hasOwnProperty(actionItemKey + '_phantom')) {

                                    var phantomValue = actionItem[actionItemKey + '_phantom'];

                                    console.log('phantomValue', phantomValue);

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

                                } else if (typeof actionItem[actionItemKey] === 'string') {

                                    var fieldWithInvalidExpr = checkActionsFieldsExpr(actionItem[actionItemKey], actionItemKey, action.action_notes);

                                    if (fieldWithInvalidExpr) {
                                        result.push(fieldWithInvalidExpr);
                                    }

                                }

                            }


                        })

                    }


                })


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
                    name: 'Display Expression',
                    value: entity.display_expr
                })
            }

            if (entity.date_expr === null || entity.date_expr === undefined || entity.date_expr === '') {
                result.push({
                    action_notes: 'General',
                    key: 'date_expr',
                    name: 'Complex Transaction Date',
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

        var getUserInputs = function (inputs) {

            var userInputs = [];

            inputs.forEach(function (input) {

                var input_value_type = input.value_type;
                if (input.value_type === 100) {
                    input_value_type = 'field'
                }

                var contentType;

                if (input.content_type && input.content_type !== undefined) {

                    contentType = input.content_type.split('.')[1];

                    if (contentType === 'eventclass') {
                        contentType = 'event_class';
                    }

                    if (contentType === 'notificationclass') {
                        contentType = 'notification_class';
                    }

                    if (contentType === 'accrualcalculationmodel') {
                        contentType = 'accrual_calculation_model';
                    }

                    if (contentType === 'pricingpolicy') {
                        contentType = 'pricing_policy';
                    }

                } else {

                    contentType = input.name.split(' ').join('_').toLowerCase();

                }

                userInputs.push({
                    key: contentType,
                    name: input.name,
                    reference_table: input.reference_table,
                    verbose_name: input.verbose_name,
                    content_type: input.content_type,
                    value_type: input_value_type
                });

            });

            return userInputs;

        };

        var doNotUseForEditLayoutAttrs = ['transaction_type', 'code', 'date', 'status', 'text',
            'user_text_1', 'user_text_2', 'user_text_3', 'user_text_4', 'user_text_5', 'user_text_6',
            'user_text_7', 'user_text_8', 'user_text_9', 'user_text_10', 'user_text_1', 'user_text_11',
            'user_text_12', 'user_text_13', 'user_text_14', 'user_text_15', 'user_text_16', 'user_text_17',
            'user_text_18', 'user_text_19', 'user_text_20', 'user_number_1', 'user_number_2',
            'user_number_3', 'user_number_4', 'user_number_5', 'user_number_6', 'user_number_7',
            'user_number_8', 'user_number_9', 'user_number_10', 'user_number_11', 'user_number_12',
            'user_number_13', 'user_number_14', 'user_number_15', 'user_number_16', 'user_number_17',
            'user_number_18', 'user_number_19', 'user_number_20', 'user_date_1', 'user_date_2', 'user_date_3', 'user_date_4', 'user_date_5'];

        var createDefaultEditLayout = function (ttypeData) {

            var instanceId = ttypeData.id;
            var elFields = [];
            var elAttrIndex = 0;
            var complTransactionAttrs = metaService.getEntityAttrs('complex-transaction');

            var editLayoutEntityAttrs = complTransactionAttrs.filter(function (entity) {
                return doNotUseForEditLayoutAttrs.indexOf(entity.key) === -1;
            });
            var userInputs = getUserInputs(ttypeData.inputs);

            var addFields = function (attrType) {

                var attributes = [];
                var attributeClass = '';

                switch (attrType) {
                    case 'attrs':
                        attributes = complexTransactionsAttrs;
                        attributeClass = 'attr';
                        break;
                    case 'entityAttrs':
                        attributes = editLayoutEntityAttrs;
                        attributeClass = 'entityAttr';
                        break;
                    case 'userInputs':
                        attributes = userInputs;
                        attributeClass = 'userInput';
                        break;
                    case 'layoutAttrs':
                        attributes = vm.layoutAttrs;
                        attributeClass = 'decorationAttr';
                        break;
                }

                attributes.forEach(function (attribute) {

                    if (attribute.key !== 'object_permissions_user' &&
                        attribute.key !== 'object_permissions_group') {

                        elAttrIndex += 1;

                        var fieldData = {
                            "type": "field",
                            "row": elAttrIndex,
                            "attribute": {
                                "value_type": attribute.value_type,
                                "content_type": attribute.content_type,
                                "editable": true,
                                "key": attribute.key,
                                "name": attribute.name
                            },
                            "column": 1,
                            "attribute_class": attributeClass,
                            "editable": true,
                            "name": attribute.name,
                            "colspan": 1
                        };

                        if (attrType === 'attrs') {
                            fieldData.attribute.id = attribute.id;
                        }

                        elFields.push(fieldData);

                    }

                });

            };

            addFields("attrs");
            addFields("entityAttrs");
            addFields("userInputs");
            addFields("layoutAttrs");

            var editLayoutData = {
                "data": [
                    {
                        "layout": {
                            "rows": elAttrIndex,
                            "columns": 1,
                            "fields": elFields
                        },
                        "id": 1,
                        "name": "Transaction Inputs"
                    }
                ]
            };

            return uiService.updateEditLayoutByInstanceId('complex-transaction', instanceId, editLayoutData);

        };

        vm.save = function ($event) {

            vm.processing = true;

            return new Promise(function (resolve, reject) {

                vm.updateEntityBeforeSave();

                var actionsErrors = vm.checkActionsForEmptyFields(vm.entity.actions);
                var entityErrors = vm.checkEntityForEmptyFields(vm.entity);

                console.log('vm.entity before save', vm.entity);

                if (actionsErrors.length || entityErrors.length) {

                    $mdDialog.show({
                        controller: 'TransactionTypeValidationErrorsDialogController as vm',
                        templateUrl: 'views/entity-viewer/transaction-type-validation-errors-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
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

                    entityResolverService.create(vm.entityType, vm.entity).then(function (data) {

                        createDefaultEditLayout(data).then(function () {
                            vm.processing = false;

                            $scope.$apply();

                            resolve();
                        });

                    }).catch(function (data) {

                        $mdDialog.show({
                            controller: 'ValidationDialogController as vm',
                            templateUrl: 'views/dialogs/validation-dialog-view.html',
                            targetEvent: $event,
                            locals: {
                                validationData: data
                            },
                            preserveScope: true,
                            multiple: true,
                            autoWrap: true,
                            skipHide: true
                        });

                        vm.processing = false;

                        reject();

                    })

                }

            })

        };

        vm.saveAndExit = function ($event) {

            vm.save().then(function (data) {

                $mdDialog.hide({res: 'agree', data: data});

            })

        };

        // Transaction type General Controller start

        vm.entity.book_transaction_layout = vm.entity.book_transaction_layout || '';
        vm.entity.actions = vm.entity.actions || [];
        vm.entity.inputs = vm.entity.inputs || [];

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
            instrumentTypeService.getList().then(function (data) {
                vm.instrumentTypes = data.results;
                vm.readyStatus.instrumentTypes = true;
                $scope.$apply();
            })
        };

        /*vm.getTags = function () {
            tagService.getListByContentType('transaction-type').then(function (data) {
                vm.tags = data.results;
                vm.readyStatus.tags = true;
                $scope.$apply();
            });

        };*/

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

        vm.bindSelectedText = function (entity, fallback) {
            if (entity) {
                return '[' + entity.length + ']';
            }
            return fallback;
        };

        /*vm.tagTransform = function (newTag) {
            //console.log('newTag', newTag);
            var item = {
                name: newTag,
                id: null
            };

            return item;
        };*/

        vm.checkReadyStatus = function () {
            if (vm.readyStatus.transactionTypeGroups == true &&
                vm.readyStatus.portfolios == true &&
                vm.readyStatus.instrumentTypes == true) {
                return true;
            }
            return false;
        };


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
                    name = item.display_name
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
            var entityKey;

            for (var i = 0; i < vm.contentTypes.length; i++) {
                if (vm.contentTypes[i].key == item.content_type) {
                    entityKey = vm.contentTypes[i].entity;
                    entityKey = entityKey.replace(/-/g, '_');

                    return entityKey;
                }
            }

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

        vm.editItem = function (item) {
            item.editStatus = true;
        };

        vm.updateInputFunctions = function () {

            vm.inputsGroup = {
                "name": "<b>Inputs</b>",
                "key": 'input'
            };

            if (vm.entity.inputs && vm.entity.inputs.length > 0) {

                vm.inputsFunctions = vm.entity.inputs.map(function (input) {

                    return {
                        "name": "Input: " + input.verbose_name + " (" + input.name + ")",
                        "description": "Transaction Type Input: " + input.verbose_name + " (" + input.name + ") ",
                        "groups": "input",
                        "func": input.name
                    }

                });

            } else {

                vm.inputsFunctions = null;

            }

        };

        vm.saveItem = function (item) {

            vm.updateInputFunctions();

            item.editStatus = false;
        };

        var removeInputFromActions = function (deletedInputName) {

            inputsToDelete.push(deletedInputName);

            vm.entity.actions.forEach(function (action) {

                var actionKeys = Object.keys(action);

                actionKeys.forEach(function (actionKey) {

                    if (typeof action[actionKey] === 'object' && action[actionKey]) { // check if it is property that contains actions field data

                        var actionType = action[actionKey];
                        var actionTypeKeys = Object.keys(actionType);

                        var i;
                        for (i = 0; i < actionTypeKeys.length; i++) {

                            var key = actionTypeKeys[i];
                            var actionFieldValue = actionType[key];

                            if (key.length > 7 &&
                                key.indexOf('_input') === key.length - 6 &&
                                actionFieldValue === deletedInputName) { // if field is input fields

                                actionType[key] = null;

                            }


                        }


                    }

                });

            });

        };

        vm.deleteInput = function (item, index, $event) {

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

            // if created input with name of deleted one, remove it from warning
            for (var i = 0; i < inputsToDelete.length; i++) {
                var inputToDelete = inputsToDelete[i];

                if (inputToDelete === vm.newItem.name) {
                    inputsToDelete.splice(i, 1);
                    break;
                }
            }
            // < if created input with name of deleted one, remove it from warning >

            vm.newItem.name = null;
            vm.newItem.verbose_name = null;
            vm.newItem.value_type = null;
            vm.newItem.content_type = null;
            vm.newItem.is_fill_from_context = false;
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

        // Transaction Type Recon start

        vm.addReconField = function () {

            vm.entity.recon_fields.push(Object.assign({}, vm.newReconField));

            vm.newReconField = {};

        };

        vm.deleteReconField = function ($event, $index) {

            vm.entity.recon_fields.splice($index, 1);

        };

        // Transaction Type Recon end

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

            if (action.transaction) {
                return "Create Transaction";
            }

            if (action.instrument_factor_schedule) {
                return "Create Factor Schedule";
            }

            if (action.instrument_manual_pricing_formula) {
                return "Create Manual Pricing Formula";
            }

            if (action.instrument_accrual_calculation_schedules) {
                return "Create Accrual Calculation Schedules";
            }

            if (action.instrument_event_schedule) {
                return "Create Event Schedule";
            }

            if (action.instrument_event_schedule_action) {
                return "Create Event Schedule Action"
            }

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
                name: "If exists: Phantom = existing Instrument, don't Overwrite. If not exists: create Instrument.",
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

        vm.actionsKeysList = [
            'instrument',
            'transaction',
            'instrument_factor_schedule',
            'instrument_manual_pricing_formula',
            'instrument_accrual_calculation_schedules',
            'instrument_event_schedule',
            'instrument_event_schedule_action'
        ];

        vm.checkActionsIsNotNull = function () {
            return false;
        };

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

        var setDefaultValueForRelation = function (actionData, propertyName, fieldName) {

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
                nameProperty = 'scheme_name';
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

        };

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

                setDefaultValueForRelation(item, propertyName, fieldName);

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

        vm.makeCopyOfAction = function (actionToCopy, index) {

            var actionCopy = JSON.parse(JSON.stringify(actionToCopy));

            delete actionCopy.$$hashKey;

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

        vm.moveDown = function (item, $index) {

            var swap = JSON.parse(JSON.stringify(item));
            vm.entity.actions[$index] = vm.entity.actions[$index + 1];
            vm.entity.actions[$index + 1] = swap;
            vm.findPhantoms();

        };

        vm.moveUp = function (item, $index) {

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

            console.log('field', field);
            field = field.replace(/-/g, "_");

            return new Promise(function (resolve, reject) {
                if (!vm.relationItems[field]) {

                    fieldResolverService.getFields(field).then(function (data) {
                        vm.relationItems[field] = data.data;

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

            for (var i = 0; i < vm.contentTypes.length; i++) {
                if (vm.contentTypes[i].key === contentType) {
                    return vm.contentTypes[i].name;
                }

            }

        };

        vm.getInputTemplates = function () {

            vm.readyStatus.input_templates = false;

            return uiService.getTemplateLayoutList({filters: {type: 'input_template'}}).then(function (data) {

                vm.inputTemplates = data.results;

                vm.readyStatus.input_templates = true;

                $scope.$apply();

            })

        };

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

        vm.appendFromTemplate = function ($event, template) {

            console.log("Append from Template", template);

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

        };

        vm.saveAsTemplate = function ($event, type) {

            console.log("Save as Template")

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


        // Transaction type actions controller end

        vm.init = function () {

            ecosystemDefaultService.getList().then(function (data) {
                ecosystemDefaultData = data.results[0];
            });

            vm.getAttributeTypes();
            vm.getTransactionTypeGroups();
            vm.getPortfolios();
            vm.getInstrumentTypes();
            // vm.getTags();

            vm.getInputTemplates();
            vm.getFieldTemplates();
            vm.getActionTemplates();

            vm.updateInputFunctions();

            /*$scope.$watch('vm.entity.tags', function () {

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
            });*/

        };

        vm.init();

    }

}());