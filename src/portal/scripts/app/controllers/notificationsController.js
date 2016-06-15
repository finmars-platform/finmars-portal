/**
 * Created by szhitenev on 14.06.2016.
 */
(function(){

    'use strict';

    var logService = require('../services/logService');

    var notificationsService = require('../services/notificationsService');

    module.exports = function($scope){

        logService.controller('NotificationsController', 'initialized');

        var vm = this;

        notificationsService.getList().then(function(data){
            vm.notifications = data.results;
            $scope.$apply();
        })

    }

}());