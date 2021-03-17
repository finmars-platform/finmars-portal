(function () {

	const metaHelper = require('../helpers/meta.helper');
	const md5Helper = require('../helpers/md5.helper');

	const instrumentService = require('../services/instrumentService');
	const accrualCalculationModelService = require('../services/accrualCalculationModelService');
	const instrumentPeriodicityService = require('../services/instrumentPeriodicityService');

	const GridTableDataService = require('../services/gridTableDataService');
	const EventService = require('../services/eventService');
	const gtEvents = require('../services/gridTableEvents');
	const popupEvents = require('../services/events/popupEvents');
	const instrumentTypeService = require('../services/instrumentTypeService');

	const evEditorEvents = require("../services/ev-editor/entityViewerEditorEvents");

	module.exports = function ($mdDialog) {
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
						objPath: ['accrual_start_date'],
						cellType: 'date',
						settings: {
							value: null
						}
					},
					'first_payment_date': {
						key: 'first_payment_date',
						objPath: ['first_payment_date'],
						cellType: 'date',
						settings: {
							value: null
						}
					},
					'accrual_size': {
						key: 'accrual_size',
						objPath: ['accrual_size'],
						cellType: 'number',
						settings: {
							value: null,
							closeOnMouseOut: false
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
						objPath: ['periodicity_n'],
						cellType: 'number',
						settings: {
							value: null
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

				// Victor 2021.03.10 #78 add row for accrual table component in GENERAL tab
				scope.accrualsShemes = [];

				const getInstrumentTypeAccrualsById = async function (id) {
					const instrumentType = await instrumentTypeService.getByKey(id);
					return instrumentType.accruals;
				};

				const onAccrualsTableAddRow = async function (gtDataService, gtEventService, $event) {

					scope.popupX.value = $event.pageX;
					scope.popupY.value = $event.pageY;

					scope.gridTableEventService.dispatchEvent(popupEvents.OPEN_POPUP, {doNotUpdateScope: true});
				};

				const openAccrualEditDialog = async function (accrualScheme) {

					return $mdDialog.show({
						controller: 'SingleInstrumentAddAccrualToTableDialogController as vm',
						templateUrl: 'views/dialogs/single-instrument-add-accrual-to-table-dialog-view.html',
						parent: angular.element(document.body),
						clickOutsideToClose: false,
						multiple: true,
						locals: {
							data: {
								accrualScheme: accrualScheme,
								entity: scope.entity
							}
						}
					});

				};

				const newRowsKeys = []

				const insertAccrualToTable = function (accrual) {

					const newRowKey = md5Helper.md5('newGridTableRow', newRowsKeys.length);
					newRowsKeys.push(newRowKey);

					accrual.frontOptions = {gtKey: newRowKey};
					const rowObj = metaHelper.recursiveDeepCopy(gridTableData.templateRow);
					rowObj.key = newRowKey;

					rowObj.columns.forEach(column => {

						column.settings.value = metaHelper.getObjectNestedPropVal(accrual, column.objPath);

						if (column.cellType === 'selector') {

							const optionIndex = column.settings.selectorOptions.findIndex(option => option.id === column.settings.value);

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

							}


						}

					});

					scope.entity[bfcVm.fieldKey].unshift(accrual);
					gridTableData.body.unshift(rowObj);

					// Update rows in grid table
					scope.entity[bfcVm.fieldKey].forEach(function (item, itemIndex) {
						gridTableData.body[itemIndex].order = itemIndex;
					});


				};

				scope.popupX = {value: null};
				scope.popupY = {value: null};
				scope.popupData = {
					items: [],
					isBuildButton: scope.item.options.tableData.find(item => item.key === 'build_accruals_btn').to_show,
					onItemClick: async (item) => {

						scope.gridTableEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

						const res = await openAccrualEditDialog(item);

						if (res.status === 'agree') {

							const accrual = res.data.accrual;
							insertAccrualToTable(accrual);

						}

					}
				};

				scope.popupTemplate =
					`<div class="accrual-add-row-popup-container">
						<div data-ng-repeat="item in popupData.items"
							class="accrual-add-row-popup-item" 
							data-ng-click="popupData.onItemClick(item)">{{item.name}}</div>
						<div data-ng-if="popupData.isBuildButton" class="accrual-add-row-popup-item build-accruals">Build accruals</div>
					</div>`;
				// custom-input-sel-menu-block
				// <Victor 2021.03.10 #78 add row for accrual table component in GENERAL tab>

				const minWidth = 50;
				const maxWidth = 400;
				let columnsNumber = 0;

				let thisTableChanged = {value: false}
				let entitySpecificData;

				const assembleColumns = function () {

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
									'min-width': minWidth + 'px',
									'width': averageWidth + '%',
									'max-width': maxWidth + 'px'
								}
							};

							gridTableData.header.columns[colIndex].styles = colStyles;
							column.styles = colStyles;

						});

					}

					const rowsAddition = tableData.find(item => item.key === 'rows_addition');
					const rowsDeletion = tableData.find(item => item.key === 'rows_deletion');
					const buildAccrBtn = tableData.find(item => item.key === 'build_accruals_btn');

					if (rowsAddition.to_show || rowsDeletion.to_show) gridTableData.components.topPanel = {};

					gridTableData.components.topPanel.addButton = !!rowsAddition.to_show;

					gridTableData.components.topPanel.rowsDeletionPanel = !!rowsDeletion.to_show
					gridTableData.components.rowCheckboxes = !!rowsDeletion.to_show;

				};

				const convertDataIntoGridTable = function () {

					if (!scope.entity[bfcVm.fieldKey]) scope.entity[bfcVm.fieldKey] = [];

					gridTableData.body = [];

					scope.entity[bfcVm.fieldKey].forEach((rowData, rowIndex) => {

						const rowObj = metaHelper.recursiveDeepCopy(gridTableData.templateRow, true);

						rowObj.key = rowData.hasOwnProperty('id') ? rowData.id : rowData.frontOptions.gtKey;
						rowObj.newRow = !!(rowData.frontOptions && rowData.frontOptions.newRow);
						rowObj.order = rowIndex;

						rowObj.columns.forEach(column => {

							column.settings.value = metaHelper.getObjectNestedPropVal(rowData, column.objPath);

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

						});

						gridTableData.body.push(rowObj);

					});

					scope.gridTableDataService.setTableData(gridTableData);

				};

				const setTableMinWidth = function () {
					const element = elem[0].querySelector('.bind-field-table-content');
					element.style['min-width'] = minWidth * columnsNumber + 'px';
				};

				const init = async function () {

					let asyncOperation = false;

					scope.gridTableDataService = new GridTableDataService();
					scope.gridTableEventService = new EventService();

					if (scope.entityType === 'instrument') {

						// Victor 2021.03.10 #78 add row for accrual table component in GENERAL tab
						gridTableData.tableMethods = {
							addRow: onAccrualsTableAddRow
						}

						scope.accrualsShemes = await getInstrumentTypeAccrualsById(scope.entity.instrument_type);
						scope.popupData.items = scope.accrualsShemes;
						// <Victor 2021.03.10 #78 add row for accrual table component in GENERAL tab>

						entitySpecificData = {
							selectorOptions: {
								accrual_calculation_model: [],
								periodicity: []
							}
						}

						const promises = [];

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

						await Promise.allSettled(promises);
						asyncOperation = true;

					}

					assembleColumns();
					setTableMinWidth();
					convertDataIntoGridTable();

					scope.readyStatus = true;
					if (asyncOperation) scope.$apply();

					instrumentService.initAccrualsScheduleGridTableEvents(
						scope.gridTableDataService, scope.gridTableEventService, scope.entity, bfcVm.evEditorEventService, thisTableChanged
					);

					bfcVm.evEditorEventService.addEventListener(evEditorEvents.TABLE_CHANGED, function (argObj) {

						if (argObj && argObj.key === 'accrual_calculation_schedules' && !thisTableChanged.value) {

							convertDataIntoGridTable();
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