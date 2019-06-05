/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.complexImportScheme = data.complexImportScheme;
        vm.validationResults = data.validationResults;

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

        vm.createCsvContentSimpleEntityImport = function (validationResult, config) {

            console.log('validationResults', validationResult);

            var columns = ['Row number'];

            columns = columns.concat(validationResult.stats[0].error_data.columns.imported_columns);
            columns = columns.concat(validationResult.stats[0].error_data.columns.data_matching);

            columns.push('Error Message');
            columns.push('Reaction');

            var content = [];

            validationResult.stats.forEach(function (errorRow) {

                var result = [];

                result.push(errorRow.original_row_index);

                result = result.concat(errorRow.error_data.data.imported_columns);
                result = result.concat(errorRow.error_data.data.data_matching);

                result.push('"' + errorRow.error_message + '"');
                result.push(errorRow.error_reaction);

                content.push(result)

            });

            var columnRow = columns.join(',');

            var result = [];

            result.push('Type, ' + 'Transaction Import');
            result.push('Error handler, ' + config.error_handler);
            result.push('Filename, ' + config.file.name);
            result.push('Mode, ' + config.mode);
            result.push('Import Rules - if object is not found, ' + config.missing_data_handler);
            // result.push('Entity, ' + vm.scheme.content_type);

            result.push('Rows total, ' + (validationResult.total - 1));

            var rowsSuccessTotal;

            var rowsSkippedCount = validationResult.stats.filter(function (item) {
                return item.error_reaction === 'Skipped';
            }).length;

            var rowsFailedCount = validationResult.stats.filter(function (item) {
                return item.error_reaction !== 'Skipped';
            }).length;

            if (config.error_handler === 'break') {

                var index = validationResult.stats[0].original_row_index;

                rowsSuccessTotal = index - 1; // get row before error
                rowsSuccessTotal = vm.rowsSuccessTotal - 1; // exclude headers

            } else {

                rowsSuccessTotal = validationResult.total - 1 - rowsFailedCount - rowsSkippedCount;
            }

            if (rowsSuccessTotal < 0) {
                rowsSuccessTotal = 0;
            }

            result.push('Rows success import, ' + (rowsSuccessTotal));
            result.push('Rows omitted, ' + (rowsSkippedCount));
            result.push('Rows fail import, ' + (rowsFailedCount));


            result.push('\n');
            result.push(columnRow);

            content.forEach(function (contentRow) {

                result.push(contentRow.join(','))

            });

            result = result.join('\n');

            return result;

        };

        vm.setDownloadLinks = function () {

            var links = document.querySelectorAll('.download-error-link');

            for (var i = 0; i < links.length; i = i + 1) {

                var link = links[i];
                var index = link.classList[1].split('link-')[1]; // 'link-#;
                var action = vm.complexImportScheme.actions[index];

                var text = '';

                if (action.csv_import_scheme) {
                    text = vm.createCsvContentSimpleEntityImport(vm.validationResults.import_results[index], vm.validationResults.configs[index]);
                }

                if (action.complex_transaction_import_scheme) {
                    text = vm.createCsvContentTransactionImport(vm.validationResults.import_results[index], vm.validationResults.configs[index]);
                }

                var file = new Blob([text], {type: 'text/plain'});

                link.href = URL.createObjectURL(file);
                link.download = action.action_notes + ' error file.csv';


            }

        };

        vm.init = function () {

            setTimeout(function () {
                vm.setDownloadLinks();
            }, 100)

        };

        vm.init();


        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());