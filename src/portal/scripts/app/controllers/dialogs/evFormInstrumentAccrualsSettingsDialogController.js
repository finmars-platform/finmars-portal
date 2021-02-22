(function () {

	'use strict';

	const metaHelper = require('../../helpers/meta.helper');

	const accrualCalculationModelService = require('../../services/accrualCalculationModelService');
	const instrumentPeriodicityService = require('../../services/instrumentPeriodicityService');

	const GridTableDataService = require('../../services/gridTableDataService');
	const EventService = require('../../services/eventService');

	const gtEvents = require('../../services/gridTableEvents');

	module.exports = function entityDataConstructorDialogController($scope, $mdDialog, gridTableHelperService, data) {

		const vm = this;

		vm.readyStatus = false;

		const rowNames = {
			notes: 'Notes',
			accrual_start_date: 'Accrual start date',
			first_payment_date: 'First payment date',
			accrual_size: 'Accrual size',
			accrual_calculation_model: "Calculation model",
			periodicity: "Periodicity",
			periodicity_n: "Periodicity N",
			build_accruals_btn: '"Build Accruals" Button',
			rows_addition: '"Add" Button',
			rows_deletion: '"Delete" Button'
		};

		/* let accrualModelsOpts = [];
		 let periodicityItemsOpts = [];
		let unformattedData = []; */

		const defaultSettings = [
			{key: "notes", to_show: true, override_name: ""},
			{key: "accrual_start_date", to_show: true, override_name: ""},
			{key: "first_payment_date", to_show: true, override_name: ""},
			{key: "accrual_size", to_show: true, override_name: ""},
			{key: "accrual_calculation_model", to_show: true, override_name: "", options: []},
			{key: "periodicity", to_show: true, override_name: "", options: []},
			{key: "periodicity_n", to_show: true, override_name: ""},
			{key: "build_accruals_btn", to_show: true},
			{key: "rows_addition", to_show: true},
			{key: "rows_deletion", to_show: true}
		];

		vm.gridTableData = {
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
						cellType: 'readonly_text',
						settings: {
							value: null
						},
						styles: {
							'grid-table-cell': {'width': '210px'}
						}
					},
					{
						key: 'to_show',
						objPath: ['to_show'],
						columnName: 'To show',
						order: 1,
						cellType: 'checkbox',
						settings: {
							value: false
						},
						styles: {
							'grid-table-cell': {'width': '85px'}
						}
					},
					{
						key: 'override_name',
						objPath: ['override_name'],
						columnName: 'Override name',
						order: 2,
						cellType: 'text',
						settings: {
							value: null,
							closeOnMouseOut: false
						},
						styles: {
							'grid-table-cell': {'width': '210px'}
						}
					},
					{
						key: 'options_settings',
						objPath: ['options'],
						columnName: '',
						order: 3,
						cellType: 'custom_popup',
						settings: {
							value: null,
							closeOnMouseOut: false,
							cellText: '...',
							popupSettings: {
								contentHtml: {
									main: "<div ng-include src=\"'views/directives/gridTable/cells/popups/instrument-selector-options-display-settings.html'\"></div>"
								},
								classes: "ev-instr-accruals-settings-popup"
							}
						},
						styles: {
							'grid-table-cell': {'width': '65px'}
						}
					}
				]
			},
			components: {
				topPanel: false
			}
		};

		const formatDataForGridTable = function () {

			var rowObj = metaHelper.recursiveDeepCopy(vm.gridTableData.templateRow, true);

			//<editor-fold desc="Assemble header columns">
			vm.gridTableData.header.columns = rowObj.columns.map(function (column) {

				return {
					key: column.key,
					columnName: column.columnName,
					order: column.order,
					sorting: false,
					styles: {
						'grid-table-cell': {'width': column.styles['grid-table-cell'].width}
					}
				};

			});
			//</editor-fold>

			defaultSettings.forEach((settings, settingsIndex) => {

				rowObj = metaHelper.recursiveDeepCopy(vm.gridTableData.templateRow, true);

				rowObj.key = settings.key;
				rowObj.order = settingsIndex;

				rowObj.columns.forEach(column => {

					const colProp = column.objPath[0];

					if (column.key === 'name') {
						column.settings.value = rowNames[settings.key];
					}

					else if (settings.hasOwnProperty(colProp)) {

						/* if (column.key === 'options_settings') {

							column.settings.value = settings.options;

						} else {
							column.settings.value = settings[colProp];
						} */
						column.settings.value = settings[colProp];

					}

					else { // make cell empty if there is not corresponding property
						column.cellType = 'empty';
						delete column.settings;
					}

				});

				vm.gridTableData.body.push(rowObj);
				// const nameColumn = gridTableHelperService.getCellFromRowByKey(rowObj, 'notes');

			});

		};

		vm.cancel = function () {
			$mdDialog.hide({status: 'disagree'});
		};

		vm.save = function () {
			$mdDialog.hide({status: 'agree'});
		};

		const init = async function () {

			vm.gridTableDataService = new GridTableDataService();
			vm.gridTableEventService = new EventService();

			// unformattedData = defaultSettings;

			if (!data) { // get fixed default data for new entity data component

				const mapOptions = function (item) {
					return {
						user_code: item.user_code,
						name: item.name,
						to_show: true,
						override_name: "",
					};
				};

				/* accrualCalculationModelService.getList().then(accrualModelsData => {
					defaultOpts.accrualModels = accrualModelsData.map(mapOptions);
				});

				instrumentPeriodicityService.getList().then(function (periodicityData) {
					defaultOpts.periodicity = periodicityData.map(mapOptions);
				}); */
				const defaultCalculationModelIndex = defaultSettings.findIndex(settings => settings.key === 'accrual_calculation_model');
				const defaultPeriodicityIndex = defaultSettings.findIndex(settings => settings.key === 'periodicity');

				try {

					let accrualCalcModels = await accrualCalculationModelService.getList();
					defaultSettings[defaultCalculationModelIndex].options = accrualCalcModels.map(mapOptions);

				} catch (error) {}

				try {

					const periodicityItems = await instrumentPeriodicityService.getList();
					defaultSettings[defaultPeriodicityIndex].options = periodicityItems.map(mapOptions);

				} catch (error) {}

			}

			formatDataForGridTable();
			vm.gridTableDataService.setTableData(vm.gridTableData);

			/* vm.gridTableEventService.addEventListener(gtEvents.CELL_VALUE_CHANGED, (argObj) => {
				console.log("testing cell value changed", vm.gridTableData);
			}); */

			vm.readyStatus = true;
			$scope.$apply();

		};

		init();

	};

}());