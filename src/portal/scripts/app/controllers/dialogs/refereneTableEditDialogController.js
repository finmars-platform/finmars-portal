/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var referenceTablesService = require('../../services/referenceTablesService');

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.referenceTable = data.referenceTable;

        vm.validationEnabled = false;

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.createRow = function ($event) {

            vm.referenceTable.rows.push({
                key: '',
                value: ''
            })

        };

        vm.deleteRow = function ($event, $index) {

            vm.referenceTable.rows.splice($index, 1);

            vm.checkForDuplicates()
        };

        vm.checkForDuplicates = function () {

            var keysCount = {};

            vm.referenceTable.rows.forEach(function (row) {

                if (!keysCount[row.key]) {
                    keysCount[row.key] = 0
                }

                keysCount[row.key] = keysCount[row.key] + 1;

            });

            vm.referenceTable.rows = vm.referenceTable.rows.map(function (row) {

                if (keysCount[row.key] > 1) {
                    row.is_duplicate = true;
                } else {
                    row.is_duplicate = false;
                }

                return row

            })

        };

        vm.agree = function ($event) {

            vm.checkForDuplicates();

            var keysAreUnique = true;

            vm.referenceTable.rows.forEach(function (row) {

                if (row.is_duplicate) {
                    keysAreUnique = false
                }

            });

            if (keysAreUnique) {

                vm.referenceTable.rows = vm.referenceTable.rows.filter(function (row) {

                    return row.key !== '' && row.value !== '';

                }).map(function (row) {

                    delete row.is_duplicate;

                    return row
                });

                referenceTablesService.update(vm.referenceTable.id, vm.referenceTable).then(function () {

                    $mdDialog.hide({status: 'agree'});

                });

            } else {

                $mdDialog.show({
                    controller: 'InfoDialogController as vm',
                    templateUrl: 'views/info-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        info: {
                            title: 'Warning',
                            description: 'The table contains duplicate Keys.'
                        }
                    }
                }).then(function (res) {

                    vm.validationEnabled = true;
                    vm.checkForDuplicates();


                })

            }

        };
    }

}());