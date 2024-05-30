const importTransactionService = require("../../../services/import/importTransactionService");
const {default: metaHelper} = require("../../../helpers/meta.helper");
/**
 * Created by szhitenev on 07.02.2023.
 */
(function () {

    'use strict';

    const metaService = require('../../../services/metaService').default;
    const metaHelper = require('../../../helpers/meta.helper').default;

    module.exports = function transactionImportSchemeEditDialogController($scope, $mdDialog, toastNotificationService, transactionTypeService, transactionImportSchemeService, importSchemesMethodsService, data) {

        const vm = this;

        if (!data || typeof data !== 'object') {
            throw `Invalid data passed as 'data'. Expected an object got: ${data}`;
        }

        const dialogsWrapElem = document.querySelector('.dialog-containers-wrap');
        const ttypeNotFoundErrorMsg = "⚠️ Transaction Type is not found";

        let schemeToCopy = null

        if (data.scheme) {
            schemeToCopy = JSON.parse(angular.toJson(data.scheme));
        }

        vm.processing = false;

        vm.scheme = {};
        vm.readyStatus = {scheme: false, transactionTypes: false};

        vm.inputsGroup = {
            "name": "<b>Imported</b>",
            "key": 'input'
        };

        vm.dryRunData = JSON.stringify([{"user_code": "example"}], null, 4)
        vm.activeDryRunResultItem = null;

        const getRuleScenarioTplt = function (ruleScenarioKey) {
            return {
                value: '',
                transaction_type: null,
                is_default_rule_scenario: false,
                is_error_rule_scenario: false,
                fields: [],
                selector_values: [],
                frontOptions: {
                    key: metaHelper.generateUniqueId(ruleScenarioKey),
                    transactionTypeInputs: []
                }
            }
        };

        vm.ruleScenarioInputsOpts = {
            noIndicatorBtn: true,
            readonly: true,
        }

        vm.defaultRuleScenario = getRuleScenarioTplt("default");
        vm.defaultRuleScenario.name = '-';
        vm.defaultRuleScenario.is_default_rule_scenario = true;

        vm.errorRuleScenario = getRuleScenarioTplt("error");
        vm.errorRuleScenario.name = '-';
        vm.errorRuleScenario.is_error_rule_scenario = true;

        vm.inputsFunctions = [];

        vm.selectorValuesOpts = [];
        vm.selectorValuesMultiselectOpts = {
            optionsOrdering: false
        }

        vm.editingScheme = false;

        vm.inputsOpts = {
            noIndicatorBtn: true,
        }

        const schemeId = data.schemeId || null;

        if (schemeId) {
            vm.editingScheme = true;
        }

        vm.getFunctions = function () {

            return vm.schemeInputs.map(function (input) {

                return {
                    "name": "Imported: " + input.name + " (column #" + input.column + ")",
                    "description": "Imported: " + input.name + " (column #" + input.column + ") " + "-> " + input.name_expr,
                    "groups": "input",
                    "func": input.name,
                    "validation": {
                        "func": input.name
                    }
                }

            });

        };

        vm.ruleScenarios = [];

        // called `vm.schemeInputs` to prevent confusion with TType inputs
        vm.schemeInputs = [];

        vm.calculatedInputs = [];
        vm.reconScenarios = [];

        vm.openSelectorManager = function ($event) {

            // Open Selector Dialog Here

            $mdDialog.show({
                controller: 'TransactionImportSchemeSelectorValuesDialogController as vm',
                templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-selector-values-dialog-view.html',
                parent: dialogsWrapElem,
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        selector_values: vm.scheme.selector_values
                    }
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.scheme.selector_values = res.data;

                    vm.selectorValuesOpts = vm.scheme.selector_values.map(function (item) {
                        return {
                            id: item.value,
                            value: item.value
                        }
                    });

                }

            })

        };

        vm.openScenarioFieldsManager = function ($event, item) {

            $mdDialog.show({
                controller: 'TransactionImportSchemeScenarioFieldsDialogController as vm',
                templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-scenario-fields-dialog-view.html',
                parent: dialogsWrapElem,
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        item: item
                    }
                }
            })

        };

        /*vm.addReconScenario = function ($event) {

            vm.reconScenarios.push({
                scenario_name: '',
                selector_values: [],
                line_reference_id: '',
                reference_date: '',
                fields: []
            })

        };*/

        vm.deleteReconScenario = function (item, $index) {
            vm.reconScenarios.splice($index, 1);
        };

        const getTTypeInputsForScenario = function (transactionTypeInputs) {

            return transactionTypeInputs.filter(function (input) {
                return input.value_type !== 120;
            });

        }

        const formatItemForFrontEnd = function (item, index) {

            const itemCopy = structuredClone(item);

            itemCopy.frontOptions = {
                key: metaHelper.generateUniqueId(index),
            }

            return itemCopy;

        }

        const sortItemsByProp = function (valueA, valueB) {
            if (valueA > valueB) {
                return 1;
            }
            if (valueA < valueB) {
                return -1;
            }

            return 0;
        }

        vm.transformSourceSchemeToFrontendLogic = function() {

            if (vm.scheme.inputs?.length) {

                vm.schemeInputs = vm.scheme.inputs.map(formatItemForFrontEnd);

                vm.schemeInputs = vm.schemeInputs.sort(function (a, b) {
                    if (a.column > b.column) {
                        return 1;
                    }
                    if (a.column < b.column) {
                        return -1;
                    }

                    return 0;
                });

                vm.inputsFunctions = vm.getFunctions();

            }

            if (vm.scheme.calculated_inputs?.length) {

                vm.calculatedInputs = [];

                vm.calculatedInputs = vm.scheme.calculated_inputs.map(formatItemForFrontEnd);

                vm.calculatedInputs = vm.calculatedInputs.sort(function (a, b) {
                    return sortItemsByProp(a.column, b.column);
                });

                vm.inputsFunctions = vm.getFunctions();

            }

            if (vm.scheme.rule_scenarios?.length) {

                vm.ruleScenarios = [];

                vm.scheme.rule_scenarios.forEach(function (scenario, index) {

                    const scenarioCopy = formatItemForFrontEnd(scenario, index);

                    if (scenarioCopy.transaction_type_object) {

                        scenarioCopy.frontOptions.transactionTypeInputs = getTTypeInputsForScenario(scenario.transaction_type_object.inputs);

                    } else {
                        scenarioCopy.error_message = ttypeNotFoundErrorMsg;
                    }

                    if (scenarioCopy.frontOptions.transactionTypeInputs) {

                        scenarioCopy.frontOptions.transactionTypeInputs.forEach(function (ttypeInput) {

                            scenarioCopy.fields.forEach(function (field) {

                                if (field.transaction_type_input === ttypeInput.name) {

                                    ttypeInput.expression = field.value_expr

                                }

                            })


                        })

                    } else {
                        scenarioCopy.frontOptions.transactionTypeInputs = [];
                    }

                    if (scenarioCopy.is_default_rule_scenario) {
                        vm.defaultRuleScenario = scenarioCopy;

                    } else if (scenarioCopy.is_error_rule_scenario) {
                        vm.errorRuleScenario = scenarioCopy;

                    } else {
                        vm.ruleScenarios.push(scenarioCopy);
                    }


                })

            }

            if (vm.scheme.recon_scenarios?.length) {
                vm.reconScenarios = [];

                vm.scheme.recon_scenarios.forEach(function (item) {
                    vm.reconScenarios.push(item)
                })
            }

            if (vm.scheme.selector_values?.length) {

                vm.selectorValuesOpts = vm.scheme.selector_values.map(function (item) {
                    return {
                        id: item.value,
                        value: item.value
                    }
                });

            }

        }

        const applySchemeCopy = function (scheme) {

            delete scheme.id;

            scheme = metaHelper.clearFrontendOptions(scheme);

            scheme["user_code"] = scheme["user_code"] + '_copy';

            const deleteIds = function(item) {
                delete item.id;
            };

            if (scheme.inputs.length) {
                scheme.inputs.forEach(deleteIds);
            }

            if (scheme.calculated_inputs?.length) {
                scheme.calculated_inputs.forEach(deleteIds);
            }

            if (scheme.rule_scenarios.length) {
                scheme.rule_scenarios.forEach(deleteIds);
            }

            return scheme;

        };

        const createRequiredProps = function (scheme) {

            const properties = ["inputs", "calculated_inputs", "rule_scenarios"];

            properties.forEach(key => {
                if ( !scheme[key] ) scheme[key] = [];
            })

            return scheme;

        }

        vm.filterSchemeInputs = function (value) {

            if (!vm.schemeInputsQuery) {
                return true;
            }

            const query = vm.schemeInputsQuery.toLowerCase();

            return value.name.toLowerCase().includes(query) ||
                value.name_expr?.toLowerCase().includes(query) ||
                value.column_name?.toLowerCase().includes(query);
        }

        vm.filterCalculatedInputs = function (value) {

            if (!vm.calculatedInputsQuery) {
                return true;
            }

            return value.name.includes(vm.calculatedInputsQuery) ||
                value.name_expr?.includes(vm.calculatedInputsQuery);
        }

        /*
        {
            "id": 53,
            "is_default_rule_scenario": false,
            "is_error_rule_scenario": false,
            "name": "Buy",
            "selector_values": [
                "Buy"
            ],
            "transaction_type": "com.finmars.standard-transaction-type:buy_with_fx_trade",
            "fields": [
	            {
                    "id": 689,
                    "transaction_type_input": "account_cash",
                    "value_expr": "account_cash",
                    "transaction_type_input_object": {
                        "id": 1106,
                        "name": "account_cash",
                        "verbose_name": "Account (Cash)",
                        "value_type": 100,
                        "content_type": "accounts.account",
                        "order": 0
                    }
                },
            ],
            "status": "active",
            "transaction_type_object": {
                "id": 37,
                "name": "Buy",
                "user_code": "com.finmars.standard-transaction-type:buy_with_fx_trade",
                "inputs": [
                    {
                        "id": 1106,
                        "name": "account_cash",
                        "verbose_name": "Account (Cash)",
                        "value_type": 100
                    },
                ]
            }
        },
        * */

        vm.getItem = async function (doNotUpdateScope) {

            if (vm.editingScheme) {

                vm.scheme = await transactionImportSchemeService.getByKey(schemeId);

            } else if (schemeToCopy) { // copying scheme

                vm.scheme = applySchemeCopy(schemeToCopy);

            } else {
                vm.scheme = {};
            }

            if (vm.scheme.selector_values?.length) {

                vm.scheme.selector_values = vm.scheme.selector_values.sort(function (a, b) {
                    return sortItemsByProp(a.order, b.order);
                })

            }

            vm.scheme = createRequiredProps(vm.scheme);

            vm.draftUserCode = vm.generateUserCodeForDraft();

            vm.transformSourceSchemeToFrontendLogic();

            // vm.inputsFunctions is set inside vm.transformSourceSchemeToFrontendLogic()
            vm.exprEditorBtnData = {groups: [vm.inputsGroup], functions: [vm.inputsFunctions]};

            vm.readyStatus.scheme = true;

            if (vm.editingScheme && !doNotUpdateScope) {
                $scope.$apply();
            }

        };

        vm.getTransactionTypes = async function () {

            const data = await metaService.loadDataFromAllPages(
                transactionTypeService.getListLight,
                [{pageSize: 1000, page: 1}]
            )

            vm.transactionTypesOpts = data.map(ttype => {
                return {
                    id: ttype.user_code,
                    name: `${ttype.name} (${ttype.user_code})`
                }
            });

            vm.readyStatus.transactionTypes = true;

        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.scheme && vm.readyStatus.transactionTypes;
        };

        vm.addSchemeInput = function () {

            var fieldsLength = vm.schemeInputs.length;
            var lastFieldNumber;
            var nextFieldNumber;
            if (fieldsLength === 0) {
                nextFieldNumber = 1;
            } else {
                lastFieldNumber = parseInt(vm.schemeInputs[fieldsLength - 1].column);
                if (isNaN(lastFieldNumber) || lastFieldNumber === null) {
                    lastFieldNumber = 0
                }
                nextFieldNumber = lastFieldNumber + 1;
            }

            vm.schemeInputs.push({
                name: '',
                column: nextFieldNumber,
                frontOptions: {
                    key: metaHelper.generateUniqueId(vm.schemeInputs.length)
                }
            })

        };

        vm.addCalculatedInput = function () {

            var fieldsLength = vm.calculatedInputs.length;
            var lastFieldNumber;
            var nextFieldNumber;
            if (fieldsLength === 0) {
                nextFieldNumber = 1;
            } else {
                lastFieldNumber = parseInt(vm.calculatedInputs[fieldsLength - 1].column);
                if (isNaN(lastFieldNumber) || lastFieldNumber === null) {
                    lastFieldNumber = 0
                }
                nextFieldNumber = lastFieldNumber + 1;
            }

            vm.calculatedInputs.push({
                name: '',
                column: nextFieldNumber,
                frontOptions: {
                    key: metaHelper.generateUniqueId(vm.calculatedInputs.length)
                }
            })

        };

        vm.addRuleScenario = function () {
            vm.ruleScenarios.push( getRuleScenarioTplt(vm.ruleScenarios.length) );
        };

        vm.exprInputOpts = {
            readonly: true
        }

        vm.setSchemeInputExpression = function (item) {
            importSchemesMethodsService.setProviderFieldExpression(vm, item);
        }

        vm.openSchemeInputExpressionBuilder = function (item, $event) {
            importSchemesMethodsService.openFxBtnExprBuilder(item, vm, $event);
        }

        vm.openCalcFieldFxBtnExprBuilder = function (item, $event) {
            importSchemesMethodsService.openCalcFieldFxBtnExprBuilder(item, vm, $event);
        }

        vm.onCalculatedInputNameBlur = function (item) {
            importSchemesMethodsService.onTTypeCalcFielNamedBlur(item);
        }

        vm.getCalcFieldFxBtnClasses = function (item) {
            return importSchemesMethodsService.getCalcFieldFxBtnClasses(item);
        }

        vm.checkForUserExpr = function (item) {
            return importSchemesMethodsService.checkForUserExpr(item);
        }

        vm.removeSchemeInput = function (item, $index) {
            vm.schemeInputs.splice($index, 1);
        };

        vm.removeCalculatedInput = function ($index) {
            vm.calculatedInputs.splice($index, 1);
        };

        vm.removeRuleScenario = function (item, $index) {
            vm.ruleScenarios.splice($index, 1);
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        /**
         * Function-helper for vm.transformSchemeToBackendLogic.
         * @see vm.transformSchemeToBackendLogic
         *
         * @param {Object} ruleScenario
         * @return {Object} - ruleScenario prepared to send to back-end
         */
        function mapRuleScenario (ruleScenario) {

            /*scenario.inputs = scenario.inputs.filter(function (input) {
                return input.value_type !== 120;
            })*/

            ruleScenario.frontOptions.transactionTypeInputs.forEach(function (ttypeInput) {

                var found = false;

                ruleScenario.fields.forEach(function (field) {

                    if (field.transaction_type_input === ttypeInput.name) {
                        field.value_expr = ttypeInput.expression
                        found = true
                    }

                })

                if (!found) {

                    ruleScenario.fields.push({
                        transaction_type_input: ttypeInput.name,
                        value_expr: ttypeInput.expression
                    })

                }

                ruleScenario.fields = ruleScenario.fields.filter(function (field) {
                    return field.value_expr
                });

            })

            delete ruleScenario.frontOptions;

            return ruleScenario;

        }

        vm.transformSchemeToBackendLogic = function () {

            var result = JSON.parse(JSON.stringify(vm.scheme));

            result.calculated_inputs = vm.calculatedInputs;
            result.inputs = vm.schemeInputs;
            result.rule_scenarios = JSON.parse(angular.toJson(vm.ruleScenarios));

            result.rule_scenarios = result.rule_scenarios.map(mapRuleScenario)


            let defScenario = JSON.parse(angular.toJson(vm.defaultRuleScenario));
            defScenario = mapRuleScenario(defScenario);

            let errorScenario = JSON.parse(angular.toJson(vm.errorRuleScenario));
            errorScenario = mapRuleScenario(errorScenario)

            result.rule_scenarios.push(defScenario)
            result.rule_scenarios.push(errorScenario)

            result.recon_scenarios = vm.reconScenarios;

            result = metaHelper.clearFrontendOptions(result);

            return result

        }

        vm.agree = function ($event) {

            let result = vm.transformSchemeToBackendLogic();

            let warningMessage = '';
            let warningTitle = '';

            let importedColumnsNumberZero = false;
            let importedColumnsNumberEmpty = false;


            for (let i = 0; i < vm.schemeInputs.length; i++) {
                const field = vm.schemeInputs[i];

                if (field.column === 0 && !importedColumnsNumberZero) {
                    warningMessage = "should not have value 0 (column's count starts from 1)";
                    importedColumnsNumberZero = true;
                }

                if (field.column === null && !importedColumnsNumberEmpty) {

                    if (importedColumnsNumberZero) {
                        warningMessage = warningMessage + ', should not be empty'
                    } else {
                        warningMessage = 'should not be empty'
                    }

                    importedColumnsNumberEmpty = true;
                }

                if (!importedColumnsNumberZero &&
                    !importedColumnsNumberEmpty &&
                    !field.name_expr) {

                    warningMessage += '<p>Imported Columns Field # ' + field.column + ' has no F(X) expression</p>';

                }
            }

            if (warningMessage) {

                if (importedColumnsNumberZero || importedColumnsNumberEmpty) {

                    warningTitle = 'Incorrect Imported Columns field #';
                    warningMessage = 'Imported Columns Field #: ' + warningMessage + '.';

                } else { // if number of column correct but F(X) expression not
                    warningTitle = 'Incorrect Imported Columns F(X)';
                }

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/dialogs/warning-dialog-view.html',
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    locals: {
                        warning: {
                            title: warningTitle,
                            description: warningMessage,
                            actionsButtons: [
                                {
                                    name: 'CLOSE',
                                    response: false
                                }
                            ]
                        }
                    },
                    multiple: true
                });

            }
            else {

                vm.processing = true;

                let savePromise;

                if (vm.editingScheme) {
                    savePromise = transactionImportSchemeService.update(result.id, result);

                } else {
                    savePromise = transactionImportSchemeService.create(result);
                }

                savePromise.then(function (data) {

                    toastNotificationService.success("Transaction Import Scheme " + vm.scheme.user_code + ' was successfully saved');

                    vm.processing = false;

                    $mdDialog.hide({status: 'agree'});

                }).catch(function (reason) {

                    vm.processing = false;
                    console.error(`[transactionImportSchemeV2DialogController agree] error trying to save scheme`, reason)

                })
            }

        };

        vm.makeCopy = function ($event) {

            var copyPromise = $mdDialog.show({
                controller: 'TransactionImportSchemeV2DialogController as vm',
                templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-v2-dialog-view.html',
                parent: dialogsWrapElem,
                targetEvent: $event,
                locals: {
                    data: {
                        scheme: vm.scheme
                    }
                }
            });

            $mdDialog.hide({status: 'copy', dialogPromise: copyPromise});

        };

        vm.editTransactionType = function (ttypeId, $event) {

            $mdDialog.show({
                controller: 'TransactionTypeEditDialogController as vm',
                templateUrl: 'views/entity-viewer/transaction-type-edit-dialog-view.html',
                parent: dialogsWrapElem,
                targetEvent: $event,
                multiple: true,
                locals: {
                    entityType: 'transaction-type',
                    entityId: ttypeId,
                    data: {
                        openedIn: 'dialog'
                    }
                }
            })

        };

        vm.editAsJson = function (ev) {

            $mdDialog.show({
                controller: 'EntityAsJsonEditorDialogController as vm',
                templateUrl: 'views/dialogs/entity-as-json-editor-dialog-view.html',
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        item: vm.scheme,
                        entityType: 'complex-transaction-import-scheme',
                    }
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.getItem();

                }
            })

        }

        vm.bindType = function (item) {
            switch (item.value_type) {
                case 100:
                    return 'Relation';
                    break;
                case 10:
                    return 'String';
                case 20:
                    return 'Number';
                case 30:
                    return 'Classifier';
                case 40:
                    return 'Date';
                default:
                    return 'N/A'
            }
        };

        vm.executeDryRun = function (item) {

            vm.processing = true;

            console.log('vm.config.json_data', vm.dryRunData);

            let blob = new Blob([JSON.stringify(JSON.parse(vm.dryRunData))], {type: 'application/json;'});

            var formData = new FormData();

            formData.append('file', blob, 'input ' + new Date().getUTCDate() + '.json');
            formData.append('scheme', vm.scheme.id);

            importTransactionService.dryRun(formData).then(function (data) {

                vm.dryRunResult = data;
                vm.processing = false;
                $scope.$apply();

            })

        }

        vm.activateResultItem = function ($event, item) {

            vm.dryRunResult.result.items.forEach(function (result_item) {
                result_item.active = false;
            })

            item.active = true;

            vm.activeDryRunResultItem = item;

            console.log('vm.activeDryRunResultItem', vm.activeDryRunResultItem)

            vm.schemeInputs.forEach(function (input) {

                Object.keys(vm.activeDryRunResultItem.conversion_inputs).forEach(function (key) {

                    if (input.name === key) {

                        input.dryRunResult = vm.activeDryRunResultItem.conversion_inputs[key]

                    }

                })

            })

            vm.calculatedInputs.forEach(function (cInput) {

                Object.keys(vm.activeDryRunResultItem.inputs).forEach(function (key) {

                    if (cInput.name === key) {

                        cInput.dryRunResult = vm.activeDryRunResultItem.inputs[key]

                    }

                })


            })

            vm.ruleScenarios.forEach(function (scenario) {

                var transaction_type_user_code = scenario.transaction_type_object.user_code

                if (vm.activeDryRunResultItem.transaction_inputs[transaction_type_user_code]) {

                    // scenario.transaction_type_object.inputs.forEach(function (input) {
                    scenario.frontOptions.transactionTypeInputs.forEach(function (ttypeInput) {

                        Object.keys(vm.activeDryRunResultItem.transaction_inputs[transaction_type_user_code]).forEach(function (key) {

                            if (ttypeInput.name === key) {

                                ttypeInput.dryRunResult = vm.activeDryRunResultItem.transaction_inputs[transaction_type_user_code][key]

                            }


                        })

                    })

                }


            })

        }

        //# region Scenarios

        vm.schenarioStatusOpts = [
            { id: 'active', name: 'Active' },
            { id: 'skip', name: 'Skip' },
        ];

        vm.onTransactionTypeChange = function (changedValue, item) {

            item.frontOptions.transactionTypeInputs = []

            item.frontOptions.processing = true;

            transactionTypeService.getList({
                filters: {
                    user_code: item.transaction_type
                }
            }).then(function (data) {

                if (data.results) {

                    delete item.error_message;

                    item.transaction_type_object = data.results[0];

                    item.frontOptions.transactionTypeInputs = getTTypeInputsForScenario(item.transaction_type_object.inputs);

                    item.frontOptions.processing = false;

                    $scope.$apply();

                } else{
                    item.error_message = ttypeNotFoundErrorMsg;
                    toastNotificationService.error("Transaction type not found");
                }
            });


            console.log('vm.onTransactionTypeChange.item', item)

        }

        vm.openInputs = function (item, $event) {
            $mdDialog.show({
                controller: 'TransactionImportSchemeInputsDialogController as vm',
                templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-inputs-dialog-view.html',
                parent: dialogsWrapElem,
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        fields: vm.schemeInputs,
                        item: item
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    item.fields = res.data.item.fields;
                }
            });
        };

        //# endregion

        // DRAFT STARTED

        vm.generateUserCodeForDraft = function (){

            if (!vm.scheme.id) {
                return 'integrations.complextransactionimportscheme.new'
            }

            return 'integrations.complextransactionimportscheme.' + vm.scheme.user_code

        }

        vm.exportToDraft = function ($event) {

            var result = vm.transformSchemeToBackendLogic();

            return JSON.parse(JSON.stringify(result))

        }

        vm.applyDraft = function ($event, data) {

            console.log('applyDraft', data);

            vm.scheme = data;

            vm.transformSourceSchemeToFrontendLogic();

        }

        // DRAFT ENDED

        const init = async function () {

            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.transactionSchemeManagerDialogElemToResize');
            }, 100);

            if (schemeId) {
                vm.editingScheme = true;
            }

            await Promise.all([vm.getTransactionTypes(), vm.getItem()]);

        };

        init();

    };

}());