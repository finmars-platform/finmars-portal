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

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.createRow = function($event){

            vm.referenceTable.rows.push({
                key: '',
                value: ''
            })

        };

        vm.deleteRow = function($event, $index){

            vm.referenceTable.rows.splice($index, 1);

        };

        vm.agree = function () {

            vm.referenceTable.rows = vm.referenceTable.rows.filter(function (row) {

                return row.key !== '' && row.value !== '';

            });


            referenceTablesService.update(vm.referenceTable.id, vm.referenceTable).then(function () {

                $mdDialog.hide({status: 'agree'});

            });

        };
    }

}());