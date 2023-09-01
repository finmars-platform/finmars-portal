(function () {

    'use strict';

    /**
     * Created by szhitenev on 22.08.2023.
     */

    module.exports = function ($scope, $mdDialog, uiService, dashboardConstructorMethodsService, dashboardHelper, item, dataService, eventService, attributeDataService, multitypeFieldService, data) {

        var vm = this;

        vm.newFilter = {};

        vm.filterLinks = [];
        vm.readyStatus = {
            layouts: false
        };

        vm.barsNamesAttrSelectorTitle = '';
        vm.barsNumbersAttrSelectorTitle = '';

        vm.multiselectModalName = 'Fields multiselector';

        vm.componentsForMultiselector = [];
        var componentsForLinking = dashboardHelper.getComponentsForLinking();

        if (item) {
            vm.item = item;
        } else {
            vm.item = {
                type: 'iframe',
                id: null, // should be generated before create
                name: '',
                settings: {
                    entity_type: 'balance-report',
                    auto_refresh: false,
                    linked_components: {
                        report_settings: {}
                    }
                },
                url_type: 'absolute_url',
                url: '',
                user_settings: {}
            }
        }

        vm.componentsTypes = [];

        vm.getAttributes = function () {

            vm.attributes = attributeDataService.getAllAttributesByEntityType(vm.item.settings.entity_type);
            vm.numericAttributes = attributeDataService.getAllAttributesByEntityType(vm.item.settings.entity_type).filter(function (item) {
                return item.value_type === 20;
            });

        };

        vm.showLinkingToFilters = function () {

            vm.linkingToFilters = dashboardConstructorMethodsService.showLinkingToFilters(vm.layouts, vm.item.settings.layout);

        };

        vm.clearSelect = function (item, propToDelete) {
            delete item[propToDelete];
        }

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


        vm.exportToDashboards = function () {
            dashboardConstructorMethodsService.exportComponentToDashboards(vm, $mdDialog, dataService);
        };

        vm.init = function () {

            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.dcChartsElemToDrag');
            }, 100);


            vm.componentsTypes = dataService.getComponents();

            dashboardConstructorMethodsService.getDataForComponentsSelector(vm, componentsForLinking, vm.item.id);

            vm.getAttributes();


        };

        vm.init()
    }

}());