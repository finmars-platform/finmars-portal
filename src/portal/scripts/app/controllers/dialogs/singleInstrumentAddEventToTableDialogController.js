/**
 * Created by vzubr on 01.10.2020.
 */
(function () {

    'use strict';

	const instrumentService = require('../../services/instrumentService');
	const transactionTypeService = require('../../services/transactionTypeService');
	const gridTableEvents = require('../../services/gridTableEvents');

	const GridTableDataService = require('../../services/gridTableDataService');
	const GridTableEventService = require('../../services/gridTableEventService');

	const metaHelper = require('../../helpers/meta.helper');
    // var gridTableHelperService = require('../../helpers/gridTableHelperService');

    module.exports = function singleInstrumentAddEventToTableDialogController($scope, $mdDialog, gridTableHelperService, multitypeFieldService, data) {

    	let vm = this;

        vm.readyStatus = {
        	actionsGridTable: false
		};

        vm.event = data.event;
        vm.eventClasses = data.eventClasses;
        vm.notificationClasses = data.notificationClasses;
        vm.periodicityItems = data.periodicityItems;

        vm.transactionTypes = [];

        const instrAttrTypes = data.instrumentAttrTypes;
        let multitypeFieldsData = instrumentService.getInstrumentEventsMultitypeFieldsData();

        const getRangeOfNumbers = function (number) {
            var buttonPositions = [
            	{
            		id: 1,
					name: 1
            	}
            ];

            for (var i = 2; i <= number; i++) {
                buttonPositions.push({id: i, name: i});
            }

            return buttonPositions;
        };

		const onActionsTableAddRow = function () {

            var newRow = vm.eventActionsGridTableData.body[0];

            var newAction = {
                "transaction_type": '',
                "text": '',
                "is_sent_to_pending": false,
                "is_book_automatic": false,
                "button_position": '',
                frontOptions: {newRow: true, gtKey: newRow.key}
            };

            vm.event.actions.unshift(newAction);

            var transactionType = gridTableHelperService.getCellFromRowByKey(newRow, 'transaction_type');
            transactionType.settings.selectorOptions = vm.transactionTypes;

            var buttonPosition = gridTableHelperService.getCellFromRowByKey(newRow, 'button_position');
            buttonPosition.settings.selectorOptions = getRangeOfNumbers(vm.event.actions.length);

            // Update rows in actions grid table
            vm.event.actions.forEach(function (action, actionIndex) {
                vm.eventActionsGridTableData.body[actionIndex].order = actionIndex;
            });

        };

		const onActionsTableDeleteRows = function (data) {

            vm.event.actions = vm.event.actions.filter(function (action) {

                var actionId = action.id || action.frontOptions.gtKey;
                return data.deletedRowsKeys.indexOf(actionId) === -1;
            });

            // Update rows in actions grid table
            vm.event.actions.forEach(function (action, actionIndex) {
                vm.eventActionsGridTableData.body[actionIndex].order = actionIndex;
            });

        };

		const onActionsTableCellValueChanged = function (argObj) {

            var rowOrder = argObj.row.order,
                colOrder = argObj.column.order;

            gridTableHelperService.onGridTableCellChange(
                vm.event.actions,
                vm.eventActionsGridTableDataService,
                rowOrder, colOrder
            );

        }

        // Event actions grid table
        vm.eventActionsGridTableData = {
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
                            selectorOptions: [],
                        },
                        styles: {
                            'grid-table-cell': {'width': '130px'}
                        }
                    },

                ]

            },

            components: {
                topPanel: {
					addButton: true,
                    filters: false,
                    columns: false,
                    search: false
                },
				rowCheckboxes: true
            }

        };

		const formatDataForActionsGridTable = function () {

            // assemble header columns
            var rowObj = metaHelper.recursiveDeepCopy(vm.eventActionsGridTableData.templateRow, true);

            vm.eventActionsGridTableData.header.columns = rowObj.columns.map(function (column) {

                var headerData = {
                    key: column.key,
                    columnName: column.columnName,
                    order: column.order,
                    sorting: true,
                    styles: {
                        'grid-table-cell': {'width': column.styles['grid-table-cell'].width}
                    }
                };

                if (column.key === 'is_sent_to_pending' || column.key === 'is_book_automatic') {
                	// Object.assign(headerData.styles['grid-table-cell'], {'text-align': 'center'});
					headerData.styles['grid-table-cell']['text-align'] = 'center';
                }

                return headerData;

            });
            // < assemble header columns >

            // assemble body rows
            vm.event.actions.forEach(function (action, actionIndex) {

            	rowObj = metaHelper.recursiveDeepCopy(vm.eventActionsGridTableData.templateRow, true);
                rowObj.key = action.id || action.frontOptions.gtKey;
				rowObj.newRow = !!(rowObj.frontOptions && rowObj.frontOptions.newRow);
                rowObj.order = actionIndex;

                var transactionType = gridTableHelperService.getCellFromRowByKey(rowObj, 'transaction_type');
                transactionType.settings.value = action.transaction_type;
                transactionType.settings.selectorOptions = vm.transactionTypes || [];

                var text = gridTableHelperService.getCellFromRowByKey(rowObj, 'text');
                text.settings.value = action.text;

                var isSendToPending = gridTableHelperService.getCellFromRowByKey(rowObj, 'is_sent_to_pending');
                isSendToPending.settings.value = action.is_sent_to_pending;

                var isBookAutomatic = gridTableHelperService.getCellFromRowByKey(rowObj, 'is_book_automatic');
                isBookAutomatic.settings.value = action.is_book_automatic;

                var buttonPosition = gridTableHelperService.getCellFromRowByKey(rowObj, 'button_position');
                buttonPosition.settings.value = action.button_position;
                buttonPosition.settings.selectorOptions = getRangeOfNumbers(vm.event.actions.length);

                vm.eventActionsGridTableData.body.push(rowObj);

            });
            // < assemble body rows >
        };
        // < Event actions grid table >

		const initGridTableEvents = function () {

            vm.eventActionsGridTableEventService.addEventListener(gridTableEvents.ROW_ADDED, onActionsTableAddRow);

            vm.eventActionsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, onActionsTableCellValueChanged);

            vm.eventActionsGridTableEventService.addEventListener(gridTableEvents.ROW_DELETED, onActionsTableDeleteRows);

        };

		const collectDataFromMultitypeFields = function () {

			Object.keys(multitypeFieldsData).forEach(fieldKey => {

				const fieldData = multitypeFieldsData[fieldKey];
				const activeType = fieldData.fieldTypesList.find(type => type.isActive);

				vm.event[fieldKey] = activeType.model;
				vm.event[fieldKey + '_value_type'] = activeType.value_type;

			});

		};

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

        	var hashTableOfButtonPositions = {};
            var buttonPositionNotValid = false;

			collectDataFromMultitypeFields();

            for (var i = 0; i < vm.event.actions.length; i++) {

            	var prop = vm.event.actions[i].button_position;

                if ((!prop && prop !== 0) || hashTableOfButtonPositions.hasOwnProperty(prop)) {

					buttonPositionNotValid = true;
                    break;

                } else {
                    hashTableOfButtonPositions[prop] = i;
                }

            }

            if (buttonPositionNotValid) {

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/dialogs/warning-dialog-view.html',
                    parent: angular.element(document.body),
                    //targetEvent: $event,
                    clickOutsideToClose: false,
                    multiple: true,
                    locals: {
                        warning: {
                            title: 'Warning',
                            description: 'Button position should contain unique value.'
                        }
                    }
                })

            }

            else {

                $mdDialog.hide({
                    status: 'agree', data: {
                        event: vm.event
                    }
                });

            }

        };

        const getTransactionTypes = function () {

        	let ttypeList = [];

        	let options = {
				pageSize: 1000,
				page: 1
			}

			const loadAllPages = (resolve, reject) => {

        		transactionTypeService.getListLight(options).then(function (data) {

					ttypeList = ttypeList.concat(data.results);

					if (data.next) {

						options.page = options.page + 1;
						loadAllPages(resolve, reject);

					} else {
						resolve(ttypeList);
					}

				}).catch(error => reject(error));

			};

			return new Promise((resolve, reject) => {

				loadAllPages(resolve, reject);

			});

		}

        vm.init = function () {

			multitypeFieldService.fillSelectorOptionsBasedOnValueType(instrAttrTypes, multitypeFieldsData);

			vm.effectiveDateFieldTypes = multitypeFieldsData.effective_date.fieldTypesList;
			multitypeFieldService.setActiveTypeByValueType(vm.effectiveDateFieldTypes, vm.event.effective_date, vm.event.effective_date_value_type,);

			vm.finalDateFieldTypes = multitypeFieldsData.final_date.fieldTypesList;
			multitypeFieldService.setActiveTypeByValueType(vm.finalDateFieldTypes, vm.event.final_date, vm.event.final_date_value_type,);

			vm.periodicityNFieldTypes = multitypeFieldsData.periodicity_n.fieldTypesList;
			multitypeFieldService.setActiveTypeByValueType(vm.periodicityNFieldTypes, vm.event.periodicity_n, vm.event.periodicity_n_value_type,);

			vm.eventActionsGridTableDataService = new GridTableDataService();
            vm.eventActionsGridTableEventService = new GridTableEventService();

            initGridTableEvents();

            // transactionTypeService.getListLight({pageSize: 1000}).then(function (data) {
			getTransactionTypes().then(data => {

            	// vm.transactionTypes = data.results;
				vm.transactionTypes = data;

				formatDataForActionsGridTable();

				vm.eventActionsGridTableDataService.setTableData(vm.eventActionsGridTableData);

				vm.readyStatus.actionsGridTable = true

				$scope.$apply();

			});

        };

        vm.init();

    }

}());