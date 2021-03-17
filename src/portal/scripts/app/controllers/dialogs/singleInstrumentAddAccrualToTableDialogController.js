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
        // vm.readyStatus = false;

        const multitypeFieldsForRows = {
            'accrual_start_date': {
                nativeType: 40, //date
                fieldDataList: [
                    {
                        'model': null,
                        'fieldType': 'dateInput',
                        'isDefault': false,
                        'isActive': false,
                        'sign': '<div class="multitype-field-type-letter">A</div>',
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
                        'fieldData': {
                            'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
                        }
                    }
                ]
            },
            'first_payment_date': {
                nativeType: 40, //date
                fieldDataList: [
                    {
                        'model': null,
                        'fieldType': 'dateInput',
                        'isDefault': false,
                        'isActive': false,
                        'sign': '<div class="multitype-field-type-letter">A</div>',
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
                        'fieldData': {
                            'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
                        }
                    }
                ]
            },
            'accrual_size': {
                nativeType: 20, //number
                fieldDataList: [
                    {
                        'model': null,
                        'fieldType': 'numberInput',
                        'isDefault': false,
                        'isActive': false,
                        'sign': '<div class="multitype-field-type-letter">A</div>',
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
                        'fieldData': {
                            'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
                        }
                    }
                ]
            },
            'periodicity_n': {
                nativeType: 20, //number
                fieldDataList: [
                    {
                        'model': null,
                        'fieldType': 'numberInput',
                        'isDefault': false,
                        'isActive': false,
                        'sign': '<div class="multitype-field-type-letter">A</div>',
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
                        'fieldData': {
                            'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
                        }
                    }
                ]
            }
        }

        vm.fieldsObject = {};

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            $mdDialog.hide({
                status: 'agree', data: {
                    accrual: vm.accrual
                }
            });

        };

        const setSelectorItemsToMultiTypeFields = function (instrumentAttrTypes) {

            Object.keys(multitypeFieldsForRows).forEach(key => {

                const fieldTypeObj = multitypeFieldsForRows[key];

                const selTypeIndex = fieldTypeObj.fieldDataList.findIndex(type => type.fieldType === 'dropdownSelect');

                const formattedAttrTypes = instrumentAttrTypes
                    .filter(attrType => attrType.value_type === fieldTypeObj.nativeType)
                    .map(attrType => {
                        return {id: attrType.user_code, name: attrType.short_name};
                    });

                fieldTypeObj.fieldDataList[selTypeIndex].fieldData = {
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
            const multitypeFieldData = multitypeFieldsForRows[item.key].fieldDataList;

            let selectedIndex = 0;
            if (item.default_value_type === 'dynamic_attribute') {
                selectedIndex = 1;
            }

            multitypeFieldData[selectedIndex].isDefault = true;
            multitypeFieldData[selectedIndex].isActive = true;

            multitypeFieldData[0].model =  vm.accrual[item.key];
            multitypeFieldData[1].model =  vm.accrual[item.key];

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

                if (item.default_value_type) { // multiType field

                    setActiveMultiTypeState(item);

                }

            });

            // vm.readyStatus = true;

        }

        init();

    }
}());