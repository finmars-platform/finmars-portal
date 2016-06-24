/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../services/logService');
    var cookiesService = require('../services/cookieService');

    var usersService = require('../services/usersService');

    module.exports = function ($scope, $state) {

        logService.controller('ShellController', 'initialized');

        var vm = this;

        vm.logout = function () {
            console.log('Logged out');
            usersService.logout();
        };
        console.log('before ping: ', cookiesService.getCookie('csrftoken'));

        usersService.login('dev1', 'Uethohk0').then(function () {
            console.log('after login', cookiesService.getCookie('csrftoken'));
            $scope.$apply();
        });

        usersService.getList().then(function (data) {
            vm.user = data.results[0];
            $scope.$apply();
        });

        vm.currentState = function () {
            return '';
        }
    }

}());