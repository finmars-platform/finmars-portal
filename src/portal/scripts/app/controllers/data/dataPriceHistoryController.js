/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    module.exports = function($scope, priceHistoryService){

        console.log('{"controller": "DataPriceHistoryController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'price-history'; // deprecated
        vm.contentType = 'instruments.pricehistory';

        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        // priceHistoryService.getList().then(function(data){
        //     vm.entityRaw = data.results;
        //     vm.readyStatus.content = true;
        //     $scope.$apply();
        // });

        vm.getList = function(options){
            return priceHistoryService.getList(options).then(function(data){
                return data;
            })
        };

        vm.init = function(){
            vm.readyStatus.content = true
        };

        vm.init()

    }

}());