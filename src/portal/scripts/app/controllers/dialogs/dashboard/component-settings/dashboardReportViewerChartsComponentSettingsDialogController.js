/**
 * Created by mevstratov on 06.01.2020.
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

        var availableAttrs = vm.item.data.user_settings.available_attrs_keys;
        var availableNumericAttrs = vm.item.data.user_settings.available_numeric_attrs_keys;

        vm.chartType = vm.item.data.type;

        if (vm.chartType === "report_viewer_bars_chart") {

            if (vm.item.data.settings.bars_direction === 'bottom-top') {
                vm.barsNamesAttrSelectorTitle = 'Bars Names (Abscissa)';
                vm.barsNumbersAttrSelectorTitle = 'Bars Numbers (Ordinate)'
            } else {
                vm.barsNamesAttrSelectorTitle = 'Bars Names (Ordinate)';
                vm.barsNumbersAttrSelectorTitle = 'Bars Numbers (Abscissa)';
            }

        }

        var getAttributes = function () {

            var attributes = attributeDataService.getAllAttributesByEntityType(vm.entityType);

            var numericAttributes = attributeDataService.getAllAttributesByEntityType(vm.entityType).filter(function (item) {
                return item.value_type === 20;
            });

            if (availableAttrs && availableAttrs.length > 0) {
                vm.availableAttrs = attributes.filter(function (item) {
                    return availableAttrs.indexOf(item.key) !== -1;
                });
            }

            if (availableNumericAttrs && availableNumericAttrs.length > 0) {
                vm.availableNumericAttrs = numericAttributes.filter(function (item) {
                    return availableNumericAttrs.indexOf(item.key) !== -1;
                });
            }

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {item: vm.item}});
        };

        getAttributes();
    }

}());