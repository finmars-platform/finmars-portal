'use strict';

import logService from '../../../../../core/services/logService';
import strategyService from '../../services/strategyService';

export default function ($scope, $stateParams) {

    logService.controller('DataStrategyController', 'initialized');

    console.log('$stateParams', $stateParams);

    var vm = this;

    vm.readyStatus = {content: false};

    vm.strategyNumber = $stateParams.strategyNumber;

    vm.entityType = 'strategy-' + vm.strategyNumber; // deprecated
    vm.contentType = 'strategies.strategy' + vm.strategyNumber + 'group';

    vm.entityRaw = [];

    vm.entityViewer = {extraFeatures: []};

    // strategyService.getList(vm.strategyNumber).then(function(data){
    //     vm.entityRaw = data.results;
    //     vm.readyStatus.content = true;
    //     $scope.$apply();
    // });

    vm.getList = function(options){
        return strategyService.getList(vm.strategyNumber, options).then(function(data){
            return data;
        })
    };

    vm.init = function(){
        vm.readyStatus.content = true
    };

    vm.init()

};