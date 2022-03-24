(function () {

    'use strict';

	var metaHelper = require('../../helpers/meta.helper');
	/** @module importSchemesMethodsService **/
    module.exports = function ($mdDialog, gridTableHelperService) {

        var setProviderFieldExpression = function (viewModel, item) {

            if (!item.name_expr || item.name_expr === '') {
                item.name_expr = item.name;
                viewModel.inputsFunctions = viewModel.getFunctions();
            }

        };

        /*var setCalculatedFieldExpression = function (viewModel, item) {

            if (!item.name_expr || item.name_expr === '') {
                item.name_expr = item.name;
                viewModel.inputsFunctions = viewModel.getFunctions();
            }

        };*/

        var checkForUserExpr = function (item) {

            if (item.name_expr) {
                if (item.name && item.name === item.name_expr) {
                    return false;
                }

                return 'md-primary';
            }

            return false;

        };

        var openFxBtnExprBuilder = function (item, viewModel, $event) {

            $mdDialog.show({
                controller: 'ExpressionEditorDialogController as vm',
                templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: {expression: item.name_expr},
                    data: {
                        groups: [viewModel.inputsGroup],
                        functions: [viewModel.inputsFunctions]
                    }
                }
            }).then(function (res) {

                if (res.status === 'agree') {

                    item.name_expr = res.data.item.expression;
                    viewModel.inputsFunctions = viewModel.getFunctions();

                }

            });

        };

        var openMappingDialog = function (locals, $event) {

            $mdDialog.show({
                controller: 'EntityTypeMappingDialogController as vm',
                templateUrl: 'views/dialogs/entity-type-mapping-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                multiple: true,
                skipHide: true,
                locals: locals
            });

        };

        var checkForClassifierMapping = function (items, classifierId) {

            var i;
            for (i = 0; i < items.length; i++) {

                // if (items[i].id === classifierId) {
				if (items[i].value && items[i].value.id === classifierId) {

                    if (items[i].value.value_type === 30) {
                        return true;
                    }

                }

            }

            return false;

        };

        var openClassifierMapping = function (locals, $event) {

            $mdDialog.show({
                controller: 'EntityTypeClassifierMappingDialogController as vm',
                templateUrl: 'views/dialogs/entity-type-classifier-mapping-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: locals
            })

        };

        //TODO After importTransactionService.js will be injected into angulajs dependencies, move "Add edit transaction import scheme" region inside it
        //region Add edit transaction import scheme
		var errorHandlingOptions = [
			{
				id: "continue",
				name: "Continue"
			},
			{
				id: "break",
				name: "Break on first error"
			}
		];

		var separatorOptions = [
			{
				id: ",",
				name: "Comma (,)"
			},
			{
				id: ";",
				name: "Semicolon (;)"
			},
			{
				id: "\t",
				name: "Tab"
			},
		];

		var bookUniquenessSettingsOptions = [
			{
				id: 1,
				name: "Skip"
			},
			{
				id: 2,
				name: "Book without Unique Code"
			},
			{
				id: 3,
				name: "Overwrite"
			},
			{
				id: 4,
				name: "Treat as error"
			},
		];


        var onTTypeCalcFielNamedBlur = function (item) {

            if (item.name && !item.name_expr) {

                if (!item.frontOptions) {
                    item.frontOptions = {};
                }

                item.frontOptions.noNameExpr = true;

            } else if (item.frontOptions && item.frontOptions.noNameExpr) {
                item.frontOptions.noNameExpr = false;

            }

        }

        var getCalcFieldFxBtnClasses = function (item) {

            if (item.frontOptions && item.frontOptions.noNameExpr) {
                return 'btn-error';

            }
            else if (item.name_expr &&
                     item.name !== item.name_expr) {

                return 'md-primary';

            }

            return '';
        }

        /* var openCalcFieldFxBtnExprBuilder = function (item, viewModel, $event) {

            $mdDialog.show({
                controller: 'ExpressionEditorDialogController as vm',
                templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: {expression: item.name_expr},
                    data: {
                        groups: [viewModel.inputsGroup],
                        functions: [viewModel.inputsFunctions]
                    }
                }
            }).then(function (res) {

                if (res.status === 'agree') {

                    item.name_expr = res.data.item.expression;
                    viewModel.inputsFunctions = viewModel.getFunctions();

                    if (res.data.item.expression) {

                        if (item.frontOptions) {
                            item.frontOptions.noNameExpr = false;
                        }

                    } else if (item.name) {

                        if (!item.frontOptions) {
                            item.frontOptions = {};
                        }

                        item.frontOptions.noNameExpr = true;

                    }

                }

            });

        }; */

		var getTransactionFunctions = function (providerFields) {

			return providerFields.map(function (input) {

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

        var getColumnMatcherSelData = function (columnMatcher, selectOptionFn) {

        	var selData = {
				options: [
					{
						id: 'name',
						name: 'Col.name',
						isActive: false
					},
					{
						id: 'index',
						name: 'Col.number',
						isActive: true
					}
				],
				selectOption: selectOptionFn
			};

        	if (columnMatcher === 'name') {
        		selData.options[0].isActive = true;
				selData.options[1].isActive = false;
			}

        	return selData;

		};

        var processScheme = function (scheme) {

        	let result = {};

        	var sortAlphabetically = function (a, b) {
				if (a.column > b.column) {
					return 1;
				}
				if (a.column < b.column) {
					return -1;
				}

				return 0;
			};

			if (scheme.inputs.length) {

				result.providerFields = [];

				scheme.inputs.forEach(function (input) {
					result.providerFields.push(input);
				});

				result.providerFields = result.providerFields.sort(sortAlphabetically);

				result.inputsFunctions = getTransactionFunctions(result.providerFields);

			}

			if (scheme.calculated_inputs && scheme.calculated_inputs.length) {

				result.calculatedFields = [];

				scheme.calculated_inputs.forEach(function (input) {
					result.calculatedFields.push(input);
				});

				result.calculatedFields = result.calculatedFields.sort(sortAlphabetically);

			}

			if (scheme.rule_scenarios.length) {
				result.mapFields = [];

				scheme.rule_scenarios.forEach(function (item) {

					if (item.is_default_rule_scenario) {
						result.defaultRuleScenario = item
					} else {
						result.mapFields.push(item);
					}

				})

			}

			if (scheme.recon_scenarios.length) {
				result.reconFields = [];

				scheme.recon_scenarios.forEach(function (item) {
					result.reconFields.push(item)
				})
			}


			result.selectorValuesProjection = scheme.selector_values.map(function (item) {
				return {
					id: item.value,
					name: item.value
				}
			});

        	return result;
		};

        var openSelectorManager = function ($event, scheme) {

        	return new Promise(function (resolve, reject) {

				$mdDialog.show({
					controller: 'TransactionImportSchemeSelectorValuesDialogController as vm',
					templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-selector-values-dialog-view.html',
					parent: angular.element(document.body),
					targetEvent: $event,
					preserveScope: true,
					autoWrap: true,
					skipHide: true,
					multiple: true,
					locals: {
						data: {
							scheme: scheme
						}
					}
				}).then(function (res) {

					if (res && res.status === 'agree') {

						var selectorValuesProjection = scheme.selector_values.map(function (item) {
							return {
								id: item.value,
								name: item.value
							}
						});

						resolve(selectorValuesProjection);

					} else {
						resolve(null);
					}

				})

			});

		};

        var openScenarioFieldsManager = function ($event, item) {

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

		var addScenario = function (reconFields) {

			var scenario = {
				scenario_name: '',
				selector_values: [],
				line_reference_id: '',
				reference_date: '',
				fields: []
			};

			reconFields.push(scenario);

			return reconFields;

		};

		var openInputs = function ($event, mapFields, providerFields, row) {

			var item = mapFields[row.order];

			$mdDialog.show({
				controller: 'TransactionImportSchemeInputsDialogController as vm',
				templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-inputs-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: $event,
				preserveScope: true,
				autoWrap: true,
				skipHide: true,
				multiple: true,
				locals: {
					data: {
						fields: providerFields,
						item: item
					}
				}
			}).then(function (res) {
				if (res.status === 'agree') {
					item.fields = res.data.item.fields;
				}
			});

		};

		var editTransactionType = function ($event, mapFields, row) {

			var ttypeId = mapFields[row.order].transaction_type;

			$mdDialog.show({
				controller: 'TransactionTypeEditDialogController as vm',
				templateUrl: 'views/entity-viewer/transaction-type-edit-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: $event,
				multiple: true,
				locals: {
					entityType: 'transaction-type',
					entityId: ttypeId,
					data: {
						openedIn: 'dialog'
					}
				}
			});

		};

		/**
		 * Create data and row for map or provider field and its grid table
		 *
		 * @param fieldsList
		 * @param templateGtRow
		 * @param exprEditorData
		 * @returns {[{name: string, column: number}, (*)]}
		 */
		var addField = function (fieldsList, templateGtRow, exprEditorData) {

			var fieldsLength = fieldsList.length;
			var lastFieldNumber;
			var nextFieldNumber;

			if (fieldsLength === 0) {
				nextFieldNumber = 1;

			} else {

				lastFieldNumber = parseInt(fieldsList[fieldsLength - 1].column);

				if (isNaN(lastFieldNumber) || lastFieldNumber === null) {
					lastFieldNumber = 0
				}

				nextFieldNumber = lastFieldNumber + 1;

			}

			var fieldToAdd = {
				name: '',
				column: nextFieldNumber
			};

			// fieldsList.push(fieldToAdd);

			var rowToAdd = assembleRowForFieldsGt(fieldToAdd, fieldsList.length, templateGtRow, exprEditorData);
			// rowToAdd.newRow = true;

			// fieldsGtData.body.push(row);

			return [fieldToAdd, rowToAdd];

		};

		/**
		 *
		 * @param {array} providerFields
		 * @param {object} templateRow - template row of grid table for provider fields
		 * @param {object} scheme
		 * @param {{groups: Array, functions: Array}} exprEditorData
		 *
		 * @memberOf module:importSchemesMethodsService
		 */
		var addProviderField = function (providerFields, templateRow, scheme, exprEditorData) {

			var result = addField(providerFields, templateRow, exprEditorData);
			// providerFields.push(res[0]);

			var rowToAdd = result[1];

			if (scheme.column_matcher === 'index') {

				var nameCol = gridTableHelperService.getCellFromRowByKey(rowToAdd, 'name');

				/*nameCol.cellType = 'number';
				nameCol.objPath = ['column'];*/
				nameCol.settings.value = result[0].column;
				nameCol.settings.cellText = '' + result[0].column;

			}

			// vm.providerFieldsGtData.body.push(rowToAdd);
			return result;

		};

		//region Calculated and Provider fields grid tables
		/**
		 *
		 * @param {Object} gtDataService - for map fields grid table
		 * @param {[{ id: Number, name: String }]} selectorValuesProjection
		 *
		 * @memberOf module:importSchemesMethodsService
		 */
		var updateSelectorValuesInsideGridTable = function (gtDataService, selectorValuesProjection) {

			var gtData = gtDataService.getTableData();

			for (var i = 0; i < gtData.body.length; i++) {

				var selValCell = gtDataService.getCellByKey(i, 'selector_values');
				selValCell.settings.selectorOptions = selectorValuesProjection;

			}

		};

		var fieldsGtData = {
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
						columnName: '',
						order: 0,
						cellType: 'text',
						settings: {
							value: null,
						},
						classes: 'grid-table-cell-right-border',
						styles: {
							'grid-table-cell': {'width': '100px'}
						}
					},
					{
						key: 'expression',
						objPath: ['name_expr'],
						columnName: 'Expression',
						order: 1,
						cellType: 'expression',
						settings: {
							value: null,
						},
						classes: 'grid-table-cell-right-border',
						styles: {
							'grid-table-cell': {'width': '150px'}
						}
					},
					{
						key: 'delete',
						cellType: 'button',
						columnName: '',
						order: 2,
						settings: {
							buttonContent: `<div class="small-button-icon"><span class="material-icons">close</span></div>`,
						},
						styles: {
							'grid-table-cell': {'width': '52px'}
						}
					},
				]
			},
			tableMethods: {},
			components: {
				topPanel: false,
				rowCheckboxes: false
			}
		};

		var getFieldsGtData = function (fieldsList, gtDataService) {

			var gtData = JSON.parse(JSON.stringify(fieldsGtData));

			var deleteCol = gridTableHelperService.getCellFromRowByKey(gtData.templateRow, 'delete');

			deleteCol.settings.onClick = function ($event, row) {
				fieldsList.splice(row.order, 1);
				gtDataService.deleteRows(row);
			};

			/* if (gridTableType === 'calculatedFields') {

				var nameCol = gridTableHelperService.getCellFromRowByKey(gtData.templateRow, 'name');
				nameCol.columnName = 'Name';

			} */

			return gtData;

		};

		var mapHeaderForFieldsGt = function (column) {
			return {
				key: column.key,
				columnName: column.columnName,
				order: column.order,
				classes: column.classes,
				styles: {
					'grid-table-cell': {'width': column.styles['grid-table-cell'].width}
				}
			}
		};

		/**
		 * Assemble row of grid table for map or provider fields
		 *
		 * @param {Object} field - map or provider field
		 * @param {Number} index
		 * @param {Object} templateRow - template row of grid table
		 * @param {{groups: Array, functions: Array}} exprEditorData
		 * @returns {Object} - grid table row
		 */
		var assembleRowForFieldsGt = function (field, index, templateRow, exprEditorData) {

			var rowObj = metaHelper.recursiveDeepCopy(templateRow, true);

			rowObj.order = index;

			if (field.id || field.id === 0) {
				rowObj.key = field.id;

			} else {
				rowObj.key = metaHelper.generateUniqueId(index);
				rowObj.newRow = true;
			}

			var nameCol = gridTableHelperService.getCellFromRowByKey(rowObj, 'name');
			nameCol.settings.value = field.name;

			var exprCol = gridTableHelperService.getCellFromRowByKey(rowObj, 'expression');
			exprCol.settings.value = field.name_expr;
			exprCol.settings.exprData = exprEditorData;

			return rowObj;

		};

		/**
		 *
		 * @param {Array<Object>} calculatedFields
		 * @param {Object} gtDataService - grid table data service of grid table for calculated fields
		 * @param {{groups: Array, functions: Array}} exprEditorData
		 * @returns {Object} - grid table data
		 *
		 * @memberOf module:importSchemesMethodsService
		 */
		var assembleDataForCalcFieldsGt = function (calculatedFields, gtDataService, exprEditorData) {

			var gtData = getFieldsGtData(calculatedFields, gtDataService);

			var nameCol = gridTableHelperService.getCellFromRowByKey(gtData.templateRow, 'name');
			nameCol.columnName = 'Name';

			var rowObj = metaHelper.recursiveDeepCopy(gtData.templateRow, true);

			gtData.header.columns = rowObj.columns.map(mapHeaderForFieldsGt);

			gtData.body = calculatedFields.map(function (field, index) {
				return assembleRowForFieldsGt(field, index, gtData.templateRow, exprEditorData);
			});

			// gtDataService.setTableData(calcFieldsGtData);
			return gtData;

		};

		/**
		 *
		 * @param {Array} calculatedFields
		 * @param {Object} gtDataService - grid table data service of grid table for provider fields
		 * @param {{groups: Array, functions: Array}} exprEditorData
		 * @param {String} columnMatcher - 'index' or 'name'
		 * @returns {Object} - grid table data
		 *
		 * @memberOf module:importSchemesMethodsService
		 */
		var assembleDataForProviderFieldsGt = function (calculatedFields, gtDataService, exprEditorData, columnMatcher) {

			var gtData = getFieldsGtData(calculatedFields, gtDataService);

			var rowObj = metaHelper.recursiveDeepCopy(gtData.templateRow, true);

			gtData.header.columns = rowObj.columns.map(mapHeaderForFieldsGt);

			gtData.body = calculatedFields.map(function (field, index) {

				rowObj = assembleRowForFieldsGt(field, index, gtData.templateRow, exprEditorData);

				if (columnMatcher === 'index') {

					var nameCol = gridTableHelperService.getCellFromRowByKey(rowObj, 'name');

					nameCol.cellType = 'number';
					nameCol.objPath = ['column'];
					nameCol.settings.value = field.column;
					nameCol.settings.cellText = '' + field.column;

				}

				return rowObj;

			});
			// gtDataService.setTableData(calcFieldsGtData);
			return gtData;

		};

		/**
		 *
		 * @param {Object} scheme
		 * @param {{id: String, name: String}} option - column matcher option
		 * @param {Object} columnMatcherSelData - data for popup-selector of column matcher
		 * @param {Object} gtDataService - data service of grid table for provider fields
		 * @param {Array} providerFields
		 *
		 * @memberOf module:importSchemesMethodsService
		 */
		var onColumnMatcherChange = function (scheme, option, columnMatcherSelData, gtDataService, providerFields) {

			var result = {
				scheme: scheme,
				importedColsRefName: '',
				columnMatcherSelData: columnMatcherSelData,
			};

			result.scheme.column_matcher = option.id;
			result.importedColsRefName = option.name;

			result.columnMatcherSelData.options.forEach(function (option) {
				option.isActive = !option.isActive;
			});

			//region Change first column of provider fields grid table
			var cellObjPath = ['name'];
			var cellType = 'text';
			var valueProp = 'name';

			if (scheme.column_matcher === 'index') {
				cellObjPath = ['column'];
				cellType = 'number';
				valueProp = 'column';
			}

			var templateRowNameCol = gtDataService.getCellByKey('templateRow', 'name');

			templateRowNameCol.objPath = cellObjPath;
			templateRowNameCol.cellType = cellType;

			providerFields.forEach(function (field, index) {

				var nameCol = gtDataService.getCellByKey(index, 'name');

				nameCol.settings.value = field[valueProp];
				nameCol.settings.cellText = '' + field[valueProp]; // "'' +" in case of scheme.column_matcher === 'index'
				nameCol.objPath = cellObjPath;
				nameCol.cellType = cellType;

			});
			//endregion

			return result;

		};

		//endregion < Calculated and Provider fields grid tables >

		//region Map fields grid table
		var mapFieldsGtData = {
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
						key: 'transaction_type',
						objPath: ['transaction_type'],
						columnName: 'Transaction type',
						order: 2,
						cellType: 'transactionTypeSelector',
						settings: {
							value: null,
							transactionTypes: [],
						},
						classes: 'grid-table-cell-right-border',
						styles: {
							'grid-table-cell': {'width': '154px'}
						}
					},
					{
						key: 'inputs',
						columnName: '',
						order: 3,
						cellType: 'button',
						settings: {
							buttonContent: '<div class="small-button-icon"><span class="material-icons">login</span></div>',
							tooltipText: "Inputs",
							isDisabled: true
						},
						classes: 'tsm-ttype-gt-btn',
						styles: {
							'grid-table-cell': {'width': '35px', 'padding': '0 5px'}
						}
					},
					{
						key: 'edit_ttype',
						columnName: '',
						order: 4,
						cellType: 'button',
						settings: {
							buttonContent: '<div class="small-button-icon"><span class="material-icons">edit</span></div>',
							tooltipText: "Edit transaction type",
							isDisabled: true,
						},
						classes: 'tsm-ttype-gt-btn',
						styles: {
							'grid-table-cell': {'width': '35px', 'padding': '0 5px'}
						}
					},
					{
						key: 'delete',
						columnName: '',
						order: 5,
						cellType: 'button',
						settings: {
							buttonContent: `<div class="small-button-icon"><span class="material-icons">close</span></div>`,
						},
						classes: 'tsm-ttype-gt-btn',
						styles: {
							'grid-table-cell': {'width': '35px', 'padding': '0 5px'}
						}
					}
				]
			},
			components: {
				topPanel: false,
				rowCheckboxes: false
			}
		};

		/**
		 * @param {Object} templateRow - template row of grid table for map fields
		 * @param {Object} field - data of map field
		 * @param {Number} index
		 * @param {[{ id: Number, name: String }]} selectorValuesProjection
		 * @param {array<Object>} transactionTypes
		 * @returns {Object} - row of grid table for map fields
		 *
		 * @memberOf module:importSchemesMethodsService
		 */
		var assembleRowForMapFieldsGt = function (templateRow, field, index, selectorValuesProjection, transactionTypes) {

			var rowObj = metaHelper.recursiveDeepCopy(templateRow, true);

			rowObj.order = index;

			if (field.id || field.id === 0) {
				rowObj.key = field.id;

			} else {
				rowObj.key = metaHelper.generateUniqueId(index);
				rowObj.newRow = true;
			}

			var nameCol = gridTableHelperService.getCellFromRowByKey(rowObj, 'name');
			nameCol.settings.value = field.name;

			var selectorValCol = gridTableHelperService.getCellFromRowByKey(rowObj, 'selector_values');
			selectorValCol.settings.value = field.selector_values;
			selectorValCol.settings.selectorOptions = selectorValuesProjection;

			var ttypeCol = gridTableHelperService.getCellFromRowByKey(rowObj, 'transaction_type');
			ttypeCol.settings.value = field.transaction_type;
			ttypeCol.settings.transactionTypes = transactionTypes;

			if (field.transaction_type || field.transaction_type === 0) {

				var inputsCol = gridTableHelperService.getCellFromRowByKey(rowObj, 'inputs');
				inputsCol.settings.isDisabled = false;

				var editTTypeCol = gridTableHelperService.getCellFromRowByKey(rowObj, 'edit_ttype');
				editTTypeCol.settings.isDisabled = false;

			}

			return rowObj;

		};

		var assembleDataForMapFieldsGt = function (mapFields, providerFields, gtDataService, selectorValuesProjection, transactionTypes) {

			var gtData = metaHelper.recursiveDeepCopy(mapFieldsGtData, true);

			var inputsCol = gridTableHelperService.getCellFromRowByKey(gtData.templateRow, 'inputs');
			inputsCol.settings.onClick = function ($event, row) {
				openInputs($event, mapFields, providerFields, row);
			};

			var editTTypeCol = gridTableHelperService.getCellFromRowByKey(gtData.templateRow, 'edit_ttype');
			editTTypeCol.settings.onClick = function ($event, row) {
				editTransactionType($event, mapFields, row);
			};

			var deleteCol = gridTableHelperService.getCellFromRowByKey(gtData.templateRow, 'delete');
			deleteCol.settings.onClick = function ($event, row) {
				mapFields.splice(row.order, 1);
				gtDataService.deleteRows(row);
			};

			gtData.header.columns = gtData.templateRow.columns.map(mapHeaderForFieldsGt);

			gtData.body = mapFields.map(function (field, index) {
				return assembleRowForMapFieldsGt(gtData.templateRow, field, index, selectorValuesProjection, transactionTypes);
			});

			return gtData;

		};

		/**
		 *
		 * @param {Object} templateRow - template row of grid table for map fields
		 * @param {Number} mapFieldsLength
		 * @param {Array<Object>} providerFields
		 * @param {[{ id: Number, name: String }]} selectorValuesProjection
		 * @param {Array<Object>} transactionTypes
		 * @returns {Array<Object>}
		 *
		 * @memberOf module:importSchemesMethodsService
		 */
		var addMapField = function (templateRow, mapFieldsLength, selectorValuesProjection, transactionTypes) {

			var mapFieldToAdd = {
				value: '',
				transaction_type: null,
				is_default_rule_scenario: false,
				fields: []
			};

			//vm.mapFields.push(mapFieldToAdd);

			var rowToAdd = assembleRowForMapFieldsGt(templateRow, mapFieldToAdd, mapFieldsLength, selectorValuesProjection, transactionTypes);
			// vm.mapFieldsGtData.body.push(rowToAdd);
			return [mapFieldToAdd, rowToAdd];

		};
		/**
		 *
		 * @param {{row: Object, column: Object}} argumentsObj
		 * @param {Array<Object>} mapFields
		 * @param {Object} gtDataService
		 * @returns {Array}
		 *
		 * @memberOf module:importSchemesMethodsService
		 */
		var onMapFieldsGtCellChange = function (argumentsObj, mapFields, gtDataService) {

			var row = argumentsObj.row;
			var column = argumentsObj.column;

			gridTableHelperService.onGridTableCellChange(mapFields, gtDataService, row.order, column.order);

			if (argumentsObj.column.key === 'transaction_type') {

				var inputsCol = gtDataService.getCellByKey(row.order, 'inputs');
				inputsCol.settings.isDisabled = false;

				var editTTypeCol = gtDataService.getCellByKey(row.order, 'edit_ttype');
				editTTypeCol.settings.isDisabled = false;

			}

			return mapFields;

		};
		//endregion < Map fields grid table >

        //endregion < Add edit transaction import scheme >

        return {
            setProviderFieldExpression: setProviderFieldExpression,
            // setCalculatedFieldExpression: setCalculatedFieldExpression,
            checkForUserExpr: checkForUserExpr,
            openFxBtnExprBuilder: openFxBtnExprBuilder,
            openMappingDialog: openMappingDialog,
            checkForClassifierMapping: checkForClassifierMapping,
            openClassifierMapping: openClassifierMapping,

			//region Add edit transaction import scheme
			errorHandlingOptions: errorHandlingOptions,
			separatorOptions: separatorOptions,
			bookUniquenessSettingsOptions: bookUniquenessSettingsOptions,

			onTTypeCalcFielNamedBlur: onTTypeCalcFielNamedBlur,
			getCalcFieldFxBtnClasses: getCalcFieldFxBtnClasses,
            // openCalcFieldFxBtnExprBuilder: openCalcFieldFxBtnExprBuilder,
			getTransactionFunctions: getTransactionFunctions,
			processScheme: processScheme,
			getColumnMatcherSelData: getColumnMatcherSelData,

			openSelectorManager: openSelectorManager,
			updateSelectorValuesInsideGridTable: updateSelectorValuesInsideGridTable,
			openScenarioFieldsManager: openScenarioFieldsManager,
			addScenario: addScenario,
			openInputs: openInputs,
			editTransactionType: editTransactionType,

			addField: addField,
			addProviderField: addProviderField,
			addMapField: addMapField,

			onColumnMatcherChange: onColumnMatcherChange,

			getFieldsGtData: getFieldsGtData,
			assembleDataForCalcFieldsGt: assembleDataForCalcFieldsGt,
			assembleDataForProviderFieldsGt: assembleDataForProviderFieldsGt,
			assembleDataForMapFieldsGt: assembleDataForMapFieldsGt,
			onMapFieldsGtCellChange: onMapFieldsGtCellChange,
			//endregion

        }

    }

}());