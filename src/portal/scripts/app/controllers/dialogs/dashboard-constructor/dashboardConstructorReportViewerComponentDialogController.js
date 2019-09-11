/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var uiService = require('../../../services/uiService');

    module.exports = function ($scope, $mdDialog, item, dataService, eventService) {

        var vm = this;

        if (item) {
            vm.item = item;
        } else {
            vm.item = {
                type: 'report_viewer',
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
                    }
                }
            }
        }

        vm.componentsTypes = [];

        vm.layouts = [];

        vm.cancel = function () {

            $mdDialog.hide();

        };

        vm.getLayouts = function () {

            uiService.getListLayout(vm.item.settings.entityType).then(function (data) {

                vm.layouts = data.results;

                $scope.$apply();

            })

        };

        vm.agree = function () {

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

            if (vm.item.id) {

                vm.getLayouts();
            }

        };

        vm.init()
    }

}());