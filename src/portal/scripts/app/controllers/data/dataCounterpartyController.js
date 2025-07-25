/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var counterpartyService = require('../../services/counterpartyService').default;

    module.exports = function($scope){

        console.log('{"controller": "DataCounterpartytController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'counterparty';
        vm.contentType = 'counterparties.counterparty';
        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        // counterpartyService.getList().then(function(data){
        //     vm.entityRaw = data.results;
        //     vm.readyStatus.content = true;
        //     $scope.$apply();
        // });

        vm.getList = function(options){
            return counterpartyService.getList(options).then(function(data){
                return data;
            })
        };

        vm.init = function(){
            vm.readyStatus.content = true
        };

        vm.init()

    }

}());