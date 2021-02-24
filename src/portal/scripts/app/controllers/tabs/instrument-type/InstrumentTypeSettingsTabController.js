/**
 * Created by vzubr on 24.02.2021.
 */
(function () {
    'use strict';
    module.exports = function InstrumentTypeSettingsTabController($scope, $mdDialog) {

        var vm = this;
        console.log('#78 InstrumentTypeSettingsTabController')
        vm.entity = $scope.$parent.vm.entity;

    }
}())