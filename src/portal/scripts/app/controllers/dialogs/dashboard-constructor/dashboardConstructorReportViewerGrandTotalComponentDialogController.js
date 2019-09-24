/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var uiService = require('../../../services/uiService');

    module.exports = function ($scope, $mdDialog, item, dataService, eventService, attributeDataService) {

        var vm = this;

        vm.newFilter = {};

        vm.filterLinks = [];

        if (item) {
            vm.item = item;
        } else {
            vm.item = {
                type: 'report_viewer_grand_total',
                id: null, // should be generated before create
                name: '',
                settings: {
                    components: {
                        addEntityBtn: false,
                        autoReportRequest: false,
                        columnAreaHeader: true,
                        fieldManagerBtn: false,
                        groupingArea: false,
                        layoutManager: false,
                        sidebar: false,
                        splitPanel: false
                    },
                    grand_total_column: null
                }
            }
        }


        vm.componentsTypes = [];

        vm.layouts = [];

        vm.cancel = function () {

            $mdDialog.hide();

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

        vm.agree = function () {

            var layoutName;

            vm.layouts.forEach(function (layout) {

                if(layout.id === vm.item.settings.layout) {
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

            console.log('dataService', dataService);

            vm.componentsTypes = dataService.getComponentsTypes();

            console.log('vm', vm);

            if (vm.item.id) {

                vm.getLayouts();
            }

        };

        vm.init()
    }

}());