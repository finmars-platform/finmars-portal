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

        responsibleService.getList().then(function(data){
            vm.entityRaw = data.results;
            $scope.$apply();
        })

    }

}());