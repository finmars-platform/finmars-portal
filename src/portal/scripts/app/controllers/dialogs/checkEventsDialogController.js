/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    var eventsService = require('../../services/eventsService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.effective_date = moment(new Date()).format('YYYY-MM-DD');

        vm.filters = {};

        vm.search = {
            'user_code': '',
            'name': '',
            'short_name': '',
            'user_text_1': '',
            'user_text_2': '',
            'user_text_3': ''
        };

        vm.events = [];
        vm.selectedItem = {};


        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {item: vm.selectedItem}});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.selectRow = function (item) {

        };

        vm.updateTable = function () {

            var filters = Object.assign({}, vm.search);

            filters.effective_date_0 = vm.effective_date;
            filters.effective_date_1 = vm.effective_date;

            eventsService.getList({filters: filters}).then(function (data) {
                vm.events = data.results;
                $scope.$apply();
            })
        };

        vm.updateTable();
    };

}());