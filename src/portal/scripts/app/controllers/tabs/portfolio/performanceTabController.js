'use strict';

const metaService = require('../../../services/metaService');
const portfolioRegisterService = require('../../../services/portfolioRegisterService');
const GridTableDataService = require('../../../services/gridTableDataService');
const GridTableEventService = require('../../../services/gridTableEventService');

const metaHelper = require('../../../helpers/meta.helper');

export default function PortfolioPerformanceTabController ($scope, $mdDialog) {

	const vm = this;

	vm.readyStatus = false;

	let portfoliosRegistersList = [];

	vm.addNewRelInstr = function ($event) {

	};

	let relationInstrumentsGtData = {
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
					key: 'relationName',
					columnName: 'Relation name',
					order: 0,
					cellType: 'readonly_text',
					settings: {
						value: null,
					},
					styles: {
						'grid-table-cell': {'width': '140px'}
					},
				},
				{
					key: 'instrument',
					columnName: 'Instrument',
					cellType: 'readonly_text',
					order: 1,
					settings: {
						value: null,
					},
					styles: {
						'grid-table-cell': {'width': '140px'}
					},
				},
				{
					key: 'valuationCurrency',
					columnName: 'Valuation currency',
					cellType: 'readonly_text',
					order: 2,
					settings: {
						value: null,
					},
					styles: {
						'grid-table-cell': {'width': '140px'}
					},
				},
				{
					key: 'valuationPricingPolicy',
					columnName: 'Pricing policy',
					cellType: 'readonly_text',
					order: 3,
					settings: {
						value: null,
					},
					styles: {
						'grid-table-cell': {'width': '140px'}
					},
				},
				{
					key: 'rowActionButton',
					columnName: '',
					cellType: 'button',
					settings: {
						buttonContent: `<div class="material-icons">more_vert</div>`,
						callback: function () {
							// open popup
						}
					},
					order: 4,
					styles: {
						'grid-table-cell': {'width': '140px'}
					},
				},
			]
		},
		components: {
			topPanel: false,
			rowCheckboxes: false,
		}

	};

	const loadPrtfRegisters = function () {

		const options = {
			pageSize: 1000,
			page: 1
		}

		return new Promise((resolve, reject) => {

			metaService.loadDataFromAllPages(portfolioRegisterService.getList, [options]).then(prData => {
				resolve(prData)

			}).catch(error => reject(error))

		});

	};

	const createDataForRelInstrGt = function () {

		relationInstrumentsGtData.body = [];

		const rowObj = metaHelper.recursiveDeepCopy(relationInstrumentsGtData.templateRow, true);

		relationInstrumentsGtData.header.columns = rowObj.columns.map(function (column) {

			return {
				key: column.key,
				columnName: column.columnName,
				order: column.order,
				sorting: column.key !== 'rowActionButton',
				styles: {
					'grid-table-cell': {'width': column.styles['grid-table-cell'].width}
				}
			}

		});

		//region assemble body rows
		portfoliosRegistersList.forEach((register, index) => {

			const rowObj = metaHelper.recursiveDeepCopy(relationInstrumentsGtData.templateRow, true);

			rowObj.key = register.user_code;
			rowObj.order = index;
			rowObj.newRow = !!(rowObj.frontOptions && rowObj.frontOptions.newRow);

			let nameToShow = $scope.$parent.vm.nameToShow;
			console.log("testing1 nameToShow", nameToShow);
			const relName = rowObj.columns.find(col => col.key === 'relationName');
			relName.settings.value = register[nameToShow];

			const instrument = rowObj.columns.find(col => col.key === 'instrument');
			instrument.settings.value = register.linked_instrument_object.short_name;

			const valCurrency = rowObj.columns.find(col => col.key === 'valuationCurrency');
			valCurrency.settings.value = register.linked_instrument_object.short_name;

			/*if (register.valuation_pricing_policy) { // need to fix backend
				const valPp = rowObj.columns.find(col => col.key === 'valuationPricingPolicy');
				valPp.settings.value = register.valuation_pricing_policy_object.short_name;
			}*/

			relationInstrumentsGtData.body.push(rowObj);

		});
		//endregion
		console.log("testing1 createDataForRelInstrGt gtData", relationInstrumentsGtData);
		vm.relInstrGtDataService.setTableData(relationInstrumentsGtData);

	};

	const init = function () {

		vm.relInstrGtDataService = new GridTableDataService();
		vm.relInstrGtEventService = new GridTableEventService();

		loadPrtfRegisters().then((prList) => {

			portfoliosRegistersList = prList;
			createDataForRelInstrGt();

			vm.readyStatus = true;

			$scope.$apply();

		});

	};

	init();

};