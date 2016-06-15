/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var transactionService = require('../../services/transactionService');

    module.exports = function($scope){

        console.log('{"controller": "DataTransactionController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'portfolio';
        vm.entityRaw = [];

        transactionService.getList().then(function(data){
            vm.entityRaw = data.results;
            $scope.$apply();
        })

    }

}());