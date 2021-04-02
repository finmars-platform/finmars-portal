/**
 * Created by vzubr on 08.03.2021.
 */
(function () {
    'use strict';

    const metaHelper = require('../../helpers/meta.helper');

    module.exports = function singleInstrumentAddAccrualToTableDialogController ($scope, $mdDialog, gridTableHelperService, multitypeFieldService, data) {

        var vm = this;

        vm.title = data.accrualScheme.data.form_message;
        vm.fields = data.accrualScheme.data.items;
        vm.entity = data.entity;
        vm.accrual = {};

        const multitypeFieldsData = multitypeFieldService.getTypesForInstrumentAccruals();
		const attrTypes = data.attributeTypes;

		vm.fieldsObject = {};

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            // vm.accrual does not contain data from multitype fields.
            // Need to collect it from multitypeFieldsData
            Object.keys(vm.accrual).forEach(key => {

            	if (multitypeFieldsData.hasOwnProperty(key)) {

					let modelValue = null;
					let valueType;

					if (vm.fieldsObject[key].to_show) {

						const activeType = vm.fieldsObject[key].fieldTypes.find(type => type.isActive);

						modelValue = activeType.model;
						valueType = activeType.value_type;

					}

					else {
						const defaultType = vm.fieldsObject[key].fieldTypes.find(type => type.isDefault);
						valueType = defaultType.value_type;
					}

					const valueTypeKey = `${key}_value_type`;

                    vm.accrual[key] = modelValue;
                    vm.accrual[valueTypeKey] = valueType;

                }

            })

            $mdDialog.hide({
                status: 'agree',
				data: {
                    accrual: vm.accrual
                }
            });

        };

        const setMultitypeFieldTypesData = function (item) {

			multitypeFieldsData[item.key].fieldTypesList.forEach(type => {

				type.label = item.override_name || item.name;

				if (item.tooltip) type.fieldData.tooltipText = item.tooltip;

			});

		};

        const formatOptionsForSelector = function (item) {

            const mapOptions = function (item) {
                return {
                    user_code: item.user_code,
                    id: item.id,
                    name: item.override_name || item.name,
                };
            };

            item.selectorOptions = item.options_settings
                .filter(it => it.to_show || item.default_value === it.id) // all to_show fields and default value field
                .map(mapOptions);

        };

        /* const setActiveMultiTypeState = function (item) {
            const multitypeFieldData = multitypeFieldsData[item.key];

            let selectedIndex = 0;
            if (item.default_value_type === 'dynamic_attribute') { // TODO old format
                selectedIndex = 1;
            }

            multitypeFieldData[selectedIndex].isDefault = true;
            multitypeFieldData[selectedIndex].isActive = true;

            multitypeFieldData[selectedIndex].model =  vm.accrual[item.key];

            vm.fieldsObject[item.key].multitypeFieldData = multitypeFieldData;
        };

		const prepareDataForMultitypeField = function (item) {

			const fieldData = multitypeFieldsData[item.key].fieldTypesList;

			fieldData.forEach(type => {

				type.is_active = false;

				if (type.value_type === item.default_value_type) {

					type.is_active = true;
					type.model = item.default_value;

				}

			});

			vm.fieldsObject[item.key].fieldTypes = fieldData;

		}; */

        const init = function () {

			// const instrumentAttrTypes = vm.entity.attributes.map(attr => attr.attribute_type_object);
			multitypeFieldService.fillSelectorOptionsBasedOnValueType(attrTypes, multitypeFieldsData);

            vm.fields.forEach(item => {

            	vm.accrual[item.key] = item.default_value || null;
				vm.fieldsObject[item.key] = item;

                if (item.defaultValueType === 'selector') formatOptionsForSelector(item);

                if (item.defaultValueType === 'multitypeField') { // multiType field

					setMultitypeFieldTypesData(item);
                    /* const typeKey = `${item.key}_value_type`;

					const fieldTypeObj = multitypeFieldsData[item.key];
					const notSelType = fieldTypeObj.find(type => type.fieldType !== 'dropdownSelect');

					vm.accrual[typeKey] = notSelType.value_type;

                    setActiveMultiTypeState(item); */
					const typesList = multitypeFieldsData[item.key].fieldTypesList;
					multitypeFieldsData[item.key].fieldTypesList = multitypeFieldService.setActiveTypeByValueType(typesList, item.default_value, item.default_value_type);

					vm.fieldsObject[item.key].fieldTypes = multitypeFieldsData[item.key].fieldTypesList;
					// prepareDataForMultitypeField(item);

                }

            });

        }

        init();

    }
}());