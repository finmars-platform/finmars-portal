(function () {

	const metaHelper = require('../helpers/meta.helper');
	const md5Helper = require('../helpers/md5.helper');

	const instrumentService = require('../services/instrumentService');
	const accrualCalculationModelService = require('../services/accrualCalculationModelService');
	const instrumentPeriodicityService = require('../services/instrumentPeriodicityService');

	const GridTableDataService = require('../services/gridTableDataService');
	const EventService = require('../services/eventService');
	const gridTableEvents = require('../services/gridTableEvents');

	const gtEvents = require('../services/gridTableEvents');
	const popupEvents = require('../services/events/popupEvents');
	const instrumentTypeService = require('../services/instrumentTypeService');

	const evEditorEvents = require("../services/ev-editor/entityViewerEditorEvents");

	module.exports = function ($mdDialog, gridTableHelperService, multitypeFieldService) {
		return {
			require: "^^bindFieldControl",
			restrict: "E",
			scope: {
				item: '=',
				entity: '='
			},
			templateUrl: "views/directives/bind-field-table-view.html",
			link: function (scope, elem, attr, bfcVm) {

				scope.readyStatus = false;

				scope.entityType = bfcVm.entityType;

				scope.popupX = {value: null};
				scope.popupY = {value: null};
				scope.popupTemplate =
					`<div class="accrual-add-row-popup-container">
						<div data-ng-repeat="item in popupData.items"
							 class="accrual-add-row-popup-item"
							 data-ng-click="popupData.onItemClick(item)">{{item.name}}</div>
						<div data-ng-if="popupData.isBuildButton" class="accrual-add-row-popup-item build-accruals">Build accruals</div>
					</div>`;

				const minTableColWidth = 50;
				const maxTableColWidth = 400;
				let columnsNumber = 0;
				/** Helps to determine which of multiple tables changed */
				let thisTableChanged = {value: false}
				let entitySpecificData;

				const instrumentAccrualsColumns = {
					'notes' :{
						key: 'notes',
						objPath: ['notes'],
						cellType: 'text',
						settings: {
							value: null,
							closeOnMouseOut: false
						},
					},
					'accrual_start_date': {
						key: 'accrual_start_date',
						objPaths: [['accrual_start_date'], ['accrual_start_date_value_type']],
						cellType: 'multitypeField',
						settings: {
							value: [null, null],
							fieldTypesData: null,
						}
					},
					'first_payment_date': {
						key: 'first_payment_date',
						objPaths: [['first_payment_date'], ['first_payment_date_value_type']],
						cellType: 'multitypeField',
						settings: {
							value: [null, null],
							fieldTypesData: null,
						}
					},
					'accrual_size': {
						key: 'accrual_size',
						objPaths: [['accrual_size'], ['accrual_size_value_type']],
						cellType: 'multitypeField',
						settings: {
							value: [null, null],
							fieldTypesData: null,
						},
					},
					'accrual_calculation_model': {
						key: 'accrual_calculation_model',
						objPath: ['accrual_calculation_model'],
						cellType: 'selector',
						settings: {
							value: null
						}
					},
					'periodicity': {
						key: 'periodicity',
						objPath: ['periodicity'],
						cellType: 'selector',
						settings: {
							value: null
						}
					},
					'periodicity_n': {
						key: 'periodicity_n',
						objPaths: [['periodicity_n'], ['periodicity_n_value_type']],
						cellType: 'multitypeField',
						settings: {
							value: [null, null],
							fieldTypesData: null,
						}
					}
				};

				const gridTableData = {
					header: {
						order: 'header',
						columns: []
					},
					templateRow: {
						isActive: false,
						columns: []
					},
					body: [],
					components: {}
				};

				let multitypeFieldsForRows;

				const loadDataForInstrumentAccruals = function () {

					const promises = [];

					entitySpecificData = {
						selectorOptions: {
							accrual_calculation_model: [],
							periodicity: []
						}
					}

					const calcModelProm = new Promise((res, rej) => {

						accrualCalculationModelService.getList().then(data => {

							entitySpecificData.selectorOptions.accrual_calculation_model = data;
							res();

						}).catch(error => rej(error));

					});

					promises.push(calcModelProm);

					const periodicityProm = new Promise((res, rej) => {

						instrumentPeriodicityService.getList().then(data => {

							entitySpecificData.selectorOptions.periodicity = data;
							res();

						}).catch(error => rej(error));

					});

					promises.push(periodicityProm);

					const instrTypeAccrualsProm = new Promise ((res, rej) => {

						instrumentTypeService.getByKey(scope.entity.instrument_type).then(instrTypeData => {

							scope.accrualsShemes = instrTypeData.accruals || [];
							res();

						}).catch(error => rej(error));

					});

					promises.push(instrTypeAccrualsProm);

					return Promise.allSettled(promises);

				};

				const addSelectedHiddenOption = function (column) {

					const columnSelector = entitySpecificData.selectorOptions.hasOwnProperty(column.key);
					const optionSelectedInCustomizableSelector = (column.settings.value || column.settings.value === 0) && columnSelector;

					if (optionSelectedInCustomizableSelector) {

						const optionIndex = column.settings.selectorOptions.findIndex(option => option.id === column.settings.value);

						if (optionIndex < 0) { // if selected option hidden, add it until another selected

							const optionData = entitySpecificData.selectorOptions[column.key].find(option => {
								return option.id === column.settings.value;
							});

							column.settings.selectorOptions.push({
								id: optionData.id,
								name: optionData.name
							});

						}

					}

				};

				const openAccrualEditDialog = async function (accrualScheme) {

					const instrAttrTypes = bfcVm.evEditorDataService.getEntityAttributeTypes();

					return $mdDialog.show({
						controller: 'SingleInstrumentAddAccrualToTableDialogController as vm',
						templateUrl: 'views/dialogs/single-instrument-add-accrual-to-table-dialog-view.html',
						parent: angular.element(document.body),
						clickOutsideToClose: false,
						multiple: true,
						locals: {
							data: {
								accrualScheme: accrualScheme,
								entity: scope.entity,
								attributeTypes: instrAttrTypes
							}
						}

					});

				};

				/* const onAccrualsTableChangeCell = function (rowOrder, colKey) {

					const cell = scope.gridTableDataService.getCellByKey(rowOrder, colKey);

					if (cell.cellType === 'multitypeField') {

						const typeKey = `${colKey}_value_type`;
						const activeType = cell.settings.fieldTypesData.find(type => type.isActive);

						scope.entity[bfcVm.fieldKey][rowOrder][typeKey] = activeType.value_type;

					}

				}; */

				const addNewAccrual = function (accrual) {

					const newRowKey = gridTableHelperService.getNewRowUniqueKey(scope.gridTableDataService);

					accrual.frontOptions = {newRow: true, gtKey: newRowKey};

					const rowObj = metaHelper.recursiveDeepCopy(gridTableData.templateRow);
					rowObj.key = newRowKey;
					rowObj.newRow = true;

					/* rowObj.columns.forEach(column => {

						column.settings.value = metaHelper.getObjectNestedPropVal(accrual, column.objPath);

						if (column.cellType === 'selector') {
							/!* const optionIndex = column.settings.selectorOptions.findIndex(option => option.id === column.settings.value);

							if (optionIndex < 0) { // if selected option hidden, add it until another selected

								const optionData = entitySpecificData.selectorOptions[column.key].find(option => {
									return option.id === column.settings.value;
								});

								if (optionData) {

									column.settings.selectorOptions.push({
										id: optionData.id,
										name: optionData.name
									});

								}

							} *!/
							addSelectedHiddenOption(column);
						}

						else if (column.cellType === 'multitypeField') {
							makeMultitypeFieldCell(column, accrual);
						}

					}); */
					fillGridTableRowCells(accrual, rowObj);

					scope.entity[bfcVm.fieldKey].unshift(accrual);
					gridTableData.body.unshift(rowObj);

					// Update rows in grid table
					scope.entity[bfcVm.fieldKey].forEach(function (item, itemIndex) {
						gridTableData.body[itemIndex].order = itemIndex;
					});

					thisTableChanged.value = true;
					bfcVm.evEditorEventService.dispatchEvent(evEditorEvents.TABLE_CHANGED, {key: 'accrual_calculation_schedules'});

					scope.$apply();

				};

				const onTableAddRow = async function (gtDataService, gtEventService, $event) {

					scope.popupX.value = $event.pageX;
					scope.popupY.value = $event.pageY;

					scope.gridTableEventService.dispatchEvent(popupEvents.OPEN_POPUP, {doNotUpdateScope: true});

				};

				/* const makeMultitypeFieldCell = function (rowData, column) {

					const fieldTypesList = JSON.parse(JSON.stringify(multitypeFieldsForRows[column.key].fieldTypesList));
					const multitypeFieldData = multitypeFieldService.setActiveTypeByValueType(fieldTypesList, rowData.default_value, rowData.default_value_type);

					column.settings = {
						value: rowData.default_value,
						fieldTypesData: multitypeFieldData
					}

				} */

				const assembleGridTable = function () {

					const tableData = scope.item.options.tableData;
					let shownColIndex = 0;

					tableData.forEach(column => {

						var columnData = instrumentAccrualsColumns[column.key];

						if (column.to_show && columnData) {

							columnData.columnName = column.override_name ? column.override_name : column.name;
							columnData.order = shownColIndex;
							shownColIndex = shownColIndex + 1;

							if (column.options) {

								columnData.settings.selectorOptions = [];

								column.options.forEach(option => {

									if (option.to_show) {

										const convertedOpts = {id: option.id};
										convertedOpts.name = option.override_name ? option.override_name : option.name;

										columnData.settings.selectorOptions.push(convertedOpts);

									}

								});

							}

							gridTableData.header.columns.push({
								key: columnData.key,
								columnName: columnData.columnName,
								order: columnData.order,
								sorting: true
							});

							gridTableData.templateRow.columns.push(columnData);

						}

					});

					columnsNumber = gridTableData.templateRow.columns.length;


					if (columnsNumber) {

						const averageWidth = (100 / columnsNumber).toFixed(1);

						gridTableData.templateRow.columns.forEach((column, colIndex) => {

							const colStyles = {
								'grid-table-cell-elem': {
									'min-width': minTableColWidth + 'px',
									'width': averageWidth + '%',
									'max-width': maxTableColWidth + 'px'
								}
							};

							gridTableData.header.columns[colIndex].styles = colStyles;
							column.styles = colStyles;

						});

					}

					const rowsAddition = tableData.find(item => item.key === 'rows_addition');
					const rowsDeletion = tableData.find(item => item.key === 'rows_deletion');

					if (rowsAddition.to_show) {

						gridTableData.tableMethods = {
							addRow: onTableAddRow
						}

					}

					if (rowsAddition.to_show || rowsDeletion.to_show) gridTableData.components.topPanel = {};

					gridTableData.components.topPanel.addButton = !!rowsAddition.to_show;

					gridTableData.components.topPanel.rowsDeletionPanel = !!rowsDeletion.to_show
					gridTableData.components.rowCheckboxes = !!rowsDeletion.to_show;

				};

				/**
				 * Fill each grid table row's cell with data from entity
				 *
				 * @param item {Object} - matching to row data from entity
				 * @param row {Object} - grid table row data
				 */
				const fillGridTableRowCells = function (item, row) {

					row.columns.forEach((cell, index) => {

						if (cell.cellType === 'multitypeField') {

							/* const fieldTypesList = multitypeFieldsForRows[cell.key].fieldTypesList;

							let valueTypePath = [...[], ...cell.objPath];
							let valueTypeLastProp = valueTypePath.pop();

							valueTypeLastProp = valueTypeLastProp + '_value_type';
							valueTypePath.push(valueTypeLastProp);

							const valueType = metaHelper.getObjectNestedPropVal(item, valueTypePath); */
							if (cell.hasOwnProperty('objPaths')) {

								const fieldTypesList = multitypeFieldsForRows[cell.key].fieldTypesList;

								const cellValuePath = cell.objPaths[0];
								const cellValueTypePath = cell.objPaths[1];

								const cellValue = metaHelper.getObjectNestedPropVal(item, cellValuePath);
								const valueType = metaHelper.getObjectNestedPropVal(item, cellValueTypePath);

								const cellData = gridTableHelperService.getMultitypeFieldDataForCell(fieldTypesList, cell, cellValue, valueType);
								row.columns[index] = cellData.cell;

								// for existing accruals without _value_type
								if (!valueType && !isNaN(valueType)) {
									metaHelper.setObjectNestedPropVal(item, cellValueTypePath, cellData.valueType);
								}

							}

						}

						else {

							cell.settings.value = metaHelper.getObjectNestedPropVal(item, cell.objPath);

							if (cell.cellType === 'selector') {
								/* const optionIndex = column.settings.selectorOptions.findIndex(option => option.id === column.settings.value);

								if (optionIndex < 0) { // if selected option hidden, add it until another selected

									const optionData = entitySpecificData.selectorOptions[column.key].find(option => {
										return option.id === column.settings.value;
									});

									if (optionData) {

										column.settings.selectorOptions.push({
											id: optionData.id,
											name: optionData.name
										});

									}

								} */
								addSelectedHiddenOption(cell);
							}

						}

					});


				};

				const convertDataForGridTable = function () {

					if (!scope.entity[bfcVm.fieldKey]) scope.entity[bfcVm.fieldKey] = [];

					gridTableData.body = [];

					scope.entity[bfcVm.fieldKey].forEach((rowData, rowIndex) => {

						const rowObj = metaHelper.recursiveDeepCopy(gridTableData.templateRow, true);

						rowObj.key = rowData.hasOwnProperty('id') ? rowData.id : rowData.frontOptions.gtKey;
						rowObj.newRow = !!(rowData.frontOptions && rowData.frontOptions.newRow);
						rowObj.order = rowIndex;

						/*rowObj.columns.forEach(column => {

							column.settings.value = metaHelper.getObjectNestedPropVal(rowData, column.objPath);

							if (column.cellType === 'selector') {
								addSelectedHiddenOption(column);
							}

							if (column.cellType === 'multitypeField') {
								makeMultitypeFieldCell(rowData, column);
							}

						});*/
						fillGridTableRowCells(rowData, rowObj);

						gridTableData.body.push(rowObj);

					});

					scope.gridTableDataService.setTableData(gridTableData);

				};

				const setTableMinWidth = function () {
					const element = elem[0].querySelector('.bind-field-table-content');
					element.style['min-width'] = minTableColWidth * columnsNumber + 'px';
				};

				const init = async function () {

					let asyncOperation = false;

					scope.gridTableDataService = new GridTableDataService();
					scope.gridTableEventService = new EventService();

					/* scope.gridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, argumentsObj => {

						if (scope.entityType === 'instrument') {
							onAccrualsTableChangeCell(argumentsObj.row.order, argumentsObj.column.key);
						}

					}) */

					if (scope.entityType === 'instrument') {

						multitypeFieldsForRows = instrumentService.getInstrumentAccrualsMultitypeFieldsData();

						await loadDataForInstrumentAccruals();

						scope.popupData = {
							items: [],
							isBuildButton: scope.item.options.tableData.find(item => item.key === 'build_accruals_btn').to_show,
							onItemClick: async (item) => {

								scope.gridTableEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

								const res = await openAccrualEditDialog(item);

								if (res.status === 'agree') {

									const accrual = res.data.accrual;
									addNewAccrual(accrual);

								}

							}
						};

						scope.popupData.items = scope.accrualsShemes;

						const instrumentAttrTypes = bfcVm.evEditorDataService.getEntityAttributeTypes();
						multitypeFieldService.fillSelectorOptionsBasedOnValueType(instrumentAttrTypes, multitypeFieldsForRows);

						asyncOperation = true;

						// Update selector options after dynamic attributes change
						bfcVm.evEditorEventService.addEventListener(evEditorEvents.DYNAMIC_ATTRIBUTES_CHANGE, () => {
							const instrumentAttrTypes = bfcVm.evEditorDataService.getEntityAttributeTypes();
							instrumentService.updateMultitypeFieldSelectorOptionsInsideGridTable(instrumentAttrTypes, multitypeFieldsForRows, gridTableData);
						});

					}

					assembleGridTable();
					setTableMinWidth();
					convertDataForGridTable();

					scope.readyStatus = true;
					if (asyncOperation) scope.$apply();

					instrumentService.initAccrualsScheduleGridTableEvents(
						scope.gridTableDataService, scope.gridTableEventService, scope.entity, bfcVm.evEditorEventService, thisTableChanged
					);

					bfcVm.evEditorEventService.addEventListener(evEditorEvents.TABLE_CHANGED, argObj => {

						if (argObj && argObj.key === 'accrual_calculation_schedules' && !thisTableChanged.value) {

							convertDataForGridTable();
							scope.gridTableEventService.dispatchEvent(gtEvents.REDRAW_TABLE);

						}

						thisTableChanged.value = false;

					});

				};

				init();

			}
		}
	};

}());