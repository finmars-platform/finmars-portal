/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, uiService, dashboardConstructorMethodsService, dashboardHelper, item, dataService, eventService, attributeDataService, multitypeFieldService) {

        var vm = this;

        vm.newFilter = {};

        vm.filterLinks = [];
        vm.readyStatus = {
            layouts: false
        };

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
                    components_to_listen: [],
                    matrix_type: 'balance',
                    // entity_type: 'balance-report',
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
                    calculate_name_column_width: false,
                    linked_components: {},
                    hide_empty_lines: '',
                    filters: {
                        show_filters_area: false,
                        show_use_from_above_filters: false,
                    },
                    default_report_options: {
                        cost_method: 1,
                        account_mode: 1,
                        portfolio_mode: 1,
                        custom_fields_to_calculate: ""
                    }
                },

                user_settings: {}
            }

        }

        if (!vm.item.settings.default_report_options) {
            vm.item.settings.default_report_options = {};
        }

        vm.reportOptions = JSON.stringify(vm.item.settings.default_report_options, null, 4);

        vm.componentsTypes = [];

        vm.componentType = dataService.getComponentById(vm.item.id);

        // vm.layoutsByEntityType = {
        // 	'balance-report': [],
        // 	'pl-report': [],
        // 	'transaction-report': [],
        // };
        //
        // vm.layouts = [];

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        /*vm.getContentTypeByEntityType = function () {

            if (vm.item.settings.entity_type === 'balance-report') {
                return 'reports.balancereport'
            }

            if (vm.item.settings.entity_type === 'pl-report') {
                return 'reports.plreport'
            }

            if (vm.item.settings.entity_type === 'transaction-report') {
                return 'reports.transactionreport'
            }

        };*/

        vm.openNumberFormatSettings = function ($event) {

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

                    vm.item.settings.number_format = res.data;

                }

            });

        };

        /* vm.reportTypeChange = function() {

            vm.item.settings.layout = null;
            vm.item.settings.linked_components= {};

            vm.item.settings.abscissa = null;
            vm.item.settings.ordinate = null;
            vm.item.settings.value_key = null;

            vm.item.user_settings = {};

            vm.getAttributes();
            vm.getLayouts();

        };

        vm.layoutsSelectorsList = [
            {
                'key': 'balance-report',
                'model': "",
                'fieldType': 'dropdownSelect',
                'isDefault': true,
                'isActive': false,
                'sign': '<div class="multitype-field-type-letter">B</div>',
                'name': 'Balance',
                'value_type': 100,
                'custom': {
                    'menuOptionsNotLoaded': true,
                },
                'fieldData': {
                    'smallOptions': {'dialogParent': '.dialog-containers-wrap'},
                    'menuOptions': []
                }
            },
            {
                'key': 'pl-report',
                'model': '',
                'fieldType': 'dropdownSelect',
                'isDefault': false,
                'isActive': false,
                'sign': '<div class="multitype-field-type-letter">P</div>',
                'name': 'Profit & Loss',
                'value_type': 100,
                'custom': {
                    'menuOptionsNotLoaded': true,
                },
                'fieldData': {
                    'smallOptions': {'dialogParent': '.dialog-containers-wrap'},
                    'menuOptions': []
                }
            },
            {
                'key': 'transaction-report',
                'model': '',
                'fieldType': 'dropdownSelect',
                'isDefault': false,
                'isActive': false,
                'sign': '<div class="multitype-field-type-letter">T</div>',
                'name': 'Transactions',
                'value_type': 100,
                'custom': {
                    'menuOptionsNotLoaded': true,
                },
                'fieldData': {
                    'smallOptions': {'dialogParent': '.dialog-containers-wrap'},
                    'menuOptions': []
                }
            }
        ]; */

        // Deprecate since FN-2320 2023-11-11 szhitenev
        /*vm.layoutsSelectorsList = multitypeFieldService.getReportLayoutsSelectorData().map(function (type) {
            type.custom = {
                menuOptionsNotLoaded: true,
            }
            return type;
        });*/

        // Deprecate since FN-2320 2023-11-11 szhitenev
        /*vm.onLayoutEntityTypeChange = function (activeType) {
			/!*vm.item.settings.entity_type = activeType.key;

			if (activeType.custom.menuOptionsNotLoaded) {

				activeType.fieldData.menuOptions = await vm.getLayouts();
				activeType.custom.menuOptionsNotLoaded = false;

				$scope.$apply();

			}*!/
			dashboardConstructorMethodsService.onReportTypeChange(activeType, vm.item, vm.getLayouts, $scope).then(function (item) {

				vm.layouts = vm.layoutsByEntityType[vm.item.settings.entity_type];
				vm.item = item;

				vm.item.settings.linked_components= {};

				vm.item.settings.abscissa = null;
				vm.item.settings.ordinate = null;
				vm.item.settings.value_key = null;

				vm.item.user_settings = {};

				vm.getAttributes();

			});

		};*/

        // Deprecate since FN-2320 2023-11-11 szhitenev
        /*vm.onLayoutChange = function () {
        	var activeType = vm.layoutsSelectorsList.find(function (type) {
				return type.isActive;
			});

        	vm.item.settings.layout = activeType.model;
		};*/

        /*vm.getLayouts = function () {

            uiService.getListLayout(vm.item.settings.entity_type).then(function (data) {

                vm.layouts = data.results;

                vm.layoutsWithLinkToFilters = dashboardHelper.getDataForLayoutSelectorWithFilters(vm.layouts);

                vm.showLinkingToFilters();

                $scope.$apply();

            });

        };*/
        // Deprecate since FN-2320 2023-11-11 szhitenev
        /*vm.getLayouts = function () {

            return new Promise(function (resolve) {

                uiService.getListLayout(vm.item.settings.entity_type, {pageSize: 1000}).then(function (data) {

                    vm.layoutsByEntityType[vm.item.settings.entity_type] = data.results;
                    vm.layouts = data.results;

                    var layoutsForMultitypeSelector = dashboardHelper.getDataForLayoutSelectorWithFilters(vm.layouts);

                    vm.showLinkingToFilters();

                    $scope.$apply();

                    resolve(layoutsForMultitypeSelector);

                }).catch(function (error) {
                    console.error(error);
                    resolve([]);
                });

            });

        };*/

        vm.showLinkingToFilters = function () {

            /*for (var i = 0; i < vm.layouts.length; i++) {

                if (vm.layouts[i].user_code === vm.item.settings.layout) {

                    var layout = vm.layouts[i];
                    vm.linkingToFilters = dashboardHelper.getLinkingToFilters(layout);

                    break;

                }

            }*/

            vm.linkingToFilters = dashboardConstructorMethodsService.showLinkingToFilters(vm.layouts, vm.item.settings.layout);

        };

        vm.getAttributes = function () {

            var entityType;

            if (vm.item.settings.matrix_type === 'balance') {
                entityType = 'balance-report'
            }
            if (vm.item.settings.matrix_type === 'pl') {
                entityType = 'pl-report'
            }

            vm.attributes = attributeDataService.getAllAttributesByEntityType(entityType);

            vm.numericAttributes = vm.attributes.filter(function (item) {
                return item.value_type === 20;
            });

        };

        vm.agree = function () {

            // Deprecate since FN-2320 2023-11-11 szhitenev
            /*var layoutName;

            /!*vm.layouts.forEach(function (layout) {

                if (layout.id === vm.item.settings.layout) {
                    layoutName = layout.name
                }

            });*!/
            var selLayout = vm.layouts.find(layout => layout.user_code === vm.item.settings.layout);

            if (selLayout) layoutName = selLayout.name;

            vm.item.settings.layout_name = layoutName;*/


            // vm.item.settings.content_type = vm.getContentTypeByEntityType();


            vm.item.settings.default_report_options = JSON.parse(vm.reportOptions);


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

            vm.componentsTypesToListen = vm.componentsTypes.filter(function (item) {
                return item.user_code // should not be empty
            }).map(function (item) {

                return {
                    id: item.user_code,
                    name: item.name
                }

            })

            dashboardConstructorMethodsService.getDataForComponentsSelector(vm, componentsForLinking, vm.item.user_code);

            /* if (vm.item.id) {

            	vm.getAttributes();
                vm.getLayouts();

            } */
            vm.getAttributes();

            vm.readyStatus.layouts = true;

            // Deprecate since FN-2320 2023-11-11 szhitenev
            /*dashboardConstructorMethodsService.prepareDataForReportLayoutSelector(vm.layoutsSelectorsList, vm.item.settings.entity_type, vm.item.settings.layout, vm.getLayouts(), true)
                .then(function (layoutsSelectorsList) {

                    vm.layoutsSelectorsList = layoutsSelectorsList;
                    vm.readyStatus.layouts = true;
                    $scope.$apply();

                });*/

        };

        vm.init()
    }

}());