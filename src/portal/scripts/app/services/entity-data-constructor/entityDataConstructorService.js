(function () {

	const accrualCalculationModelService = require('../accrualCalculationModelService');
	const instrumentPeriodicityService = require('../instrumentPeriodicityService');

	'use strict';
	module.exports = function () {

		const fullRowUserInputsList = ['customizable_accruals_table'];

		const dataOfAttributes = {
			'instrument': {
				'customizable_accruals_table': {
					'label': '',
					'tableData': [
						{
							key: "notes",
							name: "Notes",
							to_show: true,
							override_name: "",
						},
						{
							key: "accrual_start_date",
							name: "Accrual start date",
							to_show: true,
							override_name: "",
						},
						{
							key: "first_payment_date",
							name: "First payment date",
							to_show: true,
							override_name: "",
						},
						{
							key: "accrual_size",
							name: "Accrual size",
							to_show: true,
							override_name: "",
						},
						{
							key: "accrual_calculation_model",
							name: "Calculation model",
							to_show: true,
							override_name: "",
							options: []
						},
						{
							key: "periodicity",
							name: "Periodicity",
							to_show: true,
							override_name: "",
							options: []
						},
						{
							key: "periodicity_n",
							name: "Periodicity N",
							to_show: true,
							override_name: "",
						},
						{
							key: "build_accruals_btn",
							name: '"Build Accruals" Button',
							to_show: true,
						},
						{
							key: "rows_addition",
							name: '"Add" Button',
							to_show: true,
						},
						{
							key: "rows_deletion",
							name: '"Delete" Button',
							to_show: true,
						}
					]
				}
			}
		};

		const loadOptionsForAccrualsTable = async function () {

			const accrualsTable = dataOfAttributes.instrument.customizable_accruals_table.tableData;

			const calcModelIndex = accrualsTable.findIndex(row => row.key === 'accrual_calculation_model');
			const periodicityIndex = accrualsTable.findIndex(row => row.key === 'periodicity');

			const mapOptions = function (item) {
				return {
					user_code: item.user_code,
					name: item.name,
					to_show: true,
					override_name: "",
				};
			};

			const accrualCalcModelsProm = new Promise(async (res, rej) => {

				accrualCalculationModelService.getList().then(data => {

					accrualsTable[calcModelIndex].options = data.map(mapOptions);
					res();

				}).catch(error => rej("error on getting accrual calculation models happened"));

			})

			const periodicityProm = new Promise(async (res, rej) => {

				instrumentPeriodicityService.getList().then(data => {

					accrualsTable[periodicityIndex].options = data.map(mapOptions);
					res();

				}).catch(error => rej("error on getting instrument periodicity happened"));

			});

			return Promise.all([accrualCalcModelsProm, periodicityProm]);

		};

		return {
			fullRowUserInputsList: fullRowUserInputsList,

			dataOfAttributes: dataOfAttributes,

			loadOptionsForAccrualsTable: loadOptionsForAccrualsTable
		}

	}

}());