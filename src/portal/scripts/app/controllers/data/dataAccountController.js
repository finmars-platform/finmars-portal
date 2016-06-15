/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var accountService = require('../../services/accountService');

    module.exports = function($scope){

        console.log('{"controller": "DataAccountController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'account';
        vm.entityRaw = [];

        accountService.getList().then(function(data){
            vm.entityRaw = data.results;
            console.log('vm.entityRaw', vm.entityRaw);
            $scope.$apply();
        })

    }

}());