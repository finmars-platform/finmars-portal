/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var metaContentTypesService = require('../../services/metaContentTypesService');

    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('SimpleEntityImportErrorsDialogController', 'initialized');

        var vm = this;

        vm.data = data;

        vm.createFile = function () {

            var result = [];

            var columns = ['Object', 'Issue', 'Reaction'];

            var columnRow = columns.map(function (item) {

                return '"' + item + '"';

            }).join(',');

            result.push(columnRow);

            vm.data.errors.forEach(function (errorItem) {

                var content = [];

                content.push(vm.getName(errorItem));

                if (errorItem.error) {
                    content.push(errorItem.error.message);
                } else {
                    content.push('');
                }

                content.push(errorItem.mode);

                result.push(content.join(','));

                result.push('\n')

            });

            result = result.join('\n');

            return result;

        };

        vm.setDownloadLink = function () {

            var link = document.querySelector('.download-error-link');

            var text = vm.createFile();

            var file = new Blob([text], {type: 'text/plain'});

            link.href = URL.createObjectURL(file);
            link.download = 'configuration_import_error_file.csv';


        };

        vm.getName = function (errorItem) {

            var result = '';

            if (errorItem.content_type) {
                result = result + metaContentTypesService.getEntityNameByContentType(errorItem.content_type)
            }

            if (errorItem.item) {

                result = result + ': ';

                if (errorItem.item.scheme_name) {
                    result = result + errorItem.item.scheme_name
                } else {

                    if (errorItem.item.short_name) {

                        result = result + errorItem.item.short_name + ' (' + errorItem.item.user_code + ')';

                    } else {

                        if (errorItem.item.user_code) {

                            result = result + errorItem.item.user_code;

                        } else {

                            if (errorItem.item.name) {
                                result = result + errorItem.item.name;
                            }

                        }
                    }


                }

            }

            return result

        };

        vm.cancel = function () {
            $mdDialog.hide();
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