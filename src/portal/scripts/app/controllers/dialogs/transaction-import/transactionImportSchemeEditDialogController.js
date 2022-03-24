/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var transactionImportSchemeService = require('../../../services/import/transactionImportSchemeService');
    var transactionTypeService = require('../../../services/transactionTypeService');

    var toastNotificationService = require('../../../../../../core/services/toastNotificationService');
	var gridTableEvents = require('../../../services/gridTableEvents');

	var GridTableDataService = require('../../../services/gridTableDataService');
	var GridTableEventService = require('../../../services/gridTableEventService');

	// var metaHelper = require('../../../helpers/meta.helper');

    module.exports = function transactionImportSchemeEditDialogController ($scope, $mdDialog, schemeId, gridTableHelperService, importSchemesMethodsService) {

        var vm = this;

        vm.processing = false;

        vm.scheme = {};
        vm.readyStatus = {scheme: false, transactionTypes: false};

        vm.inputsGroup = {
            "name": "<b>Imported</b>",
            "key": 'input'
        };

        vm.defaultRuleScenario = {
            name: '-',
            is_default_rule_scenario: true
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

        vm.mapFields = [];
        vm.providerFields = [];
        vm.calculatedFields = [];
        vm.reconFields = [];
		vm.importedColsRefName = "Col.number";

        /*var dialogElemToResize = document.querySelector('.transactionSchemeManagerDialogElemToResize');
        var dialogElemWidth = 0;
        var dialogElemHeight = 0;
        var initXPos = 0;
        var initYPos = 0;
        var xPos = 0;
        var yPos = 0;

        var resizeDialogWindow = function (event) {
            xPos = event.pageX;
            yPos = event.pageY;

            dialogElemToResize.style.width = (dialogElemWidth + xPos - initXPos) + 'px';
            dialogElemToResize.style.height = (dialogElemHeight + yPos - initYPos) + 'px';
        };

        var endDialogWindowResize = function () {
            window.removeEventListener('mousemove', resizeDialogWindow);
        };

        vm.startDialogWindowResize = function ($event) {
            dialogElemWidth = JSON.parse(JSON.stringify(dialogElemToResize.clientWidth));
            dialogElemHeight = JSON.parse(JSON.stringify(dialogElemToResize.clientHeight));

            initXPos = $event.clientX;
            initYPos = $event.clientY;

            window.addEventListener('mousemove', resizeDialogWindow);
            window.addEventListener('mouseup', endDialogWindowResize, {once: true});
        };*/

        vm.openSelectorManager = function ($event) {

			importSchemesMethodsService.openSelectorManager($event, vm.scheme).then(function (selectorValuesProjection) {

				if (selectorValuesProjection) {
					vm.selectorValuesProjection = selectorValuesProjection;
					importSchemesMethodsService.updateSelectorValuesInsideGridTable(vm.mapFieldsGtDataService, vm.selectorValuesProjection);
				}

			});

        };

        vm.openScenarioFieldsManager = importSchemesMethodsService.openScenarioFieldsManager;

        vm.addScenario = function () {
			vm.reconFields = importSchemesMethodsService.addScenario(vm.reconFields);
        };

        vm.deleteScenario = function (index) {
            vm.reconFields.splice(index, 1);
        };

        vm.getItem = function () {

        	return new Promise(function (resolve) {

        		transactionImportSchemeService.getByKey(schemeId).then(function (data) {

        			vm.scheme = data;

					var procSchemeResult = importSchemesMethodsService.processScheme(vm.scheme);

					if (procSchemeResult.hasOwnProperty('providerFields')) vm.providerFields = procSchemeResult.providerFields;
					if (procSchemeResult.hasOwnProperty('inputsFunctions')) {
						vm.inputsFunctions = procSchemeResult.inputsFunctions;
						vm.exprEditorData.functions = [vm.inputsFunctions];
					}
					if (procSchemeResult.hasOwnProperty('calculatedFields')) vm.calculatedFields = procSchemeResult.calculatedFields;
					if (procSchemeResult.hasOwnProperty('mapFields')) vm.mapFields = procSchemeResult.mapFields;
					if (procSchemeResult.hasOwnProperty('defaultRuleScenario')) vm.defaultRuleScenario = procSchemeResult.defaultRuleScenario;
					if (procSchemeResult.hasOwnProperty('reconFields')) vm.reconFields = procSchemeResult.reconFields;
					vm.selectorValuesProjection = procSchemeResult.selectorValuesProjection;

					/*console.log('selector_values_projection', vm.selectorValuesProjection);
					console.log('mapFields', vm.mapFields);
					console.log('reconFields', vm.reconFields);*/

					vm.readyStatus.scheme = true;
					// $scope.$apply();
					resolve();

				}).catch(function (error) {
					console.error(error);
					resolve();
				});

			});

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

        /* vm.openInputs = function ($event, row) {
        	importSchemesMethodsService.openInputs($event, vm.mapFields, vm.providerFields, row);
        }; */

        vm.checkReadyStatus = function () {
            return vm.readyStatus.scheme && vm.readyStatus.transactionTypes;
        };

		vm.addCalculatedField = function(){
			var res = importSchemesMethodsService.addField(vm.calculatedFields, vm.calcFieldsGtData.templateRow, vm.exprEditorData);
			vm.calculatedFields.push(res[0]);
			vm.calcFieldsGtData.body.push(res[1]);
		};

        vm.addProviderField = function () {
			var res = importSchemesMethodsService.addProviderField(vm.providerFields, vm.providerFieldsGtData.templateRow, vm.scheme, vm.exprEditorData);
			vm.providerFields.push(res[0]);
			vm.providerFieldsGtData.body.push(res[1]);
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
        };

        vm.openProviderFieldExpressionBuilder = function (item, $event) {
            importSchemesMethodsService.openFxBtnExprBuilder(item, vm, $event);
        };

        vm.getCalcFieldFxBtnClasses = function (item) {
            return importSchemesMethodsService.getCalcFieldFxBtnClasses(item);
        }

        vm.checkForUserExpr = function (item) {
            return importSchemesMethodsService.checkForUserExpr(item);
        }

        vm.removeProviderField = function (item, $index) {
            vm.providerFields.splice($index, 1);
        };

        vm.removeCalculatedField = function (item, $index) {
            vm.calculatedFields.splice($index, 1);
        };*/


		//region Reconciliation fields
		/* vm.reconFieldsGtData = {
			header: {
				order: 'header',
				columns: []
			},
			body: [],
			templateRow: {
				order: 'newRow',
				isActive: false,
				columns: [
					{
						key: 'name',
						objPath: ['name'],
						columnName: 'Scenario name',
						order: 0,
						cellType: 'text',
						settings: {
							value: null
						},
						classes: 'grid-table-cell-right-border',
						styles: {
							'grid-table-cell': {'width': '153px'}
						}
					},
					{
						key: 'selector_values',
						objPath: ['selector_values'],
						columnName: 'Selector values',
						order: 1,
						cellType: 'multiselector',
						settings: {
							value: [],
							selectorOptions: [],
						},
						classes: 'grid-table-cell-right-border',
						styles: {
							'grid-table-cell': {'width': '262px'}
						}
					},
					{
						key: 'line_reference_id',
						objPath: ['line_reference_id'],
						columnName: 'Line Reference Id',
						order: 2,
						cellType: 'expression',
						settings: {
							value: null,
						},
						classes: 'grid-table-cell-right-border',
						styles: {
							'grid-table-cell': {'width': '65px'}
						}
					},
					{
						key: 'reference_date',
						columnName: 'Reference Date',
						order: 3,
						cellType: 'expression',
						settings: {
							value: null
						},
						classes: 'grid-table-cell-right-border',
						styles: {
							'grid-table-cell': {'width': '64px'}
						}
					},
					{
						key: 'edit_fields',
						columnName: '',
						order: 4,
						cellType: 'button',
						settings: {
							buttonContent: '<div class="small-button-icon"><span class="material-icons">question_mark</span></div>',
							onClick: function () {},
							tooltipText: "Fields",
							isDisabled: true,
						},
						classes: 'tsm-ttype-gt-btn',
						styles: {
							'grid-table-cell': {
								'width': '35px',
								'padding': '0 5px'
							}
						}
					},
					{
						key: 'delete',
						columnName: '',
						order: 5,
						cellType: 'button',
						settings: {
							buttonContent: `<div class="small-button-icon"><span class="material-icons">close</span></div>`,
							onClick: function () {},
						},
						classes: 'tsm-ttype-gt-btn',
						styles: {
							'grid-table-cell': {
								'width': '35px',
								'padding': '0 5px'
							}
						}
					}
				]
			},
			components: {
				topPanel: false,
				rowCheckboxes: false
			}
		}; */


		//endregion

		vm.makeCopy = function ($event) {

			var scheme = JSON.parse(JSON.stringify(vm.scheme));

			delete scheme.id;
			scheme["user_code"] = scheme["user_code"] + '_copy';

			$mdDialog.show({
				controller: 'TransactionImportSchemeAddDialogController as vm',
				templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: $event,
				locals: {
					data: {
						scheme: scheme
					}
				}
			});

			$mdDialog.hide({status: 'disagree'});

		};

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function ($event) {

            var result = JSON.parse(JSON.stringify(vm.scheme))

            // vm.scheme.calculated_inputs = vm.calculatedFields;
            // vm.scheme.inputs = vm.providerFields;
            // vm.scheme.rule_scenarios = vm.mapFields;
            //
            // vm.scheme.rule_scenarios.push(vm.defaultRuleScenario)
            //
            // vm.scheme.recon_scenarios = vm.reconFields;

            result.calculated_inputs = vm.calculatedFields;
            result.inputs = vm.providerFields;
            result.rule_scenarios = vm.mapFields;

            result.rule_scenarios.push(vm.defaultRuleScenario)

            result.recon_scenarios = vm.reconFields;

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

            } else {

                vm.processing = true;

                transactionImportSchemeService.update(result.id, result).then(function (data) {

                    toastNotificationService.success("Transaction Import Scheme " + vm.scheme.user_code + ' was successfully saved');

                    vm.processing = false;

                    $mdDialog.hide({res: 'agree'});

                }).catch(function (reason) {

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

        var initEventListeners = function () {

        	vm.calcFieldsGtEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
				gridTableHelperService.onGridTableCellChange(vm.calculatedFields, vm.calcFieldsGtDataService, argumentsObj.row.order, argumentsObj.column.order);
			});

			vm.providerFieldsGtEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {

				gridTableHelperService.onGridTableCellChange(vm.providerFields, vm.providerFieldsGtDataService, argumentsObj.row.order, argumentsObj.column.order);

				if (argumentsObj.column.key === 'name') {

					vm.inputsFunctions = importSchemesMethodsService.getTransactionFunctions(vm.providerFields);
					vm.exprEditorData.functions = [vm.inputsFunctions];

				}

			});

			vm.mapFieldsGtEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
				vm.mapFields = importSchemesMethodsService.onMapFieldsGtCellChange(argumentsObj, vm.mapFields, vm.mapFieldsGtDataService);
				if (argumentsObj.column.key === 'transaction_type') $scope.$apply();
			});

		};


        vm.init = function () {

            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.transactionSchemeManagerDialogElemToResize');
            }, 100);

            vm.calcFieldsGtDataService = new GridTableDataService();
			vm.calcFieldsGtEventService = new GridTableEventService();
			vm.providerFieldsGtDataService = new GridTableDataService();
			vm.providerFieldsGtEventService = new GridTableEventService();
			vm.mapFieldsGtDataService = new GridTableDataService();
			vm.mapFieldsGtEventService = new GridTableEventService();
			/* vm.reconFieldsGtDataService = new GridTableDataService();
			vm.reconFieldsGtEventService = new GridTableEventService(); */

            Promise.all([vm.getItem(), vm.getTransactionTypes()]).then(function () {

				/* vm.exprEditorData.groups = [vm.inputsGroup];
				vm.exprEditorData.functions = [vm.inputsFunctions]; */

				vm.columnMatcherSelData = importSchemesMethodsService.getColumnMatcherSelData(vm.scheme.column_matcher, selectColumnMatcher);

				if (vm.scheme.column_matcher) { // to work in old schemes

					var selectedColMatcher = vm.columnMatcherSelData.options.find(function (option) {
						return option.id === vm.scheme.column_matcher;
					});

					vm.importedColsRefName = selectedColMatcher.name;

				}

				// assembleDataForCalcFieldsGt();
				vm.calcFieldsGtData = importSchemesMethodsService.assembleDataForCalcFieldsGt(vm.calculatedFields, vm.calcFieldsGtDataService, vm.exprEditorData);
				vm.calcFieldsGtDataService.setTableData(vm.calcFieldsGtData);

				vm.providerFieldsGtData = importSchemesMethodsService.assembleDataForProviderFieldsGt(vm.providerFields, vm.providerFieldsGtDataService, vm.exprEditorData, vm.scheme.column_matcher);
				vm.providerFieldsGtDataService.setTableData(vm.providerFieldsGtData);

				vm.mapFieldsGtData = importSchemesMethodsService.assembleDataForMapFieldsGt(vm.mapFields, vm.providerFields, vm.mapFieldsGtDataService, vm.selectorValuesProjection, vm.transactionTypes);
				vm.mapFieldsGtDataService.setTableData(vm.mapFieldsGtData);
				/*assembleDataForProviderFieldsGt();
				assembleDataForMapFieldsGt();*/

				initEventListeners();

				$scope.$apply();

			});

        };

        vm.init()

    };

}());