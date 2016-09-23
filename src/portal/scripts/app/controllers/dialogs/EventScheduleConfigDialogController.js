/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaNotificationClassService = require('../../services/metaNotificationClassService');
    var instrumentEventScheduleConfigService = require('../../services/instrument/instrumentEventScheduleConfigService');


    module.exports = function ($scope, $mdDialog) {

        logService.controller('EventScheduleConfigDialogController', 'initialized');

        var vm = this;

        vm.readyStatus = {notificationClass: false, config: false};

        instrumentEventScheduleConfigService.getList().then(function (data) {
            vm.config = data.results[0];
            vm.readyStatus.config = true;
            $scope.$apply();
        });

        metaNotificationClassService.getList().then(function (data) {
            vm.notificationClasses = data;
            vm.readyStatus.notificationClass = true;
            $scope.$apply();
        });

        vm.checkReadyStatus = function () {
            if (vm.readyStatus.notificationClass == true && vm.readyStatus.config == true) {
                return true;
            }
            return false;
        };

        vm.agree = function ($event) {
            instrumentEventScheduleConfigService.update(vm.config.id, vm.config).then(function (data) {
                console.log('DATA', data);
                if (data.status == 200 || data.status == 201) {
                    $mdDialog.hide({res: 'agree'});
                }
                if (data.status == 400) {
                    $mdDialog.show({
                        controller: 'ValidationDialogController as vm',
                        templateUrl: 'views/dialogs/validation-dialog-view.html',
                        targetEvent: $event,
                        locals: {
                            validationData: data.response
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    })
                }
            })
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };


    };

}());