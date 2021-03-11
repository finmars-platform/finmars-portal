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

                if (gtColumn.settings) {
                    vm.entity.accruals[tableData.index].data.items[data.row.order][gtColumn.key] = gtColumn.settings.value;
                }

                if (gtColumn.key === 'options_settings' && gtColumn.cellType !== 'empty') {
                    console.log('#78 options ', gtColumn.settings.value)

                }

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
                                'grid-table-cell': {'width': '85px'}
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
                            key: 'options_settings',
                            columnName: '',
                            order:4,
                            cellType: 'empty',
                            styles: {
                                'grid-table-cell': {'width': '65px'}
                            }
                        }
                    ],
                },
                components: {
                    topPanel: false
                }
            };

            var optionsColumn = {
                key: 'options_settings',
                // objPath: ['options_settings'],
                columnName: '',
                order: 4,
                cellType: 'custom_popup',
                settings: {
                    value: null,
                        closeOnMouseOut: false,
                        cellText: '...',
                        popupSettings: {
                            contentHtml: {
                                main: "<div ng-include src=\"'views/directives/gridTable/cells/popups/instrument-selector-options-display-settings.html'\"></div>"
                            },
                            classes: "ev-instr-accruals-settings-popup"
                        }
                    },
                    styles: {
                        'grid-table-cell': {'width': '65px'}
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
                rowObj.columns[1].settings.value = row.to_show;
                rowObj.columns[2].cellType = row.defaultValueType;
                rowObj.columns[2].settings.value = row.default_value;


                if (row.defaultValueType === 'selector') {
                    rowObj.columns[2].settings.selectorOptions = row.selectorOptions;
                }

                rowObj.columns[3].settings.value = row.override_name;

                if (row.options_settings) {

                    const optionsCell = metaHelper.recursiveDeepCopy(optionsColumn, false);

                    rowObj.columns[4] = optionsCell;
                    rowObj.columns[4].settings.value = row.options_settings;

                }

                console.log('#78 row', row)
                console.log('#78 rowObj', rowObj)

                return rowObj

            })

            return accrualsGridTableData;
        };

        vm.createInstrumentTypeAccrual = function () {

            const mapOptions = function (item) {
                return {
                    user_code: item.user_code,
                    id: item.id,
                    name: item.name,
                    to_show: true,
                    override_name: "",
                };
            };

            if(!vm.entity.accruals) {
                vm.entity.accruals = [];
            }

            var periodicitySelectorOptions = vm.periodicityItems.map(mapOptions);
            var accrualModelsSelectorOptions = vm.accrualModels.map(mapOptions)

            var accrual = {
                accrualsGridTableDataService: new GridTableDataService(),
                accrualsGridTableEventService: new GridTableEventService(),
                name: '',
                order: vm.entity.accruals.length,
                autogenerate: true,
                data: {
                    form_message: "",
                    items: [
                        {key: 'notes', name: 'Notes', to_show: true, defaultValueType: 'text', options_settings: false},
                        {key: 'accrual_start_date', name: 'First accrual date', to_show: true, defaultValueType: 'date', options_settings: false},
                        {key: 'first_payment_date', name: 'First payment date', to_show: true,  defaultValueType: 'date', options_settings: false},
                        {key: 'accrual_size', name: 'Accrual size', to_show: true, defaultValueType: 'number', options_settings: false},
                        {key: 'periodicity', name: 'Periodicity', to_show: true, defaultValueType: 'selector', selectorOptions: vm.periodicityItems, options_settings: periodicitySelectorOptions},
                        {key: 'accrual_calculation_model', name: 'Accrual model', to_show: true, defaultValueType: 'selector', selectorOptions: vm.accrualModels, options_settings: accrualModelsSelectorOptions},
                        {key: 'periodicity_n', name: 'Periodic N', to_show: true, defaultValueType: 'number', options_settings: false},
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

            var isTextInputElement = $event.target.closest('.instrument-type-accrual-name-input');

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

        vm.moveDown = function (item, $index, $event) {

            $event.stopPropagation();

            var swap = JSON.parse(JSON.stringify(item));
            vm.entity.accruals[$index] = vm.entity.accruals[$index + 1];
            vm.entity.accruals[$index + 1] = swap;

        };

        vm.moveUp = function (item, $index, $event) {

            $event.stopPropagation();

            var swap = JSON.parse(JSON.stringify(item));
            vm.entity.accruals[$index] = vm.entity.accruals[$index - 1];
            vm.entity.accruals[$index - 1] = swap;

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

                        var accrualsGridTableData = getAccrualsGridTableData(item);

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