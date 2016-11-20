/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');


    var metaService = require('../../services/metaService');
    var transactionTypeService = require('../../services/transactionTypeService');

    module.exports = function ($scope, $mdDialog, eventActions) {

        logService.controller('InstrumentEventActionDialogController', 'initialized');

        var vm = this;

        vm.readyStatus = {transactionTypes: false};

        console.log('eventActions', eventActions);

        vm.eventActions = eventActions.$viewValue || [];

        vm.toggleQuery = function () {
            vm.queryStatus = !vm.queryStatus;
            vm.query = {};
        };

        vm.setSort = function (propertyName) {
            vm.direction = (vm.sort === propertyName) ? !vm.direction : false;
            vm.sort = propertyName;
        };


        vm.checkReadyStatus = function () {
            if (vm.readyStatus.transactionTypes == true) {
                return true
            }
            return false;
        };

        transactionTypeService.getList().then(function (data) {
            console.log('data', data);
            vm.transactionTypes = data.results;
            vm.readyStatus.transactionTypes = true;
            //console.log('test?', vm.readyStatus.transactionTypes);
            $scope.$apply();
        });

        vm.newItem = {
            "transaction_type": '',
            "text": '',
            "is_sent_to_pending": null,
            "is_book_automatic": null,
            "button_position": ''

        };

        vm.bindTransactionType = function (row) {
            var name;
            vm.transactionTypes.forEach(function (item) {
                if (row.transaction_type == item.id) {
                    row.transaction_type_name = item.name;
                    name = item.name
                }
            });
            return name;
        };

        vm.editItem = function (item) {
            item.editStatus = true;
        };

        vm.saveItem = function (item) {
            item.editStatus = false;
        };

        vm.deleteItem = function (item, index) {
            vm.eventActions.splice(index, 1);
        };

        vm.addRow = function () {
            vm.eventActions.push({
                "transaction_type": vm.newItem.transaction_type,
                "text": vm.newItem.text,
                "is_sent_to_pending": vm.newItem.is_sent_to_pending,
                "is_book_automatic": vm.newItem.is_book_automatic,
                "button_position": vm.newItem.button_position
            });

            vm.newItem = {
                "transaction_type": '',
                "text": '',
                "is_sent_to_pending": null,
                "is_book_automatic": null,
                "button_position": ''
            };
        };

        console.log('eventActions', eventActions);

        vm.agree = function () {
            //console.log('vm.attr', vm.attribute);
            eventActions.$viewValue = vm.eventActions;
            $mdDialog.hide({status: 'agree'});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());