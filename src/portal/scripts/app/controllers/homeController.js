/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var afterLoginEventsService = require('../services/afterLoginEventsService');
    var usersService = require('../services/usersService');
    var uiService = require('../services/uiService');

    module.exports = function ($scope, $state, $mdDialog) {

        var vm = this;

        vm.masters = [];
        vm.currentMasterUser = null;
        vm.eventsProcessing = false;
        vm.dashboardsListReady = false;

        vm.getMasterUsersList = function () {

            return usersService.getMasterListLight().then(function (data) {

                vm.masters = data.results;

                vm.currentMasterUser = vm.masters.filter(function (master) {
                    return master.is_current;
                })[0];

                $scope.$apply();

            });

        };

        var processEventsPromise = function () {
            return new Promise(function (resolve, reject) {

                usersService.getOwnMemberSettings().then(function (data) {

                    var info = JSON.parse(sessionStorage.getItem('afterLoginEvents'));

                    var member = data.results[0];

                    var showEventsDialogs = false;

                    if (!info) {
                        showEventsDialogs = true;
                    }

                    if (info && info.indexOf(vm.currentMasterUser.id) === -1) {
                        showEventsDialogs = true;
                    }

                    // 1 = Do not notify
                    // 3 = Email only notifications

                    if (member.notification_level === 1 || member.notification_level === 3) {
                        showEventsDialogs = false;
                    }

                    if (showEventsDialogs) {

                        vm.eventsProcessing = true;

                        afterLoginEventsService.getAndShowEvents($mdDialog).then(function (value) {

                            vm.eventsProcessing = false;
                            resolve();

                        }).catch(function () {
                            resolve();
                        });

                        if (info) {
                            info.push(vm.currentMasterUser.id);
                        } else {
                            info = [vm.currentMasterUser.id];
                        }

                        sessionStorage.setItem('afterLoginEvents', JSON.stringify(info));


                    } else {
                        vm.eventsProcessing = false;
                        resolve();
                    }

                });

            });

        };

        var getDashboardsList = function () {

            return new Promise(function (resolve, reject) {

                uiService.getDashboardLayoutList().then(function (data) {

                    vm.dashboardsList = data.results;
                    vm.dashboardsListReady = true;

                    resolve();

                });

            });

        };

        vm.init = function () {

            vm.getMasterUsersList().then(function () {

                var promises = [];

                promises.push(processEventsPromise());
                promises.push(getDashboardsList());

                Promise.all(promises).then(function () {
                    $scope.$apply();
                }).catch(function () {
                    $scope.$apply();
                });

            })

        };

        vm.init();


    }

}());