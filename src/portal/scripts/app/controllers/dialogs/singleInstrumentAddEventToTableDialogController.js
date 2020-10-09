/**
 * Created by szhitenev on 29.04.2020.
 */
(function () {

    'use strict';

    var transactionTypeService = require('../../services/transactionTypeService');
    var gridTableEvents = require('../../services/gridTableEvents');
    var GridTableDataService = require('../../services/gridTableDataService');
    var GridTableEventService = require('../../services/gridTableEventService');

    var metaHelper = require('../../helpers/meta.helper');
    var GridTableHelperService = require('../../helpers/gridTableHelperService');

    module.exports = function singleInstrumentAddEventToTableDialogController($scope, $mdDialog, data) {
        var vm = this;

        var gridTableHelperService = new GridTableHelperService();

        vm.event = data.event;
        vm.eventClasses = data.eventClasses;
        vm.notificationClasses = data.notificationClasses;
        vm.periodicityItems = data.periodicityItems;

        vm.transactionTypes = [];

        var getRangeOfNumbers = function (number) {
            var buttonPositions = [{id: 1, name: 1}];

            for (var i = 2; i <= number; i++) {
                buttonPositions.push({id: i, name: i});
            }

            return buttonPositions;
        };

        var onActionsTableAddRow = function () {

            var newRow = vm.eventActionsGridTableData.body[0];
            console.log('newRow', newRow)

            var newAction = {
                "transaction_type": '',
                "text": '',
                "is_sent_to_pending": false,
                "is_book_automatic": false,
                "button_position": '',
                frontOptions: {gtKey: newRow.key}
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

        var onActionsTableDeleteRows = function (deletedRowsKeys) {


            vm.event.actions = vm.event.actions.filter(function (action) {

                var actionId = action.id || action.frontOptions.gtKey;
                return deletedRowsKeys.indexOf(actionId) === -1;
            });

            // Update rows in actions grid table
            vm.event.actions.forEach(function (action, actionIndex) {
                vm.eventActionsGridTableData.body[actionIndex].order = actionIndex;
            });

        };

        var onActionsTableCellValueChanged = function (argObj) {

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
                    filters: false,
                    columns: false,
                    search: false
                }
            }

        };

        var formatDataForActionsGridTable = function () {

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
                    Object.assign(headerData.styles['grid-table-cell'], {'text-align': 'center'})
                }



                return headerData;

            });
            // < assemble header columns >

            // assemble body rows
            vm.event.actions.forEach(function (action, actionIndex) {
                rowObj = metaHelper.recursiveDeepCopy(vm.eventActionsGridTableData.templateRow, true);
                rowObj.key = action.id;
                rowObj.order = actionIndex;

                var transactionType = gridTableHelperService.getCellFromRowByKey(rowObj, 'transaction_type');
                transactionType.settings.value = action.transaction_type;
                transactionType.settings.selectorOptions = vm.transactionTypes;

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

        var initGridTableEvents = function () {

            vm.eventActionsGridTableEventService.addEventListener(gridTableEvents.ROW_ADDED, onActionsTableAddRow);

            vm.eventActionsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, onActionsTableCellValueChanged);

            vm.eventActionsGridTableEventService.addEventListener(gridTableEvents.ROW_DELETED, onActionsTableDeleteRows);

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            var hashTableOfButtonPositions = {};
            var buttonPositionWithSameValue = false;

            for (var i = 0; i < vm.event.actions.length; i++) {
                var prop = vm.event.actions[i].button_position;

                if (hashTableOfButtonPositions.hasOwnProperty(prop)) {

                    buttonPositionWithSameValue = true;
                    break;

                } else {

                    hashTableOfButtonPositions[prop] = i;

                }

            }

            if (buttonPositionWithSameValue) {

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/warning-dialog-view.html',
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

            } else {

                $mdDialog.hide({
                    status: 'agree', data: {
                        event: vm.event
                    }
                });

            }

        };

        vm.init = function () {

            vm.eventActionsGridTableDataService = new GridTableDataService();
            vm.eventActionsGridTableEventService = new GridTableEventService();

            initGridTableEvents();

            transactionTypeService.getListLight().then(function (data) {

                vm.transactionTypes = data.results;

                formatDataForActionsGridTable();

                $scope.$apply();

            })

            vm.eventActionsGridTableDataService.setTableData(vm.eventActionsGridTableData);

        };

        vm.init();

    }

}());