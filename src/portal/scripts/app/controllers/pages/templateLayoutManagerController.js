/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../../services/uiService');
    var metaContentTypesService = require('../../services/metaContentTypesService');

    var ecosystemDefaultService = require('../../services/ecosystemDefaultService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.items = [];
        vm.readyStatus = {input: false, field: false, action: false};

        vm.activeInputTemplateId = null;
        vm.activeFieldTemplateId = null;
        vm.activeActionTemplateId = null;

        vm.activeInputTemplate = {
            type: 'input_template',
            data: {
                inputs: []
            }
        };

        vm.activeFieldTemplate = {
            type: 'field_template',
            data: {
                fields: {}
            }
        };

        vm.activeActionTemplate = {
            type: 'action_template',
            data: {
                actions: []
            }
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

        vm.contentTypes = metaContentTypesService.getListForTransactionTypeInputs();

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
            }
        ];

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

        vm.transactionUserFields = {};

        var ecosystemDefaultData = {};

        vm.getTransactionUserFields = function () {

            return uiService.getTransactionFieldList().then(function (data) {

                data.results.forEach(function (field) {

                    vm.transactionUserFields[field.key] = field.name;

                })

            })

        };

        vm.getInputTemplates = function () {

            vm.readyStatus.input = false;

            return uiService.getTemplateLayoutList({filters: {type: 'input_template'}}).then(function (data) {

                vm.inputTemplates = data.results;

                if (vm.inputTemplates.length) {
                    vm.activeInputTemplate = vm.inputTemplates[0];
                    vm.activeInputTemplateId = vm.inputTemplates[0].id;
                }

                vm.readyStatus.input = true;

                $scope.$apply();

            })

        };

        vm.getFieldTemplates = function () {

            vm.readyStatus.field = false;

            return uiService.getTemplateLayoutList({filters: {type: 'field_template'}}).then(function (data) {

                vm.fieldTemplates = data.results;

                if (vm.fieldTemplates.length) {
                    vm.activeFieldTemplate = vm.fieldTemplates[0];
                    vm.activeFieldTemplateId = vm.fieldTemplates[0].id;
                }

                vm.readyStatus.field = true;

                $scope.$apply();

            })

        };

        vm.getActionTemplates = function () {

            vm.readyStatus.action = false;

            return uiService.getTemplateLayoutList({filters: {type: 'action_template'}}).then(function (data) {

                vm.actionTemplates = data.results;

                if (vm.actionTemplates.length) {
                    vm.activeActionTemplate = vm.actionTemplates[0];
                    vm.activeActionTemplateId = vm.actionTemplates[0].id;
                }

                vm.readyStatus.action = true;

                $scope.$apply();

            })

        };

        // INPUTS TAB START

        vm.addInput = function ($event) {

            vm.activeInputTemplate.data.inputs.push({});

            console.log('vm.activeInputTemplate', vm.activeInputTemplate);

        };

        vm.deleteInput = function ($event, input, $index) {

            vm.activeInputTemplate.data.inputs = vm.activeInputTemplate.data.inputs.filter(function (item, index) {

                return $index !== index;

            })

        };

        // INPUTS TAB END

        // ACTIONS TAB START

        vm.toggleItem = function (pane, item, $event) {

            $event.stopPropagation();

            if (!$event.target.classList.contains('ttype-action-notes-input')) {
                pane.toggle();
                item.isPaneExpanded = !item.isPaneExpanded;
            }

        };

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

            vm.activeActionTemplate.data.actions.forEach(function (action) {

                var keys;

                vm.actionsKeysList.forEach(function (actionKey) {

                    if (action[actionKey] !== null) {
                        keys = Object.keys(action[actionKey]);

                        keys.forEach(function (key) {
                            if (action[actionKey].hasOwnProperty(key + '_input')) {
                                /*if (action[actionKey][key + '_field_type'] === 'relation') {
                                    action[actionKey][key + '_toggle'] = true;

                                    setDefaultValueForRelation(action, actionKey, key);
                                }*/
                                action[actionKey][key + '_toggle'] = true;

                                setDefaultValueForRelation(action, actionKey, key);
                            }
                        })
                    }

                })

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

            vm.activeActionTemplate.data.actions.push(result);

        };

        vm.moveDown = function (item, $index, $event) {

            $event.stopPropagation();

            var swap = JSON.parse(JSON.stringify(item));
            vm.activeActionTemplate.data.actions[$index] = vm.activeActionTemplate.data.actions[$index + 1];
            vm.activeActionTemplate.data.actions[$index + 1] = swap;

        };

        vm.moveUp = function (item, $index, $event) {

            $event.stopPropagation();

            var swap = JSON.parse(JSON.stringify(item));
            vm.activeActionTemplate.data.actions[$index] = vm.activeActionTemplate.data.actions[$index - 1];
            vm.activeActionTemplate.data.actions[$index - 1] = swap;

        };

        // ACTIONS TAB END

        vm.saveTemplate = function ($event, template) {

            uiService.updateTemplateLayout(template.id, template).then(function (data) {

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
                            description: "Template successfully updated"
                        }
                    }
                });

                vm.getData().then(function (value) {


                    if (template.type === 'input_template') {

                        vm.activeInputTemplateId = data.id;
                        vm.activeInputTemplate = data;

                    }

                    if (template.type === 'field_template') {

                        vm.activeFieldTemplateId = data.id;
                        vm.activeFieldTemplate = data;

                    }

                    if (template.type === 'action_template') {

                        vm.activeActionTemplateId = data.id;
                        vm.activeActionTemplate = data;
                        vm.setStateInActionsControls();

                    }


                })

            });

        };

        vm.saveTemplateAs = function ($event, template) {

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
                    data: template
                }
            }).then(function (res) {


                if (res.status === 'agree') {

                    template.name = res.data.name;

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

                        vm.getData().then(function (value) {


                            if (template.type === 'input_template') {

                                vm.activeInputTemplateId = data.id;
                                vm.activeInputTemplate = data;

                            }

                            if (template.type === 'field_template') {

                                vm.activeFieldTemplateId = data.id;
                                vm.activeFieldTemplate = data;

                            }

                            if (template.type === 'action_template') {

                                vm.activeActionTemplateId = data.id;
                                vm.activeActionTemplate = data;
                                vm.setStateInActionsControls();

                            }


                        })

                    })

                }

            });


        };

        vm.renameTemplate = function ($event, template) {

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
                    data: template
                }
            }).then(function (res) {


                if (res.status === 'agree') {

                    template.name = res.data.name;

                    uiService.updateTemplateLayout(template.id, template).then(function (data) {

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
                                    description: "Template successfully renamed"
                                }
                            }
                        });

                        vm.getData().then(function (value) {

                            if (template.type === 'input_template') {

                                vm.activeInputTemplateId = data.id;
                                vm.activeInputTemplate = data;

                            }

                            if (template.type === 'field_template') {

                                vm.activeFieldTemplateId = data.id;
                                vm.activeFieldTemplate = data;

                            }

                            if (template.type === 'action_template') {

                                vm.activeActionTemplateId = data.id;
                                vm.activeActionTemplate = data;
                                vm.setStateInActionsControls();

                            }


                        })

                    })

                }

            })

        };

        vm.deleteTemplate = function ($event, template) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure you want to delete this template?"
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                console.log('res', res);
                if (res.status === 'agree') {

                    var type = template.type;

                    uiService.deleteTemplateLayoutByKey(template.id).then(function (data) {

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
                                    description: "Template was deleted"
                                }
                            }
                        });

                        if (type === 'input_template') {
                            vm.activeInputTemplate = {
                                type: 'input_template',
                                data: {
                                    inputs: []
                                }
                            };
                        }

                        if (type === 'field_template') {

                            vm.activeFieldTemplate = {
                                type: 'field_template',
                                data: {
                                    fields: {}
                                }
                            };

                        }

                        if (type === 'action_template') {

                            vm.activeActionTemplate = {
                                type: 'action_template',
                                data: {
                                    actions: []
                                }
                            };

                        }

                        vm.getData().then(function () {
                            vm.getTransactionUserFields();
                        });

                    });

                }

            })

        };

        vm.setActiveTemplate = function () {

            vm.inputTemplates.forEach(function (item) {

                if (item.id === vm.activeInputTemplateId) {
                    vm.activeInputTemplate = item;
                }

            });

            vm.fieldTemplates.forEach(function (item) {

                if (item.id === vm.activeFieldTemplateId) {
                    vm.activeFieldTemplate = item;
                }

            });

            vm.actionTemplates.forEach(function (item) {

                if (item.id === vm.activeActionTemplateId) {
                    vm.activeActionTemplate = item;
                    vm.setStateInActionsControls();
                }

            });

        };

        vm.getData = function () {

            return new Promise(function (resolve, reject) {

                var promises = [];

                promises.push(vm.getInputTemplates());
                promises.push(vm.getFieldTemplates());
                promises.push(vm.getActionTemplates());

                Promise.all(promises).then(function (value) {

                    resolve()

                })

            })
        };

        // disable relation field when action opened in template manager
        vm.isRelationInputFieldDisabled = function () {
            return true;
        };

        vm.init = function () {

            ecosystemDefaultService.getList().then(function (data) {
                ecosystemDefaultData = data.results[0];

                vm.getData().then(function () {
                    vm.setStateInActionsControls();
                });
            });

            vm.getTransactionUserFields();

        };

        vm.init();

    }

}());
