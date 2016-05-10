/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var usersService = require('../services/usersService');

    module.exports = function ($scope) {

        console.log('Shell controller initialized...');

        var vm = this;

        vm.logout = function () {
            console.log('Logged out');
            usersService.logout();
        };

        usersService.login('dev1', 'Uethohk0').then(function () {
            $scope.$apply();
        })
    }

}());