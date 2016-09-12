/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var transactionTypeGroupService = require('../../services/transaction/transactionTypeGroupService');

    module.exports = function($scope){

        console.log('{"controller": "DataTransactionTypeGroupController", status: "initialized"}');

        var vm = this;

        vm.readyStatus = {content: false};

        vm.entityType = 'transaction-type-group';
        vm.entityRaw = [];

        vm.entityViewer = {extraFeatures: []};

        transactionTypeGroupService.getList().then(function(data){
            vm.entityRaw = data.results;
            vm.readyStatus.content = true;
            $scope.$apply();
        });

        vm.getList = function(options){
            return transactionTypeGroupService.getList(options).then(function(data){
                return data.results;
            })
        }

    }

}());