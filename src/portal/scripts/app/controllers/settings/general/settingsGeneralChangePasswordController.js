/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var logService = require('../../../../../../core/services/logService');

    var timeZonesService = require('../../../services/timeZonesService');

    var usersService = require('../../../services/usersService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('SettingsGeneralChangePassowrdController', 'initialized');

        var vm = this;

        vm.readyStatus = {processing: false, finished: false};

        vm.timeZones = timeZonesService.getList();

        vm.save = function ($event) {
            vm.readyStatus.processing = true;
            usersService.changePassword(0, vm.data).then(function (data) {
                vm.readyStatus.processing = false;
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
                } else {

                    vm.readyStatus.finished = true;
                    $scope.$apply();
                }
            })
        }
    }

}());