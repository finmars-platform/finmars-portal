/**
 * Created by mevstratov on 08.01.2020.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, item, attributeDataService) {

        var vm = this;

        vm.item = JSON.parse(JSON.stringify(item));
        vm.entityType = vm.item.data.settings.entity_type;

        if (!vm.item.data.user_settings) {
            vm.item.data.user_settings = {};
        }

        vm.abscissaSearchTerm = '';
        vm.ordinateSearchTerm = '';
        vm.abscissaSearchTerm = '';

        vm.availableAbscissaAttrs = vm.item.data.user_settings.available_abscissa_keys;
        vm.availableOrdinateAttrs = vm.item.data.user_settings.available_ordinate_keys;
        vm.availableValueAttrs = vm.item.data.user_settings.available_value_keys;

        vm.getSelectName = function (attr) {
            if (attr.layout_name) {
                return attr.layout_name;
            }

            return attr.attribute_data.name;
        };

        var selectFilterComparator = function (item, searchTerms) {
            if (item && searchTerms) {
                var optionName;

                if (item.layout_name) {
                    optionName = item.layout_name.toLowerCase();
                } else if (item.attribute_data) {
                    optionName = item.attribute_data.name.toLowerCase();
                }

                return optionName.indexOf(searchTerms.toLowerCase()) !== -1;
            }

            return true;
        };

        vm.abscissaFilterExpr = function (item) {
            return selectFilterComparator(item, vm.abscissaSearchTerm);
        };

        vm.ordinateFilterExpr = function (item) {
            return selectFilterComparator(item, vm.ordinateSearchTerm);
        };

        vm.valuesFilterExpr = function (item) {
            return selectFilterComparator(item, vm.valuesSearchTerm);
        };

        /*var getAttributes = function () {

            var attributes = attributeDataService.getAllAttributesByEntityType(vm.entityType);

            var numericAttrs = attributeDataService.getAllAttributesByEntityType(vm.entityType).filter(function (item) {
                return item.value_type === 20;
            });

            if (availableAbscissaAttrs && availableAbscissaAttrs.length > 0) {
                vm.availableAbscissaAttrs = attributes.filter(function (item) {
                    return availableAbscissaAttrs.indexOf(item.key) !== -1;
                });
            }

            if (availableOrdinateAttrs && availableOrdinateAttrs.length > 0) {
                vm.availableOrdinateAttrs = attributes.filter(function (item) {
                    return availableOrdinateAttrs.indexOf(item.key) !== -1;
                });
            }

            if (availableValueAttrs && availableValueAttrs.length > 0) {
                vm.availableValueAttrs = numericAttrs.filter(function (item) {
                    return availableValueAttrs.indexOf(item.key) !== -1;
                });
            }

        };*/

        vm.openNumberFormatSettings = function($event) {

            $mdDialog.show({
                controller: 'NumberFormatSettingsDialogController as vm',
                templateUrl: 'views/dialogs/number-format-settings-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                locals: {
                    data: {
                        settings: vm.item.data.settings.number_format
                    }
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.item.data.settings.number_format = res.data.settings;

                }

            });

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {item: vm.item}});
        };

        // getAttributes();
    }

}());