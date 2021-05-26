/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var timeZonesService = require('../../../services/timeZonesService');

    // var usersService = require('../../../services/usersService');

    module.exports = function ($scope, $mdDialog, usersService) {

        var vm = this;
		console.log("testing usersService injection", usersService);
        vm.readyStatus = {processing: false, finished: false};

        vm.timeZones = timeZonesService.getList();

        vm.save = function ($event) {
            vm.readyStatus.processing = true;
            vm.readyStatus.finished = false;
            usersService.changePassword(0, vm.data).then(function (data) {

                vm.readyStatus.processing = false;

                vm.data = {};
                vm.readyStatus.finished = true;
                $scope.$apply();

            }).catch(function (reason) {

                $mdDialog.show({
                    controller: 'ValidationDialogController as vm',
                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                    targetEvent: $event,
                    locals: {
                        validationData: reason
                    },
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true
                })

            })
        }
    }

}());