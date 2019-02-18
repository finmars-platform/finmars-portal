/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var afterLoginEventsService = require('../services/afterLoginEventsService');
    var usersService = require('../services/usersService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.masters = [];
        vm.currentMasterUser = null;

        vm.getMasterUsersList = function () {

            return usersService.getMasterList().then(function (data) {

                vm.masters = data.results;

                vm.currentMasterUser = vm.masters.filter(function (master) {
                    return master.is_current;
                })[0];

                $scope.$apply();

            });

        };

        vm.init = function () {

            vm.getMasterUsersList().then(function () {

                usersService.getOwnMemberSettings().then(function (data) {

                    var info = JSON.parse(sessionStorage.getItem('afterLoginEvents'));

                    console.log('info', info);
                    console.log('vm.currentMasterUser', vm.currentMasterUser);

                    var member = data.results[0];

                    var showEventsDialogs = false;

                    if (!info) {
                        showEventsDialogs = true;
                    }

                    if (info && info.indexOf(vm.currentMasterUser.id) === -1) {
                        showEventsDialogs = true;
                    }

                    if (member.notification_level === 1) { // 1 = DO NOT NOTIFY
                        showEventsDialogs = false;
                    }

                    if (showEventsDialogs) {

                        afterLoginEventsService.getAndShowEvents($mdDialog);

                        if (info) {
                            info.push(vm.currentMasterUser.id);
                        } else {
                            info = [vm.currentMasterUser.id];
                        }

                        sessionStorage.setItem('afterLoginEvents', JSON.stringify(info));


                    }

                });


            })

        };

        vm.init();


    }

}());