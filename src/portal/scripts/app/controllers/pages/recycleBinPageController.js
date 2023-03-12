/**
 * Created by szhitenev on 11.03.2023.
 */
(function () {

    'use strict';

    var processesService = require('../../services/processesService');

    var baseUrlService = require('../../services/baseUrlService');
    var utilsService = require('../../services/utilsService');
    var complexTransactionService = require('../../services/transaction/complexTransactionService');
    var masterUserService = require('../../services/masterUserService');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var baseUrl = baseUrlService.resolve();


    module.exports = function recycleBinPageController($scope, $state, $stateParams, $mdDialog, globalDataService) {

        var vm = this;

        vm.processing = false;

        vm.readyStatus = {
            data: false
        }

        var priorDate = new Date(new Date().setDate(new Date().getDate() - 30));

        vm.filters = {
            date_from: priorDate.toISOString().split('T')[0],
            date_to: new Date().toISOString().split('T')[0]
        }

        vm.updateFilters = function () {

            vm.currentPage = 1;

            $state.go('app.portal.recycle-bin', {
                date_from: vm.filters.date_from,
                date_to: vm.filters.date_to,
            }, {notify: false});

            vm.getData();

        }

        vm.toggleGroupSelected = function ($event, groupedItem) {

            groupedItem.allSelected = !groupedItem.allSelected


            groupedItem.items.forEach(function (item) {

                item.selected = groupedItem.allSelected

            })
        }

        vm.toggleSelected = function ($event, item, groupedItem) {

            groupedItem.allSelected = false;

            item.selected = !item.selected;

            var allSelected = true;

            groupedItem.items.forEach(function (item) {

                if (!item.selected) {
                    allSelected = false;
                }

            })

            groupedItem.allSelected = allSelected

        }

        vm.restoreSelected = function ($event, groupedItem) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                targetEvent: $event,
                locals: {
                    warning: {
                        title: "Warning!",
                        description: 'Transactions could be restored if <b>Unique Transaction Code</b> is free to use. Transactions that failed restore process will stay in Recycle Bin'
                    }
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    var ids = []

                    groupedItem.items.forEach(function (item) {

                        if (item.selected) {
                            ids.push(item.id)
                        }

                    })

                    complexTransactionService.restoreBulk({ids: ids}).then(function (data) {

                        toastNotificationService.info("Transactions were restored")

                        vm.getData();

                    })


                }


            })

        }


        vm.destroySelected = function ($event, groupedItem) {


            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                targetEvent: $event,
                locals: {
                    warning: {
                        title: "Warning!",
                        description: 'Selected Transactions will be <b>Deleted</b> completely.'
                    }
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    var ids = []

                    groupedItem.items.forEach(function (item) {

                        if (item.selected) {
                            ids.push(item.id)
                        }

                    })

                    complexTransactionService.deleteBulk({ids: ids}).then(function (data) {

                        toastNotificationService.info("Transactions were deleted")

                        vm.getData();

                    })

                }

            })

        }


        vm.getData = function () {

            vm.readyStatus.stats = false;

            utilsService.getRecycleBin({
                filters: vm.filters
            }).then(function (data) {


                vm.items = data.results;

                vm.groupedItemsDict = {}

                vm.groupedItems = []

                vm.items.forEach(function (item) {

                    item.modified_datetime_prettty = moment(new Date(item.modified)).format('DD-MM-YYYY HH:mm');

                    var modified_pretty = new Date(item.modified).toISOString().split('T')[0]

                    if (!vm.groupedItemsDict.hasOwnProperty(modified_pretty)) {
                        vm.groupedItemsDict[modified_pretty] = {
                            'modified_pretty': modified_pretty,
                            'items': []
                        }
                    }
                    vm.groupedItemsDict[modified_pretty]['items'].push(item)


                })

                Object.keys(vm.groupedItemsDict).forEach(function (key) {
                    vm.groupedItems.push(vm.groupedItemsDict[key])

                })


                console.log('groupedItems', vm.groupedItems);


                vm.readyStatus.data = true;
                $scope.$apply();
            }).catch(function (error) {
                vm.readyStatus.data = true;
                $scope.$apply();
            })

        }


        vm.init = function () {

            if ($stateParams.date_from) {
                vm.filters.date_from = $stateParams.date_from
            }

            if ($stateParams.date_to) {
                vm.filters.date_to = $stateParams.date_to
            }

            vm.getData();

        };

        vm.init();

    };

}());