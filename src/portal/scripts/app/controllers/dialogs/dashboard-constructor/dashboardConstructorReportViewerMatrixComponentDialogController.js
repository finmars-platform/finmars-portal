/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var uiService = require('../../../services/uiService');
    var dashboardHelper = require('../../../helpers/dashboard.helper');
    var dashboardConstructorMethodsService = require('../../../services/dashboard-constructor/dashboardConstructorMethodsService');

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
                type: 'report_viewer_matrix',
                id: null, // should be generated before create
                name: '',
                settings: {
                    abscissa: '',
                    ordinate: '',
                    value_key: '',
                    subtotal_formula_id: 1,
                    matrix_view: 'usual',
                    styles: {
                        cell: {
                            text_align: 'center'
                        }
                    },
                    auto_refresh: false,
                    auto_scaling: false,
                    linked_components: {},
                    hide_empty_lines: ''
                },

                user_settings: {}
            }

        }

        vm.componentsTypes = [];

        vm.componentType = dataService.getComponentById(vm.item.id);

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

                }

            });

        };

        vm.reportTypeChange = function(){

            vm.item.settings.layout = null;
            vm.item.settings.linked_components= {};

            vm.item.settings.abscissa = null;
            vm.item.settings.ordinate = null;
            vm.item.settings.value_key = null;

            vm.item.user_settings = {};

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

        vm.showLinkingToFilters = function () {

            for (var i = 0; i < vm.layouts.length; i++) {

                if (vm.layouts[i].id === vm.item.settings.layout) {

                    var layout = vm.layouts[i];
                    vm.linkingToFilters = dashboardHelper.getLinkingToFilters(layout);

                    break;

                }

            }

        };

        vm.clearSelect = function (item, propToDelete) {
            delete item[propToDelete];
        }

        vm.getAttributes = function(){

            vm.attributes = attributeDataService.getAllAttributesByEntityType(vm.item.settings.entity_type);

            vm.numericAttributes = vm.attributes.filter(function (item) {
                return item.value_type === 20;
            });

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


            if (vm.item.settings.subtotal_formula_id) {
                vm.item.settings.subtotal_formula_id = parseInt(vm.item.settings.subtotal_formula_id, 10);
            }

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

        vm.init = function () {

            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.dcMatrixElemToDrag');
            }, 100);

            vm.componentsTypes = dataService.getComponents();

            dashboardConstructorMethodsService.getDataForComponentsSelector(vm, componentsForLinking, vm.item.id);

            if (vm.item.id) {

                vm.getLayouts();
                vm.getAttributes();
            }

        };

        vm.init()
    }

}());