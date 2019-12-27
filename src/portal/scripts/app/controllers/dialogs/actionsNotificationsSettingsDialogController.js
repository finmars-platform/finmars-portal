/**
 * Created by mevstratov on 27.02.2019.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var timeZonesService = require('../../services/timeZonesService');

    var usersService = require('../../services/usersService');

    module.exports = function ($scope, $mdDialog) {
        logService.controller('ActionsNotificationsSettingsDialogController', 'initialized');

        var vm = this;

        vm.readyStatus = {member: false};

        vm.timeZones = timeZonesService.getList();

        usersService.getOwnMemberSettings().then(function (data) {
            vm.member = data.results[0];
            vm.readyStatus.member = true;
            $scope.$apply();
        });

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.save = function () {
            usersService.updateOwnMemberSettings(vm.member.id, vm.member).then(function (response) {

                $mdDialog.hide({status: 'success'});

            }, function (error) {

                console.log('notifications error', error);
                $mdDialog.hide({status: error});

            });
        };
    }
}());