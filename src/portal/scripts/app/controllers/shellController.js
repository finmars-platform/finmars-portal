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
        //fetch('/api/v1/users/ping/').then(function (res) {
        //    console.log('res', res);
        //    console.log('after ping: ', cookiesService.getCookie('csrftoken'));
        //    setTimeout(function () {
        //        console.log('before login:', cookiesService.getCookie('csrftoken'));
        //        usersService.login('dev1', 'Uethohk0').then(function () {
        //            console.log('after login', cookiesService.getCookie('csrftoken'));
        //            $scope.$apply();
        //        })
        //    }, 1000)
        //});

        usersService.login('dev1', 'Uethohk0').then(function () {
            console.log('after login', cookiesService.getCookie('csrftoken'));
            $scope.$apply();
        });

        vm.currentState = function () {
            return '';
        }
    }

}());