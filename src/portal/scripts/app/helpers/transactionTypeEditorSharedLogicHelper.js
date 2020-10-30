(function () {

    let referenceTableService = require('../services/referenceTablesService');

    let metaHelper = require('../helpers/meta.helper');

    var uiService = require('../services/uiService');
    let gridTableEvents = require('../services/gridTableEvents');

    let GridTableHelperService = require('../helpers/gridTableHelperService');

    'use strict';
    module.exports = function (viewModel, $scope, $mdDialog) {

        let gridTableHelperService = new GridTableHelperService();

        let valueTypes = [
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
            }
        ];

        let getValueTypes = () => {
            return valueTypes;
        }

        let contextProperties = {
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

        let getContextProperties = () => {
            return contextProperties;
        };

        let updateInputFunctions = function () {

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

        let resolveRelation = function (contentType) {

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

        let getReferenceTables = function () {

            return referenceTableService.getList().then(function (data) {

                viewModel.referenceTables = data.results.map(function (rTable) {
                    return {id: rTable.name, name: rTable.name};
                });

            })

        };

        let getInputTemplates = function () {

            viewModel.readyStatus.input_templates = false;

            return uiService.getTemplateLayoutList({filters: {type: 'input_template'}}).then(function (data) {

                viewModel.inputTemplates = data.results;

                viewModel.readyStatus.input_templates = true;

                $scope.$apply();

            })

        };

        let removeInputFromActions = function (deletedInputName) {

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

        // TRANSACTION VALIDATION
        let checkFieldExprForDeletedInput = function (inputsToDelete, actionFieldValue, actionItemKey, actionNotes) {

            for (var a = 0; a < inputsToDelete.length; a++) {

                var dInputName = inputsToDelete[a];

                var middleOfExpr = '[^A-Za-z_.]' + dInputName + '(?![A-Za-z1-9_])';
                var beginningOfExpr = '^' + dInputName + '(?![A-Za-z1-9_])';

                var dInputRegExpObj = new RegExp(beginningOfExpr + '|' + middleOfExpr, 'g');

                if (actionFieldValue.match(dInputRegExpObj)) {

                    var actionFieldLocation = {
                        action_notes: actionNotes,
                        key: actionItemKey, // for actions errors
                        name: actionItemKey, // for entity errors
                        message: "The deleted input is used in the Expression."
                    };

                    return actionFieldLocation;

                }
            }

        };

        let checkActionsForEmptyFields = (actions) => {

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

                            if (actionItemKey === 'notes') {

                                if (actionItem[actionItemKey]) {
                                    var fieldWithInvalidExpr = checkFieldExprForDeletedInput(viewModel.inputsToDelete,
                                                                                             actionItem[actionItemKey],
                                                                                             actionItemKey,
                                                                                             action.action_notes);

                                    if (fieldWithInvalidExpr) {
                                        result.push(fieldWithInvalidExpr);
                                    }
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

                                        var fieldWithInvalidExpr = checkFieldExprForDeletedInput(viewModel.inputsToDelete,
                                                                                                 actionItem[actionItemKey],
                                                                                                 actionItemKey,
                                                                                                 action.action_notes);

                                        if (fieldWithInvalidExpr) {
                                            result.push(fieldWithInvalidExpr);
                                        }

                                    }

                                }

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

        let validateUserFields = function (entity, inputsToDelete, result) {

            var entityKeys = Object.keys(entity);

            entityKeys.forEach(function (entityKey) {

                if (entityKey.indexOf('user_text_') === 0 ||
                    entityKey.indexOf('user_number_') === 0 ||
                    entityKey.indexOf('user_date_') === 0) {

                    var fieldWithInvalidExpr = checkFieldExprForDeletedInput(inputsToDelete,
                                                                             entity[entityKey],
                                                                             entityKey,
                                                                             'FIELDS');

                    if (fieldWithInvalidExpr) {
                        result.push(fieldWithInvalidExpr);
                    }

                }

            });
        };

        let checkEntityForEmptyFields = (entity) => {

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
        // < TRANSACTION VALIDATION >


        // INPUTS GRID TABLE
        let onInputsGridTableRowAddition = function () {

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

        let onInputsGridTableCellChange = function (rowKey) {

            // updating whole row because 'value_type' change causes other cells to change
            var gtRow = viewModel.inputsGridTableDataService.getRowByKey(rowKey);
            var input = viewModel.entity.inputs[gtRow.order];

            gtRow.columns.forEach(function (gtColumn) {

                if (gtColumn.objPath) {
                    metaHelper.setObjectNestedPropVal(input, gtColumn.objPath, gtColumn.settings.value);

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

        let relationItemsResolver = function (contentType) { // Victor: This function I introduce in child dialog to resolve default value items
            return viewModel.loadRelation(resolveRelation(contentType), true);
        }

        let onRelationDefaultValueSelInit = function (rowData, colData, gtDataService) {

            let changedCell = gtDataService.getCell(rowData.order, colData.order);

            let contentTypeCell = viewModel.inputsGridTableDataService.getCellByKey(rowData.order, 'content_type');

            // let loadRelationRes = viewModel.loadRelation(resolveRelation(contentTypeCell.settings.val ue), true);
            let loadRelationRes = relationItemsResolver(contentTypeCell.settings.value);

            if (loadRelationRes && loadRelationRes.status === 'item_exist') {
                changedCell.settings.selectorOptions = viewModel.relationItems[loadRelationRes.field]

            } else {

                loadRelationRes.then(function (relItem) {

                    changedCell.settings.selectorOptions = relItem
                    $scope.$apply();

                });

            }

        };

        let changeCellsBasedOnValueType = function (row) {

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
                        defaultValue.settings = {value: ''}

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
                        defaultValue.settings = {value: ''}

                    }

                    fillFromContext.settings.value = null
                    fillFromContext.cellType = 'empty'

                    break;

            }

        };

        let getInputsForLinking = function () {

            viewModel.inputsForMultiselector = viewModel.entity.inputs.map(function (input) {

                return {
                    id: input.name,
                    name: input.name
                }

            });

        };

        let updateLinkedInputsOptionsInsideGridTable = function () {

            let linkedInputsNames = viewModel.inputsGridTableDataService.getCellByKey('templateRow', 'linked_inputs_names');
            linkedInputsNames.settings.selectorOptions = viewModel.inputsForMultiselector

            for (let i = 0; i < viewModel.inputsGridTableData.body.length; i++) {

                linkedInputsNames = viewModel.inputsGridTableDataService.getCellByKey(i, 'linked_inputs_names');

                linkedInputsNames.settings.selectorOptions = viewModel.inputsForMultiselector

            }

        };

        let deleteInputsRows = function (gtDataService, gtEventService) {

            var selectedRows = gtDataService.getSelectedRows();

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
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

        let addInputRow = function (gtDataService, gtEventService) {

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

                    changeCellsBasedOnValueType(newRow);
                    viewModel.inputsGridTableData.body.unshift(newRow);

                    gtEventService.dispatchEvent(gridTableEvents.ROW_ADDED);

                }

            });

        };

        let initGridTableEvents = function () {

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
                            closeOnMouseOut: false
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
                    filters: false,
                    columns: false,
                    search: false
                }
            }
        }

        let createDataForInputsTableGrid = function () {

            var rowObj = metaHelper.recursiveDeepCopy(viewModel.inputsGridTableData.templateRow, true);

            // assemble header columns
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
            // < assemble header columns >

            // assemble body rows
            viewModel.entity.inputs.forEach(function (input, index) {

                rowObj = metaHelper.recursiveDeepCopy(viewModel.inputsGridTableData.templateRow, true);

                rowObj.order = index
                rowObj.key = input.name

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

                changeCellsBasedOnValueType(rowObj);

                // input_calc_expr
                rowObj.columns[7].settings.value = input.value_expr
                // linked_inputs_names
                if (input.settings && input.settings.linked_inputs_names) {
                    rowObj.columns[8].settings.value = input.settings.linked_inputs_names
                }

                rowObj.columns[8].settings.selectorOptions = viewModel.inputsForMultiselector
                // rowObj.columns[8].settings.getDataMethod = getInputsForLinking;

                viewModel.inputsGridTableData.body.push(rowObj)

            });
            // < assemble body rows >
            viewModel.inputsGridTableDataService.setTableData(viewModel.inputsGridTableData);

        }
        // < INPUTS GRID TABLE >

        let initAfterMainDataLoaded = function () {

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

            resolveRelation: resolveRelation,
            checkActionsForEmptyFields: checkActionsForEmptyFields,
            checkEntityForEmptyFields: checkEntityForEmptyFields,

            initGridTableEvents: initGridTableEvents,
            createDataForInputsTableGrid: createDataForInputsTableGrid,

            initAfterMainDataLoaded: initAfterMainDataLoaded
        }

    };

}());