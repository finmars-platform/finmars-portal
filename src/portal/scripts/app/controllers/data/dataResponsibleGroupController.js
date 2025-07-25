/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var responsibleGroupService = require('../../services/responsibleGroupService');

    module.exports = function($scope){

        console.log('{"controller": "DataResponsibleGroupController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'responsible-group'; // deprecated
        vm.contentType = 'counterparties.responsiblegroup';

        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        // responsibleGroupService.getList().then(function(data){
        //     vm.entityRaw = data.results;
        //     vm.readyStatus.content = true;
        //     $scope.$apply();
        // });

        vm.getList = function(options){
            return responsibleGroupService.getList(options).then(function(data){
                return data;
            })
        };

        vm.init = function(){
            vm.readyStatus.content = true
        };

        vm.init()

    }

}());