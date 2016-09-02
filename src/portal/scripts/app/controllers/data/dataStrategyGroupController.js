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

        vm.readyStatus = {content: false};

        vm.strategyNumber = $stateParams.strategyNumber;

        vm.entityType = 'strategy-' + vm.strategyNumber + '-group';
        vm.entityRaw = [];

        vm.entityViewer = {extraFeatures: []};

        strategyGroupService.getList(vm.strategyNumber).then(function(data){
            vm.entityRaw = data.results;
            vm.readyStatus.content = true;
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