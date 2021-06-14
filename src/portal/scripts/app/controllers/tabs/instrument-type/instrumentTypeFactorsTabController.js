/**
 * Created by vzubr on 11.06.2021.
 */
(function (){
    'use strict';

    const GridTableDataService = require('../../../services/gridTableDataService');
    const GridTableEventService = require('../../../services/gridTableEventService');
    const gridTableEvents = require('../../../services/gridTableEvents');

    const metaHelper = require('../../../helpers/meta.helper');
    const metaService = require('../../../services/metaService');

    const instrumentService = require('../../../services/instrumentService');
    const instrumentAttributeTypeService = require('../../../services/instrument/instrumentAttributeTypeService');

    module.exports = function instrumentTypeFactorsTabController ($scope, $mdDialog, multitypeFieldService, gridTableHelperService) {
        var vm = this;
        vm.entity = $scope.$parent.vm.entity;

        vm.readyStatus = {
            factors: false
        }

        console.log('#116 vm.entity', vm.entity)

        const multitypeFieldsForRows = instrumentService.getInstrumentFactorsMultitypeFieldsData();

        const getFactorsScheduleData = () => {
            if (vm.entity.instrument_factor_schedule_data) {
                return JSON.parse(vm.entity.instrument_factor_schedule_data);
            }

            const defaultFactorsScheduleData = [
                {
                    key: 'date',
                    name: 'Date',
                    to_show: true,
                    override_name: '',
                    tooltip: '',
                    default_value_type: 40,
                    default_value: ''
                },
                {
                    key: 'position_factor',
                    name: 'Position factor',
                    to_show: true,
                    override_name: '',
                    tooltip: '',
                    default_value_type: 20,
                    default_value: ''
                },
                {
                    key: 'factor1',
                    name: 'Factor 1',
                    to_show: true,
                    override_name: '',
                    tooltip: '',
                    default_value_type: 20,
                    default_value: ''
                },
                {
                    key: 'factor2',
                    name: 'Factor 2',
                    to_show: true,
                    override_name: '',
                    tooltip: '',
                    default_value_type: 20,
                    default_value: ''
                },
                {
                    key: 'factor3',
                    name: 'Factor 3',
                    to_show: true,
                    override_name: '',
                    tooltip: '',
                    default_value_type: 20,
                    default_value: ''
                },
            ];

            return defaultFactorsScheduleData;
        }

        const getFactorsGridTableData = (rows) => {

            const factorsGridTableData = {
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
                            objPath: ['name'],
                            columnName: 'Name',
                            order: 0,
                            cellType: 'readonly_text',
                            settings: {
                                value: null
                            },
                            classes: 'grid-table-cell-right-border',
                            styles: {
                                'grid-table-cell': {'width': '318px'}
                            }
                        },
                        {
                            key: 'to_show',
                            objPath: ['to_show'],
                            columnName: 'Show',
                            order: 1,
                            cellType: 'checkbox',
                            settings: {
                                value: null
                            },
                            styles: {
                                'grid-table-cell': {'width': '68px'}
                            }

                        },
                        {
                            key: 'override_name',
                            objPath: ['override_name'],
                            columnName: 'Override Name',
                            order: 2,
                            cellType: 'text',
                            settings: {
                                value: null,
                                closeOnMouseOut: false,
                                isDisabled: false
                            },
                            styles: {
                                'grid-table-cell': {'width': '266px'}
                            }
                        },
                        {
                            key: 'tooltip',
                            objPath: ['tooltip'],
                            columnName: 'Tooltip',
                            order: 3,
                            cellType: 'text',
                            settings: {
                                value: null,
                                closeOnMouseOut: false,
                                isDisabled: false
                            },
                            styles: {
                                'grid-table-cell': {'width': '266px'}
                            }
                        },
                        {
                            key: 'default_value',
                            objPath: ['default_value'],
                            columnName: 'Default Value',
                            order: 4,
                            cellType: 'multitypeField',
                            settings: {
                                value: [null, null],
                                fieldTypesData: null,
                            },
                            styles: {
                                'grid-table-cell': {'width': '266px'}
                            }
                        },
                    ],
                },
                components: {
                    topPanel: false,
                    rowCheckboxes: false
                }
            };

            const rowObj = metaHelper.recursiveDeepCopy(factorsGridTableData.templateRow, true);

            factorsGridTableData.header.columns = rowObj.columns.map(column => {

                const headerCol = {
                    key: column.key,
                    columnName: column.columnName,
                    order: column.order,
                    styles: {
                        'grid-table-cell': {'width': column.styles['grid-table-cell'].width}
                    }
                };

                if (column.classes) {

                    let columnClasses = column.classes;
                    if (Array.isArray(column.classes)) columnClasses = [...[], ...columnClasses];

                    headerCol.classes = columnClasses;

                }

                if (column.key === 'to_show') headerCol.styles['text-align'] = 'center';

                return headerCol;

            });

            factorsGridTableData.body = rows.map((row, index) => {

                const rowObj = metaHelper.recursiveDeepCopy(factorsGridTableData.templateRow, true);

                rowObj.order = index;
                rowObj.key = row.key;

                const nameCell = gridTableHelperService.getCellFromRowByKey(rowObj, 'name');
                nameCell.settings.value = row.name;

                const toShowCell = gridTableHelperService.getCellFromRowByKey(rowObj, 'to_show');
                toShowCell.settings.value = row.to_show;

                const overrideNameCell = gridTableHelperService.getCellFromRowByKey(rowObj, 'override_name');
                overrideNameCell.settings.value = row.override_name;

                const tooltipCell = gridTableHelperService.getCellFromRowByKey(rowObj, 'tooltip');
                tooltipCell.settings.value = row.tooltip;

                const defaultValueCell = gridTableHelperService.getCellFromRowByKey(rowObj, 'default_value');

                if (multitypeFieldsForRows[row.key] && multitypeFieldsForRows[row.key].fieldTypesList) {

                    const cellValue = row.default_value;
                    const cellValueType = row.default_value_type
                    const fields = multitypeFieldsForRows[row.key].fieldTypesList;
                    const defaultValueCellData = gridTableHelperService.getMultitypeFieldDataForCell(fields, defaultValueCell, cellValue, cellValueType);

                    Object.assign(defaultValueCell, defaultValueCellData);

                }

                return rowObj

            })


            return factorsGridTableData;
        }

        const onFactorsTableCellChange = (data, gtDataService) => {

            const cell = gtDataService.getCellByKey(data.row.order, data.column.key);
            const path = cell.objPath[0];

            vm.factorsData[data.row.order][path] = cell.settings.value;

            if (cell.key === 'default_value' && cell.cellType === 'multitypeField') {

                const activeType = cell.settings.fieldTypesData.find(type => type.isActive);
                vm.factorsData[data.row.order].default_value_type = activeType.value_type;

            }

            vm.entity.instrument_factor_schedule_data = JSON.stringify(vm.factorsData);
            console.log('#116 onFactorsTableCellChange vm.entity', vm.entity)
            console.log('#116 vm.entity.instrument_factor_schedule_data', JSON.parse(vm.entity.instrument_factor_schedule_data))

        };

        const createFactorsGridTable = (factorsData) => {

            vm.factorsGridTableDataService = new GridTableDataService();
            vm.factorsGridTableEventService = new GridTableEventService();

            const factorsGridTableData = getFactorsGridTableData(factorsData);
            console.log('#116 factorsGridTableData', factorsGridTableData)

            vm.factorsGridTableDataService.setTableData(factorsGridTableData);

            vm.factorsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
                onFactorsTableCellChange(argumentsObj, vm.factorsGridTableDataService)
            });

        };

        const getInstrumentAttrTypes = function () {

            let options = {
                pageSize: 1000,
                page: 1
            };

            return metaService.loadDataFromAllPages(instrumentAttributeTypeService.getList, [options]);

        };

        const init = function () {

            vm.factorsData = getFactorsScheduleData();

            getInstrumentAttrTypes().then(data => {

                // inject instrument attributes to menu options in multitype fields
                const instrumentAttrTypes = data;
                multitypeFieldService.fillSelectorOptionsBasedOnValueType(instrumentAttrTypes, multitypeFieldsForRows);

                createFactorsGridTable(vm.factorsData);

                vm.readyStatus.factors = true;

            })

        }

        init();

    }
}());
