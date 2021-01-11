/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var afterLoginEventsService = require('../services/afterLoginEventsService');
    var usersService = require('../services/usersService');
    var uiService = require('../services/uiService');

    var systemMessageService = require('../services/systemMessageService');
    var baseUrlService = require('../services/baseUrlService');
    var baseUrl = baseUrlService.resolve();

    module.exports = function ($scope, $state, $mdDialog) {

        var vm = this;

        vm.masters = [];
        vm.systemMessages = [];
        vm.currentMasterUser = null;
        vm.eventsProcessing = false;
        vm.dashboardsListReady = false;

        vm.getFileUrl = function(id) {

            return baseUrl + 'file-reports/file-report/' + id + '/view/';

        };

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

        vm.getSystemMessages = function () {

            // get latest
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

                    item.attachments = item.attachments.map(function (attachment) {

                        attachment.file_report_url = vm.getFileUrl(attachment.file_report);

                        return attachment

                    });

                    return item;

                });

                // newest at the bottom
                vm.systemMessages =  vm.systemMessages.reverse();

                vm.systemMessagesReady = true;

                $scope.$apply();

            })

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

            });

            vm.getSystemMessages();

        };

        vm.init();


    }

}());