/**
 * Created by szhitenev on 09.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var strategySubgroupService = require('../../services/strategySubgroupService');

    module.exports = function ($scope, $stateParams) {

        logService.controller('DataStrategySubGroupController', 'initialized');

        console.log('$stateParams', $stateParams);

        var vm = this;

        vm.readyStatus = {content: false};

        vm.strategyNumber = $stateParams.strategyNumber;

        vm.entityType = 'strategy-' + vm.strategyNumber + '-subgroup'; // deprecated
        vm.contentType = 'strategies.strategy' + vm.strategyNumber + 'subgroup';
        vm.entityRaw = [];

        vm.entityViewer = {extraFeatures: []};

        // strategySubgroupService.getList(vm.strategyNumber).then(function(data){
        //     vm.entityRaw = data.results;
        //     vm.readyStatus.content = true;
        //     console.log('vm.entityRaw', vm.entityRaw);
        //     $scope.$apply();
        // });

        vm.getList = function(options){
            return strategySubgroupService.getList(vm.strategyNumber, options).then(function(data){
                return data;
            })
        };

        vm.init = function(){
            vm.readyStatus.content = true
        };

        vm.init()

    }

}());