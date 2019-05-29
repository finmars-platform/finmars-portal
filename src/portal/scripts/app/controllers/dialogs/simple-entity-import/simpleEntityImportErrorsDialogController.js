/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('SimpleEntityImportErrorsDialogController', 'initialized');

        var vm = this;

        vm.validationResult = data.validationResult;
        vm.scheme = data.scheme;
        vm.config = data.config;

        vm.errors = vm.validationResult.stats.filter(function (item) {
            return item.level === 'error';
        });

        vm.imported_columns = [];
        vm.converted_imported_columns = [];
        vm.data_matching = [];

        vm.cancelButtonText = "Ok";

        vm.createCsvContentSimpleEntityImport = function (validationResults) {

            var columns = ['Row number'];

            columns = columns.concat(validationResults[0].error_data.columns.imported_columns);
            columns = columns.concat(validationResults[0].error_data.columns.data_matching);

            columns.push('Error Message');
            columns.push('Reaction');

            var content = [];

            validationResults.forEach(function (errorRow) {

                var result = [];

                result.push(errorRow.original_row_index);

                result = result.concat(errorRow.error_data.data.imported_columns);
                result = result.concat(errorRow.error_data.data.data_matching);

                result.push(errorRow.error_message);
                result.push(errorRow.error_reaction);

                content.push(result)

            });

            var columnRow = columns.join(',');

            var result = [
                columnRow
            ];

            content.forEach(function (contentRow) {

                result.push(contentRow.join(','))

            });

            result = result.join('\n');

            return result;

        };

        vm.setDownloadLink = function () {

            var link = document.querySelector('.download-error-link');

            var text = vm.createCsvContentSimpleEntityImport(vm.validationResult.stats);

            var file = new Blob([text], {type: 'text/plain'});

            link.href = URL.createObjectURL(file);
            link.download = vm.scheme.scheme_name + ' error file.csv';


        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };

        vm.init = function () {

            vm.rowsSkippedCount = vm.validationResult.stats.filter(function (item) {
                return item.error_reaction === 'Skipped';
            }).length;

            vm.rowsFailedCount = vm.validationResult.stats.filter(function (item) {
                return item.error_reaction !== 'Skipped';
            }).length;

            console.log('vm.validationResult.error_handler', vm.validationResult.error_handler);

            if (vm.config.error_handler === 'break') {

                var index = vm.validationResult.stats[0].original_row_index;

                vm.rowsSuccessTotal = index - 1; // get row before error
                vm.rowsSuccessTotal = vm.rowsSuccessTotal - 1; // exclude headers

            } else {

                vm.rowsSuccessTotal = vm.validationResult.total - 1 - vm.rowsFailedCount - vm.rowsSkippedCount;
            }

            if (vm.rowsSuccessTotal < 0) {
                vm.rowsSuccessTotal = 0;
            }

            setTimeout(function () {
                vm.setDownloadLink();
            }, 100)

        };

        vm.init();

    }

}());