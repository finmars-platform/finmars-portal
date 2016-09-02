/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var transactionTypeService = require('../../services/transactionTypeService');

    module.exports = function($scope){

        console.log('{"controller": "DataTransactionController", status: "initialized"}');

        var vm = this;

        vm.readyStatus = {content: false};

        vm.entityType = 'transaction-type';
        vm.entityRaw = [];

        vm.entityViewer = {extraFeatures: []};

        transactionTypeService.getList().then(function(data){
            vm.entityRaw = data.results;
            vm.readyStatus.content = true;
            $scope.$apply();
        });

        vm.getList = function(options){
            return transactionTypeService.getList(options).then(function(data){
                return data.results;
            })
        }

    }

}());