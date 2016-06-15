/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../services/logService');

    var usersService = require('../services/usersService');

    module.exports = function ($scope, $state) {

        logService.controller('ShellController', 'initialized');

        var vm = this;

        vm.logout = function () {
            console.log('Logged out');
            usersService.logout();
        };

        usersService.login('dev1', 'Uethohk0').then(function () {
            $scope.$apply();
        })

        vm.currentState = function(){
            return '';
        }
    }

}());