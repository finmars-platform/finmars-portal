/**
 * Created by vzubr on 19.02.2021.
 */
(function (){
    'use strict';

    var GridTableDataService = require('../../../services/gridTableDataService');
    var GridTableEventService = require('../../../services/gridTableEventService');
    var gridTableEvents = require('../../../services/gridTableEvents');

    var metaHelper = require('../../../helpers/meta.helper');

    const instrumentPeriodicityService = require('../../../services/instrumentPeriodicityService');
    const accrualCalculationModelService = require('../../../services/accrualCalculationModelService');

    module.exports = function instrumentTypeAccrualsTabController ($scope, $mdDialog) {

        var vm = this;
        vm.entity = $scope.$parent.vm.entity;

        console.log('#78 vm.entity', vm.entity);

        vm.readyStatus = {
            periodicityItems: false,
            accrualModels: false,

            gritTable: false
        };

        vm.onNameFocus = function (event) {
            var textAreaElement = event.target;

            textAreaElement.addEventListener('keydown', function (evt) { // TODO Must I remove listeners? And what event?
                evt.stopPropagation();
            })
        };

        var onAccrualTableCellChange = function (data, gtDataService, gtEventService) {

            var tableData = gtDataService.getTableData()
            var gtRow = gtDataService.getRowByKey(data.row.key);

            gtRow.columns.forEach(function (gtColumn) {

                vm.entity.accruals[tableData.index].data.items[data.row.order][gtColumn.key] = gtColumn.settings.value;

            })

        };

        var getAccrualsGridTableData = function (item) {
            var rows = item.data.items;

            const accrualsGridTableData = {
                header: {
                    order: 'header',
                    columns: []
                },
                body: [],
                templateRow: {
                    order: 'newRow',
                    isActive: false,
                    columns: [
                        {
                            key: 'name',
                            // objPath: ['name'],
                            columnName: 'Name',
                            order: 0,
                            cellType: 'text',
                            settings: {
                                value: null,
                                closeOnMouseOut: false,
                                isDisabled: true
                            },
                            styles: {
                                'grid-table-cell': {'width': '165px'}
                            }
                        },
                        {
                            key: 'to_show',
                            columnName: 'To Show',
                            order: 1,
                            cellType: 'checkbox',
                            settings: {
                                value: null
                            },
                            styles: {
                                'grid-table-cell': {'width': '165px'}
                            }

                        },
                        {
                            key: 'default_value',
                            // objPath: ['name'],
                            columnName: 'Default Value',
                            order: 2,
                            cellType: 'selector',
                            settings: {
                                value: null,
                                selectorOptions: []
                            },
                            styles: {
                                'grid-table-cell': {'width': '165px'}
                            }
                        },
                        {
                            key: 'override_name',
                            // objPath: ['name'],
                            columnName: 'Override Name',
                            order: 3,
                            cellType: 'text',
                            settings: {
                                value: null,
                                closeOnMouseOut: false,
                                isDisabled: false
                            },
                            styles: {
                                'grid-table-cell': {'width': '165px'}
                            }
                        },
                        {
                            key: 'options',
                            // objPath: ['name'],
                            columnName: 'Options',
                            order: 4,
                            cellType: 'text',
                            settings: {
                                value: null,
                                closeOnMouseOut: false,
                                isDisabled: true
                            },
                            styles: {
                                'grid-table-cell': {'width': '165px'}
                            }
                        },
                        /*                        {
                                                    key: 'options',
                                                    objPaths: [['accrual_calculation_model'], ['periodicity_n'], ['periodicity']],
                                                    columnName: 'Options',
                                                    order: 4,
                                                    cellType: 'custom_popup',
                                                    settings: {
                                                        value: [
                                                            null, // for accrual_calculation_model
                                                            null, // for periodicity_n
                                                            null // for periodicity
                                                        ],
                                                        cellText: '',
                                                        closeOnMouseOut: false,
                                                        popupSettings: {
                                                            contentHtml: {
                                                                main: "<div ng-include src=\"'views/directives/gridTable/cells/popups/instrument-accrual-schedules-periodicity-view.html'\"></div>"
                                                            },
                        /!*                                    fieldsData: [
                                                                {selectorOptions: vm.periodicityItems},
                                                                null,
                                                                {selectorOptions: vm.accrualModels}
                                                            ]*!/
                                                        }
                                                    },
                                                    methods: {
                        /!*                                onChange: function (rowData, colData, gtDataService, gtEventService) {

                                                            var periodicityCell = gtDataService.getCellByKey(rowData.order, 'periodicity');

                                                            periodicityCell.settings.cellText = '';

                                                            if (periodicityCell.settings.value[2]) {

                                                                const selectedPeriodicity = vm.periodicityItems.find(item => {
                                                                    return item.id === periodicityCell.settings.value[2];
                                                                });
                                                                periodicityCell.settings.cellText = selectedPeriodicity.name

                                                            }

                                                        }*!/
                                                    },
                                                    styles: {
                                                        'grid-table-cell': {'width': '115px'}
                                                    }
                                                },*/

                    ],
                },
                components: {
                    topPanel: {
                        inactive: true,
                        /*                        filters: false,
                                                columns: false,
                                                search: false*/
                    }
                }
            };

            const optionCellSettings = {
                value: [],
                cellText: 'Options...',
                closeOnMouseOut: false,
                popupSettings: {
                    contentHtml: {
                        main: "<div ng-include src=\"'views/directives/gridTable/cells/popups/instrument-type-accruals-options-view.html'\"></div>"
                    },
                }
            };

            const rowObj = metaHelper.recursiveDeepCopy(accrualsGridTableData.templateRow, true);
            accrualsGridTableData.header.columns = rowObj.columns.map(column => {

                return {
                    key: column.key,
                    columnName: column.columnName,
                    order: column.order,
                    styles: {
                        'grid-table-cell': {'width': column.styles['grid-table-cell'].width}
                    }
                };
            });

            accrualsGridTableData.body = rows.map((row, index) => {
                const rowObj = metaHelper.recursiveDeepCopy(accrualsGridTableData.templateRow, true);

                rowObj.order = index;
                rowObj.key = row.key;

                rowObj.columns[0].settings.value = row.name;
                rowObj.columns[1].settings.value = row.toShow;
                rowObj.columns[2].cellType = row.defaultValueType;

                if (row.defaultValueType === 'selector') {
                    rowObj.columns[2].settings.selectorOptions = row.selectorOptions;
                }

                if (row.options) {

                    const cell = rowObj.columns[4];

                    cell.cellType = 'custom_popup';
                    cell.objPaths = [
                        ['annual_to_show'], ['annual_override_name'],
                        ['semi-annual_to_show'], ['semi-annual_override_name'],
                        ['quarterly-annual_to_show'], ['quarterly-annual_override_name'],
                        ['monthly-annual_to_show'], ['monthly-annual_override_name'],
                    ];

                    cell.settings = metaHelper.recursiveDeepCopy(optionCellSettings, false);
                    cell.settings.value = [
                        true, 'Annual ON',
                        true, 'Semi-annual ON',
                        true, 'Quarterly ON',
                        true, 'Monthly ON',
                    ];

                    cell.methods ={
                        onChange: function (rowData, colData, gtDataService, gtEventService) {
                            const cell = gtDataService.getCellByKey(rowData.order, colData.key);
                            cell.settings.cellText = 'Options changed';
                            // Victor 2021.02.18 TODO here i will collect model for options of accrual model and periodicity
                        }
                    }

                }

                return rowObj

            })

            return accrualsGridTableData;
        };

        vm.createInstrumentTypeAccrual = function () {

            if(!vm.entity.accruals) {
                vm.entity.accruals = [];
            }

            var accrual = {
                accrualsGridTableDataService: new GridTableDataService(),
                accrualsGridTableEventService: new GridTableEventService(),
                order: vm.entity.length,
                autogenerate: true,
                data: {
                    form_message: "",
                    items: [
                        {key: 'notes', name: 'Notes', toShow: true, defaultValueType: 'text', options: false},
                        {key: 'accrual_start_date', name: 'First accrual date', toShow: true, defaultValueType: 'date', options: false},
                        {key: 'first_payment_date', name: 'First payment date', toShow: true,  defaultValueType: 'date', options: false},
                        {key: 'accrual_size', name: 'Accrual size', toShow: true, defaultValueType: 'number', options: false},
                        {key: 'periodicity', name: 'Periodicity', toShow: true, defaultValueType: 'selector', selectorOptions: vm.periodicityItems, options: true},
                        {key: 'accrual_calculation_model', name: 'Accrual model', toShow: true, defaultValueType: 'selector', selectorOptions: vm.accrualModels, options: true},
                        {key: 'periodicity_n', name: 'Periodic N', toShow: true, defaultValueType: 'number', options: false},
                    ]
                }
            };

            accrual.accrualsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
                onAccrualTableCellChange(argumentsObj, accrual.accrualsGridTableDataService, accrual.accrualsGridTableEventService);
            });

            var accrualGridTableData = getAccrualsGridTableData (accrual);

            accrualGridTableData.index = vm.entity.events.length;
            accrual.accrualsGridTableDataService.setTableData(accrualGridTableData);

            vm.entity.accruals.push(accrual);

        };

        vm.toggleItem = function (pane, item, $event) {

            $event.stopPropagation();

            var isTextInputElement = $event.target.closest('.ttype-action-notes-input');

            if (!isTextInputElement) {
                pane.toggle();
                item.isPaneExpanded = !item.isPaneExpanded;
            }



        };

        vm.deletePane = function (item, $index, $event) {

            $event.stopPropagation();
            var description = 'Are you sure to delete this accrual?';

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                multiple: true,
                skipHide: true,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: description
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    vm.entity.accruals.splice($index, 1);
                }
            });
        };

        const periodicityItemsPromise = instrumentPeriodicityService.getList().then(data => {
            vm.periodicityItems = data;
        });

        const accrualModelsPromise = accrualCalculationModelService.getList().then(data => {
            vm.accrualModels = data;
        });

        var init = function () {
            Promise.all([periodicityItemsPromise, accrualModelsPromise]).then(() => {

                vm.entity.accruals.forEach(function (item, index) {

                    if (item.data) {

                        item.accrualsGridTableDataService = new GridTableDataService();
                        item.accrualsGridTableEventService = new GridTableEventService();

                        item.accrualsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
                            onAccrualTableCellChange(argumentsObj, item.accrualsGridTableDataService, item.accrualsGridTableEventService);
                        });

                        var accrualsGridTableData = getAccrualsGridTableData(item)

                        accrualsGridTableData.index = index;

                        item.accrualsGridTableDataService.setTableData(accrualsGridTableData);

                    }

                })

                vm.readyStatus.gridTable = true;
            })

        }

        init();

    }

}());