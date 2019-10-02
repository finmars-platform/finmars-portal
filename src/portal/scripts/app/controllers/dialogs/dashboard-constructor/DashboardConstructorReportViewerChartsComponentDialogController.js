(function () {

    'use strict';

    var uiService = require('../../../services/uiService');

    module.exports = function ($scope, $mdDialog, item, dataService, eventService, attributeDataService) {

        var vm = this;

        vm.newFilter = {};

        vm.filterLinks = [];

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
            delete vm.item.settings.abscissa;
            delete vm.item.settings.ordinate;
            delete vm.item.settings.fieldsKeys;
            delete vm.item.settings.min_bar_width;
            delete vm.item.settings.max_bar_width;
        };

        vm.reportTypeChange = function() {

            vm.item.settings.layout = null;
            vm.item.settings.linked_components= {};

            deleteChartTypeBasedProps();

            switch (vm.item.type) {
                case 'report_viewer_bars_chart':
                    vm.item.settings.abscissa = null;
                    vm.item.settings.ordinate = null;
                    break;
                case 'report_viewer_pie_chart':
                    vm.item.settings.fieldsKeys = [];
                    break;
            }

            vm.getAttributes();

        };

        vm.getAttributes = function() {

            vm.attributes = attributeDataService.getAllAttributesByEntityType(vm.item.settings.entity_type);
            vm.numericAttributes = attributeDataService.getAllAttributesByEntityType(vm.item.settings.entity_type).filter(function (item) {
                return item.value_type === 20;
            });

            vm.numericAttributesForMultiselect = vm.numericAttributes.map(function (item) {
                return {name: item.name, id: item.key}
            });

        };

        vm.chartTypeChanged = function () {

            deleteChartTypeBasedProps();

            switch (vm.item.type) {
                case 'report_viewer_bars_chart':
                    vm.item.settings = {
                        abscissa: '',
                        ordinate: '',
                        min_bar_width: 50,
                        max_bar_width: 90
                    };
                    break;
                case 'report_viewer_pie_chart':
                    vm.item.settings.fieldsKeys = [];
                    break;
            };

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

            vm.componentsTypes = dataService.getComponentsTypes();

            if (vm.item.id) {

                vm.getLayouts();
                vm.getAttributes();
            }

        };

        vm.init()
    }

}());