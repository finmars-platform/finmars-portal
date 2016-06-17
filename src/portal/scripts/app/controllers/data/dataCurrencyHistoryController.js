/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var currencyHistoryService = require('../../services/currencyHistoryService');

    module.exports = function($scope){

        console.log('{"controller": "DataCurrencyHistoryController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'currency-history';
        vm.entityRaw = [];

        currencyHistoryService.getList().then(function(data){
            vm.entityRaw = data.results;
            $scope.$apply();
        })

    }

}());