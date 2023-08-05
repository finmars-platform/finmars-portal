/**
 * Created by szhitenev on 22.03.2023.
 */
(function () {

    'use strict';

    var tasksService = require('../../services/tasksService');

    var baseUrlService = require('../../services/baseUrlService');
    var utilsService = require('../../services/utilsService');
    var complexTransactionService = require('../../services/transaction/complexTransactionService');
    var masterUserService = require('../../services/masterUserService');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var baseUrl = baseUrlService.resolve();


    module.exports = function tasksPageController($scope, $state, $stateParams, $mdDialog, globalDataService, systemMessageService) {

        var vm = this;

        vm.processing = false;
        vm.allSelected = false;

        vm.readyStatus = {
            data: false
        }

        vm.currentPage = 1;
        vm.pageSize = 20;

        vm.pages = []


        var priorDate = new Date(new Date().setDate(new Date().getDate() - 30));

        vm.filters = {
            date_from: priorDate.toISOString().split('T')[0],
            date_to: new Date().toISOString().split('T')[0]
        }

        vm.activeTask = null;
        vm.activeTaskProcessing = false;
        vm.activeTaskId = null;

        vm.getActiveTask = function () {

            if (vm.activeTaskId) {

                tasksService.getByKey(vm.activeTaskId).then(function (data) {

                    vm.activeTaskProcessing = false;

                    vm.activeTask = data;
                    vm.activeTask.options_object = JSON.stringify(vm.activeTask.options_object, null, 4);
                    vm.activeTask.result_object = JSON.stringify(vm.activeTask.result_object, null, 4);

                    if (vm.activeTask.finished_at) {
                        const date1 = new Date(vm.activeTask.created);
                        const date2 = new Date(vm.activeTask.finished_at);
                        const diffTime = Math.abs(date2 - date1);

                        vm.activeTask.execution_time_pretty = vm.toPrettyTime(Math.floor(diffTime / 1000));
                    }

                    console.log('vm.activeTask', vm.activeTask);


                    $scope.$apply();
                })

            }

        }

        vm.selectActiveTask = function ($event, item) {

            vm.items.forEach(function (_item) {
                _item.active = false;
            })

            item.active = true;

            vm.activeTaskProcessing = true;
            vm.activeTask = null;
            vm.activeTaskId = item.id

            vm.getActiveTask();

        }

        // TODO move to separate service to keep it DRY
        vm.alphabets = [
            '#357EC7', // A
            '#C11B17', // B
            '#008080', // C
            '#728C00', // D
            '#0020C2', // E
            '#347C17', // F
            '#D4A017', // G
            '#7D0552', // H
            '#9F000F', // I
            '#E42217', // J
            '#F52887', // K
            '#571B7E', // L
            '#1F45FC', // M
            '#C35817', // N
            '#F87217', // O
            '#41A317', // P
            '#4C4646', // Q
            '#4CC417', // R
            '#C12869', // S
            '#15317E', // T
            '#AF7817', // U
            '#F75D59', // V
            '#FF0000', // W
            '#000000', // X
            '#E9AB17', // Y
            '#8D38C9' // Z
        ]

        vm.getAvatar = function (char) {

            let charCode = char.charCodeAt(0);
            let charIndex = charCode - 65

            let colorIndex = charIndex % vm.alphabets.length;

            return vm.alphabets[colorIndex]

        }

        vm.openPreviousPage = function () {

            vm.currentPage = vm.currentPage - 1;

            $state.go('app.portal.tasks-page', {
                page: vm.currentPage,
                date_from: vm.filters.date_from,
                date_to: vm.filters.date_to,
                query: vm.filters.query
            }, {notify: false});

            vm.getData()

        }

        vm.openNextPage = function () {

            vm.currentPage = vm.currentPage + 1;

            $state.go('app.portal.tasks-page', {
                page: vm.currentPage,
                date_from: vm.filters.date_from,
                date_to: vm.filters.date_to,
                query: vm.filters.query
            }, {notify: false});

            vm.getData()

        }

        vm.openPage = function (page) {

            if (page.number) {

                vm.currentPage = page.number;

                $state.go('app.portal.tasks-page', {
                    page: vm.currentPage,
                    date_from: vm.filters.date_from,
                    date_to: vm.filters.date_to,
                    query: vm.filters.query
                }, {notify: false});

                vm.getData();
            }

        }

        vm.generatePages = function (data) {

            vm.totalPages = Math.ceil(data.count / vm.pageSize)

            vm.pages = []

            for (var i = 1; i <= vm.totalPages; i = i + 1) {
                vm.pages.push({
                    number: i,
                    caption: i.toString()
                })

            }

            if (vm.totalPages > 10) {

                vm.currentPageIndex = 0;

                vm.pages.forEach(function (item, index) {

                    if (vm.currentPage === item.number) {
                        vm.currentPageIndex = index;
                    }

                })

                vm.pages = vm.pages.filter(function (item, index) {

                    if (index < 2 || index > vm.totalPages - 3) {
                        return true
                    }

                    if (index === vm.currentPageIndex) {
                        return true
                    }

                    if (index > vm.currentPageIndex - 3 && index < vm.currentPageIndex) {
                        return true
                    }

                    if (index < vm.currentPageIndex + 3 && index > vm.currentPageIndex) {
                        return true
                    }

                    return false

                })

                for (var i = 0; i < vm.pages.length; i = i + 1) {

                    var j = i + 1;

                    if (j < vm.pages.length) {

                        if (vm.pages[j].number && vm.pages[i].number) {
                            if (vm.pages[j].number - vm.pages[i].number > 1) {


                                vm.pages.splice(i + 1, 0, {
                                    caption: '...'
                                })

                            }
                        }

                    }

                }


            }

        }


        vm.updateFilters = function () {

            vm.currentPage = 1;

            $state.go('app.portal.tasks-page', {
                page: vm.currentPage,
                date_from: vm.filters.date_from,
                date_to: vm.filters.date_to,
                query: vm.filters.query
            }, {notify: false});

            vm.getData();

        }

        vm.toPrettyTime = function (sec) {

            var sec_num = parseInt(sec, 10); // don't forget the second param
            var hours = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            return hours + ':' + minutes + ':' + seconds;

        }

        vm.refreshTask = function ($event) {

            vm.activeTaskProcessing = true;

            tasksService.getByKey(vm.activeTask.id).then(function (data) {

                vm.activeTask = vm.formatTask(data)

                vm.activeTaskProcessing = false;
                $scope.$apply();

            })

        }

        vm.cancelTask = function ($event) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                targetEvent: $event,
                locals: {
                    warning: {
                        title: "Warning!",
                        description: 'Are you sure you want to cancel task?'
                    }
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.activeTaskProcessing = true;

                    tasksService.cancel(vm.activeTask.id).then(function (data) {

                        vm.refreshTask($event);

                    })
                }
            })

        }

        vm.formatTask = function (item) {

            if (item.finished_at) {
                const date1 = new Date(item.created);
                const date2 = new Date(item.finished_at);
                const diffTime = Math.abs(date2 - date1);

                item.execution_time_pretty = vm.toPrettyTime(Math.floor(diffTime / 1000));
                item.finished_at_pretty = moment(new Date(item.finished_at)).format('HH:mm:ss');
            }

            item.created_date = moment(new Date(item.created)).format('YYYY-MM-DD');


            item.options_object = JSON.stringify(item.options_object, null, 4);
            item.result_object = JSON.stringify(item.result_object, null, 4);
            item.progress_object = JSON.stringify(item.progress_object, null, 4);

            return item

        }

        function convertSecondsToTime(secs) {
            let hours = Math.floor(secs / (60 * 60));

            let divisor_for_minutes = secs % (60 * 60);
            let minutes = Math.floor(divisor_for_minutes / 60);

            let divisor_for_seconds = divisor_for_minutes % 60;
            let seconds = Math.ceil(divisor_for_seconds);

            let obj = {
                "h": hours,
                "m": minutes,
                "s": seconds
            };
            return ("0" + obj.h).slice(-2) + ":" + ("0" + obj.m).slice(-2) + ":" + ("0" + obj.s).slice(-2);
        }

        vm.getStats = function () {

            tasksService.getStats().then(function (data) {

                vm.statsItems = []

                Object.keys(data).forEach(function (key) {

                    data[key]['name'] = key

                    data[key]['uptime'] = convertSecondsToTime(data[key]['uptime'])

                    vm.statsItems.push(data[key])

                })

                $scope.$apply();

            })

        }

        vm.getData = function () {

            tasksService.getListLight({
                pageSize: vm.pageSize,
                page: vm.currentPage,
                filters: vm.filters,
                sort: {
                    direction: "DESC",
                    key: "created"
                }
            }).then(function (data) {

                console.log('vm.getData.data', data);

                vm.generatePages(data)

                vm.items = data.results;
                vm.count = data.count

                vm.items = vm.items.map(function (item) {

                    item = vm.formatTask(item);

                    return item
                })


                if (!vm.activeTask && vm.items.length) {
                    vm.selectActiveTask(new Event(), vm.items[0])
                }


                // vm.items[0].status = 'P'

                vm.readyStatus.data = true;
                $scope.$apply();
            }).catch(function (error) {
                vm.readyStatus.data = true;
                $scope.$apply();
            })

        }

        vm.downloadFile = function ($event, item) {

            // TODO WTF why systemMessage Service, replace with FilePreview Service later
            systemMessageService.viewFile(item.file_report).then(function (data) {

                console.log('data', data);

                $mdDialog.show({
                    controller: 'FilePreviewDialogController as vm',
                    templateUrl: 'views/dialogs/file-preview-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        data: {
                            content: data,
                            info: item
                        }
                    }
                });

            })


        }

        vm.abortTransactionImport = function ($event, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                targetEvent: $event,
                locals: {
                    warning: {
                        title: "Warning!",
                        description: 'Are you sure you want to delete imported transactions?'
                    }
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    tasksService.abortTransactionImport(item.id).then(function (data) {

                        toastNotificationService.info("Transaction import aborted successfully")
                        vm.refreshTask($event);
                        vm.getData();

                    })
                }
            })


        }


        vm.init = function () {

            // vm.readyStatus.data = false;

            if ($stateParams.page) {
                vm.currentPage = $stateParams.page
            }

            if ($stateParams.date_from) {
                vm.filters.date_from = $stateParams.date_from
            }

            if ($stateParams.date_to) {
                vm.filters.date_to = $stateParams.date_to
            }

            if ($stateParams.query) {
                vm.filters.query = $stateParams.query
            }

            vm.getData();
            vm.getStats();

            setInterval(function () {

                vm.getData();
                vm.getStats();
                vm.getActiveTask();

            }, 1000 * 30)

        };

        vm.init();

    };

}());