/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    'use strict';

    var importEntityService = require('../import/importEntityService');
    var importTransactionService = require('../../services/import/importTransactionService');

    var handleCsvImportAction = function (action, file, delimiter) {

        var formData = new FormData();

        formData.append('file', file);
        formData.append('scheme', action.csv_import_scheme);
        formData.append('error_handler', action.error_handler);
        formData.append('delimiter', delimiter);
        formData.append('mode', action.mode);

        console.log('action', action);

        return importEntityService.validateImport(formData)

    };

    var importComplexTransactions = function (resolve, config) {

        var formData = new FormData();

        if (config.task_id) {
            formData.append('task_id', config.task_id);
        } else {

            formData.append('file', config.file);
            formData.append('scheme', config.scheme);
            formData.append('error_handling', config.error_handling);
            formData.append('delimiter', config.delimiter);
        }

        importTransactionService.validateImport(formData).then(function (data) {

            config = data;

            if (config.task_status === 'SUCCESS') {
                resolve(data);
            } else {
                setTimeout(function () {
                    importComplexTransactions(resolve, config);
                }, 1000)

            }


        })

    };

    var handleComplexTransactionImportAction = function (action, file, delimiter) {

        return new Promise(function (resolve, reject) {

            var config = {
                file: file,
                scheme: action.complex_transaction_import_scheme,
                error_handling: action.error_handler,
                delimiter: delimiter
            };

            console.log('handleComplexTransactionImportAction.config', config)

            importComplexTransactions(resolve, config);

        })

    };

    var processAction = function (action, file, delimiter) {

        return new Promise(function (resolve, reject) {

            if (action.csv_import_scheme) {
                resolve(handleCsvImportAction(action.csv_import_scheme, file, delimiter))
            }

            if (action.complex_transaction_import_scheme) {
                resolve(handleComplexTransactionImportAction(action.complex_transaction_import_scheme, file, delimiter))
            }

        })
    };

    var processActionOneByOne = function (resolve, result, actions, file, delimiter, index) {

        processAction(actions[index], file, delimiter).then(function (data) {

            console.log('processAction.data', data);

            result.errors[index] = [];

            if (data.hasOwnProperty('error_rows') && data.error_rows.length) {
                result.errors[index] = data.error_rows;
            }

            if (data.hasOwnProperty('errors') && data.errors.length) {
                result.errors[index] = data.errors
            }

            result.import_results.push(data);

            index = index + 1;

            if (index < actions.length) {

                processActionOneByOne(resolve, result, actions, file, delimiter, index)

            } else {

                resolve(result);

            }

        })

    };

    var validateImport = function (file, delimiter, scheme) {

        return new Promise(function (resolve, reject) {

            console.log('file', file);
            console.log('config', scheme);

            var result = {
                import_results: [],
                errors: []
            };

            if (scheme.actions.length) {

                var index = 0;

                processActionOneByOne(resolve, result, scheme.actions, file, delimiter, index)

            } else {

                resolve(result)

            }

        })

    };

    module.exports = {
        validateImport: validateImport
    }

}());