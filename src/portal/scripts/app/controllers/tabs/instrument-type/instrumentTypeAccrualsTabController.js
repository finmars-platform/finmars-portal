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

        vm.readyStatus = {
            periodicityItems: false,
            accrualModels: false,

            gritTable: false
        };

		vm.accordionActionsMenu =
			'<div class="ev-editor-tabs-popup-content popup-menu">' +
				'<md-button class="entity-tabs-menu-option popup-menu-option" ' +
						   'ng-click="popupData.deletePane(popupData.item, $event, _$popup)">DELETE</md-button>' +
			'</div>' +
			'<div class="ev-editor-tabs-popup-content popup-menu">' +
				'<md-button class="entity-tabs-menu-option popup-menu-option" ' +
						   'ng-click="popupData.makeCopy(popupData.item, _$popup)">MAKE COPY</md-button>' +
			'</div>';

        vm.onNameFocus = function (event) {
            var textAreaElement = event.target;

            textAreaElement.addEventListener('keydown', function (evt) { // TODO Must I remove listeners? And what event?
                evt.stopPropagation();
            })
        };

        var onAccrualTableCellChange = function (data, gtDataService, gtEventService) {

            var tableData = gtDataService.getTableData();
            var gtRow = gtDataService.getRowByKey(data.row.key);

            gtRow.columns.forEach(function (gtColumn) {

                if (gtColumn.settings) {
                    vm.entity.accruals[tableData.index].data.items[data.row.order][gtColumn.key] = gtColumn.settings.value;
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
                            objPath: ['name'],
                            columnName: 'Name',
                            order: 0,
                            cellType: 'text',
                            settings: {
                                value: null,
                                closeOnMouseOut: false,
                                isDisabled: true
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
                            key: 'default_value',
							objPath: ['default_value'],
                            columnName: 'Default Value',
                            order: 2,
                            cellType: 'selector',
                            settings: {
                                value: null,
                                selectorOptions: []
                            },
                            styles: {
                                'grid-table-cell': {'width': '266px'}
                            }
                        },
                        {
                            key: 'override_name',
							objPath: ['override_name'],
                            columnName: 'Override Name',
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
							key: 'tooltip',
							objPath: ['tooltip'],
							columnName: 'Tooltip',
							order: 4,
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
                            key: 'options_settings',
                            columnName: '',
                            order: 5,
                            cellType: 'empty',
                            styles: {
                                'grid-table-cell': {'width': '48px'}
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
                objPath: ['options'],
                columnName: '',
                order: 4,
                cellType: 'customPopup',
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
				rowObj.columns[4].settings.value = row.tooltip;

                if (row.options) {

                    const optionsCell = metaHelper.recursiveDeepCopy(optionsColumn, false);

                    rowObj.columns[5] = optionsCell;
                    rowObj.columns[5].settings.value = row.options;

                }

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
                index: vm.entity.accruals.length,
                autogenerate: true,
                data: {
                    form_message: "",
                    items: [
                        {key: 'notes', name: 'Notes', to_show: true, defaultValueType: 'text', options: false},
                        {key: 'accrual_start_date', name: 'First accrual date', to_show: true, defaultValueType: 'date', options: false},
                        {key: 'first_payment_date', name: 'First payment date', to_show: true,  defaultValueType: 'date', options: false},
                        {key: 'accrual_size', name: 'Accrual size', to_show: true, defaultValueType: 'number', options: false},
                        {key: 'periodicity', name: 'Periodicity', to_show: true, defaultValueType: 'selector', selectorOptions: vm.periodicityItems, options: periodicitySelectorOptions},
                        {key: 'accrual_calculation_model', name: 'Accrual model', to_show: true, defaultValueType: 'selector', selectorOptions: vm.accrualModels, options: accrualModelsSelectorOptions},
                        {key: 'periodicity_n', name: 'Periodic N', to_show: true, defaultValueType: 'number', options: false},
                    ]
                }
            };

            accrual.accrualsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
                onAccrualTableCellChange(argumentsObj, accrual.accrualsGridTableDataService, accrual.accrualsGridTableEventService);
            });

            var accrualGridTableData = getAccrualsGridTableData(accrual);

            accrualGridTableData.index = vm.entity.accruals.length;
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

		vm.moveDown = function (item, $event) {

			$event.stopPropagation();

			if (vm.entity.accruals[item.index + 1]) {

				const swap = item;

				vm.entity.accruals[item.index] = vm.entity.accruals[item.index + 1];
				vm.entity.accruals[item.index].index = item.index;

				vm.entity.accruals[item.index + 1] = swap;
				vm.entity.accruals[item.index + 1].index = item.index + 1;

			}

		};

		vm.moveUp = function (item, $event) {

			$event.stopPropagation();

			if (vm.entity.accruals[item.index - 1]) {

				const swap = item;

				vm.entity.accruals[item.index] = vm.entity.accruals[item.index - 1];
				vm.entity.accruals[item.index].index = item.index;

				vm.entity.accruals[item.index - 1] = swap;
				vm.entity.accruals[item.index - 1].index = item.index - 1;

			}

		};

        vm.deletePane = function (item, $event, _$popup) {

            $event.stopPropagation();

            var description = 'Are you sure to delete this accrual?';

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                multiple: true,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: description
                    }
                }
            }).then(res => {

				if (res.status === 'agree') {

					vm.entity.accruals.splice(item.index, 1);
					vm.entity.accruals.forEach((accrual, index) => accrual.index = index);

				}

            });

			_$popup.cancel();

        };

		vm.makeCopy = function (accrualToCopy, _$popup) {

			_$popup.cancel();

			const accrualIndex = accrualToCopy.index;
			const accrualCopy = JSON.parse(angular.toJson(accrualToCopy));

			delete accrualCopy.id;
			/* delete eventCopy.eventItemsGridTableDataService;
			delete eventCopy.eventItemsGridTableEventService;

			delete eventCopy.eventBlockableItemsGridTableDataService;
			delete eventCopy.eventBlockableItemsGridTableEventService;

			delete eventCopy.eventActionsGridTableDataService;
			delete eventCopy.eventActionsGridTableEventService; */

			// delete eventCopy.index;
			let accrualCopyName = accrualToCopy.name + ' (Copy)';

			let a = 0, nameOccupied = true;
			while (nameOccupied) { // check that copy name is unique

				nameOccupied = false;

				const copyWithSameName = vm.entity.accruals.find(accrual => accrual.name === accrualCopyName);

				if (copyWithSameName) {

					a++;

					accrualCopyName = accrualToCopy.name + ' (Copy ' + a + ')';
					nameOccupied = true;

				}

			}

			accrualCopy.name = accrualCopyName;

			formatExistingAccrual(accrualCopy, accrualCopy.index);

			vm.entity.accruals.splice(accrualIndex + 1, 0, accrualCopy);
			vm.entity.accruals.forEach((accrual, index) => accrual.index = index);

		};

        const periodicityItemsPromise = instrumentPeriodicityService.getList().then(data => {
            vm.periodicityItems = data;
        });

        const accrualModelsPromise = accrualCalculationModelService.getList().then(data => {
            vm.accrualModels = data;
        });

        const formatExistingAccrual = function (accrual, accrualIndex) {

			accrual.accrualsGridTableDataService = new GridTableDataService();
			accrual.accrualsGridTableEventService = new GridTableEventService();

			var accrualsGridTableData = getAccrualsGridTableData(accrual);

			accrualsGridTableData.index = accrualIndex;

			accrual.accrualsGridTableDataService.setTableData(accrualsGridTableData);

			accrual.accrualsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
				onAccrualTableCellChange(argumentsObj, accrual.accrualsGridTableDataService, accrual.accrualsGridTableEventService);
			});

		};

        var init = function () {

        	Promise.all([periodicityItemsPromise, accrualModelsPromise]).then(() => {

                vm.entity.accruals.forEach(function (item, index) {

                    if (item.data) formatExistingAccrual(item, index);

                })

                vm.readyStatus.gridTable = true;
            })

        }

        init();

    }

}());