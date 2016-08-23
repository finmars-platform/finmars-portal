/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var priceHistoryService = require('../../services/priceHistoryService');

    module.exports = function($scope){

        console.log('{"controller": "DataPriceHistoryController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'price-history';
        vm.entityRaw = [];

        vm.entityViewer = {extraFeatures: []};

        priceHistoryService.getList().then(function(data){
            vm.entityRaw = data.results;
            $scope.$apply();
        });

        vm.getList = function(options){
            return priceHistoryService.getList(options).then(function(data){
                return data.results;
            })
        }

    }

}());