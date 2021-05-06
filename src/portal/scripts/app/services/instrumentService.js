/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

	const gridTableEvents = require('./gridTableEvents');

	const uiService = require('./uiService');

	const GridTableHelperService = require('../helpers/gridTableHelperService');
	const gridTableHelperService = new GridTableHelperService();
	const MultitypeFieldService = require('../services/multitypeFieldService');
	const multitypeFieldService = new MultitypeFieldService();

	const evEditorEvents = require('./ev-editor/entityViewerEditorEvents');

	const instrumentRepository = require('../repositories/instrumentRepository');

	const getList = function (options) {
        return instrumentRepository.getList(options);
    };

	const getListLight = function (options) {
        return instrumentRepository.getListLight(options);
    };

	const getByKey = function (id) {
        return instrumentRepository.getByKey(id);
    };

	const create = function(instrument) {
        return instrumentRepository.create(instrument);
    };

	const update = function(id, instrument) {
        return instrumentRepository.update(id, instrument);
    };

	const patch = function (id, data) {
        return instrumentRepository.patch(id, data);
    };

	const deleteByKey = function (id) {
        return instrumentRepository.deleteByKey(id);
    };

	const updateBulk = function(instruments) {
        return instrumentRepository.updateBulk(instruments);
    };

	const deleteBulk = function(data){
        return instrumentRepository.deleteBulk(data);
    };

	/**
	 * Initiate accrual table event listeners
	 *
	 * @param gridTableDataService {Object}
	 * @param gridTableEventService {Object}
	 * @param entity {Object} - data of entity
	 * @param evEditorEventService {Object}
	 * @param tableChangeObj {Object} - mutating object that helps to determine which of multiple accrual tables changed
	 */
	const initAccrualsScheduleGridTableEvents = function (gridTableDataService, gridTableEventService, entity, evEditorEventService, tableChangeObj) {

		const tableChangeArgObj = {
			key: 'accrual_calculation_schedules'
		};

		/* gridTableEventService.addEventListener(gridTableEvents.ROW_ADDED, function () {

			const gridTableData = gridTableDataService.getTableData();

			const newRow = gridTableData.body[0];
			const newSchedule = {
				"accrual_start_date": '',
				"first_payment_date": '',
				"accrual_size": '',
				"accrual_calculation_model": '',
				"periodicity": '',
				"periodicity_n": '',
				"notes": '',
				frontOptions: {newRow: true, gtKey: newRow.key}
			};

			entity.accrual_calculation_schedules.unshift(newSchedule);

			// Update rows in schedules grid table
			entity.accrual_calculation_schedules.forEach((schedule, scheduleIndex) => {
				gridTableData.body[scheduleIndex].order = scheduleIndex;
			});

			tableChangeObj.value = true;
			evEditorEventService.dispatchEvent(evEditorEvents.TABLE_CHANGED, tableChangeArgObj);

		}); */

		gridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argObj) {

			var rowOrder = argObj.row.order,
				colOrder = argObj.column.order,
				cell = gridTableDataService.getCell(rowOrder, colOrder);

			gridTableHelperService.onGridTableCellChange(
				entity.accrual_calculation_schedules,
				gridTableDataService,
				rowOrder, colOrder
			);

			/*if (cell.cellType === 'multitypeField') {

				var activeType = cell.settings.fieldTypesData.find(type => type.isActive);
				if (!activeType) activeType = cell.settings.fieldTypesData.find(type => type.isDefault);

				metaHelper
				entity.accrual_calculation_schedules[rowOrder][cell.key + '_value_type'] = activeType.value_type;

			}*/

			tableChangeObj.value = true;
			const cellValChangeArgObj = tableChangeArgObj;

			evEditorEventService.dispatchEvent(evEditorEvents.TABLE_CHANGED, cellValChangeArgObj);

		});

		gridTableEventService.addEventListener(gridTableEvents.ROW_DELETED, function (argObj) {

			entity.accrual_calculation_schedules = entity.accrual_calculation_schedules.filter(schedule => {

				var scheduleId = schedule.id || schedule.frontOptions.gtKey;
				return !argObj.deletedRowsKeys.includes(scheduleId);

			});

			tableChangeObj.value = true;
			evEditorEventService.dispatchEvent(evEditorEvents.TABLE_CHANGED, tableChangeArgObj);

		});

	};

	const getEditLayoutBasedOnUserCodes = function (userCodes) {

		if (userCodes && userCodes.length) {

			var userCodesList = (typeof userCodes === 'string') ? userCodes.split(',') : userCodes;

			return new Promise(async (resolve, reject) => {

				var userCode;

				for (userCode of userCodesList) {

					try {
						var editLayoutData = await uiService.getEditLayoutByUserCode('instrument', userCode);

					} catch (error) {
						reject(error);
						break;
					}

					if (editLayoutData.results.length) {
						resolve(editLayoutData);
						break;
					}

				}

				uiService.getDefaultEditLayout('instrument').then(data => resolve(data)).catch(error => reject(error));

			});

		}

		return uiService.getDefaultEditLayout('instrument');

	};

	const getInstrumentAccrualsMultitypeFieldsData = () => {
		return {
			'accrual_start_date': {
				value_type: 40, // used to filter instrument user attributes options for dropdownSelect
				fieldTypesList: [
					{
						'model': "",
						'fieldType': 'dateInput',
						'isDefault': true,
						'isActive': false,
						'sign': '<div class="multitype-field-type-letter type-with-constant">D</div>',
						'value_type': 40,
						'fieldData': {
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					},
					{
						'model': null,
						'fieldType': 'dropdownSelect',
						'isDefault': false,
						'isActive': false,
						'sign': '<div class="multitype-field-type-letter">L</div>',
						'value_type': 70,
						'fieldData': {
							'menuOptions': [],
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					}
				]
			},
			'first_payment_date': {
				value_type: 40, // used to filter instrument user attributes options for dropdownSelect
				fieldTypesList: [
					{
						'model': null,
						'fieldType': 'dateInput',
						'isDefault': true,
						'isActive': false,
						'sign': '<div class="multitype-field-type-letter type-with-constant">D</div>',
						'value_type': 40,
						'fieldData': {
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					},
					{
						'model': null,
						'fieldType': 'dropdownSelect',
						'isDefault': false,
						'isActive': false,
						'sign': '<div class="multitype-field-type-letter">L</div>',
						'value_type': 70,
						'fieldData': {
							'menuOptions': [],
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					}
				]
			},
			'accrual_size': {
				value_type: 20, // used to filter instrument user attributes options for dropdownSelect
				fieldTypesList: [
					{
						'model': null,
						'fieldType': 'numberInput',
						'isDefault': true,
						'isActive': false,
						'sign': '<div class="multitype-field-type-letter type-with-constant">N</div>',
						'value_type': 20,
						'fieldData': {
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					},
					{
						'model': null,
						'fieldType': 'dropdownSelect',
						'isDefault': false,
						'isActive': false,
						'sign': '<div class="multitype-field-type-letter">L</div>',
						'value_type': 70,
						'fieldData': {
							'menuOptions': [],
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					}
				]
			},
			'periodicity_n': {
				value_type: 20, // used to filter instrument user attributes options for dropdownSelect
				fieldTypesList: [
					{
						'model': null,
						'fieldType': 'numberInput',
						'isDefault': true,
						'isActive': false,
						'sign': '<div class="multitype-field-type-letter type-with-constant">N</div>',
						'value_type': 20,
						'fieldData': {
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					},
					{
						'model': null,
						'fieldType': 'dropdownSelect',
						'isDefault': false,
						'isActive': false,
						'sign': '<div class="multitype-field-type-letter">L</div>',
						'value_type': 70,
						'fieldData': {
							'menuOptions': [],
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					}
				]
			}
		};
	};

	const getInstrumentEventsMultitypeFieldsData = () => {
		return {
			'effective_date': {
				value_type: 40, // used to filter instrument user attributes options for dropdownSelect
				fieldTypesList: [
					{
						'model': "",
						'fieldType': 'dateInput',
						'isDefault': true,
						'isActive': true,
						'sign': '<div class="multitype-field-type-letter type-with-constant">D</div>',
						'value_type': 40,
						'fieldData': {
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					},
					{
						'model': null,
						'fieldType': 'dropdownSelect',
						'isDefault': false,
						'isActive': false,
						'sign': '<div class="multitype-field-type-letter">L</div>',
						'value_type': 70,
						'fieldData': {
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					}
				]
			},
			'final_date': {
				value_type: 40, // used to filter instrument user attributes options for dropdownSelect
				fieldTypesList: [
					{
						'model': "",
						'fieldType': 'dateInput',
						'isDefault': true,
						'isActive': true,
						'sign': '<div class="multitype-field-type-letter type-with-constant">D</div>',
						'value_type': 40,
						'fieldData': {
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					},
					{
						'model': null,
						'fieldType': 'dropdownSelect',
						'isDefault': false,
						'isActive': false,
						'sign': '<div class="multitype-field-type-letter">L</div>',
						'value_type': 70,
						'fieldData': {
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					}
				]
			},
			'periodicity_n': {
				value_type: 20, // used to filter instrument user attributes options for dropdownSelect
				fieldTypesList: [
					{
						'model': null,
						'fieldType': 'numberInput',
						'isDefault': true,
						'isActive': true,
						'sign': '<div class="multitype-field-type-letter type-with-constant">N</div>',
						'value_type': 20,
						'fieldData': {
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					},
					{
						'model': null,
						'fieldType': 'dropdownSelect',
						'isDefault': false,
						'isActive': false,
						'sign': '<div class="multitype-field-type-letter">L</div>',
						'value_type': 70,
						'fieldData': {
							'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
						}
					}
				]
			}
		};
	};

	const updateMultitypeFieldSelectorOptionsInsideGridTable = function (instrumentAttributeTypes, multitypeFieldsObj, gridTableData) {

		multitypeFieldService.fillSelectorOptionsBasedOnValueType(instrumentAttributeTypes, multitypeFieldsObj);

		gridTableData.body.forEach(row => {

			row.columns.forEach(cell => {

				if (cell.cellType === 'multitypeField') {

					let selectorData = cell.settings.fieldTypesData.find(type => type.fieldType === 'dropdownSelect');
					const defaultSelectorData = multitypeFieldsObj[cell.key].fieldTypesList.find(type => type.fieldType === 'dropdownSelect');

					selectorData.fieldData.menuOptions = defaultSelectorData.fieldData.menuOptions;

				}

			});

		});

	};

    module.exports = {
        getList: getList,
        getListLight: getListLight,
        getByKey: getByKey,
        create: create,
        update: update,
        patch: patch,
        deleteByKey: deleteByKey,

        updateBulk: updateBulk,
        deleteBulk: deleteBulk,

		initAccrualsScheduleGridTableEvents: initAccrualsScheduleGridTableEvents,
		getInstrumentAccrualsMultitypeFieldsData: getInstrumentAccrualsMultitypeFieldsData,
		getInstrumentEventsMultitypeFieldsData: getInstrumentEventsMultitypeFieldsData,
		updateMultitypeFieldSelectorOptionsInsideGridTable: updateMultitypeFieldSelectorOptionsInsideGridTable,

		getEditLayoutBasedOnUserCodes: getEditLayoutBasedOnUserCodes,

    }


}());