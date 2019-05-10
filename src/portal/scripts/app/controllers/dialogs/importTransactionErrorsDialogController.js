/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('importTransactionErrorsDialogController', 'initialized');

        var vm = this;

        vm.data = data;

        vm.cancelButtonText = "Ok";

        if (vm.data.hasOwnProperty("process_mode") && vm.data.process_mode == 'validate') {
            vm.cancelButtonText = "Cancel";
        }

        vm.validationResult = data.validationResult;
        vm.scheme = data.scheme;
        vm.config = data.config;

        vm.createCsvContentTransactionImport = function (validationResults) {

            var result = [];

            validationResults.forEach(function (errorRow) {

                var columns = ['Row number'];

                columns = columns.concat(validationResults[0].error_data.columns.imported_columns);
                columns = columns.concat(validationResults[0].error_data.columns.converted_imported_columns);
                columns = columns.concat(validationResults[0].error_data.columns.transaction_type_matching);
                columns = columns.concat(validationResults[0].error_data.columns.executed_input_expressions);

                columns.push('Error Message');
                columns.push('Reaction');

                var columnRow = columns.map(function (item) {

                    return '"' + item + '"';

                }).join(',');

                var content = [];

                content.push(errorRow.original_row_index);

                content = content.concat(errorRow.error_data.data.imported_columns);
                content = content.concat(errorRow.error_data.data.converted_imported_columns);
                content = content.concat(errorRow.error_data.data.transaction_type_matching);
                content = content.concat(errorRow.error_data.data.executed_input_expressions);

                content.push(errorRow.error_message);
                content.push(errorRow.error_reaction);

                var contentRow = content.map(function (item) {

                    return '"' + item + '"';

                }).join(',');


                result.push(columnRow);
                result.push(contentRow);
                result.push('\n')


            });


            result = result.join('\n');

            return result;

        };

        vm.setDownloadLink = function () {

            var link = document.querySelector('.download-error-link');

            var text = vm.createCsvContentTransactionImport(vm.validationResult.error_rows);

            var file = new Blob([text], {type: 'text/plain'});

            link.href = URL.createObjectURL(file);
            link.download = vm.scheme.scheme_name + ' error file.csv';


        };

        vm.cancel = function () {
            $mdDialog.hide({});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };


        vm.init = function () {

            setTimeout(function () {
                vm.setDownloadLink();
            }, 100)

        };

        vm.init();
    }

}());