/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var transactionImportSchemeService = require('../../../services/import/transactionImportSchemeService');
    var transactionTypeService = require('../../../services/transactionTypeService');
	var ecosystemDefaultService = require('../../../services/ecosystemDefaultService');

    var toastNotificationService = require('../../../../../../core/services/toastNotificationService');

	var gridTableEvents = require('../../../services/gridTableEvents');

	var GridTableDataService = require('../../../services/gridTableDataService');
	var GridTableEventService = require('../../../services/gridTableEventService');


    module.exports = function transactionImportSchemeAddDialogController ($scope, $mdDialog, gridTableHelperService, importSchemesMethodsService, data) {

        var vm = this;

        vm.processing = false;

        vm.dataProviders = [];

        vm.readyStatus = {dataProviders: false, scheme: false, transactionTypes: false};

        vm.defaultRuleScenario = {
            name: '-',
            is_default_rule_scenario: true,
			fields: []
        };

        vm.inputsGroup = {
            "name": "<b>Imported</b>",
            "key": 'input'
        };

		vm.exprEditorData = {
			groups: [vm.inputsGroup],
			functions: []
		};

        vm.inputsFunctions = [];
        vm.selectorValuesProjection = [];

		vm.errorHandlingOptions = importSchemesMethodsService.errorHandlingOptions;
		vm.separatorOptions = importSchemesMethodsService.separatorOptions;
		vm.bookUniquenessSettingsOptions = importSchemesMethodsService.bookUniquenessSettingsOptions;

        vm.scheme = {
            selector_values: []
        };

        vm.mapFields = [];

        vm.providerFields = [
            {
                name: '',
                column: 1,
                name_expr: ''
            }
        ];

        vm.calculatedFields = [];
        vm.reconFields = [];
		vm.importedColsRefName = "Col.number";

		var ecosystemDefaultData;

		vm.openSelectorManager = function ($event) {

			importSchemesMethodsService.openSelectorManager($event, vm.scheme).then(function (selectorValuesProjection) {

				if (selectorValuesProjection) {
					vm.selectorValuesProjection = selectorValuesProjection;
					importSchemesMethodsService.updateSelectorValuesInsideGridTable(vm.mapFieldsGtDataService, vm.selectorValuesProjection);
				}

			});

		};

        vm.openScenarioFieldsManager = function ($event, item) {

            $mdDialog.show({
                controller: 'TransactionImportSchemeScenarioFieldsDialogController as vm',
                templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-scenario-fields-dialog-view.html',
                parent: angular.element(document.body),
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

        vm.addScenario = function () {
			vm.reconFields = importSchemesMethodsService.addScenario(vm.reconFields);
        };

        vm.deleteScenario = function (item, $index) {
            vm.reconFields.splice($index, 1);
        };

		vm.getTransactionTypes = function () {

			return new Promise(function (resolve) {

				transactionTypeService.getListLight({
					pageSize: 1000

				}).then(function (data) {

					vm.transactionTypes = data.results;
					vm.readyStatus.transactionTypes = true;
					// $scope.$apply();

					resolve();

				}).catch(function (error) {
					resolve();
				});

			});

		};

		var loadEcosystemDefaults = function () {

			return new Promise(function (resolve, reject) {

				ecosystemDefaultService.getList().then(function (data) {
					ecosystemDefaultData = data.results[0];
					resolve(ecosystemDefaultData);

				}).catch(function (error) {
					reject(error);
				});

			})

		};

        /* vm.openInputs = function ($event, row) {
			importSchemesMethodsService.openInputs($event, vm.mapFields, vm.providerFields, row);
        }; */

        vm.checkReadyStatus = function () {
            return vm.readyStatus.scheme && vm.readyStatus.transactionTypes;
        };

        vm.addProviderField = function () {
			var res = importSchemesMethodsService.addProviderField(vm.providerFields, vm.providerFieldsGtData.templateRow, vm.scheme, vm.exprEditorData);
			vm.providerFields.push(res[0]);
			vm.providerFieldsGtData.body.push(res[1]);
        };

        vm.addCalculatedField = function(){
			var res = importSchemesMethodsService.addField(vm.calculatedFields, vm.calcFieldsGtData.templateRow, vm.exprEditorData);
			vm.calculatedFields.push(res[0]);
			vm.calcFieldsGtData.body.push(res[1]);
        };

        vm.addMapField = function () {
			var res = importSchemesMethodsService.addMapField(vm.mapFieldsGtData.templateRow, vm.mapFields.length, vm.selectorValuesProjection, vm.transactionTypes);
			vm.mapFields.push(res[0]);
			vm.mapFieldsGtData.body.push(res[1]);
        };

		var selectColumnMatcher = function (option, _$popup) {

			_$popup.cancel();

			if (vm.scheme.column_matcher === option.id) return;

			var res = importSchemesMethodsService.onColumnMatcherChange(vm.scheme, option, vm.columnMatcherSelData, vm.providerFieldsGtDataService, vm.providerFields);
			vm.scheme = res.scheme;
			vm.importedColsRefName = res.importedColsRefName;
			vm.columnMatcherSelData = res.columnMatcherSelData;

			vm.providerFieldsGtEventService.dispatchEvent(gridTableEvents.REDRAW_TABLE);

		};

        /* vm.setProviderFieldExpression = function (item) {
            importSchemesMethodsService.setProviderFieldExpression(vm, item);
        }

        vm.setCalculatedFieldExpression = function (item) {
            importSchemesMethodsService.setCalculatedFieldExpression(vm, item);
        }

        vm.openProviderFieldExpressionBuilder = function (item, $event) {
            importSchemesMethodsService.openFxBtnExprBuilder(item, vm, $event);
        }

        vm.checkForUserExpr = function (item) {
            if (item.name_expr) {
                if (item.name && item.name === item.name_expr) {
                    return false;
                }

                return 'md-primary';
            }

            return false;
        };
        vm.checkForUserExpr = function (item) {
            return importSchemesMethodsService.checkForUserExpr(item);
        }

        vm.getCalcFieldFxBtnClasses = function (item) {
            return importSchemesMethodsService.getCalcFieldFxBtnClasses(item);
        }

        vm.removeProviderField = function (item, $index) {
            vm.providerFields.splice($index, 1);
        };

        vm.removeCalculatedField = function (item, $index) {
            vm.calculatedFields.splice($index, 1);
        };

        vm.removeMappingField = function (item, $index) {
            vm.mapFields.splice($index, 1);
        }; */

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function ($event) {

            vm.scheme.calculated_inputs = vm.calculatedFields;
            vm.scheme.inputs = vm.providerFields;
            vm.scheme.rule_scenarios = vm.mapFields;

            var defRuleScenarioIndex = vm.scheme.rule_scenarios.length;
            vm.scheme.rule_scenarios.push(vm.defaultRuleScenario);

            vm.scheme.recon_scenarios = vm.reconFields;

            var warningMessage = '';
            var warningTitle = '';

            var importedColumnsNumberZero = false;
            var importedColumnsNumberEmpty = false;

            for (var i = 0; i < vm.providerFields.length; i++) {
                var field = vm.providerFields[i];

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

				vm.scheme.rule_scenarios.splice(defRuleScenarioIndex, 1);

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

				transactionImportSchemeService.create(vm.scheme).then(function (data) {

					toastNotificationService.success("Transaction Import Scheme " + vm.scheme.user_code + ' was successfully created');

					vm.processing = false;

					$mdDialog.hide({status: 'agree'});

				}).catch(function (reason) {

					vm.scheme.rule_scenarios.splice(defRuleScenarioIndex, 1);

					vm.processing = false;

					$mdDialog.show({
						controller: 'ValidationDialogController as vm',
						templateUrl: 'views/dialogs/validation-dialog-view.html',
						targetEvent: $event,
						locals: {
							validationData: {
								errorData: {
									message: reason.message
								}
							}
						},
						preserveScope: true,
						autoWrap: true,
						multiple: true,
						skipHide: true
					})

				})

            }

        };

        /*vm.openMapping = function ($event, item) {

            $mdDialog.show({
                controller: 'EntityTypeMappingDialogController as vm',
                templateUrl: 'views/dialogs/entity-type-mapping-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    mapItem: item
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                }
            });
        };*/

		var initEventListeners = function () {

			vm.calcFieldsGtEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
				gridTableHelperService.onGridTableCellChange(vm.calculatedFields, vm.calcFieldsGtDataService, argumentsObj.row.order, argumentsObj.column.order);
			});

			vm.providerFieldsGtEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {

				gridTableHelperService.onGridTableCellChange(vm.providerFields, vm.providerFieldsGtDataService, argumentsObj.row.order, argumentsObj.column.order);

				if (argumentsObj.column.key === 'name') {
					vm.inputsFunctions = importSchemesMethodsService.getTransactionFunctions(vm.providerFields);

					vm.exprEditorData.functions = [vm.inputsFunctions]; // updates provider fields for expression editors inside "GENERAL SETTINGS" and grid tables
				}

			});

			vm.mapFieldsGtEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
				vm.mapFields = importSchemesMethodsService.onMapFieldsGtCellChange(argumentsObj, vm.mapFields, vm.mapFieldsGtDataService);
				if (argumentsObj.column.key === 'transaction_type') $scope.$apply();
			});

		};

		var mapCopiedFields = function (field) {
			delete field.id;
			return field;
		};

        vm.init = function () {

			vm.scheme = {
				inputs: [],
				rules: [],
				rule_expr: 'a + b',
				user_code: '',
				column_matcher: 'index',
				selector_values: []
			};

			vm.calcFieldsGtDataService = new GridTableDataService();
			vm.calcFieldsGtEventService = new GridTableEventService();
			vm.providerFieldsGtDataService = new GridTableDataService();
			vm.providerFieldsGtEventService = new GridTableEventService();
			vm.mapFieldsGtDataService = new GridTableDataService();
			vm.mapFieldsGtEventService = new GridTableEventService();

			Promise.all([vm.getTransactionTypes(), loadEcosystemDefaults()]).then(function () {

				if (data && data.hasOwnProperty('scheme')) {

					vm.scheme = data.scheme;

					var procSchemeResult = importSchemesMethodsService.processScheme(vm.scheme);

					if (procSchemeResult.hasOwnProperty('providerFields')) {
						vm.providerFields = procSchemeResult.providerFields.map(mapCopiedFields);
					}

					if (procSchemeResult.hasOwnProperty('inputsFunctions')) {
						vm.inputsFunctions = procSchemeResult.inputsFunctions;
						vm.exprEditorData.functions = [vm.inputsFunctions];
					}

					if (procSchemeResult.hasOwnProperty('calculatedFields')) {
						vm.calculatedFields = procSchemeResult.calculatedFields.map(mapCopiedFields);
					}

					if (procSchemeResult.hasOwnProperty('mapFields')) {
						vm.mapFields = procSchemeResult.mapFields.map(mapCopiedFields);
					}

					if (procSchemeResult.hasOwnProperty('defaultRuleScenario')) {
						vm.defaultRuleScenario = procSchemeResult.defaultRuleScenario;
						delete vm.defaultRuleScenario.id;
					}

					if (procSchemeResult.hasOwnProperty('reconFields')) {
						vm.reconFields = procSchemeResult.reconFields.map(mapCopiedFields);
					}

					vm.selectorValuesProjection = procSchemeResult.selectorValuesProjection;

				}

				// this line should be after data from copied scheme applied
				vm.defaultRuleScenario.transaction_type = ecosystemDefaultData.transaction_type;

				vm.readyStatus.scheme = true;

				vm.columnMatcherSelData = importSchemesMethodsService.getColumnMatcherSelData(vm.scheme.column_matcher, selectColumnMatcher);

				vm.calcFieldsGtData = importSchemesMethodsService.assembleDataForCalcFieldsGt(vm.calculatedFields, vm.calcFieldsGtDataService, vm.exprEditorData);
				vm.calcFieldsGtDataService.setTableData(vm.calcFieldsGtData);

				vm.providerFieldsGtData = importSchemesMethodsService.assembleDataForProviderFieldsGt(vm.providerFields, vm.providerFieldsGtDataService, vm.exprEditorData, vm.scheme.column_matcher);
				vm.providerFieldsGtDataService.setTableData(vm.providerFieldsGtData);

				vm.mapFieldsGtData = importSchemesMethodsService.assembleDataForMapFieldsGt(vm.mapFields, vm.providerFields, vm.mapFieldsGtDataService, vm.selectorValuesProjection, vm.transactionTypes);
				vm.mapFieldsGtDataService.setTableData(vm.mapFieldsGtData);

				initEventListeners();

                $scope.$apply();

            });

        };

        vm.init();

    };

}());