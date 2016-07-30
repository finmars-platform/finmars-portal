/**
 * Created by sergey on 30.07.16.
 */
(function(){

    'use strict';

    var logService = require('../../../../core/services/logService');
    var threadGroupService = require('../services/threadGroupService');

    module.exports = function($scope) {

        logService.controller('ForumThreadGroupListController', 'initialized');

        var vm = this;

        vm.readyStatus = {content: false};

        vm.getList = function(){
            threadGroupService.getList().then(function(data){

                vm.threadGroups = data.results;
                vm.readyStatus.content = true;
                $scope.$apply();

            });
        };

        vm.getList();


    }

}());