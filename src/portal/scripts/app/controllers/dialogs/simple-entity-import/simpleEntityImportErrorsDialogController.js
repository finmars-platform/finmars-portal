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

        vm.csvFieldsColumns = [];
        vm.entityFieldsColumns = [];


        vm.createErrorDataColumns = function () {

            vm.scheme.csv_fields.forEach(function (item) {

                vm.csvFieldsColumns.push({
                    name: item.name
                })

            });

            vm.scheme.entity_fields.forEach(function (item) {

                if (item.expression && item.expression !== '') {

                    vm.entityFieldsColumns.push({
                        name: item.name + ':' + item.expression
                    })

                }

            });

        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };

        vm.init = function () {

            vm.createErrorDataColumns();

        };

        vm.init();

    }

}());