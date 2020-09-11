/**
 * Created by szhitenev on 25.08.2016.
 */
(function () {

    'use strict';

    var metaHelper = require('../../../helpers/meta.helper');

    var accrualCalculationModelService = require('../../../services/accrualCalculationModelService');
    var instrumentPeriodicityService = require('../../../services/instrumentPeriodicityService');

    var fieldResolverService = require('../../../services/fieldResolverService');
    var instrumentEventScheduleService = require('../../../services/instrument/instrumentEventScheduleService');

    var GridTableDataService = require('../../../services/gridTableDataService');
    var GridTableEventService = require('../../../services/gridTableEventService');
    var gridTableEvents = require('../../../services/gridTableEvents');

    module.exports = function accrualCalculationSchedulesController($scope, $mdDialog) {

        var vm = this;

        vm.entity = $scope.$parent.vm.entity;
        console.log("grid table accrual calc", vm.entity.accrual_calculation_schedules);

        vm.currencyFields = [];
        vm.dailyPricingModelFields = [];

        vm.readyStatus = {accrualModals: false, periodicityItems: false};

        accrualCalculationModelService.getList().then(function (data) {
            vm.accrualModels = data;
            vm.readyStatus.accrualModals = true;
            $scope.$apply();
        });

        instrumentPeriodicityService.getList().then(function (data) {
            vm.periodicityItems = data;
            vm.readyStatus.periodicityItems = true;
            $scope.$apply();
        });

        vm.checkReadyStatus = function () {
            if (vm.readyStatus.accrualModals == true && vm.readyStatus.periodicityItems == true) {
                return true;
            }
            return false;
        };

        vm.toggleQuery = function () {
            vm.queryStatus = !vm.queryStatus;
            vm.query = {};
        };

        vm.setSort = function (propertyName) {
            vm.direction = (vm.sort === propertyName) ? !vm.direction : false;
            vm.sort = propertyName;
        };

        vm.bindCalculationModel = function (row) {
            var name;
            vm.accrualModels.forEach(function (item) {
                if (row.accrual_calculation_model == item.id) {
                    row.calculation_model_name = item.name;
                    name = item.name
                }
            });
            return name;
        };

        vm.bindPeriodicity = function (row) {
            var name;
            vm.periodicityItems.forEach(function (item) {
                if (row.periodicity == item.id) {
                    row.periodicity_name = item.name;
                    name = item.name
                }
            });
            return name;
        };

        vm.newItem = {
            "accrual_start_date": new Date(),
            "first_payment_date": new Date(),
            "accrual_size": '',
            "accrual_calculation_model": '',
            "periodicity": '',
            "periodicity_n": '',
            "notes": ""
        };

        vm.editItem = function (item) {
            item.editStatus = true;
        };

        vm.saveItem = function (item) {
            item.editStatus = false;
        };

        vm.deleteItem = function (item, index) {
            vm.entity.accrual_calculation_schedules.splice(index, 1);
        };

        vm.addRow = function () {
            vm.entity.accrual_calculation_schedules.push({
                "accrual_start_date": moment(new Date(vm.newItem.accrual_start_date)).format('YYYY-MM-DD'),
                "first_payment_date": moment(new Date(vm.newItem.first_payment_date)).format('YYYY-MM-DD'),
                "accrual_size": vm.newItem.accrual_size,
                "accrual_calculation_model": vm.newItem.accrual_calculation_model,
                "periodicity": vm.newItem.periodicity,
                "periodicity_n": vm.newItem.periodicity_n,
                "notes": vm.newItem.notes
            });

            vm.newItem = {
                "accrual_start_date": new Date(),
                "first_payment_date": new Date(),
                "accrual_size": '',
                "accrual_calculation_model": '',
                "periodicity": '',
                "periodicity_n": '',
                "notes": ""
            };
        };

        vm.getCurrencyFields = function () {

            fieldResolverService.getFields('accrued_currency', {
                entityType: 'instrument',
                key: 'accrued_currency'
            }).then(function (res) {

                vm.currencyFields = res.data;

                $scope.$apply();

            });

        };

        vm.getPaymentSizeDetailFields = function () {

            fieldResolverService.getFields('payment_size_detail', {
                entityType: 'instrument',
                key: 'payment_size_detail'
            }).then(function (res) {

                vm.dailyPricingModelFields = res.data;

                $scope.$apply();

            });

        };

        vm.setDefaultCurrencyFields = function () {

            var item_object = vm.entity.accrued_currency_object;

            if (item_object) {

                if (Array.isArray(item_object)) {
                    vm.currencyFields = item_object;
                } else {
                    vm.currencyFields.push(item_object);
                }
            }

        };

        vm.setDefaultPaymentSizeDetailFields = function () {

            var item_object = vm.entity.payment_size_detail_object;

            if (item_object) {

                if (Array.isArray(item_object)) {
                    vm.dailyPricingModelFields = item_object;
                } else {
                    vm.dailyPricingModelFields.push(item_object);
                }
            }

        };

        vm.generateEventsSchedule = function ($event) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: 'All changes will be saved, OK?'
                    }
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.readyStatus.eventSchedulesReady = false;

                    console.log("rebuild Events", $scope);

                    $scope.$parent.vm.updateItem().then(function (value) {

                        console.log("rebuild Events")

                        instrumentEventScheduleService.rebuildEvents(vm.entity.id, vm.entity).then(function (data) {

                            console.log('events rebuilt data', data);

                            $scope.$parent.vm.getItem().then(function (getItemData) {
                                vm.entity = $scope.$parent.vm.entity;
                                vm.readyStatus.eventSchedulesReady = true;
                            });

                        })

                    })
                }

            });

        };

        // Schedules grid table

        vm.schedulesGridTableData = {
            header: {
                order: 'header',
                columns: []
            },
            body: [],
            templateRow: {
                isActive: false,
                columns: [
                    {
                        key: 'accrual_start_date',
                        objPath: ['accrual_start_date'],
                        columnName: 'Accrual start date',
                        order: 0,
                        cellType: 'date',
                        settings: {
                            value: null
                        },
                        styles: {
                            'grid-table-cell': {'width': '210px'}
                        }
                    },
                    {
                        key: 'first_payment_date',
                        objPath: ['first_payment_date'],
                        columnName: 'First payment date',
                        order: 1,
                        cellType: 'date',
                        settings: {
                            value: null
                        },
                        styles: {
                            'grid-table-cell': {'width': '160px'}
                        }
                    },
                    {
                        key: 'accrual_size',
                        objPath: ['accrual_size'],
                        columnName: 'Accrual size',
                        order: 2,
                        cellType: 'number',
                        settings: {
                            value: null
                        },
                        styles: {
                            'grid-table-cell': {'width': '210px'}
                        }
                    },
                    {
                        key: 'periodicity',
                        objPath: ['accrual_size'],
                        columnName: 'Periodicity',
                        order: 3,
                        cellType: 'custom_popup',
                        settings: {
                            value: {
                                accrual_calculation_model: null,
                                periodicity_n: null,
                                periodicity: null
                            },
                            cellText: '',
                            popupSettings: {
                                contentHtml: {
                                    main: '<div ng-include="views/directives/gridTable/cells/popups/instrument-accrual-schedules-periodicity-view.html"></div>'
                                },
                                fieldsData: [
                                    {selectorOptions: vm.periodicityItems},
                                    {selectorOptions: vm.accrualModels}
                                ]
                            },
                        },
                        methods: {
                            acceptPopupChanges: function (popupData, rowOrder, gtDataService, gtEventService) {

                                var popoupValues = Object.assign({}, popupData);
                                var cellData = gtDataService.getCellByKey(rowOrder, 'periodicity');

                                cellData.settings.value = popoupValues;

                            }
                        },
                        styles: {
                            'grid-table-cell': {'width': '115px'}
                        }
                    },
                    {
                        key: 'notes',
                        objPath: ['notes'],
                        columnName: 'Notes',
                        order: 4,
                        cellType: 'text',
                        settings: {
                            value: null
                        },
                        styles: {
                            'grid-table-cell': {'width': '210px'}
                        }
                    }
                ]
            }
        };

        var formatDataForSchedulesGridTable = function () {

            // assemble header columns
            var rowObj = metaHelper.recursiveDeepCopy(vm.schedulesGridTableData.templateRow, true);

            vm.schedulesGridTableData.header.columns = rowObj.columns.map(function (column) {

                return {
                    key: column.key,
                    columnName: column.columnName,
                    order: column.order,
                    sorting: true,
                    styles: {
                        'grid-table-cell': {'width': column.styles['grid-table-cell'].width}
                    }
                }

            });
            // < assemble header columns >

            // assemble body rows
            vm.entity.accrual_calculation_schedules.forEach(function (schedule, index) {

                rowObj.key = index;
                rowObj = metaHelper.recursiveDeepCopy(vm.schedulesGridTableData.templateRow, true);

                rowObj.columns[0].settings.value = schedule.accrual_start_date;
                rowObj.columns[1].settings.value = schedule.first_payment_date;
                rowObj.columns[2].settings.value = schedule.accrual_size;
                rowObj.columns[3].settings.value = schedule.periodicity;
                rowObj.columns[4].settings.value = schedule.notes;

                vm.schedulesGridTableData.body.push(rowObj);

            });
            // < assemble body rows >

        }
        // < Schedules grid table >


        vm.init = function () {

            vm.setDefaultCurrencyFields();
            vm.setDefaultPaymentSizeDetailFields();

            vm.schedulesGridTableDataService = new GridTableDataService();
            vm.schedulesGridTableEventService = new GridTableEventService();

            formatDataForSchedulesGridTable();

            vm.schedulesGridTableDataService.setTableData(vm.schedulesGridTableData);
            console.log("grid table vm.schedulesGridTableDataService", vm.schedulesGridTableDataService);
        };

        vm.init();

    }

}());