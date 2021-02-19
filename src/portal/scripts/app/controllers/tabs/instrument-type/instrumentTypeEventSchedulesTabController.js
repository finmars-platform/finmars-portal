/**
 * Created by szhitenev on 18.02.2021.
 */
(function () {

    'use strict';

    var metaNotificationClassService = require('../../../services/metaNotificationClassService');
    var metaEventClassService = require('../../../services/metaEventClassService');
    var instrumentPeriodicityService = require('../../../services/instrumentPeriodicityService');
    var GridTableDataService = require('../../../services/gridTableDataService');
    var GridTableEventService = require('../../../services/gridTableEventService');
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

        vm.readyStatus = {
            notificationClasses: false,
            eventClasses: false,
            eventSchedulesReady: false,
            gritTable: false
        };

        var getNotificationClasses = metaNotificationClassService.getList().then(function (data) {
            vm.notificationClasses = data;
            vm.readyStatus.notificationClasses = true;
            $scope.$apply();
        });

        var getEventClasses = metaEventClassService.getList().then(function (data) {
            vm.eventClasses = data;
            vm.readyStatus.eventClasses = true;
            $scope.$apply();
        });

        var getInstrumentPeriodicityItems = instrumentPeriodicityService.getList().then(function (data) {
            vm.periodicityItems = data;
            vm.readyStatus.periodicityItems = true;
            $scope.$apply();
        });

        vm.checkReadyStatus = function () {
            return vm.readyStatus.notificationClasses && vm.readyStatus.eventClasses && vm.readyStatus.eventSchedulesReady;
        };

        var onEventTableCellChange = function (data, gtDataService, gtEventService) {

            var tableData = gtDataService.getTableData()
            var gtRow = gtDataService.getRowByKey(data.row.key);

            gtRow.columns.forEach(function (gtColumn) {

                vm.entity.events[tableData.index].data.items[data.row.order][gtColumn.key] = gtColumn.settings.value;

            })

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
                            key: 'options',
                            columnName: 'Options',
                            order: 5,
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
                    ],
                },
                components: {
                    topPanel: {
                        inactive: true,
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
                    }
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
                rowObj.key = row.key;

                rowObj.columns[0].settings.value = row.name;
                rowObj.columns[1].settings.value = row.to_show;
                rowObj.columns[2].settings.value = row.default_value;
                rowObj.columns[3].settings.value = row.override_name;
                rowObj.columns[4].settings.value = row.tooltip;

                if (row.defaultValueType === 'selector') {
                    rowObj.columns[2].settings.selectorOptions = row.selectorOptions;
                }

                // if (row.options) {
                //     rowObj.columns[5].cellType = 'custom_popup';
                //     rowObj.columns[5].cellType.objPaths = [
                //         ['annual_to_show'], ['annual_override_name'],
                //         ['semi-annual_to_show'], ['semi-annual_override_name'],
                //         ['quarterly-annual_to_show'], ['quarterly-annual_override_name'],
                //         ['monthly-annual_to_show'], ['monthly-annual_override_name'],
                //     ];
                //
                //     rowObj.columns[5].settings = metaHelper.recursiveDeepCopy(optionCellSettings, false);
                //     rowObj.columns[5].settings.value = [
                //         true, 'Annual ON',
                //         true, 'Semi-annual ON',
                //         true, 'Quarterly ON',
                //         true, 'Monthly ON',
                //     ]
                // }

                return rowObj

            })

            return eventsGridTableData;
        };

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

            var event = {
                eventsGridTableDataService: new GridTableDataService(),
                eventsGridTableEventService: new GridTableEventService(),
                order: vm.entity.events.length,
                autogenerate: true,
                data: {
                    form_message: "",
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
                            selectorOptions: [],
                            options: true
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
                            defaultValueType: 'date',
                            options: false
                        },
                        {
                            key: 'final_date',
                            name: 'Final Date',
                            to_show: true,
                            defaultValueType: 'date',
                            options: false
                        },
                        {
                            key: 'periodicity',
                            name: 'Periodicity',
                            to_show: true,
                            defaultValueType: 'selector',
                            selectorOptions: vm.periodicityItems,
                            options: true
                        },
                        {
                            key: 'periodic_n',
                            name: 'Periodic N',
                            to_show: true,
                            defaultValueType: 'number',
                            options: false
                        },
                    ]

                }
            }

            event.eventsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
                onEventTableCellChange(argumentsObj, event.eventsGridTableDataService, event.eventsGridTableEventService);
            });

            var eventsGridTableData = getEventsGridTableData(event);

            eventsGridTableData.index = vm.entity.events.length

            event.eventsGridTableDataService.setTableData(eventsGridTableData);

            vm.entity.events.push(event)

        };

        vm.toggleItem = function (pane, item, $event) {

            $event.stopPropagation();

            if (!$event.target.classList.contains('ttype-action-notes-input')) {
                pane.toggle();
                item.isPaneExpanded = !item.isPaneExpanded;
            }

        };

        vm.init = function () {


            Promise.all([getNotificationClasses, getEventClasses, getInstrumentPeriodicityItems]).then(function () {

                vm.entity.events.forEach(function (item, index) {

                    if (item.data) {

                        item.eventsGridTableDataService = new GridTableDataService();
                        item.eventsGridTableEventService = new GridTableEventService();

                        item.eventsGridTableEventService.addEventListener(gridTableEvents.CELL_VALUE_CHANGED, function (argumentsObj) {
                            onEventTableCellChange(argumentsObj, item.eventsGridTableDataService, item.eventsGridTableEventService);
                        });

                        var eventsGridTableData = getEventsGridTableData(item)

                        eventsGridTableData.index = index

                        item.eventsGridTableDataService.setTableData(eventsGridTableData);

                    }

                })

                vm.readyStatus.gridTable = true

                $scope.$apply();


            });

        };

        vm.init();

    }

}());