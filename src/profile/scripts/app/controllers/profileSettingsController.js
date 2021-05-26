/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var timeZonesService = require('../services/timeZonesService');
    // var authorizerService = require('../services/authorizerService');

    module.exports = function ($scope, authorizerService) {

        var vm = this;

        vm.readyStatus = {user: false};

        vm.timeZones = timeZonesService.getList();

        authorizerService.getUserByKey(0).then(function (data) {

        	vm.user = data;
            vm.readyStatus.user = true;

            $scope.$apply();

        });

        vm.save = function () {
            authorizerService.update(0, vm.user).then(function () {
                $scope.$apply();
            })
        }
    }

}());