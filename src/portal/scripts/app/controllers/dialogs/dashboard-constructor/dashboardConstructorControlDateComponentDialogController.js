/**
 * Created by szhitenev on 10.11.2023.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, uiService, dashboardConstructorMethodsService, reportHelper, dashboardHelper, entityResolverService, item, dataService, multitypeFieldService) {

        var vm = this;
        vm.processing = false;
		vm.readyStatus = {
			layouts: false
		};

        if (item) {
            vm.item = item;
            delete vm.item.defaultValue;
        } else {
            vm.item = {
                type: 'control',
                id: null, // should be generated before create
                name: '',
                settings: {
                    value_type: 40,
                    default_value_expression: 'now() - timedelta(days=1)'
                }
            }
        }

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            if (vm.item.id) {

                dataService.updateComponentById(vm.item);

            } else {

                var pattern = new Date().getTime() + '_' + vm.componentsTypes.length;

                vm.item.id = dataService.___generateId(pattern);

                vm.componentsTypes.push(vm.item);

            }

            dataService.setComponents(vm.componentsTypes);

            $mdDialog.hide({status: 'agree'});
        };

        vm.init = function () {

            vm.componentsTypes = dataService.getComponents();

        };

        vm.init();

    }

}());