(function () {

	const metaHelper = require('../helpers/meta.helper');

	const instrumentService = require('../services/instrumentService');

	const GridTableDataService = require('../services/gridTableDataService');
	const EventService = require('../services/eventService');
	const gtEvents = require('../services/gridTableEvents');

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

				const minWidth = 50;
				const maxWidth = 400;
				let columnsNumber = 0;

				let thisTableChanged = {value: false}

				const assembleColumns = function () {

					const tableData = scope.item.options.tableData;
					let shownColIndex = 0;

					tableData.forEach(col => {

						var columnData = instrumentAccrualsColumns[col.key];

						if (col.to_show && columnData) {

							columnData.columnName = col.override_name ? col.override_name : col.name;
							columnData.order = shownColIndex;
							shownColIndex = shownColIndex + 1;

							if (col.options) {

								columnData.settings.selectorOptions = [];

								col.options.forEach(option => {

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

						gridTableData.templateRow.columns.forEach((col, colIndex) => {

							const colStyles = {
								'grid-table-cell-elem': {
									'min-width': minWidth + 'px',
									width: averageWidth + '%',
									'max-width': maxWidth + 'px'
								}
							};

							gridTableData.header.columns[colIndex].styles = colStyles;
							col.styles = colStyles;

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

					if (!scope.entity[bfcVm.fieldKey]) {
						scope.entity[bfcVm.fieldKey] = [];
					}

					gridTableData.body = [];

					scope.entity[bfcVm.fieldKey].forEach((rowData, rowIndex) => {

						const rowObj = metaHelper.recursiveDeepCopy(gridTableData.templateRow, true);

						rowObj.key = rowData.hasOwnProperty('id') ? rowData.id : rowData.frontOptions.gtKey;
						rowObj.newRow = !!(rowData.frontOptions && rowData.frontOptions.newRow);
						rowObj.order = rowIndex;

						rowObj.columns.forEach(column => {
							column.settings.value = metaHelper.getObjectNestedPropVal(rowData, column.objPath);
						});

						gridTableData.body.push(rowObj);

					});

					scope.gridTableDataService.setTableData(gridTableData);

				};

				const setTableMinWidth = function () {
					const element = elem[0].querySelector('.bind-field-table-content');
					element.style['min-width'] = minWidth * columnsNumber + 'px';
				};

				const init = function () {

					scope.gridTableDataService = new GridTableDataService();
					scope.gridTableEventService = new EventService();

					assembleColumns();
					setTableMinWidth();
					convertDataIntoGridTable();

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