import timeZonesService from '../../../services/timeZonesService';

// var usersService = require('../../../services/usersService');

export default function ($scope, usersService, globalDataService) {

    var vm = this;

    vm.readyStatus = {member: false};

    vm.timeZones = timeZonesService.getList();

    /* usersService.getOwnMemberSettings().then(function (data) {
        vm.member = data.results[0];
        vm.readyStatus.member = true;
        $scope.$apply();
    }); */
    vm.member = globalDataService.getMember();
    vm.readyStatus.member = true;

    vm.save = function () {
        usersService.updateOwnMemberSettings(vm.member.id, vm.member).then(function () {
            $scope.$apply();
        })
    }
};