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
                type: 'report_viewer',
                id: null, // should be generated before create
                name: '',
                custom_component_name: '',
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
                    linked_components: {
                        report_settings: {},
                        filter_links: []
                    },
                    user_settings: {
                        manage_columns: []
                    }
                }
            }

        }

        vm.deleteFilterLink = function (item, $index) {

            vm.item.settings.linked_components.filter_links = vm.item.settings.linked_components.filter_links.filter(function (item, index) {

                return $index !== index;

            });

        };

        vm.getComponentTypesByValueType = function (value_type) {

            value_type = parseInt(value_type, 10);

            return vm.componentsTypes.filter(function (componentType) {
                return componentType.type === 'control' && componentType.settings.value_type === value_type
            });

        };

        vm.addFilterLink = function () {

            if (!vm.item.settings.linked_components.filter_links) {
                vm.item.settings.linked_components.filter_links = [];
            }

            vm.item.settings.linked_components.filter_links.push(vm.newFilter);

            vm.newFilter = {};

        };

        vm.componentsTypes = [];

        vm.layouts = [];

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.reportTypeChange = function(){

            vm.item.settings.layout = null;
            vm.item.settings.linked_components= {};


            vm.getAttributes();

        };


        vm.getAttributes = function(){
            vm.attributes = attributeDataService.getAllAttributesByEntityType(vm.item.settings.entity_type);

            vm.multiselectorAttrs = vm.attributes.map(function (attribute) {
                var multiselectorName = attribute.name;
                return {id: attribute.key, name: multiselectorName};
            });
            console.log("user settings vm.multiselectorAttrs", vm.multiselectorAttrs);
        };

        vm.getLayouts = function () {

            uiService.getListLayout(vm.item.settings.entity_type).then(function (data) {

                vm.layouts = data.results;

                $scope.$apply();

            })

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

        vm.agree = function () {

            if (!vm.item.settings.linked_components.filter_links) {
                vm.item.settings.linked_components.filter_links = [];
            }

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

            console.log('dataService', dataService);

            console.log('attributeDataService', attributeDataService);

            vm.componentsTypes = dataService.getComponentsTypes();

            console.log('vm.componentsTypes', vm.componentsTypes);

            vm.controlComponentsTypes = vm.componentsTypes.filter(function (componentType) {
                return componentType.type === 'control';
            });

            vm.dateControlComponentsTypes = vm.componentsTypes.filter(function (componentType) {
                return componentType.type === 'control' && componentType.settings.value_type === 40
            });

            vm.currencyControlComponentsTypes = vm.componentsTypes.filter(function (componentType) {
                return componentType.type === 'control' && componentType.settings.value_type === 100 && componentType.settings.content_type === 'currencies.currency'
            });

            vm.pricingPolicyControlComponentsTypes = vm.componentsTypes.filter(function (componentType) {
                return componentType.type === 'control' && componentType.settings.value_type === 100 && componentType.settings.content_type === 'instruments.pricingpolicy'
            });

            console.log('vm', vm);

            if (vm.item.id) {

                vm.getLayouts();
                vm.getAttributes();
            }

        };

        vm.init()
    }

}());