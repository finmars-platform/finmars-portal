/**
 * Created by vzubr on 08.03.2021.
 */
(function () {
    'use strict'
    module.exports = function singleInstrumentAddAccrualToTableDialogController ($scope, $mdDialog, gridTableHelperService, data) {

        var vm = this;

        vm.accrualScheme = data.accrualScheme;

        vm.title = data.accrualScheme.data.form_message;
        vm.fields = data.accrualScheme.data.items;

        vm.accrual = {};

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

        const mapOptions = function (item) {
            return {
                user_code: item.user_code,
                id: item.id,
                name: item.override_name || item.name,
            };
        };

        const init = function () {

            vm.fields.forEach(field => {

                vm.accrual[field.key] = field.default_value || null;

                if (field.defaultValueType === 'selector') {

                    field.selectorOptions = field.options_settings
                        .filter(item => item.to_show || field.default_value === item.id)
                        .map(mapOptions);
                }

            });

        }

        init();

    }
}());