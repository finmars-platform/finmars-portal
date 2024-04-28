/**
 * Created by szhitenev on 22.03.2023.
 */
// import baseUrlService from "../../services/baseUrlService";
(function () {

    'use strict';

    var tasksService = require('../../services/tasksService');
    var explorerService = require('../../services/explorerService');

    var complexTransactionService = require('../../services/transaction/complexTransactionService').default;
    var masterUserService = require('../../services/masterUserService');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');

    const utilsHelper = require('../../helpers/utils.helper');

    module.exports = function tasksPageController($scope, $state, $mdDialog, toastNotificationService) {

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

        vm.statusesOpts = [
            {
                id: "I",
                name: "Initializing"
            },
            {
                id: "P",
                name: "Running"
            },
            {
                id: "D",
                name: "Success"
            },
            {
                id: "E",
                name: "Error"
            },
            {
                id: "T",
                name: "Timed out"
            },
            {
                id: "C",
                name: "Canceled"
            },
            {
                id: "X",
                name: "Transaction import aborted"
            },
            {
                id: "S",
                name: "Request sent"
            },
            {
                id: "W",
                name: "Awaiting response"
            },
        ]

        /*vm.typeOpts = [
            {
                // Install Configuration From Marketplace
                id: 'install_configuration_from_marketplace',
                name: 'install_configuration_from_marketplace',
            },
            {

                id: 'push_configuration_to_marketplace',
                name: 'push_configuration_to_marketplace',
            },
            {
                // Export Journal To Storage
                id: 'export_journal_to_storage',
                name: 'export_journal_to_storage',
            },
            {
                id: 'install_initial_configuration',
                name: 'install_initial_configuration',
            },
            {
                id: 'universal_input',
                name: 'universal_input',
            },
            {
                // Bulk Delete
                id: 'bulk_delete',
                name: 'bulk_delete',
            },

            {
                // Configuration Import
                id: 'configuration_import',
                name: 'configuration_import',
            },
            {
                id: 'export_configuration',
                name: 'export_configuration',
            },
            {
                // Simple Import Final updates for bulk insert
                id: 'csv_import.simple_import_bulk_insert_final_updates_procedure',
                name: 'csv_import.simple_import_bulk_insert_final_updates_procedure',
            },
            {
                // Simple Import
                id: 'simple_import',
                name: 'simple_import',
            },
            {
                // Transaction Import
                id: 'transaction_import',
                name: 'transaction_import',
            },

            {
                // Transaction Import Validation
                id: 'validate_transaction_import',
                name: 'validate_transaction_import',
            },
            {
                id: 'user_task',
                name: 'user_task',
            },
            {
                // Import From Finmars Database
                id: 'import_from_database',
                name: 'import_from_database',
            },
            {
                // Download From Finmars Database
                id: 'download_instrument_from_finmars_database',
                name: 'download_instrument_from_finmars_database',
            },
            {
                // Process Events
                id: 'process_events',
                name: 'process_events',
            },

            {
                // Generate Events
                id: 'generate_events',
                name: 'generate_events',
            },
            {
                // User Attributes Recalculation
                id: 'attribute_recalculation',
                name: 'attribute_recalculation',
            },
            {
                // Calculate Portfolio Register Records
                id: 'calculate_portfolio_register_record',
                name: 'calculate_portfolio_register_record',
            },
            {
                // Calculate Portfolio History
                id: 'calculate_portfolio_history',
                name: 'calculate_portfolio_history',
            },
            {
                // Calculate Portfolio Reconcile History
                id: 'calculate_portfolio_reconcile_history',
                name: 'calculate_portfolio_reconcile_history',
            },

            {
                // Calculate Portfolio Register Prices
                id: 'calculate_portfolio_register_price_history',
                name: 'calculate_portfolio_register_price_history',
            },
            {
                id: 'execute_expression_procedure',
                name: 'execute_expression_procedure',
            },
            {
                id: 'process_bank_file_for_reconcile',
                name: 'process_bank_file_for_reconcile',
            },
            {
                // Balance Report
                id: 'calculate_balance_report',
                name: 'calculate_balance_report',
            },
            {
                // PL Report
                id: 'calculate_pl_report',
                name: 'calculate_pl_report',
            },

            {
                id: 'complex_transaction_user_field_recalculation',
                name: 'complex_transaction_user_field_recalculation',
            },
            {
                // Collect History
                id: 'collect_history',
                name: 'collect_history',
            },
        ];*/

        // options for filters.type in alphabetic order
        vm.typesOpts = [
            {
                "id": "attribute_recalculation",
                "name": "attribute_recalculation"
            },
            {
                "id": "bulk_delete",
                "name": "bulk_delete"
            },
            {
                "id": "calculate_balance_report",
                "name": "calculate_balance_report"
            },
            {
                "id": "calculate_pl_report",
                "name": "calculate_pl_report"
            },
            {
                "id": "calculate_portfolio_history",
                "name": "calculate_portfolio_history"
            },
            {
                "id": "calculate_portfolio_reconcile_history",
                "name": "calculate_portfolio_reconcile_history"
            },
            {
                "id": "calculate_portfolio_register_price_history",
                "name": "calculate_portfolio_register_price_history"
            },
            {
                "id": "calculate_portfolio_register_record",
                "name": "calculate_portfolio_register_record"
            },
            {
                "id": "collect_history",
                "name": "collect_history"
            },
            {
                "id": "complex_transaction_user_field_recalculation",
                "name": "complex_transaction_user_field_recalculation"
            },
            {
                "id": "configuration_import",
                "name": "configuration_import"
            },
            {
                "id": "csv_import.simple_import_bulk_insert_final_updates_procedure",
                "name": "csv_import.simple_import_bulk_insert_final_updates_procedure"
            },
            {
                "id": "download_instrument_from_finmars_database",
                "name": "download_instrument_from_finmars_database"
            },
            {
                "id": "execute_expression_procedure",
                "name": "execute_expression_procedure"
            },
            {
                "id": "export_configuration",
                "name": "export_configuration"
            },
            {
                "id": "export_journal_to_storage",
                "name": "export_journal_to_storage"
            },
            {
                "id": "generate_events",
                "name": "generate_events"
            },
            {
                "id": "import_from_database",
                "name": "import_from_database"
            },
            {
                "id": "install_configuration_from_marketplace",
                "name": "install_configuration_from_marketplace"
            },
            {
                "id": "install_initial_configuration",
                "name": "install_initial_configuration"
            },
            {
                "id": "process_bank_file_for_reconcile",
                "name": "process_bank_file_for_reconcile"
            },
            {
                "id": "process_events",
                "name": "process_events"
            },
            {
                "id": "push_configuration_to_marketplace",
                "name": "push_configuration_to_marketplace"
            },
            {
                "id": "simple_import",
                "name": "simple_import"
            },
            {
                "id": "transaction_import",
                "name": "transaction_import"
            },
            {
                "id": "universal_input",
                "name": "universal_input"
            },
            {
                "id": "user_task",
                "name": "user_task"
            },
            {
                "id": "validate_transaction_import",
                "name": "validate_transaction_import"
            }
        ]

        vm.resultsOpts = [
            {
                id: 'error',
                name: 'Error',
            },
            {
                id: 'skip',
                name: 'Skip',
            },
            {
                id: 'success',
                name: 'Success',
            }
        ];

        vm.filters = {
            date_from: priorDate.toISOString().split('T')[0],
            date_to: new Date().toISOString().split('T')[0],
            statuses: [],
            types: [],
            result: [],
        }

        vm.formatResultCounter = function (counter) {
            if (counter > 999) return '999+';

            return counter;
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

        /**
         *
         * @param filters {Object}
         * @return {
         *  {
         *      date_from: String,
         *      date_to: String,
         *      query: String,
         *      types: String,
         *      statuses: String
         *      result: String,
         *  }
         * }
         */
        const getFiltersData = function(filters) {

            let filtersData = {};

            // format filters to use as query parameters in request
            Object.keys(filters).forEach(key => {

                if ( Array.isArray(filters[key]) ) {

                    if (filters[key].length) {
                        filtersData[key] = filters[key].join(',');

                    } else {
                        /* *
                         * Have to return a property with an empty value
                         * to apply it to query parameters inside page's url.
                         * See vm.updateFilters() for an example.
                         * */
                        filtersData[key] = "";
                    }

                } else if (filters[key]) {
                    filtersData[key] = filters[key];
                }

            });

            return filtersData;

        };

        /**
         *
         * @param page {Number}
         * @param filters {Object}
         * @return {{page: Number, date_from: String, date_to: String, query: String, types: String, statuses: String, result: String}}
         */
        const getDataForParams = function(page, filters) {

            let params = getFiltersData(filters);

            params.page = page;

            /* *
                {
                    page: Number,
                    date_from: String,
                    date_to: String,
                    query: String,
                    types: String,
                    statuses: String
                    result: String,
                }
             */
            return params;

        };

        vm.openPreviousPage = function () {

            vm.currentPage = vm.currentPage - 1;

            const params = getDataForParams(vm.currentPage, vm.filters);

            $state.go(
                'app.portal.tasks-page',
                params,
                {notify: false}
            );

            vm.getData()

        }

        vm.openNextPage = function () {

            vm.currentPage = vm.currentPage + 1;

            const params = getDataForParams(vm.currentPage, vm.filters);

            $state.go(
                'app.portal.tasks-page',
                params,
                {notify: false}
            );

            vm.getData()

        }

        vm.openPage = function (page) {

            if (page.number) {

                vm.currentPage = page.number;

                const params = getDataForParams(vm.currentPage, vm.filters);

                $state.go(
                    'app.portal.tasks-page',
                    params,
                    {notify: false}
                );

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

            const params = getDataForParams(vm.currentPage, vm.filters);

            $state.go(
                'app.portal.tasks-page',
                params,
                {notify: false}
            );

            vm.getData();

        }

        vm.updateFiltersD = utilsHelper.debounce(function () {
            vm.updateFilters();
        }, 1000)

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
            // item.progress_object = JSON.stringify(item.progress_object, null, 4);

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

        let notLoadingData = true;
        /** Prevents display of data from older request
         * that finished after newer requests. */
        let lastDataRequestTime = new Date();

        vm.getData = function () {

            const requestTime = new Date();
            notLoadingData = false;

            tasksService.getListLight({
                pageSize: vm.pageSize,
                page: vm.currentPage,
                filters: getFiltersData(vm.filters),
                sort: {
                    direction: "DESC",
                    key: "created"
                }
            }).then(function (data) {

                console.log('vm.getData.data', data);

                if (requestTime < lastDataRequestTime) {
                    /* Newer request has been sent
                     Do not apply data from this old request.*/
                    return;
                }

                lastDataRequestTime = requestTime;

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
                notLoadingData = true;
                $scope.$apply();

            }).catch(function (error) {

                if (requestTime < lastDataRequestTime) {
                    /* Newer request has been sent
                     Do not apply data from this old request.*/
                    return;
                }

                vm.readyStatus.data = true;
                $scope.$apply();

            })

        }

        vm.downloadFile = function ($event, item) {

            explorerService.viewFile(item.file_report_object.file_url).then(function (blob) {

                var reader = new FileReader();

                reader.addEventListener("loadend", function (e) {

                    var content = reader.result;

                    if (item.file_report_object.file_url.indexOf('.json') !== -1) {
                        content = JSON.parse(content)
                    }

                    $mdDialog.show({
                        controller: 'FilePreviewDialogController as vm',
                        templateUrl: 'views/dialogs/file-preview-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true,
                        locals: {
                            data: {
                                content: content,
                                info: item
                            }
                        }
                    });


                });

                reader.readAsText(blob);


            });


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

        vm.doRefresh = function () {

            vm.getData();
            vm.getStats();
            vm.getActiveTask();

        }

        vm.init = function () {
            // vm.readyStatus.data = false;

            if ($state.params.page) {
                vm.currentPage = $state.params.page
            }

            if ($state.params.date_from) {
                vm.filters.date_from = $state.params.date_from
            }

            if ($state.params.date_to) {
                vm.filters.date_to = $state.params.date_to
            }

            if ($state.params.query) {
                vm.filters.query = $state.params.query
            }

            if ($state.params.statuses) {
                vm.filters.statuses = $state.params.statuses.split(",");
            }

            if ($state.params.types) {
                vm.filters.types = $state.params.types.split(",");
            }

            if ($state.params.result) {
                vm.filters.result = $state.params.result.split(",");
            }

            if ($state.params.id) {
                vm.filters.id = $state.params.id;
            }

            vm.getData();
            vm.getStats();

            setInterval(function () {

                /* * IMPORTANT
                 *
                 * Without this `if` endless loading can occur.
                 * Cause: before already sent request complete and update
                 * variable `lastDataRequestTime`
                 * new requests can be sent by this interval.
                 * */
                if (notLoadingData) {
                    vm.getData();
                }

                vm.getStats();
                vm.getActiveTask();

            }, 1000 * 30)

        };

        vm.init();

    };

}());