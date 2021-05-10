(function () {

    const referenceTableService = require('../../../services/referenceTablesService');

	const metaHelper = require('../../meta.helper');

	const uiService = require('../../../services/uiService');
	const gridTableEvents = require('../../../services/gridTableEvents');

	const GridTableHelperService = require('../../../helpers/gridTableHelperService');
	const helpExpressionsService = require('../../../services/helpExpressionsService');

    'use strict';
    module.exports = function (viewModel, $scope, $mdDialog) {

    	const gridTableHelperService = new GridTableHelperService();

        var valueTypes = [
            {
                "name": "Number",
                "id": 20
            },
            {
                "name": "String",
                "id": 10
            },
            {
                "name": "Date",
                "id": 40
            },
            {
                "name": "Relation",
                "id": 100
            },
            {
                "name": "Selector",
                "id": 110
            },
            {
                "name": "Button",
                "id": 120
            },
        ];

        const getValueTypes = function() {
            return valueTypes;
        }

        const contextProperties = {
            'instruments.instrument': [
                {
                    id: 'instrument',
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
                    id: 'pricing_currency',
                    name: 'Pricing Currency'
                },
                {
                    id: 'accrued_currency',
                    name: 'Accrued Currency'
                },
                {
                    id: 'currency',
                    name: 'Currency'
                }
            ],
            'portfolios.portfolio': [
                {
                    id: 'portfolio',
                    name: 'Portfolio'
                }
            ],
            'accounts.account': [
                {
                    id: 'account',
                    name: 'Account'
                }
            ],
            'strategies.strategy1': [
                {
                    id: 'strategy1',
                    name: 'Strategy 1'
                }
            ],
            'strategies.strategy2': [
                {
                    id: 'strategy2',
                    name: 'Strategy 2'
                }
            ],
            'strategies.strategy3': [
                {
                    id: 'strategy3',
                    name: 'Strategy 3'
                }
            ]
        }

        const getContextProperties = function () {
            return contextProperties;
        };

        const updateInputFunctions = function () {

            viewModel.expressionData.groups[0] = {
                "name": "<b>Inputs</b>",
                "key": 'input'
            }

            if (viewModel.entity.inputs && viewModel.entity.inputs.length > 0) {

                viewModel.expressionData.functions[0] = viewModel.entity.inputs.map(function (input) {

                    return {
                        "name": "Input: " + input.verbose_name + " (" + input.name + ")",
                        "description": "Transaction Type Input: " + input.verbose_name + " (" + input.name + ") ",
                        "groups": "input",
                        "func": input.name
                    }

                });

            } else {

                viewModel.expressionData.functions = []

            }

        };

        const resolveRelation = function (contentType) {

            var entityKey;

            for (var i = 0; i < viewModel.contentTypes.length; i++) {

                if (viewModel.contentTypes[i].key === contentType) {
                    entityKey = viewModel.contentTypes[i].entity;

                    if (entityKey === 'strategy-1') {
                        return 'strategy1'
                    } else if (entityKey === 'strategy-2') {
                        return 'strategy2'
                    } else if (entityKey === 'strategy-3') {
                        return 'strategy3'
                    } else {

                        entityKey = entityKey.replace(/-/g, '_');

                        return entityKey;

                    }
                }
            }

        };

        const getReferenceTables = function () {

            return referenceTableService.getList().then(function (data) {

                viewModel.referenceTables = data.results.map(function (rTable) {
                    return {id: rTable.name, name: rTable.name};
                });

            })

        };

        const getInputTemplates = function () {

            viewModel.readyStatus.input_templates = false;

            return uiService.getTemplateLayoutList({filters: {type: 'input_template'}}).then(function (data) {

                viewModel.inputTemplates = data.results;

                viewModel.readyStatus.input_templates = true;

                $scope.$apply();

            })

        };

        const removeInputFromActions = function (deletedInputName) {

            viewModel.inputsToDelete.push(deletedInputName);

            viewModel.entity.actions.forEach(function (action) {

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

        const updateEntityBeforeSave = function (entity) {

        	if (viewModel.groups) {

				viewModel.groups.forEach(function (group) {

					if (group.objectPermissions && group.objectPermissions.manage === true) {
						entity.object_permissions.push({
							member: null,
							group: group.id,
							permission: "manage_" + viewModel.entityType.split('-').join('')
						})
					}

					if (group.objectPermissions && group.objectPermissions.change === true) {
						entity.object_permissions.push({
							member: null,
							group: group.id,
							permission: "change_" + viewModel.entityType.split('-').join('')
						})
					}

					if (group.objectPermissions && group.objectPermissions.view === true) {
						entity.object_permissions.push({
							member: null,
							group: group.id,
							permission: "view_" + viewModel.entityType.split('-').join('')
						})
					}

				});

			}

			entity.inputs.forEach(function (input) {

				if (input.settings) {

					if (input.settings.linked_inputs_names) {
						input.settings.linked_inputs_names = input.settings.linked_inputs_names.join(',')
					}

					if (input.settings.recalc_on_change_linked_inputs) {
						input.settings.recalc_on_change_linked_inputs = input.settings.recalc_on_change_linked_inputs.join(',')
					}

				}

			});

        	return entity;

		};

		//<editor-fold desc="TRANSACTION VALIDATION">
		const hasInputInExprs = function (inputs, expr, namesOnly) {

			var inputsList = [];
			/* var middleOfExpr = '[^A-Za-z_.]' + dInputName + '(?![A-Za-z1-9_])';
					var beginningOfExpr = '^' + dInputName + '(?![A-Za-z1-9_])'; */
			for (var i = 0; i < inputs.length; i++) {

				var inputName = inputs[i];

				if (!namesOnly) {
					inputName = inputs[i].name;
				}

				var inputRegExp = new RegExp('(?:^|[^A-Za-z_.])' + inputName + '(?![A-Za-z1-9_])', 'g');

				if (expr.match(inputRegExp)) {

					inputsList.push(inputs[i]);

				}

			}

			if (inputsList.length) {
				return inputsList;
			}

			return false;

		};

        const checkFieldExpr = function (inputsToDelete, fieldValue, itemKey, location) {

			var actionFieldLocation = {
				action_notes: location,
				key: itemKey, // for actions errors
				name: itemKey // for entity errors
			};

			var validationResult = helpExpressionsService.validateExpressionOnFrontend(
				{expression: fieldValue},
				viewModel.expressionData
			);

			if (validationResult.status) {

				var dInputsNames = hasInputInExprs(inputsToDelete, fieldValue, true);

				if (dInputsNames) {

					var dInputsNames = dInputsNames.join(", ");
					var stringStart = "The deleted input";

					if (dInputsNames.length > 1) {
						stringStart += "s";
					}

					actionFieldLocation.message = stringStart + " " + dInputsNames + " is used in the Expression."

				}

				else {

					switch (validationResult.status) {
						case 'error':
							actionFieldLocation.message = 'Invalid expression. ' + validationResult.result;
							break;

						case 'functions-error':
							actionFieldLocation.message = 'Not all variables are identified expression. ' + validationResult.result;
							break;

						case 'inputs-error':
							actionFieldLocation.message = 'Not all variables are identified inputs. ' + validationResult.result;
							break;

						case 'bracket-error':
							actionFieldLocation.message = 'Mismatch in the opening and closing braces. ' + validationResult.result;
							break;
					}

				}

				return actionFieldLocation;

			}

        };

        const checkActionsForEmptyFields = function (actions) {

            var result = [];

            actions.forEach(function (action) {

                var actionKeys = Object.keys(action);

                actionKeys.forEach(function (actionKey) {

                    if (typeof action[actionKey] === 'object' && action[actionKey]) { // check if it is property that contains actions field data

                        var actionItem = action[actionKey];
                        var actionItemKeys = Object.keys(actionItem);

                        actionItemKeys = actionItemKeys.filter(function (key) {

                            return key.indexOf('_object') === -1 && key.indexOf('_input') === -1 && key.indexOf('_phantom') === -1 && key !== 'action_notes';

                        });

                        actionItemKeys.forEach(function (actionItemKey) {

							var fieldWithInvalidExpr;

                            if (actionItemKey === 'notes') {

                                if (actionItem[actionItemKey]) {
                                    fieldWithInvalidExpr = checkFieldExpr(
                                    	viewModel.inputsToDelete,
										actionItem[actionItemKey],
										actionItemKey,
										action.action_notes
									);

                                }

                            } else {

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

                                    if (actionItem[actionItemKey] === null ||
                                        actionItem[actionItemKey] === undefined ||
                                        actionItem[actionItemKey] === "") {

                                        result.push({
                                            action_notes: action.action_notes,
                                            key: actionItemKey,
                                            value: actionItem[actionItemKey]
                                        })

                                    } else if (actionItem[actionItemKey] && typeof actionItem[actionItemKey] === 'string') { // deleted inputs use

                                        fieldWithInvalidExpr = checkFieldExpr(viewModel.inputsToDelete,
                                                                                             actionItem[actionItemKey],
                                                                                             actionItemKey,
                                                                                             action.action_notes);

                                    }

                                }

                            }

							if (fieldWithInvalidExpr) {
								result.push(fieldWithInvalidExpr);
							}

                        })

                    }

                });


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

        const validateUserFields = function (entity, inputsToDelete, result) {

            var entityKeys = Object.keys(entity);

            entityKeys.forEach(function (entityKey) {

                if ((entityKey.indexOf('user_text_') === 0 ||
                    entityKey.indexOf('user_number_') === 0 ||
                    entityKey.indexOf('user_date_') === 0) &&
					entity[entityKey]) {

                	const userFieldName = viewModel.transactionUserFields[entityKey];

                    var fieldWithInvalidExpr = checkFieldExpr(
                    	inputsToDelete,
						entity[entityKey],
						userFieldName,
						'FIELDS'
					);

                    if (fieldWithInvalidExpr) {
                        result.push(fieldWithInvalidExpr);
                    }

                }

            });
        };

        const checkEntityForEmptyFields = function (entity) {

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

            validateUserFields(entity, viewModel.inputsToDelete, result);

            return result;

        };

        const validateInputs = function (inputs) {

        	var errors = [];

        	inputs.forEach(function (input) {

				var location;

        		if (input.value_type !== 100 && input.value) { // Default value

					var defaultExprError;

					var inputsList = hasInputInExprs(viewModel.entity.inputs, input.value);

					if (inputsList.length) {

						defaultExprError = {
							action_notes: 'INPUTS: ' + input.name,
							key: 'Default value',
							name: 'Default value'
						}

						defaultExprError.message = "Using Inputs in expression for the default value is forbidden. Please use the formula which you are using in the Input (to which you are referring) instead."

					} else {

						location = 'INPUTS: ' + input.name;
						defaultExprError = checkFieldExpr(viewModel.inputsToDelete, input.value, 'Default value', location);

					}

					if (defaultExprError) {
						errors.push(defaultExprError);
					}

				}

				if (input.value_expr) {

					location = 'INPUTS: ' + input.name;
					var inputExprError = checkFieldExpr(viewModel.inputsToDelete, input.value_expr, 'Input expr', location);

					if (inputExprError) {
						errors.push(inputExprError);
					}

				}

			});

        	return errors;

		};
		//</editor-fold>

		//<editor-fold desc="INPUTS GRID TABLE">
		const onInputsGridTableRowAddition = function () {

            var newRow = viewModel.inputsGridTableData.body[0];

            var newInput = {
                name: null,
                verbose_name: null,
                value_type: null,
                content_type: null,
                is_fill_from_context: false,
                reference_table: null,
                account: null,
                instrument_type: null,
                instrument: null,
                currency: null,
                counterparty: null,
                responsible: null,
                portfolio: null,
                strategy1: null,
                strategy2: null,
                strategy3: null,
                daily_pricing_model: null,
                payment_size_detail: null,
                price_download_scheme: null,
                pricing_policy: null,
                value: null,
                value_expr: null,
                settings: {}
            }

            newInput.name = newRow.key

            // if there is is_fill_from_context, enable it
            var fillFromContext = gridTableHelperService.getCellFromRowByKey(newRow, 'is_fill_from_context');
            if (fillFromContext.settings.value) {
                newInput.is_fill_from_context = true
            }

            viewModel.entity.inputs.unshift(newInput);

            viewModel.entity.inputs.forEach(function (input, iIndex) {
                viewModel.inputsGridTableData.body[iIndex].order = iIndex
            })

            onInputsGridTableCellChange(newRow.key);

            getInputsForLinking();
            updateLinkedInputsOptionsInsideGridTable();

        };

		const onInputsGridTableCellChange = function (rowKey) {

            // updating whole row because 'value_type' change causes other cells to change
            var gtRow = viewModel.inputsGridTableDataService.getRowByKey(rowKey);
            var input = viewModel.entity.inputs[gtRow.order];

            gtRow.columns.forEach(function (gtColumn) {

                if (gtColumn.objPath) {

					if (gtColumn.key === 'linked_inputs_names' && gtColumn.settings.value) {

						let linkedInputsNames = [];
						let recalculateOnChange = [];
						let recalculateOnChangePath = ['settings', 'recalc_on_change_linked_inputs'];

						gtColumn.settings.value.forEach(function (multiselItem) {

							linkedInputsNames.push(multiselItem.id);

							if (multiselItem.isChecked) {
								recalculateOnChange.push(multiselItem.id);
							}

						});

						metaHelper.setObjectNestedPropVal(input, gtColumn.objPath, linkedInputsNames);
						metaHelper.setObjectNestedPropVal(input, recalculateOnChangePath, recalculateOnChange);

					} else {
						metaHelper.setObjectNestedPropVal(input, gtColumn.objPath, gtColumn.settings.value);
					}

                } else if (gtColumn.objPaths) {

                    gtColumn.objPaths.forEach(function (objPath, index) {
                        metaHelper.setObjectNestedPropVal(input, objPath, gtColumn.settings.value[index]);
                    });

                }

                if (gtColumn.key === 'content_type' && gtColumn.cellType === 'empty') {

                    input.content_type = null
                    input.reference_table = null

                }

            });

        }

		const relationItemsResolver = function (contentType) { // Victor: This function I introduce in child dialog to resolve default value items
            return viewModel.loadRelation(resolveRelation(contentType), true);
        }

		const onRelationDefaultValueSelInit = function (rowData, colData, gtDataService) {

            var changedCell = gtDataService.getCell(rowData.order, colData.order);

            var contentTypeCell = viewModel.inputsGridTableDataService.getCellByKey(rowData.order, 'content_type');

            // var loadRelationRes = viewModel.loadRelation(resolveRelation(contentTypeCell.settings.val ue), true);
            var loadRelationRes = relationItemsResolver(contentTypeCell.settings.value);

            if (loadRelationRes && loadRelationRes.status === 'item_exist') {
                changedCell.settings.selectorOptions = viewModel.relationItems[loadRelationRes.field]

            } else {

                loadRelationRes.then(function (relItem) {

                    changedCell.settings.selectorOptions = relItem
                    $scope.$apply();

                });

            }

        };

		const changeCellsBasedOnValueType = function (row) {

            var valueType = gridTableHelperService.getCellFromRowByKey(row, 'value_type'),
                contentType = gridTableHelperService.getCellFromRowByKey(row, 'content_type'),
                fillFromContext = gridTableHelperService.getCellFromRowByKey(row, 'is_fill_from_context'),
                defaultValue = gridTableHelperService.getCellFromRowByKey(row, 'default_value');

            switch (valueType.settings.value) {

                case 110:

                    contentType.objPath = ['reference_table']
                    contentType.cellType = 'selector'
                    contentType.settings.isDisabled = true
                    contentType.settings.selectorOptions = viewModel.referenceTables

                    if (defaultValue.cellType === 'selector') {

                        defaultValue.cellType = 'expression'
                        defaultValue.settings = {value: '', exprData: viewModel.expressionData}

                    }

                    fillFromContext.settings.value = null
                    fillFromContext.cellType = 'empty'

                    break;

                case 100:

                    contentType.objPath = ['content_type']
                    contentType.cellType = 'selector'
                    contentType.settings.isDisabled = true
                    contentType.settings.selectorOptions = viewModel.selectorContentTypes

                    var contextProps = contextProperties[contentType.settings.value];
                    if (contextProps) {
                        fillFromContext.cellType = 'selector'
                        fillFromContext.settings.selectorOptions = contextProperties[contentType.settings.value]
                    }

                    defaultValue.cellType = 'selector'

                    defaultValue.methods = {
                        // onOpen: onRelationDefaultValueSelOpen
                        onInit: onRelationDefaultValueSelInit
                    }

                    defaultValue.settings.selectorOptions = viewModel.relationItems[resolveRelation(viewModel.newItem)] // TODO Victor: this is bug. viewModel.newItem always undefined

                    break;

                default:

                    delete contentType.objPath;
                    contentType.settings.isDisabled = true

                    if (defaultValue.cellType === 'selector') {

                        defaultValue.cellType = 'expression'
                        defaultValue.settings = {value: '', exprData: viewModel.expressionData}

                    }

                    fillFromContext.settings.value = null
                    fillFromContext.cellType = 'empty'

                    break;

            }

        };

		const getInputsForLinking = function () {

            viewModel.inputsForMultiselector = viewModel.entity.inputs.map(function (input) {

                return {
                    id: input.name,
                    name: input.name,
					checked: false
                }

            });

        };

		const updateLinkedInputsOptionsInsideGridTable = function () {

            var linkedInputsNames = viewModel.inputsGridTableDataService.getCellByKey('templateRow', 'linked_inputs_names');
            linkedInputsNames.settings.selectorOptions = viewModel.inputsForMultiselector

            for (var i = 0; i < viewModel.inputsGridTableData.body.length; i++) {

                linkedInputsNames = viewModel.inputsGridTableDataService.getCellByKey(i, 'linked_inputs_names');

                linkedInputsNames.settings.selectorOptions = viewModel.inputsForMultiselector

            }

        };

		const deleteInputsRows = function (gtDataService, gtEventService) {

            var selectedRows = gtDataService.getSelectedRows();

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
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

                    selectedRows.forEach(function (sRow) {

                        var nameCell = gtDataService.getCellByKey(sRow.order, 'name');
                        var inputName = nameCell.settings.value;

                        viewModel.entity.inputs.splice(sRow.order, 1);
                        updateInputFunctions();

                        gtDataService.deleteRows(sRow);

                        removeInputFromActions(inputName);

                    });

                    getInputsForLinking();
                    updateLinkedInputsOptionsInsideGridTable();

                    // removeInputsFromLinkedInputs();
                    gtEventService.dispatchEvent(gridTableEvents.ROW_SELECTION_TOGGLED);

                    // $scope.$apply();

                }

            });

        };

		const addInputRow = function (gtDataService, gtEventService) {

            $mdDialog.show({
                controller: 'TransactionTypeAddInputDialogController as vm',
                templateUrl: 'views/dialogs/transaction-type-add-input-dialog-view.html',
                parent: angular.element(document.body),
                multiple: true,
                locals: {
                    data: {
                        inputs: viewModel.entity.inputs,
                        valueTypeOptions: valueTypes,
                        contentTypeOptions: {
                            relation: viewModel.selectorContentTypes,
                            selector: viewModel.referenceTables
                        },
                        contextProperties: contextProperties,
                        relationItems: viewModel.relationItems,
                        inputsForMultiselector: viewModel.inputsForMultiselector,

                        relationItemsResolver: relationItemsResolver,
                    }
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    var newRow = metaHelper.recursiveDeepCopy(viewModel.inputsGridTableData.templateRow, true);
                    newRow.key = res.data.name;

                    var name = gridTableHelperService.getCellFromRowByKey(newRow, 'name'),
                        verboseName = gridTableHelperService.getCellFromRowByKey(newRow, 'verbose_name'),
                        tooltip = gridTableHelperService.getCellFromRowByKey(newRow, 'tooltip'),
                        valueType = gridTableHelperService.getCellFromRowByKey(newRow, 'value_type'),
                        contentType = gridTableHelperService.getCellFromRowByKey(newRow, 'content_type'),
                        fillFromContext = gridTableHelperService.getCellFromRowByKey(newRow, 'is_fill_from_context'),
                        defaultValue = gridTableHelperService.getCellFromRowByKey(newRow, 'default_value'),
                        inputCalcExpression = gridTableHelperService.getCellFromRowByKey(newRow, 'input_calc_expr'),
                        linkedInputs = gridTableHelperService.getCellFromRowByKey(newRow, 'linked_inputs_names');

                    name.settings.value = res.data.name;
                    verboseName.settings.value = res.data.verbose_name;
                    tooltip.settings.value = res.data.tooltip;
                    valueType.settings.value = res.data.valueType;
                    contentType.settings.value = res.data.contentType;
                    fillFromContext.settings.value = res.data.context_property;
                    defaultValue.settings.value = res.data.value;
                    inputCalcExpression.settings.value = res.data.value_expr;
                    linkedInputs.settings.value = res.data.linked_inputs_names;

                    if (valueType.settings.value === 120) { // Button

                        newRow.columns[8].settings.optionsCheckboxes.selectedOptions = false; // linked inputs for Button have not checkboxes

                    }

                    changeCellsBasedOnValueType(newRow);
                    viewModel.inputsGridTableData.body.unshift(newRow);

                    gtEventService.dispatchEvent(gridTableEvents.ROW_ADDED);

                }

            });

        };

		const initGridTableEvents = function () {

            viewModel.inputsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
                onInputsGridTableCellChange(argumentsObj.row.key);
            });

            viewModel.inputsGridTableEventService.addEventListener(gridTableEvents.ROW_ADDED, function () {
                onInputsGridTableRowAddition();
            });

        };

        viewModel.inputsGridTableData = {
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
                        columnName: 'Name',
                        order: 0,
                        cellType: 'text',
                        settings: {
                            value: null,
                            closeOnMouseOut: false,
                            isDisabled: true
                        },
                        styles: {
                            'grid-table-cell': {'width': '165px'}
                        }
                    },
                    {
                        key: 'verbose_name',
                        objPath: ['verbose_name'],
                        columnName: 'Verbose name',
                        order: 1,
                        cellType: 'text',
                        settings: {
                            value: null,
                            closeOnMouseOut: false
                        },
                        styles: {
                            'grid-table-cell': {'width': '140px'}
                        }
                    },
                    {
                        key: 'tooltip',
                        objPath: ['tooltip'],
                        columnName: 'Tooltip',
                        order: 2,
                        cellType: 'text',
                        settings: {
                            value: null,
                            closeOnMouseOut: false
                        },
                        styles: {
                            'grid-table-cell': {'width': '145px'}
                        }
                    },
                    {
                        key: 'value_type',
                        objPath: ['value_type'],
                        columnName: 'Value type',
                        order: 3,
                        cellType: 'selector',
                        settings: {
                            value: null,
                            selectorOptions: valueTypes,
                            closeOnMouseOut: false,
                            isDisabled: true
                        },
                        styles: {
                            'grid-table-cell': {'width': '110px'}
                        },
                        methods: {}
                    },
                    {
                        key: 'content_type',
                        columnName: 'Content type',
                        order: 4,
                        cellType: 'empty',
                        settings: {
                            value: null,
                            closeOnMouseOut: false
                        },
                        styles: {
                            'grid-table-cell': {'width': '130px'}
                        }
                    },
                    /*{
                        key: 'is_fill_from_context',
                        objPath: ['is_fill_from_context'],
                        columnName: 'Use Default Value from Context',
                        order: 5,
                        cellType: 'checkbox',
                        settings: {
                            value: false
                        },
                        styles: {
                            'grid-table-cell': {'width': '180px'}
                        },
                        methods: {
                            onChange: onRelationFillFromContextChange
                        }
                    },*/
                    {
                        key: 'is_fill_from_context',
                        objPath: ['context_property'],
                        columnName: 'Use Default Value from Context',
                        order: 5,
                        cellType: 'empty',
                        settings: {
                            value: null,
                            closeOnMouseOut: false,
                            unselectButton: true
                        },
                        styles: {
                            'grid-table-cell': {'width': '180px'}
                        }
                    },
                    {
                        key: 'default_value',
                        objPath: ['value'],
                        columnName: 'Default value',
                        order: 6,
                        cellType: 'expression',
                        settings: {
                            value: '',
							exprData: null,
                            closeOnMouseOut: false
                        },
                        styles: {
                            'grid-table-cell': {'width': '230px'}
                        }
                    },
                    {
                        key: 'input_calc_expr',
                        objPath: ['value_expr'],
                        columnName: 'Input expr',
                        order: 7,
                        cellType: 'expression',
                        settings: {
                            value: '',
                            exprData: null,
                            closeOnMouseOut: false
                        },
                        styles: {
                            'grid-table-cell': {'width': '160px'}
                        }
                    },
                    {
                        key: 'linked_inputs_names',
                        objPath: ['settings', 'linked_inputs_names'],
                        columnName: 'Linked Inputs',
                        order: 8,
                        cellType: 'multiselector',
                        settings: {
                            value: [],
                            selectorOptions: null,
                            strictOrder: true,
                            closeOnMouseOut: false,
							optionsCheckboxes: {
								selectedOptions: true
							}
                        },
                        styles: {
                            'grid-table-cell': {'width': '140px'}
                        }
                    }
                ]
            },
            tableMethods: {
                deleteRows: deleteInputsRows,
                addRow: addInputRow
            },
            components: {
                topPanel: {
					addButton: true,
                    filters: false,
                    columns: false,
                    search: false
                },
				rowCheckboxes: true
            }
        }

		const createDataForInputsTableGrid = function () {

            var rowObj = metaHelper.recursiveDeepCopy(viewModel.inputsGridTableData.templateRow, true);

			//<editor-fold desc="Assemble header columns">
			var rowsWithSorting = ['name', 'verbose_name', 'tooltip', 'value_type', 'content_type'];

            viewModel.inputsGridTableData.header.columns = rowObj.columns.map(function (column) {

                return {
                    key: column.key,
                    columnName: column.columnName,
                    order: column.order,
                    sorting: rowsWithSorting.indexOf(column.key) > -1,
                    styles: {
                        'grid-table-cell': {'width': column.styles['grid-table-cell'].width}
                    }
                }

            });
			//</editor-fold>

            // assemble body rows
            viewModel.entity.inputs.forEach(function (input, index) {

                rowObj = metaHelper.recursiveDeepCopy(viewModel.inputsGridTableData.templateRow, true);

                rowObj.order = index;
                rowObj.key = input.name;
				rowObj.newRow = !!(rowObj.frontOptions && rowObj.frontOptions.newRow);

                // name
                rowObj.columns[0].settings.value = input.name
                rowObj.columns[0].settings.isDisabled = true
                // verbose_name
                rowObj.columns[1].settings.value = input.verbose_name
                // tooltip
                rowObj.columns[2].settings.value = input.tooltip
                // value_type
                rowObj.columns[3].settings.value = input.value_type
                rowObj.columns[3].settings.isDisabled = true
                // content_type
                rowObj.columns[4].settings.value = input.content_type

                if (input.value_type === 110) {
                    rowObj.columns[4].settings.value = input.reference_table
                }

                rowObj.columns[4].settings.isDisabled = true
                // is_fill_from_context
                rowObj.columns[5].settings.value = input.context_property
                // default_value
                rowObj.columns[6].settings.value = input.value
				rowObj.columns[6].settings.exprData = viewModel.expressionData

				changeCellsBasedOnValueType(rowObj);

                // input_calc_expr
                rowObj.columns[7].settings.value = input.value_expr
				rowObj.columns[7].settings.exprData = viewModel.expressionData;
                // linked_inputs_names
				rowObj.columns[8].settings.value = []

                if (input.settings && input.settings.linked_inputs_names) {

					rowObj.columns[8].settings.value = input.settings.linked_inputs_names.map(function (linkedInputName) {

						var linkedInput = {
							id: linkedInputName,
							isChecked: false
						};

						if (input.settings.recalc_on_change_linked_inputs.includes(linkedInputName)) {

							linkedInput.isChecked = true;

						}

						return linkedInput;

					});

					if (input.value_type === 120) { // Button

                        rowObj.columns[8].settings.optionsCheckboxes.selectedOptions = false; // linked inputs for Button have not checkboxes

                    }

				}

                rowObj.columns[8].settings.selectorOptions = viewModel.inputsForMultiselector
                // rowObj.columns[8].settings.getDataMethod = getInputsForLinking;

                viewModel.inputsGridTableData.body.push(rowObj)

            });
            // < assemble body rows >
            viewModel.inputsGridTableDataService.setTableData(viewModel.inputsGridTableData);

        }
		//</editor-fold>

		const getTransactionUserFields = function () {

			return new Promise(async (resolve) => {

				/* return uiService.getTransactionFieldList({pageSize: 1000}).then(function (data) {

					data.results.forEach(function (field) {

						viewModel.transactionUserFields[field.key] = field.name;

					})

				})*/

				uiService.getTransactionFieldList({pageSize: 1000}).then(function (data) {

					data.results.forEach(function (field) {

						viewModel.transactionUserFields[field.key] = field.name;

					})

					resolve();

				}).catch(error => resolve());

			});

		};

        const initAfterMainDataLoaded = function () {

            getInputsForLinking();

            viewModel.selectorContentTypes = viewModel.contentTypes.map(function (cType) {
                return {id: cType.key, name: cType.name};
            });

            createDataForInputsTableGrid();

        }

        return {
            getValueTypes: getValueTypes,
            getContextProperties: getContextProperties,

            updateInputFunctions: updateInputFunctions,
            getReferenceTables: getReferenceTables,
            getInputTemplates: getInputTemplates,

			updateEntityBeforeSave: updateEntityBeforeSave,
            resolveRelation: resolveRelation,
            checkActionsForEmptyFields: checkActionsForEmptyFields,
            checkEntityForEmptyFields: checkEntityForEmptyFields,
			validateInputs: validateInputs,

            initGridTableEvents: initGridTableEvents,
            createDataForInputsTableGrid: createDataForInputsTableGrid,

			getTransactionUserFields: getTransactionUserFields,
            initAfterMainDataLoaded: initAfterMainDataLoaded
        }

    };

}());