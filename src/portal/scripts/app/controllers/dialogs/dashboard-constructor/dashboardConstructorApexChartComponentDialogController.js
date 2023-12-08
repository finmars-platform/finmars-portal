(function () {

    'use strict';

    /**
     * Created by szhitenev on 19.08.2023.
     */

    module.exports = function ($scope, $mdDialog, uiService, dashboardConstructorMethodsService, dashboardHelper, item, dataService, eventService, attributeDataService, multitypeFieldService, data) {

        var vm = this;

        if (item) {
            vm.item = item;
        } else {
            vm.item = {
                type: 'apex_chart',
                id: null, // should be generated before create
                name: '',
                settings: {
                    show_header: true,
                    components_to_listen: []
                },
                source: '',
                user_settings: {}
            }
        }

        vm.componentsTypes = [];

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            console.log('vm.agree.vm.item', vm.item);

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

            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.dcChartsElemToDrag');
            }, 100);


            vm.componentsTypes = dataService.getComponents();

            vm.componentsTypesToListen = vm.componentsTypes.filter(function (item) {
                return item.user_code // should not be empty
            }).map(function (item) {

                return {
                    id: item.user_code,
                    name: item.name
                }

            })



        };

        vm.init()
    }

}());