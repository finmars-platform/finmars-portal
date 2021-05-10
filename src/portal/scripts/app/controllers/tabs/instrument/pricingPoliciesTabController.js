/**
 * Created by vzubr on 30.12.2020.
 */
(function () {

    'use strict';

    var metaNotificationClassService = require('../../../services/metaNotificationClassService');
    var metaEventClassService = require('../../../services/metaEventClassService');
    var instrumentPeriodicityService = require('../../../services/instrumentPeriodicityService');
    const instrumentPricingSchemeService = require('../../../services/pricing/instrumentPricingSchemeService');
    const attributeTypeService = require('../../../services/attributeTypeService');

    const GridTableDataService = require('../../../services/gridTableDataService');
    const GridTableEventService = require('../../../services/gridTableEventService');
    var gridTableEvents = require('../../../services/gridTableEvents');

    var metaHelper = require('../../../helpers/meta.helper');
    var md5Helper = require('../../../helpers/md5.helper');
    const GridTableHelperService = require('../../../helpers/gridTableHelperService');

    var EVENT_INIT_OBJECT = {
        "name": '',
        "description": "",
        "notification_class": '',
        "notify_in_n_days": '',
        "periodicity": '',
        "periodicity_n": '',
        "action_is_sent_to_pending": null,
        "action_is_book_automatic": null,
        "actions": [],
        "effective_date": null,
        "final_date": null,
        "event_class": null
    };

    module.exports = function pricingPoliciesTabController($scope, $mdDialog) {

        var vm = this;

        const gridTableHelperService = new GridTableHelperService();

        vm.entity = $scope.$parent.vm.entity;
        console.log('#71 vm.entity', vm.entity)
        vm.currencies = $scope.$parent.vm.currencies;
        vm.pricingConditions = $scope.$parent.vm.pricingConditions;
        vm.instrumentPricingSchemes = null;
        vm.attributeTypesByValueTypes = $scope.$parent.vm.attributeTypesByValueTypes;


        vm.contextData = $scope.$parent.vm.contextData;
        vm.entityType = 'instrument';
        vm.entityAttrs = $scope.$parent.vm.entityAttrs;

        vm.evEditorDataService = $scope.$parent.vm.evEditorDataService;
        vm.evEditorEventService = $scope.$parent.vm.evEditorEventService;
        vm.entityChange = $scope.$parent.vm.entityChange;

        vm.pricingPoliciesGridTableData = {
            header: {
                order: 'header',
                columns: []
            },
            body:[],
            templateRow: {
                isActive: false,
                columns: [
                    {
                        key: 'pricing_policy',
                        objPath: ['pricing_policy'],
                        columnName: 'Pricing Policy',
                        order: 0,
                        cellType: 'readonly_text',
                        settings: {
                            value: null,
                        },
                        styles: {
                            'grid-table-cell-elem': {'width': '10%'}
                        },
                        classes: 'pricing-policy'
                    },
                    {
                        key: 'pricing_scheme',
                        objPath: ['pricing_scheme'],
                        columnName: 'Pricing Scheme',
                        order: 1,
                        cellType: 'selector',
                        settings: {
                            value: null,
                            selectorOptions: [],
                        },
                        styles: {
                            'grid-table-cell-elem': {'width': '30%'}
                        },
                        classes: 'pricing-scheme'
                    },
                    {
                        key: 'pricing_scheme_clarification',
                        objPath: ['pricing_scheme_clarification'],
                        columnName: 'Pricing Scheme Clarification',
                        order: 2,
                        cellType: 'readonly_text',
                        settings: {
                            value: null
                        },
                        styles: {
                            'grid-table-cell-elem': {'width': '30%'}
                        },
                        classes: 'pricing-scheme-clarification gt-cell-plain-text'
                    },
/*                    {
                        key: 'edit_default_parameters',
                        objPath: ['edit_default_parameters'],
                        columnName: 'Edit Default Parameters',
                        order: 4,
                        cellType: 'selector',
                        settings: {
                            value: null,
                            selectorOptions: [],
                        },
                        styles: {
                            'grid-table-cell': {'width': '180px'}
                        }
                    },*/
                    {
                        key: 'edit_default_parameters',
                        objPath: ['edit_default_parameters'],
                        columnName: 'Edit Default Parameters',
                        order: 4,
                        cellType: 'custom_popup',
                        settings: {
                            value: null,
                            cellText: '',
                            closeOnMouseOut: false,
                            popupSettings: {
                                contentHtml: {
                                    main: "<div ng-include src=\"'views/directives/gridTable/cells/popups/instrument-pricing-edit-default-parameters-view.html'\"></div>"
                                },
                                data: {}
/*                                fieldsData: [
                                    {selectorOptions: vm.periodicityItems},
                                    {selectorOptions: vm.accrualModels}
                                ]*/
                            }
                        },
                        methods: {
                            onChange: function (rowData, colData, gtDataService, gtEventService) {
                                console.log('#71 onChange', rowData, colData)

/*                                var periodicityCell = gtDataService.getCellByKey(rowData.order, 'periodicity');

                                for (var i = 0; i < vm.periodicityItems.length; i++) {

                                    if (vm.periodicityItems[i].id === periodicityCell.settings.value[2]) {

                                        periodicityCell.settings.cellText = vm.periodicityItems[i].name
                                        break;

                                    }

                                }*/

                            }
                        },
                        styles: {
                            'grid-table-cell-elem': {'width': '30%'}
                        },
                        classes: 'edit-default-parameters'
                    },
                ],
                methods: {
                    onClick: '' // onEventsTableRowClick
                },
                styles: {'grid-table-row': {'cursor': 'pointer'}}
            },
            tableMethods: {
                addRow: '' //onEventsTableAddRow
            },
/*            components: {
                topPanel: {
                    filters: false,
                    columns: false,
                    search: false
                }
            }*/

            components: {
                topPanel: false,
                tableBody: {
                    rowCheckboxes: false
                }
            }

        }

        var formatDataForEventsGridTable = function () {

            // assemble header columns
            var rowObj = metaHelper.recursiveDeepCopy(vm.pricingPoliciesGridTableData.templateRow, true);

            vm.pricingPoliciesGridTableData.header.columns = rowObj.columns.map(function (column) {

                var headerData = {
                    key: column.key,
                    columnName: column.columnName,
                    order: column.order,
                    sorting: true,
                    styles: {
                        'grid-table-cell-elem': {'width': column.styles['grid-table-cell-elem'].width}
                    },
                    classes: column.classes
                };

                return headerData;

            });
            // < assemble header columns >

            // assemble body rows
            vm.entity.pricing_policies.forEach(function (policy, policyIndex) {
                rowObj = metaHelper.recursiveDeepCopy(vm.pricingPoliciesGridTableData.templateRow, true);
                console.log('#71 rowObj', rowObj)
                rowObj.key = policy.id;
                rowObj.order = policyIndex;

                const pricingPolicy = gridTableHelperService.getCellFromRowByKey(rowObj, 'pricing_policy');
                pricingPolicy.settings.value = policy.pricing_policy_object.name;

                const pricingScheme = gridTableHelperService.getCellFromRowByKey(rowObj, 'pricing_scheme');
                if (policy.pricing_scheme_object) {
                    pricingScheme.settings.value = policy.pricing_scheme_object.id;
                }
                pricingScheme.settings.selectorOptions = vm.instrumentPricingSchemes;

                const pricingSchemeClarification = gridTableHelperService.getCellFromRowByKey(rowObj, 'pricing_scheme_clarification');
                if (policy.pricing_scheme_object) {
                    pricingSchemeClarification.settings.value = policy.pricing_scheme_object.notes_for_users;
                }

                const defaultParameters = gridTableHelperService.getCellFromRowByKey(rowObj, 'edit_default_parameters');
                defaultParameters.settings.popupSettings.data.item = policy;

/*                const parameterClarification = gridTableHelperService.getCellFromRowByKey(rowObj, 'parameter_clarification');
                parameterClarification.settings.value = policy.pricing_scheme_object.notes_for_parameter;*/


                //
                // var finalDate = gridTableHelperService.getCellFromRowByKey(rowObj, 'pricing_scheme_clarification');
                // finalDate.settings.value = policy.pricing_scheme_clarification;
                //
                // var isAutoGenerated = gridTableHelperService.getCellFromRowByKey(rowObj, 'is_auto_generated');
                // isAutoGenerated.settings.value = policy.is_auto_generated;
                //
                // var eventClass = gridTableHelperService.getCellFromRowByKey(rowObj, 'event_class');
                // eventClass.settings.value = vm.bindEventClass(policy);

                vm.pricingPoliciesGridTableData.body.push(rowObj);
            });
            // < assemble body rows >
        };
        // <Event schedules grid Table>

        var initGridTableEvents = function () {

            // vm.eventSchedulesGridTableEventService.addEventListener(gridTableEvents.ROW_DELETED, onEventsTableDeleteRows);

        };

        vm.runPricingInstrument = function($event) {

            $mdDialog.show({
                controller: 'RunPricingInstrumentDialogController as vm',
                templateUrl: 'views/dialogs/pricing/run-pricing-instrument-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        instrument: vm.entity,
                        contextData: vm.contextData
                    }

                }
            }).then(function (res) {

                if (res.status === 'agree') {

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true,
                        locals: {
                            info: {
                                title: 'Success',
                                description: "Pricing Process Initialized."
                            }
                        }
                    });

                }

            });

        };

        const generateInstrumentAttributeTypesByValueTypes = function () {

            vm.attributeTypesByValueTypes = {

                10: [
                    {
                        name: 'Reference For Pricing',
                        user_code: 'reference_for_pricing'
                    }
                ],
                20: [
                    {
                        name: 'Default Price',
                        user_code: 'default_price'
                    }
                ],
                40: [
                    {
                        name: 'Maturity Date',
                        user_code: 'maturity_date'
                    }
                ]

            };

            vm.attributeTypesByValueTypes[10] = vm.attributeTypesByValueTypes[10].concat(vm.attributeTypes.filter(function (item) {
                return item.value_type === 10;
            }).map(function (item) {

                return {
                    name: item.name,
                    user_code: 'attributes.' + item.user_code
                }

            }));

            vm.attributeTypesByValueTypes[20] = vm.attributeTypesByValueTypes[20].concat(vm.attributeTypes.filter(function (item) {
                return item.value_type === 20;
            }).map(function (item) {

                return {
                    name: item.name,
                    user_code: 'attributes.' + item.user_code
                }

            }));

            vm.attributeTypesByValueTypes[40] = vm.attributeTypesByValueTypes[40].concat(vm.attributeTypes.filter(function (item) {
                return item.value_type === 40;
            }).map(function (item) {

                return {
                    name: item.name,
                    user_code: 'attributes.' + item.user_code
                }

            }));

        };

        const getInstrumentPricingSchemes = instrumentPricingSchemeService.getList().then((data) => {
            vm.instrumentPricingSchemes =  data.results;
        });

        const getAttributeTypes = attributeTypeService.getList(vm.entityType, {pageSize: 1000}).then(function (data) {
            vm.attributeTypes = data.results;
        });

        vm.switchPricingPolicyParameter = function ($event, item) {

            if (item.switchState === 'default_value') {
                item.switchState = 'attribute_key'
            } else {
                item.switchState = 'default_value'
            }

            item.default_value = null;
            item.attribute_key = null;

        };

        vm.init = function () {
            vm.pricingPoliciesGridTableDataService = new GridTableDataService();
            vm.pricingPoliciesGridTableEventService = new GridTableEventService();

            initGridTableEvents();

            Promise.all([getInstrumentPricingSchemes, getAttributeTypes]).then(function () {

                formatDataForEventsGridTable();
                generateInstrumentAttributeTypesByValueTypes();

            });

            console.log('#71 vm.pricingPoliciesGridTableData', vm.pricingPoliciesGridTableData)

            vm.pricingPoliciesGridTableDataService.setTableData(vm.pricingPoliciesGridTableData);

        };

        vm.init();

    }

}());