/**
 * Created by szhitenev on 09.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var strategyGroupService = require('../../services/strategyGroupService');

    module.exports = function ($scope, $stateParams) {

        logService.controller('DataStrategyGroupController', 'initialized');

        console.log('$stateParams', $stateParams);

        var vm = this;

        vm.readyStatus = {entityRaw: false};

        vm.strategyNumber = $stateParams.strategyNumber;

        vm.entityType = 'strategy-' + vm.strategyNumber + '-group';
        vm.entityRaw = [];

        strategyGroupService.getList(vm.strategyNumber).then(function(data){
            vm.entityRaw = data.results;
            vm.readyStatus.entityRaw = true;
            console.log('vm.entityRaw', vm.entityRaw);
            $scope.$apply();
        });

        vm.getList = function(options){
            return strategyGroupService.getList(vm.strategyNumber, options).then(function(data){
                return data.results;
            })
        }

    }

}());