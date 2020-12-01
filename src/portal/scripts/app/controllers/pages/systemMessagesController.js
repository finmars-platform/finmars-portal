/**
 * Created by mevstratov on 30.10.2020.
 */
(function () {

    'use strict';

    var systemMessageService = require('../../services/systemMessageService');


    module.exports = function processesController($scope, $mdDialog) {

        var vm = this;

        vm.systemMessages = [];

        vm.getData = function () {

            systemMessageService.getList({
                sort: {
                    direction: "DESC",
                    key: "created"
                }
            }).then(function (data) {

                vm.systemMessages = data.results;

                vm.systemMessages = vm.systemMessages.map(function (item) {

                    item.verbose_created = moment(new Date(item.created)).format('DD-MM-YYYY HH:mm');

                    if (item.level === 1) {
                        item.verbose_level = 'Info'
                    }

                    if (item.level === 2) {
                        item.verbose_level = 'Warning'
                    }

                    if (item.level === 3) {
                        item.verbose_level = 'Error'
                    }


                    if (item.status === 1) {
                        item.verbose_status = 'New'
                    }

                    if (item.status === 2) {
                        item.verbose_status = 'Solved'
                    }

                    if (item.status === 3) {
                        item.verbose_status = 'Viewed'
                    }

                    if (item.status === 4) {
                        item.verbose_status = 'Marked'
                    }

                    if (item.status === 5) {
                        item.verbose_status = 'Abandoned'
                    }

                    return item;

                })

                // newest at the bottom
                vm.systemMessages =  vm.systemMessages.reverse();

                vm.systemMessagesReady = true;

                $scope.$apply();

            })


        };


        vm.init = function () {

            vm.getData()

        };

        vm.init();

    };

}());