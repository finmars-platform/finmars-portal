/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('TransactionImportErrorsDialogController', 'initialized');

        var vm = this;

        vm.data = data;

        vm.cancelButtonText = "Ok";

        if (vm.data.hasOwnProperty("process_mode") && vm.data.process_mode == 'validate') {
            vm.cancelButtonText = "Cancel";
        }

        vm.validationResult = data.validationResult;

        vm.error_rows = []

        vm.scheme = data.scheme;
        vm.config = data.config;

        vm.getUniqueColumns = function (validationResult) {

            var uniqueColumns = [];

            validationResult.error_rows.forEach(function (item) {

                item.error_data.columns.executed_input_expressions.forEach(function (itemColumn) {

                    var column = itemColumn + ':' + item.error_data.data.transaction_type_selector[0];

                    if (uniqueColumns.indexOf(column) === -1) {
                        uniqueColumns.push(column);
                    }

                })

            });

            return uniqueColumns

        };

        vm.generateColumnsForFile = function (validationResult) {

            var columns = ['Row number'];

            columns = columns.concat(validationResult.error_rows[0].error_data.columns.imported_columns);
            columns = columns.concat(validationResult.error_rows[0].error_data.columns.converted_imported_columns);
            columns = columns.concat(validationResult.error_rows[0].error_data.columns.transaction_type_selector);

            var uniqueColumns = vm.getUniqueColumns(validationResult);

            uniqueColumns.forEach(function (column) {
                columns.push(column);
            });

            columns.push('Error Message');
            columns.push('Reaction');


            return columns

        };

        vm.generateColumnsDataForFile = function (validationResult, config, errorRow) {

            var result = [];
            var uniqueColumns = vm.getUniqueColumns(validationResult);

            uniqueColumns.forEach(function (uniqueColumn, index) {

                result[index] = '';

                errorRow.error_data.columns.executed_input_expressions.forEach(function (itemColumn, itemColumnIndex) {

                    var column = itemColumn + ':' + errorRow.error_data.data.transaction_type_selector[0];

                    if (column === uniqueColumn) {

                        if (errorRow.error_data.data.executed_input_expressions[itemColumnIndex]) {
                            result[index] = errorRow.error_data.data.executed_input_expressions[itemColumnIndex];
                        }
                    }


                });


            });

            return result;

        };

        vm.createCsvContentTransactionImport = function (validationResult, config) {

            var result = [];

            var error_rows = validationResult.error_rows.filter(function (item) {

                return item.level === 'error';

            });

            result.push('Type, ' + 'Transaction Import');
            result.push('Error handle, ' + config.error_handling);
            result.push('Filename, ' + config.file.name);
            result.push('Import Rules - if object is not found, ' + config.missing_data_handler);

            var rowsSuccessCount;

            if (config.error_handling === 'break') {
                rowsSuccessCount = validationResult.error_row_index - 1;
            } else {
                rowsSuccessCount = validationResult.total_rows - error_rows.length
            }

            result.push('Rows total, ' + validationResult.total_rows);
            result.push('Rows success import, ' + rowsSuccessCount);
            result.push('Rows fail import, ' + error_rows.length);


            var columns = vm.generateColumnsForFile(validationResult, config);

            var columnRow = columns.map(function (item) {

                return '"' + item + '"';

            }).join(',');

            result.push(columnRow);

            validationResult.error_rows.forEach(function (errorRow) {

                var content = [];

                content.push(errorRow.original_row_index);

                content = content.concat(errorRow.error_data.data.imported_columns);
                content = content.concat(errorRow.error_data.data.converted_imported_columns);
                content = content.concat(errorRow.error_data.data.transaction_type_selector);
                content = content.concat(vm.generateColumnsDataForFile(validationResult, config, errorRow));

                content.push(errorRow.error_message);
                content.push(errorRow.error_reaction);

                var contentRow = content.map(function (item) {

                    return '"' + item + '"';

                }).join(',');

                result.push(contentRow);
                // result.push('\n')


            });

            result = result.join('\n');

            return result;

        };

        vm.setDownloadLink = function () {

            var link = document.querySelector('.download-error-link');

            var text = vm.createCsvContentTransactionImport(vm.validationResult, vm.config);

            var file = new Blob([text], {type: 'text/plain'});

            link.href = URL.createObjectURL(file);
            link.download = vm.scheme.scheme_name + ' error file.csv';


        };

        vm.cancel = function () {
            $mdDialog.hide({});
        };

        vm.agree = function ($event) {
            if (vm.config.process_mode !== 'validate') {

                if (vm.config.error_handling === 'break') {

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/warning-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        locals: {
                            warning: {
                                title: 'Warning',
                                description: 'Please note that only valid rows until the first invalid row will be imported. The invalid row and the further rows, whether valid or not, will be excluded from the imported transactions',
                                actionsButtons: [
                                    {
                                        name: "CANCEL",
                                        response: {}
                                    },
                                    {
                                        name: "OK, PROCEED",
                                        response: {status: 'agree'}
                                    }
                                ]

                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true
                    }).then(function (res) {

                        if (res.status === 'agree') {
                            $mdDialog.hide({status: 'agree'});
                        }
                    })

                }

                if (vm.config.error_handling === 'continue') {

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/warning-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        locals: {
                            warning: {
                                title: 'Warning',
                                description: 'Please note that only valid rows will be imported. The invalid rows will be excluded from the imported transactions.',
                                actionsButtons: [
                                    {
                                        name: "CANCEL",
                                        response: {}
                                    },
                                    {
                                        name: "OK, PROCEED",
                                        response: {status: 'agree'}
                                    }
                                ]

                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true
                    }).then(function (res) {

                        if (res.status === 'agree') {
                            $mdDialog.hide({status: 'agree'});
                        }
                    })

                }

            } else {

                $mdDialog.hide({status: 'agree'});

            }
        };


        vm.init = function () {

            vm.error_rows = vm.validationResult.error_rows.filter(function (item) {

                return item.level === 'error';

            });

            vm.error_rows = vm.error_rows.map(function (item) {

                item.original_row_pretty = item.original_row.join(' ');

                return item;
            });


            if (vm.config.error_handling === 'break') {
                vm.rowsSuccessCount = vm.validationResult.error_row_index - 1;
            } else {

                vm.rowsSuccessCount = vm.validationResult.total_rows - vm.error_rows.length

            }

            console.log('vm.rowsSuccessCount', vm.rowsSuccessCount);

            setTimeout(function () {
                vm.setDownloadLink();
            }, 100)

        };

        vm.init();
    }

}());