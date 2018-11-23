/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var timeZonesService = require('../services/timeZonesService');

    var usersService = require('../services/usersService');

    module.exports = function ($scope) {

        var vm = this;

        vm.readyStatus = {user: false};

        vm.timeZones = timeZonesService.getList();

        usersService.getByKey(0).then(function (data) {
            vm.user = data;
            vm.readyStatus.user = true;
            $scope.$apply();
        });

        vm.save = function () {
            usersService.update(0, vm.user).then(function () {
                $scope.$apply();
            })
        }
    }

}());