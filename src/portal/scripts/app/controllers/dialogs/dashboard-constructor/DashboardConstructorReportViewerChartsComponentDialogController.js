(function () {

    'use strict';

    var uiService = require('../../../services/uiService');

    module.exports = function ($scope, $mdDialog, item, dataService, eventService, attributeDataService) {

        var vm = this;

        vm.newFilter = {};

        vm.filterLinks = [];

        vm.barsNamesAttrSelectorTitle = '';
        vm.barsNumbersAttrSelectorTitle = '';

        vm.multiselectModalName = 'Fields multiselector';

        if (item) {
            vm.item = item;
        } else {
            vm.item = {
                type: null,
                id: null, // should be generated before create
                name: '',
                settings: {}
            }
        }

        vm.componentsTypes = [];

        vm.layouts = [];

        var deleteChartTypeBasedProps = function () {
            delete vm.item.settings.bar_name_key;
            delete vm.item.settings.bar_number_key;
            delete vm.item.settings.min_bar_width;
            delete vm.item.settings.max_bar_width;
            delete vm.item.settings.group_number_calc_formula;
            delete vm.item.settings.sorting_value_type;
            delete vm.item.settings.sorting_type;
            delete vm.item.settings.crop_tick_text;
            delete vm.item.settings.auto_refresh;
            delete vm.item.settings.tooltip_font_size;
            // properties for pie chart
            //delete vm.item.settings.fieldsKeys;
            delete vm.item.settings.group_attr;
            delete vm.item.settings.number_attr;
            delete vm.item.settings.show_legends;
            delete vm.item.settings.legends_position;
            delete vm.item.settings.legends_columns_number;
        };

        vm.reportTypeChange = function() {

            vm.item.settings.layout = null;
            vm.item.settings.linked_components= {};

            deleteChartTypeBasedProps();

            switch (vm.item.type) {
                case 'report_viewer_bars_chart':
                    vm.item.settings.bar_name_key = null;
                    vm.item.settings.bar_number_key = null;
                    vm.item.settings.group_number_calc_formula = 1;
                    vm.item.settings.autocalc_ticks_number = true;
                    vm.item.settings.bars_sorting = false;
                    break;
                case 'report_viewer_pie_chart':
                    vm.item.settings.group_attr = '';
                    vm.item.settings.number_attr = '';
                    vm.item.settings.group_number_calc_formula = 1;
                    vm.item.settings.show_legends = false;
                    vm.item.settings.legends_position = 'right';
                    vm.item.settings.legends_columns_number = 1;
                    break;
            }

            vm.getAttributes();

        };

        vm.getAttributes = function() {

            vm.attributes = attributeDataService.getAllAttributesByEntityType(vm.item.settings.entity_type);
            vm.numericAttributes = attributeDataService.getAllAttributesByEntityType(vm.item.settings.entity_type).filter(function (item) {
                return item.value_type === 20;
            });

            /*vm.numericAttributesForMultiselect = vm.numericAttributes.map(function (item) {
                return {name: item.name, id: item.key}
            });*/

        };

        vm.chartTypeChanged = function () {

            deleteChartTypeBasedProps();

            switch (vm.item.type) {
                case 'report_viewer_bars_chart':
                    vm.item.settings = {
                        bar_name_key: '',
                        bar_number_key: '',
                        bars_direction: 'bottom-top',
                        group_number_calc_formula: 1,
                        min_bar_width: 50,
                        max_bar_width: 90,
                        bars_sorting: false,
                        sorting_value_type: null,
                        sorting_type: null,
                        autocalc_ticks_number: true,
                        ticks_number: null,
                        tooltip_font_size: 10
                    };
                    break;
                case 'report_viewer_pie_chart':
                    vm.item.settings.group_attr = '';
                    vm.item.settings.number_attr = '';
                    vm.item.settings.group_number_calc_formula = 1;
                    vm.item.settings.show_legends = false;
                    vm.item.settings.legends_position = 'right';
                    vm.item.settings.tooltip_font_size = 10;
                    break;
            }

        };

        vm.getAxisInputsNames = function () {

            if (vm.item.settings.bars_direction === 'bottom-top') {
                vm.barsNamesAttrSelectorTitle = 'Bars Names (Abscissa)';
                vm.barsNumbersAttrSelectorTitle = 'Bars Numbers (Ordinate)';
            } else {
                vm.barsNamesAttrSelectorTitle = 'Bars Names (Ordinate)';
                vm.barsNumbersAttrSelectorTitle = 'Bars Numbers (Abscissa)';
            }

        };

        vm.setNumberFormatPreset = function (preset) {

            switch (preset) {

                case 'price':
                    vm.item.settings.number_format.zero_format_id = 1;
                    vm.item.settings.number_format.negative_color_format_id = 0;
                    vm.item.settings.number_format.negative_format_id = 0;
                    column.report_settings.round_format_id = 1;
                    break;
                case 'market_value':
                    vm.item.settings.number_format.zero_format_id = 1;
                    vm.item.settings.number_format.negative_color_format_id = 1;
                    vm.item.settings.number_format.negative_format_id = 1;
                    vm.item.settings.number_format.thousands_separator_format_id = 2;
                    break;
                case 'amount':
                    vm.item.settings.number_format.zero_format_id = 1;
                    vm.item.settings.number_format.negative_color_format_id = 1;
                    vm.item.settings.number_format.negative_format_id = 0;
                    vm.item.settings.number_format.thousands_separator_format_id = 2;
                    vm.item.settings.number_format.round_format_id = 3;
                    vm.item.settings.number_format.percentage_format_id = 0;
                    break;
                case 'exposure':
                    vm.item.settings.number_format.zero_format_id = 1;
                    vm.item.settings.number_format.negative_color_format_id = 1;
                    vm.item.settings.number_format.negative_format_id = 1;
                    vm.item.settings.number_format.round_format_id = 0;
                    vm.item.settings.number_format.percentage_format_id = 2;
                    break;
                case 'return':
                    vm.item.settings.number_format.zero_format_id = 1;
                    vm.item.settings.number_format.negative_color_format_id = 1;
                    vm.item.settings.number_format.negative_format_id = 0;
                    vm.item.settings.number_format.percentage_format_id = 3;
                    break;
            }

        };

        vm.openNumberFormatSettings = function($event){

            $mdDialog.show({
                controller: 'NumberFormatSettingsDialogController as vm',
                templateUrl: 'views/dialogs/number-format-settings-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                locals: {
                    data: {
                        settings: vm.item.settings.number_format
                    }
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.item.settings.number_format = res.data.settings;

                }

            });

        };

        vm.getContentTypeByEntityType = function () {

            if (vm.item.settings.entity_type === 'balance-report') {
                return 'reports.balancereport'
            }

            if (vm.item.settings.entity_type === 'pl-report') {
                return 'reports.plreport'
            }

            if (vm.item.settings.entity_type === 'transaction-report') {
                return 'reports.transactionreport'
            }

        };

        vm.getLayouts = function () {

            uiService.getListLayout(vm.item.settings.entity_type).then(function (data) {

                vm.layouts = data.results;

                $scope.$apply();

            })

        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.agree = function () {

            var layoutName;

            if (!vm.item.settings.bars_sorting) {
                delete vm.item.settings.sorting_value_type;
                delete vm.item.settings.sorting_type;
            }

            if (!vm.item.settings.autocalc_ticks_number) {
                delete vm.item.settings.ticks_number;
            }

            vm.layouts.forEach(function (layout) {

                if (layout.id === vm.item.settings.layout) {
                    layoutName = layout.name
                }

            });

            vm.item.settings.layout_name = layoutName;
            vm.item.settings.content_type = vm.getContentTypeByEntityType();

            if (vm.item.id) {

                vm.componentsTypes = vm.componentsTypes.map(function (item) {

                    if (item.id === vm.item.id) {
                        return vm.item
                    }

                    return item;
                })

            } else {

                var pattern = new Date().getTime() + '_' + vm.componentsTypes.length;

                vm.item.id = dataService.___generateId(pattern);

                vm.componentsTypes.push(vm.item);

            }

            dataService.setComponentsTypes(vm.componentsTypes);

            $mdDialog.hide({status: 'agree'});
        };

        vm.init = function () {

            vm.getAxisInputsNames();
            vm.componentsTypes = dataService.getComponentsTypes();

            if (vm.item.id) {
                vm.getLayouts();
                vm.getAttributes();
            }

        };

        vm.init()
    }

}());