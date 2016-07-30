/**
 * Created by sergey on 30.07.16.
 */
(function(){

    'use strict';

    var logService = require('../../../../core/services/logService');
    var threadService = require('../services/threadService');

    module.exports = function($scope, $stateParams) {

        logService.controller('ForumThreadListController', 'initialized');

        var vm = this;

        vm.threadPageCurrent = 1;
        vm.itemPerPage = 20;

        vm.threadGroupId = $stateParams.groupId;

        vm.readyStatus = {content: false};

        vm.getList = function(){
            threadService.getList().then(function(data){

                vm.threadMessagesTotal = data.count;
                vm.threads = data.results;
                vm.readyStatus.content = true;
                $scope.$apply();

            });
        };

        vm.getList();


    }

}());