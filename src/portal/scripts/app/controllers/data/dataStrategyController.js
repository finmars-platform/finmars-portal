/**
 * Created by szhitenev on 09.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var strategyService = require('../../services/strategyService');

    module.exports = function ($scope, $stateParams) {

        logService.controller('DataStrategyController', 'initialized');

        console.log('$stateParams', $stateParams);

        var vm = this;

        vm.readyStatus = {content: false};

        vm.strategyNumber = $stateParams.strategyNumber;

        vm.entityType = 'strategy-' + vm.strategyNumber;
        vm.entityRaw = [];

        vm.entityViewer = {extraFeatures: []};

        strategyService.getList(vm.strategyNumber).then(function(data){
            vm.entityRaw = data.results;
            vm.readyStatus.content = true;
            $scope.$apply();
        });

        vm.getList = function(options){
            return strategyService.getList(vm.strategyNumber, options).then(function(data){
                return data;
            })
        }

    }

}());