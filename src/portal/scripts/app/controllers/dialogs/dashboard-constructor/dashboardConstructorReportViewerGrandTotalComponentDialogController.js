/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var uiService = require('../../../services/uiService');
    var dashboardHelper = require('../../../helpers/dashboard.helper');
    var evRvLayoutsHelper = require('../../../helpers/evRvLayoutsHelper');

    module.exports = function ($scope, $mdDialog, item, dataService, eventService, attributeDataService) {

        var vm = this;

        vm.newFilter = {};

        vm.filterLinks = [];
        vm.componentsForMultiselector = [];
        var componentsForLinking = dashboardHelper.getComponentsForLinking();

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
            $mdDialog.hide({status: 'disagree'});
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

        vm.openNumberFormatSettings = function($event) {

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

                    console.log(res)
                }

            });

        };

        vm.reportTypeChange = function(){

            vm.item.settings.layout = null;
            vm.item.settings.linked_components= {};

            vm.item.settings.grand_total_column = null;

            vm.getAttributes();
            vm.getLayouts();

        };

        vm.getLayouts = function () {

            uiService.getListLayout(vm.item.settings.entity_type).then(function (data) {

                vm.layouts = data.results;

                vm.layoutsWithLinkToFilters = dashboardHelper.getDataForLayoutSelectorWithFilters(vm.layouts);
                vm.showLinkingToFilters();

                $scope.$apply();

            })

        };

        vm.getAttributes = function(){

            vm.attributes = attributeDataService.getAllAttributesByEntityType(vm.item.settings.entity_type);

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

                /*vm.componentsTypes = vm.componentsTypes.map(function (item) {

                    if (item.id === vm.item.id) {
                        return vm.item
                    }

                    return item;
                })*/
                dataService.updateComponentById(vm.item);

            } else {

                var pattern = new Date().getTime() + '_' + vm.componentsTypes.length;

                vm.item.id = dataService.___generateId(pattern);

                vm.componentsTypes.push(vm.item);

            }

            dataService.setComponents(vm.componentsTypes);

            $mdDialog.hide({status: 'agree'});
        };

        vm.showLinkingToFilters = function () {

            for (var i = 0; i < vm.layouts.length; i++) {

                if (vm.layouts[i].id === vm.item.settings.layout) {

                    var layout = vm.layouts[i];
                    vm.linkingToFilters = dashboardHelper.getLinkingToFilters(layout);

                    break;

                }

            }

        };

        vm.init = function () {

            console.log('dataService', dataService);

            vm.componentsTypes = dataService.getComponents();

            vm.controlComponentsTypes = vm.componentsTypes.filter(function (componentType) {
                return componentType.type === 'control';
            });

            vm.dateControlComponentsTypes = vm.componentsTypes.filter(function (componentType) {
                return componentType.type === 'control' && componentType.settings.value_type === 40
            });

            vm.currencyControlComponentsTypes = vm.componentsTypes.filter(function (componentType) {
                return componentType.type === 'control' &&
                    componentType.settings.value_type === 100 &&
                    componentType.settings.content_type === 'currencies.currency'
            });

            vm.pricingPolicyControlComponentsTypes = vm.componentsTypes.filter(function (componentType) {
                return componentType.type === 'control' &&
                    componentType.settings.value_type === 100 &&
                    componentType.settings.content_type === 'instruments.pricingpolicy'
            });

            vm.componentsTypes.forEach(function (comp) {
                if (componentsForLinking.indexOf(comp.type) !== -1 &&
                    comp.id !== vm.item.id) {
                    vm.componentsForMultiselector.push(
                        {
                            id: comp.id,
                            name: comp.name
                        });
                }
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