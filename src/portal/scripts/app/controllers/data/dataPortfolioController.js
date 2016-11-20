/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var portfolioService = require('../../services/portfolioService');

    module.exports = function($scope){

        console.log('{"controller": "DataPortfolioController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'portfolio';
        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        portfolioService.getList().then(function(data){
            vm.entityRaw = data.results;
            vm.readyStatus.content = true;
            $scope.$apply();
        });

        vm.getList = function(options){
            return portfolioService.getList(options).then(function(data){
                return data;
            })
        }
    }

}());