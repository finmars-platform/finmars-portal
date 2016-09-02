/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var responsibleService = require('../../services/responsibleService');

    module.exports = function($scope){

        console.log('{"controller": "DataResponsibleController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'responsible';
        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        responsibleService.getList().then(function(data){
            vm.entityRaw = data.results;
            vm.readyStatus.content = true;
            $scope.$apply();
        });

        vm.getList = function(options){
            return responsibleService.getList(options).then(function(data){
                return data.results;
            })
        }

    }

}());