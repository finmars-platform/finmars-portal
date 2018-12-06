/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    var eventsService = require('../../services/eventsService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.effective_date = moment(new Date()).format('YYYY-MM-DD');
        vm.loading = false;
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


        vm.agree = function ($event) {

            var promises = [];

            vm.events.map(function (event) {
                if (event.is_need_reaction) {
                    promises.push(vm.openEventWindow($event, event));
                }
            });


            Promise.all(promises).then(function () {
                $mdDialog.hide();
            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.isAllChecked = function () {

            var result = true;

            for (var i = 0; i < vm.events.length; i = i + 1) {
                if (!vm.events[i].selected) {
                    result = false;
                    break;
                }
            }

            return result;

        };

        vm.toggleAll = function () {

            var state = vm.isAllChecked();

            for (var i = 0; i < vm.events.length; i = i + 1) {
                vm.events[i].selected = state;
            }

        };

        vm.updateTable = function () {

            vm.loading = true;

            var filters = Object.assign({}, vm.search);

            filters.effective_date_0 = vm.effective_date;
            filters.effective_date_1 = vm.effective_date;
            // filters.status = "1"; // look only for status NEW

            eventsService.getList({filters: filters}).then(function (data) {
                vm.events = data.results;

                vm.loading = false;

                $scope.$apply();
            })
        };

        vm.openEventWindow = function ($event, event) {
            return $mdDialog.show({
                controller: 'EventDialogController as vm',
                templateUrl: 'views/dialogs/event-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {
                        event: event
                    }
                }
            })
        };

        vm.updateTable();
    };

}());