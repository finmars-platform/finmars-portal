/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var instrumentService = require('../../services/instrumentService');

    module.exports = function($scope){

        console.log('{"controller": "DataInstrumentController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'instrument';
        vm.entityRaw = [];

        instrumentService.getList().then(function(data){
            vm.entityRaw = data.results;
            $scope.$apply();
        });

        vm.getList = function(options){
            return instrumentService.getList(options).then(function(data){
                return data.results;
            })
        }

    }

}());