(function () {

	"use strict";

	module.exports = function () {

		const getTypesForInstrumentAccruals = function () {
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
								'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
							}
						}
					]
				}
			};
		};

		const fillSelectorOptionsBasedOnValueType = function (instrumentAttrTypes, multitypeFields) {

			Object.keys(multitypeFields).forEach(key => {

				const fieldData = multitypeFields[key];

				/* const selTypeIndex = fieldTypeObj.findIndex(type => type.fieldType === 'dropdownSelect');
				const notSelType = fieldTypeObj.find(type => type.fieldType !== 'dropdownSelect'); */
				const selectorType = fieldData.fieldTypesList.find(type => type.fieldType === 'dropdownSelect');

				const formattedAttrTypes = instrumentAttrTypes
					.filter(attrType => {
						return attrType.value_type === fieldData.value_type && !attrType.can_recalculate;
					})
					.map(attrType => {
						return {id: attrType.user_code, name: attrType.short_name};
					});

				/* fieldTypesList[selTypeIndex].fieldData = {
					menuOptions: formattedAttrTypes || []
				}; */
				selectorType.fieldData = {
					menuOptions: formattedAttrTypes || []
				};

			});

		};

		/**
		 *
		 * @param typesList {Array.<Object>} - array of types for multitype field
		 * @param modelValue {*} - value of field
		 * @param activeValueType {number} - value type of active field
		 */
		const setActiveTypeByValueType = (typesList, modelValue, activeValueType) => {

			if (activeValueType) {

				typesList.forEach(type => {

					if (type.value_type === activeValueType) {

						type.model = modelValue;
						type.isActive = true;

					} else {
						type.isActive = false;
					}

				});

			}

			return typesList;

		};

		return {
			getTypesForInstrumentAccruals: getTypesForInstrumentAccruals,

			fillSelectorOptionsBasedOnValueType: fillSelectorOptionsBasedOnValueType,
			setActiveTypeByValueType: setActiveTypeByValueType
		};

	};

}());