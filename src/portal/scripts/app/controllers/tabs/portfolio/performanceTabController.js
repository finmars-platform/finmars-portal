'use strict';

const metaService = require('../../../services/metaService');
const portfolioRegisterService = require('../../../services/portfolioRegisterService');
const instrumentService = require('../../../services/instrumentService');
const pricingPolicyService = require('../../../services/pricingPolicyService');

const GridTableDataService = require('../../../services/gridTableDataService');
const EventService = require('../../../services/eventService');

const popupEvents = require('../../../services/events/popupEvents');

const metaHelper = require('../../../helpers/meta.helper');

export default function PortfolioPerformanceTabController ($scope, $state, $mdDialog, commonDialogsService, toastNotificationService) {

	const vm = this;

	vm.entity = $scope.$parent.vm.entity;
	vm.readyStatus = false;

	vm.raPopupX = {
		value: null
	};
	vm.raPopupY = {
		value: null
	};

	let portfoliosRegistersList = [];

	vm.addNewRelInstr = function ($event) {
		$mdDialog.show({
			controller: 'PortfolioRegisterDialogController as vm',
			templateUrl: 'views/dialogs/portfolio-register-dialog-view.html',
			parent: document.querySelector('.dialog-containers-wrap'),
			targetEvent: $event,
			locals: {
				data: {
					title: 'Create related instrument',
				}
			}

		}).then(res => {

			if (res.status === 'agree') {

			}
		});
	};

	vm.rowActionsPopupData = {
		row: null,
		options: [
			{
				key: 'open_instrument',
				name: "Go to instrument detail page",
				icon: "article",
				onClick: function (option, _$popup) {

					_$popup.cancel();

					const registerUc = vm.rowActionsPopupData.row.key;
					const register = portfoliosRegistersList.find(register => register.user_code === registerUc);

					const url = $state.href('app.portal.data.instrument', {entity: register.linked_instrument_object.id});

					window.open(url, '_blank');

					vm.rowActionsPopupData.row = null;

				},
			},
			{
				key: "delete",
				name: "Delete instrument and relation",
				icon: "delete",
				onClick: function (option, _$popup) {
					_$popup.cancel();

					commonDialogsService.warning({
						warning: {
							title: "Warning",
							description: "Instrument and it's relation to portfolio will be deleted. Are you sure?"
						}
					}).then(res => {

						if (res.status === 'agree') {

							const registerUc = vm.rowActionsPopupData.row.key;
							const regIndex = portfoliosRegistersList.findIndex(register => register.user_code === registerUc);
							const register = portfoliosRegistersList[regIndex];

							const instrName = register.linked_instrument_object.short_name;

							portfolioRegisterService.deleteByKey(register.id).then(() => {

								toastNotificationService.success(`Instrument ${instrName} and it's relation to portfolio ${vm.entity.short_name} were deleted.`);
								portfoliosRegistersList.splice(regIndex, 1);

								vm.relInstrGtDataService.deleteRows(vm.rowActionsPopupData.row);

								$scope.$apply();
								console.log("testing1 portfoliosRegistersList", portfoliosRegistersList, relationInstrumentsGtData);
							});

							vm.rowActionsPopupData.row = null;

							/* if (rowData.newRow) {
								// remove newly created register

							}
							else {

								portfolioRegisterService.deleteByKey(register.id);
								instrumentService.deleteByKey(register.linked_instrument);

								if (register.valuation_pricing_policy) {
									pricingPolicyService.deleteByKey(register.valuation_pricing_policy);
								}

							} */

						}

					});
				},
			},
		]
	};

	const openRowActionsPopup = function ($event, rowData) {
		console.log("testing1 openRowActionsPopup rowData", rowData);
		vm.raPopupX.value = $event.clientX;
		vm.raPopupY.value = $event.clientY;
		console.log("testing1 openRowActionsPopup rowActionsPopupData.row", vm.rowActionsPopupData.row);
		console.log("testing1 openRowActionsPopup coords", vm.raPopupX, vm.raPopupY);

		vm.rowActionsPopupData.row = rowData;
		vm.rowActionsPopupEventService.dispatchEvent(popupEvents.OPEN_POPUP, {doNotUpdateScope: true});

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
					},
					methods: {
						onClick: openRowActionsPopup
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

				prData = prData.filter(register => register.portfolio === vm.entity.id);

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
		vm.relInstrGtEventService = new EventService();

		vm.rowActionsPopupEventService = new EventService();

		loadPrtfRegisters().then((prList) => {

			portfoliosRegistersList = prList;
			createDataForRelInstrGt();

			vm.readyStatus = true;

			$scope.$apply();

		});

	};

	init();

};