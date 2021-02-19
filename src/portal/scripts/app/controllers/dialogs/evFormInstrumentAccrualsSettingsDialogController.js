(function () {

	'use strict';

	const metaHelper = require('../../helpers/meta.helper');

	const accrualCalculationModelService = require('../../services/accrualCalculationModelService');
	const instrumentPeriodicityService = require('../../services/instrumentPeriodicityService');

	const GridTableDataService = require('../../services/gridTableDataService');
	const EventService = require('../../services/eventService');

	module.exports = function entityDataConstructorDialogController($scope, $mdDialog, gridTableHelperService, data) {

		const vm = this;

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
		 let periodicityItemsOpts = []; */
		let unformattedData = [];
		const defaultOpts = {};

		let defaultSettings = [
			{key: "notes", to_show: true, override_name: "", settings: false},
			{key: "accrual_start_date", to_show: true, override_name: "", settings: false},
			{key: "first_payment_date", to_show: true, override_name: "", settings: false},
			{key: "accrual_size", to_show: true, override_name: "", settings: false},
			{key: "accrual_calculation_model", to_show: true, override_name: "", settings: defaultOpts.accrualModels},
			{key: "periodicity", to_show: true, override_name: "", settings: defaultOpts.periodicity},
			{key: "periodicity_n", to_show: true, override_name: "", settings: false},
			{key: "build_accruals_btn", to_show: true, override_name: "", settings: false},
			{key: "rows_addition", to_show: true, override_name: "", settings: false},
			{key: "rows_deletion", to_show: true, override_name: "", settings: false}
		];

		vm.gridTableData = {
			header: {
				order: 'header',
				columns: []
			},
			body: [],
			templateRow: {
				isActive: false,
				columns: [
					{
						key: 'name',
						objPath: [],
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
						objPath: ['notes'],
						columnName: 'To show',
						order: 1,
						cellType: 'checkbox',
						settings: {
							value: false
						},
						styles: {
							'grid-table-cell': {'width': '210px'}
						}
					},
					{
						key: 'override_name',
						objPath: ['notes'],
						columnName: 'Override name',
						order: 2,
						cellType: 'text',
						settings: {
							value: null
						},
						styles: {
							'grid-table-cell': {'width': '210px'}
						}
					},
					/* {
						key: 'settings',
						objPath: ['notes'],
						columnName: '',
						order: 3,
						cellType: 'custom_popup',
						settings: {
							value: null
						},
						cellText: '...',
						closeOnMouseOut: false,
						styles: {
							'grid-table-cell': {'width': '210px'}
						}
					} */
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
					sorting: true,
					styles: {
						'grid-table-cell': {'width': column.styles['grid-table-cell'].width}
					}
				};

			});
			//</editor-fold>

			defaultSettings.forEach((settings, settingsIndex) => {

				rowObj = metaHelper.recursiveDeepCopy(vm.gridTableData.templateRow, true);
				rowObj.key = settingsIndex;
				rowObj.order = settingsIndex;

				rowObj.name = rowNames[rowObj.key];

				rowObj.columns.forEach(templateCol => {

					if (templateCol.key === 'name') {
						templateCol.settings.value = rowNames[settings.key];
					}

					templateCol.settings.value = settings[templateCol.key];

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

		const init = function () {

			vm.gridTableDataService = new GridTableDataService();
			vm.gridTableEventService = new EventService();

			unformattedData = defaultSettings;

			if (!data) {

				const mapOptions = function (item) {
					return {
						user_code: item.user_code,
						name: item.name,
						to_show: true,
						override_name: "",
					};
				};

				accrualCalculationModelService.getList().then(accrualModelsData => {
					defaultOpts.accrualModels = accrualModelsData.map(mapOptions);
				});

				instrumentPeriodicityService.getList().then(function (periodicityData) {
					defaultOpts.periodicity = periodicityData.map(mapOptions);
				});

			}

			formatDataForGridTable();
			console.log("testing gridTableData", vm.gridTableData);
			vm.gridTableDataService.setTableData(vm.gridTableData);

		};

		init();

	};

}());