/**
 * Created by vzubr on 08.03.2021.
 */
(function () {
    'use strict';

    module.exports = function singleInstrumentAddAccrualToTableDialogController ($scope, $mdDialog, gridTableHelperService, data) {

        var vm = this;

        vm.title = data.accrualScheme.data.form_message;
        vm.fields = data.accrualScheme.data.items;
        vm.entity = data.entity;
        vm.accrual = {};

        const multitypeFieldsForRows = {
            'accrual_start_date': [
                    {
                        'model': null,
                        'fieldType': 'dateInput',
                        'isDefault': false,
                        'isActive': false,
                        'sign': '<div class="multitype-field-type-letter">A</div>',
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
                ],
            'first_payment_date': [
                    {
                        'model': null,
                        'fieldType': 'dateInput',
                        'isDefault': false,
                        'isActive': false,
                        'sign': '<div class="multitype-field-type-letter">A</div>',
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
                ],
            'accrual_size': [
                    {
                        'model': null,
                        'fieldType': 'numberInput',
                        'isDefault': false,
                        'isActive': false,
                        'sign': '<div class="multitype-field-type-letter">A</div>',
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
                ],
            'periodicity_n': [
                    {
                        'model': null,
                        'fieldType': 'numberInput',
                        'isDefault': false,
                        'isActive': false,
                        'sign': '<div class="multitype-field-type-letter">A</div>',
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

        vm.fieldsObject = {};

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            // vm.accrual not contains data from multi type fields.
            // I need collect them from multitypeFieldsForRows
            Object.keys(vm.accrual).forEach(key => {
                if (multitypeFieldsForRows.hasOwnProperty(key)) {

                    const activeType = multitypeFieldsForRows[key].find(field => field.isActive)
                    const typeKey = `${key}_value_type`;

                    vm.accrual[key] = activeType.model;
                    vm.accrual[typeKey] = activeType.value_type;

                }
            })

            $mdDialog.hide({
                status: 'agree', data: {
                    accrual: vm.accrual
                }
            });

        };

        const setSelectorItemsToMultiTypeFields = function (instrumentAttrTypes) {

            Object.keys(multitypeFieldsForRows).forEach(key => {

                const fieldTypeObj = multitypeFieldsForRows[key];

                const selTypeIndex = fieldTypeObj.findIndex(type => type.fieldType === 'dropdownSelect');
                const notSelType = fieldTypeObj.find(type => type.fieldType !== 'dropdownSelect');

                const formattedAttrTypes = instrumentAttrTypes
                    .filter(attrType => attrType.value_type === notSelType.value_type)
                    .map(attrType => {
                        return {id: attrType.user_code, name: attrType.short_name};
                    });

                fieldTypeObj[selTypeIndex].fieldData = {
                    menuOptions: formattedAttrTypes || []
                };

            });

        };

        const setSelectorItemsToSelectors = function (item) {

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

        const setActiveMultiTypeState = function (item) {
            const multitypeFieldData = multitypeFieldsForRows[item.key];

            let selectedIndex = 0;
            if (item.default_value_type === 'dynamic_attribute') { // TODO old format
                selectedIndex = 1;
            }

            multitypeFieldData[selectedIndex].isDefault = true;
            multitypeFieldData[selectedIndex].isActive = true;

            multitypeFieldData[selectedIndex].model =  vm.accrual[item.key];

            vm.fieldsObject[item.key].multitypeFieldData = multitypeFieldData;
        };

        const init = function () {

            const instrumentAttrTypes = vm.entity.attributes.map(attr => attr.attribute_type_object);
            setSelectorItemsToMultiTypeFields(instrumentAttrTypes);

            vm.fields.forEach(item => {

                vm.accrual[item.key] = item.default_value || null;
                vm.fieldsObject[item.key] = item;

                if (item.defaultValueType === 'selector') {

                    setSelectorItemsToSelectors(item);

                }

                if (item.defaultValueType === 'multitypeField') { // multiType field

                    const typeKey = `${item.key}_value_type`;

                    if (item.default_value_type === 'text') {

                        const fieldTypeObj = multitypeFieldsForRows[item.key];
                        const notSelType = fieldTypeObj.find(type => type.fieldType !== 'dropdownSelect');

                        vm.accrual[typeKey] = notSelType.value_type;

                    } else if (item.default_value_type === 'dynamic_attribute' ) {

                        vm.accrual[typeKey] = 70; // user attribute

                    }

                    setActiveMultiTypeState(item);

                }

            });
        }

        init();

    }
}());