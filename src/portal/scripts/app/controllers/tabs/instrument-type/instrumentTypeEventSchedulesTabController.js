/**
 * Created by szhitenev on 18.02.2021.
 */
(function () {

    'use strict';

    var metaService = require('../../../services/metaService');
    var metaNotificationClassService = require('../../../services/metaNotificationClassService');
    var metaEventClassService = require('../../../services/metaEventClassService');
    var instrumentPeriodicityService = require('../../../services/instrumentPeriodicityService');
    var GridTableDataService = require('../../../services/gridTableDataService');
    var GridTableEventService = require('../../../services/gridTableEventService');
    var transactionTypeService = require('../../../services/transactionTypeService');
    var instrumentAttributeTypeService = require('../../../services/instrument/instrumentAttributeTypeService');
    var gridTableEvents = require('../../../services/gridTableEvents');

    var metaHelper = require('../../../helpers/meta.helper');
    var md5Helper = require('../../../helpers/md5.helper');
    var GridTableHelperService = require('../../../helpers/gridTableHelperService');

    var eventObj = {
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

    module.exports = function instrumentTypeEventSchedulesTabController($scope, $mdDialog) {

        var vm = this;

        vm.entity = $scope.$parent.vm.entity;

        var gridTableHelperService = new GridTableHelperService();

        vm.readyStatus = {
            notificationClasses: false,
            eventClasses: false,
            eventSchedulesReady: false,
            gritTable: false
        };

        vm.transactionTypes = [];

        const getTransactionTypes = function () {

            let options = {
                pageSize: 1000,
                page: 1
            };

            return metaService.loadDataFromAllPages(transactionTypeService.getListLight, [options]);

        }

        const getInstrumentAttrTypes = function () {

        	let options = {
				pageSize: 1000,
				page: 1
			};

			return metaService.loadDataFromAllPages(instrumentAttributeTypeService.getList, [options]);

		}

        var getNotificationClasses = metaNotificationClassService.getList().then(function (data) {
            vm.notificationClasses = data;
            vm.readyStatus.notificationClasses = true;
        });

        var getEventClasses = metaEventClassService.getList().then(function (data) {
            vm.eventClasses = data;
            vm.readyStatus.eventClasses = true;
        });

        var getInstrumentPeriodicityItems = instrumentPeriodicityService.getList().then(function (data) {
            vm.periodicityItems = data;
            vm.readyStatus.periodicityItems = true;
        });

        let instrumentAttrTypes;

        vm.selectorOptionsMap = {
            'notification_class': vm.notificationClasses,
            'periodicity': vm.periodicityItems
        }

        const multitypeFieldsForRows = {
			'effective_date': [
				{
                    'model': "",
				    'fieldType': 'dateInput',
                    'isDefault': true,
                    'isActive': true,
                    'sign': '<div class="multitype-field-type-letter">A</div>',
					'fieldData': {
						'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
					}
                },
				{
                    'model': null,
				    'fieldType': 'dropdownSelect',
                    'isDefault': false,
                    'isActive': false,
                    'sign': '<div class="multitype-field-type-letter">L</div>',
					'fieldData': {
						'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
					}
				}
			],
			'final_date': [
                {
                    'model': "",
                    'fieldType': 'dateInput',
                    'isDefault': true,
                    'isActive': true,
                    'sign': '<div class="multitype-field-type-letter">A</div>',
					'fieldData': {
						'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
					}
                },
                {
                    'model': null,
                    'fieldType': 'dropdownSelect',
                    'isDefault': false,
                    'isActive': false,
                    'sign': '<div class="multitype-field-type-letter">L</div>',
					'fieldData': {
						'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
					}
                }
            ],
			'periodic_n': [
                {
                    'model': null,
                    'fieldType': 'numberInput',
                    'isDefault': true,
                    'isActive': true,
                    'sign': '<div class="multitype-field-type-letter">A</div>',
					'fieldData': {
						'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
					}
                },
                {
                    'model': null,
                    'fieldType': 'dropdownSelect',
                    'isDefault': false,
                    'isActive': false,
                    'sign': '<div class="multitype-field-type-letter">L</div>',
					'fieldData': {
						'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
					}
                }
            ]
		};

        vm.checkReadyStatus = function () {
            return vm.readyStatus.notificationClasses && vm.readyStatus.eventClasses && vm.readyStatus.eventSchedulesReady;
        };

        const onDefaultValueMultitypeFieldChange = function (rowData, colData, gtDataService, gtEventService) {

			const changedCell = gtDataService.getCell(rowData.order, colData.order);
			const activeType = changedCell.settings.fieldTypesData.find(type => type.isActive);

			const tableData = gtDataService.getTableData();

			const defValType = (activeType.fieldType === 'dropdownSelect') ? 'dynamic_attribute' : 'text';
			vm.entity.events[tableData.index].data.items[rowData.order].default_value_type = defValType;

		};

        const onEventTableCellChange = function (data, gtDataService, gtEventService) {

            var tableData = gtDataService.getTableData();
            var gtRow = gtDataService.getRowByKey(data.row.key);

            var cell = gtDataService.getCellByKey(data.row.order, data.column.key)
            var path = cell.objPath[0]
            
            console.log('onEventTableCellChange.tableData', tableData);

            vm.entity.events[tableData.index].data.items[data.row.order][path] = cell.settings.value;


        };

        var getEventsGridTableData = function (item) {

            const rows = item.data.items;

            const eventsGridTableData = {
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
                            styles: {
                                'grid-table-cell': {'width': '165px'}
                            }
                        },
                        {
                            key: 'to_show',
                            objPath: ['to_show'],
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
                            objPath: ['default_value'],
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
                                'grid-table-cell': {'width': '165px'}
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
                                'grid-table-cell': {'width': '165px'}
                            }
                        },
                        {
                            key: 'options_settings',
                            columnName: 'Options',
                            order: 5,
                            cellType: 'empty',
                            styles: {
                                'grid-table-cell': {'width': '65px'}
                            }
                        },
                    ],
                },
                components: {
                    topPanel: false,
                    rowCheckboxes: false
                }
            };

            var optionsColumn = {
                key: 'options_settings',
                objPath: ['options'],
                columnName: '',
                order: 5,
                cellType: 'customPopup',
                settings: {
                    value: null,
                    closeOnMouseOut: false,
                    cellText: '...',
                    popupSettings: {
                        contentHtml: {
                            main: "<div ng-include src=\"'views/directives/gridTable/cells/popups/instrument-selector-options-display-settings.html'\"></div>"
                        },
                        classes: "ev-instr-events-settings-popup"
                    }
                },
                styles: {
                    'grid-table-cell': {'width': '65px'}
                }
            };

            const rowObj = metaHelper.recursiveDeepCopy(eventsGridTableData.templateRow, true);
            eventsGridTableData.header.columns = rowObj.columns.map(column => {
                return {
                    key: column.key,
                    columnName: column.columnName,
                    order: column.order,
                    styles: {
                        'grid-table-cell': {'width': column.styles['grid-table-cell'].width}
                    }
                };
            })

            eventsGridTableData.body = rows.map((row, index) => {

            	const rowObj = metaHelper.recursiveDeepCopy(eventsGridTableData.templateRow, true);

                rowObj.order = index;
				rowObj.newRow = !!(rowObj.frontOptions && rowObj.frontOptions.newRow);
                rowObj.key = row.key;

                rowObj.columns[0].settings.value = row.name;
                rowObj.columns[1].settings.value = row.to_show;

                rowObj.columns[2].settings.value = row.default_value;

                if (row.defaultValueType === 'selector') {
					rowObj.columns[2].settings.selectorOptions = vm.selectorOptionsMap[rowObj.columns[2].key];
				}

                else if (row.defaultValueType === 'multitypeField') {

                    rowObj.columns[2].cellType = 'multitypeField';

					const multitypeFieldData = multitypeFieldsForRows[rowObj.key];

					rowObj.columns[2].settings = {
						value: null,
						fieldTypesData: multitypeFieldData
					};

					rowObj.columns[2].methods = {
						onChange: onDefaultValueMultitypeFieldChange
					};

				}

                rowObj.columns[3].settings.value = row.override_name;
                rowObj.columns[4].settings.value = row.tooltip;

                if (row.options) {

                    const optionsCell = metaHelper.recursiveDeepCopy(optionsColumn, false);

                    rowObj.columns[5] = optionsCell;
                    rowObj.columns[5].settings.value = row.options;

                }

                return rowObj;

            })

            return eventsGridTableData;

        };

        var getEventsActionGridTableData = function (item){
            console.log('getEventsActionGridTableData.item', item)

            const rows = item.data.actions;

            console.log('getEventsActionGridTableData.rows', rows)

            const eventActionsGridTableData = {
                header: {
                    order: 'header',
                    columns: []
                },
                body: [],
                templateRow: {
                    isActive: false,
                    columns: [
                        {
                            key: 'transaction_type',
                            objPath: ['transaction_type'],
                            columnName: 'Transaction type',
                            order: 0,
                            cellType: 'selector',
                            settings: {
                                value: null,
                                // selectorOptions: vm.transactionTypes,
								selectorOptions: [],
                            },
                            styles: {
                                'grid-table-cell': {'width': '260px'}
                            }
                        },
                        {
                            key: 'text',
                            objPath:['text'],
                            columnName: 'Text',
                            order: 1,
                            cellType: 'text',
                            settings: {
                                value: null
                            },
                            styles: {
                                'grid-table-cell': {'width': '220px'}
                            }
                        },
                        {
                            key: 'is_sent_to_pending',
                            objPath: ['is_sent_to_pending'],
                            columnName: 'Sent to pending',
                            order: 2,
                            cellType: 'checkbox',
                            settings: {
                                value: null
                            },
                            styles: {
                                'grid-table-cell': {'width': '130px'},
                            }
                        },
                        {
                            key: 'is_book_automatic',
                            objPath: ['is_book_automatic'],
                            columnName: 'Book automatic',
                            order: 3,
                            cellType: 'checkbox',
                            settings: {
                                value: null
                            },
                            styles: {
                                'grid-table-cell': {'width': '130px'},
                            }
                        },
                        {
                            key: 'button_position',
                            objPath: ['button_position'],
                            columnName: 'Button position',
                            order: 4,
                            cellType: 'selector',
                            settings: {
                                value: null,
                                selectorOptions: getRangeOfNumbers(item.data.actions.length),
                            },
                            styles: {
                                'grid-table-cell': {'width': '130px'}
                            }
                        },

                    ]

                },

                components: {
                    topPanel: {
                        filters: false,
                        columns: false,
                        search: false
                    },
					dragAndDropElement: true
                }

            };

            const rowObj = metaHelper.recursiveDeepCopy(eventActionsGridTableData.templateRow, true);
			eventActionsGridTableData.header.columns = rowObj.columns.map(column => {

                return {
                    key: column.key,
                    columnName: column.columnName,
                    order: column.order,
                    styles: {
                        'grid-table-cell': {'width': column.styles['grid-table-cell'].width}
                    }
                };
            })

			eventActionsGridTableData.body = rows.map((row, index) => {
                const rowObj = metaHelper.recursiveDeepCopy(eventActionsGridTableData.templateRow, true);

                rowObj.order = index;
                rowObj.key = row.key;

                rowObj.columns[0].settings.value = row.transaction_type;
                rowObj.columns[1].settings.value = row.text;
                rowObj.columns[2].settings.value = row.is_sent_to_pending;
                rowObj.columns[3].settings.value = row.is_book_automatic;
                rowObj.columns[4].settings.value = row.button_position;

                return rowObj

            })

            return eventActionsGridTableData;

        }


        vm.deletePane = function (item, $index, $event) {

            $event.stopPropagation();
            var description = 'Are you sure to delete this action?';

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
                    vm.entity.events.splice($index, 1);
                }
            });
        };

        vm.moveDown = function (item, $index, $event) {

            $event.stopPropagation();

            var swap = JSON.parse(JSON.stringify(item));
            vm.entity.events[$index] = vm.entity.events[$index + 1];
            vm.entity.events[$index + 1] = swap;

        };

        vm.moveUp = function (item, $index, $event) {

            $event.stopPropagation();

            var swap = JSON.parse(JSON.stringify(item));
            vm.entity.events[$index] = vm.entity.events[$index - 1];
            vm.entity.events[$index - 1] = swap;

        };

        vm.createInstrumentTypeEvent = function () {

            if (!vm.entity.events) {
                vm.entity.events = []
            }

            const mapOptions = function (item) {
                return {
                    user_code: item.user_code,
                    name: item.name,
                    to_show: true,
                    override_name: "",
                };
            };

            var periodicitySelectorOptions = vm.periodicityItems.map(mapOptions);
            var notificationClassesSelectorOptions = vm.notificationClasses.map(mapOptions)

            var event = {
                eventsGridTableDataService: new GridTableDataService(),
                eventsGridTableEventService: new GridTableEventService(),
                eventActionsGridTableDataService: new GridTableDataService(),
                eventActionsGridTableEventService: new GridTableEventService(),
                order: vm.entity.events.length,
                autogenerate: true,
                data: {
                    form_message: "",
                    event_class: null,
                    items: [
                        {key: 'name', name: 'Title', to_show: true, defaultValueType: 'text', options: false},
                        {
                            key: 'description',
                            name: 'Message text',
                            to_show: true,
                            defaultValueType: 'text',
                            options: false
                        },
                        {
                            key: 'notification_class',
                            name: 'Notification Class',
                            to_show: true,
                            defaultValueType: 'selector',
                            options: notificationClassesSelectorOptions
                        },
                        {
                            key: 'notify_in_n_days',
                            name: 'Notify in N days',
                            to_show: true,
                            defaultValueType: 'number',
                            options: false
                        },
                        {
                            key: 'effective_date',
                            name: 'Effective Date',
                            to_show: true,
                            defaultValueType: 'multitypeField',
                            options: false
                        },
                        {
                            key: 'final_date',
                            name: 'Final Date',
                            to_show: true,
                            defaultValueType: 'multitypeField',
                            options: false
                        },
                        {
                            key: 'periodicity',
                            name: 'Periodicity',
                            to_show: true,
                            defaultValueType: 'selector',
                            options: periodicitySelectorOptions
                        },
                        {
                            key: 'periodic_n',
                            name: 'Periodic N',
                            to_show: true,
                            defaultValueType: 'multitypeField',
                            options: false
                        },
                    ],
                    actions: []

                }
            }

            event.eventsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
                onEventTableCellChange(argumentsObj, event.eventsGridTableDataService, event.eventsGridTableEventService);
            });

            var eventsGridTableData = getEventsGridTableData(event);

            eventsGridTableData.index = vm.entity.events.length

            event.eventsGridTableDataService.setTableData(eventsGridTableData);

            var eventsActionGridTableData = getEventsActionGridTableData(event)
            event.eventActionsGridTableDataService.setTableData(eventsActionGridTableData);

            event.eventActionsGridTableEventService.addEventListener(gridTableEvents.ROW_ADDED, function (){

                onActionsTableAddRow(event, event.eventActionsGridTableDataService, event.eventActionsGridTableEventService)
            });

            event.eventActionsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (data){

                onActionsTableCellValueChanged(data, event, event.eventActionsGridTableDataService, event.eventActionsGridTableEventService)

            });

            event.eventActionsGridTableEventService.addEventListener(gridTableEvents.ROW_DELETED, function (data){

                onActionsTableDeleteRows(data, event, event.eventActionsGridTableDataService, event.eventActionsGridTableEventService)

            });


            vm.entity.events.push(event)

        };

        vm.toggleItem = function (pane, item, $event) {

            $event.stopPropagation();

            if (!$event.target.classList.contains('ttype-action-notes-input')) {
                pane.toggle();
                item.isPaneExpanded = !item.isPaneExpanded;
            }

        };

        var getRangeOfNumbers = function (number) {
            var buttonPositions = [{id: 1, name: 1}];

            for (var i = 2; i <= number; i++) {
                buttonPositions.push({id: i, name: i});
            }

            return buttonPositions;
        };

        var onActionsTableAddRow = function (item, eventActionsGridTableDataService, eventActionsGridTableEventService) {

            console.log('item', item);

            var gridTableData = eventActionsGridTableDataService.getTableData()

            var newRow = gridTableData.body[0];
            console.log('newRow', newRow)

            var newAction = {
                "transaction_type": '',
                "text": '',
                "is_sent_to_pending": false,
                "is_book_automatic": false,
                "button_position": '',
                frontOptions: {newRow: true, gtKey: newRow.key}
            };

            item.data.actions.unshift(newAction);

            var transactionType = gridTableHelperService.getCellFromRowByKey(newRow, 'transaction_type');
            transactionType.settings.selectorOptions = vm.transactionTypes.slice(0, 19);

            var buttonPosition = gridTableHelperService.getCellFromRowByKey(newRow, 'button_position');
            buttonPosition.settings.selectorOptions = getRangeOfNumbers(item.data.actions.length);

            // Update rows in actions grid table
            item.data.actions.forEach(function (action, actionIndex) {
                gridTableData.body[actionIndex].order = actionIndex;
            });

        };

        var onActionsTableDeleteRows = function (data, item, eventActionsGridTableDataService, eventActionsGridTableEventService) {

            var gridTableData = eventActionsGridTableDataService.getTableData()

            item.data.actions = item.data.actions.filter(function (action) {

                var actionId = action.id || action.frontOptions.gtKey;
                return data.deletedRowsKeys.indexOf(actionId) === -1;
            });

            // Update rows in actions grid table
            item.data.actions.forEach(function (action, actionIndex) {
                gridTableData.body[actionIndex].order = actionIndex;
            });

        };

        var onActionsTableCellValueChanged = function (data, item, eventActionsGridTableDataService, eventActionsGridTableEventService) {

            var rowOrder = data.row.order,
                colOrder = data.column.order;

            gridTableHelperService.onGridTableCellChange(
                item.data.actions,
                eventActionsGridTableDataService,
                rowOrder, colOrder
            );

        }

        vm.init = function () {

            // getTransactionTypes().then(function (data){ // TODO refactor this

                // vm.transactionTypes = data;
				const dataPromises = [
					getTransactionTypes(),
					getInstrumentAttrTypes(),
					getNotificationClasses,
					getEventClasses,
					getInstrumentPeriodicityItems
				];

                Promise.all(dataPromises).then(function (data) {

					vm.transactionTypes = data[0];
					instrumentAttrTypes = data[1] || [];

					Object.keys(multitypeFieldsForRows).forEach(key => {

						const fieldTypeObj = multitypeFieldsForRows[key];
						const selTypeIndex = fieldTypeObj.findIndex(type => type.fieldType === 'dropdownSelect');

						const formattedAttrTypes = instrumentAttrTypes.map(attrType => {
							return {id: attrType.user_code, name: attrType.short_name};
						});

						fieldTypeObj[selTypeIndex].fieldData = {
							menuOptions: formattedAttrTypes || []
						};

					});

					vm.entity.events.forEach(function (item, index) {

						if (item.data) {

							item.eventsGridTableDataService = new GridTableDataService();
							item.eventsGridTableEventService = new GridTableEventService();

							var eventsGridTableData = getEventsGridTableData(item)
							eventsGridTableData.index = index

							item.eventsGridTableDataService.setTableData(eventsGridTableData);

							item.eventsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
								onEventTableCellChange(argumentsObj, item.eventsGridTableDataService, item.eventsGridTableEventService);
							});

							item.eventActionsGridTableDataService = new GridTableDataService();
							item.eventActionsGridTableEventService = new GridTableEventService();

							if(!item.data.actions) {
								item.data.actions = []
							}

							var eventsActionGridTableData = getEventsActionGridTableData(item)
							item.eventActionsGridTableDataService.setTableData(eventsActionGridTableData);

							item.eventActionsGridTableEventService.addEventListener(gridTableEvents.ROW_ADDED, function (){

								onActionsTableAddRow(item, item.eventActionsGridTableDataService, item.eventActionsGridTableEventService)
							});

							item.eventActionsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (data){

								onActionsTableCellValueChanged(data, item, item.eventActionsGridTableDataService, item.eventActionsGridTableEventService)

							});

							item.eventActionsGridTableEventService.addEventListener(gridTableEvents.ROW_DELETED, function (data){

								onActionsTableDeleteRows(data, item, item.eventActionsGridTableDataService, item.eventActionsGridTableEventService)

							});

						}

					})

                	vm.readyStatus.gridTable = true;

                	$scope.$apply();

            	});

            // })
        };

        vm.init();

    }

}());